import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PwChangeModal = (props) => {
  const [userIdx, setUserIdx] = useState("");
  const [password, setPassword] = useState(""); //비밀번호
  const [passwordChk, setPasswordChk] = useState(""); //비밀번호 체크
  const [regexMessage, setRegexMessage] = useState(""); //비밀번호 유효성검사
  const navigate = useNavigate();

  useEffect(() => {
    if (props.userData) {
      //console.log(props.userData.idx);
      setUserIdx(props.userData.idx);
    }
  }, [props.userData]);

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

  //모달 초기화
  const clearModal = () => {
    props.closeModal(false);
  };

  const handleSubmit = () => {
    if (password === "") {
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

    Axios.post("https://www.wlcare.co.kr:8443/api/post/edit_password", {
      password: password,
      idx: userIdx,
    })
      .then((res) => {
        //console.log(res.data);
        alert(`비밀번호 변경이 완료되었습니다.`);
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="modal_wrap">
      <div className="modal_back">
        <div className="modal_box">
          <div className="modal_title_box">
            <div className="modal_title">비밀번호 변경</div>
            <div className="modal_close_btn" onClick={() => clearModal()}>
              X
            </div>
          </div>

          <div className="table_box">
            <div className="table_row">
              <div className="table_section">
                <div className="table_title">
                  비밀번호 입력<p className="title_point">*</p>
                </div>
                <div className="table_contents w100">
                  <input
                    className="table_input modal"
                    type="password"
                    id="user_password"
                    placeholder="비밀번호를 입력해주세요."
                    value={password}
                    onChange={handlePw}
                  ></input>
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
              </div>
            </div>
            <div className="table_row">
              <div className="table_section">
                <div className="table_title">
                  비밀번호 재입력<p className="title_point">*</p>
                </div>
                <div className="table_contents w100">
                  <input
                    className="table_input modal"
                    type="password"
                    value={passwordChk}
                    onChange={handlePwChk}
                    placeholder="비밀번호를 확인해주세요."
                    id="user_password_chk"
                  ></input>
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
              </div>
            </div>
          </div>

          <div className="modal_footer_box">
            <div className="modal_btn" onClick={handleSubmit}>
              수정
            </div>
            <div className="modal_btn close" onClick={clearModal}>
              닫기
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PwChangeModal;
