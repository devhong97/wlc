import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import TableDefault from "../Table/TableDefault";
import Axios from "axios";
import moment from "moment";

const Home = () => {
  const { decodeS1, decodeS4 } = useAuth();
  const [homeData, setHomeData] = useState([]); // 병원 리스트
  const [totalData, setTotalData] = useState([]); // 총지점수
  const [managerData, setManagerData] = useState([]); // 총영업자수
  const [contractData, setContractData] = useState([]); // 총계약자수
  const [hopeData, setHopeData] = useState([]); // 상담고객수
  const [customerData, setCustomerData] = useState([]); // 총고객수
  const navigation = useNavigate();

  useEffect(() => {
    getTotalData();
    fetchData();
    console.log("totalData", totalData);
  }, [decodeS1()]);

  const getTotalData = async () => {
    try {
      const response = await Axios.get(
        "http://localhost:3001/api/get/home_total"
      );
      const allData = response.data.branchCount;
      const managerData = response.data.userCount;
      const contractData = response.data.contractCount;
      const hopeData = response.data.hopeCount;
      const customerData = response.data.customerCount;
      const resultData = response.data.result_date;
      setTotalData(allData);
      setManagerData(managerData);
      setContractData(contractData);
      setHopeData(hopeData);
      setCustomerData(customerData);
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await Axios.get(
        "http://localhost:3001/api/get/home_list",
        {
          params: {
            uid: decodeS1(),
          },
        }
      );
      const allData = response.data;
      setHomeData(allData.data);
      console.log(allData);
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };

  const columns = [
    { field: "id", headerName: "No", flex: 0.5 },
    { field: "name", headerName: "계약자" },
    { field: "customerName", headerName: "검진자" },
    { field: "phone", headerName: "연락처" },
    { field: "product", headerName: "상품" },
    { field: "hospital", headerName: "검진병원" },
    { field: "result_date", headerName: "검진일" },
  ];

  const rows = homeData.map((data, index) => ({
    id: index + 1,
    idx: data.idx,
    name: data.contractor_name,
    customerName: data.name,
    phone: data.phone,
    product: data.productName,
    hospital: data.hospitalName,
    result_date: data.result_date,
  }));

  const viewModalOpen = () => {};

  let decodeResult;

  switch (decodeS4()) {
    case "슈퍼관리자":
      decodeResult = (
        <div className="main_wrap">
          <div className="main_back">
            <div className="super_wrap">
              <div>총매출액: </div>
              <div>총커미션합계: </div>
              <div>지급예정커미션: </div>
              <div>고객수: {customerData}</div>
              <div>상담희망고객수: {hopeData}</div>
              <div>총지점수: {totalData}</div>
              <div>총영업자수: {managerData}</div>
              <div>계약고객수(청약고객수): {contractData} </div>
            </div>
          </div>
        </div>
      );
      break;
    case "지점관리자":
      decodeResult = (
        <div className="main_wrap">
          <div className="main_back">
            <div>총매출액</div>
            <div>총커미션합계</div>
            <div>지급예정커미션</div>
            <div>고객수</div>
            <div>상담희망고객수</div>
            <div>총지점수</div>
            <div>총영업자수</div>
            <div>계약고객수(청약고객수)</div>

            <div>{decodeS4()}</div>
          </div>
        </div>
      );
      break;
    case "영업사원":
      decodeResult = (
        <div className="main_wrap">
          <div className="main_back">
            <div className="main_title_box">7일이내 검진예약 고객명단</div>
            <div className="table_box list">
              <TableDefault
                rows={rows}
                columns={columns}
                viewModalOpen={viewModalOpen}
              />
            </div>
            <div className="customer_btn_box">
              <div
                className="customer_btn"
                onClick={() => navigation("/reserv", { state: { status: "" } })}
              >
                예약 시작
              </div>
            </div>
          </div>
        </div>
      );
      break;
    default:
      decodeResult = null;
  }
  return <Fragment>{decodeResult}</Fragment>;
};

export default Home;
