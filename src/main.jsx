import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import "./index.scss";
import App from "./App.jsx";
import { LanguageProvider } from "./context/LanguageProvider.jsx";

const app = (
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>
);
const root = document.getElementById("root");
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
