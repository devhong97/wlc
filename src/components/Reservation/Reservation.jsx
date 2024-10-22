import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useReservContext } from "../Context/ReservContext";

const Reservation = () => {
  const { clearReservData, keepReservData } = useReservContext();
  const navigation = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const status = location.state?.status || "default"; // 기본값 설정

  useEffect(() => {
    if (status !== "keep" && status !== "default") {
      clearReservData();
    } else if (status === "keep") {
      keepReservData();
    }
  }, [status, clearReservData, keepReservData]);

  return (
    <div className="reserv_wrap">
      <div className="back_btn_box">
        <div className="back_btn" onClick={() => navigation(-1)}>
          뒤로 이동
        </div>
      </div>
      <div className="reserv_back main">
        <div className="reserv_top_box">
          <div className="reserv_title">예약 시작</div>
          <div className="reserv_title sub">
            이용하기 원하시는 메뉴를 선택하세요.
          </div>
        </div>
        <div className="reserv_bottom_box">
          <div
            className="reserv_menu_box"
            onClick={() => navigation(`${pathname}/category`)}
          >
            <div className="menu_inner_box">
              <div className="menu_icon"></div>
              <div className="menu_text">상품찾기</div>
            </div>
          </div>
          <div
            className="reserv_menu_box hospital"
            onClick={() => navigation(`${pathname}/hospital`)}
          >
            <div className="menu_inner_box">
              <div className="menu_icon second"></div>
              <div className="menu_text">병원보기</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservation;
