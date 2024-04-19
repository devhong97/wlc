import React, { Fragment, useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
const Aside = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [subOpen, setSubOpen] = useState(0);
  const [subOpenSales, setSubOpenSales] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout, decodeS4 } = useAuth();
  const userGrade = decodeS4();
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  // console.log(path);

  const openSide = () => {
    setIsOpen(!isOpen);
    setSubOpen(false);
  };

  const openSub = (idx) => {
    if (!isOpen) {
      setIsOpen(true);
    }
    if (idx === subOpen) {
      setSubOpen(0); // 영업관리 탭만 닫음
    } else {
      setSubOpen(idx); // 영업관리 탭을 열거나 변경
    }
  };
  const openSubSales = (idx) => {
    // 실적관리의 서브메뉴 열기
    if (!isOpen) {
      setIsOpen(true);
    }
    if (idx === subOpenSales) {
      setSubOpenSales(0);
    } else {
      setSubOpenSales(idx);
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
    if (subOpenSales) {
      // 실적관리 서브메뉴가 열려 있으면 닫기
      setSubOpenSales(false);
    }
  };
  const moveMobilePage = (path) => {
    navigate(path, { state: { grade: userGrade } });
    if (mobileOpen) {
      setMobileOpen(false);
    }
    if (subOpen) {
      setSubOpen(false);
    }
    if (subOpenSales) {
      setSubOpenSales(false);
    }
  };
  const home = () => {
    navigate("/");
  };
  const delme = () => {
    navigate("/delme");
  };
  const openMobileSide = () => {
    setMobileOpen(!mobileOpen);
  };

  let asideResult;

  switch (decodeS4()) {
    case "슈퍼관리자":
      asideResult = (
        <div className={`menu_area ${mobileOpen ? "mobile_active" : ""}`}>
          <div className="side_wrap">
            <div className="side_back mobile">
              <div
                className={`mobile_side_icon ${mobileOpen ? "active" : ""}`}
                onClick={() => openMobileSide()}
              ></div>
              <div className={`side_menu_back ${mobileOpen ? "active" : ""}`}>
                <div className="side_top_box">
                  <div className="top_icon"></div>
                  <div className="top_text">웰라이프케어</div>
                </div>
                <div className="side_menu_box">
                  <div className={`menu_row`} onClick={() => openSub(1)}>
                    <div
                      className={`main_menu_box ${
                        isOpen &&
                        (path === "/branch" || path === "/member") &&
                        "active"
                      }`}
                    >
                      <div className="menu_icon first"></div>
                      <div className="menu_text">영업관리</div>
                    </div>
                    <div
                      className={`sub_menu_box ${subOpen === 1 && "active"}`}
                    >
                      <div
                        className={`sub_menu ${path === "/branch" && "active"}`}
                        onClick={() => moveMobilePage("/branch")}
                      >
                        지점관리
                      </div>
                      <div
                        className={`sub_menu ${path === "/member" && "active"}`}
                        onClick={() => moveMobilePage("/member")}
                      >
                        영업사원관리
                      </div>
                    </div>
                  </div>

                  <div className={`menu_row`}>
                    <div
                      className={`main_menu_box ${
                        isOpen && path === "/customer" && "active"
                      }`}
                      onClick={() => moveMobilePage("/customer")}
                    >
                      <div className="menu_icon second"></div>
                      <div className="menu_text">고객관리</div>
                    </div>
                  </div>
                  <div className={`menu_row`}>
                    <div
                      className={`main_menu_box ${
                        isOpen && path === "/commission" && "active"
                      }`}
                      onClick={() => moveMobilePage("/commission")}
                    >
                      <div className="menu_icon third"></div>
                      <div className="menu_text">커미션관리</div>
                    </div>
                  </div>
                  <div className={`menu_row`} onClick={() => openSub(2)}>
                    <div
                      className={`main_menu_box ${
                        isOpen && path === "/sales" && "active"
                      }`}
                    >
                      <div className="menu_icon fourth"></div>
                      <div className="menu_text">실적관리</div>
                    </div>
                    <div
                      className={`sub_menu_box ${subOpen === 2 && "active"}`}
                    >
                      <div
                        className={`sub_menu ${path === "/sales" && "active"}`}
                        onClick={() => moveMobilePage("/sales")}
                      >
                        매출관리
                      </div>
                      <div
                        className={`sub_menu ${
                          path === "/salescustomer" && "active"
                        }`}
                        onClick={() => moveMobilePage("/salescustomer")}
                      >
                        고객현황
                      </div>
                      <div
                        className={`sub_menu ${
                          path === "/salesmanager" && "active"
                        }`}
                        onClick={() => moveMobilePage("/salesmanager")}
                      >
                        영업자현황
                      </div>
                      <div
                        className={`sub_menu ${
                          path === "/saleshospital" && "active"
                        }`}
                        onClick={() => moveMobilePage("/saleshospital")}
                      >
                        병원별 현황
                      </div>
                    </div>
                  </div>
                  <div className={`menu_row`}>
                    <div
                      className={`main_menu_box ${
                        isOpen && path === "/hospital" && "active"
                      }`}
                      onClick={() => moveMobilePage("/hospital")}
                    >
                      <div className="menu_icon fifth"></div>
                      <div className="menu_text">병원관리</div>
                    </div>
                  </div>
                  <div className={`menu_row`}>
                    <div
                      className={`main_menu_box ${
                        isOpen && path === "/product" && "active"
                      }`}
                      onClick={() => moveMobilePage("/product")}
                    >
                      <div className="menu_icon sixth"></div>
                      <div className="menu_text">상품관리</div>
                    </div>
                  </div>
                  <div className={`menu_row`}>
                    <div
                      className={`main_menu_box ${
                        isOpen && path === "/notice" && "active"
                      }`}
                      onClick={() => moveMobilePage("/notice")}
                    >
                      <div className="menu_icon seventh"></div>
                      <div className="menu_text">게시판관리</div>
                    </div>
                  </div>
                  <div className="menu_row delme">
                    <div className="main_menu_box">
                      <div
                        className="delme_icon"
                        onClick={() => moveMobilePage("/delme")}
                      ></div>
                    </div>
                  </div>
                  <div
                    className="menu_row home"
                    onClick={() => moveMobilePage("/")}
                  >
                    <div className="main_menu_box">
                      <div className="home_icon"></div>
                      {mobileOpen && <div className="menu_text">홈</div>}
                    </div>
                  </div>
                  <div className="menu_row logout" onClick={() => logout()}>
                    <div className="main_menu_box">
                      <div className="logout_icon"></div>
                      {mobileOpen && <div className="menu_text">로그아웃</div>}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="side_back">
              <div className={`side_menu_back ${isOpen ? "active" : ""}`}>
                <div className="side_top_box" onClick={() => openSide()}>
                  <div className="top_icon"></div>
                  <div className="top_text">웰라이프케어</div>
                </div>
                <div className="side_menu_box">
                  <div className={`menu_row`} onClick={() => openSub(1)}>
                    <div
                      className={`main_menu_box ${
                        isOpen &&
                        (path === "/branch" || path === "/member") &&
                        "active"
                      }`}
                    >
                      <div className="menu_icon first"></div>
                      <div className="menu_text">영업관리</div>
                    </div>
                    <div
                      className={`sub_menu_box ${subOpen === 1 && "active"}`}
                    >
                      <div
                        className={`sub_menu ${path === "/branch" && "active"}`}
                        onClick={() => movePage("/branch")}
                      >
                        지점관리
                      </div>
                      <div
                        className={`sub_menu ${path === "/member" && "active"}`}
                        onClick={() => movePage("/member")}
                      >
                        영업사원관리
                      </div>
                    </div>
                  </div>

                  <div className={`menu_row`}>
                    <div
                      className={`main_menu_box ${
                        isOpen && path === "/customer" && "active"
                      }`}
                      onClick={() => movePage("/customer")}
                    >
                      <div className="menu_icon second"></div>
                      <div className="menu_text">고객관리</div>
                    </div>
                  </div>
                  <div className={`menu_row`}>
                    <div
                      className={`main_menu_box ${
                        isOpen && path === "/commission" && "active"
                      }`}
                      onClick={() => movePage("/commission")}
                    >
                      <div className="menu_icon third"></div>
                      <div className="menu_text">커미션관리</div>
                    </div>
                  </div>

                  <div
                    className={`menu_row`}
                    onClick={() => {
                      openSub(2);
                    }}
                  >
                    <div
                      className={`main_menu_box ${
                        isOpen && path === "/sales" && "active"
                      }`}
                    >
                      <div className="menu_icon fourth"></div>
                      <div className="menu_text">실적관리</div>
                    </div>
                    <div
                      className={`sub_menu_box ${subOpen === 2 && "active"}`}
                    >
                      <div
                        className={`sub_menu ${path === "/sales" && "active"}`}
                        onClick={() => movePage("/sales")}
                      >
                        매출관리
                      </div>
                      <div
                        className={`sub_menu ${
                          path === "/salescustomer" && "active"
                        }`}
                        onClick={() => movePage("/salescustomer")}
                      >
                        고객현황
                      </div>
                      <div
                        className={`sub_menu ${
                          path === "/salesmanager" && "active"
                        }`}
                        onClick={() => movePage("/salesmanager")}
                      >
                        영업자현황
                      </div>
                      <div
                        className={`sub_menu ${
                          path === "/saleshospital" && "active"
                        }`}
                        onClick={() => movePage("/saleshospital")}
                      >
                        병원별 현황
                      </div>
                    </div>
                  </div>
                  <div className={`menu_row`}>
                    <div
                      className={`main_menu_box ${
                        isOpen && path === "/hospital" && "active"
                      }`}
                      onClick={() => movePage("/hospital")}
                    >
                      <div className="menu_icon fifth"></div>
                      <div className="menu_text">병원관리</div>
                    </div>
                  </div>
                  <div className={`menu_row`}>
                    <div
                      className={`main_menu_box ${
                        isOpen && path === "/product" && "active"
                      }`}
                      onClick={() => movePage("/product")}
                    >
                      <div className="menu_icon sixth"></div>
                      <div className="menu_text">상품관리</div>
                    </div>
                  </div>
                  <div className={`menu_row`}>
                    <div
                      className={`main_menu_box ${
                        isOpen && path === "/notice" && "active"
                      }`}
                      onClick={() => movePage("/notice")}
                    >
                      <div className="menu_icon seventh"></div>
                      <div className="menu_text">게시판관리</div>
                    </div>
                  </div>
                  <div className="menu_row delme">
                    <div className="main_menu_box">
                      <div
                        className="delme_icon"
                        onClick={() => movePage("/delme")}
                      ></div>
                    </div>
                  </div>
                  <div className="menu_row home" onClick={() => movePage("/")}>
                    <div className="main_menu_box">
                      <div className="home_icon"></div>
                      {isOpen && <div className="menu_text">홈</div>}
                    </div>
                  </div>
                  <div className="menu_row logout" onClick={() => logout()}>
                    <div className="main_menu_box">
                      <div className="logout_icon"></div>
                      {isOpen && <div className="menu_text">로그아웃</div>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
      break;

    case "지점관리자":
      asideResult = (
        <div className={`menu_area ${mobileOpen ? "mobile_active" : ""}`}>
          <div className="side_wrap">
            <div className="side_back mobile">
              <div
                className={`mobile_side_icon ${mobileOpen ? "active" : ""}`}
                onClick={() => openMobileSide()}
              ></div>
              <div className={`side_menu_back ${mobileOpen ? "active" : ""}`}>
                <div className="side_top_box">
                  <div className="top_icon"></div>
                  <div className="top_text">웰라이프케어</div>
                </div>
                <div className="side_menu_box">
                  <div className={`menu_row`}>
                    <div
                      className={`main_menu_box ${
                        isOpen && path === "/member" && "active"
                      }`}
                      onClick={() => moveMobilePage("/member")}
                    >
                      <div className="menu_icon first"></div>
                      <div className="menu_text">영업사원관리</div>
                    </div>
                  </div>
                  <div className={`menu_row`}>
                    <div
                      className={`main_menu_box ${
                        isOpen && path === "/customer" && "active"
                      }`}
                      onClick={() => moveMobilePage("/customer")}
                    >
                      <div className="menu_icon third"></div>
                      <div className="menu_text">고객관리</div>
                    </div>
                  </div>
                  <div className={`menu_row`}>
                    <div
                      className={`main_menu_box ${
                        isOpen && path === "/sales" && "active"
                      }`}
                      onClick={() => moveMobilePage("/sales")}
                    >
                      <div className="menu_icon fourth"></div>
                      <div className="menu_text">실적관리</div>
                    </div>
                  </div>
                  <div
                    className="menu_row home"
                    onClick={() => moveMobilePage("/")}
                  >
                    <div className="main_menu_box">
                      <div className="home_icon"></div>
                      {mobileOpen && <div className="menu_text">홈</div>}
                    </div>
                  </div>
                  <div className="menu_row logout" onClick={() => logout()}>
                    <div className="main_menu_box">
                      <div className="logout_icon"></div>
                      {mobileOpen && <div className="menu_text">로그아웃</div>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="side_back">
              <div className={`side_menu_back ${isOpen ? "active" : ""}`}>
                <div className="side_top_box" onClick={() => openSide()}>
                  <div className="top_icon"></div>
                  <div className="top_text">웰라이프케어</div>
                </div>
                <div className="side_menu_box">
                  <div className={`menu_row`}>
                    <div
                      className={`main_menu_box ${
                        isOpen && path === "/member" && "active"
                      }`}
                      onClick={() => moveMobilePage("/member")}
                    >
                      <div className="menu_icon first"></div>
                      <div className="menu_text">영업사원관리</div>
                    </div>
                  </div>

                  <div className={`menu_row`}>
                    <div
                      className={`main_menu_box ${
                        isOpen && path === "/customer" && "active"
                      }`}
                      onClick={() => movePage("/customer")}
                    >
                      <div className="menu_icon third"></div>
                      <div className="menu_text">고객관리</div>
                    </div>
                  </div>
                  <div className={`menu_row`}>
                    <div
                      className={`main_menu_box ${
                        isOpen && path === "/sales" && "active"
                      }`}
                      onClick={() => movePage("/sales")}
                    >
                      <div className="menu_icon fourth"></div>
                      <div className="menu_text">실적관리</div>
                    </div>
                  </div>
                  <div className="menu_row home" onClick={() => movePage("/")}>
                    <div className="main_menu_box">
                      <div className="home_icon"></div>
                      {isOpen && <div className="menu_text">홈</div>}
                    </div>
                  </div>
                  <div className="menu_row logout" onClick={() => logout()}>
                    <div className="main_menu_box">
                      <div className="logout_icon"></div>
                      {isOpen && <div className="menu_text">로그아웃</div>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
      break;

    case "영업사원":
      asideResult = (
        <div className={`menu_area ${mobileOpen ? "mobile_active" : ""}`}>
          <div className="side_wrap">
            <div className="side_back mobile">
              <div
                className={`mobile_side_icon ${mobileOpen ? "active" : ""}`}
                onClick={() => openMobileSide()}
              ></div>
              <div className={`side_menu_back ${mobileOpen ? "active" : ""}`}>
                <div className="side_top_box">
                  <div className="top_icon"></div>
                  <div className="top_text">웰라이프케어</div>
                </div>
                <div className="side_menu_box">
                  <div className={`menu_row`}>
                    <div
                      className={`main_menu_box ${
                        mobileOpen && path === "/notice" && "active"
                      }`}
                      onClick={() => moveMobilePage("/notice")}
                    >
                      <div className="menu_icon seventh"></div>
                      <div className="menu_text">공지사항</div>
                    </div>
                  </div>
                  <div className={`menu_row`}>
                    <div
                      className={`main_menu_box ${
                        mobileOpen && path === "/sales" && "active"
                      }`}
                      onClick={() => moveMobilePage("/sales")}
                    >
                      <div className="menu_icon fourth"></div>
                      <div className="menu_text">실적관리</div>
                    </div>
                  </div>
                  <div className={`menu_row`}>
                    <div
                      className={`main_menu_box ${
                        mobileOpen && path === "/mypage" && "active"
                      }`}
                      onClick={() => moveMobilePage("/mypage")}
                    >
                      <div className="menu_icon first"></div>
                      <div className="menu_text">마이페이지</div>
                    </div>
                  </div>
                  <div className={`menu_row`}>
                    <div
                      className={`main_menu_box ${
                        mobileOpen && path === "/link" && "active"
                      }`}
                      onClick={() => moveMobilePage("/link")}
                    >
                      <div className="menu_icon last"></div>
                      <div className="menu_text">링크복사</div>
                    </div>
                  </div>
                  <div
                    className="menu_row home"
                    onClick={() => moveMobilePage("/")}
                  >
                    <div className="main_menu_box">
                      <div className="home_icon"></div>
                      {mobileOpen && <div className="menu_text">홈</div>}
                    </div>
                  </div>
                  <div className="menu_row logout" onClick={() => logout()}>
                    <div className="main_menu_box">
                      <div className="logout_icon"></div>
                      {mobileOpen && <div className="menu_text">로그아웃</div>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="side_back">
              <div className={`side_menu_back ${isOpen ? "active" : ""}`}>
                <div className="side_top_box" onClick={() => openSide()}>
                  <div className="top_icon"></div>
                  <div className="top_text">웰라이프케어</div>
                </div>
                <div className="side_menu_box">
                  <div className={`menu_row`}>
                    <div
                      className={`main_menu_box ${
                        isOpen && path === "/notice" && "active"
                      }`}
                      onClick={() => movePage("/notice")}
                    >
                      <div className="menu_icon seventh"></div>
                      <div className="menu_text">공지사항</div>
                    </div>
                  </div>
                  <div className={`menu_row`}>
                    <div
                      className={`main_menu_box ${
                        isOpen && path === "/sales" && "active"
                      }`}
                      onClick={() => movePage("/sales")}
                    >
                      <div className="menu_icon fourth"></div>
                      <div className="menu_text">실적관리</div>
                    </div>
                  </div>
                  <div className={`menu_row`}>
                    <div
                      className={`main_menu_box ${
                        isOpen && path === "/mypage" && "active"
                      }`}
                      onClick={() => movePage("/mypage")}
                    >
                      <div className="menu_icon first"></div>
                      <div className="menu_text">마이페이지</div>
                    </div>
                  </div>
                  <div className={`menu_row`}>
                    <div
                      className={`main_menu_box ${
                        isOpen && path === "/link" && "active"
                      }`}
                      onClick={() => movePage("/link")}
                    >
                      <div className="menu_icon last"></div>
                      <div className="menu_text">링크복사</div>
                    </div>
                  </div>
                  <div className="menu_row home" onClick={() => movePage("/")}>
                    <div className="main_menu_box">
                      <div className="home_icon"></div>
                      {isOpen && <div className="menu_text">홈</div>}
                    </div>
                  </div>
                  <div className="menu_row logout" onClick={() => logout()}>
                    <div className="main_menu_box">
                      <div className="logout_icon"></div>
                      {isOpen && <div className="menu_text">로그아웃</div>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
      break;
  }
  return <Fragment>{asideResult}</Fragment>;
};

export default Aside;
