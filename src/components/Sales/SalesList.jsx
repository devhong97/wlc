import React, { Fragment, useEffect, useState } from "react";
import SalesViewModal from "../modal/SalesViewModal";
import { useAuth } from "../Context/AuthContext";
import Axios from "axios";
import TableDefault from "../Table/TableDefault";
import moment from "moment";

const SalesList = () => {
  const [viewModal, setViewModal] = useState(false);
  const [detailIdx, setDetailIdx] = useState("");
  const [salesData, setSalesData] = useState([]);
  const [arrayData, setArrayData] = useState([]);

  const { decodeS1 } = useAuth();

  useEffect(() => {
    getSalesTop();
    getSalesData();
  }, []); // 빈 배열 전달하여 한 번만 실행되도록 함

  const viewModalOpen = (idx) => {
    setViewModal(!viewModal);
    setDetailIdx(idx);
  };

  const getSalesData = async () => {
    try {
      const response = await Axios.get(
        "http://localhost:3001/api/get/sales_top",
        {
          params: {
            uid: decodeS1(), // uid를 params에 전달
          },
        }
      );
      const allData = response.data.data[0];
      setSalesData(allData);
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };

  const getSalesTop = async () => {
    try {
      const response = await Axios.get(
        "http://localhost:3001/api/get/sales_list",
        {
          params: {
            uid: decodeS1(), // uid를 params에 전달
          },
        }
      );
      const arrayData = response.data.data;
      console.log(arrayData);
      setArrayData(arrayData);
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };

  //검진완료
  const columns = [
    { field: "id", headerName: "No", flex: 0.5 },
    { field: "name", headerName: "성명", flex: 0.5 },
    { field: "phone", headerName: "연락처" },
    { field: "date", headerName: "가입일" },
    { field: "product", headerName: "선택상품" },
    { field: "hospital", headerName: "검진병원" },
    { field: "result_date", headerName: "검진일" },
    { field: "hope_status", headerName: "상담희망" },
    { field: "contract", headerName: "계약" },
    { field: "memo", headerName: "비고" },
  ];

  const rows = arrayData.map((data, index) => ({
    id: index + 1,
    name: data.name,
    phone: data.phone,
    date: moment(data.date).format("YYYY.MM.DD"),
    product: data.productName,
    hospital: data.hospitalName,
    result_date: data.result_date,
    hope_status: data.hope_status,
    contract: data.contract,
    memo: data.memo,
    contractor_name: data.contractor_name,
    idx: data.idx,
  }));

  const handleContractCheckbox = (idx) => {
    // 해당 idx의 계약 상태를 토글
    const newData = arrayData.map((data, index) =>
      index === idx ? { ...data, contract: !data.contract } : data
    );
    setArrayData(newData);
  };

  const handleMemoClick = (idx) => {
    setViewModal(true); // 모달 열기
    setDetailIdx(idx); // 선택한 항목의 idx 설정
  };

  return (
    <div className="main_wrap">
      <div className="main_back">
        <div className="main_title_box">실적 관리</div>
        <div className="board_list_wrap">
          <div className="list_area">
            <div className="sales-info-container">
              <div className="sales-info-item">
                지점명: {salesData.branch_name}
              </div>
              <div className="sales-info-item">
                지점장: {salesData.owner_name}
              </div>
              <div className="sales-info-item">
                가입회원수: {salesData.salesCount}
              </div>
              <div className="sales-info-item">상담희망고객수: X</div>
              <div className="sales-info-item">계약고객수: X</div>
            </div>
          </div>
          <div className="table_box tab_list">
            <TableDefault
              rows={rows}
              columns={columns}
              viewModalOpen={viewModalOpen}
            ></TableDefault>
          </div>
        </div>
        {viewModal && (
          <SalesViewModal
            closeModal={viewModalOpen}
            detailIdx={detailIdx}
          ></SalesViewModal>
        )}
      </div>
    </div>
  );
};

export default SalesList;
