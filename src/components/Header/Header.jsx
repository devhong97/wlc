import React from "react";
import Clock from "../Common/Clock";
import { useAuth } from "../Context/AuthContext";

const Header = () => {
  const { decodeS1, decodeS2, decodeS3, decodeS4, decodeS5 } = useAuth();

  return (
    <div className="header_wrap">
      <div className="header_back">
        <div className="header_info_box left">
          <Clock></Clock>
          <div className="info_text">{decodeS4()}&nbsp; |</div>
          <div className="info_text">{decodeS3()}&nbsp; |</div>
          <div className="info_text">{decodeS2()}</div>
        </div>
      </div>
    </div>
  );
};

export default Header;
