import React, { useEffect, useState } from "react";
import BranchWriteModal from "../modal/BranchWriteModal";
import BranchViewModal from "../modal/BranchViewModal";
import TableDefault from "../Table/TableDefault";
const BranchList = () => {
  const [writeModal, setWriteModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [detailIdx, setDetailIdx] = useState("");

  const columns = [
    { field: "id", headerName: "No", width: "50" },
    { field: "code", headerName: "지점코드" },
    { field: "company_type", headerName: "지점종류", width: "100" },
    { field: "company_name", headerName: "회사명" },
    { field: "name", headerName: "지점명" },
    { field: "manager_name", headerName: "지점장명", width: "100" },
    { field: "member_num", headerName: "사원수", width: "100" },
    { field: "address", headerName: "지역", width: "100" },
    { field: "date", headerName: "생성일" },
    { field: "customer_num", headerName: "가입회원수", width: "120" },
    { field: "hope_num", headerName: "상담희망수", width: "120" },
    { field: "rex_total", headerName: "계약고객수", width: "120" },
  ];

  const rows = [
    {
      id: 1,
      code: "lalsox22ma",
      company_type: "보험사",
      company_name: "기홍컴퍼니",
      name: "천안본사",
      manager_name: "유기홍",
      member_num: 35,
      address: "충남 천안",
      date: "24.03.07",
      customer_num: 100,
      hope_num: 35,
      rex_total: 35,
    },
  ];

  const writeModalOpen = () => {
    setWriteModal(!writeModal);
  };
  const viewModalOpen = (idx) => {
    setViewModal(!viewModal);
    setDetailIdx(idx);
  };

  return (
    <div className="main_wrap">
      <div className="main_back">
        <div className="main_title_box">지점 관리</div>
        <div className="board_list_wrap">
          <div className="list_area">
            <div className="search_box">
              <div className="search_select">
                <select className="list_select">
                  <option>지점종류</option>
                </select>
                <select className="list_select">
                  <option>회사명</option>
                </select>
                <select className="list_select">
                  <option>지점명</option>
                </select>
              </div>
              <div className="search_input">
                <input
                  className="list_input"
                  placeholder="검색어를 입력하세요"
                ></input>
                <div className="list_search" style={{ marginRight: 10 }}>
                  검색
                </div>
                <div className="list_search reset_btn">초기화</div>
              </div>
              <div className="title_btn" onClick={() => writeModalOpen()}>
                지점등록
              </div>
              <div className="total_btn">
                <div className="total_box">가입회원수 : 10000</div>
              </div>
              <div className="total_btn">
                <div className="total_box">상담희망: 10000</div>
              </div>
              <div className="total_btn">
                <div className="total_box">계약고객수: 10000</div>
              </div>
            </div>
            <div className="table_box list">
              <TableDefault
                rows={rows}
                columns={columns}
                viewModalOpen={viewModalOpen}
              ></TableDefault>
            </div>
          </div>
          <div className="pagination_box">
            <button>{`<<`}</button>
            <button>{`<`}</button>
            <button>1</button>
            <button>{`>`}</button>
            <button>{`>>`}</button>
          </div>
        </div>
      </div>
      {writeModal && (
        <BranchWriteModal closeModal={writeModalOpen}></BranchWriteModal>
      )}
      {viewModal && (
        <BranchViewModal
          closeModal={viewModalOpen}
          detailIdx={detailIdx}
        ></BranchViewModal>
      )}
    </div>
  );
};

export default BranchList;
