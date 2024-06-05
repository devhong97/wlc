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
    hopeLocation,
    setHopeHour,
    setHopeMinute,
  } = useReservContext();
  const [productList, setProductList] = useState([]);
  const navigation = useNavigate();
  const [modal, setModal] = useState(false);
  const [modalData, setModalData] = useState([]);
  const { decodeS0 } = useAuth();
  const containerRef = useRef(null);
  const inspectionState = useLocation();

  console.log("hopeLocation", hopeLocation);

  useEffect(() => {
    console.log("branchIdx", decodeS0());
  }, [inspectionState.state]);

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

  const openModal = (data) => {
    setModal(!modal);
    setModalData(data);
  };

  const closeModal = () => {
    setModal(false);
  };
  // 슬라이드
  const mouseWheelHandler = (e, containerRef) => {
    const delta = Math.max(-1, Math.min(1, e.deltaY || -e.detail));
    containerRef.current.scrollLeft += delta * 100; // 휠 방향 반대로 수정
    e.preventDefault();
  };
  useEffect(() => {
    const container1 = containerRef.current;

    const addWheelListener = (container, ref) => {
      if (container) {
        container.addEventListener("wheel", (e) => mouseWheelHandler(e, ref));
        container.addEventListener("DOMMouseScroll", (e) =>
          mouseWheelHandler(e, ref)
        );
      }
    };

    addWheelListener(container1, containerRef);

    return () => {
      if (container1) {
        container1.removeEventListener("wheel", mouseWheelHandler);
        container1.removeEventListener("DOMMouseScroll", mouseWheelHandler);
      }
    };
  }, []);
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
          <div className="slide_wrap" ref={containerRef}>
            {productList.map((data, index) => {
              return (
                <div className={`product_box color${data.p_key}`} key={index}>
                  <div className="product_img_box">
                    <div className={`product_img img_${index}`}></div>
                  </div>
                  <div className="inner_bottom_box">
                    <div className="product_text_box">
                      <div className="product_text title">{data.product_1}</div>
                      <div className="product_text og_price">
                        {Number(data.og_price).toLocaleString()}원
                      </div>
                      {data.p_key === "2" ? (
                        <div className="product_text">
                          {Number(data.price_txt * 2).toLocaleString()} 원 (2인)
                        </div>
                      ) : (
                        <div className="product_text">
                          {Number(data.price_txt).toLocaleString()} 원 (1인)
                        </div>
                      )}
                      <div className="product_info_text">
                        {data.product_1} 등급의 검진 패키지 상품입니다.
                      </div>
                    </div>

                    <div className="product_btn_box">
                      <div
                        className="product_btn"
                        onClick={() => selectProduct(data)}
                      >
                        선택
                      </div>
                      <div
                        className="product_btn"
                        onClick={() => openModal(data)}
                      >
                        상세보기
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {modal && (
        <ProductDetailModal
          closeModal={closeModal}
          modalData={modalData}
        ></ProductDetailModal>
      )}
    </div>
  );
};

export default SearchProduct;
