import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

// AuthContext 생성
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loginAccess, setLoginAccess] = useState(false);
  const [uid, setUid] = useState("");
  const [manager, setManager] = useState("");
  const [branch, setBranch] = useState("");
  const [grade, setGrade] = useState("");
  const [id, setId] = useState("");

  useEffect(() => {
    const storedAccess = localStorage.getItem("Access");
    if (storedAccess === "true") {
      setLoginAccess(true);
      const storedS1 = localStorage.getItem("S1");
      const storedS2 = localStorage.getItem("S2");
      const storedS3 = localStorage.getItem("S3");
      const storedS4 = localStorage.getItem("S4");
      const storedS5 = localStorage.getItem("S5");

      if (storedS1) setUid(storedS1);
      if (storedS2) setManager(storedS2);
      if (storedS3) setBranch(storedS3);
      if (storedS4) setGrade(storedS4);
      if (storedS5) setId(storedS5);
    }
  }, []);

  // 로그인 시
  const login = (uidToken, managerToken, branchToken, gradeToken, idToken) => {
    setLoginAccess(true);
    setUid(uidToken);
    setManager(managerToken);
    setBranch(branchToken);
    setGrade(gradeToken);
    setId(idToken);

    // 로컬 스토리지에 토큰 저장
    localStorage.setItem("Access", true);
    localStorage.setItem("S1", uidToken);
    localStorage.setItem("S2", managerToken);
    localStorage.setItem("S3", branchToken);
    localStorage.setItem("S4", gradeToken);
    localStorage.setItem("S5", idToken);
  };

  // 로그아웃 시
  const logout = () => {
    setLoginAccess(false);
    setUid("");
    setManager("");
    setBranch("");
    setGrade("");
    setId("");

    // 로컬 스토리지에서 토큰 삭제
    localStorage.removeItem("Access");
    localStorage.removeItem("S1");
    localStorage.removeItem("S2");
    localStorage.removeItem("S3");
    localStorage.removeItem("S4");
    localStorage.removeItem("S5");

    alert("로그아웃 되었습니다.");
  };

  const decodeS1 = () => {
    try {
      if (uid) {
        return jwtDecode(uid).uid;
      }
      return null;
    } catch (error) {
      console.error("S1 디코딩 에러:", error);
      return null;
    }
  };
  const decodeS2 = () => {
    try {
      if (manager) {
        return jwtDecode(manager).manager;
      }
      return null;
    } catch (error) {
      console.error("S2 디코딩 에러:", error);
      return null;
    }
  };
  const decodeS3 = () => {
    try {
      if (branch) {
        return jwtDecode(branch).branch;
      }
      return null;
    } catch (error) {
      console.error("S3 디코딩 에러:", error);
      return null;
    }
  };

  const decodeS4 = () => {
    try {
      if (grade) {
        return jwtDecode(grade).grade;
      }
      return null;
    } catch (error) {
      console.error("S4 디코딩 에러:", error);
      return null;
    }
  };
  const decodeS5 = () => {
    try {
      if (id) {
        return jwtDecode(id).id;
      }
      return null;
    } catch (error) {
      console.error("S5 디코딩 에러:", error);
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        loginAccess,
        login,
        logout,
        uid,
        manager,
        branch,
        grade,
        id,
        decodeS1,
        decodeS2,
        decodeS3,
        decodeS4,
        decodeS5,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
