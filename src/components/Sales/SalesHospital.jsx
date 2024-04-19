import React, { Fragment, useEffect, useState } from "react";
import SalesViewModal from "../modal/SalesViewModal";
import { useAuth } from "../Context/AuthContext";
import Axios from "axios";
import TableDefault from "../Table/TableDefault";
import moment from "moment";
import ApexCharts from "apexcharts";

const SalesHospital = () => {
  const [viewModal, setViewModal] = useState(false);
  const [detailIdx, setDetailIdx] = useState("");
  const [salesData, setSalesData] = useState([]);
  const [arrayData, setArrayData] = useState([]);
  const [contractCount, setContractCount] = useState(0);
  const [hopeCount, setHopeCount] = useState(0);
  const { decodeS1, decodeS4 } = useAuth();

  useEffect(() => {
    getSalesTop();
    getSalesData();
  }, []); // 빈 배열 전달하여 한 번만 실행되도록 함

  useEffect(() => {
    if (decodeS4() === "슈퍼관리자") {
      renderApexChart();
    }
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
        "http://49.50.174.248:3001/api/get/sales_list",
        {
          params: {
            uid: decodeS1(), // uid를 params에 전달
          },
        }
      );
      const arrayData = response.data.data;

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

      console.log(uniqueArrayData);
      setArrayData(uniqueArrayData);
      // 데이터를 받아온 후에 getSalesTop 호출하여 contractCount 설정
      getSalesTop(uniqueArrayData);
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };

  const getSalesTop = async (arrayData) => {
    try {
      const response = await Axios.get(
        "http://49.50.174.248:3001/api/get/sales_top",
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
    { field: "name", headerName: "검진자성명" },
    { field: "phone", headerName: "연락처" },
    { field: "date", headerName: "가입일" },
    { field: "product", headerName: "선택상품" },
    { field: "hospital", headerName: "검진병원" },
    { field: "result_date", headerName: "검진일" },
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
    contract: data.contract,
    memo: data.memo,
    contractor_name: data.contractor_name,
    idx: data.idx,
  }));

  const renderApexChart = () => {
    var options = {
      series: [
        {
          name: "Website Blog",
          type: "column",
          data: [440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160],
        },
        {
          name: "Social Media",
          type: "line",
          data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16],
        },
      ],
      chart: {
        height: 350,
        type: "line",
      },
      stroke: {
        width: [0, 4],
      },
      title: {
        text: "Traffic Sources",
      },
      dataLabels: {
        enabled: true,
        enabledOnSeries: [1],
      },
      labels: [
        "01 Jan 2001",
        "02 Jan 2001",
        "03 Jan 2001",
        "04 Jan 2001",
        "05 Jan 2001",
        "06 Jan 2001",
        "07 Jan 2001",
        "08 Jan 2001",
        "09 Jan 2001",
        "10 Jan 2001",
        "11 Jan 2001",
        "12 Jan 2001",
      ],
      xaxis: {
        type: "datetime",
      },
      yaxis: [
        {
          title: {
            text: "Website Blog",
          },
        },
        {
          opposite: true,
          title: {
            text: "Social Media",
          },
        },
      ],
    };

    // 이전에 렌더링된 차트를 제거
    var existingChart = document.querySelector("#chart");
    if (existingChart) {
      existingChart.remove();
    }

    var newChartContainer = document.createElement("div");
    newChartContainer.id = "chart";
    document.querySelector(".list_area").appendChild(newChartContainer);

    var chart = new ApexCharts(newChartContainer, options);
    chart.render();
  };

  let jsxToRender;

  // 슈퍼관리자일 때
  if (decodeS4() === "슈퍼관리자") {
    jsxToRender = (
      <div className="main_wrap">
        <div className="main_back">
          <div className="main_title_box">병원별 검진고객 현황</div>
          <div className="board_list_wrap">
            <div className="list_area">
              <div className="search_box">
                <div className="list_select_area">
                  <div className="search_select">
                    <select className="list_select">
                      <option>언제부터</option>
                    </select>
                    ~&nbsp;&nbsp;&nbsp;
                    <select className="list_select">
                      <option>언제까지</option>
                    </select>
                  </div>
                </div>
                <div className="title_btn">지점등록</div>
              </div>
              <div id="chart"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  // 지점장일 때
  else if (decodeS4() === "지점장") {
    jsxToRender = <Fragment>{/* 지점장 JSX */}</Fragment>;
  }
  // 영업사원일 때
  else if (decodeS4() === "영업사원") {
    jsxToRender = (
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
              arrayData={arrayData}
            ></SalesViewModal>
          )}
        </div>
      </div>
    );
  }

  return jsxToRender;
};

export default SalesHospital;
