import { useEffect, useState } from "react";

// Paint the essential content and finish its font requests before competing for
// bandwidth/CPU with WebGL. Offscreen heroes do not initialize a canvas.
export function useDeferredScene(visible) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!visible || ready) return;
    let cancelled = false;
    let frame;
    let timer;
    let idle;
    const mount = () => {
      if (!cancelled) setReady(true);
    };
    const schedule = () => {
      if (cancelled) return;
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => {
          timer = window.setTimeout(() => {
            if (window.requestIdleCallback)
              idle = window.requestIdleCallback(mount, { timeout: 1500 });
            else mount();
          }, 150);
        });
      });
    };
    (document.fonts?.ready ?? Promise.resolve()).then(schedule, schedule);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      clearTimeout(timer);
      if (idle !== undefined) window.cancelIdleCallback(idle);
    };
  }, [visible, ready]);
  return ready;
}
