import React, { Fragment, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import TableDefault from "../Table/TableDefault";
import Axios from "axios";
import moment from "moment";

const Home = () => {
  const { decodeS1, decodeS4 } = useAuth();
  const [homeData, setHomeData] = useState([]); // 병원 리스트
  const navigation = useNavigate();

  useEffect(() => {
    fetchData();
  }, [decodeS1()]);

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
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };

  const columns = [
    { field: "id", headerName: "No", flex: 0.5 },
    { field: "name", headerName: "성명" },
    { field: "phone", headerName: "연락처" },
    { field: "product", headerName: "상품" },
    { field: "hospital", headerName: "검진병원" },
    { field: "date", headerName: "검진일" },
  ];

  const rows = homeData.map((data, index) => ({
    id: index + 1,
    idx: data.idx,
    name: data.name,
    phone: data.phone,
    product: data.product,
    hospital: data.hospital,
    date: moment(data.date).format("YYYY.MM.DD"),
  }));

  console.log(rows);
  let decodeResult;

  switch (decodeS4()) {
    case "슈퍼관리자":
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
            <div>
              7일이내 검진예약 고객명단
              <div>영업사원키: {decodeS1()}</div>
              <div className="table_box list">
                <TableDefault
                  rows={rows}
                  columns={columns}
                  // viewModalOpen={viewModalOpen}
                />
              </div>
              <div className="customer_btn_box">
                <div
                  className="customer_btn"
                  onClick={() =>
                    navigation("/reserv", { state: { status: "" } })
                  }
                >
                  예약 시작
                </div>
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
