import React, { useState } from "react";
import Axios from "axios";
import PwChangeModal from "./../modal/PwChangeModal";

const PwSearch = (props) => {
  const [id, setId] = useState(""); // 아이디
  const [tel1, setTel1] = useState(""); // 연락처1
  const [tel2, setTel2] = useState(""); // 연락처2
  const [tel3, setTel3] = useState(""); // 연락처3
  const [isVerified, setIsVerified] = useState(false); // 인증유무 확인
  const [verificationCode, setVerificationCode] = useState(""); //인증번호 입력값
  const [verificationInput, setVerificationInput] = useState(false); //인증하기클릭 시 인증여부 상태
  const [pullCode, setPullCode] = useState(""); // 생성된 인증번호값

  // 인증관련 데이터 초기화(인증번호 입력값 오류 시)
  const resetFields = () => {
    setVerificationCode("");
    setVerificationInput(false);
  };

  //연락처 형태변경
  const totalPhone = `${tel1}-${tel2}-${tel3}`;

  //인증하기 버튼
  const verifiedHandle = () => {
    if (id === "") {
      alert("아이디를 입력해주세요.");
      return;
    } else if (tel1 === "" || tel2 === "" || tel3 === "") {
      alert("연락처를 입력해주세요.");
      return;
    }

    // 서버로 인증코드 요청
    Axios.post(
      "https://www.wlcare.co.kr:8443/api/post/send_verification_code",
      {
        id: id,
        phone: totalPhone,
      }
    )
      .then((res) => {
        if (res.data.success === true) {
          setPullCode(res.data.verifiedCode);
          setVerificationInput(true); // 인증번호 입력칸 활성화
          alert("인증번호가 발송되었습니다.");
        } else {
          alert("인증코드 전송에 실패했습니다.");
        }
      })
      .catch((err) => {
        console.log(err);
        alert("인증코드 전송에 실패했습니다.");
      });
  };

  //확인하기 버튼
  const confirmHandle = () => {
    // 서버로 인증코드 확인 요청
    Axios.post("https://www.wlcare.co.kr:8443/api/post/verify_code_check", {
      code: pullCode, // 랜덤으로 생성된 인증번호값
      inputCode: verificationCode, //사용자가 입력한 인증번호값
    })
      .then((res) => {
        if (res.data.success === true) {
          setIsVerified(true); // 인증 완료
          alert("인증되었습니다.");
        } else {
          alert("인증에 실패했습니다.\n다시 인증해주세요.");
          resetFields();
        }
      })
      .catch((err) => {
        console.log(err);
        alert("인증에 실패했습니다.");
      });
  };

  // 찾기 버튼 클릭 시
  const handleSubmit = () => {
    // 인증이 완료되지 않은 경우
    if (!isVerified) {
      alert("본인인증을 먼저 진행해주세요.");
      return;
    }

    // 서버로 비밀번호 찾기 요청
    Axios.post("https://www.wlcare.co.kr:8443/api/post/pw_change", {
      id: id,
      phone: totalPhone,
    })
      .then((res) => {
        if (res.data.success === true) {
          const data = res.data.data;
          props.setShowPwChangeModal(true); // 비밀번호 변경 모달창 true
          props.setUserData(data); //유저 정보 전달
        } else {
          alert("일치하는 정보가 없습니다.");
        }
      })
      .catch((err) => {
        console.log(err);
        alert("비밀번호 찾기에 실패했습니다.");
      });
  };

  return (
    <div className="register_container">
      <div className="input_row">
        <input
          type="text"
          value={id}
          placeholder="아이디를 입력하세요."
          onChange={(e) => setId(e.target.value)}
          className="search_input"
        />
      </div>

      <div className="input_row">
        <input
          type="number"
          value={tel1}
          onChange={(e) => setTel1(e.target.value)}
          className="register_input short_phone"
          placeholder="010"
        />
        <p className="phone_icon">-</p>
        <input
          type="number"
          value={tel2}
          onChange={(e) => setTel2(e.target.value)}
          className="register_input short_phone"
          placeholder="1234"
        />
        <p className="phone_icon">-</p>
        <input
          type="number"
          value={tel3}
          onChange={(e) => setTel3(e.target.value)}
          className="register_input short_phone"
          placeholder="1234"
        />
        <div className="verified" onClick={verifiedHandle}>
          {verificationInput ? "재발송" : "인증하기"}
        </div>
      </div>
      {verificationInput && (
        <div className="input_row">
          <div className="input_title">인증번호</div>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            className="register_input code_input"
            placeholder="인증번호를 입력하세요."
          />
          <div className="verified" onClick={confirmHandle}>
            확인
          </div>
        </div>
      )}
      <div className="register_btn_box search">
        <button className="register_btn" onClick={() => handleSubmit()}>
          비밀번호 변경
        </button>
      </div>
      {/* {showPwChangeModal && <PwChangeModal />} */}
    </div>
  );
};

export default PwSearch;
