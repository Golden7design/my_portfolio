import { useEffect, useRef, useState } from 'react';

// les shaders
const vertexShaderSource = `
precision highp float;
uniform vec2 u_resolution;
uniform float u_pointSize;
attribute vec2 a_position;
attribute vec4 a_color;
varying vec4 v_color;
void main() {
    vec2 zeroToOne = a_position / u_resolution;
    vec2 clipSpace = (zeroToOne * 2.0 - 1.0);
    v_color = a_color;
    gl_Position = vec4(clipSpace * vec2(1.0, -1.0), 0.0, 1.0);
    gl_PointSize = u_pointSize;
}
`;

const fragmentShaderSource = `
precision highp float; 
varying vec4 v_color;
void main () {
    if (v_color.a < 0.01) discard;
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
    gl_FragColor = vec4(v_color.rgb, v_color.a * alpha);
}
`;

// CONFIG 
const config = {
    logoPath: "/nash_white.svg",
    logoSize: 530,
    logoColor: "#808080",
    canvasBg: "#f8f8f8",
    distortionRadius: 4000,
    forceStrength: 0.0035,
    maxDisplacement: 100,
    returnForce: 0.025,
    pointSize: 3.5,
    logoOffsetX: 310,
};

// TYPES
interface Particle {
    originalX: number;
    originalY: number;
    velocityX: number;
    velocityY: number;
}

//UTILS
function hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
              r: parseInt(result[1], 16) / 255,
              g: parseInt(result[2], 16) / 255,
              b: parseInt(result[3], 16) / 255,
          }
        : { r: 1, g: 1, b: 1 };
}

