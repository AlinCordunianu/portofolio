import { useEffect, useId, useRef } from "react";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { AC_MONOGRAM_PATH } from "./acMonogramPath";

const fragments = ["ac <>/", "01 {} ", "</> ac", "{} 10/", "/ ac01", "<> {} "];
const columns = Array.from({ length: 16 }, (_, column) =>
  Array.from({ length: 42 }, (_, row) => ({
    x: column * 40 + (row % 2 ? -5 : 0),
    y: row * 10 + 8,
    text: fragments[(column * 3 + row) % fragments.length],
  })),
);

export function ACMonogram() {
  const id = useId().replace(/:/g, "");
  const artRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const art = artRef.current;
    const section = art.closest(".about");
    if (reducedMotion) {
      art.dataset.active = "false";
      return;
    }
    let visible = false;
    let frame = 0;
    let bounds;
    let boundsDirty = true;
    const markBoundsDirty = () => {
      boundsDirty = true;
    };
    let highlighted = new Set();
    const characters = [...art.querySelectorAll(".about-monogram-fragment")];
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const motionRunning = () =>
      document.documentElement.dataset.motion !== "paused";
    function clearHighlight() {
      cancelAnimationFrame(frame);
      highlighted.forEach((index) =>
        characters[index].style.removeProperty("--near"),
      );
      highlighted.clear();
    }
    function updateActivity() {
      boundsDirty = true;
      art.dataset.active = String(
        visible && !document.hidden && motionRunning(),
      );
      if (art.dataset.active === "false") clearHighlight();
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      updateActivity();
    });
    observer.observe(art);
    const motionObserver = new MutationObserver(updateActivity);
    motionObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-motion", "lang"],
    });
    const sizeObserver = new ResizeObserver(markBoundsDirty);
    sizeObserver.observe(art);
    window.addEventListener("scroll", markBoundsDirty, {
      passive: true,
      capture: true,
    });
    window.addEventListener("resize", markBoundsDirty, { passive: true });
    document.addEventListener("visibilitychange", updateActivity);
    function move(event) {
      if (!finePointer.matches || art.dataset.active !== "true") return;
      cancelAnimationFrame(frame);
      const { clientX, clientY } = event;
      frame = requestAnimationFrame(() => {
        if (boundsDirty) {
          bounds = art.getBoundingClientRect();
          boundsDirty = false;
        }
        const x = ((clientX - bounds.left) / bounds.width) * 640;
        const y = ((clientY - bounds.top) / bounds.height) * 420;
        const next = new Set();
        // Only nearby fragments receive style updates; CSS handles the ambient waves.
        for (
          let column = Math.max(0, Math.floor((x - 105) / 40));
          column <= Math.min(15, Math.ceil((x + 105) / 40));
          column++
        ) {
          for (
            let row = Math.max(0, Math.floor((y - 105) / 10));
            row <= Math.min(41, Math.ceil((y + 105) / 10));
            row++
          ) {
            const distance = Math.hypot(column * 40 + 18 - x, row * 10 + 4 - y);
            if (distance >= 105) continue;
            const index = column * 42 + row;
            characters[index].style.setProperty(
              "--near",
              (1 - distance / 105).toFixed(3),
            );
            next.add(index);
          }
        }
        highlighted.forEach((index) => {
          if (!next.has(index))
            characters[index].style.removeProperty("--near");
        });
        highlighted = next;
      });
    }
    section.addEventListener("pointermove", move, { passive: true });
    section.addEventListener("pointerleave", clearHighlight);
    return () => {
      clearHighlight();
      observer.disconnect();
      motionObserver.disconnect();
      sizeObserver.disconnect();
      window.removeEventListener("scroll", markBoundsDirty, true);
      window.removeEventListener("resize", markBoundsDirty);
      document.removeEventListener("visibilitychange", updateActivity);
      section.removeEventListener("pointermove", move);
      section.removeEventListener("pointerleave", clearHighlight);
      art.dataset.active = "false";
    };
  }, [reducedMotion]);

  return (
    <div
      className="about-monogram"
      ref={artRef}
      aria-hidden="true"
      data-active="false"
    >
      <svg viewBox="0 0 640 420" focusable="false">
        <defs>
          <clipPath id={`${id}-letters`}>
            <path d={AC_MONOGRAM_PATH} />
          </clipPath>
        </defs>
        <g clipPath={`url(#${id}-letters)`}>
          {columns.map((characters, column) => (
            <g
              className="about-monogram-column"
              key={column}
              style={{
                "--wave-delay": `${-column * 0.47}s`,
                "--wave-duration": `${6.5 + (column % 3) * 0.65}s`,
              }}
            >
              {characters.map((character, row) => (
                <text
                  className="about-monogram-fragment"
                  key={row}
                  x={character.x}
                  y={character.y}
                  fontFamily="monospace"
                  fontSize="8"
                  letterSpacing="0.9"
                >
                  {character.text}
                </text>
              ))}
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
