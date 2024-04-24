import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import Axios from "axios";
import ApexCharts from "apexcharts";

const SalesManager = () => {
  const { decodeS1, decodeS4 } = useAuth();
  const [salesManager, setSalesManager] = useState([]);

  useEffect(() => {
    getSalesMangerData();
  }, []);

  useEffect(() => {
    if (decodeS4() === "슈퍼관리자") {
      renderApexChart();
    }
  }, []);

  const getSalesMangerData = async () => {
    try {
      const response = await Axios.get(
        "http://49.50.174.248:3001/api/get/sales_customer",
        {
          params: {
            uid: decodeS1(), // uid를 params에 전달
          },
        }
      );
      const allData = response.data;
      setSalesManager(allData);
      console.log(allData);
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };

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

  if (decodeS4() === "슈퍼관리자") {
    jsxToRender = (
      <div className="main_wrap">
        <div className="main_back">
          <div className="main_title_box">영업자 현황</div>
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

export default SalesManager;
