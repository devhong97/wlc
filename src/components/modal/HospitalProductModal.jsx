import React, { useEffect, useState } from "react";
import Axios from "axios";

const HospitalProductModal = (props) => {
  const [productData, setProductData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [newProductName, setNewProductName] = useState(""); // 새로운 상품명1을 위한 state

  useEffect(() => {
    getDetail();
  }, [props.detailIdx]);

  // 지점판매상품 리스트 호출
  const getDetail = async () => {
    try {
      const response = await Axios.get(
        "http://localhost:3001/api/get/hospital_product",
        {
          params: {
            idx: props.detailIdx,
          },
        }
      );
      const allData = response.data;
      setProductData(allData);
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };

  // 등록/수정
  const handleSubmit = async () => {
    const confirmModify = window.confirm(`수정을 완료하시겠습니까?`);
    if (!confirmModify) {
      return;
    }
    try {
      const response = await Axios.post(
        "http://localhost:3001/api/post/hospital_product_modify",
        {
          products: selectedProduct,
          idx: props.detailIdx,
        }
      );
      alert("수정이 완료되었습니다.");
      props.closeModal();
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };

  const clearModal = () => {
    props.closeModal();
  };

  const handleCreate = () => {
    // 새로운 상품명1이 입력되었는지 확인
    if (!newProductName) {
      alert("새로운 상품명1을 입력해야 합니다.");
      return;
    }
    // 선택한 name_2 데이터를 selectedProduct 배열에 추가
    setSelectedProduct([...selectedProduct, { product1: newProductName }]);
    // 입력 필드 초기화
    setNewProductName("");
  };

  const handleDelete = (index) => {
    // 선택한 상품명1을 선택 목록에서 제거
    const updatedSelectedProduct = [...selectedProduct];
    updatedSelectedProduct.splice(index, 1);
    setSelectedProduct(updatedSelectedProduct);
  };

  return (
    <div className="modal_wrap">
      <div className="modal_back">
        <div className="modal_box">
          <div className="modal_title_box">
            <div className="modal_title">검진상품선택</div>
            <div className="modal_close_btn" onClick={() => clearModal()}>
              X
            </div>
          </div>
          <div className="table_box">
            <div className="table_row">
              <div className="table_section">
                <div className="table_title">
                  상품명1<p className="title_point">*</p>
                </div>
                <div className="table_contents w100">
                  <select
                    name="product"
                    className="table_select"
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                  >
                    <option value="">선택</option>
                    {productData.map((product, index) => {
                      return (
                        <option key={index} value={product.product_1}>
                          {product.product_1}
                        </option>
                      );
                    })}
                  </select>
                  &nbsp;&nbsp;
                  <div className="add_btn" onClick={handleCreate}>
                    생성
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* 선택한 name_1 데이터를 화면에 출력 */}
          {selectedProduct.map((product, index) => (
            <div key={index}>
              <div style={{ paddingTop: "10px" }}>
                {product.product1}
                <button onClick={() => handleDelete(index)}>삭제</button>
              </div>
            </div>
          ))}
          <div className="modal_footer_box">
            <div className="modal_btn" onClick={handleSubmit}>
              등록 / 수정
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default HospitalProductModal;
