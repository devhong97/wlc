import React, { useEffect, useState } from "react";
import Axios from "axios";
import HospitalProductModal from "./HospitalProductModal";

const HospitalWriteModal = (props) => {
  const [selectedCity, setSelectedCity] = useState(""); // 지역(시) 선택
  const [selectedDistrict, setSelectedDistrict] = useState(""); // 지역(도) 선택
  const [cities, setCities] = useState([]); //지역(시)
  const [districts, setDistricts] = useState([]); //지역(도)
  const [productModal, setProductModal] = useState(false); // 검진가능상품
  const [selectedProduct, setSelectedProduct] = useState([]); //검진등록상품
  const [mode, setMode] = useState("write");

  const [name, setName] = useState(""); // 병원명
  const [tel1, setTel1] = useState(""); // 연락처1
  const [tel2, setTel2] = useState(""); // 연락처2
  const [tel3, setTel3] = useState(""); // 연락처3

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

  useEffect(() => {
    // 지역(시) 데이터 호출
    Axios.get("http://localhost:3001/api/get/cities")
      .then((response) => {
        setCities(response.data);
      })
      .catch((err) => {
        console.error("(시)호출 실패:", err);
      });
  }, []);

  // 지역(시) 선택 시 일치하는 지역(도) 데이터 호출
  const handleCityChange = (event) => {
    const selectedCity = event.target.value;
    setSelectedCity(selectedCity);
    // 지역(시) 선택값 없거나 초기값이면 리셋
    if (selectedCity === "" || selectedCity === "시 선택") {
      setDistricts([]);
      return;
    }

    // 선택된 시에 해당하는 도 데이터 호출
    Axios.get(`http://localhost:3001/api/get/districts/${selectedCity}`)
      .then((response) => {
        setDistricts(response.data);
      })
      .catch((err) => {
        console.error(`(도)호출 실패 ${selectedCity}:`, err);
      });
  };

  // 검진상품 선택 모달창 OPEN 버튼
  const productModalOpen = () => {
    setProductModal(!productModal);
  };

  //모달 초기화
  const clearModal = () => {
    props.closeModal();
  };

  //지점 등록버튼
  const handleSubmit = async () => {
    if (name === "") {
      alert("병원명을 입력해주세요.");
      const nameInput = document.getElementById("user_name");
      if (nameInput) {
        nameInput.focus();
      }
      return;
    } else if (tel1 === "" || tel2 === "" || tel3 === "") {
      alert("연락처를 입력해주세요.");
      const numberInput = document.getElementById("user_number");
      if (numberInput) {
        numberInput.focus();
      }
      return;
    } else if (selectedCity === "") {
      alert("지역(도)를 선택해주세요.");
      const provinceInput = document.getElementById("user_province");
      if (provinceInput) {
        provinceInput.focus();
      }
      return;
    } else if (selectedDistrict === "") {
      alert("지역(시)를 선택해주세요.");
      const cityInput = document.getElementById("user_city");
      if (cityInput) {
        cityInput.focus();
      }
      return;
    }

    // 선택한 지역(시)와 지역(도) 합쳐서 서버로 전송
    const number = `${tel1}-${tel2}-${tel3}`;

    // 병원등록
    Axios.post("http://localhost:3001/api/post/hospital_write", {
      hospitalName: name,
      number: number,
      province: selectedCity,
      city: selectedDistrict,
      yProduct: selectedProduct,
    })
      .then((res) => {
        console.log(res.data);
        alert(`[${name}]\n병원등록이 완료되었습니다.`);
        clearModal();
        window.location.reload();
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
            <div className="modal_title">병원 등록</div>
            <div className="modal_close_btn" onClick={() => clearModal()}>
              X
            </div>
          </div>

          <div className="table_box">
            <div className="table_row">
              <div className="table_section">
                <div className="table_title">
                  병원명<p className="title_point">*</p>
                </div>
                <div className="table_contents w100">
                  <input
                    className="table_input modal"
                    type="text"
                    id="user_name"
                    placeholder="병원명을 입력해주세요."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                    className="table_input num"
                  />
                  &nbsp;-&nbsp;
                  <input
                    type="phone"
                    value={tel2}
                    onChange={(e) => handlePhone(e, "tel2")}
                    id="tel2"
                    maxlength="4"
                    className="table_input num"
                  />
                  &nbsp;-&nbsp;
                  <input
                    type="phone"
                    value={tel3}
                    onChange={(e) => handlePhone(e, "tel3")}
                    id="tel3"
                    maxlength="4"
                    className="table_input num"
                  />
                </div>
              </div>
            </div>
            <div className="table_box">
              <div className="table_row">
                <div className="table_section">
                  <div className="table_title">
                    지역(시, 도)<p className="title_point">*</p>
                  </div>
                  <div className="table_contents w100">
                    <select
                      name="city"
                      id="user_province"
                      value={selectedCity}
                      onChange={handleCityChange}
                      className="table_select"
                    >
                      <option value="">시 선택</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                    <select
                      name="district"
                      id="user_city"
                      value={selectedDistrict}
                      onChange={(event) =>
                        setSelectedDistrict(event.target.value)
                      }
                      className="table_select"
                    >
                      <option value="">도 선택</option>
                      {districts.map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            {/*<div className="table_row">
              <div className="table_section">
                <div className="table_title">
                  검진가능상품<p className="title_point">*</p>
                </div>
                <div className="table_contents w100">
                  <select
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    id="user_compnayName"
                    className="table_select"
                  >
                    <option value="">선택</option>
                    {proudctGroup.map((type, index) => {
                      return (
                        <option key={index} value={type}>
                          {type}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </div>*/}
            <div className="table_row">
              <div className="table_section">
                <div className="table_title">
                  검진회원수<p className="title_point">*</p>
                </div>
                <div className="table_contents w100">0</div>
              </div>
            </div>
            <div className="table_row">
              <div className="table_section">
                <div className="table_title">검진가능상품</div>
                <div className="table_contents w100">
                  <div className="table_inner_text">
                    [&nbsp;
                    {selectedProduct.map((product, index) => (
                      <span key={index}>
                        {product.product1}
                        {index !== selectedProduct.length - 1 && ", "}
                      </span>
                    ))}
                    &nbsp;]
                  </div>
                  <div
                    className="table_inner_btn"
                    onClick={() => productModalOpen()}
                  >
                    선택
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal_footer_box">
            <div className="modal_btn" onClick={handleSubmit}>
              등록
            </div>
            <div className="modal_btn close" onClick={clearModal}>
              닫기
            </div>
          </div>
        </div>
      </div>
      {productModal && (
        <HospitalProductModal
          closeModal={productModalOpen}
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct} // setSelectedProduct을 props로 전달합니다.
          setMode={mode}
        ></HospitalProductModal>
      )}
    </div>
  );
};

export default HospitalWriteModal;
