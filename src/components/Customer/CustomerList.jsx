import React, { useEffect, useRef, useState } from "react";
import CustomerViewModal from "../modal/CustomerViewModal";
import TableDefault from "../Table/TableDefault";
import { useAuth } from "../Context/AuthContext";
import { useLocation } from "react-router-dom";
import Axios from "axios";
import moment from "moment";
import CustomerSelect from "./CustomerSelect";
const CustomerList = () => {
  const selectRef = useRef(null);
  const { decodeS3, decodeS1 } = useAuth();
  const location = useLocation();
  const { grade } = location.state || {};
  const { defaultSelect } = location.state || {};
  const [viewModal, setViewModal] = useState(false);
  const [detailIdx, setDetailIdx] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [tab, setTab] = useState(3);
  const [searchData, setSearchData] = useState([]);
  const [numberData, setNumberData] = useState([]);

  useEffect(() => {
    if (defaultSelect) {
      setSearchData(defaultSelect);
    }
  }, [defaultSelect]);
  useEffect(() => {
    getCustomer();
  }, [tab, searchData]);

  const getCustomer = async () => {
    const resultParams = {};
    switch (grade) {
      case "슈퍼관리자":
        resultParams.grade = 1;
        resultParams.status = tab;
        resultParams.searchData = searchData;
        break;
      case "지점관리자":
        resultParams.grade = 2;
        resultParams.uid = decodeS1();
        resultParams.status = tab;
        resultParams.searchData = searchData;
        break;
      case "영업사원":
        resultParams.grade = 3;
        resultParams.uid = decodeS1();
        resultParams.status = tab;
        resultParams.searchData = searchData;
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
      setCustomerData(allData.data);
      setNumberData(allData.numbers);
      if (searchData && allData.data.length === 0) {
        alert("검색조건에 맞는 데이터가 없습니다.");
        // selectRef.current.clearSearch();
      }
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };

  //검진대기
  const columns3 = [
    { field: "id", headerName: "No", flex: 0.5 },
    { field: "contractor_name", headerName: "계약자", flex: 0.5 },
    { field: "name", headerName: "검진자", flex: 0.5 },
    { field: "phone", headerName: "연락처" },
    { field: "date", headerName: "가입일" },
    { field: "product", headerName: "상품명" },
    { field: "hospital", headerName: "병원" },
    { field: "hope_date_1", headerName: "희망일1" },
    { field: "hope_date_2", headerName: "희망일2" },
    { field: "result_date", headerName: "확정일" },
    // { field: "status", headerName: "검진유무", flex: 0.5 },
    { field: "pay_status", headerName: "입금여부", flex: 0.5 },
    { field: "hope_status", headerName: "상담희망", flex: 0.5 },
    { field: "branch", headerName: "지점명", flex: 0.5 },
    { field: "sms_status", headerName: "문자전송여부", flex: 0.5 },
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
  //검진완료
  const columns1 = [
    { field: "id", headerName: "No", flex: 0.5 },
    { field: "contractor_name", headerName: "계약자", flex: 0.5 },
    { field: "name", headerName: "검진자", flex: 0.5 },
    { field: "phone", headerName: "연락처" },
    { field: "date", headerName: "가입일" },
    { field: "product", headerName: "상품명" },
    { field: "hospital", headerName: "병원" },
    { field: "result_date", headerName: "확정일" },
    { field: "pay_status", headerName: "입금여부", flex: 0.5 },
    { field: "hope_status", headerName: "상담희망", flex: 0.5 },
    { field: "branch", headerName: "지점명", flex: 0.5 },
  ];
  //검진취소
  const columns2 = [
    { field: "id", headerName: "No", flex: 0.5 },
    { field: "contractor_name", headerName: "계약자", flex: 0.5 },
    { field: "name", headerName: "검진자", flex: 0.5 },
    { field: "phone", headerName: "연락처" },
    { field: "date", headerName: "가입일" },
    { field: "product", headerName: "상품명" },
    { field: "hospital", headerName: "병원" },
    // { field: "hope_date_1", headerName: "희망일1" },
    // { field: "hope_date_2", headerName: "희망일2" },
    { field: "result_date", headerName: "확정일" },
    { field: "pay_status", headerName: "입금여부", flex: 0.5 },
    { field: "hope_status", headerName: "상담희망", flex: 0.5 },
    { field: "refund_status", headerName: "환불여부", flex: 0.5 },
    { field: "branch", headerName: "지점명", flex: 0.5 },
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
    refund_status: data.refund_status,
    sms_status: data.sms_status,
    branch: `${data.company} ${data.branch}`,
    uid: data.uid,
    h_location: data.location,
    phone_2: data.phone_2,
  }));

  const viewModalOpen = (data) => {
    setViewModal(!viewModal);
    setDetailIdx(data);
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
    const {
      uid,
      name,
      product,
      hospital,
      phone,
      phone_2,
      hope_date_1,
      hope_date_2,
      h_location,
    } = data;
    // 서버로 데이터 전송
    Axios.post("http://localhost:3001/api/post/send_message", {
      uid,
      name,
      product,
      hospital,
      phone, // 계약자번호
      phone_2, //검진자번호
      hope_date_1,
      hope_date_2,
      h_location,
    })
      .then((response) => {
        // 성공 시 처리
        console.log("Message sent successfully:", response);
        alert("메시지를 성공적으로 전송했습니다.");
        window.location.reload();
      })
      .catch((error) => {
        // 실패 시 처리
        console.error("Error sending message:", error);
        alert("메시지 전송 중 오류가 발생했습니다.");
      });
  };

  const changeTab = (num) => {
    setTab(num);
    setViewModal(false);
    setDetailIdx([]);
  };
  return (
    <div className="main_wrap">
      <div className="main_back">
        <div className="main_title_box">
          고객 관리
          <div className="total_data_box">
            <div className="total_box">총 고객 : {numberData.allNum}</div>
            <div className="total_box">
              검진완료고객: {numberData.statusNum1}
            </div>
            <div className="total_box">
              검진대기고객: {numberData.statusNum3}
            </div>
            <div className="total_box">상담희망고객: {numberData.hopeNum}</div>
            <div className="total_box">계약고객: {numberData.contractNum}</div>
          </div>
        </div>
        <div className="board_list_wrap">
          <div className="list_area">
            <div className="search_box">
              <CustomerSelect
                ref={selectRef}
                setSearchData={setSearchData}
                defaultSelect={defaultSelect}
              ></CustomerSelect>
              {/* <div className="title_btn">등록</div> */}
            </div>
            <div className="tab_area">
              <div className="tab_back">
                <div
                  className={`tab_menu ${tab === 3 && "active"}`}
                  onClick={() => changeTab(3)}
                >
                  검진대기
                </div>
                <div
                  className={`tab_menu ${tab === 1 && "active"}`}
                  onClick={() => changeTab(1)}
                >
                  검진완료
                </div>
                <div
                  className={`tab_menu ${tab === 2 && "active"}`}
                  onClick={() => changeTab(2)}
                >
                  검진취소
                </div>
              </div>
            </div>
            <div className="table_box tab_list">
              <TableDefault
                rows={rows}
                columns={tab === 1 ? columns1 : tab === 2 ? columns2 : columns3}
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
      {viewModal && detailIdx && (
        <CustomerViewModal
          closeModal={viewModalClose}
          detailIdx={detailIdx}
        ></CustomerViewModal>
      )}
    </div>
  );
};

export default CustomerList;
