import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import Axios from "axios";
import ApexCharts from "apexcharts";

const SalesCustomer = () => {
  const { decodeS1, decodeS4 } = useAuth();
  const [salesManager, setSalesManager] = useState([]);
  const [salesLength, setSalesLength] = useState([]);

  useEffect(() => {
    getSalesManagerData();
  }, []);

  useEffect(() => {
    if (decodeS4() === "슈퍼관리자" && salesManager.length > 0) {
      renderApexChart(salesManager);
    }
  }, [salesManager]);

  const getSalesManagerData = async () => {
    try {
      const response = await Axios.get(
        "http://118.67.134.86:3001/api/get/sales_customer",
        {
          params: {
            uid: decodeS1(),
          },
        }
      );
      const allData = response.data.data;
      setSalesManager(allData);
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };

  const renderApexChart = (data) => {
    const startDate = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );
    const endDate = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      0
    );
    const dateRange = getDates(startDate, endDate);

    const formattedData = dateRange.map((date) => {
      const existingData = data.find(
        (entry) => entry.formattedDate === formatDate(date)
      );
      return {
        formattedDate: formatDate(date),
        customerCount: existingData ? existingData.customerCount : 0,
      };
    });

    // 데이터가 없는 경우에만 0으로 설정
    if (formattedData.length === 0) {
      formattedData.push({
        formattedDate: formatDate(new Date()),
        customerCount: 0,
      });
    }

    const options = {
      series: [
        {
          name: "가입 고객 수",
          data: formattedData.map((entry) => parseInt(entry.customerCount)),
        },
      ],
      chart: {
        height: 350,
        type: "area",
      },
      xaxis: {
        categories: formattedData.map((entry) => entry.formattedDate),
        labels: {
          formatter: function (val) {
            return new Date(val).toLocaleDateString("ko-KR", {
              month: "2-digit",
              day: "2-digit",
            });
          },
        },
      },
      yaxis: {
        min: 0,
        labels: {
          formatter: function (value) {
            return parseInt(value);
          },
        },
        forceNiceScale: true,
      },
      stroke: {
        width: 1.5, // 여기서 선의 두께를 조정합니다. 기본값은 3입니다.
      },
    };

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

  const getDates = (startDate, endDate) => {
    const dates = [];
    let currentDate = startDate;
    while (currentDate <= endDate) {
      dates.push(currentDate);
      currentDate = new Date(currentDate);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  let jsxToRender;

  if (decodeS4() === "슈퍼관리자") {
    jsxToRender = (
      <div className="main_wrap">
        <div className="main_back">
          <div className="main_title_box">고객현황</div>
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

  return jsxToRender;
};

export default SalesCustomer;
