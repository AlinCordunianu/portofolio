export const MAX_STONE_ROTATION = Math.PI / 4;

// Clamp the combined tilt, including diagonal gestures, to 45 degrees.
export function clampStoneRotation(pitch, yaw) {
  const length = Math.hypot(pitch, yaw);
  const scale = length > MAX_STONE_ROTATION ? MAX_STONE_ROTATION / length : 1;
  return [pitch * scale, yaw * scale];
}
