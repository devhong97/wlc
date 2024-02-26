import React from "react";
import { useAuth } from "../Context/AuthContext";

const Header = () => {
  const { logout } = useAuth();

  return (
    <div className="header_wrap">
      <div className="header_back">
        <div className="header_info_box">
          <span>로그인정보</span>
          <span onClick={() => logout()}>로그아웃</span>
        </div>
      </div>
    </div>
  );
};

export default Header;
