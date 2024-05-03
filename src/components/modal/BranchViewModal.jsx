import React, { useEffect, useState } from "react";
import MemberListModal from "./MemberListModal";
import Axios from "axios";
import { useBranchContext } from "../Context/BranchContext";
import BranchProductModal from "./BranchProductModal";
import moment from "moment";

const BranchViewModal = (props) => {
  const { typeGroup, companyGroup, setContextType, setContextCompany } =
    useBranchContext();
  const [detailNum, setDetailNum] = useState(""); // 상세페이지 Idx
  const [selectName, setSelectName] = useState(""); // 지점장 선택
  // const [selectNum, setSelectNum] = useState(""); // 지점장 선택 시 Idx
  const [listModal, setListModal] = useState(false); // 지점장 선택 Modal
  const [productModal, setProductModal] = useState(false); // 지점판매상품모달
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
  const [detailIdx, setDetailIdx] = useState("");
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [bgrade, setBGrade] = useState(""); //지점등급
  const [foundItem, setFoundItem] = useState(null);

  console.log(foundItem);
  //console.log("data", props.total);

  const findIndexByDetailNum = (total, detailNum) => {
    const foundItem = total.find((item) => item.id === detailNum);
    return foundItem ? total.indexOf(foundItem) + 1 : null;
  };

  // 함수 호출 예시
  const index = findIndexByDetailNum(props.total, detailNum);
  console.log("index", index); // 배열 번호 출력

  // LIST에서 가져온 상세보기 idx 호출
  useEffect(() => {
    if (props.detailIdx) {
      setDetailNum(props.detailIdx);
      getDetail();
    }
  }, [props.detailIdx]);

  console.log("detailNum", detailNum);

  useEffect(() => {
    // index와 detailNum이 같을 때만 실행
    if (index && index === detailNum) {
      // index와 detailNum의 값이 유효한지 확인
      if (index > 0 && index <= props.total.length) {
        // index와 detailNum에 해당하는 객체 찾기
        const itemByIndex = props.total[index - 1]; // index는 1부터 시작하므로 인덱스 조정 필요
        const itemByDetailNum = props.total.find(
          (item) => item.id === detailNum
        );

        // 찾은 객체 콘솔에 출력
        console.log("Item found by index:", itemByIndex);
        console.log("Item found by detailNum:", itemByDetailNum);

        // 찾은 객체를 state에 저장
        setFoundItem(itemByDetailNum);
      }
    }
  }, [index, detailNum, props.total]);

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
    Axios.get("https://www.wlcare.co.kr:8443/api/get/cities")
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
    Axios.get(`https://www.wlcare.co.kr:8443/api/get/districts/${selectedCity}`)
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
        "https://www.wlcare.co.kr:8443/api/get/branch_detail",
        {
          params: {
            idx: props.detailIdx,
          },
        }
      );
      const allData = response.data;
      const allProduct = allData[0].product;
      setBranchDetailData(allData[0]);
      const product2 = allData[0]?.product
        ? allData[0].product.replace(/\|/g, ",")
        : null;

      if (product2) {
        setSelectedProduct(product2);
      }

      // location 문자열 분리
      const [selectedCity, selectedDistrict] = allData[0].location.split(" ");
      setCity(selectedCity);
      setDistrict(selectedDistrict);
      setDetailValue();
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
    setBGrade(branchDetailData.branch_grade);
    setBranchIdx(branchDetailData.branch_idx);
  };

  // 수정완료버튼
  const handleSubmit = async () => {
    const confirmModify = window.confirm(`수정을 완료하시겠습니까?`);
    if (!confirmModify) {
      return;
    }
    try {
      // 변경사항 없으면 기존데이터 전송
      let location;
      if (selectedCity && selectedDistrict) {
        location = `${selectedCity} ${selectedDistrict}`;
      } else {
        location = `${city} ${district}`;
      }

      console.log("location", location);

      const response = await Axios.post(
        "https://www.wlcare.co.kr:8443/api/post/branch_modify",
        {
          branchType: type,
          bgrade: bgrade,
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
        "https://www.wlcare.co.kr:8443/api/post/branch_delete",
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

  const listModalOpen = (uid) => {
    setListModal(!listModal);
    console.log("uid", uid);
  };

  // 지점판매상품 선택 모달창 OPEN 버튼
  const productModalOpen = (status) => {
    if (status === "update") {
      getDetail();
    }
    setProductModal(!productModal);
    setDetailIdx(props.detailIdx);
    setBranchIdx(branchIdx);
  };

  const formatDate = (dateString) => {
    return moment(dateString).format("YYYY-MM-DD");
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
                <div className="table_title">지점코드</div>
                <div className="table_contents w100">
                  {branchDetailData.branch_idx}
                </div>
              </div>
            </div>
            <div className="table_row">
              <div className="table_section">
                <div className="table_title">지점등급</div>
                <div className="table_contents w100">
                  <select
                    name="affiliation"
                    className="table_select"
                    value={bgrade}
                    onChange={(e) => setBGrade(e.target.value)}
                  >
                    <option value="">선택</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
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
                    {city ? (
                      <option value={city}>{city}</option>
                    ) : (
                      <option value="">(시/도) 선택</option>
                    )}
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
                    {district ? (
                      <option value={district}>{district}</option>
                    ) : (
                      <option value="">(구/군) 선택</option>
                    )}
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
                    {formatDate(branchDetailData.date)}
                  </div>
                </div>
              </div>
            </div>
            <div className="table_row">
              <div className="table_section">
                <div className="table_title">지점장</div>
                <div className="table_contents w100">
                  <div className="table_inner_text">
                    [ {selectName ? selectName : "지점장을 선택해주세요."} ]
                  </div>
                  <div
                    className="table_inner_btn"
                    onClick={() => listModalOpen(branchDetailData.uid)}
                  >
                    선택
                  </div>
                </div>
              </div>
            </div>
            <div className="table_row">
              <div className="table_section half">
                <div className="table_title">사원수</div>
                <div className="table_contents w100">
                  <div className="table_inner_text">
                    {foundItem && (
                      <div className="table_inner_text">
                        {foundItem.employeeCount}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="table_section half">
                <div className="table_title">총 고객수</div>
                <div className="table_contents w100">
                  <div className="table_inner_text">
                    {foundItem && (
                      <div className="table_inner_text">
                        {foundItem.totalCustomerCount}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="table_row">
              <div className="table_section half">
                <div className="table_title">상담희망수</div>
                <div className="table_contents w100">
                  <div className="table_inner_text">
                    {foundItem && (
                      <div className="table_inner_text">
                        {foundItem.hopeCount}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="table_section half">
                <div className="table_title">계약고객수</div>
                <div className="table_contents w100">
                  <div className="table_inner_text">
                    {" "}
                    {foundItem && (
                      <div className="table_inner_text">
                        {foundItem.contractCount}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="table_row">
              <div className="table_section">
                <div className="table_title">지점판매상품</div>
                <div className="table_contents w100">
                  {selectedProduct && selectedProduct.length > 0 ? (
                    <div className="table_inner_text">
                      [ {selectedProduct} ]
                    </div>
                  ) : (
                    <div className="table_inner_text">
                      [ 판매상품을 선택해주세요. ]
                    </div>
                  )}
                  <div
                    className="table_inner_btn"
                    onClick={() => productModalOpen()}
                  >
                    등록
                  </div>
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
      {listModal && (
        <MemberListModal
          closeModal={listModalOpen}
          chooseData={chooseData}
          branchIdx={branchDetailData.branch_idx}
        ></MemberListModal>
      )}
      {productModal && (
        <BranchProductModal
          closeModal={productModalOpen}
          detailIdx={detailIdx}
          branchIdx={branchIdx}
          selectedProduct={selectedProduct}
          updateSelectedProduct={setSelectedProduct}
        ></BranchProductModal>
      )}
    </div>
  );
};

export default BranchViewModal;
