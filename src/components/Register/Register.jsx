import Axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useBranchContext } from "../Context/BranchContext";
const Register = () => {
  const {
    typeGroup,
    companyGroup,
    branchGroup,
    setContextType,
    setContextCompany,
  } = useBranchContext();
  const [id, setId] = useState(""); // 아이디
  const [password, setPassword] = useState(""); //비밀번호
  const [passwordChk, setPasswordChk] = useState(""); //비밀번호 체크
  const [name, setName] = useState(""); // 이름
  const [type, setType] = useState("");
  const [company, setCompany] = useState("");
  const [branchName, setBranchName] = useState("");
  const [branchIdx, setBranchIdx] = useState("");
  const [bank, setBank] = useState(""); // 은행명
  const [depositAccount, setDepositAccount] = useState(""); // 입금계좌
  const [tel1, setTel1] = useState(""); // 연락처1
  const [tel2, setTel2] = useState(""); // 연락처2
  const [tel3, setTel3] = useState(""); // 연락처3
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
  //연락처 체크
  const handlePhone = (e, target) => {
    const value = e.target.value;
    if (target === "tel1" && value.length === 3) {
      document.getElementById("tel2").focus();
    } else if (target === "tel2" && value.length === 4) {
      document.getElementById("tel3").focus();
    } else if (target === "tel3" && value.length === 4) {
    }

    if (target === "tel1") {
      setTel1(value);
    } else if (target === "tel2") {
      setTel2(value);
    } else if (target === "tel3") {
      setTel3(value);
    }
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
  //약관동의 체크
  const handleAgreeTerms = (e) => {
    setAgreeTerms(e.target.checked);
  };
  //입금계좌 체크 (하이픈입력불가)
  function removeBank(input) {
    return input.replace(/[^0-9]/g, "");
  }
  //가입신청 버튼
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
    } else if (type === "") {
      alert("지점종류를 선택해주세요.");
      const companyTypeInput = document.getElementById("user_companyType");
      if (companyTypeInput) {
        companyTypeInput.focus();
      }
      return;
    } else if (company === "") {
      alert("회사를 선택해주세요.");
      const companyNameInput = document.getElementById("user_companyName");
      if (companyNameInput) {
        companyNameInput.focus();
      }
      return;
    } else if (branchName === "") {
      alert("지점을 선택해주세요.");
      const branchInput = document.getElementById("user_branch");
      if (branchInput) {
        branchInput.focus();
      }
      return;
    } else if (name === "") {
      alert("이름을 입력해주세요.");
      const nameInput = document.getElementById("user_name");
      if (nameInput) {
        nameInput.focus();
      }
      return;
    } else if (tel1 === "" || tel2 === "" || tel3 === "") {
      alert("연락처를 입력해주세요.");
      const phoneInput = document.getElementById("user_phone");
      if (phoneInput) {
        phoneInput.focus();
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
    } /* else if (bank === "") {
      alert("은행을 선택해주세요.");
      const bankInput = document.getElementById("user_bank");
      if (bankInput) {
        bankInput.focus();
      }
      return;
    } else if (depositAccount === "") {
      alert("입금계좌를 입력해주세요.");
      const depositAccountInput = document.getElementById(
        "user_depositAccount"
      );
      if (depositAccountInput) {
        depositAccountInput.focus();
      }
      return;
    } */ else if (agreeTerms === false) {
      alert("약관에 동의해주세요.");
      const agreeTermsInput = document.getElementById("user_agreeTerms");
      if (agreeTermsInput) {
        agreeTermsInput.focus();
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

    // 입력값 + 도메인 = asd@asd.com
    const totalEmail = `${email}@${domain}`;
    const totalPhone = `${tel1}-${tel2}-${tel3}`;

    Axios.post("http://localhost:3001/api/post/register", {
      id,
      password,
      name,
      totalPhone,
      type,
      company,
      branchName,
      branchIdx,
      totalEmail,
      bank,
      depositAccount,
      agreeTerms,
    })
      .then((res) => {
        console.log(res.data);
        alert(
          `[${name}]님 회원가입신청이 완료되었습니다.\n지점장 승인 후 로그인이 가능합니다.`
        );
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    setContextType(type);
  }, [type]);
  useEffect(() => {
    setContextCompany(company);
  }, [company]);

  const selectBranch = (num) => {
    setBranchIdx(num);
    const selectedBranch = branchGroup.find((data) => data.idx === Number(num));
    if (selectedBranch) {
      setBranchName(selectedBranch.branch);
    }
  };

  const selectType = (data) => {
    setType(data);
    //지점명 초기화
    setCompany("");
    setBranchIdx("");
    setBranchName("");
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
              <div
                className="confirm_msg"
                style={{ color: idChk ? "#007bff" : "red" }}
              >
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
                  <div
                    className="confirm_msg"
                    style={{ color: regexMessage ? "#007bff" : "red" }}
                  >
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
              <div
                className="confirm_msg"
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
            <div className="input_title">지점종류</div>
            <select
              value={type}
              onChange={(e) => selectType(e.target.value)}
              id="user_companyType"
              className="register_select"
            >
              <option value="">지점종류 선택</option>
              {typeGroup.map((type, index) => {
                return (
                  <option key={index} value={type}>
                    {type}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="input_row">
            <div className="input_title">회사명</div>
            <select
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              id="user_companyName"
              className="register_select"
            >
              <option value="">회사명 선택</option>
              {companyGroup.map((data, index) => {
                return (
                  <option key={index} value={data}>
                    {data}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="input_row">
            <div className="input_title">지점명</div>
            <select
              value={branchIdx}
              onChange={(e) => selectBranch(e.target.value)}
              placeholder="지점명을 입력해주세요."
              id="user_branch"
              className="register_select"
            >
              <option value="">지점명 선택</option>
              {branchGroup.map((data, index) => {
                return (
                  <option key={index} value={data.idx}>
                    {data.branch}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="input_row">
            <div className="input_title">이름</div>
            <input
              type="text"
              id="user_name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력해주세요."
              className="register_input"
            />
          </div>
          <div className="input_row">
            <div className="input_title">연락처</div>
            <input
              type="phone"
              value={tel1}
              onChange={(e) => handlePhone(e, "tel1")}
              id="tel1"
              maxlength="3"
              className="register_input phone"
            />
            <p className="phone_icon">-</p>
            <input
              type="phone"
              value={tel2}
              onChange={(e) => handlePhone(e, "tel2")}
              id="tel2"
              maxlength="4"
              className="register_input phone"
            />
            <p className="phone_icon">-</p>
            <input
              type="phone"
              value={tel3}
              onChange={(e) => handlePhone(e, "tel3")}
              id="tel3"
              maxlength="4"
              className="register_input phone"
            />
          </div>
          <div className="input_row">
            <div className="input_title">이메일</div>
            <input
              type="email"
              value={email}
              onChange={handleEmail}
              id="user_email"
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
          {/* <div className="input_row">
            <div className="input_title">입금계좌</div>
            <select
              value={bank}
              onChange={(e) => setBank(e.target.value)}
              id="user_bank"
              className="register_select"
            >
              <option value="">은행 선택</option>
              <option value="농협">농협</option>
              <option value="기업">기업</option>
              <option value="신한">신한</option>
              <option value="토스뱅크">토스뱅크</option>
            </select>
            <input
              type="text"
              value={depositAccount}
              onChange={(e) => setDepositAccount(removeBank(e.target.value))}
              id="user_depositAccount"
              className="register_input bank"
            />
            </div> */}
          <div className="input_row terms">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={handleAgreeTerms}
              id="user_agreeTerms"
              className="terms_checkbox"
            />
            <label className="terms_label" htmlFor="user_agreeTerms">
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
