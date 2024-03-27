import React, { useEffect, useState } from "react";

import Axios from "axios";
const HospitalViewModal = (props) => {
  const [detailNum, setDetailNum] = useState(""); // 상세페이지 Idx
  const [branchDetailData, setBranchDetailData] = useState([]); //지점상세 모달 데이터
  const [type, setType] = useState(""); // 지점종류
  const [name, setName] = useState(""); // 병원명
  const [tel1, setTel1] = useState(""); // 연락처1
  const [tel2, setTel2] = useState(""); // 연락처2
  const [tel3, setTel3] = useState(""); // 연락처3

  const [branchName, setBranchName] = useState(""); // 지점명
  const [city, setCity] = useState(""); // 현재 지역(도) 데이터 분리
  const [district, setDistrict] = useState(""); // 현재 지역(시) 데이터 분리
  const [cities, setCities] = useState([]); //선택 지역(시)
  const [districts, setDistricts] = useState([]); //선택 지역(도)
  const [selectedCity, setSelectedCity] = useState(""); // 지역(시) 선택
  const [selectedDistrict, setSelectedDistrict] = useState(""); // 지역(도) 선택

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
      getDetail();
    }
  }, [props.detailIdx]);

  // view모달 상세데이터 호출
  useEffect(() => {
    setDetailValue();
  }, [branchDetailData]);

  // // 지역(시) 데이터 호출
  useEffect(() => {
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
    if (selectedCity === "") {
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

  const getDetail = async () => {
    try {
      const response = await Axios.get(
        "http://localhost:3001/api/get/branch_detail",
        {
          params: {
            idx: props.detailIdx,
          },
        }
      );
      const allData = response.data;
      setBranchDetailData(allData[0]);
      setDetailValue();

      // location 문자열 분리
      const [city, district] = allData[0].location.split(" ");
      setCity(city);
      setDistrict(district);
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };
  // 상세데이터
  const setDetailValue = () => {
    setType(branchDetailData.branch_type);
    setName(branchDetailData.company_name);
    setBranchName(branchDetailData.branch_name);
  };

  // 수정완료버튼
  const handleSubmit = async () => {
    const confirmModify = window.confirm(`수정을 완료하시겠습니까?`);
    if (!confirmModify) {
      return;
    }
    try {
      // 선택한 지역(시)와 지역(도) 합쳐서 서버로 전송
      const number = `${tel1}-${tel2}-${tel3}`;

      const response = await Axios.post(
        "http://localhost:3001/api/post/hospital_modify",
        {
          hospitalName: name,
          number: number,
          provice: selectedCity,
          city: selectedDistrict,
          idx: props.detailIdx,
        }
      );
      alert("수정이 완료되었습니다.");
      props.closeModal();
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };

  // 지점삭제버튼
  const deleteBranch = async () => {
    const confirmDelete = window.confirm(
      `[${branchDetailData.branch_name}] 지점을 삭제하시겠습니까?`
    );
    if (!confirmDelete) {
      return;
    }

    try {
      const response = await Axios.post(
        "http://localhost:3001/api/post/branch_delete",
        {
          idx: props.detailIdx,
        }
      );
      alert("지점이 삭제되었습니다.");
      props.closeModal("reload");
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };

  // 모달창닫기
  const clearModal = () => {
    props.closeModal();
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
                    value={branchName}
                    onChange={(e) => setBranchName(e.target.value)}
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
            <div className="table_row">
              <div className="table_section">
                <div className="table_title">
                  지역<p className="title_point">*</p>
                </div>
                <div className="table_contents w100">
                  <select
                    name="city"
                    value={selectedCity}
                    onChange={handleCityChange}
                    className="table_select"
                  >
                    <option value="">{city}</option>
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                  <select
                    name="district"
                    value={selectedDistrict}
                    onChange={(event) =>
                      setSelectedDistrict(event.target.value)
                    }
                    className="table_select"
                  >
                    <option value="">{district}</option>
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
                <div className="table_title">생성일</div>
                <div className="table_contents w100">
                  <div className="table_inner_text">
                    {branchDetailData.date}
                  </div>
                </div>
              </div>
            </div>
            <div className="table_row">
              <div className="table_section half">
                <div className="table_title">검진가능상품</div>
                <div className="table_contents w100">
                  <div className="table_inner_text">-</div>
                </div>
              </div>
              <div className="table_section half">
                <div className="table_title">검진회원수</div>
                <div className="table_contents w100">
                  <div className="table_inner_text">-</div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal_footer_box">
            <div className="modal_btn" onClick={handleSubmit}>
              수정
            </div>
            <div className="modal_btn close" onClick={() => deleteBranch()}>
              삭제
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalViewModal;
