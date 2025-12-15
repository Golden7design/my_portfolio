"use client";

import React, { useEffect, useRef } from 'react';
import { vertexShader, fragmentShader } from './Shaders';
import * as THREE from 'three';

interface InversionLensProps {
  src: string;
  className?: string;
}

const InversionLens: React.FC<InversionLensProps> = ({ src, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const uniformsRef = useRef<{ [key: string]: THREE.IUniform } | null>(null);

  // Détection mobile
  const isMobile = useRef(false);

  const config = {
    maskRadius: 0.15,
    maxSpeed: 0.75,
    lerpFractor: 0.05,
    radiusSpeed: 0.1,
    turbulenceIntensity: 0.075,
  };

  const targetMouse = useRef(new THREE.Vector2(0.5, 0.5));
  const lerpedMouse = useRef(new THREE.Vector2(0.5, 0.5));
  const targetRadius = useRef(0.0);
  const isInView = useRef(false);
  const isPointerInside = useRef(false);
  const lastX = useRef(0);
  const lastY = useRef(0);
  const animationFrameId = useRef<number | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!containerRef.current || !src) return;

    // Détection mobile
    isMobile.current = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;

    const loader = new THREE.TextureLoader();
    let isMounted = true;

    const setupScene = (texture: THREE.Texture) => {
      if (!containerRef.current || !isMounted) return;

      if (
        texture.image &&
        texture.image instanceof HTMLImageElement
      ) {
        imageAspect = texture.image.width / texture.image.height;
      }


      texture.minFilter = THREE.LinearMipMapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.anisotropy = isMobile.current ? 4 : 16; // Réduit sur mobile

      const scene = new THREE.Scene();
      sceneRef.current = scene;

      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
      cameraRef.current = camera;

      const uniforms = {
        u_texture: { value: texture },
        u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
        u_time: { value: 0.0 },
        u_resolution: { value: new THREE.Vector2(width, height) },
        u_radius: { value: 0.0 },
        u_speed: { value: config.maxSpeed },
        u_imageAspect: { value: imageAspect },
        u_turbulenceIntensity: { value: isMobile.current ? 0.05 : config.turbulenceIntensity }, // Réduit sur mobile
      };
      uniformsRef.current = uniforms;

      const geometry = new THREE.PlaneGeometry(2, 2);
      const material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader,
        fragmentShader,
      });

      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      const renderer = new THREE.WebGLRenderer({ 
        antialias: !isMobile.current, // Désactivé sur mobile pour performance
        alpha: false,
        powerPreference: isMobile.current ? "low-power" : "high-performance"
      });
      rendererRef.current = renderer;

      // Pixel ratio limité sur mobile pour éviter les lags
      const pixelRatio = isMobile.current ? Math.min(window.devicePixelRatio, 2) : window.devicePixelRatio;
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(width, height);
      
      if (renderer.capabilities && 'anisotropy' in renderer.capabilities) {
        renderer.capabilities.anisotropy = isMobile.current ? 4 : 16;
      }

      containerRef.current.appendChild(renderer.domElement);
    };

    const updateCursorState = (x: number, y: number) => {
      if (!containerRef.current) return;

      lastX.current = x;
      lastY.current = y;

      const rect = containerRef.current.getBoundingClientRect();

      const inside = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
      isPointerInside.current = inside;

      if (inside) {
        targetMouse.current.x = (x - rect.left) / rect.width;
        targetMouse.current.y = 1.0 - (y - rect.top) / rect.height;
        targetRadius.current = config.maskRadius;
      } else {
        targetRadius.current = 0.0;
      }
    };

    // Events souris (desktop)
    const handleMouseMove = (e: MouseEvent) => {
      updateCursorState(e.clientX, e.clientY);
    };

    // Events tactiles (mobile)
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        updateCursorState(touch.clientX, touch.clientY);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault(); // Empêche le scroll pendant le drag
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        updateCursorState(touch.clientX, touch.clientY);
      }
    };

    const handleTouchEnd = () => {
      targetRadius.current = 0.0;
      isPointerInside.current = false;
    };

    const handleScroll = () => {
      updateCursorState(lastX.current, lastY.current);
    };

    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !uniformsRef.current) return;

      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      rendererRef.current.setSize(width, height);
      uniformsRef.current.u_resolution.value.set(width, height);
    };

    const setupEventListeners = () => {
      // Events souris
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('scroll', handleScroll);
      
      // Events tactiles
      if (containerRef.current) {
        containerRef.current.addEventListener('touchstart', handleTouchStart, { passive: false });
        containerRef.current.addEventListener('touchmove', handleTouchMove, { passive: false });
        containerRef.current.addEventListener('touchend', handleTouchEnd);
        containerRef.current.addEventListener('touchcancel', handleTouchEnd);
      }
      
      window.addEventListener('resize', handleResize);

      if (containerRef.current) {
        observerRef.current = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            isInView.current = entry.isIntersecting;
            if (!isInView.current) {
              targetRadius.current = 0.0;
            }
          });
        }, { threshold: 0.1 });

        observerRef.current.observe(containerRef.current);
      }
    };

    const animate = () => {
      if (!isMounted) return;

      if (
        !rendererRef.current ||
        !sceneRef.current ||
        !cameraRef.current ||
        !uniformsRef.current
      ) {
        animationFrameId.current = requestAnimationFrame(animate);
        return;
      }

      lerpedMouse.current.lerp(targetMouse.current, config.lerpFractor);

      uniformsRef.current.u_mouse.value.copy(lerpedMouse.current);
      uniformsRef.current.u_time.value += 0.01;
      uniformsRef.current.u_radius.value +=
        (targetRadius.current - uniformsRef.current.u_radius.value) * config.radiusSpeed;

      rendererRef.current.render(sceneRef.current, cameraRef.current);

      animationFrameId.current = requestAnimationFrame(animate);
    };

    loader.load(
      src,
      (texture) => {
        if (!isMounted) return;
        setupScene(texture);
        setupEventListeners();
        animate();
      },
      undefined,
      (error) => {
        console.error('Error loading texture:', error);
      }
    );

    return () => {
      isMounted = false;

      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }

      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('scroll', handleScroll);
      
      if (containerRef.current) {
        containerRef.current.removeEventListener('touchstart', handleTouchStart);
        containerRef.current.removeEventListener('touchmove', handleTouchMove);
        containerRef.current.removeEventListener('touchend', handleTouchEnd);
        containerRef.current.removeEventListener('touchcancel', handleTouchEnd);
      }
      
      window.removeEventListener('resize', handleResize);

      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (containerRef.current) {
          const canvas = containerRef.current.querySelector('canvas');
          if (canvas && canvas.parentNode === containerRef.current) {
            containerRef.current.removeChild(canvas);
          }
        }
      }

      if (sceneRef.current) {
        sceneRef.current.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry?.dispose();
            if (object.material instanceof THREE.Material) {
              object.material.dispose();
            }
          }
        });
      }
    };
  }, [src]);

  return (
    <div>
      <div 
        ref={containerRef} 
        className={`inversion-lens ${className || ''}`}
        style={{ touchAction: 'none' }} // Empêche les gestes par défaut du navigateur
      >
        <img src={src} style={{ display: 'none' }} alt="" />
      </div>
    </div>
  );
};

export default InversionLens;