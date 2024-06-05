import React, { Fragment, useEffect, useState } from "react";
import Axios from "axios";
import { useReservContext } from "../Context/ReservContext";
import { useLocation, useNavigate } from "react-router-dom";
import SignComponent from "./SignComponent";

const ReservCustomer = () => {
  const {
    signData1,
    signData2,
    setCustomerData,
    customerData,
    uploadFiles,
    hopeLocation,
    setHopeHour,
    hopeHour,
    setHopeMinute,
    hopeMinute,
  } = useReservContext();
  const location = useLocation();
  const [step, setStep] = useState(1);
  const [name, setName] = useState(customerData.name || "");
  // const [customerName, setCustomerName] = useState(
  //   customerData.customerName || ""
  // );
  // const [customerNumber, setCustomerNumber] = useState(
  //   customerData.customerNumber || ""
  // );
  const [phone, setPhone] = useState(customerData.phone || "");
  const [c_phone, setCPhone] = useState(customerData.cPhone || "");
  const [c_addr, setCAddr] = useState(customerData.cAddr || "");
  const [agreeTerms, setAgreeTerms] = useState(false); // 약관동의
  const [mTerms, setMTerms] = useState(false); // 마켓팅 약관
  const [termsStatus, setTermsStatus] = useState(0);
  const [agreeTermsData, setAgreeTermsData] = useState("");
  const [mTermsData, setMTermsData] = useState("");
  const [inputArray, setInputArray] = useState(
    customerData.customerArray || [
      {
        name: "",
      },
    ]
  );
  const [equalStatus, setEqualStatus] = useState(false); //예약자 검진자 동일인물 체크값
  const navigation = useNavigate();

  const moveSecondStep = () => {
    if (
      (!hopeLocation &&
        (name === "" || phone === "" || c_phone === "" || c_addr === "")) ||
      (hopeLocation && (name === "" || phone === "" || c_addr === ""))
    ) {
      alert("정보를 모두 입력해주세요.");
      return;
    }
    setStep(2);
    console.log("여기", inputArray.length);
  };
  const handleAgreeTerms = (e) => {
    setAgreeTerms(e.target.checked);
  };
  const handleMterms = (e) => {
    setMTerms(e.target.checked);
  };
  const moveThirdStep = () => {
    if (!agreeTerms) {
      alert("필수 약관에 동의해주세요.");
      return;
    }
    setStep(3);
  };

  const checkSign = () => {
    const newData = {
      name: name,
      customerArray: inputArray,
      customerNumber: inputArray.length,
      phone: phone,
      cPhone: c_phone,
      cAddr: c_addr,
      m_terms: mTerms,
    };
    setCustomerData(newData);
    console.log(newData); // 새로운 데이터 확인
    navigation("/reserv/check");
  };

  const openTerms = (num) => {
    if (termsStatus === 0 || termsStatus !== num) {
      setTermsStatus(num);
    } else if (termsStatus === num) {
      setTermsStatus(0);
    }
  };

  const handleAllTerms = (e) => {
    setAgreeTerms(e.target.checked);
    setMTerms(e.target.checked);
  };

  useEffect(() => {
    getTerms();
  }, []);

  const getTerms = async () => {
    try {
      const response = await Axios.get(
        "http://localhost:3001/api/get/terms_data"
      );
      const allData = response.data;
      setAgreeTermsData(allData.terms_info);
      setMTermsData(allData.marketing);
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };

  const addInputArray = () => {
    setInputArray((prev) => [...prev, { name: "" }]);
  };
  const deleteInputArray = (index) => {
    setInputArray((prev) => {
      const newArray = [...prev];
      newArray.splice(index, 1);
      return newArray;
    });
  };

  const handleInputArray = (value, index) => {
    setInputArray((prev) => {
      const newArray = [...prev];
      newArray[index] = { name: value };
      return newArray;
    });
  };

  const handleBack = () => {
    if (step === 1) {
      navigation(-1);
    } else if (step === 2) {
      setStep(1);
    } else {
      setStep(2);
    }
  };

  const handleEqualStatus = (e) => {
    if (e.target.checked === true) {
      if (name === "" || phone === "") {
        alert("예약자의 정보를 모두 입력해주세요");
      } else {
        setEqualStatus(e.target.checked);
        setCPhone(phone);
        setInputArray((prev) => {
          const newArray = [...prev];
          newArray[0] = { name: name };
          return newArray;
        });
      }
    } else {
      setEqualStatus(e.target.checked);
      setCPhone("");
      setInputArray((prev) => {
        const newArray = [...prev];
        newArray[0] = { name: "" };
        return newArray;
      });
    }
  };

  return (
    <div className={`reserv_wrap ${step === 3 && "overflow"}`}>
      <div className="back_btn_box">
        <div className="back_btn" onClick={() => handleBack()}>
          뒤로 이동
        </div>
      </div>
      {step === 1 && (
        <Fragment>
          {hopeLocation ? (
            <div className="reserv_back">
              <div className="reserv_top_box">
                <div className="reserv_title">고객 정보</div>
                <div className="reserv_title sub">
                  고객님의 정보를 입력하세요.
                </div>
              </div>
              <div className="reserv_bottom_box">
                <div className="reserv_contents_box">
                  <div className="reserv_input_box">
                    <input
                      className="reserv_input"
                      placeholder="예약자 성명"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    ></input>
                  </div>
                  <div className="reserv_input_box">
                    <input
                      className="reserv_input"
                      placeholder="예약자 연락처"
                      pattern="\d*"
                      type="number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    ></input>
                  </div>
                  <div className="reserv_equal_box">
                    <input
                      type="checkbox"
                      checked={equalStatus}
                      onChange={handleEqualStatus}
                      id="setEqual"
                      className="equal_checkbox"
                    />
                    <label className="equal_label" htmlFor="setEqual">
                      예약자와 검진자가 같으면 체크하세요.
                    </label>
                  </div>
                  <div className="reserv_input_box">
                    {inputArray.map((input, index) => {
                      return (
                        <div className="input_array_box">
                          <input
                            className="reserv_input"
                            placeholder="검진자 성명"
                            value={input.name}
                            onChange={(e) =>
                              handleInputArray(e.target.value, index)
                            }
                          ></input>
                          {index !== 0 && (
                            <div
                              className="delete_input"
                              onClick={() => deleteInputArray(index)}
                            >
                              X
                            </div>
                          )}
                        </div>
                      );
                    })}
                    <div
                      className="reserv_add_btn"
                      onClick={() => addInputArray()}
                    >
                      검진자 추가
                    </div>
                  </div>
                  <div className="reserv_input_box">
                    <input
                      className="reserv_input"
                      pattern="\d*"
                      placeholder="검진자 대표 연락처"
                      value={c_phone}
                      type="number"
                      onChange={(e) => setCPhone(e.target.value)}
                    ></input>
                  </div>
                  <div className="reserv_input_box">
                    <input
                      className="reserv_input"
                      placeholder="검진자 대표 주소"
                      value={c_addr}
                      onChange={(e) => setCAddr(e.target.value)}
                    ></input>
                  </div>
                  <div className="reserv_btn_box">
                    <div
                      className="reserv_btn"
                      onClick={() => moveSecondStep()}
                    >
                      다음
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="reserv_back">
              <div className="reserv_top_box">
                <div className="reserv_title">고객 정보</div>
                <div className="reserv_title sub">
                  고객님의 정보를 입력하세요.
                </div>
              </div>
              <div className="reserv_bottom_box">
                <div className="reserv_contents_box">
                  <div className="reserv_input_box">
                    <input
                      className="reserv_input"
                      placeholder="예약자 성명"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    ></input>
                  </div>
                  <div className="reserv_input_box">
                    <input
                      className="reserv_input"
                      placeholder="예약자 연락처"
                      pattern="\d*"
                      type="number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    ></input>
                  </div>
                  <div className="reserv_equal_box">
                    <input
                      type="checkbox"
                      checked={equalStatus}
                      onChange={handleEqualStatus}
                      id="setEqual"
                      className="equal_checkbox"
                    />
                    <label className="equal_label" htmlFor="setEqual">
                      예약자와 검진자가 같으면 체크하세요.
                    </label>
                  </div>
                  <div className="reserv_input_box">
                    {inputArray.map((input, index) => {
                      return (
                        <div className="input_array_box">
                          <input
                            className="reserv_input"
                            placeholder="검진자 성명"
                            value={input.name}
                            onChange={(e) =>
                              handleInputArray(e.target.value, index)
                            }
                          ></input>
                          {index !== 0 && (
                            <div
                              className="delete_input"
                              onClick={() => deleteInputArray(index)}
                            >
                              X
                            </div>
                          )}
                        </div>
                      );
                    })}
                    <div
                      className="reserv_add_btn"
                      onClick={() => addInputArray()}
                    >
                      검진자 추가
                    </div>
                  </div>
                  <div className="reserv_input_box">
                    <input
                      className="reserv_input"
                      pattern="\d*"
                      placeholder="검진자 대표 연락처"
                      value={c_phone}
                      type="number"
                      onChange={(e) => setCPhone(e.target.value)}
                    ></input>
                  </div>
                  <div className="reserv_input_box">
                    <input
                      className="reserv_input"
                      placeholder="검진자 대표 주소"
                      value={c_addr}
                      onChange={(e) => setCAddr(e.target.value)}
                    ></input>
                  </div>
                  <div className="reserv_btn_box">
                    <div
                      className="reserv_btn"
                      onClick={() => moveSecondStep()}
                    >
                      다음
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Fragment>
      )}
      {step === 2 && (
        <div className="reserv_back">
          <div className="reserv_top_box">
            <div className="reserv_title">약관 동의</div>
            <div className="reserv_title sub">약관에 동의해주세요.</div>
          </div>
          <div className="reserv_bottom_box">
            <div className="reserv_contents_box">
              <div className="terms_checkbox">
                <input
                  type="checkbox"
                  checked={agreeTerms && mTerms}
                  onChange={handleAllTerms}
                  id="all_terms"
                  className="terms_checkbox"
                />
                <label className="terms_label" htmlFor="all_terms">
                  전체 약관에 동의합니다.
                </label>
              </div>
              <br />
              <div className="terms_box">
                <div className="terms_title">개인정보 동의 약관</div>
                <div
                  className="terms_contents_btn"
                  onClick={() => openTerms(1)}
                >
                  [자세히 보기]
                </div>
                <div
                  className={`terms_contents_box ${
                    termsStatus === 1 && "active"
                  }`}
                >
                  <div
                    className="terms_contents"
                    dangerouslySetInnerHTML={{ __html: agreeTermsData }}
                  ></div>
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

              <div className="reserv_bottom_box">
                <div className="terms_box">
                  <div className="terms_title">마케팅 동의 약관</div>
                  <div
                    className="terms_contents_btn"
                    onClick={() => openTerms(2)}
                  >
                    [자세히 보기]
                  </div>
                  <div
                    className={`terms_contents_box ${
                      termsStatus === 2 && "active"
                    }`}
                  >
                    <div
                      className="terms_contents"
                      dangerouslySetInnerHTML={{ __html: mTermsData }}
                    ></div>
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
                <div className="reserv_btn_box">
                  <div className="reserv_btn" onClick={() => moveThirdStep()}>
                    다음
                  </div>
                </div>
              </div>
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
