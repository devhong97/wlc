import moment from "moment";
import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import ApexCharts from "react-apexcharts";
import Axios from "axios";
import { useBranchContext } from "../Context/BranchContext";
const AdminSalesList = () => {
  const {
    typeGroup,
    companyGroup,
    branchGroup,
    setContextType,
    setContextCompany,
  } = useBranchContext();
  const [openStartCalendar, setOpenStartCalendar] = useState(false); //달력오픈
  const [openEndCalendar, setOpenEndCalendar] = useState(false); //달력오픈
  const [resultStartDate, setResultStartDate] = useState(""); //시작날짜
  const [resultEndDate, setResultEndDate] = useState(""); //종료날짜
  const [resultStartCalendar, setResultStartCalendar] = useState(""); //시작날짜 캘린더
  const [resultEndCalendar, setResultEndCalendar] = useState(""); //종료날짜 캘린더
  const [costData, setCostData] = useState([]); //가격데이터
  const [cateData, setCateData] = useState([]); //카테고리데이터
  const [searchData, setSearchData] = useState([]); //검색데이터
  const [type, setType] = useState("");
  const [company, setCompany] = useState("");
  const [branchName, setBranchName] = useState("");
  const [branchIdx, setBranchIdx] = useState("");

  useEffect(() => {
    getCost();
  }, [searchData]);

  const getCost = async () => {
    setCateData([]);
    setCostData([]);
    const resultParams = {};
    if (searchData) {
      resultParams.searchData = searchData;
    }
    try {
      const response = await Axios.get(
        "http://localhost:3001/api/get/cost_list",
        {
          params: resultParams,
        }
      );
      const allData = response.data.data;
      allData.forEach((item) => {
        const formattedDate = moment(item.formattedDate).format("MM.DD");
        setCateData((prev) => [...prev, formattedDate]);
        setCostData((prev) => [...prev, item.totalCost]);
      });
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };

  const handleSearch = () => {
    if (resultStartDate !== "" && resultEndDate === "") {
      alert("올바른 기간을 선택해주세요.");
    } else if (resultEndDate !== "" && resultStartDate === "") {
      alert("올바른 기간을 선택해주세요.");
    }
    const searchValue = {
      st_date: resultStartDate,
      ed_date: resultEndDate,
      branch_type: type,
      company_name: company,
      branch_name: branchName,
    };
    setSearchData(searchValue);
  };
  const clearSearch = () => {
    setSearchData([]);
    setResultStartDate("");
    setResultEndDate("");
    setResultEndCalendar("");
    setResultStartCalendar("");
    selectType("");
  };
  useEffect(() => {
    setContextType(type);
  }, [type]);

  useEffect(() => {
    setContextCompany(company);
  }, [company]);
  const selectBranch = (num) => {
    setBranchIdx(num);
    const selectedBranch = branchGroup.find((data) => data.branch_idx === num);
    if (selectedBranch) {
      setBranchName(selectedBranch.branch_name);
    }
  };

  const selectType = (data) => {
    setType(data);
    setCompany("");
    setBranchIdx("");
    setBranchName("");
  };
  // 달력상태
  const startCalendarStatus = () => {
    setOpenStartCalendar(!openStartCalendar);
  };
  const endCalendarStatus = () => {
    setOpenEndCalendar(!openEndCalendar);
  };

  // react-calendar 데이터형태
  const setFormatDate = (date, status) => {
    const momentDate = moment(date).format("YYYY-MM-DD");
    if (status === "start") {
      setResultStartDate(momentDate);
      setResultStartCalendar(date);
      setOpenStartCalendar(false);
    } else {
      setResultEndDate(momentDate);
      setResultEndCalendar(date);
      setOpenEndCalendar(false);
    }
  };

  const lineChart = {
    series: [
      {
        name: "매출",
        data: costData,
      },
    ],
    options: {
      dataLabels: {
        enabled: false,
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
        ],
      },
      chart: {
        type: "line",
      },
      title: {
        text: "매출현황",
      },
      responsive: [],
      fill: {
        opacity: 1,
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          return Number(val).toLocaleString();
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
        <div className="main_title_box">매출 관리</div>
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
                      placeholder="시작날짜"
                      value={resultStartDate}
                      onClick={() => startCalendarStatus()}
                      readOnly
                    ></input>

                    {openStartCalendar && (
                      <Calendar
                        className="chart_calendar"
                        onChange={(e) => setFormatDate(e, "start")}
                        value={resultStartCalendar}
                        minDate={null} // 모든 년도 선택 가능하도록 null로 설정
                        calendarType="gregory"
                      />
                    )}
                  </div>
                  ~&nbsp;&nbsp;&nbsp;
                  <div className="search_input">
                    <input
                      className="list_input chart"
                      type="text"
                      id="title"
                      placeholder="종료날짜"
                      value={resultEndDate}
                      onClick={() => endCalendarStatus()}
                      readOnly
                    ></input>

                    {openEndCalendar && (
                      <Calendar
                        className="chart_calendar"
                        onChange={(e) => setFormatDate(e, "end")}
                        value={resultEndCalendar}
                        minDate={null} // 모든 년도 선택 가능하도록 null로 설정
                        calendarType="gregory"
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="list_select_area chart">
                <div className="search_select">
                  <select
                    className="list_select"
                    value={type}
                    onChange={(e) => selectType(e.target.value)}
                  >
                    <option value="">지점종류</option>
                    {typeGroup.map((type, index) => {
                      return (
                        <option key={index} value={type}>
                          {type}
                        </option>
                      );
                    })}
                  </select>
                  <select
                    className="list_select"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                  >
                    <option value="">회사명</option>
                    {companyGroup.map((data, index) => {
                      return (
                        <option key={index} value={data}>
                          {data}
                        </option>
                      );
                    })}
                  </select>
                  <select
                    className="list_select"
                    value={branchIdx}
                    onChange={(e) => selectBranch(e.target.value)}
                  >
                    <option value="">지점명</option>
                    {branchGroup.map((data, index) => {
                      return (
                        <option key={index} value={data.branch_idx}>
                          {data.branch_name}
                        </option>
                      );
                    })}
                  </select>
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
                  options={lineChart.options}
                  series={lineChart.series}
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

export default AdminSalesList;
