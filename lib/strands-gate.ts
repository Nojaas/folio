type NetworkInformation = {
  saveData?: boolean;
  effectiveType?: string;
};

type DebugRendererInfo = {
  UNMASKED_RENDERER_WEBGL: number;
  UNMASKED_VENDOR_WEBGL: number;
};

const SOFT_GL_RE =
  /swiftshader|llvmpipe|softpipe|software|microsoft basic render|apple software/i;
/** Skip if creating a WebGL context takes longer than this (ms). */
const SLOW_GL_MS = 50;

let cachedProbeSkip: boolean | null = null;

/**
 * Opt-out for A/B measures — off by default.
 * - `?strands=off` | `0` | `false`
 * - `NEXT_PUBLIC_STRANDS=0` | `off`
 */
export function isStrandsKillSwitch(): boolean {
  if (
    process.env.NEXT_PUBLIC_STRANDS === "0" ||
    process.env.NEXT_PUBLIC_STRANDS === "off"
  ) {
    return true;
  }
  if (typeof window === "undefined") return false;
  try {
    const q = new URLSearchParams(window.location.search).get("strands");
    return q === "0" || q === "off" || q === "false";
  } catch {
    return false;
  }
}

/**
 * One-shot probe: software GL (SwiftShader etc.), missing GL, or slow context.
 * Result is cached for the page lifetime.
 */
function probeBadWebGL(): boolean {
  if (cachedProbeSkip != null) return cachedProbeSkip;

  try {
    const canvas = document.createElement("canvas");
    const t0 = performance.now();
    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
    }) as WebGLRenderingContext | null;
    const dt = performance.now() - t0;

    if (!gl) {
      cachedProbeSkip = true;
      return true;
    }

    if (dt > SLOW_GL_MS) {
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      cachedProbeSkip = true;
      return true;
    }

    const ext = gl.getExtension(
      "WEBGL_debug_renderer_info",
    ) as DebugRendererInfo | null;
    if (ext) {
      const renderer = String(
        gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) ?? "",
      );
      const vendor = String(gl.getParameter(ext.UNMASKED_VENDOR_WEBGL) ?? "");
      if (SOFT_GL_RE.test(`${vendor} ${renderer}`)) {
        gl.getExtension("WEBGL_lose_context")?.loseContext();
        cachedProbeSkip = true;
        return true;
      }
    }

    gl.getExtension("WEBGL_lose_context")?.loseContext();
    cachedProbeSkip = false;
    return false;
  } catch {
    cachedProbeSkip = true;
    return true;
  }
}

/** Hard skip — never mount WebGL Strands. */
export function shouldSkipStrands(): boolean {
  if (typeof window === "undefined") return true;

  if (isStrandsKillSwitch()) return true;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return true;
  }

  if (typeof navigator !== "undefined" && navigator.webdriver) {
    return true;
  }

  const connection = (
    navigator as Navigator & { connection?: NetworkInformation }
  ).connection;
  if (connection?.saveData) return true;
  if (
    connection?.effectiveType === "slow-2g" ||
    connection?.effectiveType === "2g"
  ) {
    return true;
  }

  const cores = navigator.hardwareConcurrency ?? 8;
  const memory = (navigator as Navigator & { deviceMemory?: number })
    .deviceMemory;
  // Weak devices: few cores and low/unknown memory.
  if (cores <= 4 && (memory === undefined || memory <= 4)) return true;

  if (probeBadWebGL()) return true;

  return false;
}

/**
 * After LCP (or timeout), run `fn` on idle.
 * Returns a cleanup that cancels pending work.
 */
export function runAfterLcpIdle(
  fn: () => void,
  opts?: { lcpTimeoutMs?: number; idleTimeoutMs?: number },
): () => void {
  const lcpTimeoutMs = opts?.lcpTimeoutMs ?? 4000;
  const idleTimeoutMs = opts?.idleTimeoutMs ?? 2500;
  let cancelled = false;
  let done = false;
  let idleId: number | null = null;
  let timeoutId: number | null = null;
  let fallbackId: number | null = null;
  let observer: PerformanceObserver | null = null;

  const scheduleIdle = () => {
    if (cancelled || done) return;
    done = true;
    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(
        () => {
          if (!cancelled) fn();
        },
        { timeout: idleTimeoutMs },
      );
      return;
    }
    timeoutId = window.setTimeout(() => {
      if (!cancelled) fn();
    }, 1);
  };

  const onLcp = () => {
    observer?.disconnect();
    observer = null;
    if (fallbackId != null) {
      window.clearTimeout(fallbackId);
      fallbackId = null;
    }
    scheduleIdle();
  };

  fallbackId = window.setTimeout(onLcp, lcpTimeoutMs);

  try {
    if (typeof PerformanceObserver !== "undefined") {
      observer = new PerformanceObserver((list) => {
        if (list.getEntries().length > 0) onLcp();
      });
      observer.observe({
        type: "largest-contentful-paint",
        buffered: true,
      });
    } else {
      onLcp();
    }
  } catch {
    onLcp();
  }

  return () => {
    cancelled = true;
    observer?.disconnect();
    if (fallbackId != null) window.clearTimeout(fallbackId);
    if (idleId != null && typeof window.cancelIdleCallback === "function") {
      window.cancelIdleCallback(idleId);
    }
    if (timeoutId != null) window.clearTimeout(timeoutId);
  };
}
