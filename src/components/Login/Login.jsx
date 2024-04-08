import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const { login, decodeS4 } = useAuth(); // 로그인 시 데이터
  const [id, setId] = useState(""); // 로그인 시 ID
  const [password, setPassword] = useState(""); // 비밀번호
  const idInputRef = useRef(null); // ID input 위치
  const passwordInputRef = useRef(null); // PW input 위치
  const navigate = useNavigate();

  // 접속 시 id입력칸에 focus
  useEffect(() => {
    if (idInputRef.current) {
      idInputRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 입력값 체크
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
        // S1 ~ S5 - 서버에서 생성된 토큰값
        const { S1, S2, S3, S4, S5 } = res.data;
        login(S1, S2, S3, S4, S5); //서버에서 생성된 S1 ~ S5 토큰값 context에 저장
        alert(`[ ${id} ]님 환영합니다.`);
      } else {
        //로그인실패 시 false일 때 조건(서버에존재)에 따라 메세지출력
        if (res.data.success === false) {
          alert(res.data.message);
        }
        setId("");
        setPassword("");
        if (idInputRef.current) {
          idInputRef.current.focus();
        }
      }
    } catch (error) {
      console.error("로그인실패:", error);
    }
  };

  // ID/PW찾기
  const searchHandle = () => {
    navigate("/search");
  };
  // 회원가입
  const registerHandle = () => {
    navigate("/register");
  };

  return (
    <div className="login_wrap">
      <div className="login_back">
        <form onSubmit={handleSubmit} className="input_wrap">
          <div className="input_back">
            <div className="logo_title_box">
              <div className="logo_img"></div>
              <div className="logo_title">웰라이프케어입니다.</div>
              <div className="logo_title">
                서비스 이용을 위해 로그인 해주세요.
              </div>
            </div>
            <div className="input_box">
              <input
                type="text"
                placeholder="아이디를 입력하세요"
                value={id}
                onChange={(e) => setId(e.target.value)}
                ref={idInputRef}
                className="login_input"
              />
              <input
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                ref={passwordInputRef}
                className="login_input"
              />
            </div>
            <div className="login_check_box">
              <input type="checkbox" id="re_id" className="login_check" />
              <label className="login_label" htmlFor="re_id">
                아이디 저장
              </label>
            </div>
            <button className="login_btn" type="submit">
              로그인
            </button>
            <div className="bottom_btn_box">
              <div className="bottom_btn" onClick={() => registerHandle()}>
                회원가입
              </div>
              <div className="bottom_btn" onClick={() => searchHandle()}>
                ID/PW찾기
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Login;
