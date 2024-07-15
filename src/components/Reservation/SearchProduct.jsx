import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Axios from "axios";
import { useReservContext } from "../Context/ReservContext";
import ProductDetailModal from "../modal/ProductDetailModal";
import { useAuth } from "../Context/AuthContext";

const SearchProduct = () => {
  const {
    hospitalKey,
    setProduct,
    setProductName,
    setProductState,
    setProductPrice,
  } = useReservContext();
  const [productList, setProductList] = useState([]);
  const navigation = useNavigate();
  const [modal, setModal] = useState(false);
  const [modalData, setModalData] = useState([]);
  const { decodeS0 } = useAuth();
  const inspectionState = useLocation();

  useEffect(() => {
    console.log("[state]\n 1: 국가검진, 2: 일반검진, 3: 프리미엄검진");
    console.log(inspectionState.state);
    // 상품 리스트를 불러오는 함수를 호출합니다.
    getProductList();
  }, [hospitalKey, inspectionState.state]);

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
            branchIdx: decodeS0(),
          },
        }
      );
      const allData = response.data.data;
      setProductList(allData);
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };

  const sendDataToServer = async (data, status) => {
    try {
      const response = await Axios.post("http://localhost:3001/api/sendData", {
        data,
        status,
      });
      console.log("Data sent successfully:", response.data);
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  const selectProduct = (data) => {
    console.log("보험점검 후 선택", data);
    setProduct(data.p_key);
    setProductName(data.product_1);
    setProductState("1");
    setProductPrice(data.cost);
    if (hospitalKey.length !== 0) {
      navigation("/reserv/date");
    } else {
      navigation("/reserv/hospital");
    }
  };

  const selectNomalProduct = (data) => {
    console.log("일반 검진선택", data);
    setProduct(data.p_key);
    setProductName(data.product_1);
    setProductPrice(data.normal_cost);
    setProductState("2");
    if (hospitalKey.length !== 0) {
      navigation("/reserv/date");
    } else {
      navigation("/reserv/hospital");
    }
  };

  const openModal = (data) => {
    setModal(!modal);
    setModalData(data);
  };

  // 필터링된 상품 리스트 생성
  const filteredProductList = productList.filter((data) => {
    if (inspectionState.state && inspectionState.state.status === "2") {
      return Number(data.cost) < 1000000;
    } else if (inspectionState.state && inspectionState.state.status === "3") {
      return Number(data.cost) >= 1000000;
    } else {
      return true; // inspectionState.state가 없을 때 모든 상품을 반환
    }
  });

  return (
    <div className="reserv_wrap">
      <div className="back_btn_box">
        <div className="back_btn" onClick={() => navigation(-1)}>
          뒤로 이동
        </div>
      </div>
      <div className="reserv_back product">
        <div className="reserv_top_box">
          <div className="reserv_title">상품 찾기</div>
          <div className="reserv_title sub">
            원하시는 상품을 확인하고 선택합니다.
          </div>
        </div>
        <div className="reserv_bottom_box">
          <div className="slide_wrap">
            {filteredProductList.map((data, index) => (
              <div className="product_box color" key={index}>
                <div className="inner_bottom_box">
                  <div className="product_text_box">
                    <div className="product_tab1">
                      <div
                        className={`product_img ${
                          Number(data.cost) >= 1000000
                            ? `top_img_${index}`
                            : `img_${index}`
                        }`}
                      ></div>

                      <div className="product_text title">{data.product_1}</div>
                      <div className="product_info_text">
                        {data.product_1} 등급의 검진 패키지 상품입니다.
                      </div>
                    </div>

                    <div className="product_tab2">
                      <div className="product_text og_price">
                        <div
                          className="product_txt1"
                          onClick={() => selectProduct(data)}
                        >
                          <div>보험 점검 후 검진</div>
                          <div>₩{Number(data.cost).toLocaleString()}</div>
                        </div>
                        <div
                          className="product_txt2"
                          onClick={() => selectNomalProduct(data)}
                        >
                          <div>일반 검진</div>
                          <div>
                            {inspectionState.state &&
                            inspectionState.state.status === "2"
                              ? `₩${Number(data.normal_cost).toLocaleString()}`
                              : "-"}
                          </div>
                        </div>
                        <div
                          className="product_txt3"
                          onClick={() => openModal(data)}
                        >
                          상품 상세보기
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {modal && (
        <ProductDetailModal
          closeModal={() => setModal(false)}
          modalData={modalData}
        />
      )}
    </div>
  );
};

export default SearchProduct;
