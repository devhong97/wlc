import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useReservContext } from "../Context/ReservContext";

const SelfReservation = () => {
  const { clearReservData, customerData, keepReservData, setSelfUrl, selfUrl } = useReservContext();
  const navigation = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  // const { status } = location.state;

  const movePage = (path) => {
    navigation(`${pathname}${path}`);
  };

  useEffect(() => {
    if (location.state) {
      const { status } = location.state;
      console.log(status);
      if (status !== "keep") {
        clearReservData();
        console.log(customerData);
      } else {
        keepReservData();
      }
      console.log(customerData);
    } else {
      setSelfUrl(pathname)
    }
  }, [location]);
  return (
    <div className="reserv_wrap self">
      <div className="reserv_back main">
        <div className="reserv_top_box">
          <div className="reserv_title">
            예약 시작
          </div>
          <div className="reserv_title sub">이용하기 원하시는 메뉴를 선택하세요.</div>
        </div>
        <div className="reserv_bottom_box">
          <div className="reserv_menu_box" onClick={() => movePage("/product")}>
            <div className="menu_inner_box">
              <div className="menu_icon"></div>
              <div className="menu_text">상품찾기</div>
            </div>
          </div>
          <div
            className="reserv_menu_box"
            onClick={() => movePage("/hospital")}
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

export default SelfReservation;
