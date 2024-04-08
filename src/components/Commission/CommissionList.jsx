import React, { useEffect, useState } from "react";
import TableDefault from "../Table/TableDefault";
import { useLocation, useNavigate } from "react-router-dom";
import Axios from "axios";
import { useAuth } from "../Context/AuthContext";

const CommissionList = () => {
  const { decodeS3, decodeS1 } = useAuth();
  const [writeModal, setWriteModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [detailIdx, setDetailIdx] = useState("");
  const [memberData, setMemberData] = useState([]);
  const [tab, setTab] = useState(1);
  const location = useLocation();
  const { grade } = location.state || {};
  const navigate = useNavigate();

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

  //지급완료
  const columns1 = [
    { field: "id", headerName: "No", flex: 0.5 },
    { field: "category", headerName: "지점종류" },
    { field: "company_name", headerName: "회사명" },
    { field: "name", headerName: "지점명" },
    { field: "pay", headerName: "지급커미션합계" },
    { field: "pay", headerName: "지급예정커미션" },
    { field: "pay", headerName: "미지급커미션" },
    { field: "address", headerName: "지역" },
    { field: "date", headerName: "생성일" },
    { field: "member_num", headerName: "영업사원수", maxWidth: 100 },
  ];
  //미지급
  const columns2 = [
    { field: "id", headerName: "No", flex: 0.5 },
    { field: "category", headerName: "지점종류" },
    { field: "company_name", headerName: "회사명" },
    { field: "name", headerName: "지점명" },
    { field: "pay", headerName: "지급커미션합계" },
    { field: "pay", headerName: "지급예정커미션" },
    { field: "pay", headerName: "미지급커미션" },
    { field: "address", headerName: "지역" },
    { field: "date", headerName: "생성일" },
    { field: "member_num", headerName: "영업사원수", maxWidth: 100 },
  ];
  const rows = [
    {
      id: 1,
      category: "보험사",
      company_name: "회사명",
      name: "지점명",
      pay: 4000000,
      address: "충남 천안",
      date: "24.03.07",
      member_num: 30,
    },
  ];

  const moveDetailPage = (id) => {
    navigate(`/commission/${id}`);
  };

  const changeTab = (num) => {
    setTab(num);
    setViewModal(false);
    setDetailIdx([]);
  };

  return (
    <div className="main_wrap">
      <div className="main_back">
        <div className="main_title_box">커미션 관리</div>
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
            </div>
            {grade !== "영업사원" && (
              <div className="tab_area">
                <div className="tab_back">
                  <div
                    className={`tab_menu ${tab === 1 && "active"}`}
                    onClick={() => changeTab(1)}
                  >
                    지급완료
                  </div>
                  <div
                    className={`tab_menu ${tab === 2 && "active"}`}
                    onClick={() => changeTab(2)}
                  >
                    미지급
                  </div>
                </div>
              </div>
            )}
            <div className="table_box list">
              <TableDefault
                rows={rows}
                columns={tab === 1 ? columns1 : columns2}
                viewModalOpen={moveDetailPage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommissionList;
