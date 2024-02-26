import "./assets/scss/index.scss";
import Router from "./router/Router";
import { AuthProvider } from "./components/Context/AuthContext";
import Login from "./components/Login/Login";
// import { useAuth } from "./components/Context/AuthContext";
import Aside from "./components/Header/Aside";
import Header from "./components/Header/Header";
import React, { Fragment, useEffect, useState } from "react";

function App() {
  // const { loginAccess } = useAuth(); //로그인여부 확인
  const [checkLogin, setCheckLogin] = useState(""); //로그인여부 상태값

  useEffect(() => {
    // 세션 스토리지에서 로그인 상태를 가져오기
    const storedLoginStatus = sessionStorage.getItem("login_status");

    if (storedLoginStatus) {
      setCheckLogin(storedLoginStatus);
    }
  }, []);
  return (
    <AuthProvider>
      <Fragment>
        {checkLogin !== "" ? (
          <div className="screen">
            <div className="menu_area">
              <Aside />
            </div>
            <div className="main_area">
              <Header />
              <Router />
            </div>
          </div>
        ) : (
          <Login />
        )}
      </Fragment>
    </AuthProvider>
  );
}

export default App;
