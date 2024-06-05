import React, { Fragment, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useReservContext } from "../Context/ReservContext";

const Reservation = () => {
  const {
    clearReservData,
    customerData,
    keepReservData,
    setHopeLocation: updateHopeLocation,
  } = useReservContext();
  const navigation = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const { status } = location.state;

  const [showTabs, setShowTabs] = useState(false);
  const [hopeLocation, setHopeLocation] = useState(false);

  const handleTabClick = () => {
    setShowTabs(true);
  };

  const handleTabClick2 = () => {
    setShowTabs(true);
    setHopeLocation(true);
  };

  useEffect(() => {
    if (status !== "keep") {
      clearReservData();
      console.log(customerData);
    } else {
      keepReservData();
    }
    console.log(customerData);
  }, [status]);

  useEffect(() => {
    if (hopeLocation) {
      updateHopeLocation(true);
      setHopeLocation(false);
    }
  }, [hopeLocation]);

  return (
    <div className="reserv_wrap">
      <div className="reserv_back main">
        <div className="reserv_top_box">
          <div className="reserv_title">예약 시작</div>
          <div className="reserv_title sub">
            이용하기 원하시는 메뉴를 선택하세요.
          </div>
        </div>
        <div className="reserv_bottom_box">
          {!showTabs && (
            <Fragment>
              <div className="reserv_menu_box" onClick={handleTabClick2}>
                <div className="menu_inner_box">
                  <div className="menu_icon third"></div>
                  <div className="menu_text">보험점검 후 예약</div>
                </div>
              </div>
              <div className="reserv_menu_box" onClick={handleTabClick}>
                <div className="menu_inner_box">
                  <div className="menu_icon first"></div>
                  <div className="menu_text">검진예약</div>
                </div>
              </div>
            </Fragment>
          )}
          {showTabs && (
            <>
              <div
                className="reserv_menu_box"
                onClick={() =>
                  navigation(`${pathname}/product`, { inspection: true })
                }
              >
                <div className="menu_inner_box">
                  <div className="menu_icon"></div>
                  <div className="menu_text">상품찾기</div>
                </div>
              </div>
              <div
                className="reserv_menu_box"
                onClick={() => {
                  navigation(`${pathname}/hospital`);
                  setHopeLocation(true); // 병원보기를 누를 때 hopeLocation 값을 true로 변경
                }}
              >
                <div className="menu_inner_box">
                  <div className="menu_icon second"></div>
                  <div className="menu_text">병원보기</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reservation;
