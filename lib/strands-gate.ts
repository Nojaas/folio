type NetworkInformation = {
  saveData?: boolean;
  effectiveType?: string;
};

/** Hard skip — never mount WebGL Strands. */
export function shouldSkipStrands(): boolean {
  if (typeof window === "undefined") return true;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
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
