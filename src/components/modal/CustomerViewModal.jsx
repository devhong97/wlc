import React, { useEffect, useState } from "react";
import Axios from "axios";
import moment from "moment";
import { useReservContext } from "../Context/ReservContext";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import AllCustomerModal from "./AllCustomerModal";
import SignDownModal from "./SignDownModal";
import { useAuth } from "../Context/AuthContext";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
const CustomerViewModal = (props) => {
  const {
    setProductKey,
    setHospitalUpdateKey,
    hospitalList,
    productList,
    setHospitalName,
    productKey,
    hospitalUpdateKey,
  } = useReservContext();

  const [memberData, setMemberData] = useState([]);
  const [subData, setSubData] = useState([]); //검진자목록데이터
  const [detailNum, setDetailNum] = useState("");
  const [inspectionStatus, setInspectionStatus] = useState("N");
  const [hopeStatus, setHopeStatus] = useState("N");
  const [payStatus, setPayStatus] = useState("N");
  const [refundStatus, setRefundStatus] = useState("N");
  // const [c_name, setCName] = useState(""); //예약자 이름
  const [customerName, setCustomerName] = useState(""); //검진자 이름
  const [customerNumber, setCustomerNumber] = useState(""); //검진 인원
  const [phone, setPhone] = useState(""); // 연락처
  const [cPhone, setCPhone] = useState(""); //검진자 연락처
  // const [date, setDate] = useState("");//가입일
  const [hope_date_1, setHopeDate1] = useState(""); //희망일1
  const [hope_date_2, setHopeDate2] = useState(""); //희망일2
  const [product, setProduct] = useState(""); //상품명
  const [hospital, setHospital] = useState(0); //병원명
  const [result_date, setResultDate] = useState(""); //검진확정일
  const [resultCalendar, setResultCalendar] = useState(""); //검진확정일 달력데이터
  const [openCalendar, setOpenCalendar] = useState(false); //달력오픈
  const [memo, setMemo] = useState(""); //비고
  const [manager, setManager] = useState(""); //영업자 이름
  const [branch, setBranch] = useState(""); //지점 이름
  const [company, setCompany] = useState(""); //회사 이름
  const [m_terms, setMTerms] = useState("N"); //마켓팅 동의여부
  const [resultPrice, setResultPrice] = useState(""); //금액
  const [start_time, setStartTime] = useState(""); //검진시간
  const [consulting_time, setConsultingTime] = useState(""); //상담시간
  const [addr, setAddr] = useState(""); //주소
  // const [selectedHour, setSelectedHour] = useState(""); // 시간 선택 상태 및 업데이트 함수
  // const [selectedMinute, setSelectedMinute] = useState(""); // 분 선택 상태 및 업데이트 함수
  const [allModal, setAllModal] = useState(false);
  const [signModal, setSignModal] = useState(false);
  const { decodeS4 } = useAuth();
  const [startTime, setStart] = useState(null);
  const [startConsulting, setConsulting] = useState(null);

  // useEffect(() => {
  //   setStartTime(`${selectedHour}:${selectedMinute}`);
  // }, [selectedHour, selectedMinute]);

  useEffect(() => {
    if (props.detailIdx) {
      setDetailNum(props.detailIdx.idx);
      getCustomerAll();
      getDetail();
    } else {
      props.closeModal();
    }
  }, [props.detailIdx]);

  useEffect(() => {
    setDetailValue();
  }, [memberData]);

  const clearModal = () => {
    props.closeModal();
  };
  const getDetail = async () => {
    try {
      const response = await Axios.get(
        "http://localhost:3001/api/get/customer_detail",
        {
          params: {
            idx: props.detailIdx.idx,
          },
        }
      );
      const allData = response.data.data;
      setMemberData(allData[0]);
      setDetailValue();
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };
  const getCustomerAll = async () => {
    try {
      const response = await Axios.get(
        "http://localhost:3001/api/get/customer_detail_all",
        {
          params: {
            idx: props.detailIdx.idx,
          },
        }
      );
      const allData = response.data.data;
      setSubData(allData);
      const names = allData.map((data) => data.name);
      setCustomerName(names.join(", "));
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };

  const setDetailValue = () => {
    setPhone(memberData.phone);
    setCPhone(memberData.phone_2);
    setHopeDate1(memberData.hope_date_1);
    setHopeDate2(memberData.hope_date_2);
    setStart(dayjs(memberData.start_time, "HH:mm"));
    setConsulting(dayjs(memberData.consulting_time, "HH:mm"));
    setProduct(memberData.p_key);
    setHospital(memberData.h_key);
    setResultDate(memberData.result_date);
    setMemo(memberData.memo);
    setManager(memberData.manager);
    setBranch(memberData.branch);
    setCompany(memberData.company);
    setInspectionStatus(memberData.status);
    setHopeStatus(memberData.hope_status);
    setPayStatus(memberData.pay_status);
    setRefundStatus(memberData.refund_status);
    setCustomerNumber(memberData.number);
    setMTerms(memberData.marketing_terms);
    setAddr(memberData.address);

    setProductKey(memberData.p_key);
    setHospitalUpdateKey(memberData.h_key);
    setHospitalName(memberData.hospital);
  };

  const handleSubmit = async () => {
    if (
      !phone ||
      !cPhone ||
      !product ||
      !hospital ||
      !hope_date_1 ||
      !hope_date_2
    ) {
      alert("필수 사항을 모두 입력해주세요");
      return;
    }
    const confirmUpdate = window.confirm("변경된 정보를 저장하시겠습니까?");
    if (!confirmUpdate) {
      return;
    }
    const paramsArray = {
      number: customerNumber,
      phone: phone,
      phone_2: cPhone,
      p_key: product,
      h_key: hospital,
      hope_date_1: hope_date_1,
      hope_date_2: hope_date_2,
      result_date: result_date,
      status: inspectionStatus,
      pay_status: payStatus,
      hope_status: hopeStatus,
      refund_status: refundStatus,
      marketing_terms: m_terms,
      memo: memo,
      address: addr,
      uid: memberData.uid,
      manager_uid: memberData.manager_uid,
      branch_idx: memberData.branch_idx,
      cost: memberData.cost * customerNumber,
      branch_name: memberData.branch,
      branch_type: memberData.branchType,
      company_name: memberData.company,
      start_time: start_time,
      consulting_time: consulting_time,
    };
    console.log(paramsArray);

    try {
      const response = await Axios.post(
        "http://localhost:3001/api/post/customer_edit",
        paramsArray
      );

      alert(response.data.message);
      console.log(response.data);
      props.closeModal();
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };
  const handleRadioChange = (event) => {
    setInspectionStatus(event.target.value);
  };

  const handleProduct = (data) => {
    console.log(data);
    setProductKey(data);
    setProduct(data);
  };

  const handleHospital = (data) => {
    setHospital(data);
    setHospitalUpdateKey(data);
    console.log(data);

    const selectedBranch = hospitalList.find(
      (branch) => branch.idx === Number(data)
    );
    console.log(selectedBranch);
    if (selectedBranch) {
      console.log(selectedBranch);
      setHospitalName(selectedBranch.name);
    }
  };

  const handleDownload = (fileName) => {
    const link = document.createElement("a");
    window.open(`http://localhost:3001/api/download/${fileName}`, "_blank");
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const calendarStatus = () => {
    setOpenCalendar(!openCalendar);
  };

  const setFormatDate = (date) => {
    const momentDate = moment(date).format("YYYY.MM.DD");
    setResultDate(momentDate);
    setResultCalendar(date);
    setOpenCalendar(false);
  };

  const openAllCustomerModal = (status) => {
    setAllModal(!allModal);
    if (status === "update") {
      getCustomerAll();
    }
  };

  const openSignModal = () => {
    setSignModal(!signModal);
  };

  const clockHandle = (newValue) => {
    const formattedTime = dayjs(newValue).format("HH:mm");
    console.log(formattedTime);
    setStartTime(formattedTime);
    setStart(newValue);
  };

  const clockHandle2 = (newValue) => {
    const formattedTime = dayjs(newValue).format("HH:mm");
    setConsultingTime(formattedTime);
    setConsulting(newValue);
  };

  let jsxToRender;

  if (decodeS4() === "슈퍼관리자") {
    jsxToRender = (
      <div className="modal_wrap">
        <div className="modal_back">
          <div className="modal_box">
            <div className="modal_title_box">
              <div className="modal_title">고객 상세</div>
              <div className="modal_close_btn" onClick={() => clearModal()}>
                X
              </div>
            </div>
            <div className="table_box">
              <div className="table_row">
                <div className="table_section half">
                  <div className="table_title">검진자</div>
                  <div className="table_contents w100">
                    <div className="table_inner_text">{customerName}</div>
                    {inspectionStatus !== "2" && (
                      <div
                        className="table_inner_btn"
                        onClick={() => openAllCustomerModal()}
                      >
                        수정
                      </div>
                    )}
                  </div>
                </div>
                <div className="table_section half">
                  <div className="table_title">예약자</div>
                  <div className="table_contents w100">
                    <div className="table_inner_text">
                      {memberData.contractor_name}
                    </div>
                  </div>
                </div>
              </div>
              <div className="table_row">
                <div className="table_section half">
                  <div className="table_title">검진인원</div>
                  <div className="table_contents w100">
                    <input
                      className="table_input w100"
                      type="text"
                      id="customerNumber"
                      placeholder="검진자를 입력해주세요."
                      value={customerNumber}
                      onChange={(e) => setCustomerNumber(e.target.value)}
                      disabled={inspectionStatus === "2"}
                    ></input>
                  </div>
                </div>
                <div className="table_section half">
                  <div className="table_title">가입일</div>
                  <div className="table_contents w100">
                    <div className="table_inner_text">
                      {moment(memberData.date).format("YYYY-MM-DD")}
                    </div>
                  </div>
                </div>
              </div>
              <div className="table_row">
                <div className="table_section half">
                  <div className="table_title">검진자 연락처</div>
                  <div className="table_contents w100">
                    <input
                      className="table_input w100"
                      type="number"
                      id="cPhone"
                      placeholder="연락처를 입력해주세요."
                      value={cPhone}
                      onChange={(e) => setCPhone(e.target.value)}
                      disabled={inspectionStatus === "2"}
                    ></input>
                  </div>
                </div>
                <div className="table_section half">
                  <div className="table_title">예약자 연락처</div>
                  <div className="table_contents w100">
                    <input
                      className="table_input w100"
                      type="number"
                      id="phone"
                      placeholder="연락처를 입력해주세요."
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      disabled={inspectionStatus === "2"}
                    ></input>
                  </div>
                </div>
              </div>
              <div className="table_row">
                <div className="table_section">
                  <div className="table_title">검진자 주소</div>
                  <div className="table_contents w100">
                    <input
                      className="table_input w100"
                      type="text"
                      id="cAddr"
                      placeholder="주소를 입력해주세요."
                      value={addr}
                      onChange={(e) => setAddr(e.target.value)}
                      disabled={inspectionStatus === "2"}
                    ></input>
                  </div>
                </div>
              </div>
              <div className="table_row">
                <div className="table_section half">
                  <div className="table_title">영업자</div>
                  <div className="table_contents w100">
                    <div className="table_inner_text">{memberData.manager}</div>
                  </div>
                </div>
                <div className="table_section half">
                  <div className="table_title">지점명</div>
                  <div className="table_contents w100">
                    <div className="table_inner_text">
                      {memberData.company} {memberData.branch}
                    </div>
                  </div>
                </div>
              </div>
              <div className="table_row">
                <div className="table_section half">
                  <div className="table_title">상품명</div>
                  {productList && (
                    <div className="table_contents w100">
                      <select
                        value={product}
                        onChange={(e) => handleProduct(e.target.value)}
                        className="table_select"
                        disabled={inspectionStatus === "2"}
                      >
                        <option value="">선택</option>
                        {productList.map((data, index) => {
                          return (
                            <option key={data.idx} value={data.p_key}>
                              {data.product_1}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  )}
                </div>
                <div className="table_section half">
                  <div className="table_title">병원</div>
                  {hospitalList && (
                    <div className="table_contents w100">
                      <select
                        value={hospital}
                        onChange={(e) => handleHospital(e.target.value)}
                        className="table_select"
                        disabled={inspectionStatus === "2"}
                      >
                        <option value="">선택</option>
                        {hospitalList.map((data, index) => {
                          return (
                            <option key={data.idx} value={data.h_key}>
                              {data.name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  )}
                </div>
              </div>
              <div className="table_row">
                <div className="table_section half">
                  <div className="table_title">희망일1</div>
                  <div className="table_contents w100">
                    <input
                      className="table_input w100"
                      type="text"
                      id="title"
                      placeholder="희망일을 입력해주세요."
                      value={hope_date_1}
                      onChange={(e) => setHopeDate1(e.target.value)}
                      disabled={inspectionStatus === "2"}
                    ></input>
                  </div>
                </div>
                <div className="table_section half">
                  <div className="table_title">희망일2</div>
                  <div className="table_contents w100">
                    <input
                      className="table_input w100"
                      type="text"
                      id="title"
                      placeholder="희망일을 입력해주세요."
                      value={hope_date_2}
                      onChange={(e) => setHopeDate2(e.target.value)}
                      disabled={inspectionStatus === "2"}
                    ></input>
                  </div>
                </div>
              </div>
              <div className="table_row calendar">
                <div className="table_section half calendar">
                  <div className="table_title">검진확정일</div>
                  <div className="table_contents w100 calendar">
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
                        formatDay={(locale, date) => moment(date).format("DD")}
                        minDate={moment().toDate()}
                        calendarType="gregory"
                      />
                    )}
                  </div>
                </div>
                <div className="table_section half">
                  <div className="table_title">검진시간</div>
                  <div className="table_contents w100">
                    {/* <div style={{ display: "inline-flex" }}>
                      <select
                        className="select_box"
                        value={selectedHour}
                        onChange={(e) => setSelectedHour(e.target.value)}
                      >
                        {Array.from({ length: 24 }, (_, i) => (
                          <option key={i} value={i.toString().padStart(2, "0")}>
                            {i.toString().padStart(2, "0")}시
                          </option>
                        ))}
                      </select>
                      :
                      <span
                        style={{ width: "10px", display: "inline-block" }}
                      ></span>{" "}
                      {/* 간격을 나타내는 구분선
                      <select
                        className="select_box"
                        value={selectedMinute}
                        onChange={(e) => setSelectedMinute(e.target.value)}
                      >
                        {Array.from({ length: 60 }, (_, i) => (
                          <option key={i} value={i.toString().padStart(2, "0")}>
                            {i.toString().padStart(2, "0")}분
                          </option>
                        ))}
                      </select>
                    </div> */}
                    <div className="clock_box">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <TimePicker value={startTime} onChange={clockHandle} />
                      </LocalizationProvider>
                    </div>
                  </div>
                </div>
              </div>
              <div className="table_row">
                <div className="table_section half">
                  <div className="table_title">검진유무</div>
                  <div className="table_contents w100">
                    <div className="table_radio">
                      <label>
                        <input
                          type="radio"
                          name="inspectionStatus"
                          value="1"
                          checked={inspectionStatus === "1"}
                          onChange={(e) => setInspectionStatus(e.target.value)}
                        />
                        검진완료
                      </label>
                    </div>
                    <div className="table_radio">
                      <label>
                        <input
                          type="radio"
                          name="inspectionStatus"
                          value="2"
                          checked={inspectionStatus === "2"}
                          onChange={(e) => setInspectionStatus(e.target.value)}
                        />
                        검진취소
                      </label>
                    </div>
                    <div className="table_radio">
                      <label>
                        <input
                          type="radio"
                          name="inspectionStatus"
                          value="3"
                          checked={inspectionStatus === "3"}
                          onChange={(e) => setInspectionStatus(e.target.value)}
                        />
                        검진대기
                      </label>
                    </div>
                    <div className="table_radio">
                      <label>
                        <input
                          type="radio"
                          name="inspectionStatus"
                          value="4"
                          checked={inspectionStatus === "4"}
                          onChange={(e) => setInspectionStatus(e.target.value)}
                        />
                        보험점검
                      </label>
                    </div>
                  </div>
                </div>
                <div className="table_section half">
                  <div className="table_title">상담희망</div>
                  <div className="table_contents w100">
                    <div className="table_radio">
                      <label>
                        <input
                          type="radio"
                          name="hopeStatus"
                          value="Y"
                          checked={hopeStatus === "Y"}
                          onChange={(e) => setHopeStatus(e.target.value)}
                        />
                        Yes
                      </label>
                    </div>
                    <div className="table_radio">
                      <label>
                        <input
                          type="radio"
                          name="hopeStatus"
                          value="N"
                          checked={hopeStatus === "N"}
                          onChange={(e) => setHopeStatus(e.target.value)}
                        />
                        No
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="table_row">
                <div className="table_section half">
                  <div className="table_title">마케팅동의여부</div>
                  <div className="table_contents w100">
                    <div className="table_radio">
                      <label>
                        <input
                          type="radio"
                          name="mterms"
                          value="Y"
                          checked={m_terms === "Y"}
                          onChange={(e) => setMTerms(e.target.value)}
                        />
                        Yes
                      </label>
                    </div>
                    <div className="table_radio">
                      <label>
                        <input
                          type="radio"
                          name="mterms"
                          value="N"
                          checked={m_terms === "N"}
                          onChange={(e) => setMTerms(e.target.value)}
                        />
                        No
                      </label>
                    </div>
                  </div>
                </div>
                <div className="table_section half">
                  <div className="table_title">계약유무</div>
                  <div className="table_contents w100">
                    <div className="table_inner_text">
                      {memberData.contract === "Y" ? "유" : "무"}
                    </div>
                  </div>
                </div>
              </div>
              <div className="table_row">
                <div className="table_section half">
                  <div className="table_title">입금유무</div>
                  <div className="table_contents w100">
                    <div className="table_radio">
                      <label>
                        <input
                          type="radio"
                          name="payStatus"
                          value="Y"
                          checked={payStatus === "Y"}
                          onChange={(e) => setPayStatus(e.target.value)}
                        />
                        Yes
                      </label>
                    </div>
                    <div className="table_radio">
                      <label>
                        <input
                          type="radio"
                          name="payStatus"
                          value="N"
                          checked={payStatus === "N"}
                          onChange={(e) => setPayStatus(e.target.value)}
                        />
                        No
                      </label>
                    </div>
                  </div>
                </div>
                <div className="table_section half">
                  <div className="table_title">상담시간</div>
                  <div className="table_contents w100">
                    {/* <div style={{ display: "inline-flex" }}>
                      <select
                        className="select_box"
                        value={selectedHour}
                        onChange={(e) => setSelectedHour(e.target.value)}
                      >
                        {Array.from({ length: 24 }, (_, i) => (
                          <option key={i} value={i.toString().padStart(2, "0")}>
                            {i.toString().padStart(2, "0")}시
                          </option>
                        ))}
                      </select>
                      :
                      <span
                        style={{ width: "10px", display: "inline-block" }}
                      ></span>{" "}
                      {/* 간격을 나타내는 구분선
                      <select
                        className="select_box"
                        value={selectedMinute}
                        onChange={(e) => setSelectedMinute(e.target.value)}
                      >
                        {Array.from({ length: 60 }, (_, i) => (
                          <option key={i} value={i.toString().padStart(2, "0")}>
                            {i.toString().padStart(2, "0")}분
                          </option>
                        ))}
                      </select>
                    </div> */}
                    <div className="clock_box">
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <TimePicker
                          value={startConsulting}
                          onChange={clockHandle2}
                        />
                      </LocalizationProvider>
                    </div>
                  </div>
                </div>
              </div>
              <div className="table_row">
                <div className="table_section half">
                  <div className="table_title">입금금액</div>
                  <div className="table_contents w100">
                    <div className="table_inner_text">
                      {memberData.price * customerNumber} 원
                    </div>
                  </div>
                </div>
                <div className="table_section half">
                  <div className="table_title">보험점검장소</div>
                  <div className="table_contents w100">
                    <div className="table_inner_text">
                      {memberData.consulting_location}
                    </div>
                  </div>
                </div>
              </div>
              {inspectionStatus === "2" && (
                <div className="table_row">
                  <div className="table_section half">
                    <div className="table_title">환불여부</div>
                    <div className="table_contents w100">
                      <div className="table_radio">
                        <label>
                          <input
                            type="radio"
                            name="refundStatus"
                            value="Y"
                            checked={refundStatus === "Y"}
                            onChange={(e) => setRefundStatus(e.target.value)}
                          />
                          Yes
                        </label>
                      </div>
                      <div className="table_radio">
                        <label>
                          <input
                            type="radio"
                            name="refundStatus"
                            value="N"
                            checked={refundStatus === "N"}
                            onChange={(e) => setRefundStatus(e.target.value)}
                          />
                          No
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="table_row">
                <div className="table_section">
                  <div className="table_title image">비고</div>
                  <div className="table_contents w100">
                    <textarea
                      className="table_textarea"
                      value={memo}
                      onChange={(e) => setMemo(e.target.value)}
                    ></textarea>
                  </div>
                </div>
              </div>
              <div className="table_row">
                <div className="table_section">
                  <div className="table_title">계약서</div>
                  <div className="table_contents w100">
                    <div
                      className="table_inner_btn sign"
                      onClick={() => openSignModal()}
                    >
                      확인하기
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal_footer_box">
              <div className="modal_btn" onClick={() => handleSubmit()}>
                수정
              </div>
              <div className="modal_btn close" onClick={clearModal}>
                닫기
              </div>
            </div>
          </div>
        </div>
        {allModal && (
          <AllCustomerModal
            closeModal={openAllCustomerModal}
            subData={subData}
            setCustomerNumber={setCustomerNumber}
          ></AllCustomerModal>
        )}
        {signModal && (
          <SignDownModal
            closeModal={openSignModal}
            sign_img_1={memberData.sign_img_1}
            sign_img_2={memberData.sign_img_2}
            contractorName={memberData.contractor_name}
          ></SignDownModal>
        )}
      </div>
    );
  } else if (decodeS4() === "지점관리자") {
    jsxToRender = (
      <div className="modal_wrap">
        <div className="modal_back">
          <div className="modal_box">
            <div className="modal_title_box">
              <div className="modal_title">고객 상세</div>
              <div className="modal_close_btn" onClick={() => clearModal()}>
                X
              </div>
            </div>
            <div className="table_box">
              <div className="table_row">
                <div className="table_section half">
                  <div className="table_title">검진자</div>
                  <div className="table_contents w100">
                    <div className="table_inner_text">{customerName}</div>
                  </div>
                </div>
                <div className="table_section half">
                  <div className="table_title">예약자</div>
                  <div className="table_contents w100">
                    <div className="table_inner_text">
                      {memberData.contractor_name}
                    </div>
                  </div>
                </div>
              </div>
              <div className="table_row">
                <div className="table_section half">
                  <div className="table_title">검진인원</div>
                  <div className="table_contents w100">
                    <div className="table_inner_text">{customerNumber}</div>
                  </div>
                </div>
                <div className="table_section half">
                  <div className="table_title">가입일</div>
                  <div className="table_contents w100">
                    <div className="table_inner_text">
                      {moment(memberData.date).format("YYYY-MM-DD")}
                    </div>
                  </div>
                </div>
              </div>
              <div className="table_row">
                <div className="table_section half">
                  <div className="table_title">검진자 연락처</div>
                  <div className="table_contents w100">
                    <div className="table_inner_text">{cPhone}</div>
                  </div>
                </div>
                <div className="table_section half">
                  <div className="table_title">예약자 연락처</div>
                  <div className="table_contents w100">
                    <div className="table_inner_text">{phone}</div>
                  </div>
                </div>
              </div>
              <div className="table_row">
                <div className="table_section half">
                  <div className="table_title">검진자 주소</div>
                  <div className="table_contents w100">
                    <div className="table_inner_text">{addr}</div>
                  </div>
                </div>
                <div className="table_section half">
                  <div className="table_title">병원</div>
                  {hospitalList && (
                    <div className="table_contents w100">
                      <div className="table_inner_text">
                        {hospitalList.find((item) => item.h_key === hospital)
                          ?.name || "선택된 병원 없음"}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="table_row">
                <div className="table_section half">
                  <div className="table_title">영업자</div>
                  <div className="table_contents w100">
                    <div className="table_inner_text">{memberData.manager}</div>
                  </div>
                </div>
                <div className="table_section half">
                  <div className="table_title">상품명</div>
                  {productList && (
                    <div className="table_contents w100">
                      <div className="table_inner_text">
                        {productList.find((item) => item.p_key === product)
                          ?.product_1 || "선택된 상품 없음"}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="table_row">
                <div className="table_section half">
                  <div className="table_title">희망일1</div>
                  <div className="table_contents w100">
                    <div className="table_inner_text">{hope_date_1}</div>
                  </div>
                </div>
                <div className="table_section half">
                  <div className="table_title">희망일2</div>
                  <div className="table_contents w100">
                    <div className="table_inner_text">{hope_date_2}</div>
                  </div>
                </div>
              </div>
              <div className="table_row calendar">
                <div className="table_section half calendar">
                  <div className="table_title">검진확정일</div>
                  <div className="table_contents w100 calendar">
                    <div
                      className="table_inner_text"
                      onClick={() => calendarStatus()}
                    >
                      {result_date}
                    </div>
                    {openCalendar && (
                      <Calendar
                        className="modal_calendar"
                        onChange={(e) => setFormatDate(e)}
                        value={resultCalendar}
                        formatDay={(locale, date) => moment(date).format("DD")}
                        minDate={moment().toDate()}
                        calendarType="gregory"
                      />
                    )}
                  </div>
                </div>
                <div className="table_section half">
                  <div className="table_title">검진시간</div>
                  <div className="table_contents w100">
                    <div className="clock_box">
                      <div className="table_inner_text">
                        {memberData.start_time}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="table_row">
                <div className="table_section half">
                  <div className="table_title">상담희망</div>
                  <div className="table_contents w100">
                    <div className="table_inner_text">
                      {hopeStatus === "Y" ? "Yes" : "No"}
                    </div>
                  </div>
                </div>
                <div className="table_section half">
                  <div className="table_title">계약유무</div>
                  <div className="table_contents w100">
                    <div className="table_inner_text">
                      {memberData.contract === "Y" ? "유" : "무"}
                    </div>
                  </div>
                </div>
              </div>
              <div className="table_row">
                <div className="table_section half">
                  <div className="table_title">상담희망시간</div>
                  <div className="table_contents w100">
                    <div className="clock_box">
                      <div className="table_inner_text">
                        {memberData.consulting_time}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {inspectionStatus === "2" && (
                <div className="table_row">
                  <div className="table_section half">
                    <div className="table_title">환불여부</div>
                    <div className="table_contents w100">
                      <div className="table_radio">
                        <label>
                          <input
                            type="radio"
                            name="refundStatus"
                            value="Y"
                            checked={refundStatus === "Y"}
                            onChange={(e) => setRefundStatus(e.target.value)}
                          />
                          Yes
                        </label>
                      </div>
                      <div className="table_radio">
                        <label>
                          <input
                            type="radio"
                            name="refundStatus"
                            value="N"
                            checked={refundStatus === "N"}
                            onChange={(e) => setRefundStatus(e.target.value)}
                          />
                          No
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="table_row">
                <div className="table_section">
                  <div className="table_title image">비고</div>
                  <div className="table_contents w100">
                    <textarea
                      className="table_textarea"
                      value={memo}
                      onChange={(e) => setMemo(e.target.value)}
                    ></textarea>
                  </div>
                </div>
              </div>
              <div className="table_row">
                <div className="table_section">
                  <div className="table_title">계약서</div>
                  <div className="table_contents w100">
                    <div
                      className="table_inner_btn sign"
                      onClick={() => openSignModal()}
                    >
                      확인하기
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal_footer_box">
              <div className="modal_btn close" onClick={clearModal}>
                닫기
              </div>
            </div>
          </div>
        </div>
        {allModal && (
          <AllCustomerModal
            closeModal={openAllCustomerModal}
            subData={subData}
            setCustomerNumber={setCustomerNumber}
          ></AllCustomerModal>
        )}
        {signModal && (
          <SignDownModal
            closeModal={openSignModal}
            sign_img_1={memberData.sign_img_1}
            sign_img_2={memberData.sign_img_2}
            contractorName={memberData.contractor_name}
          ></SignDownModal>
        )}
      </div>
    );
  }
  return jsxToRender;
};

export default CustomerViewModal;
