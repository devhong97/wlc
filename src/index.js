import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./components/Context/AuthContext";
import { BranchProvider } from "./components/Context/BranchContext";
import { ReservProvider } from "./components/Context/ReservContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <AuthProvider>
      <BranchProvider>
        <ReservProvider>
          <App />
        </ReservProvider>
      </BranchProvider>
    </AuthProvider>
  </BrowserRouter>
);
