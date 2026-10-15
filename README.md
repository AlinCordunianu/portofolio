# Alin Cordunianu — Portfolio

React, JavaScript, SCSS and Vite. The portfolio keeps its EN/RO language context and content in `src/content.json`.

```sh
npm install
npm run dev
npm run lint
npm run build
npm run preview
```

Use a Node version compatible with the installed Vite and ESLint packages. The existing ESLint 10 dependencies require Node 22.13+ (or a supported newer release).

## Editing

- `src/content.json`: original project information, translations, contact and social links.
- `src/App.jsx`: section composition, with the existing section components retained.
- `src/styles/_tokens.scss`: shared olive, lime, off-white and surface colors.
- `src/components/Hero/Hero.jsx`: accessible typewriter, scene loading boundary, viewport/visibility and motion controls.
- `src/components/Hero/StoneScene.jsx`: lazy-loaded Three.js scene, `useGLTF`, `useAnimations`, original `Take 01` loop and lighting.
- `public/models/magic-stone-green.glb`: supplied model, used without editing geometry, textures or embedded animation.

The 3D module is split from the main application. Pixel ratio is capped at 1.5. Rendering and playback pause outside the viewport, in hidden tabs, under reduced motion and through the manual pause control. WebGL2 is checked before constructing the renderer; unsupported devices receive a lightweight atmospheric fallback. No remote environment textures or font services are needed.
