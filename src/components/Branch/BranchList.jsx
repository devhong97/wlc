import React, { useEffect, useState, useRef } from "react";
import BranchWriteModal from "../modal/BranchWriteModal";
import BranchViewModal from "../modal/BranchViewModal";
import TableDefault from "../Table/TableDefault";
import Axios from "axios";
import moment from "moment";
import BranchSelect from "./BranchSelect";

const BranchList = () => {
  const selectRef = useRef(null);
  const [writeModal, setWriteModal] = useState(false); // 지점등록 모달
  const [viewModal, setViewModal] = useState(false); // 지점상세 수정모달
  const [detailIdx, setDetailIdx] = useState(""); //상세페이지 Idx
  const [branchList, setBranchList] = useState([]); // 지점 리스트
  const [branchIdx, setBranchIdx] = useState("");
  const [searchData, setSearchData] = useState([]);

  useEffect(() => {
    fetchBranchList();
  }, [searchData]);

  const fetchBranchList = () => {
    const resultParams = {};
    if (searchData) {
      resultParams.searchData = searchData
    }
    Axios.get("http://localhost:3001/api/get/branch_list", {
      params: resultParams
    })
      .then((res) => {
        if (res.data.success) {
          // 서버로부터 받아온 데이터를 rows로 설정합니다.
          setBranchList(
            res.data.data.map((data, index) => ({
              id: index + 1,
              idx: data.idx,
              branch_grade: data.branch_grade,
              branch_idx: data.branch_idx,
              branch_type: data.branch_type,
              company_name: data.company_name,
              branch_name: data.branch_name,
              owner_name: data.owner_name,
              employee_num: data.employee_num,
              location: data.location,
              registered_num: data.registered_num,
              consulting_num: data.consulting_num,
              contract_num: data.contract_num,
              date: moment(data.date).format("YYYY.MM.DD"),
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
    { field: "branch_grade", headerName: "지점등급" },
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
  const viewModalOpen = (data) => {
    const idx = data.idx;
    const branchIdx = data.branch_idx;
    setViewModal(!viewModal);
    setDetailIdx(idx);
    setBranchIdx(branchIdx);
  };
  const viewModalClose = (status) => {
    setViewModal(false);
    if (status === "reload") {
      window.location.reload();
    } else {
      fetchBranchList();
    }
  };

  return (
    <div className="main_wrap">
      <div className="main_back">
        <div className="main_title_box">
          지점 관리
          <div className="total_data_box">
            <div className="total_box">가입회원 : 10000</div>
            <div className="total_box">상담희망: 10000</div>
            <div className="total_box">계약고객: 10000</div>
          </div>
        </div>
        <div className="board_list_wrap">
          <div className="list_area">
            <div className="search_box">
              <BranchSelect ref={selectRef} setSearchData={setSearchData}></BranchSelect>
              <div className="title_btn" onClick={() => writeModalOpen()}>
                지점등록
              </div>
            </div>
            <div className="table_box list">
              {branchList.length === 0 ? (
                <div>정보가 없습니다.</div>
              ) : (
                <TableDefault
                  rows={branchList}
                  columns={columns}
                  viewModalOpen={viewModalOpen}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      {writeModal && (
        <BranchWriteModal closeModal={writeModalOpen}></BranchWriteModal>
      )}
      {viewModal && (
        <BranchViewModal
          closeModal={viewModalClose}
          detailIdx={detailIdx}
          branchIdx={branchIdx}
        ></BranchViewModal>
      )}
    </div>
  );
};

export default BranchList;
