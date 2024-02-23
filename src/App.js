import { Fragment } from "react";
import Home from "./components/Home/Home";
import "./assets/scss/index.scss";
import { Route, Routes } from "react-router-dom";
import Router from "./router/Router";

function App() {
  return (
    <div style={{ height: "100%" }}>
      <div className="Screen">
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
