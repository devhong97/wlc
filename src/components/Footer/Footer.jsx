import React from "react";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const companyName = "웰라이프케어";

  return (
    <div className="footer_wrap">
      <div className="footer_back">
        <div className="txt">
          &copy; {currentYear} {companyName}. All Rights Reserved.
        </div>
      </div>
    </div>
  );
};

export default Footer;
