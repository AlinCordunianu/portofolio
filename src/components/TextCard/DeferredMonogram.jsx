import { lazy, Suspense, useEffect, useRef, useState } from "react";

const ACMonogram = lazy(() =>
  import("./ACMonogram").then((module) => ({ default: module.ACMonogram })),
);

export function DeferredMonogram() {
  const slot = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    });
    observer.observe(slot.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={slot} className="about-monogram-slot" aria-hidden="true">
      {visible && (
        <Suspense fallback={null}>
          <ACMonogram />
        </Suspense>
      )}
    </div>
  );
}
