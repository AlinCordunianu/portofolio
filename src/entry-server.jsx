import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import { LanguageProvider } from "./context/LanguageProvider";
import App from "./App";

// Build-time HTML only: deployment still consists entirely of static files.
export function render() {
  return renderToString(
    <StrictMode>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </StrictMode>,
  );
}
