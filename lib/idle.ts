/** Idle callbacks run in the order they were requested, which keeps pins in page order. */
export function whenIdle(callback: () => void, timeout = 1000) {
  if (typeof window.requestIdleCallback === "function") {
    const id = window.requestIdleCallback(callback, { timeout });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(callback, 1);
  return () => window.clearTimeout(id);
}
