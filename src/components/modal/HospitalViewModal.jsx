import React, { useEffect, useState } from "react";

import Axios from "axios";
import HospitalProductModal from "./HospitalProductModal";
const HospitalViewModal = (props) => {
  const number = props.detailData.number;
  const parts = number.split("-");

  const detailIdx = props.detailIdx;
  const hospitalList = props.hospitalList;

  const [detailNum, setDetailNum] = useState(""); // 상세페이지 Idx
  const [branchDetailData, setBranchDetailData] = useState([]); //병원상세 모달 데이터
  const [type, setType] = useState(""); // 지점종류
  const [name, setName] = useState(props.detailData.name); // 병원명
  const [tel1, setTel1] = useState(parts[0]); // 연락처1
  const [tel2, setTel2] = useState(parts[1]); // 연락처2
  const [tel3, setTel3] = useState(parts[2]); // 연락처3
  const [location, setLocation] = useState(props.detailData.location); //주소

  const [city, setCity] = useState(props.detailData.province); // 현재 지역(도) 데이터 분리
  const [district, setDistrict] = useState(props.detailData.city); // 현재 지역(시) 데이터 분리
  const [cities, setCities] = useState([]); //선택 지역(시)
  const [districts, setDistricts] = useState([]); //선택 지역(도)
  const [selectedProduct, setSelectedProduct] = useState(
    props.detailData.product || ""
  );
  const [defaultProduct, setDefaultProduct] = useState(
    props.detailData.productArray
  );
  const [updateProduct, setUpdateProduct] = useState([]);
  const [deleteProduct, setDeleteProduct] = useState([]);
  const [productModal, setProductModal] = useState(false); // 검진가능상품
  const [choiceData, setChoiceData] = useState("");

  // 선택된 병원의 정보 찾기
  const selectedHospital = hospitalList.find(
    (hospital) => hospital.idx === detailIdx
  );

  // 검진회원수 가져오기
  const userCount = selectedHospital ? selectedHospital.user_count : 0;

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

  // LIST에서 가져온 상세보기 idx 호출
  useEffect(() => {
    if (props.detailIdx) {
      setDetailNum(props.detailIdx);
    }
  }, [props.detailIdx]);

  // // 지역(시) 데이터 호출
  useEffect(() => {
    getCity();
  }, []);
  useEffect(() => {
    getDistrict();
  }, [city]);

  const getCity = () => {
    Axios.get("http://118.67.134.86:3001/api/get/cities")
      .then((response) => {
        setCities(response.data);
      })
      .catch((err) => {
        console.error("(시)호출 실패:", err);
      });
  };
  const getDistrict = () => {
    Axios.get(`http://118.67.134.86:3001/api/get/districts/${city}`)
      .then((response) => {
        setDistricts(response.data);
      })
      .catch((err) => {
        console.error(`(도)호출 실패 ${city}:`, err);
      });
  };

  // 지역(시) 선택 시 일치하는 지역(도) 데이터 호출
  const handleCityChange = (event) => {
    const selectedCity = event.target.value;
    setCity(selectedCity);
    setDistrict("");
    // 지역(시) 선택값 없거나 초기값이면 리셋
    if (selectedCity === "") {
      setDistricts([]);
      return;
    }
  };

  // 수정완료버튼
  const handleSubmit = async () => {
    const confirmModify = window.confirm(`수정을 완료하시겠습니까?`);
    if (!confirmModify) {
      return;
    }
    try {
      // 연락처
      const number = `${tel1}-${tel2}-${tel3}`;
      console.log(name);
      const response = await Axios.post(
        "http://118.67.134.86:3001/api/post/hospital_modify",
        {
          name: name,
          number: number,
          province: city,
          city: district,
          location: location,
          idx: props.detailIdx,
          updateProduct: updateProduct,
          deleteProduct: deleteProduct,
        }
      );
      alert("수정이 완료되었습니다.");
      props.closeModal("reload");
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };
  useEffect(() => {
    console.log(updateProduct);
  }, [updateProduct]);

  //
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      `[${props.detailData.name}] 병원 삭제하시겠습니까?`
    );
    if (!confirmDelete) {
      return;
    }

    const data = {
      name: name,
      city: district,
      province: city,
    };

    try {
      const response = await Axios.post(
        "http://118.67.134.86:3001/api/post/hospital_delete",
        data
      );
      alert("병원이 삭제되었습니다.");
      props.closeModal("reload");
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };

  // 모달창닫기
  const clearModal = (status) => {
    props.closeModal(status);
  };

  // 검진상품 선택 모달창 OPEN 버튼
  const productModalOpen = () => {
    setProductModal(!productModal);
  };

  return (
    <div className="modal_wrap">
      <div className="modal_back">
        <div className="modal_box">
          <div className="modal_title_box">
            <div className="modal_title">병원 상세</div>
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
                    id="title"
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
                    type="number"
                    value={tel1}
                    onChange={(e) => handlePhone(e, "tel1")}
                    id="tel"
                    className="table_input num"
                  />
                  &nbsp;-&nbsp;
                  <input
                    type="number"
                    value={tel2}
                    onChange={(e) => handlePhone(e, "tel2")}
                    id="tel2"
                    className="table_input num"
                  />
                  &nbsp;-&nbsp;
                  <input
                    type="number"
                    value={tel3}
                    onChange={(e) => handlePhone(e, "tel3")}
                    id="tel3"
                    className="table_input num"
                  />
                </div>
              </div>
            </div>
            <div className="table_row">
              <div className="table_section">
                <div className="table_title">
                  지역<p className="title_point">*</p>
                </div>
                <div className="table_contents w100">
                  <select
                    name="city"
                    value={city}
                    onChange={handleCityChange}
                    className="table_select"
                  >
                    <option value="">선택</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  <select
                    name="district"
                    value={district}
                    onChange={(event) => setDistrict(event.target.value)}
                    className="table_select"
                  >
                    <option value="">선택</option>
                    {districts.map((district) => (
                      <option key={district} value={district}>
                        {district}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="table_row">
              <div className="table_section">
                <div className="table_title">
                  오시는 길<p className="title_point">*</p>
                </div>
                <div className="table_contents w100">
                  <input
                    className="table_input modal"
                    type="text"
                    id="location"
                    placeholder="오시는 길을 입력해주세요."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  ></input>
                </div>
              </div>
            </div>
            <div className="table_row">
              <div className="table_section">
                <div className="table_title">생성일</div>
                <div className="table_contents w100">
                  <div className="table_inner_text">
                    {props.detailData.date}
                  </div>
                </div>
              </div>
            </div>
            <div className="table_row">
              <div className="table_section half">
                <div className="table_title">검진가능상품</div>
                <div className="table_contents w100">
                  <div className="table_inner_text">
                    {defaultProduct.map((data, index) => (
                      <p className="inner_join_text" key={index}>
                        {index > 0 && ","}
                        {data.product1}
                      </p>
                    ))}
                    <div
                      style={{ marginLeft: "10px" }}
                      className="table_inner_btn"
                      onClick={() => productModalOpen()}
                    >
                      수정
                    </div>
                  </div>
                </div>
              </div>
              <div className="table_section half">
                <div className="table_title">검진회원수</div>
                <div className="table_contents w100">
                  <div className="table_inner_text">{userCount}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal_footer_box">
            <div className="modal_btn" onClick={handleSubmit}>
              수정
            </div>
            <div className="modal_btn close" onClick={() => handleDelete()}>
              삭제
            </div>
          </div>
        </div>
      </div>
      {productModal && (
        <HospitalProductModal
          closeModal={productModalOpen}
          selectedProduct={defaultProduct}
          setChoiceData={setDefaultProduct}
          setUpdateProduct={setUpdateProduct}
          setDeleteProduct={setDeleteProduct}
          detailIdx={detailNum}
        ></HospitalProductModal>
      )}
    </div>
  );
};

export default HospitalViewModal;
