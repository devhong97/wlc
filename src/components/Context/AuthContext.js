import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loginAccess, setLoginAccess] = useState(false);

  console.log(loginAccess);

  const login = () => {
    alert("로그인 되었습니다.");
    setLoginAccess(true);
  };

  const logout = () => {
    alert("로그아웃 되었습니다.");
    setLoginAccess(false);
  };

  return (
    <AuthContext.Provider value={{ loginAccess, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
