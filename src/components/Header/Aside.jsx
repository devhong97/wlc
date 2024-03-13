import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
const Aside = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(0);
  const { logout, decodeS4 } = useAuth();
  const userGrade = decodeS4();
  const navigate = useNavigate();

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
  const movePage = (path) => {
    navigate(path, { state: { grade: userGrade } });
    if (isOpen) {
      setIsOpen(false);
    }
    if (subOpen) {
      setSubOpen(false);
    }
  };
  const home = () => {
    navigate("/");
  };


  return (
    <div className="side_wrap">
      <div className="side_back">
        <div className={`side_menu_back ${isOpen ? "active" : ""}`}>
          <div className="side_top_box" onClick={() => openSide()}>
            <div className="top_icon"></div>
            <div className="top_text" onClick={() => movePage("/")}>
              웰라이프케어
            </div>
          </div>
          <div className="side_menu_box">
            <div className="menu_row" onClick={() => openSub(1)}>
              <div className="main_menu_box">
                <div className="menu_icon first"></div>
                <div className="menu_text">영업관리</div>
              </div>
              <div className={`sub_menu_box ${subOpen === 1 && "active"}`}>
                <div className="sub_menu" onClick={() => movePage("/branch")}>
                  지점관리
                </div>
                <div className="sub_menu" onClick={() => movePage("/member")}>
                  영업사원관리
                </div>
              </div>
            </div>

            <div className="menu_row">
              <div
                className="main_menu_box"
                onClick={() => movePage("/customer")}
              >
                <div className="menu_icon second"></div>
                <div className="menu_text">고객관리</div>
              </div>
            </div>
            <div className="menu_row">
              <div
                className="main_menu_box"
                onClick={() => movePage("/commission")}
              >
                <div className="menu_icon third"></div>
                <div className="menu_text">커미션관리</div>
              </div>
            </div>
            <div className="menu_row">
              <div className="main_menu_box" onClick={() => movePage("/sales")}>
                <div className="menu_icon third"></div>
                <div className="menu_text">실적관리</div>
              </div>
            </div>
            <div className="menu_row">
              <div
                className="main_menu_box"
                onClick={() => movePage("/notice")}
              >
                <div className="menu_icon third"></div>
                <div className="menu_text">게시판관리</div>
              </div>
            </div>
            <div className="menu_row home">
              <div className="main_menu_box">
                <div className="home_icon" onClick={() => home()}></div>
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
