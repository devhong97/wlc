import React, { Fragment, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

import Home from "../components/Home/Home";
import Login from "./../components/Login/Login";
import { useAuth } from "../components/Context/AuthContext";
import Aside from "../components/Header/Aside";
import Header from "../components/Header/Header";

const Router = () => {
  const { loginAccess } = useAuth(); //로그인여부 확인
  const [checkLogin, setCheckLogin] = useState(""); //로그인여부 상태값

  useEffect(() => {
    // 세션 스토리지에서 로그인 상태를 가져오기
    const storedLoginStatus = sessionStorage.getItem("login_status");

    if (storedLoginStatus) {
      setCheckLogin(storedLoginStatus);
    }
  }, []);

  return (
    <Fragment>
      {loginAccess || checkLogin !== "" ? (
        //토큰 있을 시 Home 컴포넌트
        <Routes>
          <Route
            path="/"
            element={
              <div className="screen">
                <div className="menu_area">
                  <Aside />
                </div>
                <div className="main_area">
                  <Header />
                  <Home />
                </div>
              </div>
            }
          />
        </Routes>
      ) : (
        //토큰 없을 시 Login 컴포넌트
        <Login />
      )}
    </Fragment>
  );
};

export default Router;
