import React, { useEffect, useState } from "react";
import MemberListModal from "./MemberListModal";
import Axios from "axios";

const BranchViewModal = (props) => {
  const [detailNum, setDetailNum] = useState(""); // 상세페이지 Idx
  const [selectName, setSelectName] = useState(""); // 지점장 선택
  const [selectNum, setSelectNum] = useState(""); // 지점장 선택 시 Idx
  const [listModal, setListModal] = useState(false); // 지점장 선택 Modal
  const [branchDetailData, setBranchDetailData] = useState([]); //지점상세 모달 데이터
  const [branchType, setBranchType] = useState(""); // 지점종류
  const [companyName, setCompanyName] = useState(""); // 회사명
  const [branchName, setBranchName] = useState(""); // 지점명
  const [city, setCity] = useState(""); // 지역(도)
  const [district, setDistrict] = useState(""); // 지역(시)

  useEffect(() => {
    if (props.detailIdx) {
      console.log(props.detailIdx);
      setDetailNum(props.detailIdx);
      getDetail();
    }
  }, [props.detailIdx]);

  useEffect(() => {
    setDetailValue();
  }, [branchDetailData]);

  const clearModal = () => {
    props.closeModal();
    setDetailNum(""); // idx 초기화
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

  const chooseData = (name, num) => {
    // 선택한 지점장 데이터
    setSelectName(name);
    setSelectNum(num);
  };

  const setDetailValue = () => {
    setBranchType(branchDetailData.branch_type);
    setCompanyName(branchDetailData.company_name);
    setBranchName(branchDetailData.branch_name);
  };
  const handleSubmit = () => {};
  const listModalOpen = () => {
    setListModal(!listModal);
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
                <div className="table_contents w100">123</div>
              </div>
            </div>
            <div className="table_row">
              <div className="table_section">
                <div className="table_title">
                  지점종류<p className="title_point">*</p>
                </div>
                <div className="table_contents w100">
                  <select name="affiliation" className="table_select">
                    <option value="">선택</option>
                    <option value="company">Company</option>
                    <option value="school">School</option>
                    <option value="organization">Organization</option>
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
                    <option value="">선택</option>
                    <option value="company">Company</option>
                    <option value="school">School</option>
                    <option value="organization">Organization</option>
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
                  <select name="affiliation" className="table_select">
                    <option value="">지역(시)</option>
                    <option value="company">Company</option>
                    <option value="school">School</option>
                    <option value="organization">Organization</option>
                  </select>
                  <select name="affiliation" className="table_select">
                    <option value="">지역(도)</option>
                    <option value="company">Company</option>
                    <option value="school">School</option>
                    <option value="organization">Organization</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="table_row">
              <div className="table_section">
                <div className="table_title">생성일</div>
                <div className="table_contents w100">
                  <div className="table_inner_text">24.02.28</div>
                </div>
              </div>
            </div>
            <div className="table_row">
              <div className="table_section">
                <div className="table_title">지점장</div>
                <div className="table_contents w100">
                  <div className="table_inner_text">{selectName}</div>
                  <div
                    className="table_inner_btn"
                    onClick={() => listModalOpen()}
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
            <div className="modal_btn close" onClick={clearModal}>
              닫기
            </div>
          </div>
        </div>
      </div>
      {listModal && (
        <MemberListModal
          closeModal={listModalOpen}
          chooseData={chooseData}
        ></MemberListModal>
      )}
    </div>
  );
};

export default BranchViewModal;
