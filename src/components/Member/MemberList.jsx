import React, { useEffect, useState } from "react";
import MemberWriteModal from "../modal/MemberWriteModal";
import MemberViewModal from "../modal/MemberViewModal";
import { DataGrid } from "@mui/x-data-grid";
import Axios from "axios";
import TableDefault from "../Table/TableDefault";
import { useLocation } from "react-router-dom";
import moment from "moment/moment";

const MemberList = () => {
  const [writeModal, setWriteModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [detailIdx, setDetailIdx] = useState("");
  const [memberData, setMemberData] = useState([]);
  const location = useLocation();
  const { grade } = location.state || {};
  useEffect(() => {
    getMember();
  }, []);

  const getMember = async () => {
    const selectGrade = []
    switch (grade) {
      case '슈퍼관리자':
        selectGrade.push(2, 3);
        break;
      case '지점관리자':
        selectGrade.push(3);
        break;
      case '영업사원':
        selectGrade.push(5); //본인것만 호출
        break;
      default:
        return;
    }
    try {
      const response = await Axios.get(
        "http://localhost:3001/api/get/member_list", {
        params: {
          grade: selectGrade
        }
      }
      );
      const allData = response.data;
      setMemberData(allData);
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };
  const columns = [
    {
      field: "id", headerName: "No.", flex: 0.5
    },
    { field: "name", headerName: "영업사원이름" },
    { field: "phone", headerName: "연락처" },
    { field: "date", headerName: "등록일" },
    { field: "pay", headerName: "완료커미션" },
    { field: "customer_num", headerName: "고객수" },
    { field: "hope_num", headerName: "상담희망수" },
    { field: "bank_num", headerName: "입금계좌" },
  ];

  const rows = memberData.map((data, index) => ({
    id: index + 1,
    idx: data.idx,
    name: data.name,
    phone: data.phone,
    date: moment(data.date).format("YY.MM.DD"),
    pay: data.pay,
    customer_num: data.customer_num,
    hope_num: data.hope_num,
    bank_num: data.deposit_account,
  }));


  const writeModalOpen = () => {
    setWriteModal(!writeModal);
    getMember();
  };
  const viewModalOpen = (data) => {
    setViewModal(!viewModal);
    const idx = data.idx;
    console.log(idx);
    setDetailIdx(idx);
  };
  const viewModalClose = () => {
    setViewModal(false);
    window.location.reload();
  };



  return (
    <div className="main_wrap">
      <div className="main_back">
        <div className="main_title_box">영업사원관리</div>
        <div className="board_list_wrap">
          <div className="list_area">
            <div className="search_box">
              <div className="search_select">
                <select className="list_select">
                  <option>메뉴</option>
                  <option>제목</option>
                  <option>내용</option>
                  <option>작성자</option>
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
              {grade !== "영업사원" &&
                <div className="title_btn" onClick={() => writeModalOpen()}>
                  등록
                </div>
              }

            </div>
            <div className="table_box list">
              <TableDefault
                rows={rows}
                columns={columns}
                viewModalOpen={viewModalOpen}
              ></TableDefault>
            </div>
          </div>
          {/* <div className="pagination_box">
                        <button>{`<<`}</button>
                        <button>{`<`}</button>
                        <button>1</button>
                        <button>{`>`}</button>
                        <button>{`>>`}</button>
                    </div> */}
        </div>
      </div>
      {writeModal && (
        <MemberWriteModal closeModal={writeModalOpen}></MemberWriteModal>
      )}
      {viewModal && (
        <MemberViewModal
          closeModal={viewModalClose}
          detailIdx={detailIdx}
        ></MemberViewModal>
      )}
    </div>
  );
};

export default MemberList;
