import React, { useEffect, useState } from "react";
import Clock from "../Common/Clock";
import { useAuth } from "../Context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const path = location.pathname;
  const {
    logout,
    decodeS1,
    decodeS2,
    decodeS3,
    decodeS4,
    decodeS5,
    //remainingSessionTime,
  } = useAuth();
  const navigate = useNavigate(); // useNavigate 훅 사용

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 1000);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // 화면 크기 변경 시 모바일/PC 뷰 체크
  const handleResize = () => {
    setIsMobileView(window.innerWidth <= 1000);
  };

  // 화면 크기 변화 감지 이벤트 추가
  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // 메뉴 항목 클릭 시 경로 이동 함수
  const handleMenuItemClick = (path) => {
    if (path === "/") {
      navigate("/"); // "/" 경로로 이동
    } else {
      navigate(path); // 다른 경로로 이동
    }
    setIsMenuOpen(false); // 메뉴가 열려있는 경우 닫기
  };

  return (
    <div className="header_wrap">
      <div className="header_top_back">
        <div className="header_info_box left">
          <Clock />
        </div>
        <div className="header_info_box right">
          <div className="info_text"></div>
        </div>
      </div>
      {!path.includes("/reserv") && (
        <div className="header_bottom_back">
          <div className="header_info_box">
            <div className="info_icon"></div>
            <div className="info_text_box">
              <div className="info_name">{decodeS2()}</div>
              <div className="info_id">
                {decodeS3()} | {decodeS4()}
              </div>
            </div>
            {isMobileView && (
              <div className="side_menu_open" onClick={toggleMenu}></div>
            )}
          </div>
        </div>
      )}

      <div className={`side_menu ${isMenuOpen && isMobileView ? "open" : ""}`}>
        <div className="side_menu_top">
          <div className="mobile-header-logo"></div>
          <div className="mobile-txt" onClick={() => handleMenuItemClick("/")}>
            웰라이프케어
          </div>
          <div className="close_button" onClick={toggleMenu}></div>
        </div>
        {/* <div className="menu_section">
          <h3>메인 메뉴</h3>
        </div> */}
        <div className="menu_section">
          <ul>
            <li
              className="icon-1"
              onClick={() => handleMenuItemClick("/notice")}
            >
              <span>공지사항</span>
            </li>
            <li
              className="icon-2"
              onClick={() => handleMenuItemClick("/sales")}
            >
              <span>실적 관리</span>
            </li>
            <li
              className="icon-3"
              onClick={() => handleMenuItemClick("/inspection")}
            >
              <span>보험 점검</span>
            </li>
            <li
              className="icon-4"
              onClick={() => handleMenuItemClick("/mypage")}
            >
              <span>마이페이지</span>
            </li>
          </ul>
        </div>
        <div className="menu_section">
          <div className="section1-s">
            <div
              className="home_icon"
              onClick={() => handleMenuItemClick("/")}
            ></div>
          </div>
          <div className="section2-s">
            <div className="logout_icon" onClick={() => logout()}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
