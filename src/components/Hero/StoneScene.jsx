import {
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import {
  AnimationMixer,
  Box3,
  DoubleSide,
  LoopRepeat,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  PMREMGenerator,
  Scene,
  Vector3,
} from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { useLanguage } from "../../context/LanguageContext";
import { StoneInteraction } from "./StoneInteraction";
import framing from "./stoneBounds.json";

const MODEL_FACING = -Math.PI / 2;
const CAMERA = { position: [0, 0, framing.size.z + 10], zoom: 1 };
const DESKTOP_DPR = [1, 1.5];

function ReflectionLighting({ compact }) {
  const get = useThree((state) => state.get);
  useLayoutEffect(() => {
    const { gl, scene, invalidate } = get();
    // The same two reflection panels as the former Environment/Lightformer portal.
    // Generate their prefiltered environment once, without extra loader/helper bundles.
    const lights = new Scene();
    const geometry = new PlaneGeometry(1, 1);
    const upperMaterial = new MeshBasicMaterial({
      color: "white",
      side: DoubleSide,
      toneMapped: false,
    });
    upperMaterial.color.multiplyScalar(4);
    const upper = new Mesh(geometry, upperMaterial);
    upper.position.set(0, 4, 3);
    upper.scale.set(5, 2, 1);
    upper.lookAt(0, 0, 0);
    const sideMaterial = new MeshBasicMaterial({
      color: "#c9e69d",
      side: DoubleSide,
      toneMapped: false,
    });
    sideMaterial.color.multiplyScalar(3);
    const side = new Mesh(geometry, sideMaterial);
    side.position.set(-4, 0, 1);
    side.rotation.y = Math.PI / 2;
    side.scale.set(3, 5, 1);
    lights.add(upper, side);
    const generator = new PMREMGenerator(gl);
    const target = generator.fromScene(lights, 0, 0.1, 1000, {
      size: compact ? 64 : 128,
    });
    const previous = scene.environment;
    scene.environment = target.texture;
    generator.dispose();
    geometry.dispose();
    upperMaterial.dispose();
    sideMaterial.dispose();
    invalidate();
    return () => {
      scene.environment = previous;
      target.dispose();
    };
  }, [get, compact]);
  return null;
}

function MobileFrames({ enabled }) {
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    if (!enabled) return;
    const timer = window.setInterval(invalidate, 1000 / 30);
    invalidate();
    return () => window.clearInterval(timer);
  }, [enabled, invalidate]);
  return null;
}

function PreparedRenderer({ onReady }) {
  const get = useThree((state) => state.get);
  const prepared = useRef(false);
  useLayoutEffect(() => {
    let cancelled = false;
    const { gl, scene, camera, invalidate } = get();
    const finish = () => {
      if (cancelled) return;
      prepared.current = true;
      onReady();
      invalidate();
    };
    // Wait for parallel shader compilation before the first draw, rather than
    // forcing the GPU to finish linking synchronously on the main thread.
    const warm = gl.getContext().getExtension("KHR_parallel_shader_compile")
      ? gl.compileAsync(scene, camera)
      : Promise.resolve();
    warm.then(finish, finish);
    return () => {
      cancelled = true;
      prepared.current = false;
    };
  }, [get, onReady]);
  // Positive priority takes over the normal R3F draw, after animation/rotation.
  useFrame(({ gl, scene, camera }) => {
    if (prepared.current) gl.render(scene, camera);
  }, 1);
  return null;
}