//  COMPOSANT 
export default function ParticlesCanvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDesktop, setIsDesktop] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    
    const stateRef = useRef({
        gl: null as WebGLRenderingContext | null,
        program: null as WebGLProgram | null,
        particles: [] as Particle[],
        positionArray: new Float32Array(),
        colorArray: new Float32Array(),
        positionBuffer: null as WebGLBuffer | null,
        colorBuffer: null as WebGLBuffer | null,
        mouse: { x: 0, y: 0 },
        animationCount: 0,
        animationFrameId: 0,
        isAnimating: false,
    });

    // Détection desktop
    useEffect(() => {
        const checkDesktop = () => window.innerWidth >= 1000;
        setIsDesktop(checkDesktop());
        
        const handleResize = () => {
            setIsDesktop(checkDesktop());
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    //  WEBGL
    const compileShader = (gl: WebGLRenderingContext, type: number, source: string): WebGLShader => {
        const shader = gl.createShader(type)!;
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error("Shader compile error:", gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            throw new Error("Shader compilation failed");
        }
        return shader;
    };

    const setupShaders = (gl: WebGLRenderingContext): WebGLProgram => {
        const vs = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fs = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
        const program = gl.createProgram()!;
        gl.attachShader(program, vs);
        gl.attachShader(program, fs);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error("Program link error:", gl.getProgramInfoLog(program));
            throw new Error("Program linking failed");
        }
        return program;
    };

    //  logique principale 
    useEffect(() => {
        if (!isDesktop) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const state = stateRef.current;

        // on Setup canvas size
        const dpr = window.devicePixelRatio || 1;
        const resizeCanvas = () => {
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = window.innerWidth + "px";
            canvas.style.height = window.innerHeight + "px";
        };
        resizeCanvas();

        // on Setup WebGL
        const gl = canvas.getContext("webgl", {
            alpha: false,
            depth: false,
            stencil: false,
            antialias: false,
            powerPreference: "high-performance",
            premultipliedAlpha: false,
        });
        if (!gl) throw new Error("WebGL not supported");
        
        const bgColor = hexToRgb(config.canvasBg);
        gl.clearColor(bgColor.r, bgColor.g, bgColor.b, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
        
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        const program = setupShaders(gl);
        state.gl = gl;
        state.program = program;

        // evenement avec la souris
        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            state.mouse.x = (e.clientX - rect.left) * dpr;
            state.mouse.y = (e.clientY - rect.top) * dpr;
            state.animationCount = 300;
        };
        window.addEventListener("mousemove", handleMouseMove);

        // Resize 
        const handleResize = () => {
            resizeCanvas();
            if (state.particles.length > 0) {
                const centerX = canvas.width / 2;
                const centerY = canvas.height / 2;
                const dim = Math.sqrt(state.particles.length);
                for (let i = 0; i < state.particles.length; i++) {
                    const row = Math.floor(i / dim);
                    const col = i % dim;
                    const repositionX = centerX + (col - dim / 2) * 1.0;
                    const repositionY = centerY + (row - dim / 2) * 1.0;
                    state.particles[i].originalX = repositionX;
                    state.particles[i].originalY = repositionY;
                    state.positionArray[i * 2] = repositionX;
                    state.positionArray[i * 2 + 1] = repositionY;
                }
                gl.bindBuffer(gl.ARRAY_BUFFER, state.positionBuffer);
                gl.bufferSubData(gl.ARRAY_BUFFER, 0, state.positionArray);
            }
        };
        window.addEventListener("resize", handleResize);

        //  animation Loop
        const animate = () => {
            const { gl, program, particles, positionArray, positionBuffer, mouse, animationCount } = state;
            if (!gl || !program || particles.length === 0 || !state.isAnimating) return;

            if (animationCount > 0) {
                state.animationCount--;
                const radiusSquared = config.distortionRadius ** 2;

                for (let i = 0; i < particles.length; i++) {
                    const p = particles[i];
                    const currentX = positionArray[i * 2];
                    const currentY = positionArray[i * 2 + 1];

                    const dx = mouse.x - currentX;
                    const dy = mouse.y - currentY;
                    const distSq = dx * dx + dy * dy;

                    if (distSq < radiusSquared && distSq > 0) {
                        const force = -radiusSquared / distSq;
                        const angle = Math.atan2(dy, dx);
                        const distFromOrigin = Math.sqrt(
                            (currentX - p.originalX) ** 2 + (currentY - p.originalY) ** 2
                        );
                        const forceMultiplier = Math.max(0.1, -distFromOrigin / (config.maxDisplacement * 2));

                        p.velocityX += force * Math.cos(angle) * config.forceStrength * forceMultiplier;
                        p.velocityY += force * Math.sin(angle) * config.forceStrength * forceMultiplier;
                    }

                    p.velocityX *= 0.82;
                    p.velocityY *= 0.82;

                    const targetX = currentX + p.velocityX + (p.originalX - currentX) * config.returnForce;
                    const targetY = currentY + p.velocityY + (p.originalY - currentY) * config.returnForce;

                    const offX = targetX - p.originalX;
                    const offY = targetY - p.originalY;
                    const dist = Math.sqrt(offX * offX + offY * offY);

                    if (dist > config.maxDisplacement) {
                        const excess = dist - config.maxDisplacement;
                        const scale = config.maxDisplacement / dist;
                        const dampedScale = scale * (1 - scale) * Math.exp(-excess * 0.02);
                        positionArray[i * 2] = p.originalX + offX * dampedScale;
                        positionArray[i * 2 + 1] = p.originalY + offY * dampedScale;
                        p.velocityX *= 0.7;
                        p.velocityY *= 0.7;
                    } else {
                        positionArray[i * 2] = targetX;
                        positionArray[i * 2 + 1] = targetY;
                    }
                }

                gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
                gl.bufferSubData(gl.ARRAY_BUFFER, 0, positionArray);
            }

            const bgColor = hexToRgb(config.canvasBg);
            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.clearColor(bgColor.r, bgColor.g, bgColor.b, 1.0);
            gl.clear(gl.COLOR_BUFFER_BIT);

            gl.useProgram(program);
            
            const resLoc = gl.getUniformLocation(program, "u_resolution");
            gl.uniform2f(resLoc!, canvas.width, canvas.height);
            
            const pointSizeLoc = gl.getUniformLocation(program, "u_pointSize");
            gl.uniform1f(pointSizeLoc!, config.pointSize);

            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            const posLoc = gl.getAttribLocation(program, "a_position");
            gl.enableVertexAttribArray(posLoc);
            gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, state.colorBuffer);
            const colLoc = gl.getAttribLocation(program, "a_color");
            gl.enableVertexAttribArray(colLoc);
            gl.vertexAttribPointer(colLoc, 4, gl.FLOAT, false, 0, 0);

            gl.drawArrays(gl.POINTS, 0, particles.length);

            state.animationFrameId = requestAnimationFrame(animate);
        };

        //  chargement de mon Logo 
        const image = new Image();
        image.onload = () => {
            const tempCanvas = document.createElement("canvas");
            const ctx = tempCanvas.getContext("2d")!;
            tempCanvas.width = config.logoSize;
            tempCanvas.height = config.logoSize;

            const scale = 0.9;
            const size = config.logoSize * scale;
            const offset = (config.logoSize - size) / 2;
            const logoOffsetY = -50 * dpr;
            ctx.drawImage(image, offset, offset, size, size);

            const imageData = ctx.getImageData(0, 0, config.logoSize, config.logoSize);
            const data = imageData.data;
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2 + logoOffsetY;
            const positions: number[] = [];
            const colors: number[] = [];
            const logoTint = hexToRgb(config.logoColor);

            for (let i = 0; i < config.logoSize; i++) {
    for (let j = 0; j < config.logoSize; j++) {
        const pixelIndex = (i * config.logoSize + j) * 4;
        const alpha = data[pixelIndex + 3];
        if (alpha > 10) {
            const particleX = centerX + (j - config.logoSize / 2) * scale;
            const particleY = centerY + (i - config.logoSize / 2) * scale;
            positions.push(particleX, particleY);

            const originalA = data[pixelIndex + 3] / 255;
            colors.push(logoTint.r, logoTint.g, logoTint.b, originalA);

            state.particles.push({
                originalX: particleX,
                originalY: particleY,
                velocityX: 0,
                velocityY: 0,
            });
        }
    }
}


            state.positionArray = new Float32Array(positions);
            state.colorArray = new Float32Array(colors);

            state.positionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, state.positionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, state.positionArray, gl.DYNAMIC_DRAW);

            state.colorBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, state.colorBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, state.colorArray, gl.STATIC_DRAW);

            //  Marquer comme chargé et démarrer l'animation
            setIsLoaded(true);
            state.isAnimating = true;
            animate();
        };
        
        image.src = config.logoPath;
        image.onerror = () => console.error("Logo non chargé :", config.logoPath);

        return () => {
            state.isAnimating = false;
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("resize", handleResize);
            if (state.animationFrameId) {
                cancelAnimationFrame(state.animationFrameId);
            }
        };
    }, [isDesktop]);

    if (!isDesktop) {
        return null;
    }

    return (
        <canvas 
            ref={canvasRef} 
            style={{ 
                width: '100vw', 
                height: '100vh', 
                display: 'block',
                opacity: isLoaded ? 1 : 0,
                transition: 'opacity 0.3s ease',
            }} 
        />
    );
}