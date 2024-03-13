import "./assets/scss/index.scss";
import Router from "./router/Router";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Aside from "./components/Header/Aside";
import Header from "./components/Header/Header";
import React, { Fragment, useEffect } from "react";
import { useAuth } from "./components/Context/AuthContext";
import { Route, Routes } from "react-router-dom";
import Search from "./components/Search/Search";
import Footer from './components/Footer/Footer';

function App() {
  const { loginAccess, login } = useAuth(); //로그인여부 확인

  useEffect(() => {
    const loginStatus = localStorage.getItem("Access");
    if (loginStatus === "true") {
      login();
    }
  }, []);

  return (
    <Fragment>
      {loginAccess ? (
        <div className="screen">
          <div className="menu_area">
            <Aside />
          </div>
          <div className="main_area">
            <Header />
            <Router />
            <Footer />
          </div>
        </div>
      ) : (
        //로그인화면 컴포넌트
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/search" element={<Search />} />
        </Routes>
      )}
    </Fragment>
  );
}

export default App;
