import React, { useEffect, useState } from "react";
import BranchWriteModal from "../modal/BranchWriteModal";
import BranchViewModal from "../modal/BranchViewModal";
import TableDefault from '../Table/TableDefault';
const BranchList = () => {
  const [writeModal, setWriteModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [detailIdx, setDetailIdx] = useState("");

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
                  <option>회사명</option>
                  <option>지점코드</option>
                  <option>지점명</option>
                  <option>지점장명</option>
                  <option>지역</option>
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
                등록
              </div>
            </div>
            <div className="table_box">
              <table className="list_table">
                <tbody>
                  <tr className="table_header">
                    <th className="table_header_col ">No.</th>
                    <th className="table_header_col short_col">지점종류</th>
                    <th className="table_header_col">회사명</th>
                    <th className="table_header_col ">지점코드</th>
                    <th className="table_header_col ">지점명</th>
                    <th className="table_header_col ">지점장명</th>
                    <th className="table_header_col short_col">영업사원수</th>
                    <th className="table_header_col short_col">지역</th>
                    <th className="table_header_col short_col">생성일</th>
                    <th className="table_header_col short_col">가입회원수</th>
                    <th className="table_header_col short_col">상담희망수</th>
                  </tr>
                  <tr className="table_body">
                    <td className="table_col ">1</td>
                    <td className="table_col short_col">보험사</td>
                    <td className="table_col ">기홍컴퍼니</td>
                    <td className="table_col ">lalsox22ma</td>
                    <td className="table_col ">천안본사</td>
                    <td className="table_col ">유기홍</td>
                    <td className="table_col short_col">110</td>
                    <td className="table_col short_col">충천남도 천안시</td>
                    <td className="table_col short_col">2024-03-06</td>
                    <td className="table_col short_col">450</td>
                    <td className="table_col short_col">391</td>
                    {/* <td className="table_col short_col">
                      <div className="table_option_box">
                        <div
                          className="option_btn"
                          onClick={() => viewModalOpen(1)}
                        >
                          수정
                        </div>
                        <div className="option_btn del">삭제</div>
                      </div>
                    </td> */}
                  </tr>
                  {/* <tr
                      className="table_header"
                      style={{ backgroundColor: "#fff" }}
                    >
                      <td colSpan="7" style={{ textAlign: "center" }}>
                        <p style={{ fontSize: 18, padding: 50 }}>
                          [ 공지사항 ]
                          <br /> 검색 결과가 없습니다.
                        </p>
                      </td>
                    </tr> */}
                </tbody>
              </table>
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
