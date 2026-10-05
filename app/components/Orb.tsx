"use client";

import { Mesh, Program, Renderer, Triangle, Vec3 } from "ogl";
import { useEffect, useRef } from "react";

export type OrbProps = {
  hue?: number;
  hoverIntensity?: number;
  rotateOnHover?: boolean;
  forceHoverState?: boolean;
  backgroundColor?: string;
  /** Warm / amber ring tone (hex) */
  color1?: string;
  /** Cool / cyan ring tone (hex) */
  color2?: string;
  /** Deep core tone (hex) */
  color3?: string;
  className?: string;
};

export const DEFAULT_ORB_COLORS = {
  color1: "#ebcca8",
  color2: "#addcef",
  color3: "#6b7590",
  hue: 0,
} as const;

/** Cap DPR for fill-rate — soft glow doesn’t need full retina */
const MAX_DPR = 1.25;
const MAX_DPR_TOUCH = 1;

function hslToRgb(h: number, s: number, l: number) {
  let r: number;
  let g: number;
  let b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      let tt = t;
      if (tt < 0) tt += 1;
      if (tt > 1) tt -= 1;
      if (tt < 1 / 6) return p + (q - p) * 6 * tt;
      if (tt < 1 / 2) return q;
      if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return new Vec3(r, g, b);
}

function hexToVec3(color: string) {
  if (color.startsWith("#")) {
    const r = parseInt(color.slice(1, 3), 16) / 255;
    const g = parseInt(color.slice(3, 5), 16) / 255;
    const b = parseInt(color.slice(5, 7), 16) / 255;
    return new Vec3(r, g, b);
  }

  const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgbMatch) {
    return new Vec3(
      parseInt(rgbMatch[1], 10) / 255,
      parseInt(rgbMatch[2], 10) / 255,
      parseInt(rgbMatch[3], 10) / 255,
    );
  }

  const hslMatch = color.match(/hsla?\((\d+),\s*(\d+)%,\s*(\d+)%/);
  if (hslMatch) {
    return hslToRgb(
      parseInt(hslMatch[1], 10) / 360,
      parseInt(hslMatch[2], 10) / 100,
      parseInt(hslMatch[3], 10) / 100,
    );
  }

  return new Vec3(0, 0, 0);
}

/**
 * React Bits Orb — OGL shader glow.
 * Props update via refs (no WebGL remount). Pauses when tab is hidden.
 */
