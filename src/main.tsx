import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Register PWA Service Worker for offline support & installability
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        // Automatically check for service worker updates
        reg.onupdatefound = () => {
          const installingWorker = reg.installing;
          if (installingWorker) {
            installingWorker.onstatechange = () => {
              if (installingWorker.state === "installed" && navigator.serviceWorker.controller) {
                console.log("New content is available; please refresh.");
              }
            };
          }
        };
      })
      .catch((err) => {
        console.warn("PWA ServiceWorker registration failed:", err);
      });
  });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
