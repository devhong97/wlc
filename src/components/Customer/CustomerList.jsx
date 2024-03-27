import React, { useEffect, useState } from "react";
import CustomerViewModal from "../modal/CustomerViewModal";
import TableDefault from "../Table/TableDefault";
import { useAuth } from "../Context/AuthContext";
import { useLocation } from "react-router-dom";
import Axios from "axios";
import moment from "moment";
const CustomerList = () => {
  const { decodeS3, decodeS1 } = useAuth();
  const location = useLocation();
  const { grade } = location.state || {};
  const [viewModal, setViewModal] = useState(false);
  const [detailIdx, setDetailIdx] = useState("");
  const [customerData, setCustomerData] = useState([]);

  useEffect(() => {
    getCustomer();
  }, []);

  const getCustomer = async () => {
    const resultParams = {};
    switch (grade) {
      case "슈퍼관리자":
        resultParams.grade = 1;
        break;
      case "지점관리자":
        resultParams.grade = 2;
        resultParams.uid = decodeS1();
        break;
      case "영업사원":
        resultParams.grade = 3;
        resultParams.uid = decodeS1();
        break;
      default:
        return;
    }
    try {
      const response = await Axios.get(
        "http://localhost:3001/api/get/customer_list",
        {
          params: resultParams,
        }
      );
      const allData = response.data;
      setCustomerData(allData);
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };

  const columns = [
    { field: "id", headerName: "No", flex: 0.5 },
    { field: "contractor_name", headerName: "계약자" },
    { field: "name", headerName: "검진자" },
    { field: "phone", headerName: "연락처" },
    { field: "date", headerName: "가입일" },
    { field: "product", headerName: "상품명" },
    { field: "hospital", headerName: "병원" },
    { field: "hope_date_1", headerName: "희망일1" },
    { field: "hope_date_2", headerName: "희망일2" },
    { field: "result_date", headerName: "확정일" },
    { field: "status", headerName: "검진유무" },
    { field: "pay_status", headerName: "입금여부" },
    { field: "hope_status", headerName: "상담희망" },
    // { field: 'branch', headerName: '지점명', },
    // { field: 'manager', headerName: '영업자' },
    {
      field: "send",
      headerName: "문자전송",
      type: "actions",
      renderCell: (params) => (
        <div className="list_inner_btn" onClick={() => sendMsg(params.row)}>
          전송
        </div>
      ),
    },
  ];

  const rows = customerData.map((data, index) => ({
    id: index + 1,
    idx: data.idx,
    contractor_name: data.contractor_name,
    name: data.name,
    phone: data.phone,
    date: moment(data.date).format("YYYY.MM.DD"),
    product: data.product,
    hospital: data.hospital,
    hope_date_1: data.hope_date_1,
    hope_date_2: data.hope_date_2,
    result_date: data.result_date,
    status: data.status,
    pay_status: data.pay_status,
    hope_status: data.hope_status,
    branch: data.branch,
    manager: data.manager,
  }));
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
      getCustomer();
    }
  };

  const sendMsg = (data) => {
    alert(data.id);
  };
  return (
    <div className="main_wrap">
      <div className="main_back">
        <div className="main_title_box">고객 관리</div>
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
              {/* <div className="title_btn">등록</div> */}
            </div>
            <div className="table_box list">
              <TableDefault
                rows={rows}
                columns={columns}
                viewModalOpen={viewModalOpen}
              ></TableDefault>
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
      {viewModal && (
        <CustomerViewModal
          closeModal={viewModalClose}
          detailIdx={detailIdx}
        ></CustomerViewModal>
      )}
    </div>
  );
};

export default CustomerList;
