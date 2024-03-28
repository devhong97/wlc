import React, { useState } from "react";
import Axios from "axios";
import { useReservContext } from "../Context/ReservContext";
import { useNavigate } from "react-router-dom";
import SignComponent from "./SignComponent";

const ReservCustomer = () => {
  const { signData1, signData2, setCustomerData, customerData, uploadFiles } = useReservContext();
  const [step, setStep] = useState(1);
  const [name, setName] = useState(customerData.name || "");
  const [customerName, setCustomerName] = useState(customerData.customerName || "");
  const [phone, setPhone] = useState(customerData.phone || "");
  const [agreeTerms, setAgreeTerms] = useState(false); // 약관동의
  const navigation = useNavigate();
  const moveSecondStep = () => {
    if (name === "" || customerName === "" || phone === "") {
      alert("정보를 모두 입력해주세요.");
      return;
    }
    setStep(2);
  };
  const handleAgreeTerms = (e) => {
    setAgreeTerms(e.target.checked);
  };
  const moveThirdStep = () => {
    if (!agreeTerms) {
      alert("약관에 동의해주세요.");
      return;
    }
    setStep(3);
  };

  const checkSign = () => {
    console.log(signData1, signData2);
    if (signData1 === "" || signData2 === "") {
      alert("서명란의 완료버튼을 눌러주세요");
    } else {
      setCustomerData({
        name: name,
        customerName: customerName,
        phone: phone
      });

      navigation("/reserv/check");
    }
  }
  return (
    <div className="reserv_wrap">
      {step === 1 && (
        <div className="reserv_back">
          <div className="reserv_top_box">
            <div className="reserv_title">
              고객님의 <p className="point_text">정보</p>를 입력하세요.
            </div>
          </div>
          <div className="reserv_bottom_box">
            <div className="reserv_input_box">
              <input
                className="reserv_input"
                placeholder="계약자 성명"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></input>
            </div>
            <div className="reserv_input_box">
              <input
                className="reserv_input"
                placeholder="검진자 성명"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
              ></input>
            </div>
            <div className="reserv_input_box">
              <input
                className="reserv_input"
                placeholder="연락처"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              ></input>
            </div>
          </div>
          <div className="reserv_btn_box">
            <div className="reserv_btn" onClick={() => moveSecondStep()}>
              다음
            </div>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="reserv_back">
          <div className="reserv_top_box">
            <div className="reserv_title">
              약관에 <p className="point_text">동의</p>해주세요.
            </div>
          </div>
          <div className="reserv_bottom_box">
            <div className="terms_box">
              <div className="terms_title">개인정보 동의 약관</div>
              <div className="terms_text">약관 내용~~</div>
            </div>
            <div className="terms_checkbox">
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
          </div>
          <div className="reserv_btn_box">
            <div className="reserv_btn" onClick={() => moveThirdStep()}>
              다음
            </div>
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="reserv_back sign">
          <div className="reserv_top_box">
            <div className="reserv_title">
              <p className="point_text">서명</p>해주세요.
            </div>
          </div>
          <div className="reserv_bottom_box sign">
            <SignComponent></SignComponent>
          </div>
          <div className="reserv_btn_box">
            <div className="reserv_btn" onClick={() => checkSign()}>
              다음
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservCustomer;
