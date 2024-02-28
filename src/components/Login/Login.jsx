import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useAuth(); //로그인확인
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const idInputRef = useRef(null);
  const passwordInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (idInputRef.current) {
      idInputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (id === "") {
      alert("아이디를 입력해주세요.");
      if (idInputRef.current) {
        idInputRef.current.focus();
      }
      return;
    } else if (password === "") {
      alert("비밀번호를 입력해주세요.");
      if (passwordInputRef.current) {
        passwordInputRef.current.focus();
      }
      return;
    }

    try {
      const res = await axios.post("http://localhost:3001/api/post/login", {
        id,
        password,
      });
      if (res.data.success) {
        const { S1, S2, S3, S4, S5 } = res.data;
        login(S1, S2, S3, S4, S5); //서버에서 생성된 세션정보 context에 저장
        alert(`[ ${S5} ]님 환영합니다.`);
      } else {
        alert("아이디 또는 비밀번호를 확인해주세요.");
        setId("");
        setPassword("");
        if (idInputRef.current) {
          idInputRef.current.focus();
        }
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const registerHandle = () => {
    navigate("/register");
  };

  return (
    <div className="login-wrap">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-wrap">
          <input
            type="text"
            placeholder="ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
            ref={idInputRef}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            ref={passwordInputRef}
          />
          <button type="submit">Login</button>
          <button type="button" onClick={() => registerHandle()}>
            Join
          </button>
        </div>
      </form>
    </div>
  );
};
export default Login;
