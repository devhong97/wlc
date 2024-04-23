import "./assets/scss/index.scss";
import Router from "./router/Router";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import Aside from "./components/Header/Aside";
import Header from "./components/Header/Header";
import React, { Fragment, useEffect, useState } from "react";
import { useAuth } from "./components/Context/AuthContext";
import { Route, Routes } from "react-router-dom";
import Search from "./components/Search/Search";
import Footer from "./components/Footer/Footer";
import SelfReservation from "./components/Self/SelfReservation";
import SelfSearchProduct from "./components/Self/SelfSearchProduct";
import SelfSearchHospital from "./components/Self/SelfSearchHospital";
import SelfSelectDate from "./components/Self/SelfSelectDate";
import SelfReservCustomer from "./components/Self/SelfReservCustomer";
import SelfReservCheck from "./components/Self/SelfReservCheck";
import { useLocation } from "react-router-dom";
function App() {
  const { loginAccess, login } = useAuth(); //로그인여부 확인
  const location = useLocation();
  const path = location.pathname;
  const parts = path.split("/");
  const target = parts[1];
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

          <Aside />
          <div className={`main_area`}>
            <Header />
            <Router />
            <Footer />
          </div>
        </div>
      ) : (
        //로그인화면 컴포넌트
        <div className="screen">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/search" element={<Search />} />
            {/* 링크라우터 */}
            <Route path="/self/:uid" element={<SelfReservation />}></Route>
            <Route path="/self/:uid/product" element={<SelfSearchProduct />} />
            <Route path="/self/:uid/hospital" element={<SelfSearchHospital />} />
            <Route path="/self/:uid/date" element={<SelfSelectDate />} />
            <Route path="/self/:uid/customer" element={<SelfReservCustomer />} />
            <Route path="/self/:uid/check" element={<SelfReservCheck />} />
          </Routes>
          {target === "self" && (
            <Footer />
          )}
        </div>
      )}
    </Fragment>
  );
}

export default App;
