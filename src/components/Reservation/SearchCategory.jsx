import React from "react";
import { useNavigate } from "react-router-dom";

const SearchCategory = () => {
  const navigation = useNavigate();

  return (
    <div className="reserv_wrap">
      <div className="back_btn_box">
        <div className="back_btn" onClick={() => navigation(-1)}>
          뒤로 이동
        </div>
      </div>
      <div className="reserv_back main">
        <div className="reserv_top_box">
          <div className="reserv_title">카테고리선택</div>
          <div className="reserv_title sub">
            원하시는 카테고리를 확인하고 선택합니다.
          </div>
        </div>
        <div className="customer_btn_box3">
          <div
            className="customer_btn_cate1"
            onClick={() =>
              navigation("/reserv/product", { state: { status: "1" } })
            }
          >
            <div className="reserv_logo_cate1"></div>
            <div className="reserv_text_cate1">국가검진</div>
            <div className="arrow_logo_cate1"></div>
          </div>
        </div>
        <div className="customer_btn_box3">
          <div
            className="customer_btn_cate2"
            onClick={() =>
              navigation("/reserv/product", { state: { status: "2" } })
            }
          >
            <div className="reserv_logo_cate2"></div>
            <div className="reserv_text_cate2">일반종합검진</div>
            <div className="arrow_logo_cate2"></div>
          </div>
        </div>
        <div className="customer_btn_box3">
          <div
            className="customer_btn_cate3"
            onClick={() =>
              navigation("/reserv/product", { state: { status: "3" } })
            }
          >
            <div className="reserv_logo_cate3"></div>
            <div className="reserv_text_cate3">차병원 Prime검진</div>
            <div className="arrow_logo_cate3"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchCategory;
