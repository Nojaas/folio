type NetworkInformation = {
  saveData?: boolean;
  effectiveType?: string;
};

type DebugRendererInfo = {
  UNMASKED_RENDERER_WEBGL: number;
  UNMASKED_VENDOR_WEBGL: number;
};

export type StrandsSkipReason =
  | "kill-switch"
  | "reduced-motion"
  | "webdriver"
  | "save-data"
  | "2g"
  | "no-gl"
  | "slow-gl"
  | "soft-gl"
  | "ok";

const SOFT_GL_RE =
  /swiftshader|llvmpipe|softpipe|software|microsoft basic render|apple software/i;
/** Skip if creating a WebGL context takes longer than this (ms). Soft-GL + jank cover most cases. */
const SLOW_GL_MS = 150;

let cachedProbe: { skip: boolean; reason: StrandsSkipReason } | null = null;

/**
 * Lab override: `?strands=force` — bypass webdriver + WebGL probe.
 * Intended for local LH / GPU profiling only (not a public feature).
 * Disabled when NEXT_PUBLIC_STRANDS is explicitly `0`/`off` (kill switch wins).
 */
function isForceStrands(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return (
      new URLSearchParams(window.location.search).get("strands") === "force"
    );
  } catch {
    return false;
  }
}

/**
 * Opt-out for A/B measures — off by default.
 * - `?strands=off` | `0` | `false`
 * - `NEXT_PUBLIC_STRANDS=0` | `off`
 * Override: `?strands=force` ignores webdriver + WebGL probe (lab / LH only).
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
function probeBadWebGL(): { skip: boolean; reason: StrandsSkipReason } {
  if (cachedProbe != null) return cachedProbe;

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
      cachedProbe = { skip: true, reason: "no-gl" };
      return cachedProbe;
    }

    if (dt > SLOW_GL_MS) {
      gl.getExtension("WEBGL_lose_context")?.loseContext();
      cachedProbe = { skip: true, reason: "slow-gl" };
      return cachedProbe;
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
        cachedProbe = { skip: true, reason: "soft-gl" };
        return cachedProbe;
      }
    }

    gl.getExtension("WEBGL_lose_context")?.loseContext();
    cachedProbe = { skip: false, reason: "ok" };
    return cachedProbe;
  } catch {
    cachedProbe = { skip: true, reason: "no-gl" };
    return cachedProbe;
  }
}

function logSkipReason(reason: StrandsSkipReason, skip: boolean) {
  if (typeof window === "undefined") return;
  try {
    const debug =
      new URLSearchParams(window.location.search).get("strands") === "debug" ||
      process.env.NODE_ENV !== "production";
    if (!debug) return;
    // Temporary diagnostic — which gate branch fired (iPhone vs PSI).
    console.info(`[strands-gate] ${skip ? "skip" : "allow"}:${reason}`);
  } catch {
    /* ignore */
  }
}

/** Hard skip — never mount WebGL Strands. Returns reason for diagnostics. */
export function getStrandsSkipReason(): StrandsSkipReason {
  if (typeof window === "undefined") return "kill-switch";

  if (isStrandsKillSwitch()) {
    logSkipReason("kill-switch", true);
    return "kill-switch";
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    logSkipReason("reduced-motion", true);
    return "reduced-motion";
  }

  const force = isForceStrands();

  if (!force && typeof navigator !== "undefined" && navigator.webdriver) {
    logSkipReason("webdriver", true);
    return "webdriver";
  }

  const connection = (
    navigator as Navigator & { connection?: NetworkInformation }
  ).connection;
  if (connection?.saveData) {
    logSkipReason("save-data", true);
    return "save-data";
  }
  if (
    connection?.effectiveType === "slow-2g" ||
    connection?.effectiveType === "2g"
  ) {
    logSkipReason("2g", true);
    return "2g";
  }

  // Soft-GL / missing / slow context.
  // `?strands=force` also bypasses the probe so LH can exercise the mount path;
  // the runtime jank median still tears down if frames are slow.
  if (!force) {
    const probe = probeBadWebGL();
    if (probe.skip) {
      logSkipReason(probe.reason, true);
      return probe.reason;
    }
  }

  logSkipReason("ok", false);
  return "ok";
}

/** Hard skip — never mount WebGL Strands. */
export function shouldSkipStrands(): boolean {
  return getStrandsSkipReason() !== "ok";
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
