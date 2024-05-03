import React, { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [loginAccess, setLoginAccess] = useState(false); // 로그인 여부
  const [uid, setUid] = useState(""); // UID
  const [branch, setBranch] = useState(""); // 지점
  const [name, setName] = useState(""); // 매니저 이름
  const [grade, setGrade] = useState(""); // 등급
  const [branchIdx, setBranchIdx] = useState(""); //지점별
  const [id, setId] = useState(""); // 로그인 시 ID
  //const [remainingSessionTime, setRemainingSessionTime] = useState(null); // 남은세션시간
  const navigate = useNavigate();

  //로그인(로드 시) 초기데이터
  useEffect(() => {
    const storedAccess = Cookies.get("Access");
    if (storedAccess === "true") {
      setLoginAccess(true);
      const storedS0 = Cookies.get("S0");
      const storedS1 = Cookies.get("S1");
      const storedS2 = Cookies.get("S2");
      const storedS3 = Cookies.get("S3");
      const storedS4 = Cookies.get("S4");
      const storedS5 = Cookies.get("S5");

      if (storedS0) setBranchIdx(storedS0);
      if (storedS1) setUid(storedS1);
      if (storedS2) setName(storedS2);
      if (storedS3) setBranch(storedS3);
      if (storedS4) setGrade(storedS4);
      if (storedS5) setId(storedS5);
    }
  }, []);

  // useEffect(() => {
  //   if (loginAccess) {
  //     const timeout = 900000; // 15분
  //     let remainingTime = timeout;

  //     const timer = setInterval(() => {
  //       remainingTime -= 1000;
  //       if (remainingTime <= 0) {
  //         clearInterval(timer);
  //         logout2();
  //       } else {
  //         const minutes = Math.floor(remainingTime / 60000);
  //         const seconds = Math.floor((remainingTime % 60000) / 1000);
  //         setRemainingSessionTime({ minutes, seconds });
  //       }
  //     }, 1000);

  //     return () => clearInterval(timer);
  //   }
  // }, [loginAccess]);

  //로그인
  const login = (
    branchIdxToken,
    uidToken,
    nameToken,
    branchToken,
    gradeToken,
    idToken
  ) => {
    setLoginAccess(true);
    setBranchIdx(branchIdxToken);
    setUid(uidToken);
    setName(nameToken);
    setBranch(branchToken);
    setGrade(gradeToken);
    setId(idToken);

    // 세션 쿠키 설정 (브라우저 종료 시 삭제되지 않도록 만료 기간 설정)
    Cookies.set("Access", true);
    Cookies.set("S0", branchIdxToken);
    Cookies.set("S1", uidToken);
    Cookies.set("S2", nameToken);
    Cookies.set("S3", branchToken);
    Cookies.set("S4", gradeToken);
    Cookies.set("S5", idToken);
  };

  //로그아웃
  const logout = () => {
    setLoginAccess(false);
    setBranchIdx("");
    setUid("");
    setName("");
    setBranch("");
    setGrade("");
    setId("");
    Cookies.remove("Access");
    Cookies.remove("S0");
    Cookies.remove("S1");
    Cookies.remove("S2");
    Cookies.remove("S3");
    Cookies.remove("S4");
    Cookies.remove("S5");
    alert("로그아웃 되었습니다.");
    navigate("/");
  };

  // //세션만료 로그아웃
  // const logout2 = () => {
  //   alert("세션시간이 만료되었습니다.\n다시 로그인해주세요.");
  //   navigate("/", { replace: true });
  //   window.location.reload();
  //   setLoginAccess(false);
  //   setBranchIdx("");
  //   setUid("");
  //   setName("");
  //   setBranch("");
  //   setGrade("");
  //   setId("");
  //   Cookies.remove("Access");
  //   Cookies.remove("S0");
  //   Cookies.remove("S1");
  //   Cookies.remove("S2");
  //   Cookies.remove("S3");
  //   Cookies.remove("S4");
  //   Cookies.remove("S5");
  // };

  // Branch_idx 토큰 디코딩
  const decodeS0 = () => {
    try {
      if (branchIdx) {
        return jwtDecode(branchIdx).branch_idx;
      }
      return null;
    } catch (error) {
      console.error("S0 디코딩 에러:", error);
      return null;
    }
  };

  // JWT 토큰 디코딩
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
      if (name) {
        return jwtDecode(name).name;
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
        const decodeGrade = jwtDecode(grade).grade;
        switch (decodeGrade) {
          case 1: {
            return "슈퍼관리자";
          }
          case 2: {
            return "지점관리자";
          }
          case 3: {
            return "영업사원";
          }
        }
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
        loginAccess, // 로그인여부
        login, // 로그인 시 토큰값 저장
        logout, // 로그아웃 시 토큰값 삭제
        uid, // UID
        name, //매니저이름
        branch, //지점명
        grade, //등급
        id, //로그인 시 아이디
        //remainingSessionTime, // 세션 만료까지 남은 시간

        decodeS0,
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

//다른 컴포넌트에서 사용할 useAuth(이름변경가능)
export const useAuth = () => {
  return useContext(AuthContext);
};
