import React, { useEffect, useState } from "react";
import SalesViewModal from "../modal/SalesViewModal";
import { useAuth } from "../Context/AuthContext";
import Axios from "axios";
import TableDefault from "../Table/TableDefault";
import moment from "moment";
import InspectionViewModal from "../modal/InspectionViewModal";

const Inspection = () => {
  const [viewModal, setViewModal] = useState(false);
  const [detailIdx, setDetailIdx] = useState("");
  const [arrayData, setArrayData] = useState([]);
  const [contractCount, setContractCount] = useState(0);
  const [hopeCount, setHopeCount] = useState(0);
  const { decodeS0, decodeS1 } = useAuth();

  useEffect(() => {
    getSalesData();
  }, []);

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
        "http://localhost:3001/api/get/inspect_list",
        {
          params: {
            uid: decodeS1(),
          },
        }
      );
      const arrayData = response.data.data;

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
      const count = uniqueArrayData.filter(
        (data) => data.contract === "Y"
      ).length;
      const hopeCount = uniqueArrayData.filter(
        (data) => data.hope_status === "Y"
      ).length;
      setContractCount(count);
      setHopeCount(hopeCount);
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };

  const columns = [
    { field: "id", headerName: "No", flex: 0.5 },
    { field: "name", headerName: "검진자성명" },
    { field: "phone", headerName: "연락처" },
    { field: "date", headerName: "가입일" },
    { field: "product", headerName: "선택상품" },
    { field: "hospital", headerName: "검진병원" },
    { field: "result_date", headerName: "검진일" },
    { field: "consulting_time", headerName: "상담희망일" },
    { field: "hope_status", headerName: "상담희망", flex: 0.5 },
    { field: "contract", headerName: "계약", flex: 0.5 },
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
    consulting_time: data.consulting_time,
    contract: data.contract,
    memo: data.memo,
    contractor_name: data.contractor_name,
    address: data.address,
    consulting_location: data.consulting_location,
    consulting_date: data.consulting_date,
    idx: data.idx,
  }));

  let jsxToRender;
  jsxToRender = (
    <div className="main_wrap">
      <div className="main_back">
        <div className="main_title_box">보험점검 예약 관리</div>
        <div className="board_list_wrap chart">
          <div className="list_area">
            <div className="sales-info-container">
              <div className="sales-info-item">
                <div className="sales-info-title">
                  보험점검 희망고객수: {rows.length}
                </div>
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
                columns={columns}
                viewModalOpen={viewModalOpen}
              ></TableDefault>
            )}
          </div>
        </div>
        {viewModal && (
          <InspectionViewModal
            closeModal={closeModal}
            detailIdx={detailIdx}
            arrayData={arrayData}
          ></InspectionViewModal>
        )}
      </div>
    </div>
  );

  return jsxToRender;
};

export default Inspection;
