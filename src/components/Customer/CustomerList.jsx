import React, { useEffect, useRef, useState } from "react";
import CustomerViewModal from "../modal/CustomerViewModal";
import TableDefault from "../Table/TableDefault";
import { useAuth } from "../Context/AuthContext";
import { useLocation } from "react-router-dom";
import Axios from "axios";
import moment from "moment";
import CustomerSelect from "./CustomerSelect";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const CustomerList = () => {
  const selectRef = useRef(null);
  const { decodeS1, decodeS4 } = useAuth();
  const location = useLocation();
  const { grade } = location.state || {};
  const { defaultSelect } = location.state || {};
  const [viewModal, setViewModal] = useState(false);
  const [detailIdx, setDetailIdx] = useState([]);
  const [tab, setTab] = useState(3);
  const [searchData, setSearchData] = useState([]);
  const [numberData, setNumberData] = useState([]);
  const [arrayData, setArrayData] = useState([]);

  useEffect(() => {
    if (defaultSelect) {
      setSearchData(defaultSelect);
    }
  }, [defaultSelect]);
  useEffect(() => {
    getCustomer();
  }, [tab, searchData]);

  const printCustom = () => {
    const today = moment().format("YYYYMMDD");

    let sheetName;
    switch (tab) {
      case 1:
        sheetName = `검진완료 현황_${today}`;
        break;
      case 2:
        sheetName = `검진취소 현황_${today}`;
        break;
      case 3:
        sheetName = `검진대기 현황_${today}`;
        break;
      default:
        sheetName = `데이터_${today}`;
    }

    const rowsToPrint = rows.map((row) => {
      const newRow = {};
      newRow["No"] = row.id;
      newRow["예약자"] = row.contractor_name;
      newRow["검진자"] = row.name;
      newRow["연락처"] = row.phone;
      newRow["가입일"] = row.date;
      newRow["상품명"] = row.product;
      newRow["병원"] = row.hospital;
      newRow["확정일"] = row.result_date;
      newRow["검진시간"] = row.start_time;
      newRow["입금여부"] = row.pay_status;
      newRow["상담희망"] = row.hope_status;
      newRow["지점명"] = row.branch;
      return newRow;
    });

    const worksheet = XLSX.utils.json_to_sheet(rowsToPrint);
    worksheet["!cols"] = [
      { width: 4 },
      { width: 18 },
      { width: 25 },
      { width: 18 },
      { width: 18 },
      { width: 18 },
      { width: 18 },
      { width: 18 },
      { width: 14 },
      { width: 14 },
      { width: 20 },
    ];

    // 엑셀 배율 설정
    worksheet["!zoom"] = 80;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, `${sheetName}.xlsx`);
  };

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
      const arrayData = response.data.data;
      if (Object.keys(allData.numbers).length > 0) {
        setNumberData(allData.numbers);
      }
      console.log(arrayData);

      // 중복된 uid가 있는 경우 중복을 제거하고, name 필드는 모두 가져와서 합침
      const uniqueArrayData = Array.from(
        new Set(arrayData.map((item) => item.uid))
      ).map((uid) => ({
        ...arrayData.find((item) => item.uid === uid),
        name: arrayData
          .filter((item) => item.uid === uid)
          .map((item) => item.name)
          .join(", "),
      }));

      setArrayData(uniqueArrayData);

      if (Object.keys(searchData).length !== 0 && allData.data.length === 0) {
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
    { field: "contractor_name", headerName: "예약자", flex: 0.5 },
    { field: "name", headerName: "검진자", flex: 0.5 },
    { field: "phone", headerName: "연락처" },
    { field: "date", headerName: "가입일" },
    { field: "product", headerName: "상품명" },
    { field: "hospital", headerName: "병원" },
    // { field: "hope_date_1", headerName: "희망일1" },
    // { field: "hope_date_2", headerName: "희망일2" },
    { field: "start_time", headerName: "검진시간" },
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
    { field: "contractor_name", headerName: "예약자", flex: 0.5 },
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
    { field: "contractor_name", headerName: "예약자", flex: 0.5 },
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

  //지점장
  const columnsManager = [
    { field: "id", headerName: "No" },
    { field: "contractor_name", headerName: "계약자" },
    { field: "name", headerName: "검진자" },
    { field: "phone", headerName: "연락처" },
    { field: "date", headerName: "가입일" },
    { field: "product", headerName: "상품명" },
    { field: "hospital", headerName: "검진병원" },
    { field: "result_date", headerName: "검진일" },
    { field: "manager", headerName: "영업사원" },
    { field: "hope_status", headerName: "상담희망" },
    { field: "contract", headerName: "계약유무" },
    { field: "memo", headerName: "비고" },
  ];

  const rows = arrayData
    .map((data, index) => {
      const filteredData = arrayData.filter((item) => item.uid === data.uid);
      const names = filteredData.map((item) => item.name).join(", ");
      return {
        id: index + 1,
        idx: data.idx,
        contractor_name: data.contractor_name,
        name: names,
        phone: data.phone,
        date: moment(data.date).format("YYYY.MM.DD"),
        product: data.product,
        hospital: data.hospital,
        hope_date_1: data.hope_date_1,
        hope_date_2: data.hope_date_2,
        start_time: data.start_time,
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
        memo: data.memo,
        contract: data.contract,
        manager: data.manager,
      };
    })
    .filter((value, index, self) => {
      return self.findIndex((item) => item.uid === value.uid) === index;
    });

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
      phone, // 예약자번호
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
    selectRef.current.clearSearch();
  };

  let jsxToRender;

  if (decodeS4() === "슈퍼관리자") {
    jsxToRender = (
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
              <div className="total_box">
                상담희망고객: {numberData.hopeNum}
              </div>
              <div className="total_box">
                예약고객: {numberData.contractNum}
              </div>
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
                  <div
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "#4CAF50",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      textAlign: "center",
                      float: "right",
                    }}
                    onClick={printCustom}
                  >
                    인쇄
                  </div>
                </div>
              </div>
              <div className="table_box tab_list">
                <TableDefault
                  rows={rows}
                  columns={
                    tab === 1 ? columns1 : tab === 2 ? columns2 : columns3
                  }
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
            </div>
                */}
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
  } else if (decodeS4() === "지점관리자") {
    jsxToRender = (
      <div className="main_wrap">
        <div className="main_back">
          <div className="main_title_box">
            고객 관리
            <div className="total_data_box">
              <div className="total_box">
                가입고객현황 : {numberData.allNum}
              </div>
              <div className="total_box">
                상담희망고객수: {numberData.hopeNum}
              </div>
              <div className="total_box">
                계약고객수: {numberData.contractNum}
              </div>
            </div>
          </div>
          <div className="board_list_wrap">
            <div className="list_area">
              <div className="search_box">
                <CustomerSelect
                  ref={selectRef}
                  setSearchData={setSearchData}
                  defaultSelect={defaultSelect}
                  level={decodeS4()}
                ></CustomerSelect>
                {/* <div className="title_btn">등록</div> */}
              </div>
              <div className="tab_area">
                <div className="tab_back">
                  <div
                    className={`tab_menu ${tab === 3 && "active"}`}
                    onClick={() => changeTab(3)}
                  >
                    가입고객
                  </div>
                  <div
                    className={`tab_menu ${tab === 1 && "active"}`}
                    onClick={() => changeTab(1)}
                  >
                    상담희망고객
                  </div>
                  <div
                    className={`tab_menu ${tab === 2 && "active"}`}
                    onClick={() => changeTab(2)}
                  >
                    계약고객
                  </div>
                </div>
              </div>
              <div className="table_box tab_list">
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
                    columns={columnsManager}
                    viewModalOpen={viewModalOpen}
                  ></TableDefault>
                )}
              </div>
            </div>
            {/*  <div className="pagination_box">
              <button>{`<<`}</button>
              <button>{`<`}</button>
              <button>1</button>
              <button>{`>`}</button>
              <button>{`>>`}</button>
            </div>
                */}
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
  }
  return jsxToRender;
};

export default CustomerList;