export default function Orb({
  hue = 0,
  hoverIntensity = 0.2,
  rotateOnHover = true,
  forceHoverState = false,
  backgroundColor = "#000000",
  color1 = DEFAULT_ORB_COLORS.color1,
  color2 = DEFAULT_ORB_COLORS.color2,
  color3 = DEFAULT_ORB_COLORS.color3,
  className = "h-full w-full",
}: OrbProps) {
  const ctnDom = useRef<HTMLDivElement>(null);
  const propsRef = useRef({
    hue,
    hoverIntensity,
    rotateOnHover,
    forceHoverState,
    backgroundColor,
    color1,
    color2,
    color3,
  });
  propsRef.current = {
    hue,
    hoverIntensity,
    rotateOnHover,
    forceHoverState,
    backgroundColor,
    color1,
    color2,
    color3,
  };

  const vert = /* glsl */ `
    precision highp float;
    attribute vec2 position;
    attribute vec2 uv;
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 0.0, 1.0);
    }
  `;

  const frag = /* glsl */ `
    precision highp float;

    uniform float iTime;
    uniform vec3 iResolution;
    uniform float hue;
    uniform float hover;
    uniform float rot;
    uniform float hoverIntensity;
    uniform vec3 backgroundColor;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    uniform vec3 uColor3;
    varying vec2 vUv;

    vec3 rgb2yiq(vec3 c) {
      float y = dot(c, vec3(0.299, 0.587, 0.114));
      float i = dot(c, vec3(0.596, -0.274, -0.322));
      float q = dot(c, vec3(0.211, -0.523, 0.312));
      return vec3(y, i, q);
    }

    vec3 yiq2rgb(vec3 c) {
      float r = c.x + 0.956 * c.y + 0.621 * c.z;
      float g = c.x - 0.272 * c.y - 0.647 * c.z;
      float b = c.x - 1.106 * c.y + 1.703 * c.z;
      return vec3(r, g, b);
    }

    vec3 adjustHue(vec3 color, float hueDeg) {
      float hueRad = hueDeg * 3.14159265 / 180.0;
      vec3 yiq = rgb2yiq(color);
      float cosA = cos(hueRad);
      float sinA = sin(hueRad);
      float i = yiq.y * cosA - yiq.z * sinA;
      float q = yiq.y * sinA + yiq.z * cosA;
      yiq.y = i;
      yiq.z = q;
      return yiq2rgb(yiq);
    }

    vec3 hash33(vec3 p3) {
      p3 = fract(p3 * vec3(0.1031, 0.11369, 0.13787));
      p3 += dot(p3, p3.yxz + 19.19);
      return -1.0 + 2.0 * fract(vec3(
        p3.x + p3.y,
        p3.x + p3.z,
        p3.y + p3.z
      ) * p3.zyx);
    }

    float snoise3(vec3 p) {
      const float K1 = 0.333333333;
      const float K2 = 0.166666667;
      vec3 i = floor(p + (p.x + p.y + p.z) * K1);
      vec3 d0 = p - (i - (i.x + i.y + i.z) * K2);
      vec3 e = step(vec3(0.0), d0 - d0.yzx);
      vec3 i1 = e * (1.0 - e.zxy);
      vec3 i2 = 1.0 - e.zxy * (1.0 - e);
      vec3 d1 = d0 - (i1 - K2);
      vec3 d2 = d0 - (i2 - K1);
      vec3 d3 = d0 - 0.5;
      vec4 h = max(0.6 - vec4(
        dot(d0, d0),
        dot(d1, d1),
        dot(d2, d2),
        dot(d3, d3)
      ), 0.0);
      vec4 n = h * h * h * h * vec4(
        dot(d0, hash33(i)),
        dot(d1, hash33(i + i1)),
        dot(d2, hash33(i + i2)),
        dot(d3, hash33(i + 1.0))
      );
      return dot(vec4(31.316), n);
    }

    vec4 extractAlpha(vec3 colorIn) {
      float a = max(max(colorIn.r, colorIn.g), colorIn.b);
      return vec4(colorIn.rgb / (a + 1e-5), a);
    }

    const float innerRadius = 0.6;
    const float noiseScale = 0.65;

    float light1(float intensity, float attenuation, float dist) {
      return intensity / (1.0 + dist * attenuation);
    }

    float light2(float intensity, float attenuation, float dist) {
      return intensity / (1.0 + dist * dist * attenuation);
    }

    vec4 draw(vec2 uv) {
      vec3 color1 = adjustHue(uColor1, hue);
      vec3 color2 = adjustHue(uColor2, hue);
      vec3 color3 = adjustHue(uColor3, hue);

      float ang = atan(uv.y, uv.x);
      float len = length(uv);
      float invLen = len > 0.0 ? 1.0 / len : 0.0;

      float bgLuminance = dot(backgroundColor, vec3(0.299, 0.587, 0.114));

      float n0 = snoise3(vec3(uv * noiseScale, iTime * 0.5)) * 0.5 + 0.5;
      float r0 = mix(mix(innerRadius, 1.0, 0.4), mix(innerRadius, 1.0, 0.6), n0);
      float d0 = distance(uv, (r0 * invLen) * uv);
      float v0 = light1(1.0, 10.0, d0);

      v0 *= smoothstep(r0 * 1.05, r0, len);
      float innerFade = smoothstep(r0 * 0.8, r0 * 0.95, len);
      // Dark: slight fill · Light: thin ring only (no muddy fill)
      v0 *= mix(mix(innerFade, 1.0, 0.2), innerFade, bgLuminance);
      float cl = cos(ang + iTime * 2.0) * 0.5 + 0.5;

      float a = iTime * -1.0;
      vec2 pos = vec2(cos(a), sin(a)) * r0;
      float d = distance(uv, pos);
      float v1 = light2(1.15, 5.0, d);
      v1 *= light1(1.0, 50.0, d0);
      // Much softer bloom on light backgrounds
      v1 *= mix(0.85, 0.16, bgLuminance);

      float v2 = smoothstep(1.0, mix(innerRadius, 1.0, n0 * 0.5), len);
      float v3 = smoothstep(innerRadius, mix(innerRadius, 1.0, 0.5), len);

      vec3 colBase = mix(color1, color2, cl);
      // Desaturate slightly toward white for a cleaner look
      colBase = mix(colBase, vec3(0.96, 0.96, 0.97), 0.22);
      float fadeAmount = mix(1.0, 0.08, bgLuminance);

      vec3 darkCol = mix(color3, colBase, v0);
      darkCol = (darkCol + v1) * v2 * v3;
      darkCol = clamp(darkCol, 0.0, 1.0);

      vec3 lightCol = (colBase + v1) * mix(1.0, v2 * v3, fadeAmount);
      float lightAlpha = mix(0.88, 0.55, bgLuminance);
      lightCol = mix(backgroundColor, lightCol, v0 * lightAlpha);
      lightCol = clamp(lightCol, 0.0, 1.0);

      vec3 finalCol = mix(darkCol, lightCol, bgLuminance);

      float bgMax = max(max(backgroundColor.r, backgroundColor.g), backgroundColor.b);
      float colMax = max(max(finalCol.r, finalCol.g), finalCol.b);
      float ring = clamp(v0 + v1 * 0.3, 0.0, 1.0) * v2 * v3;

      // Dark: classic extractAlpha. Light: ONLY pixels brighter than the page bg
      // (stops the gray filled disc that reads as a “shadow” behind the orb)
      float aDark = colMax;
      float aLight = max(0.0, colMax - bgMax) * 2.2 * ring;
      float alpha = mix(aDark, aLight, smoothstep(0.35, 0.7, bgLuminance));
      alpha = clamp(alpha, 0.0, 1.0);

      vec3 rgb = finalCol / (colMax + 1e-5);
      return vec4(rgb, alpha);
    }

    vec4 mainImage(vec2 fragCoord) {
      vec2 center = iResolution.xy * 0.5;
      float size = min(iResolution.x, iResolution.y);
      vec2 uv = (fragCoord - center) / size * 2.0;

      float angle = rot;
      float s = sin(angle);
      float c = cos(angle);
      uv = vec2(c * uv.x - s * uv.y, s * uv.x + c * uv.y);

      uv.x += hover * hoverIntensity * 0.1 * sin(uv.y * 10.0 + iTime);
      uv.y += hover * hoverIntensity * 0.1 * sin(uv.x * 10.0 + iTime);

      return draw(uv);
    }

    void main() {
      vec2 fragCoord = vUv * iResolution.xy;
      vec4 col = mainImage(fragCoord);
      gl_FragColor = vec4(col.rgb * col.a, col.a);
    }
  `;

  useEffect(() => {
    const container = ctnDom.current;
    if (!container) return;

    const renderer = new Renderer({
      alpha: true,
      premultipliedAlpha: false,
      dpr: 1,
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.canvas.style.display = "block";
    container.appendChild(gl.canvas);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: vert,
      fragment: frag,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        iTime: { value: 0 },
        iResolution: {
          value: new Vec3(
            gl.canvas.width,
            gl.canvas.height,
            gl.canvas.width / gl.canvas.height,
          ),
        },
        hue: { value: propsRef.current.hue },
        hover: { value: 0 },
        rot: { value: 0 },
        hoverIntensity: { value: propsRef.current.hoverIntensity },
        backgroundColor: {
          value: hexToVec3(propsRef.current.backgroundColor),
        },
        uColor1: { value: hexToVec3(propsRef.current.color1) },
        uColor2: { value: hexToVec3(propsRef.current.color2) },
        uColor3: { value: hexToVec3(propsRef.current.color3) },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    function resize() {
      if (!container) return;
      const touch = window.matchMedia("(pointer: coarse)").matches;
      const dpr = Math.min(
        window.devicePixelRatio || 1,
        touch ? MAX_DPR_TOUCH : MAX_DPR,
      );
      const width = container.clientWidth;
      const height = container.clientHeight;
      if (width <= 0 || height <= 0) return;
      renderer.dpr = dpr;
      renderer.setSize(width, height);
      program.uniforms.iResolution.value.set(
        gl.canvas.width,
        gl.canvas.height,
        gl.canvas.width / gl.canvas.height,
      );
    }

    const ro = new ResizeObserver(resize);
    ro.observe(container);
    resize();

    let targetHover = 0;
    let lastTime = 0;
    let currentRot = 0;
    const rotationSpeed = 0.3;
    let rafId = 0;
    let running = true;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const width = rect.width;
      const height = rect.height;
      const size = Math.min(width, height);
      const centerX = width / 2;
      const centerY = height / 2;
      const uvX = ((x - centerX) / size) * 2.0;
      const uvY = ((y - centerY) / size) * 2.0;

      targetHover = Math.sqrt(uvX * uvX + uvY * uvY) < 0.8 ? 1 : 0;
    };

    const handleMouseLeave = () => {
      targetHover = 0;
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    const onVisibility = () => {
      running = !document.hidden;
      if (running && !rafId) {
        lastTime = performance.now();
        rafId = requestAnimationFrame(update);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    const update = (t: number) => {
      if (!running) {
        rafId = 0;
        return;
      }
      rafId = requestAnimationFrame(update);

      const dt = (t - lastTime) * 0.001;
      lastTime = t;
      const p = propsRef.current;

      program.uniforms.iTime.value = t * 0.001;
      program.uniforms.hue.value = p.hue;
      program.uniforms.hoverIntensity.value = p.hoverIntensity;
      program.uniforms.backgroundColor.value = hexToVec3(p.backgroundColor);
      program.uniforms.uColor1.value = hexToVec3(p.color1);
      program.uniforms.uColor2.value = hexToVec3(p.color2);
      program.uniforms.uColor3.value = hexToVec3(p.color3);

      const effectiveHover = p.forceHoverState ? 1 : targetHover;
      program.uniforms.hover.value +=
        (effectiveHover - program.uniforms.hover.value) * 0.1;

      if (p.rotateOnHover && effectiveHover > 0.5) {
        currentRot += dt * rotationSpeed;
      }
      program.uniforms.rot.value = currentRot;

      renderer.render({ scene: mesh });
    };
    rafId = requestAnimationFrame(update);

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      if (gl.canvas.parentNode === container) {
        container.removeChild(gl.canvas);
      }
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
    // Mount once — props flow through propsRef
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={ctnDom} className={className} />;
}
