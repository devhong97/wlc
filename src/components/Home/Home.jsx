import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigation = useNavigate();
  return (
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
        <div className="customer_btn_box">
          <div className="customer_btn" onClick={() => navigation("/reserv")}>
            예약 시작
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
