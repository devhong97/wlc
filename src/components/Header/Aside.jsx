import React, { useState } from "react";
import { useAuth } from "../Context/AuthContext";
const Aside = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(0);
  const { logout } = useAuth();

  const openSide = () => {
    setIsOpen(!isOpen);
    console.log(isOpen);
    // 라우터 정해지면 라우터 이동 전에 open유무 체크해서 수정
  };

  const openSub = (idx) => {
    if (!isOpen) {
      setIsOpen(true);
    }
    if (idx === subOpen) {
      setSubOpen(0);
    } else {
      setSubOpen(idx);
    }
  };
  return (
    <div className="side_wrap">
      <div className="side_back">
        <div className={`side_menu_back ${isOpen ? "active" : ""}`}>
          <div className="side_top_box" onClick={() => openSide()}>
            <div className="top_icon"></div>
            <div className="top_text">WLC</div>
          </div>
          <div className="side_menu_box">
            <div className="menu_row" onClick={() => openSub(1)}>
              <div className="main_menu_box">
                <div className="menu_icon first"></div>
                <div className="menu_text">영업관리</div>
              </div>
              <div className={`sub_menu_box ${subOpen === 1 && "active"}`}>
                <div className="sub_menu">지점관리</div>
                <div className="sub_menu">직원관리</div>
              </div>
            </div>

            <div className="menu_row">
              <div className="main_menu_box">
                <div className="menu_icon second"></div>
                <div className="menu_text">고객관리</div>
              </div>
            </div>
            <div className="menu_row">
              <div className="main_menu_box">
                <div className="menu_icon third"></div>
                <div className="menu_text">매출관리</div>
              </div>
            </div>
            <div className="menu_row logout">
              <div className="main_menu_box">
                <div className="logout_icon" onClick={() => logout()}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Aside;
