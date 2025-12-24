export const vertexShader = `
varying vec2 v_uv;
void main() {
    v_uv = uv;
    gl_Position = vec4(position, 1.0);
}`;

export const fragmentShader = `
precision highp float;

uniform sampler2D u_texture;
uniform vec2 u_mouse;
uniform float u_time;
uniform vec2 u_resolution;
uniform float u_radius;
uniform float u_speed;
uniform float u_imageAspect;
uniform float u_turbulenceIntensity;

varying vec2 v_uv;

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(
        mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
        mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
        u.y
    );
}

float turbulence(vec2 p) {
    float t = 0.0;
    float w = 0.5;
    for (int i = 0; i < 8; i++) {
        t -= abs(noise(p) * w);
        p *= 2.0;
        w *= 0.5;
    }
    return t;
}

void main() {
    vec2 uv = v_uv;
    float screenAspect = u_resolution.x / u_resolution.y;
    float ratio = u_imageAspect / screenAspect;

    vec2 textCoord = vec2(
        mix(0.5 - 0.5 / ratio, 0.5 + 0.5 / ratio, uv.x),
        uv.y
    );

    vec4 tex = texture2D(u_texture, textCoord);
    float gray = dot(tex.rgb, vec3(0.299, 0.587, 0.114));
    vec3 invertedGray = vec3(1.0 - gray);

    vec2 correctedUV = uv;
    correctedUV.x *= screenAspect;
    vec2 correctedMouse = u_mouse;
    correctedMouse.x *= screenAspect;

    float dist = distance(correctedUV, correctedMouse);

    float jaggedDist = dist + (turbulence(uv * 25.0 + u_time * u_speed) - 0.5) * u_turbulenceIntensity;

    float mask = step(jaggedDist, u_radius);
    vec3 finalColor = mix(invertedGray, tex.rgb, 1.0 - mask);

    gl_FragColor = vec4(finalColor, 1.0);
}`;