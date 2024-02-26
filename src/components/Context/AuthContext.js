import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loginAccess, setLoginAccess] = useState(false); //로그인 상태
  const [userData, setUserData] = useState(""); //로그인 시 해당정보

  console.log("loginAccess", loginAccess);
  console.log("userData", userData);

  const login = (userData) => {
    setUserData(userData);
    setLoginAccess(true);
  };

  const logout = () => {
    setUserData("");
    setLoginAccess(false);
    alert("로그아웃 되었습니다.");
  };

  return (
    <AuthContext.Provider value={{ loginAccess, login, logout, userData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
