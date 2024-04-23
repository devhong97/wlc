import React from "react";
import { useLocation } from "react-router-dom";
const Footer = () => {
  const currentYear = new Date().getFullYear();
  const companyName = "웰라이프케어";
  const location = useLocation();
  const path = location.pathname;
  const parts = path.split("/");
  const target = parts[1];
  return (
    <div className={`footer_wrap ${target === "self" && "self"}`}>
      {target !== "self" ? (
        <div className="footer_back">
          <div className="txt">
            &copy; {currentYear} {companyName}. All Rights Reserved.
          </div>
        </div>
      ) : (
        <div className="footer_back">
          <div className="txt">
            문의 전화 : <a href="tel:1566-1757" className="footer_tel">1566-1757</a>
          </div>
        </div>
      )}

    </div>
  );
};

export default Footer;
