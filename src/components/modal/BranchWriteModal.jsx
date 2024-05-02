import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useBranchContext } from "../Context/BranchContext";

const BranchWriteModal = (props) => {
  const { typeGroup, companyGroup, setContextType, setContextCompany } =
    useBranchContext();
  const [selectedCity, setSelectedCity] = useState(""); // 지역(시) 선택
  const [selectedDistrict, setSelectedDistrict] = useState(""); // 지역(도) 선택
  const [cities, setCities] = useState([]); //지역(시)
  const [districts, setDistricts] = useState([]); //지역(도)
  const [type, setType] = useState("");
  const [company, setCompany] = useState("");
  const [branchName, setBranchName] = useState(""); //지점명

  useEffect(() => {
    setContextType(type);
  }, [type]);

  useEffect(() => {
    setContextCompany(company);
  }, [company]);

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

  //모달 초기화
  const clearModal = () => {
    props.closeModal();
  };

  //지점 등록버튼
  const handleSubmit = async () => {
    if (type === "") {
      alert("지점종류를 선택해주세요.");
      const typeInput = document.getElementById("user_type");
      if (typeInput) {
        typeInput.focus();
      }
      return;
    } else if (company === "") {
      alert("회사명을 입력해주세요.");
      const companyInput = document.getElementById("user_company");
      if (companyInput) {
        companyInput.focus();
      }
      return;
    } else if (branchName === "") {
      alert("지점명을 입력해주세요.");
      const branchNameInput = document.getElementById("user_branchName");
      if (branchNameInput) {
        branchNameInput.focus();
      }
      return;
    }

    // 선택한 지역(시)와 지역(도) 합쳐서 서버로 전송
    const location = `${selectedCity} ${selectedDistrict}`;

    // 지점등록
    Axios.post("http://localhost:3001/api/post/branch_account", {
      branchType: type,
      companyName: company,
      branchName,
      location,
    })
      .then((res) => {
        console.log(res.data);
        alert(`[${branchName}]\n지점등록이 완료되었습니다.`);
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
            <div className="modal_title">지점 등록</div>
            <div className="modal_close_btn" onClick={() => clearModal()}>
              X
            </div>
          </div>

          <div className="table_box">
            <div className="table_row">
              <div className="table_section">
                <div className="table_title">
                  지점종류<p className="title_point">*</p>
                </div>
                <div className="table_contents w100">
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    id="user_branchType"
                    className="table_select"
                  >
                    <option value="">선택</option>
                    {typeGroup.map((type, index) => {
                      return (
                        <option key={index} value={type}>
                          {type}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </div>
            <div className="table_row">
              <div className="table_section">
                <div className="table_title">
                  회사명<p className="title_point">*</p>
                </div>
                <div className="table_contents w100">
                  <select
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    id="user_compnayName"
                    className="table_select"
                  >
                    <option value="">선택</option>
                    {companyGroup.map((type, index) => {
                      return (
                        <option key={index} value={type}>
                          {type}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
            </div>
            <div className="table_row">
              <div className="table_section">
                <div className="table_title">
                  지점명<p className="title_point">*</p>
                </div>
                <div className="table_contents w100">
                  <input
                    className="table_input modal"
                    type="text"
                    id="title"
                    placeholder="지점명을 입력해주세요."
                    value={branchName}
                    onChange={(e) => setBranchName(e.target.value)}
                  ></input>
                </div>
              </div>
            </div>

            <div className="table_box">
              <div className="table_row">
                <div className="table_section">
                  <div className="table_title">지역</div>
                  <div className="table_contents w100">
                    <select
                      name="city"
                      value={selectedCity}
                      onChange={handleCityChange}
                      className="table_select"
                    >
                      <option value="">시/도 선택</option>
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
                      <option value="">구/군 선택</option>
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
    </div>
  );
};

export default BranchWriteModal;
