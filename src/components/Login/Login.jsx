import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const idInputRef = useRef(null);
  const passwordInputRef = useRef(null);

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
      const response = await axios.post(
        "http://localhost:3001/api/post/login",
        {
          id,
          password,
        }
      );
      if (response.data.success) {
        // 로그인 성공 시 loginAccess를 true로 설정
        login();
      } else {
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="login-wrap">
        <h2>Login</h2>
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
        </div>
      </div>
    </form>
  );
};

export default Login;
