import { AnimationMixer, Box3, Group, Vector3 } from "three";

// Measure a disposable hierarchy, leaving the loaded scene and materials untouched.
// Include the complete animation at 60 samples/second, not only the export pose.
export function measureAnimationBounds(scene, clip, facingAngle) {
  const copy = scene.clone(true);
  const facing = new Group();
  facing.rotation.y = facingAngle;
  facing.add(copy);
  const mixer = new AnimationMixer(copy);
  const action = clip ? mixer.clipAction(clip).play() : null;
  const bounds = new Box3();
  const samples = clip ? Math.ceil(clip.duration * 60) : 1;
  for (let frame = 0; frame <= samples; frame++) {
    if (clip) mixer.setTime((frame / samples) * clip.duration);
    facing.updateMatrixWorld(true);
    bounds.union(new Box3().setFromObject(facing));
  }
  action?.stop();
  mixer.uncacheRoot(copy);
  return {
    center: bounds.getCenter(new Vector3()),
    size: bounds.getSize(new Vector3()),
  };
}
