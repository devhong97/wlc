import React, { Fragment, useEffect, useRef, useState } from "react";
import MemberWriteModal from "../modal/MemberWriteModal";
import MemberViewModal from "../modal/MemberViewModal";
import { DataGrid } from "@mui/x-data-grid";
import Axios, { all } from "axios";
import TableDefault from "../Table/TableDefault";
import { useLocation } from "react-router-dom";
import moment from "moment/moment";
import { useAuth } from "../Context/AuthContext";
import MemberSelect from "./MemberSelect";

const MemberList = () => {
  const selectRef = useRef(null);
  const { decodeS0, decodeS1, decodeS3, decodeS4 } = useAuth();
  const [writeModal, setWriteModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [detailIdx, setDetailIdx] = useState([]);
  const [memberData, setMemberData] = useState([]);
  const [tab, setTab] = useState(1);
  const [searchType, setSearchType] = useState("name"); //기본 검색타입
  const [searchKeyword, setSearchKeyword] = useState(""); //검색어
  const location = useLocation();
  const { grade } = location.state || {};
  const [searchData, setSearchData] = useState([]);
  const [grade2Data, setGrade2Data] = useState([]); //지점장 페이지데이터
  const [grade2Data2, setGrade2Data2] = useState([]);
  const [grade2Data3, setGrade2Data3] = useState([]);
  const [grade2Data4, setGrade2Data4] = useState([]);
  const [grade2Data5, setGrade2Data5] = useState([]);

  useEffect(() => {
    getMember();
    grade2TotalData();
  }, [tab, searchData]); // tab, searchData 변경 시마다 호출

  useEffect(() => {
    grade2TotalData();
  }, []); // 컴포넌트가 처음 마운트될 때 한 번 호출

  //지점장 페이지
  const grade2TotalData = async () => {
    try {
      const response = await Axios.get(
        "http://localhost:3001/api/get/home_manager",
        {
          params: {
            branchIdx: decodeS0(),
          },
        }
      );
      const gradeData = response.data.data;

      const branchAccount = gradeData.branchAccount;
      const userAccount = gradeData.userAccount;
      const hTotal = gradeData.hTotal;
      const hope = gradeData.hope;
      const contract = gradeData.contract;

      setGrade2Data(branchAccount);
      setGrade2Data2(userAccount);
      setGrade2Data3(hTotal);
      setGrade2Data4(hope);
      setGrade2Data5(contract);

      console.log(gradeData);
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };

  const getMember = async () => {
    console.log(searchData);
    const selectGrade = [];
    const resultParams = {};

    switch (grade) {
      case "슈퍼관리자":
        resultParams.grade = [1, 2, 3];
        resultParams.status = tab;
        resultParams.searchData = searchData;
        break;
      case "지점관리자":
        // 본인 지점과 같은 사원만 노출해야함 (나중에하기)
        resultParams.grade = [2, 3];
        resultParams.status = tab;
        resultParams.branch = decodeS3();
        resultParams.searchData = searchData;
        break;
      case "영업사원":
        resultParams.grade = [3];
        resultParams.status = tab;
        resultParams.uid = decodeS1();
        resultParams.searchData = searchData;
        break;
      default:
        return;
    }
    try {
      const response = await Axios.get(
        "http://localhost:3001/api/get/member_list",
        {
          params: resultParams,
        }
      );
      const allData = response.data;
      setMemberData(allData);
      if (Object.keys(searchData).length !== 0 && allData.length === 0) {
        alert("검색조건에 맞는 데이터가 없습니다.");
        // selectRef.current.clearSearch();
      }
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
    { field: "name", headerName: "사원이름" },
    { field: "grade", headerName: "직급" },
    { field: "branch", headerName: "지점명" },
    { field: "phone", headerName: "연락처" },
    { field: "date", headerName: "등록일" },
    { field: "pay", headerName: "완료커미션" },
    { field: "customer_num", headerName: "고객수" },
    { field: "hope_num", headerName: "상담희망수" },
    { field: "bank_num", headerName: "입금계좌" },
  ];
  const subColumns = [
    {
      field: "id",
      headerName: "No.",
      flex: 0.5,
    },
    { field: "name", headerName: "사원이름" },
    { field: "grade", headerName: "직급" },
    { field: "branch", headerName: "지점명" },
    { field: "phone", headerName: "연락처" },
    { field: "date", headerName: "등록일" },
    { field: "bank_num", headerName: "입금계좌" },
  ];

  const columns2 = [
    {
      field: "id",
      headerName: "No.",
      flex: 0.5,
    },
    { field: "name", headerName: "영업자성명" },
    { field: "phone", headerName: "연락처" },
    { field: "date", headerName: "등록일" },
    { field: "customer_num", headerName: "가입회원현황" },
    { field: "hope_num", headerName: "상담희망회원" },
    { field: "contract_num", headerName: "계약고객수" },
  ];
  const subColumns2 = [
    {
      field: "id",
      headerName: "No.",
      flex: 0.5,
    },
    { field: "name", headerName: "영업자성명" },
    { field: "phone", headerName: "연락처" },
    { field: "date", headerName: "등록일" },
    { field: "customer_num", headerName: "가입회원현황" },
    { field: "hope_num", headerName: "상담희망회원" },
    { field: "contract_num", headerName: "계약고객수" },
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
    customer_num: data.customer_list ? data.customer_list.length : 0,
    hope_num: data.hope_list ? data.hope_list.length : 0,
    contract_num: data.contract_list ? data.contract_list.length : 0,
    bank_num: data.bank + data.deposit_account,
  }));

  const writeModalOpen = () => {
    setWriteModal(!writeModal);
    getMember();
  };
  const viewModalOpen = (data) => {
    setViewModal(!viewModal);
    setDetailIdx(data);
  };

  const viewModalClose = (status) => {
    setViewModal(false);
    console.log("detailIdx before reset", detailIdx);
    setDetailIdx(""); // detailIdx 초기화
    console.log("detailIdx after reset", detailIdx);
    if (status === "reload") {
      window.location.reload();
    } else {
      getMember();
    }
  };

  const changeTab = (num) => {
    setTab(num);
    setViewModal(false);
    setDetailIdx([]);
    if (selectRef.current) {
      selectRef.current.clearSearch(); // selectRef가 null이 아닌 경우에만 호출
    }
  };

  const searchBoard = async () => {
    try {
      const response = await Axios.post(
        "http://localhost:3001/api/post/search_mem",
        {
          searchType,
          searchKeyword,
          branch: decodeS3(),
        }
      );
      const searchData = response.data;
      setMemberData(searchData);
    } catch (error) {
      console.error("Error searching data:", error);
    }
  };

  const handleSearch = () => {
    searchBoard();
  };

  const handleSearchKeywordChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  const handleResetSearch = () => {
    setSearchKeyword("");
    setSearchType("");
    getMember();
  };

  let decodeResult;

  switch (decodeS4()) {
    case "슈퍼관리자":
      decodeResult = (
        <div className="main_wrap">
          <div className="main_back">
            <div className="main_title_box">
              영업사원관리
              <div className="total_data_box">
                <div className="total_box">커미션합계 : -</div>
                <div className="total_box">지급예정커미션: -</div>
                <div className="total_box">영업사원수: {memberData.length}</div>
              </div>
            </div>
            <div className="board_list_wrap">
              <div className="list_area">
                <div className="search_box">
                  <MemberSelect
                    ref={selectRef}
                    setSearchData={setSearchData}
                  ></MemberSelect>
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
                        onClick={() => changeTab(1)}
                      >
                        승인회원
                      </div>
                      <div
                        className={`tab_menu ${tab === 3 && "active"}`}
                        onClick={() => changeTab(3)}
                      >
                        대기회원
                      </div>
                    </div>
                  </div>
                )}
                <div
                  className={`table_box ${
                    grade !== "영업사원" ? "tab_list" : "list"
                  }`}
                >
                  <TableDefault
                    rows={rows}
                    columns={tab === 1 ? columns : subColumns}
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
          {viewModal && detailIdx && (
            <MemberViewModal
              closeModal={viewModalClose}
              detailIdx={detailIdx}
            ></MemberViewModal>
          )}
        </div>
      );
      break;
    case "지점관리자":
      decodeResult = (
        <div className="main_wrap">
          <div className="main_back">
            <div className="main_title_box">
              영업사원관리
              <div className="total_data_box">
                <div className="total_box">
                  소속영업사원수: {memberData.length}
                </div>
                <div className="total_box">
                  가입고객현황:{" "}
                  {grade2Data3.length > 0 ? grade2Data3[0].totalCount : 0}
                </div>
                <div className="total_box">
                  상담희망고객수:{" "}
                  {grade2Data4.length > 0 ? grade2Data4[0].hopeCount : 0}
                </div>
                <div className="total_box">
                  계약고객수:{" "}
                  {grade2Data5.length > 0 ? grade2Data5[0].contractCount : 0}
                </div>
              </div>
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
                      <option value="name">사원명</option>
                    </select>
                  </div>
                  <div className="search_input">
                    <input
                      className="list_input"
                      placeholder="검색어를 입력하세요"
                      value={searchKeyword}
                      onChange={handleSearchKeywordChange}
                    ></input>
                  </div>
                  <div className="search_input">
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
                </div>
                {grade !== "영업사원" && (
                  <div className="tab_area">
                    <div className="tab_back">
                      <div
                        className={`tab_menu ${tab === 1 && "active"}`}
                        onClick={() => changeTab(1)}
                      >
                        승인회원
                      </div>
                      <div
                        className={`tab_menu ${tab === 3 && "active"}`}
                        onClick={() => changeTab(3)}
                      >
                        대기회원
                      </div>
                    </div>
                  </div>
                )}
                <div
                  className={`table_box ${
                    grade !== "영업사원" ? "tab_list" : "list"
                  }`}
                >
                  <TableDefault
                    rows={rows}
                    columns={tab === 1 ? columns2 : subColumns2}
                    viewModalOpen={viewModalOpen}
                  ></TableDefault>
                </div>
              </div>
            </div>
          </div>
          {writeModal && (
            <MemberWriteModal closeModal={writeModalOpen}></MemberWriteModal>
          )}
          {viewModal && detailIdx && (
            <MemberViewModal
              closeModal={viewModalClose}
              detailIdx={detailIdx}
            ></MemberViewModal>
          )}
        </div>
      );
      break;
  }

  return <Fragment>{decodeResult}</Fragment>;
};

export default MemberList;
