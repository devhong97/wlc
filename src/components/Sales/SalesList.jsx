import React, { Fragment, useEffect, useState } from "react";
import SalesViewModal from "../modal/SalesViewModal";
import { useAuth } from "../Context/AuthContext";
import Axios from "axios";
import TableDefault from "../Table/TableDefault";
import moment from "moment";
import ApexCharts from "apexcharts";
import SalesCustomer from "./SalesCustomer";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const SalesList = () => {
  const [inspectionStatus, setInspectionStatus] = useState("N");
  const [viewModal, setViewModal] = useState(false);
  const [detailIdx, setDetailIdx] = useState("");
  const [salesData, setSalesData] = useState([]);
  const [arrayData, setArrayData] = useState([]);
  const [contractCount, setContractCount] = useState(0);
  const [hopeCount, setHopeCount] = useState(0);
  const { decodeS0, decodeS1, decodeS4 } = useAuth();
  const [tab, setTab] = useState(2);
  const [result_date, setResultDate] = useState(""); //검진확정일
  const [resultCalendar, setResultCalendar] = useState(""); //검진확정일 달력데이터
  const [openCalendar, setOpenCalendar] = useState(false); //달력오픈
  const [hopeData, setHopeData] = useState([]);
  const [totalData, setTotalData] = useState([]);
  const [contractData, setContractData] = useState([]);
  const [totalDataDT1, setTotalDataDT1] = useState([]); //영업사원현황 실적관리 날짜데이터
  const [totalDataDT2, setTotalDataDT2] = useState([]); //영업사원현황 실적관리 날짜데이터
  const [totalDataDT3, setTotalDataDT3] = useState([]); //영업사원현황 실적관리 날짜데이터
  const [searchedData, setSearchedData] = useState([]); //영업사원현황 년,월 검색
  const [dateArray, setDateArray] = useState([]); // 월 데이터 배열

  useEffect(() => {
    getSalesTop();
    getSalesData();
    tab1Total();
    tab1DateTotal();
  }, []); // 빈 배열 전달하여 한 번만 실행되도록 함

  useEffect(() => {
    console.log("searchedData", searchedData);
  }, [searchedData]);

  useEffect(() => {
    if (decodeS4() === "슈퍼관리자") {
      renderApexChart();
    }
    if (decodeS4() === "지점관리자") {
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
        "http://localhost:3001/api/get/sales_list",
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

      //console.log(uniqueArrayData);
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

  //영업사원실적현황 데이터
  const tab1Total = async () => {
    try {
      const response = await Axios.get(
        "http://localhost:3001/api/get/tab1Total",
        {
          params: {
            choiceDate: result_date,
            tab: tab,
            uid: decodeS1(),
            branch_idx: decodeS0(),
          },
        }
      );
      const totalData = response.data.totalData;
      const hopeData = response.data.hopeData;
      const contractData = response.data.contractData;

      // 받은 데이터를 상태에 저장하거나 다른 곳에 사용할 수 있도록 처리
      setTotalData(totalData.totalCount);
      setHopeData(hopeData.hopeCount);
      setContractData(contractData.contractCount);
    } catch (error) {
      console.error("Error searching:", error);
    }
  };

  //영업사원실적현황 날짜데이터
  const tab1DateTotal = async () => {
    try {
      const response = await Axios.get(
        "http://localhost:3001/api/get/tab1dateTotal",
        {
          params: {
            choiceDate: result_date,
            tab: tab,
            uid: decodeS1(),
            branch_idx: decodeS0(),
          },
        }
      );
      const totalData = response.data.totalData;
      const hopeData = response.data.hopeData;
      const contractData = response.data.contractData;

      setTotalDataDT1(totalData);
      setTotalDataDT2(hopeData);
      setTotalDataDT3(contractData);
    } catch (error) {
      console.error("Error searching:", error);
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

  const renderApexChart = (num) => {
    let options;

    if (decodeS4() === "슈퍼관리자") {
      //대기
    } else if (decodeS4() === "지점관리자") {
      if (num === 1) {
        // (영업사원현황)num이 1일 때 지점관리자 전용 차트(영업사원현황)
        const today = moment(); // 오늘 날짜
        const dateArray = [];
        const totalDataArrays = [
          { type: "totalDT1", data: totalDataDT1 },
          { type: "totalDT2", data: totalDataDT2 },
          { type: "totalDT3", data: totalDataDT3 },
        ];
        // searchedData가 있는 경우 해당 월의 데이터만 추출
        if (searchedData.length > 0) {
          console.log("searchedData:", searchedData);
          searchedData.forEach((item) => {
            const month = moment(item.cal_date, "YYYY-MM").format("YYYY-MM");
            if (!dateArray.includes(month)) {
              dateArray.push(month);
            }
          });
          console.log("dateArray:", dateArray);
        } else {
          // searchedData가 없는 경우 7일치 데이터 표시
          for (let i = -3; i <= 3; i++) {
            const date = today.clone().add(i, "days").format("YYYY-MM-DD");
            dateArray.push(date);
          }
        }

        const filteredData = {};
        dateArray.forEach((date) => {
          filteredData[date] = {
            totalDT1: 0,
            totalDT2: 0,
            totalDT3: 0,
          };
          const searchData = searchedData.find(
            (item) => moment(item.date).format("YYYY-MM") === date
          );
          if (searchData) {
            filteredData[date].totalDT1 = searchData.totalDT1;
            filteredData[date].totalDT2 = searchData.totalDT2;
            filteredData[date].totalDT3 = searchData.totalDT3;
          }
        });

        // 각 날짜별로 데이터 수집
        totalDataArrays.forEach((totalData, index) => {
          dateArray.forEach((date) => {
            totalData.data.forEach((data) => {
              if (moment(data.date).format("YYYY-MM-DD") === date) {
                filteredData[date][totalData.type]++;
              }
            });
          });
        });

        options = {
          series: [
            {
              name: "가입고객수",
              type: "bar",
              data: dateArray.map((date) => filteredData[date].totalDT1),
            },
            {
              name: "상담희망고객수",
              type: "bar",
              data: dateArray.map((date) => filteredData[date].totalDT2),
            },
            {
              name: "계약고객현황",
              type: "bar",
              data: dateArray.map((date) => filteredData[date].totalDT3),
            },
          ],
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
          },
          title: {
            text: "영업사원현황 - 그래프 단위(일)",
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
            categories: dateArray,
          },
        };
      } else {
        // (커미션현황)num이 2일 때 지점관리자 전용 차트
        options = {
          series: [
            {
              name: "커미션현황",
              type: "line",
              data: [20, 30, 25, 40, 39, 50, 60, 81, 105],
            },
          ],
          chart: {
            height: 350,
            type: "line",
            zoom: {
              enabled: false,
            },
          },
          plotOptions: {
            bar: {
              horizontal: false,
            },
          },

          grid: {
            borderColor: "#f1f1f1",
          },
          xaxis: {
            categories: [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
            ],
          },
        };
      }
    }

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

  const changeTab = (num) => {
    setTab(num);
    setViewModal(false);
    setDetailIdx([]);

    if (decodeS4() === "지점관리자") {
      renderApexChart(num);
    } else if (decodeS4() === "슈퍼관리자") {
      renderApexChart(num);
    }
  };

  const calendarStatus = () => {
    setOpenCalendar(!openCalendar);
  };

  const setFormatDate = (date) => {
    const momentDate = moment(date).format("YYYY.MM");
    setResultDate(momentDate);
    setResultCalendar(date);
    setOpenCalendar(false);
  };

  //검색값 전송
  const handleSearch = async () => {
    try {
      const response = await Axios.post(
        "http://localhost:3001/api/get/avg_data",
        {
          choiceDate: result_date,
          tab: tab,
          uid: decodeS1(),
          branch_idx: decodeS0(),
        }
      );

      // 서버에서 받은 데이터의 cal_date 필드에서 월 추출
      const monthArray = response.data.map((item) =>
        moment(item.cal_date, "YYYY-MM").format("YYYY-MM")
      );

      // 중복된 월을 제거하고 dateArray에 추가
      const uniqueMonths = Array.from(new Set(monthArray));
      setDateArray(uniqueMonths);

      // 검색 결과에 따라 차트를 렌더링
      if (decodeS4() === "지점관리자") {
        // 검색 결과에 따라 지점관리자 전용 차트를 렌더링
        renderApexChart(1);
      } else if (decodeS4() === "슈퍼관리자") {
        // 검색 결과에 따라 슈퍼관리자 전용 차트를 렌더링
        renderApexChart(2);
      }

      setSearchedData(response.data);
    } catch (error) {
      console.error("Error searching:", error);
    }
  };

  const handleResetSearch = () => {
    // setSearchKeyword("");
    // setSearchType("");
  };

  let jsxToRender;

  // 슈퍼관리자일 때
  if (decodeS4() === "슈퍼관리자") {
    jsxToRender = (
      <div className="main_wrap">
        <div className="main_back">
          <div className="main_title_box">매출 관리</div>
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
                <div className="list_select_area right">
                  <div className="search_select">
                    <select className="list_select">
                      <option>회사명</option>
                    </select>
                    &nbsp;
                    <select className="list_select">
                      <option>지점종류</option>
                    </select>
                    &nbsp;
                    <select className="list_select">
                      <option>지점명</option>
                    </select>
                  </div>
                </div>
              </div>
              <div id="chart"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  // 지점장일 때
  else if (decodeS4() === "지점관리자") {
    jsxToRender = (
      <div className="main_wrap">
        <div className="main_back">
          <div className="main_title_box">
            매출 관리
            {tab === 2 && (
              <div className="total_data_box">
                <div className="total_box">커미션합계 : 1</div>
                <div className="total_box">지급예정커미션 : 1</div>
              </div>
            )}
            {tab === 1 && (
              <div className="total_data_box">
                <div className="total_box">가입고객현황 : {totalData}</div>
                <div className="total_box">상담희망고객현황 : {hopeData}</div>
                <div className="total_box">예약고객현황 : {contractData}</div>
              </div>
            )}
          </div>
          <div className="board_list_wrap">
            <div className="list_area">
              <div className="search_box">
                <div className="list_select_area">
                  {tab === 1 && (
                    <div className="search_select">
                      <input
                        className="table_input w100"
                        type="text"
                        id="title"
                        placeholder="확정일 입력해주세요."
                        value={result_date}
                        onClick={() => calendarStatus()}
                        disabled={inspectionStatus === "2"}
                        readOnly
                      ></input>
                      {openCalendar && (
                        <Calendar
                          className="modal_calendar"
                          onChange={(date) => setFormatDate(date)}
                          value={resultCalendar}
                          minDate={null} // 모든 년도 선택 가능하도록 null로 설정
                          defaultView="year"
                          maxDetail="year"
                          calendarType="gregory"
                        />
                      )}
                    </div>
                  )}
                  {tab === 2 && (
                    <div className="search_select">
                      <input
                        className="table_input w100"
                        type="text"
                        id="title"
                        placeholder="확정일 입력해주세요."
                        value={result_date}
                        onClick={() => calendarStatus()}
                        disabled={inspectionStatus === "2"}
                        readOnly
                      ></input>
                      {openCalendar && (
                        <Calendar
                          className="modal_calendar"
                          onChange={(e) => setFormatDate(e)}
                          value={resultCalendar}
                          minDate={null} // 모든 년도 선택 가능하도록 null로 설정
                          calendarType="gregory"
                        />
                      )}
                    </div>
                  )}
                  <div className="search_input">
                    <div className="list_search" onClick={handleSearch}>
                      검색
                    </div>
                    <div
                      className="list_search reset_btn"
                      onClick={handleResetSearch}
                    >
                      초기화
                    </div>
                  </div>
                </div>

                {/*<div className="list_select_area right">
                  <div className="search_select">
                    <select className="list_select">
                      <option>회사명</option>
                    </select>
                    &nbsp;
                    <select className="list_select">
                      <option>지점종류</option>
                    </select>
                    &nbsp;
                    <select className="list_select">
                      <option>지점명</option>
                    </select>
                  </div>
                  </div> */}
              </div>
              <div className="tab_area">
                <div className="tab_back">
                  <div
                    className={`tab_menu ${tab === 2 && "active"}`}
                    onClick={() => changeTab(2)}
                  >
                    커미션현황
                  </div>
                  <div
                    className={`tab_menu ${tab === 1 && "active"}`}
                    onClick={() => changeTab(1)}
                  >
                    영업사원실적현황
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
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

export default SalesList;
