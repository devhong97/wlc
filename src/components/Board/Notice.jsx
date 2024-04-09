import React, { useEffect, useState } from "react";
import Axios from "axios";
import TableDefault from "./../Table/TableDefault";
import moment from "moment";
import NoticeWriteModal from "./../modal/NoticeWriteModal";
import NoticeViewModal from "../modal/NoticeViewModal";
import { useAuth } from "../Context/AuthContext";

const Notice = () => {
  const [writeModal, setWriteModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [detailData, setDetailData] = useState([]);
  const [bbsData, setBbsData] = useState([]);
  const [tab, setTab] = useState(1);
  const [searchType, setSearchType] = useState("title"); //기본 검색타입
  const [searchKeyword, setSearchKeyword] = useState(""); //검색어
  const { decodeS4 } = useAuth();

  useEffect(() => {
    getBoard();
  }, [tab]);

  const getBoard = async () => {
    try {
      const response = await Axios.get(
        "http://49.50.174.248:3001/api/get/notice_list"
      );
      const allData = response.data;
      setBbsData(allData);
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };

  const searchBoard = async () => {
    try {
      const response = await Axios.post(
        "http://49.50.174.248:3001/api/post/search_notice",
        {
          searchType,
          searchKeyword,
        }
      );
      const searchData = response.data;
      setBbsData(searchData);
    } catch (error) {
      console.error("Error searching data:", error);
    }
  };

  const columns = [
    {
      field: "id",
      headerName: "No.",
      flex: 0.5,
    },
    { field: "title", headerName: "제목" },
    { field: "htmlContent", headerName: "내용" },
    { field: "writer", headerName: "작성자" },
    {
      field: "attachment",
      headerName: "첨부",
      renderCell: (params) => <div>{params.row.attachment ? "O" : "X"}</div>,
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
    content: data.content,
    hit: data.hit,
    htmlContent: data.content.replace(/<[^>]+>/g, ""),
    date: data.date,
    idx: data.idx,
  }));

  const writeModalOpen = () => {
    setWriteModal(!writeModal);
    getBoard();
  };

  const viewModalOpen = (data) => {
    setViewModal(!viewModal);
    setDetailData(data);

    //조회수증가
    Axios.post("http://49.50.174.248:3001/api/post/notice_hit", {
      idx: data.idx,
    })
      .then((response) => {
        if (response.data.success) {
          if (!viewModal) {
            setViewModal(true);
          }
        } else {
          console.error("Failed to update hit count.");
        }
      })
      .catch((error) => {
        console.error("Error while updating hit count:", error);
      });
  };

  const viewModalClose = (status) => {
    setViewModal(false);
    if (status === "reload") {
      window.location.reload();
    } else {
      getBoard();
    }
  };

  const handleSearchTypeChange = (e) => {
    setSearchType(e.target.value);
  };

  const handleSearchKeywordChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  const handleSearch = () => {
    searchBoard();
  };

  const handleResetSearch = () => {
    setSearchKeyword("");
    setSearchType("");
    getBoard();
  };

  return (
    <div className="main_wrap">
      <div className="main_back">
        <div className="main_title_box">
          {decodeS4() === "슈퍼관리자" ? "게시판관리" : "게시판"}
        </div>
        <div className="board_list_wrap">
          <div className="list_area">
            <div className="search_box">
              <div className="search_select">
                <select
                  className="list_select"
                  value={searchType}
                  onChange={(e) => setSearchType(e.target.value)}
                >
                  <option value="title">제목</option>
                  <option value="content">내용</option>
                  <option value="writer">작성자</option>
                </select>
              </div>
              <div className="search_input">
                <input
                  className="list_input"
                  placeholder="검색어를 입력하세요"
                  value={searchKeyword}
                  onChange={handleSearchKeywordChange}
                ></input>
                <div className="list_search" onClick={handleSearch}>
                  검색
                </div>
                <div
                  className="list_search reset_btn"
                  onClick={handleResetSearch}
                >
                  초기화
                </div>
              </div>
              {decodeS4() === "슈퍼관리자" ? (
                <div className="title_btn" onClick={() => writeModalOpen()}>
                  등록
                </div>
              ) : null}
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
