import React, { useEffect, useState } from "react";
import BranchWriteModal from "../modal/BranchWriteModal";
import BranchViewModal from "../modal/BranchViewModal";
import TableDefault from "../Table/TableDefault";
import Axios from "axios";

const BranchList = () => {
  const [writeModal, setWriteModal] = useState(false); // 지점등록 모달
  const [viewModal, setViewModal] = useState(false); // 지점상세 수정모달
  const [detailIdx, setDetailIdx] = useState(""); //상세페이지 Idx
  const [branchList, setBranchList] = useState([]); // 지점 리스트

  useEffect(() => {
    fetchBranchList();
  }, []);

  const fetchBranchList = () => {
    Axios.get("http://localhost:3001/api/get/branch_list")
      .then((res) => {
        if (res.data.success) {
          // 서버로부터 받아온 데이터를 rows로 설정합니다.
          setBranchList(
            res.data.data.map((item, index) => ({
              id: index + 1,
              branch_idx: item.branch_idx,
              branch_type: item.branch_type,
              company_name: item.company_name,
              branch_name: item.branch_name,
              owner_name: item.owner_name,
              employee_num: item.employee_num,
              location: item.location,
              registered_num: item.registered_num,
              consulting_num: item.consulting_num,
              contract_num: item.contract_num,
              date: item.date,
            }))
          );
        } else {
          console.error("지점 관리 데이터호출 실패");
        }
      })
      .catch((err) => {
        console.error("지점 관리 데이터호출 실패:", err);
      });
  };

  const columns = [
    { field: "id", headerName: "No", flex: 0.5 },
    { field: "branch_idx", headerName: "지점코드" },
    { field: "branch_type", headerName: "지점종류" },
    { field: "company_name", headerName: "회사명" },
    { field: "branch_name", headerName: "지점명" },
    { field: "owner_name", headerName: "지점장명" },
    { field: "employee_num", headerName: "사원수", maxWidth: 100 },
    { field: "location", headerName: "지역" },
    { field: "registered_num", headerName: "가입회원수", maxWidth: 100 },
    { field: "consulting_num", headerName: "상담희망수", maxWidth: 100 },
    { field: "contract_num", headerName: "계약고객수", maxWidth: 100 },
    { field: "date", headerName: "생성일" },
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
                rows={branchList}
                columns={columns}
                viewModalOpen={viewModalOpen}
              ></TableDefault>
            </div>
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
