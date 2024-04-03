import Axios from "axios";
import React, { useEffect, useState } from "react";

const MyPageViewModal = (props) => {
  const number = props.detailData.phone;
  const parts = number.split("-");

  const [myData, setMyData] = useState("");
  const [email, setEmail] = useState(props.detailData.email || "");
  const [branch, setBranch] = useState(props.detailData.branch || "");
  const [bank, setBank] = useState(props.detailData.bank || "");
  const [deposit, setDeposit] = useState(props.detailData.depositAccount || "");
  const [tel1, setTel1] = useState(parts[0]); // 연락처1
  const [tel2, setTel2] = useState(parts[1]); // 연락처2
  const [tel3, setTel3] = useState(parts[2]); // 연락처3
  const [password, setPassword] = useState(""); //비밀번호
  const [passwordChk, setPasswordChk] = useState(""); //비밀번호 체크
  const [regexMessage, setRegexMessage] = useState(""); //비밀번호 유효성검사

  useEffect(() => {
    setMyData(props.detailData);
  }, []);

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

  // 수정완료버튼
  const handleSubmit = async () => {
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

    const confirmModify = window.confirm(`수정을 완료하시겠습니까?`);
    if (!confirmModify) {
      return;
    }
    try {
      // 연락처
      const number = `${tel1}-${tel2}-${tel3}`;

      const response = await Axios.post(
        "http://localhost:3001/api/post/mypage_modify",
        {
          email: email,
          phone: number,
          bank: bank,
          deposit: deposit,
          password: password,
          idx: props.detailData.idx,
        }
      );
      alert("수정이 완료되었습니다.");
      props.closeModal();
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };

  const clearModal = () => {
    props.closeModal();
  };

  return (
    <div className="modal_wrap">
      <div className="modal_back">
        <div className="modal_box">
          <div className="modal_title_box">
            <div className="modal_title">개인정보 변경</div>
            <div className="modal_close_btn" onClick={() => clearModal()}>
              X
            </div>
          </div>
          <div className="table_box">
            <div className="table_row">
              <div className="table_section">
                <div className="table_title">아이디</div>
                <div className="table_contents w100">{myData.id}</div>
              </div>
            </div>
            <div className="table_row">
              <div className="table_section">
                <div className="table_title">소속지점</div>
                <div className="table_contents w100">{branch}</div>
              </div>
            </div>
            <div className="table_row">
              <div className="table_section">
                <div className="table_title">
                  이메일<p className="title_point">*</p>
                </div>
                <div className="table_contents w100">
                  <input
                    className="table_input modal"
                    type="text"
                    id="title"
                    placeholder="이메일 입력해주세요."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  ></input>
                </div>
              </div>
            </div>
            <div className="table_row">
              <div className="table_section">
                <div className="table_title">
                  연락처<p className="title_point">*</p>
                </div>
                <div className="table_contents w100">
                  <input
                    type="phone"
                    value={tel1}
                    onChange={(e) => handlePhone(e, "tel1")}
                    id="tel"
                    maxlength="3"
                    className="table_input my_num"
                  />
                  &nbsp;-&nbsp;
                  <input
                    type="phone"
                    value={tel2}
                    onChange={(e) => handlePhone(e, "tel2")}
                    id="tel2"
                    maxlength="4"
                    className="table_input my_num"
                  />
                  &nbsp;-&nbsp;
                  <input
                    type="phone"
                    value={tel3}
                    onChange={(e) => handlePhone(e, "tel3")}
                    id="tel3"
                    maxlength="4"
                    className="table_input my_num"
                  />
                </div>
              </div>
            </div>
            <div className="table_row">
              <div className="table_section">
                <div className="table_title">
                  입금계좌<p className="title_point">*</p>
                </div>
                <div className="table_contents w100">
                  <select
                    value={bank}
                    onChange={(e) => setBank(e.target.value)}
                    id="user_bank"
                    className="table_select"
                  >
                    <option value="">선택</option>
                    <option value="농협">농협</option>
                    <option value="기업">기업</option>
                    <option value="신한">신한</option>
                    <option value="토스뱅크">토스뱅크</option>
                  </select>
                  <input
                    className="table_input modal"
                    type="text"
                    id="title"
                    placeholder="계좌를 입력해주세요."
                    value={deposit}
                    onChange={(e) => setDeposit(e.target.value)}
                  ></input>
                </div>
              </div>
            </div>
            <div className="table_row">
              <div className="table_section">
                <div className="table_title">비밀번호 입력</div>
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
                <div className="table_title">비밀번호 재입력</div>
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
            <div className="modal_btn" onClick={() => handleSubmit()}>
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

export default MyPageViewModal;
