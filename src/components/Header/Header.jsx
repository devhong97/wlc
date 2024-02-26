import React from "react";
import Clock from "../Common/Clock";
import { useAuth } from "../Context/AuthContext";

const Header = () => {
  const { userData } = useAuth();

  const gradeText = (grade) => {
    switch (grade) {
      case "1": {
        return "시스템관리자";
      }
      case "2": {
        return "지점관리자";
      }
      case "3": {
        return "영업직원";
      }
      default: {
        return "";
      }
    }
  };
  return (
    <div className="header_wrap">
      <div className="header_back">
        <div className="header_info_box left">
          <Clock></Clock>
          <div className="info_text">{userData.branch_name}</div>
          <div className="info_text">{userData.manager}</div>
          <div className="info_text">{gradeText(userData.grade)}</div>
        </div>
      </div>
    </div>
  );
};

export default Header;
