import React, { useEffect, useState } from "react";
import TableDefault from "../Table/TableDefault";
import moment from "moment";
import Axios from "axios";

const MemberListModal = (props) => {
  const [selectData, setSelectData] = useState([]);
  const { branchIdx } = props;
  const [searchType, setSearchType] = useState("name"); //기본 검색타입
  const [searchKeyword, setSearchKeyword] = useState(""); //검색어

  useEffect(() => {
    getMember();
  }, []);

  const searchBoard = async () => {
    try {
      const response = await Axios.post(
        "http://localhost:3001/api/post/search_user_account",
        {
          branch_idx: branchIdx,
          searchType,
          searchKeyword,
        }
      );
      const searchData = response.data;
      setSelectData(searchData);
    } catch (error) {
      console.error("Error searching data:", error);
    }
  };

  const columns = [
    { field: "id", headerName: "No", maxWidth: 50 },
    { field: "name", headerName: "이름" },
    { field: "phone", headerName: "연락처" },
    { field: "date", headerName: "등록일" },
    { field: "branch_type", headerName: "지점종류" },
    { field: "company_name", headerName: "회사명" },
    { field: "branch_name", headerName: "지점명" },
    {
      field: "select",
      headerName: "",
      type: "actions",
      renderCell: (params) => (
        <div className="list_inner_btn" onClick={() => selectRow(params.row)}>
          선택
        </div>
      ),
    },
  ];

  const getMember = async () => {
    try {
      const response = await Axios.get(
        "http://localhost:3001/api/get/branch_manager_list",
        {
          params: {
            branch_idx: branchIdx, // branchIdx를 파라미터로 전달
          },
        }
      );
      const allData = response.data;
      setSelectData(allData);
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };

  const rows = selectData.map((data, index) => ({
    id: index + 1,
    name: data.name,
    phone: data.phone,
    date: moment(data.date).format("YY.MM.DD"),
    branch_type: data.branch_type,
    company_name: data.company_name,
    branch_name: data.branch,
    branch_idx: data.branch_idx,
    uid: data.uid,
  }));

  const clearModal = () => {
    props.closeModal();
  };

  const selectRow = async (data) => {
    const name = data.name;
    const branchIdx = data.branch_idx;
    console.log("name", name, "branchIdx", branchIdx);

    try {
      await Axios.put("http://localhost:3001/api/update/user_grade", {
        userId: data.uid, // 선택된 사용자의 ID를 전송
        branchIdx: data.branch_idx,
      });
      props.chooseData(name);
      clearModal();
    } catch (error) {
      console.error("Error updating user grade:", error);
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
    getMember();
  };

  const emptyFunc = () => {};

  return (
    <div className="modal_wrap">
      <div className="modal_back">
        <div className="modal_box">
          <div className="modal_title_box">
            <div className="modal_title">영업사원 목록</div>
            <div className="modal_close_btn" onClick={() => clearModal()}>
              X
            </div>
          </div>

          <div className="board_list_wrap">
            <div className="list_area">
              <div className="search_box" style={{ padding: "10px 0px" }}>
                <div className="search_select">
                  <select
                    className="list_select"
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                  >
                    <option value="name">이름</option>
                    <option value="phone">연락처("-"제외)</option>
                    <option value="branch_type">지점종류</option>
                    <option value="company_name">회사명</option>
                    <option value="branch_name">지점명</option>
                  </select>
                </div>
                <div className="search_input">
                  <input
                    className="list_input"
                    placeholder="검색어를 입력하세요"
                    value={searchKeyword}
                    onChange={handleSearchKeywordChange}
                  ></input>
                  <div
                    className="list_search"
                    style={{ marginRight: 10 }}
                    onClick={handleSearch}
                  >
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
              <div className="table_box">
                {rows.length === 0 ? (
                  <div
                    style={{
                      width: "100%",
                      textAlign: "center",
                      border: "1px solid #ccc",
                      padding: "100px",
                      fontSize: "18px",
                      background: "white",
                    }}
                  >
                    데이터가 존재하지 않습니다.
                  </div>
                ) : (
                  <TableDefault
                    rows={rows}
                    columns={columns}
                    viewModalOpen={emptyFunc}
                  ></TableDefault>
                )}
              </div>
            </div>
          </div>
          <div className="modal_footer_box">
            <div className="modal_btn close" onClick={clearModal}>
              닫기
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberListModal;