function Stone({ paused, rotation, immediate }) {
  const interactive = useRef();
  const fitDirty = useRef(true);
  const { scene, animations } = useLoader(
    GLTFLoader,
    "/models/magic-stone-green.glb",
  );
  const mixer = useMemo(() => new AnimationMixer(scene), [scene]);
  const viewport = useThree((state) => state.size);
  const invalidate = useThree((state) => state.invalidate);
  const rotationBounds = useMemo(
    () => ({
      original: new Box3().setFromCenterAndSize(
        new Vector3(),
        new Vector3(framing.size.x, framing.size.y, framing.size.z),
      ),
      rotated: new Box3(),
      size: new Vector3(),
    }),
    [],
  );

  useEffect(() => {
    const clip = animations.find((animation) => animation.name === "Take 01");
    const action = clip
      ? mixer.clipAction(clip).setLoop(LoopRepeat, Infinity).play()
      : null;
    return () => {
      action?.stop();
      mixer.uncacheRoot(scene);
    };
  }, [animations, mixer, scene]);
  useLayoutEffect(() => {
    fitDirty.current = true;
    invalidate();
  }, [
    rotation,
    immediate,
    paused,
    viewport.width,
    viewport.height,
    invalidate,
  ]);

  useFrame(({ camera }, delta) => {
    if (!paused) mixer.update(Math.min(delta, 0.1));
    const group = interactive.current;
    if (!group) return;
    const x = immediate
      ? rotation[0]
      : MathUtils.damp(group.rotation.x, rotation[0], 14, delta);
    const y = immediate
      ? rotation[1]
      : MathUtils.damp(group.rotation.y, rotation[1], 14, delta);
    const moving =
      Math.abs(x - group.rotation.x) + Math.abs(y - group.rotation.y) >
      0.000001;
    // Animation playback never changes user rotation: fit only on interaction or resize.
    if (fitDirty.current || moving) {
      group.rotation.set(x, y, 0);
      group.updateMatrix();
      rotationBounds.rotated
        .copy(rotationBounds.original)
        .applyMatrix4(group.matrix);
      rotationBounds.rotated.getSize(rotationBounds.size);
      camera.zoom =
        Math.min(
          viewport.width / rotationBounds.size.x,
          viewport.height / rotationBounds.size.y,
        ) * 0.9;
      camera.updateProjectionMatrix();
      fitDirty.current = false;
    }
    if (Math.abs(x - rotation[0]) + Math.abs(y - rotation[1]) > 0.0001)
      invalidate();
  });

  return (
    <group ref={interactive} name="InteractiveStone">
      <group
        position={[-framing.center.x, -framing.center.y, -framing.center.z]}
      >
        <group rotation={[0, MODEL_FACING, 0]}>
          <primitive object={scene} dispose={null} />
        </group>
      </group>
    </group>
  );
}

export default function StoneScene({ paused }) {
  const { language } = useLanguage();
  const [ready, setReady] = useState(false);
  const [compact] = useState(
    () =>
      window.matchMedia("(max-width: 700px)").matches ||
      navigator.deviceMemory <= 4 ||
      navigator.hardwareConcurrency <= 4,
  );
  const markReady = useCallback(() => setReady(true), []);
  const fallback = (
    <div className="stone-fallback">
      <span className="fallback-orbit" />
      <p>
        {language === "en"
          ? "Creative work. In another dimension."
          : "Creativitate. În altă dimensiune."}
      </p>
    </div>
  );
  return (
    <StoneInteraction paused={paused}>
      {(rotation, immediate) => (
        <>
          {!ready && (
            <div className="stone-fallback stone-preview" aria-hidden="true">
              <span className="fallback-orbit" />
            </div>
          )}
          <Canvas
            orthographic
            camera={CAMERA}
            fallback={fallback}
            frameloop={paused || compact || !ready ? "demand" : "always"}
            dpr={compact ? 1 : DESKTOP_DPR}
            gl={{
              alpha: true,
              antialias: !compact,
              powerPreference: "low-power",
            }}
            onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
            data-render-profile={compact ? "mobile-30fps" : "desktop"}
          >
            <ambientLight intensity={compact ? 0.9 : 0.7} />
            <directionalLight position={[3, 4, 5]} intensity={3} />
            <pointLight position={[-3, 0, 2]} color="#a7f432" intensity={12} />
            <Suspense fallback={null}>
              {!compact && <ReflectionLighting compact={false} />}
              <Stone
                paused={paused}
                rotation={rotation}
                immediate={immediate}
              />
              <PreparedRenderer onReady={markReady} />
              <MobileFrames enabled={compact && !paused && ready} />
            </Suspense>
          </Canvas>
        </>
      )}
    </StoneInteraction>
  );
}
