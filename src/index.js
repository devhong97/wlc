import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./components/Context/AuthContext";
import { BranchProvider } from "./components/Context/BranchContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <BranchProvider>
        <App />
      </BranchProvider>
    </AuthProvider>
  </BrowserRouter>
);
