import Axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [id, setId] = useState(""); // 아이디
  const [password, setPassword] = useState(""); //비밀번호
  const [passwordChk, setPasswordChk] = useState(""); //비밀번호 체크
  const [manager, setManager] = useState(""); // 이름
  const [affiliation, setAffiliation] = useState(""); // 소속
  const [branch, setBranch] = useState(""); // 지점
  const [email, setEmail] = useState(""); // 이메일
  const [domain, setDomain] = useState("gmail.com"); //도메인
  const [agreeTerms, setAgreeTerms] = useState(false); // 약관동의
  //입력값에 따른 조건부액션 처리
  const [idChk, setIdChk] = useState(""); // 아이디 중복체크
  const [regexMessage, setRegexMessage] = useState(""); //비밀번호 유효성검사
  const [domainInput, setDomainInput] = useState(""); //이메일 도메인
  const navigate = useNavigate();

  // 아이디체크
  const handleId = (e) => {
    setId(e.target.value);
    handleIdChk(e.target.value);
  };
  // 아이디 중복체크
  const handleIdChk = (val) => {
    Axios.post("http://localhost:3001/api/post/check_id", {
      id: val,
    })
      .then((res) => {
        const result = res.data;
        if (result.available) {
          setIdChk(true);
        } else {
          setIdChk(false);
        }
      })
      .catch((err) => {
        console.error("Error fetching data: ", err);
      });
  };
  // 비밀번호 체크
  const handlePw = (e) => {
    const password = e.target.value;
    setPassword(password);

    // 비밀번호 유효성검사[대문자, 소문자, 숫자, 특수문자 모두포함 8글자 이상]
    const Regex = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
    );
    if (!Regex.test(password)) {
      setRegexMessage(false); // 조건과 불일치 시 false
    } else {
      setRegexMessage(true); // 조건과 일치할 시 true
    }
  };
  // 비밀번호 중복(재확인) 체크
  const handlePwChk = (e) => {
    const passwordChk = e.target.value;
    setPasswordChk(passwordChk);
  };
  //이메일 체크
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  //이메일 도메인 체크
  const handleDomainChange = (e) => {
    const selectedValue = e.target.value;
    if (selectedValue === "직접입력") {
      setDomainInput(true);
      setDomain("");
    } else {
      setDomainInput(false);
      setDomain(selectedValue);
    }
  };

  const handleSubmit = async () => {
    if (id === "") {
      alert("아이디를 입력해주세요.");
      const idInput = document.getElementById("user_id");
      if (idInput) {
        idInput.focus();
      }
      return;
    } else if (password === "") {
      alert("비밀번호를 입력해주세요.");
      const passwordInput = document.getElementById("user_password");
      if (passwordInput) {
        passwordInput.focus();
      }
      return;
    } else if (password !== passwordChk) {
      alert("비밀번호가 일치하지 않습니다. 다시 확인해주세요.");
      const passwordChkInput = document.getElementById("user_password_chk");
      if (passwordChkInput) {
        passwordChkInput.focus();
      }
      return;
    } else if (manager === "") {
      alert("이름을 입력해주세요.");
      const managerInput = document.getElementById("user_manager");
      if (managerInput) {
        managerInput.focus();
      }
      return;
    } else if (email === "") {
      alert("이메일을 입력해주세요.");
      const emailInput = document.getElementById("user_email");
      if (emailInput) {
        emailInput.focus();
      }
      return;
    } else if (domain === "") {
      alert("도메인을 입력해주세요.");
      const domainInput = document.getElementById("user_domain");
      if (domainInput) {
        domainInput.focus();
      }
      return;
    }
    // 비밀번호 유효성검사 실패 시 리턴
    if (!regexMessage) {
      alert("비밀번호를 다시 입력해주세요.");
      const userPwCheck = document.getElementById("user_password");
      if (userPwCheck) {
        userPwCheck.focus();
      }
      return;
    }

    const totalEmail = `${email}@${domain}`;

    Axios.post("http://localhost:3001/api/post/register", {
      id,
      password,
      manager,
      affiliation,
      branch,
      totalEmail,
      agreeTerms,
    })
      .then((res) => {
        console.log(res.data);
        alert(`${manager}님 회원가입이 완료되었습니다.`);
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="register_wrap">
      <div className="register_back">
        <div className="logo_title_box">
          <div className="logo_img"></div>
          <div className="logo_title">WLC</div>
        </div>
        <div className="register_container">
          <div className="input_row">
            <div className="input_title">아이디</div>
            <input
              type="text"
              value={id}
              onChange={handleId}
              placeholder="아이디를 입력해주세요."
              id="user_id"
              className="register_input"
            />
            {idChk !== "" && (
              <div className="confirm_msg" style={{ color: idChk ? "#007bff" : "red" }}>
                {idChk
                  ? "사용가능한 아이디입니다."
                  : "이미 존재하는 아이디입니다."}
              </div>
            )}
          </div>
          <div className="input_row">
            <div className="input_title">비밀번호</div>
            <input
              type="password"
              value={password}
              onChange={handlePw}
              placeholder="비밀번호를 입력해주세요."
              id="user_password"
              className="register_input"
            />
            {password && (
              <div>
                {regexMessage !== "" && (
                  <div className="confirm_msg" style={{ color: regexMessage ? "#007bff" : "red" }}>
                    {regexMessage
                      ? "사용 가능한 비밀번호입니다."
                      : "비밀번호는 최소 8자 이상이어야 하며, 대문자, 소문자, 숫자, 특수문자를 모두 포함해야 합니다."}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="input_row">
            <div className="input_title blank"></div>
            <input
              type="password"
              value={passwordChk}
              onChange={handlePwChk}
              placeholder="비밀번호를 확인해주세요."
              id="user_password_chk"
              className="register_input"
            />
            {passwordChk && (
              <div className="confirm_msg"
                style={{
                  color: password === passwordChk ? "#007bff" : "red",
                }}
              >
                {password === passwordChk
                  ? "비밀번호가 일치합니다."
                  : "비밀번호가 일치하지 않습니다."}
              </div>
            )}
          </div>
          <div className="input_row">
            <div className="input_title">소속</div>
            <select
              value={affiliation}
              onChange={(e) => setAffiliation(e.target.value)}
              className="register_select"
            >
              <option value="">소속 선택</option>
              <option value="company">Company</option>
              <option value="school">School</option>
              <option value="organization">Organization</option>
            </select>
          </div>
          <div className="input_row">
            <div className="input_title">지점</div>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="register_select"
            >
              <option value="">지점 선택</option>
              <option value="branch1">Branch 1</option>
              <option value="branch2">Branch 2</option>
              <option value="branch3">Branch 3</option>
            </select>
          </div>
          <div className="input_row">
            <div className="input_title">이름</div>
            <input
              type="text"
              id="user_manager"
              value={manager}
              onChange={(e) => setManager(e.target.value)}
              placeholder="이름을 입력해주세요."
              className="register_input"
            />
          </div>
          <div className="input_row">
            <div className="input_title">이메일</div>
            <input
              type="email"
              id="user_email"
              value={email}
              onChange={handleEmail}
              className="register_input email"
            />
            <p className="email_icon">@</p>
            {domainInput && (
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="register_input email"
              />
            )}
            {domainInput === "직접입력" ? "@" : " "}
            <select
              value={domainInput ? "직접입력" : domain}
              onChange={handleDomainChange}
              id="user_domain"
              className="register_select email"
            >
              <option value="gmail.com">gmail.com</option>
              <option value="naver.com">naver.com</option>
              <option value="outlook.com">outlook.com</option>
              <option value="직접입력">직접입력</option>
            </select>
          </div>
          <div className="input_row terms">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.value)}
              className="terms_checkbox"
            />
            <label className="terms_label" htmlFor="agreeTerms">
              약관에 동의합니다.
            </label>
          </div>
          <div className="register_btn_box">
            <button
              type="submit"
              className="register_btn"
              onClick={handleSubmit}
            >
              가입 신청
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
