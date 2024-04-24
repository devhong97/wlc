import React, { useEffect, useRef, useState } from "react";
import TableDefault from "../Table/TableDefault";
import { useLocation, useNavigate } from "react-router-dom";
import Axios from "axios";
import { useAuth } from "../Context/AuthContext";
import CommisionSelect from "./CommisionSelect";
import moment from "moment";

const CommissionList = () => {
  const selectRef = useRef(null);
  const { decodeS3, decodeS1 } = useAuth();
  const location = useLocation();
  const { defaultSelect } = location.state || {};
  const [writeModal, setWriteModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [detailIdx, setDetailIdx] = useState("");
  const [commisionData, setCommisionData] = useState([]);
  const [tab, setTab] = useState(1);
  const [searchData, setSearchData] = useState([]);
  const { grade } = location.state || {};
  const navigate = useNavigate();

  useEffect(() => {
    if (defaultSelect) {
      setSearchData(defaultSelect);
    }
  }, [defaultSelect]);

  useEffect(() => {
    getMember();
  }, [tab]);

  const getMember = async () => {
    const resultParams = {};
    switch (grade) {
      case "슈퍼관리자":
        resultParams.grade = [1, 2, 3];
        resultParams.status = tab;
        break;
      case "지점관리자":
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

    const fetchCommisionList = () => {
      Axios.get("http://49.50.174.248:3001/api/get/commision_list", {
        params: resultParams,
      })
        .then((res) => {
          if (res.data.success) {
            setCommisionData(
              res.data.data.map((data, index) => ({
                id: index + 1,
                branch_idx: data.branch_idx,
                branch_type: data.branch_type,
                company_name: data.company_name,
                branch_name: data.branch_name,
                location: data.location,
                date: moment(data.date).format("YYYY.MM.DD"),
                idx: data.idx,
              }))
            );
          } else {
            console.error("지점 관리 데이터 호출 실패");
            if (searchData) {
              alert("검색 조건에 맞는 데이터가 없습니다.");
              selectRef.current.clearSearch();
            }
          }
        })
        .catch((err) => {
          console.error("지점 관리 데이터 호출 실패:", err);
        });
    };

    fetchCommisionList();
  };

  //지급완료
  const columns1 = [
    { field: "id", headerName: "No", flex: 0.5 },
    { field: "branch_type", headerName: "지점종류" },
    { field: "company_name", headerName: "회사명" },
    { field: "branch_name", headerName: "지점명" },
    { field: "total_pay", headerName: "지급커미션합계" },
    { field: "pay", headerName: "지급예정커미션" },
    { field: "location", headerName: "지역" },
    { field: "date", headerName: "생성일" },
    { field: "member_num", headerName: "영업사원수", maxWidth: 100 },
  ];
  //미지급
  const columns2 = [
    { field: "id", headerName: "No", flex: 0.5 },
    { field: "branch_type", headerName: "지점종류" },
    { field: "company_name", headerName: "회사명" },
    { field: "branch_name", headerName: "지점명" },
    { field: "total_pay", headerName: "지급커미션합계" },
    { field: "pay", headerName: "지급예정커미션" },
    { field: "location", headerName: "지역" },
    { field: "date", headerName: "생성일" },
    { field: "member_num", headerName: "영업사원수", maxWidth: 100 },
  ];

  const moveDetailPage = (id) => {
    navigate(`/commission/${id}`);
  };

  const changeTab = (num) => {
    setTab(num);
    setViewModal(false);
    setDetailIdx([]);
    selectRef.current.clearSearch();
  };

  return (
    <div className="main_wrap">
      <div className="main_back">
        <div className="main_title_box">커미션 관리</div>
        <div className="board_list_wrap">
          <div className="list_area">
            <div className="search_box">
              <div className="search_select">
                <CommisionSelect
                  ref={selectRef}
                  setSearchData={setSearchData}
                  defaultSelect={defaultSelect}
                ></CommisionSelect>
              </div>
            </div>
            {grade !== "영업사원" && (
              <div className="tab_area">
                <div className="tab_back">
                  <div
                    className={`tab_menu ${tab === 1 && "active"}`}
                    onClick={() => changeTab(1)}
                  >
                    지급커미션
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
            <div className="table_box tab_list">
              <TableDefault
                rows={commisionData}
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
