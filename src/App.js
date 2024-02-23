import { Fragment } from "react";
import Home from "./components/Home/Home";
import "./assets/scss/index.scss";
import { Route, Routes } from "react-router-dom";
import Router from "./router/Router";
import Aside from "./components/Header/Aside";
import Header from "./components/Header/Header";

function App() {
  return (
    <div className="screen">
      <div className="menu_area">
        <Aside></Aside>
      </div>
      <div className="main_area">
        <Header></Header>
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
