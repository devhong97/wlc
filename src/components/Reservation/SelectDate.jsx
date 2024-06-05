import React, { useEffect, useState, Fragment } from "react";
import { useReservContext } from "../Context/ReservContext";
import { useLocation, useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment";

const SelectDate = () => {
  const {
    hospitalName,
    product,
    setHopeDate1,
    setHopeDate2,
    setCDate,
    hopeDate1,
    hopeDate2,
    cDate,
    hopeLocation,
    setHopeHour,
    setHopeMinute,
  } = useReservContext();
  const [date1, setDate1] = useState("");
  const [date2, setDate2] = useState("");
  const [hopeL, setHopeL] = useState("");
  const [date3, setDate3] = useState(""); //상담희망일
  const [dateText1, setDateText1] = useState(hopeDate1 || "");
  const [dateText2, setDateText2] = useState(hopeDate2 || "");
  const [dateText3, setDateText3] = useState(cDate || "");
  const [hopesLocation, setHopesLocation] = useState(hopeLocation || "");
  const [openStatus, setOpenStatus] = useState(0);
  const [selectedHour, setSelectedHour] = useState("00");
  const [selectedMinute, setSelectedMinute] = useState("00");
  const [hopeDateTime, setHopeDateTime] = useState("");
  const inspectionState = useLocation();
  const [inspectStep, setInspectStep] = useState(false);
  const navigation = useNavigate();

  useEffect(() => {
    console.log("보험점검 버튼", hopeLocation);
    if (hopeLocation === true) {
      setInspectStep(true);
    }
  }, [inspectionState.state]);

  const moveNext = () => {
    {
      /* 보험점검시 체크 */
    }
    if (inspectStep === true) {
      if (dateText3 === "") {
        alert("희망검진일을 입력하세요");
        return;
      }
      if (selectedHour === "00") {
        alert("상담시간을 선택하세요");
        return;
      }

      const selectedTime = `${selectedHour}:${selectedMinute}`;
      setHopeDateTime(selectedTime);
      setCDate(dateText3);
      setHopesLocation(hopeL); //context
      setHopeHour(selectedHour); //context
      setHopeMinute(selectedMinute); //context

      // navigation("/reserv/customer", { state: { inspection: inspect } });
      setInspectStep(false);
    } else {
      {
        /* 상품, 병원 선택 시 체크*/
      }
      if (dateText1 === "" || dateText2 === "") {
        alert("희망상담일을 입력하세요");
        return;
      }

      setHopeDate1(dateText1);
      setHopeDate2(dateText2);

      navigation("/reserv/customer");
    }
  };

  const openCalendar = (num) => {
    if (openStatus === 0 || num !== openStatus) {
      setOpenStatus(num);
    } else {
      setOpenStatus(0);
    }
  };

  const setFormatDate = (date, num) => {
    const momentDate = moment(date).format("YYYY.MM.DD");
    if (num === 1) {
      setDateText1(momentDate);
      setDate1(date);
    } else if (num === 2) {
      setDateText2(momentDate);
      setDate2(date);
    } else {
      setDateText3(momentDate);
      setDate3(date);
    }
    setOpenStatus(0);
  };

  const handleHourChange = (e) => {
    setSelectedHour(e.target.value);
  };

  const handleMinuteChange = (e) => {
    setSelectedMinute(e.target.value);
  };

  return (
    <div className="reserv_wrap">
      <div className="back_btn_box">
        <div className="back_btn" onClick={() => navigation(-1)}>
          뒤로 이동
        </div>
      </div>
      <div className="reserv_back">
        <div className="reserv_top_box">
          {inspectStep === true ? (
            <div className="reserv_title">보험상담일 선택</div>
          ) : (
            <div className="reserv_title">검진일 선택</div>
          )}
          <div className="reserv_title sub">
            희망하시는 상담일을 선택하세요.
          </div>
        </div>
        <div className="reserv_bottom_box">
          <div className="reserv_contents_box">
            {/* 보험점검 후 예약 시 */}
            {inspectStep === true ? (
              <Fragment>
                <div className="reserv_input_box">
                  <input
                    type="text"
                    className="reserv_input"
                    placeholder="상담장소"
                    value={hopeL}
                    onChange={(e) => setHopeL(e.target.value)}
                  />
                </div>
                <div className="reserv_input_box calendar">
                  <input
                    className="reserv_input calendar"
                    placeholder="희망상담일"
                    value={dateText3}
                    readOnly
                    onClick={() => openCalendar(1)}
                  />
                  {openStatus === 1 && (
                    <Calendar
                      className="reserv_calendar"
                      onChange={(e) => setFormatDate(e, 3)}
                      value={date3}
                      formatDay={(locale, date) => moment(date).format("DD")}
                      minDate={moment().toDate()}
                      calendarType="gregory"
                    />
                  )}
                </div>
                {/* 시, 분 선택 퍼블필요*/}
                <div className="time_box">
                  <div className="time_row">
                    <select
                      className="time_select"
                      value={selectedHour}
                      onChange={handleHourChange}
                    >
                      {Array.from({ length: 24 }, (_, i) => (
                        <option key={i} value={i.toString().padStart(2, "0")}>
                          {i.toString().padStart(2, "0")}
                        </option>
                      ))}
                    </select>
                    시
                  </div>
                  <div className="time_row">
                    <select
                      className="time_select"
                      value={selectedMinute}
                      onChange={handleMinuteChange}
                    >
                      {Array.from({ length: 60 }, (_, i) => (
                        <option key={i} value={i.toString().padStart(2, "0")}>
                          {i.toString().padStart(2, "0")}
                        </option>
                      ))}
                    </select>
                    분
                  </div>
                </div>
              </Fragment>
            ) : (
              <Fragment>
                <div className="reserv_input_box calendar">
                  <input
                    className="reserv_input calendar"
                    placeholder="희망검진일1"
                    value={dateText1}
                    readOnly
                    onClick={() => openCalendar(1)}
                  />
                  {openStatus === 1 && (
                    <Calendar
                      className="reserv_calendar"
                      onChange={(e) => setFormatDate(e, 1)}
                      value={date1}
                      formatDay={(locale, date) => moment(date).format("DD")}
                      minDate={moment().toDate()}
                      calendarType="gregory"
                    />
                  )}
                </div>
                <div className="reserv_input_box calendar">
                  <input
                    className="reserv_input calendar"
                    placeholder="희망검진일2"
                    value={dateText2}
                    readOnly
                    onClick={() => openCalendar(2)}
                  />
                  {openStatus === 2 && (
                    <Calendar
                      className="reserv_calendar"
                      minDate={moment().toDate()}
                      onChange={(e) => setFormatDate(e, 2)}
                      value={date2}
                      formatDay={(locale, date) => moment(date).format("DD")}
                      calendarType="gregory"
                    />
                  )}
                </div>
              </Fragment>
            )}
            <div className="reserv_btn_box">
              <div className="reserv_btn" onClick={() => moveNext()}>
                다음
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectDate;
