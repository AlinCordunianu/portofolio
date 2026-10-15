import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import {
  useGLTF,
  useAnimations,
  Environment,
  Lightformer,
  OrthographicCamera,
} from "@react-three/drei";
import { Box3, LoopRepeat, MathUtils, Vector3 } from "three";
import { useLanguage } from "../../context/LanguageContext";
import { measureAnimationBounds } from "./stoneFraming";
import { StoneInteraction } from "./StoneInteraction";
const MODEL_FACING = -Math.PI / 2;

function Stone({ paused, onReady, rotation, immediate }) {
  const interactive = useRef();
  const viewCamera = useRef();
  const { scene, animations } = useGLTF("/models/magic-stone-green.glb");
  const { actions } = useAnimations(animations, scene);
  const { size: viewport, invalidate } = useThree();
  const framing = useMemo(
    () =>
      measureAnimationBounds(
        scene,
        animations.find((clip) => clip.name === "Take 01"),
        MODEL_FACING,
      ),
    [scene, animations],
  );

  const rotationBounds = useMemo(
    () => ({
      original: new Box3().setFromCenterAndSize(new Vector3(), framing.size),
      rotated: new Box3(),
      size: new Vector3(),
    }),
    [framing],
  );
  const zoom =
    Math.min(
      viewport.width / framing.size.x,
      viewport.height / framing.size.y,
    ) * 0.9;

  useEffect(() => {
    const action = actions["Take 01"];
    if (!action) return;
    action
      .reset()
      .setEffectiveWeight(1)
      .setEffectiveTimeScale(1)
      .setLoop(LoopRepeat, Infinity)
      .play();
    onReady();
    return () => action.stop();
  }, [actions, onReady]);
  useEffect(() => {
    actions["Take 01"]?.setEffectiveTimeScale(paused ? 0 : 1);
    invalidate();
  }, [actions, paused, invalidate]);
  useEffect(() => {
    invalidate();
  }, [rotation, invalidate]);
  useFrame((_, delta) => {
    if (!interactive.current) return;
    const group = interactive.current;
    const x = immediate
      ? rotation[0]
      : MathUtils.damp(group.rotation.x, rotation[0], 14, delta);
    const y = immediate
      ? rotation[1]
      : MathUtils.damp(group.rotation.y, rotation[1], 14, delta);
    group.rotation.set(x, y, 0);
    // Fit the current view, rather than shrinking the artwork for every possible angle.
    group.updateMatrix();
    rotationBounds.rotated
      .copy(rotationBounds.original)
      .applyMatrix4(group.matrix);
    rotationBounds.rotated.getSize(rotationBounds.size);
    const fittedZoom =
      Math.min(
        viewport.width / rotationBounds.size.x,
        viewport.height / rotationBounds.size.y,
      ) * 0.9;
    if (
      viewCamera.current &&
      Math.abs(viewCamera.current.zoom - fittedZoom) > 0.00001
    ) {
      viewCamera.current.zoom = fittedZoom;
      viewCamera.current.updateProjectionMatrix();
    }
    if (Math.abs(x - rotation[0]) + Math.abs(y - rotation[1]) > 0.0001)
      invalidate();
  });

  return (
    <>
      <OrthographicCamera
        ref={viewCamera}
        makeDefault
        position={[0, 0, framing.size.z + 10]}
        zoom={zoom}
      />
      <group ref={interactive} name="InteractiveStone">
        <group
          position={[-framing.center.x, -framing.center.y, -framing.center.z]}
        >
          {/* Pointer rotation stays outside the animation hierarchy and keeps its front view as zero. */}
          <group rotation={[0, MODEL_FACING, 0]}>
            <primitive object={scene} />
          </group>
        </group>
      </group>
    </>
  );
}

export default function StoneScene({ paused }) {
  const { language } = useLanguage();
  const [ready, setReady] = useState(false);
  const [supported] = useState(() => {
    try {
      const context = document.createElement("canvas").getContext("webgl2");
      if (!context) return false;
      context.getExtension("WEBGL_lose_context")?.loseContext();
      return true;
    } catch {
      return false;
    }
  });
  const markReady = useCallback(() => setReady(true), []);
  if (!supported)
    return (
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
            <div className="scene-loading" role="status">
              {language === "en" ? "Loading the artwork…" : "Se încarcă scena…"}
            </div>
          )}
          <Canvas
            frameloop={paused ? "demand" : "always"}
            dpr={[1, 1.5]}
            camera={{ position: [0, 0, 8], fov: 40 }}
            gl={{ alpha: true, antialias: true, powerPreference: "low-power" }}
            onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
          >
            <ambientLight intensity={0.7} />
            <directionalLight position={[3, 4, 5]} intensity={3} />
            <pointLight position={[-3, 0, 2]} color="#a7f432" intensity={12} />
            <Suspense fallback={null}>
              <Environment resolution={128}>
                <Lightformer
                  position={[0, 4, 3]}
                  scale={[5, 2, 1]}
                  intensity={4}
                />
                <Lightformer
                  position={[-4, 0, 1]}
                  rotation={[0, Math.PI / 2, 0]}
                  scale={[3, 5, 1]}
                  color="#c9e69d"
                  intensity={3}
                />
              </Environment>
              <Stone
                paused={paused}
                onReady={markReady}
                rotation={rotation}
                immediate={immediate}
              />
            </Suspense>
          </Canvas>
        </>
      )}
    </StoneInteraction>
  );
}
