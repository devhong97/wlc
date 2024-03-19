import React, { useEffect, useState } from "react";
import Axios from "axios";

const PwSearch = () => {
  const [id, setId] = useState(""); // 아이디
  const [tel1, setTel1] = useState(""); // 연락처1
  const [tel2, setTel2] = useState(""); // 연락처2
  const [tel3, setTel3] = useState(""); // 연락처3
  const [isVerified, setIsVerified] = useState(false); //인증상태 확인
  const [verificationCode, setVerificationCode] = useState(""); //인증번호 상태
  const [verificationInput, setVerificationInput] = useState(false); //인증하기클릭 시 인증여부 상태
  //인증 횟수 및 시간제한
  const [reVerified, setReVerified] = useState(1); // 남은 재인증 횟수
  const [cooldown, setCooldown] = useState(false); // 재인증 횟수 제한 후 재시도 가능한지 여부
  const cooldownTime = 10 * 60 * 1000; // 10분 (밀리초 단위)

  //연락처 형태변경
  const totalPhone = `${tel1}-${tel2}-${tel3}`;

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

  //인증하기 버튼
  const verifiedHandle = () => {
    if (id === "") {
      alert("아이디를 입력해주세요.");
      const idInput = document.getElementById("user_id");
      if (idInput) {
        idInput.focus();
      }
      return;
    } else if (tel1 === "" || tel2 === "" || tel3 === "") {
      alert("연락처를 입력해주세요.");
      const phoneInput = document.getElementById("tel1");
      if (phoneInput) {
        phoneInput.focus();
      }
      return;
    }

    setIsVerified(true); //인증상태 TRUE
    setVerificationInput(true); //인증번호 입력칸 TRUE
  };

  //재인증하기 버튼
  const reVerifiedHandle = () => {
    // 재인증 횟수 체크
    if (reVerified === 3) {
      alert("인증 횟수 초과 10분 후에 시도해주세요.");
      setCooldown(true);
      setTimeout(() => {
        setReVerified(1); // 재인증 시도 횟수 초기화
        setCooldown(false);
      }, cooldownTime);
      return;
    }

    // 재인증 시도 횟수 체크
    if (reVerified <= 3) {
      alert(`재인증 횟수: ${reVerified} [3회 제한]`);
    }

    setReVerified(reVerified + 1); // 재인증 시도 횟수 증가
  };

  const handleSubmit = () => {
    // id와 phone을 서버로 전송하는 요청
    Axios.post("http://localhost:3001/api/post/pw_search", {
      id: id,
      phone: totalPhone,
    })
      .then((res) => {
        if (res.data.success === true) {
          const password = res.data.data[0].password;
          alert(`${id}님의 비밀번호는 [ ${password} ]입니다.`);
        } else {
          alert("일치하는 정보가 없습니다.");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="register_container">
      <div className="input_row">
        <div className="input_title">아이디</div>
        <input
          type="text"
          value={id}
          placeholder="아이디를 입력하세요."
          onChange={(e) => setId(e.target.value)}
          id="user_id"
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
        {isVerified ? (
          <div className="verified" onClick={() => reVerifiedHandle()}>
            재인증하기
          </div>
        ) : (
          <div className="verified" onClick={() => verifiedHandle()}>
            인증하기
          </div>
        )}
      </div>
      {verificationInput && (
        <div className="input_row">
          <div className="input_title">인증번호</div>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className="register_input"
            placeholder="인증번호를 입력하세요."
          />
        </div>
      )}
      {cooldown ? (
        <div className="cooldown_message">10분 후에 다시 시도해주세요.</div>
      ) : null}
      <div className="register_btn_box search">
        <button className="register_btn" onClick={() => handleSubmit()}>
          찾기
        </button>
      </div>
    </div>
  );
};

export default PwSearch;
