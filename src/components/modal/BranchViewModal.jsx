import React, { useEffect, useState } from "react";
import MemberListModal from "./MemberListModal";

const BranchViewModal = (props) => {
  const [detailNum, setDetailNum] = useState("");
  const [selectName, setSelectName] = useState("");
  const [selectNum, setSelectNum] = useState("");
  const [listModal, setListModal] = useState(false);

  useEffect(() => {
    if (props.detailIdx) {
      console.log(props.detailIdx);
      setDetailNum(props.detailIdx);
      getDetail();
    }
  }, [props.detailIdx]);
  const clearModal = () => {
    props.closeModal();
  };
  const getDetail = () => {
    //detailNum 사용하여 상세 api 호출
  };
  const chooseData = (name, num) => {
    // 선택한 지점장 데이터
    setSelectName(name);
    setSelectNum(num);
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
              <div className="table_section">
                <div className="table_title">사원수</div>
                <div className="table_contents w100">
                  <div className="table_inner_text">100</div>
                </div>
              </div>
            </div>
            <div className="table_row">
              <div className="table_section">
                <div className="table_title">고객수</div>
                <div className="table_contents w100">
                  <div className="table_inner_text">10</div>
                </div>
              </div>
            </div>
            <div className="table_row">
              <div className="table_section">
                <div className="table_title">상담희망수</div>
                <div className="table_contents w100">
                  <div className="table_inner_text">100</div>
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
