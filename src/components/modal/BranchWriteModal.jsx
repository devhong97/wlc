import React, { useEffect, useState } from "react";
import Axios from "axios";

const BranchWriteModal = (props) => {
  const [selectedCity, setSelectedCity] = useState(""); // 지역(시) 선택
  const [selectedDistrict, setSelectedDistrict] = useState(""); // 지역(도) 선택
  const [cities, setCities] = useState([]); //지역(시)
  const [districts, setDistricts] = useState([]); //지역(도)

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
    // if (id === "") {
    //   alert("아이디를 입력해주세요.");
    //   const idInput = document.getElementById("user_id");
    //   if (idInput) {
    //     idInput.focus();
    //   }
    //   return;
    // } else if (password === "") {
    //   alert("비밀번호를 입력해주세요.");
    //   const passwordInput = document.getElementById("user_password");
    //   if (passwordInput) {
    //     passwordInput.focus();
    //   }
    //   return;
    // }
    Axios.post("http://localhost:3001/api/post/aa", {
      // id,
      // password,
      // name,
      // totalPhone,
      // companyType,
      // companyName,
      // branch,
      // totalEmail,
      // bank,
      // depositAccount,
      // agreeTerms,
    })
      .then((res) => {
        console.log(res.data);
        alert(
          `[]님 회원가입신청이 완료되었습니다.\n지점장 승인 후 로그인이 가능합니다.`
        );
        clearModal();
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
                  <select name="affiliation" className="table_select">
                    <option value="">지점종류 선택</option>
                    <option value="분류1-1">분류1-1</option>
                    <option value="분류1-2">분류1-2</option>
                    <option value="분류1-3">분류1-3</option>
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
                  <select name="affiliation" className="table_select">
                    <option value="">회사선택</option>
                    <option value="분류2-1">분류2-1</option>
                    <option value="분류2-2">분류2-2</option>
                    <option value="분류2-3">분류2-3</option>
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
                  ></input>
                </div>
              </div>
            </div>

            <div className="table_box">
              <div className="table_row">
                <div className="table_section">
                  <div className="table_title">
                    지역(시)<p className="title_point">*</p>
                  </div>
                  <div className="table_contents w100">
                    <select
                      name="city"
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
