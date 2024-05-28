import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import moment from "moment";
import Axios from "axios";

const Mypage = () => {
  const { decodeS1 } = useAuth();
  const [myData, setMyData] = useState([]);
  const [passStatus, setPassStatus] = useState(false);
  const [password, setNewPass] = useState("");
  const [depositStatus, setDepositStatus] = useState(false);
  const [deposit_account, setNewDeposit] = useState("");
  const [bankStatus, setBankStatus] = useState(false);
  const [bank, setNewBank] = useState("");
  const [phoneStatus, setPhoneStatus] = useState(false);
  const [tel1, setTel1] = useState(""); // 연락처1
  const [tel2, setTel2] = useState(""); // 연락처2
  const [tel3, setTel3] = useState(""); // 연락처3
  const [emailStatus, setEmailStatus] = useState(false);
  const [email, setNewEmail] = useState(""); // 이메일;

  useEffect(() => {
    getMyData();
  }, []); // 빈 배열 전달하여 한 번만 실행되도록 함

  const getMyData = async () => {
    try {
      const response = await Axios.get("http://localhost:3001/api/get/mydata", {
        params: {
          uid: decodeS1(),
        },
      });
      const allData = response.data.data;
      console.log(allData);
      setMyData(allData[0]);
    } catch (error) {
      console.error("Error fetching list:", error);
    }
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

  const handleSubmit = async (key, value) => {
    console.log(key, value);
    if (value === "") {
      alert("입력된 값이 없습니다.");
      return;
    }
    let sendParams = {};
    if (key === "phone") {
      if (tel1 === "" || tel2 === "" || tel3 === "") {
        alert("입력된 값이 없습니다.");
        return;
      } else {
        sendParams.phone = `${tel1}-${tel2}-${tel3}`;
      }
    } else {
      sendParams[key] = value;
    }

    sendParams.uid = myData.uid;

    console.log(sendParams);

    try {
      const response = await Axios.post(
        "http://localhost:3001/api/post/mypage_edit",
        sendParams
      );

      console.log(response.data);
      alert("수정되었습니다.");
      window.location.reload();
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  return (
    <div className="main_wrap">
      <div className="main_back home">
        <div className="main_title_box blank">마이페이지</div>
        <div className="main_sub_title">
          연락처 및 개인 정보를 수정할 수 있습니다.
        </div>
        <div className="mypage_area">
          {/* <div className="mypage_container top">
            <div className="mypage_title_box">
              <div className="mypage_title">프로필 사진</div>
              <div className="mypage_title sub">프로필 사진을 등록하여 계정을 맞춤설정합니다.</div>
            </div>
            <div className="profile_box">
              <div className="profile_img_box">
                <div className="profile_img"></div>
              </div>
              <div className="profile_btn_box">
                <div className="profile_btn edit">수정</div>
                <div className="profile_btn">삭제</div>
              </div>
            </div>
          </div> */}
          <div className="mypage_container">
            <div className="mypage_title_box">
              <div className="mypage_title">내 정보</div>
              <div className="mypage_title sub">
                유저의 개인 정보를 수정할 수 있습니다.
              </div>
            </div>
            <div className="mypage_contents_box">
              <div className="my_row">
                <div className="my_text title">가입일</div>
                <div className="my_text">{myData.date}</div>
              </div>
              <div className="my_row">
                <div className="my_text title">소속지점</div>
                <div className="my_text">
                  {myData.branch_type} {myData.company_name} {myData.branch}
                </div>
              </div>
              <div className="my_row">
                <div className="my_text title">아이디</div>
                <div className="my_text">{myData.id}</div>
              </div>
              <div className="my_row">
                <div className="my_text title">비밀번호</div>
                {!passStatus ? (
                  <div className="my_text">********</div>
                ) : (
                  <div className="my_text">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setNewPass(e.target.value)}
                      placeholder="비밀번호를 입력해주세요."
                      className="mypage_input"
                    ></input>
                  </div>
                )}
                {!passStatus ? (
                  <div className="my_btn" onClick={() => setPassStatus(true)}>
                    수정하기
                  </div>
                ) : (
                  <div
                    className="my_btn"
                    onClick={() => handleSubmit("password", password)}
                  >
                    수정완료
                  </div>
                )}
              </div>
              <div className="my_row">
                <div className="my_text title">이메일</div>
                {!emailStatus ? (
                  <div className="my_text">{myData.email}</div>
                ) : (
                  <div className="my_text">
                    <input
                      value={email}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="이메일을 입력해주세요."
                      className="mypage_input"
                    ></input>
                  </div>
                )}
                {!emailStatus ? (
                  <div className="my_btn" onClick={() => setEmailStatus(true)}>
                    수정하기
                  </div>
                ) : (
                  <div
                    className="my_btn"
                    onClick={() => handleSubmit("email", email)}
                  >
                    수정완료
                  </div>
                )}
              </div>
              <div className="my_row">
                <div className="my_text title">연락처</div>
                {!phoneStatus ? (
                  <div className="my_text">{myData.phone}</div>
                ) : (
                  <div className="my_text">
                    <input
                      type="number"
                      value={tel1}
                      onChange={(e) => handlePhone(e, "tel1")}
                      id="tel"
                      maxlength="3"
                      className="mypage_input"
                    />
                    &nbsp;-&nbsp;
                    <input
                      type="number"
                      value={tel2}
                      onChange={(e) => handlePhone(e, "tel2")}
                      id="tel2"
                      maxlength="4"
                      className="mypage_input"
                    />
                    &nbsp;-&nbsp;
                    <input
                      type="number"
                      value={tel3}
                      onChange={(e) => handlePhone(e, "tel3")}
                      id="tel3"
                      maxlength="4"
                      className="mypage_input"
                    />
                  </div>
                )}
                {!phoneStatus ? (
                  <div className="my_btn" onClick={() => setPhoneStatus(true)}>
                    수정하기
                  </div>
                ) : (
                  <div className="my_btn" onClick={() => handleSubmit("phone")}>
                    수정완료
                  </div>
                )}
              </div>

              <div className="my_row">
                <div className="my_text title">은행</div>
                {!bankStatus ? (
                  <div className="my_text">{myData.bank}</div>
                ) : (
                  <div className="my_text">
                    <select
                      value={bank}
                      onChange={(e) => setNewBank(e.target.value)}
                      className="mypage_select"
                    >
                      <option value="">은행 선택</option>
                      <option value="KB국민은행">KB국민은행</option>
                      <option value="우리은행">우리은행</option>
                      <option value="SC제일은행">SC제일은행</option>
                      <option value="한국씨티은행">한국씨티은행</option>
                      <option value="하나은행">하나은행</option>
                      <option value="신한은행">신한은행</option>
                      <option value="케이뱅크">케이뱅크</option>
                      <option value="카카오뱅크">카카오뱅크</option>
                      <option value="토스뱅크">토스뱅크</option>
                      <option value="한국산업은행">한국산업은행</option>
                      <option value="중소기업은행">중소기업은행</option>
                      <option value="한국수출입은행">한국수출입은행</option>
                      <option value="수협은행">수협은행</option>
                      <option value="NH농협은행">NH농협은행</option>
                      <option value="대구은행">대구은행</option>
                      <option value="부산은행">부산은행</option>
                      <option value="경남은행">경남은행</option>
                      <option value="광주은행">광주은행</option>
                      <option value="전북은행">전북은행</option>
                      <option value="제주은행">제주은행</option>
                    </select>
                  </div>
                )}
                {!bankStatus ? (
                  <div className="my_btn" onClick={() => setBankStatus(true)}>
                    수정하기
                  </div>
                ) : (
                  <div
                    className="my_btn"
                    onClick={() => handleSubmit("bank", bank)}
                  >
                    수정완료
                  </div>
                )}
              </div>
              <div className="my_row">
                <div className="my_text title">계좌번호</div>
                {!depositStatus ? (
                  <div className="my_text">{myData.deposit_account}</div>
                ) : (
                  <div className="my_text">
                    <input
                      type="number"
                      value={deposit_account}
                      onChange={(e) => setNewDeposit(e.target.value)}
                      placeholder="계좌번호를 입력해주세요."
                      className="mypage_input"
                    ></input>
                  </div>
                )}
                {!depositStatus ? (
                  <div
                    className="my_btn"
                    onClick={() => setDepositStatus(true)}
                  >
                    수정하기
                  </div>
                ) : (
                  <div
                    className="my_btn"
                    onClick={() =>
                      handleSubmit("deposit_account", deposit_account)
                    }
                  >
                    수정완료
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mypage;
