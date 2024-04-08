import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Axios from "axios";
import { useReservContext } from "../Context/ReservContext";
import ProductDetailModal from "../modal/ProductDetailModal";

const SearchProduct = () => {
  const { hospitalKey, setProduct, setProductName } = useReservContext();
  const [productList, setProductList] = useState([]);
  const navigation = useNavigate();
  const [modal, setModal] = useState(false);
  const [modalData, setModalData] = useState([]);

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

  const openModal = (data) => {
    setModal(!modal);
    setModalData(data);
  };

  const closeModal = () => {
    setModal(false);
  };
  return (
    <div className="reserv_wrap">
      <div className="reserv_back product">
        <div className="reserv_bottom_box product">
          {productList.map((data, index) => {
            return (
              <div className="product_box" key={index}>
                <div className={`product_img img_${index}`}>
                  <div className="img_title">{data.product_1}</div>
                </div>
                <div className="inner_bottom_box">
                  <div className="product_text_box">
                    <div className="product_info_text">
                      {data.product_1} 등급의 검진 패키지 상품입니다.
                    </div>
                    {data.p_key === "2" ? (
                      <div className="product_text">
                        {data.price_txt * 2} 원 (2인)
                      </div>
                    ) : (
                      <div className="product_text">
                        {data.price_txt} 원 (1인)
                      </div>
                    )}
                  </div>
                  <div className="product_btn_box">
                    <div
                      className="product_btn"
                      onClick={() => openModal(data)}
                    >
                      상세
                    </div>
                    <div
                      className="product_btn"
                      onClick={() => selectProduct(data)}
                    >
                      선택
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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
