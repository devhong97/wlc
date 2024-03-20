import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { useLocation } from "react-router-dom";
import Axios from "axios";
import TableDefault from "./../Table/TableDefault";
import moment from "moment";
import NoticeWriteModal from "./../modal/NoticeWriteModal";
import NoticeViewModal from "../modal/NoticeViewModal";

const Notice = () => {
  const { decodeS3, decodeS1 } = useAuth();
  const [writeModal, setWriteModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [detailIdx, setDetailIdx] = useState("");
  const [memberData, setMemberData] = useState([]);
  const [tab, setTab] = useState(1);
  const location = useLocation();
  const { grade } = location.state || {};

  useEffect(() => {
    getMember();
  }, [tab]);

  const getMember = async () => {
    const selectGrade = [];
    const resultParams = {};
    switch (grade) {
      case "슈퍼관리자":
        resultParams.grade = [1, 2, 3];
        resultParams.status = tab;
        break;
      case "지점관리자":
        // 본인 지점과 같은 사원만 노출해야함 (나중에하기)
        resultParams.grade = [2, 3];
        resultParams.status = tab;
        resultParams.branch = decodeS3();
        break;
      case "영업사원":
        resultParams.grade = [3];
        resultParams.status = tab;
        resultParams.uid = decodeS1();
        break;
      default:
        return;
    }
    try {
      const response = await Axios.get(
        "http://localhost:3001/api/get/notice_list",
        {
          params: resultParams,
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
      field: "id",
      headerName: "No.",
      flex: 0.5,
    },
    { field: "title", headerName: "제목" },
    { field: "content", headerName: "내용" },
    { field: "date", headerName: "등록일" },
  ];
  const checkGrade = (data) => {
    switch (data) {
      case 1:
        return "슈퍼관리자";
      case 2:
        return "지점관리자";
      case 3:
        return "영업사원";
      default:
        return "";
    }
  };
  const rows = memberData.map((data, index) => ({
    id: index + 1,
    idx: data.idx,
    name: data.name,
    grade: checkGrade(data.grade),
    branch: data.branch,
    phone: data.phone,
    date: moment(data.date).format("YYYY.MM.DD"),
    pay: data.pay,
    customer_num: data.customer_num,
    hope_num: data.hope_num,
    bank_num: data.bank + data.deposit_account,
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
  const viewModalClose = (status) => {
    setViewModal(false);
    if (status === "reload") {
      window.location.reload();
    } else {
      getMember();
    }
  };

  return (
    <div className="main_wrap">
      <div className="main_back">
        <div className="main_title_box">게시판관리</div>
        <div className="board_list_wrap">
          <div className="list_area">
            <div className="search_box">
              <div className="search_select">
                <select className="list_select">
                  <option>제목</option>
                  <option>내용</option>
                </select>
              </div>
              <div className="search_input">
                <input
                  className="list_input"
                  placeholder="검색어를 입력하세요"
                ></input>
                <div className="list_search">검색</div>
                <div className="list_search reset_btn">초기화</div>
              </div>
              {grade !== "영업사원" && (
                <div className="title_btn" onClick={() => writeModalOpen()}>
                  등록
                </div>
              )}
            </div>
            {grade !== "영업사원" && (
              <div className="tab_area">
                <div className="tab_back">
                  <div
                    className={`tab_menu ${tab === 1 && "active"}`}
                    onClick={() => setTab(1)}
                  >
                    공지사항
                  </div>
                </div>
              </div>
            )}
            <div className="table_box list">
              <TableDefault
                rows={rows}
                columns={columns}
                viewModalOpen={viewModalOpen}
              ></TableDefault>
            </div>
          </div>
        </div>
      </div>
      {writeModal && (
        <NoticeWriteModal closeModal={writeModalOpen}></NoticeWriteModal>
      )}
      {viewModal && (
        <NoticeViewModal
          closeModal={viewModalClose}
          detailIdx={detailIdx}
        ></NoticeViewModal>
      )}
    </div>
  );
};

export default Notice;
