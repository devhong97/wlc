import React, { useEffect, useState, useImperativeHandle, useRef } from "react";
import Axios from "axios";

const HospitalSelect = (props, ref) => {
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [cityList, setCityList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  useImperativeHandle(ref, () => ({
    clearSearch,
  }));

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    Axios.get("http://localhost:3001/api/get/cities")
      .then((response) => {
        setCityList(response.data);
      })
      .catch((err) => {
        console.error("(시)호출 실패:", err);
      });
  };

  const handleCityChange = (e) => {
    const selectedCity = e.target.value;
    setCity(selectedCity);
    // 지역(시) 선택값 없거나 초기값이면 리셋
    if (selectedCity === "" || selectedCity === "시 선택") {
      setDistrictList([]);
      return;
    }

    // 선택된 시에 해당하는 도 데이터 호출
    Axios.get(`http://localhost:3001/api/get/districts/${selectedCity}`)
      .then((response) => {
        setDistrictList(response.data);
      })
      .catch((err) => {
        console.error(`(도)호출 실패 ${selectedCity}:`, err);
      });
  };

  const handleSearch = () => {
    const searchData = {
      province: city,
      city: district,
    };
    console.log("검색 데이터:", searchData);

    if (props.setSearchData) {
      props.setSearchData(searchData);
    }
  };
  const clearSearch = () => {
    if (props.setSearchData) {
      props.setSearchData([]);
      setCity("");
      setDistrict("");
    }
  };
  return (
    <div className="list_select_area">
      <div className="search_select xs1">
        <select
          className="list_select xs1"
          value={city}
          onChange={(e) => handleCityChange(e)}
        >
          <option value="">지역(시/도)</option>
          {cityList.map((type, index) => {
            return (
              <option key={index} value={type}>
                {type}
              </option>
            );
          })}
        </select>
        <select
          className="list_select xs1"
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
        >
          <option value="">지역(구/군)</option>
          {districtList.map((data, index) => {
            return (
              <option key={index} value={data}>
                {data}
              </option>
            );
          })}
        </select>
      </div>
      <div className="search_input hospital">
        <div className="list_search" onClick={() => handleSearch()}>
          검색
        </div>
        <div className="list_search reset_btn" onClick={() => clearSearch()}>
          초기화
        </div>
      </div>
    </div>
  );
};

export default React.forwardRef(HospitalSelect);
