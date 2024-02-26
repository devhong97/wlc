import React from "react";
import { useAuth } from "../Context/AuthContext";
import Clock from "../Common/Clock";

const Header = () => {
  const { logout } = useAuth();

  const gradeText = (grade) => {
    switch (grade) {
      case 1: {
        return "슈퍼관리자";
      }
      case 2: {
        return "지점관리자";
      }
      default: {
        return "영업직원";
      }
    }
  };
  return (
    <div className="header_wrap">
      <div className="header_back">
        <div className="header_info_box left">
          <Clock></Clock>
          <div className="info_text">지점명</div>
          <div className="info_text">유기홍</div>
          <div className="info_text">{gradeText(1)}</div>
        </div>
        {/* <div className="header_info_box">
          <div className="info_text">로그인정보</div>
          <div className="info_text" onClick={() => logout()}>
            로그아웃
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Header;
