import React, { useEffect, useState } from "react";
import TableDefault from "../Table/TableDefault";
import moment from "moment";
import Axios from "axios";

const MemberListModal = (props) => {
  const [selectData, setSelectData] = useState([]);

  useEffect(() => {
    getMember();
  }, []);

  const columns = [
    { field: "id", headerName: "No", maxWidth: 50 },
    { field: "name", headerName: "이름" },
    { field: "phone", headerName: "연락처" },
    { field: "date", headerName: "등록일" },
    { field: "category", headerName: "종류" },
    { field: "company_name", headerName: "지점" },
    {
      field: "select",
      headerName: "-",
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
        "http://localhost:3001/api/get/branch_manager_list"
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
    category: data.branch_type,
    company_name: data.company_name,
  }));

  const clearModal = () => {
    props.closeModal();
  };

  const selectRow = (data) => {
    console.log(data);
    const name = data.name;
    // const num = data.id;
    // props.chooseData(name, num);
    props.chooseData(name);
    clearModal();
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
              <div className="table_box">
                <TableDefault
                  rows={rows}
                  columns={columns}
                  viewModalOpen={emptyFunc}
                ></TableDefault>
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
