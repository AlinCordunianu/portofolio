import { useId, useRef, useState } from "react";
import { MathUtils } from "three";
import { useLanguage } from "../../context/LanguageContext";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import { clampStoneRotation, MAX_STONE_ROTATION } from "./stoneRotation";

export function StoneInteraction({ children, paused }) {
  const { language } = useLanguage();
  const reduced = useReducedMotion();
  const [rotation, setRotation] = useState([0, 0]);
  const [dragging, setDragging] = useState(false);
  const [pointerFocus, setPointerFocus] = useState(false);
  const gesture = useRef(null);
  const instructions = useId();
  const rotated = Math.abs(rotation[0]) + Math.abs(rotation[1]) > 0.001;

  function startDrag(event) {
    if (event.button !== 0 || event.target.closest("button")) return;
    if (event.pointerType === "mouse") event.preventDefault();
    setPointerFocus(true);
    event.currentTarget.focus({ preventScroll: true });
    event.currentTarget.setPointerCapture(event.pointerId);
    gesture.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      rotation,
      moved: false,
    };
  }
  function moveDrag(event) {
    const start = gesture.current;
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (!start.moved && Math.hypot(dx, dy) < 5) return;
    // Keep native vertical scrolling available on touch screens.
    if (
      !start.moved &&
      event.pointerType === "touch" &&
      Math.abs(dy) > Math.abs(dx)
    )
      return;
    start.moved = true;
    setDragging(true);
    setRotation(
      clampStoneRotation(
        start.rotation[0] +
          (event.pointerType === "touch" ? 0 : (dy * MAX_STONE_ROTATION) / 180),
        start.rotation[1] + (dx * MAX_STONE_ROTATION) / 180,
      ),
    );
  }
  function finishDrag(event) {
    const start = gesture.current;
    if (!start || start.id !== event.pointerId) return;
    if (!start.moved) {
      const bounds = event.currentTarget.getBoundingClientRect();
      const direction = event.clientX < bounds.left + bounds.width / 2 ? -1 : 1;
      setRotation(
        clampStoneRotation(
          rotation[0],
          rotation[1] + (direction * Math.PI) / 12,
        ),
      );
    }
    gesture.current = null;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId);
  }
  function cancelDrag() {
    gesture.current = null;
    setDragging(false);
  }
  function handleKey(event) {
    if (event.target !== event.currentTarget) return;
    setPointerFocus(false);
    const step = Math.PI / 36;
    const changes = {
      ArrowLeft: [0, -step],
      ArrowRight: [0, step],
      ArrowUp: [-step, 0],
      ArrowDown: [step, 0],
    };
    if (event.key === "Home") {
      event.preventDefault();
      setRotation([0, 0]);
    } else if (changes[event.key]) {
      event.preventDefault();
      const [x, y] = changes[event.key];
      setRotation((previous) =>
        clampStoneRotation(previous[0] + x, previous[1] + y),
      );
    }
  }
  return (
    <div
      className={`stone-interaction${dragging ? " is-dragging" : ""}${pointerFocus ? " is-pointer-focused" : ""}`}
      role="group"
      tabIndex={0}
      aria-label={
        language === "en" ? "Rotate the 3D artwork" : "Rotește obiectul 3D"
      }
      aria-describedby={instructions}
      data-rotation={rotation
        .map((value) => MathUtils.radToDeg(value).toFixed(2))
        .join(",")}
      onPointerDown={startDrag}
      onPointerMove={moveDrag}
      onPointerUp={finishDrag}
      onPointerCancel={cancelDrag}
      onLostPointerCapture={cancelDrag}
      onKeyDown={handleKey}
      onBlur={() => {
        cancelDrag();
        setPointerFocus(false);
      }}
    >
      <span id={instructions} className="stone-instructions">
        {language === "en"
          ? "Drag or swipe to rotate up to 45 degrees. Use arrow keys to rotate; Home resets the view. Click to turn toward that side."
          : "Trage sau glisează pentru a roti cu maximum 45 de grade. Folosește săgețile pentru rotire și Home pentru resetare."}
      </span>
      {children(rotation, reduced || paused)}
      <span className="stone-interaction-hint" aria-hidden="true">
        {language === "en"
          ? "Drag / swipe to rotate"
          : "Trage / glisează pentru rotire"}
      </span>
      {rotated && (
        <button className="stone-reset" onClick={() => setRotation([0, 0])}>
          {language === "en" ? "Reset view" : "Resetează"}
        </button>
      )}
    </div>
  );
}
