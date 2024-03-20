import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useBranchContext } from "../Context/BranchContext";

const NoticeViewModal = (props) => {
  const { typeGroup, companyGroup, setContextType, setContextCompany } =
    useBranchContext();
  const [detailNum, setDetailNum] = useState(""); // 상세페이지 Idx
  const [selectName, setSelectName] = useState(""); // 지점장 선택
  // const [selectNum, setSelectNum] = useState(""); // 지점장 선택 시 Idx
  const [branchDetailData, setBranchDetailData] = useState([]); //지점상세 모달 데이터
  const [type, setType] = useState(""); // 지점종류
  const [company, setCompany] = useState(""); // 변경할 회사명
  const [branchName, setBranchName] = useState(""); // 지점명
  const [city, setCity] = useState(""); // 현재 지역(도) 데이터 분리
  const [district, setDistrict] = useState(""); // 현재 지역(시) 데이터 분리
  const [cities, setCities] = useState([]); //선택 지역(시)
  const [districts, setDistricts] = useState([]); //선택 지역(도)
  const [selectedCity, setSelectedCity] = useState(""); // 지역(시) 선택
  const [selectedDistrict, setSelectedDistrict] = useState(""); // 지역(도) 선택
  const [branchIdx, setBranchIdx] = useState("");

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

  // 지점종류 > 회사명 선택
  useEffect(() => {
    setContextType(type);
  }, [type]);

  useEffect(() => {
    setContextCompany(company);
  }, [company]);

  // // 지역(시) 데이터 호출
  useEffect(() => {
    Axios.get("http://49.50.174.248:3001/api/get/cities")
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
    Axios.get(`http://49.50.174.248:3001/api/get/districts/${selectedCity}`)
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
        "http://49.50.174.248:3001/api/get/branch_detail",
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

  // 선택한 지점장 데이터
  const chooseData = (name, branchIdx) => {
    setSelectName(name);
    setBranchIdx(branchIdx);
  };

  // 상세데이터
  const setDetailValue = () => {
    setType(branchDetailData.branch_type);
    setCompany(branchDetailData.company_name);
    setBranchName(branchDetailData.branch_name);
    setSelectName(branchDetailData.owner_name);
    setBranchIdx(branchDetailData.branch_idx);
  };

  // 수정완료버튼
  const handleSubmit = async () => {
    const confirmModify = window.confirm(`수정을 완료하시겠습니까?`);
    if (!confirmModify) {
      return;
    }
    try {
      // 선택한 지역(시)와 지역(도) 합쳐서 서버로 전송
      const location = `${city} ${district}`;

      const response = await Axios.post(
        "http://49.50.174.248:3001/api/post/branch_modify",
        {
          branchType: type,
          companyName: company,
          branchName: branchName,
          ownerName: selectName,
          location: location,
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
        "http://49.50.174.248:3001/api/post/branch_delete",
        {
          idx: props.detailIdx,
        }
      );
      alert("지점이 삭제되었습니다.");
      props.closeModal();
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
            <div className="modal_title">지점 상세</div>
            <div className="modal_close_btn" onClick={() => clearModal()}>
              X
            </div>
          </div>
          <div className="table_box">
            <div className="table_row">
              <div className="table_section">
                <div className="table_title">
                  지점코드<p className="title_point">*</p>
                </div>
                <div className="table_contents w100">
                  {branchDetailData.branch_idx}
                </div>
              </div>
            </div>
            <div className="table_row">
              <div className="table_section">
                <div className="table_title">
                  지점종류<p className="title_point">*</p>
                </div>
                <div className="table_contents w100">
                  <select
                    name="affiliation"
                    className="table_select"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
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
                    name="affiliation"
                    className="table_select"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  >
                    <option value="">선택</option>
                    {companyGroup.map((data, index) => {
                      return (
                        <option key={index} value={data}>
                          {data}
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
              <div className="table_section">
                <div className="table_title">지점장</div>
                <div className="table_contents w100">
                  <div className="table_inner_text">[ {selectName} ]</div>
                  <div className="table_inner_btn">선택</div>
                </div>
              </div>
            </div>
            <div className="table_row">
              <div className="table_section half">
                <div className="table_title">영업사원수</div>
                <div className="table_contents w100">
                  <div className="table_inner_text">-</div>
                </div>
              </div>
              <div className="table_section half">
                <div className="table_title">가입회원수</div>
                <div className="table_contents w100">
                  <div className="table_inner_text">-</div>
                </div>
              </div>
            </div>
            <div className="table_row">
              <div className="table_section half">
                <div className="table_title">상담희망수</div>
                <div className="table_contents w100">
                  <div className="table_inner_text">-</div>
                </div>
              </div>
              <div className="table_section half">
                <div className="table_title">계약고객수</div>
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
export default NoticeViewModal;
