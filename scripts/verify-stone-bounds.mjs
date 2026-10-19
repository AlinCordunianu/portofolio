import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { AnimationMixer, Box3, Group, Vector3 } from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { measureAnimationBounds } from "../src/components/Hero/stoneFraming.js";
import { clampStoneRotation } from "../src/components/Hero/stoneRotation.js";

globalThis.self = globalThis;
globalThis.createImageBitmap = async () => ({ width: 1, height: 1 });
const bytes = await readFile(
  new URL("../public/models/magic-stone-green.glb", import.meta.url),
);
const cached = JSON.parse(
  await readFile(
    new URL("../src/components/Hero/stoneBounds.json", import.meta.url),
    "utf8",
  ),
);
assert.equal(cached.sha256, createHash("sha256").update(bytes).digest("hex"));
const { scene, animations } = await new GLTFLoader().parseAsync(
  bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
  "",
);
const clip = animations.find((animation) => animation.name === "Take 01");
function snapshotTransforms(root) {
  const transforms = [];
  root.traverse((object) => {
    transforms.push([
      object.uuid,
      ...object.position,
      ...object.quaternion,
      ...object.scale,
    ]);
  });
  return transforms;
}
const before = snapshotTransforms(scene);
const measured = measureAnimationBounds(scene, clip, -Math.PI / 2);
assert.deepEqual(
  snapshotTransforms(scene),
  before,
  "Framing must not alter the source scene",
);
assert.deepEqual(cached.center, { ...measured.center });
assert.deepEqual(cached.size, { ...measured.size });

const facing = new Group();
facing.rotation.y = -Math.PI / 2;
facing.add(scene);
const centered = new Group();
centered.position.set(-cached.center.x, -cached.center.y, -cached.center.z);
centered.add(facing);
const interactive = new Group();
interactive.add(centered);
const mixer = new AnimationMixer(scene);
mixer.clipAction(clip).play();
const base = new Box3().setFromCenterAndSize(new Vector3(), measured.size);
const size = new Vector3();
const viewports = [
  [829, 580],
  [449, 490],
  [351, 390],
  [288, 390],
];
let poses = 0;
for (const [pitch, yaw] of [
  [0, 0],
  [Math.PI / 4, 0],
  [-Math.PI / 4, 0],
  [0, Math.PI / 4],
  [0, -Math.PI / 4],
  clampStoneRotation(Math.PI / 4, Math.PI / 4),
]) {
  interactive.rotation.set(pitch, yaw, 0);
  interactive.updateMatrix();
  base.clone().applyMatrix4(interactive.matrix).getSize(size);
  for (let frame = 0; frame <= 500; frame++) {
    mixer.setTime((frame / 500) * clip.duration);
    interactive.updateMatrixWorld(true);
    const actual = new Box3().setFromObject(interactive);
    for (const [width, height] of viewports) {
      const zoom = Math.min(width / size.x, height / size.y) * 0.9;
      assert(
        Math.max(Math.abs(actual.min.x), Math.abs(actual.max.x)) * zoom <
          width / 2,
        "Horizontal clipping",
      );
      assert(
        Math.max(Math.abs(actual.min.y), Math.abs(actual.max.y)) * zoom <
          height / 2,
        "Vertical clipping",
      );
    }
    poses++;
  }
}
mixer.stopAllAction();
mixer.uncacheRoot(scene);
console.log(
  JSON.stringify({
    poses,
    viewports: viewports.length,
    cachedFramingMatches: true,
    sourceSceneUnchanged: true,
    clipping: false,
  }),
);
