import React, { useEffect, useState } from "react";
import Axios from "axios";
import TableDefault from "./../Table/TableDefault";
import moment from "moment";
import NoticeWriteModal from "./../modal/NoticeWriteModal";
import NoticeViewModal from "../modal/NoticeViewModal";

const Notice = () => {
  const [writeModal, setWriteModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [detailData, setDetailData] = useState([]);
  const [bbsData, setBbsData] = useState([]);
  const [tab, setTab] = useState(1);

  useEffect(() => {
    getMember();
  }, [tab]);

  const downloadImage = (imageUrl) => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = "image.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getMember = async () => {
    try {
      const response = await Axios.get(
        "http://localhost:3001/api/get/notice_list"
      );
      const allData = response.data;
      setBbsData(allData);
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };

  // HTML태그 변환
  const sanitizeHTML = (htmlString) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlString;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  const columns = [
    {
      field: "id",
      headerName: "No.",
      flex: 0.5,
    },
    { field: "title", headerName: "제목" },
    { field: "content", headerName: "내용" },
    { field: "writer", headerName: "작성자" },
    {
      field: "attachment",
      headerName: "첨부",
      renderCell: (params) => (
        <div
          onClick={() =>
            params.row.attachment ? downloadImage(params.row.attachment) : null
          }
        >
          {params.row.attachment ? "O" : "X"}
        </div>
      ),
    },
    { field: "hit", headerName: "조회수" },
    { field: "date", headerName: "등록일" },
  ];

  const rows = bbsData.map((data, index) => ({
    id: index + 1,
    category: data.category,
    writer: data.writer,
    attachment: data.img,
    title: data.title,
    content: sanitizeHTML(data.content),
    date: data.date,
    idx: data.idx,
  }));

  const writeModalOpen = () => {
    setWriteModal(!writeModal);
    getMember();
  };
  const viewModalOpen = (data) => {
    setViewModal(!viewModal);
    setDetailData(data);
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
              <div className="title_btn" onClick={() => writeModalOpen()}>
                등록
              </div>
            </div>
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
          detailData={detailData}
        ></NoticeViewModal>
      )}
    </div>
  );
};

export default Notice;
