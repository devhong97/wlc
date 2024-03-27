import React, { useEffect, useState } from "react";
import BranchViewModal from "../modal/BranchViewModal";
import TableDefault from "../Table/TableDefault";
import Axios from "axios";
import moment from "moment";
import HospitalWriteModal from "../modal/HospitalWriteModal";
import HospitalViewModal from "../modal/HospitalViewModal";

const HospitalList = () => {
  const [writeModal, setWriteModal] = useState(false); // 병원등록 모달
  const [viewModal, setViewModal] = useState(false); // 병원상세 수정모달
  const [detailIdx, setDetailIdx] = useState(""); //상세페이지 Idx
  const [hospitalList, setHospitalList] = useState([]); // 병원 리스트

  useEffect(() => {
    fetchHospitalList();
  }, []);

  const fetchHospitalList = () => {
    Axios.get("http://localhost:3001/api/get/hospital_list")
      .then((res) => {
        if (res.data.success) {
          // 서버로부터 받아온 데이터를 rows로 설정합니다.
          setHospitalList(
            res.data.data.map((data, index) => ({
              id: index + 1,
              name: data.name,
              number: data.number,
              province: data.province,
              city: data.city,
              product: data.product,
              member_num: data.member_num,
              product_idx: data.product_idx,
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
    { field: "name", headerName: "병원명" },
    { field: "number", headerName: "연락처" },
    { field: "province", headerName: "지역(도)" },
    { field: "city", headerName: "지역(시)" },
    { field: "product", headerName: "검진가능상품" },
    { field: "member_num", headerName: "검진회원수" },
    { field: "date", headerName: "병원등록일" },
  ];

  const writeModalOpen = () => {
    setWriteModal(!writeModal);
  };
  const viewModalOpen = (data) => {
    const idx = data.idx;
    setViewModal(!viewModal);
    setDetailIdx(idx);
  };
  const viewModalClose = () => {
    setViewModal(false);
    window.location.reload();
  };

  return (
    <div className="main_wrap">
      <div className="main_back">
        <div className="main_title_box">
          병원 관리
          <div className="total_data_box">
            <div className="total_box">병원수 : 10000</div>
            <div className="total_box">검진회원: 10000</div>
            <div className="total_box">미검진회원: 10000</div>
          </div>
        </div>
        <div className="board_list_wrap">
          <div className="list_area">
            <div className="search_box">
              <div className="search_select">
                <select className="list_select">
                  <option>지역(도)</option>
                </select>
                <select className="list_select">
                  <option>지역(시)</option>
                </select>
                <select className="list_select">
                  <option>검진가능상품</option>
                </select>
              </div>
              <div className="search_input">
                {/*<input
                  className="list_input"
                  placeholder="검색어를 입력하세요"
                ></input>*/}
                <div className="list_search" style={{ marginRight: 10 }}>
                  검색
                </div>
                <div className="list_search reset_btn">초기화</div>
              </div>
              <div className="title_btn" onClick={() => writeModalOpen()}>
                병원등록
              </div>
            </div>
            <div className="table_box list">
              {hospitalList.length === 0 ? (
                <div>정보가 없습니다.</div>
              ) : (
                <TableDefault
                  rows={hospitalList}
                  columns={columns}
                  viewModalOpen={viewModalOpen}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      {writeModal && (
        <HospitalWriteModal closeModal={writeModalOpen}></HospitalWriteModal>
      )}
      {viewModal && (
        <HospitalViewModal
          closeModal={viewModalClose}
          detailIdx={detailIdx}
        ></HospitalViewModal>
      )}
    </div>
  );
};

export default HospitalList;
