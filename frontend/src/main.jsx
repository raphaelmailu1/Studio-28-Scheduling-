import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>

      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,

          style: {
            background: "#111",
            color: "#fff",
            borderRadius: "12px",
            padding: "14px",
            fontSize: "15px",
          },

          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },

          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />

      <App />

    </BrowserRouter>
  </React.StrictMode>
);