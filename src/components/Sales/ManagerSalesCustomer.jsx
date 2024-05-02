import moment from "moment";
import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import ApexCharts from "react-apexcharts";
import Axios from "axios";
import { useAuth } from "../Context/AuthContext";

const ManagerSalesCustomer = () => {
  const [openStartCalendar, setOpenStartCalendar] = useState(false); //달력오픈
  const [openEndCalendar, setOpenEndCalendar] = useState(false); //달력오픈
  const [resultStartDate, setResultStartDate] = useState(""); //시작날짜
  const [resultStartCalendar, setResultStartCalendar] = useState(""); //시작날짜 캘린더
  const [searchData, setSearchData] = useState([]); //검색데이터
  const [monthValue, setMonthValue] = useState("");
  const [customerData, setCustomerData] = useState([]); //고객데이터
  const [hopeData, setHopeData] = useState([]); //희망고객데이터
  const [contractData, setContractData] = useState([]); //계약고객데이터
  const [customerCount, setCustomerCount] = useState(""); //고객데이터
  const [hopeCount, setHopeCount] = useState(""); //희망고객데이터
  const [contractCount, setContractCount] = useState(""); //계약고객데이터
  const [cateData, setCateData] = useState([]); //카테고리데이터
  const { decodeS0, decodeS1, decodeS4 } = useAuth();

  useEffect(() => {
    getCustomer();
  }, [searchData]);

  const getCustomer = async () => {
    setCateData([]);
    setCustomerData([]);
    setHopeData([]);
    setContractData([]);
    const resultParams = {};
    resultParams.branch_idx = decodeS0();
    if (searchData) {
      resultParams.searchData = searchData;
    }

    try {
      const response = await Axios.get(
        "http://localhost:3001/api/get/avg_data",
        {
          params: resultParams,
        }
      );
      if (response.data.success === true) {
        const allData = response.data.data;
        const allCount = response.data.count;
        allData.forEach((item) => {
          const formattedDate = moment(item.date).format("MM.DD");
          setCateData((prev) => [...prev, formattedDate]);
          setCustomerData((prev) => [...prev, item.totalCount]);
          setHopeData((prev) => [...prev, item.hopeCount]);
          setContractData((prev) => [...prev, item.contractCount]);
        });
        setCustomerCount(allCount.allTotalCount);
        setHopeCount(allCount.allHopeCount);
        setContractCount(allCount.allContractCount);
      } else {
        alert("검색조건에 맞는 데이터가 없습니다.");
        setCustomerCount(0);
        setHopeCount(0);
        setContractCount(0);
      }
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };

  // 달력상태
  const startCalendarStatus = () => {
    setOpenStartCalendar(!openStartCalendar);
  };
  const endCalendarStatus = () => {
    setOpenEndCalendar(!openEndCalendar);
  };
  // react-calendar 데이터형태
  const setFormatDate = (date) => {
    const momentDate = moment(date).format("YYYY-MM");
    const monthValue = moment(date).format("MM");
    setMonthValue(monthValue);
    setResultStartDate(momentDate);
    setResultStartCalendar(date);
    setOpenStartCalendar(false);
  };
  const clearSearch = () => {
    setSearchData([]);
    setResultStartDate("");
    setResultStartCalendar("");
    setMonthValue("");
  };

  const handleSearch = () => {
    if (resultStartDate === "") {
      alert("올바른 기간을 선택해주세요.");
    }
    const searchValue = {
      st_date: resultStartDate,
    };
    setSearchData(searchValue);
  };

  const barChart = {
    series: [
      {
        name: "가입고객수",
        type: "bar",
        data: customerData,
      },
      {
        name: "상담희망고객수",
        type: "bar",
        data: hopeData,
      },
      {
        name: "계약고객현황",
        type: "bar",
        data: contractData,
      },
    ],
    options: {
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        bar: {
          horizontal: false,
        },
      },

      legend: {
        tooltipHoverFormatter: function (val, opts) {
          return (
            val +
            " - <strong>" +
            opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
            "</strong>"
          );
        },
      },
      tooltip: {
        y: [
          {
            title: {
              formatter: function (val) {
                return val;
              },
            },
          },
          {
            title: {
              formatter: function (val) {
                return val;
              },
            },
          },
          {
            title: {
              formatter: function (val) {
                return val;
              },
            },
          },
        ],
      },
      chart: {
        type: "bar",
        height: 350,
        stacked: true,
        stackType: "100%",
        animations: {
          enabled: false,
        },
      },
      title: {
        text: "고객현황",
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            legend: {
              position: "bottom",
              offsetX: -10,
              offsetY: 0,
            },
          },
        },
      ],
      fill: {
        opacity: 1,
      },

      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return Math.round(val) + "%";
        },
        style: {
          fontSize: "12px",
          colors: ["#304758"],
        },
      },
      xaxis: {
        categories: cateData,
      },
    },
  };
  return (
    <div className="main_wrap">
      <div className="main_back">
        <div className="main_title_box">
          실적 관리
          <div className="total_data_box">
            <div className="total_box">가입고객현황 : {customerCount}</div>
            <div className="total_box">상담희망고객현황 : {hopeCount}</div>
            <div className="total_box">계약고객현황 : {contractCount}</div>
          </div>
        </div>
        <div className="board_list_wrap chart">
          <div className="list_area chart">
            <div className="search_box">
              <div className="list_select_area">
                <div className="search_select">
                  <div className="search_input">
                    <input
                      className="list_input chart"
                      type="text"
                      id="title"
                      placeholder="월"
                      value={resultStartDate}
                      onClick={() => startCalendarStatus()}
                      readOnly
                    ></input>

                    {openStartCalendar && (
                      <Calendar
                        className="chart_calendar"
                        onChange={(date) => setFormatDate(date)}
                        value={resultStartCalendar}
                        minDate={null} // 모든 년도 선택 가능하도록 null로 설정
                        defaultView="year"
                        maxDetail="year"
                        calendarType="gregory"
                      />
                    )}
                  </div>
                </div>
                <div className="search_input">
                  <div className="list_search" onClick={() => handleSearch()}>
                    검색
                  </div>
                  <div
                    className="list_search reset_btn"
                    onClick={() => clearSearch()}
                  >
                    초기화
                  </div>
                </div>
              </div>
            </div>
            <div className="table_box list">
              <div className="chart_box">
                <ApexCharts
                  options={barChart.options}
                  series={barChart.series}
                  height={450}
                ></ApexCharts>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerSalesCustomer;
