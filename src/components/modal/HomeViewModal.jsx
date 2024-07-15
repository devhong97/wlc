import React from "react";

const HomeViewModal = (props) => {
  // 모달창닫기
  const clearModal = () => {
    props.closeModal();
  };
  return (
    <div className="modal_wrap">
      <div className="modal_back">
        <div className="modal_box">
          <div className="modal_title_box">
            <div className="modal_title">7일 이내 검진예약 고객명단 상세</div>
            <div className="modal_close_btn" onClick={() => clearModal()}>
              X
            </div>
          </div>
          {props.detailData && (
            <div className="table_box">
              <div className="table_row">
                <div className="table_section">
                  <div className="table_title">
                    예약자<p className="title_point">*</p>
                  </div>
                  <div className="table_contents w100">
                    {props.detailData.name}
                  </div>
                </div>
              </div>
              <div className="table_row">
                <div className="table_section">
                  <div className="table_title">
                    검진자<p className="title_point">*</p>
                  </div>
                  <div className="table_contents w100">
                    {props.detailData.customerName}
                  </div>
                </div>
              </div>
              <div className="table_row">
                <div className="table_section">
                  <div className="table_title">연락처</div>
                  <div className="table_contents w100">
                    <div className="table_inner_text">
                      {props.detailData.phone}
                    </div>
                  </div>
                </div>
              </div>
              <div className="table_row">
                <div className="table_section">
                  <div className="table_title">상품</div>
                  <div className="table_contents w100">
                    <div className="table_inner_text">
                      {props.detailData.product}
                    </div>
                  </div>
                </div>
              </div>
              <div className="table_row">
                <div className="table_section">
                  <div className="table_title">검진병원</div>
                  <div className="table_contents w100">
                    <div className="table_inner_text">
                      {props.detailData.hospital}
                    </div>
                  </div>
                </div>
              </div>
              <div className="table_row">
                <div className="table_section">
                  <div className="table_title">검진일</div>
                  <div className="table_contents w100">
                    <div className="table_inner_text">
                      {props.detailData.result_date}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeViewModal;
