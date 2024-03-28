import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Axios from "axios";
import { useReservContext } from "../Context/ReservContext";

const SearchProduct = () => {
  const { hospitalKey, setProduct, setProductName } = useReservContext();
  const [productList, setProductList] = useState([]);
  const navigation = useNavigate();

  useEffect(() => {
    getProductList();
  }, [hospitalKey]);
  const getProductList = async () => {
    let resultKey = [];
    if (hospitalKey.length !== 0) {
      resultKey = hospitalKey;
    }

    try {
      const response = await Axios.get(
        "http://localhost:3001/api/get/reserv/product_list",
        {
          params: {
            key: resultKey,
          },
        }
      );
      const allData = response.data.data;
      setProductList(allData);
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };

  const selectProduct = (data) => {
    console.log(data);
    setProduct(data.p_key);
    setProductName(data.product_1);
    if (hospitalKey.length !== 0) {
      navigation("/reserv/date");
    } else {
      navigation("/reserv/hospital");
    }
  };
  return (
    <div className="reserv_wrap">
      <div className="reserv_back product">
        <div className="reserv_top_box">
          <div className="reserv_title">상품 보기</div>
        </div>
        <div className="reserv_bottom_box product">
          {productList.map((data, index) => {
            return (
              <div className="product_box" key={index}>
                <div className="product_img"></div>
                <div className="product_text_box">
                  <div className="product_title">{data.product_1}</div>
                  {/* <div className="product_text">{data.price_txt}</div> */}
                </div>
                <div className="product_btn_box">
                  <div className="product_btn">상세</div>
                  <div
                    className="product_btn"
                    onClick={() => selectProduct(data)}
                  >
                    선택
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SearchProduct;
