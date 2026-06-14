import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

import "./styles/globals.css";
import "./styles/styles.css";

import { I18nProvider } from "./i18n/I18nProvider";

function redirectOldHashRoutes() {
  const hash = window.location.hash;

  if (!hash.startsWith("#/")) return;

  const newPath = hash.substring(1);

  window.location.replace(newPath);
}

redirectOldHashRoutes();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <I18nProvider>
        <App />
      </I18nProvider>
    </BrowserRouter>
  </React.StrictMode>
);
