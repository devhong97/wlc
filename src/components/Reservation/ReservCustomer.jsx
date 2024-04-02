import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useReservContext } from "../Context/ReservContext";
import { useNavigate } from "react-router-dom";
import SignComponent from "./SignComponent";

const ReservCustomer = () => {
  const { signData1, signData2, setCustomerData, customerData, uploadFiles } = useReservContext();
  const [step, setStep] = useState(1);
  const [name, setName] = useState(customerData.name || "");
  const [customerName, setCustomerName] = useState(customerData.customerName || "");
  const [customerNumber, setCustomerNumber] = useState(customerData.customerNumber || "");
  const [phone, setPhone] = useState(customerData.phone || "");
  const [c_phone, setCPhone] = useState(customerData.cPhone || "");
  const [agreeTerms, setAgreeTerms] = useState(false); // 약관동의
  const [mTerms, setMTerms] = useState(false); // 마켓팅 약관
  const [termsStatus, setTermsStatus] = useState(0);
  const [agreeTermsData, setAgreeTermsData] = useState("")
  const navigation = useNavigate();
  const moveSecondStep = () => {
    if (name === "" || customerName === "" || phone === "" || c_phone === "" || customerNumber === "") {
      alert("정보를 모두 입력해주세요.");
      return;
    }
    setStep(2);
  };
  const handleAgreeTerms = (e) => {
    setAgreeTerms(e.target.checked);
  };
  const handleMterms = (e) => {
    setMTerms(e.target.checked)
  }
  const moveThirdStep = () => {
    if (!agreeTerms) {
      alert("필수 약관에 동의해주세요.");
      return;
    }
    setStep(3);
  };

  const checkSign = () => {
    console.log("여기");
    const newData = {
      name: name,
      customerName: customerName,
      customerNumber: customerNumber,
      phone: phone,
      cPhone: c_phone,
      m_terms: mTerms,
    };
    setCustomerData(newData);
    console.log(newData); // 새로운 데이터 확인
    navigation("/reserv/check");
  };

  const openTerms = (num) => {
    if (termsStatus === 0 || termsStatus !== num) {
      setTermsStatus(num)
    } else if (termsStatus === num) {
      setTermsStatus(0)
    }
  }

  useEffect(() => {
    getTerms();
  }, [])

  const getTerms = async () => {
    try {
      const response = await Axios.get(
        "http://localhost:3001/api/get/terms_data",

      );
      const allData = response.data.terms_info;
      console.log(allData);
      setAgreeTermsData(allData);


    } catch (error) {
      console.error("Error fetching list:", error);
    }
  }

  return (
    <div className="reserv_wrap">
      {step === 1 && (
        <div className="reserv_back">
          <div className="reserv_top_box">
            <div className="reserv_title">
              고객님의 <br /><p className="point_text">정보</p>를 입력하세요.
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
                placeholder="인원수"
                value={customerNumber}
                onChange={(e) => setCustomerNumber(e.target.value)}
              ></input>
            </div>
            <div className="reserv_input_box">
              <input
                className="reserv_input"
                placeholder="계약자 연락처"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              ></input>
            </div>
            <div className="reserv_input_box">
              <input
                className="reserv_input"
                placeholder="검진자 대표 연락처"
                value={c_phone}
                onChange={(e) => setCPhone(e.target.value)}
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
              <div className="terms_contents_btn" onClick={() => openTerms(1)}>
                [자세히 보기]
              </div>
              <div className={`terms_contents_box ${termsStatus === 1 && "active"}`}>
                <div className="terms_contents" dangerouslySetInnerHTML={{ __html: agreeTermsData }}></div>
              </div>
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
                [필수] 약관에 동의합니다.
              </label>
            </div>

          </div>
          <div className="reserv_bottom_box">
            <div className="terms_box">
              <div className="terms_title">마켓팅 동의 약관</div>
              <div className="terms_contents_btn" onClick={() => openTerms(2)}>
                [자세히 보기]
              </div>
              <div className={`terms_contents_box ${termsStatus === 2 && "active"}`}>
                <div className="terms_contents">여기에 넣기!</div>
              </div>
            </div>
            <div className="terms_checkbox">
              <input
                type="checkbox"
                checked={mTerms}
                onChange={handleMterms}
                id="user_mTerms"
                className="terms_checkbox"
              />
              <label className="terms_label" htmlFor="user_mTerms">
                [선택] 약관에 동의합니다.
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
          <div className="reserv_bottom_box sign">
            <SignComponent checkSign={checkSign}></SignComponent>

          </div>
        </div>
      )}
    </div>
  );
};

export default ReservCustomer;
