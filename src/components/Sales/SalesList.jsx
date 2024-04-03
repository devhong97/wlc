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
  const [contractCount, setContractCount] = useState(0);
  const [hopeCount, setHopeCount] = useState(0);
  const { decodeS1 } = useAuth();

  useEffect(() => {
    getSalesTop();
    getSalesData();
  }, []); // 빈 배열 전달하여 한 번만 실행되도록 함

  const viewModalOpen = (idx) => {
    setViewModal(!viewModal);
    setDetailIdx(idx);
  };
  const closeModal = () => {
    setViewModal(false);
    getSalesData();
  };

  const getSalesData = async () => {
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
      // 데이터를 받아온 후에 getSalesTop 호출하여 contractCount 설정
      getSalesTop(arrayData);
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };

  const getSalesTop = async (arrayData) => {
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
      // arrayData가 설정된 후에 contractCount를 계산합니다.
      const count = arrayData.filter((data) => data.contract === "Y").length;
      const hopeCount = arrayData.filter(
        (data) => data.hope_status === "Y"
      ).length;
      setContractCount(count);
      setHopeCount(hopeCount);
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
    phone_2: data.phone_2,
    date: moment(data.date).format("YYYY.MM.DD"),
    product: data.productName,
    hospital: data.hospitalName,
    result_date: data.result_date,
    hope_status: data.hope_status,
    contract: data.contract,
    memo: data.memo,
    idx: data.idx,
  }));

  return (
    <div className="main_wrap">
      <div className="main_back">
        <div className="main_title_box">실적 관리</div>
        <div className="board_list_wrap">
          <div className="list_area">
            <div className="sales-info-container">
              <div className="sales-info-item">
                <div className="sales-info-title">
                  지점명: {salesData.branch_name}
                </div>
              </div>
              <div className="sales-info-item">
                <div className="sales-info-title">
                  지점장: {salesData.owner_name}
                </div>
              </div>
              <div className="sales-info-item">
                <div className="sales-info-title">
                  가입회원수: {salesData.salesCount}
                </div>
              </div>
              <div className="sales-info-item">
                <div className="sales-info-title">
                  상담희망고객수: {hopeCount}
                </div>
              </div>
              <div className="sales-info-item">
                <div className="sales-info-title">
                  계약고객수: {contractCount}
                </div>
              </div>
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
            closeModal={closeModal}
            detailIdx={detailIdx}
          ></SalesViewModal>
        )}
      </div>
    </div>
  );
};

export default SalesList;
