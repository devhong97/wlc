import React, { useEffect, useState } from "react";
import Axios from "axios";

const HospitalProductModal = (props) => {
  const [productData, setProductData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [newProductName, setNewProductName] = useState(""); // 새로운 상품명1을 위한 state
  const [choiceData, setChoiceData] = useState(props.selectedProduct || "");
  const [mode, setMode] = useState(props.setMode);

  //const choiceItems = choiceData ? choiceData.split(",") : [];

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
    props.closeModal();
    console.log("choiceData", choiceData);
    if (mode !== "write") {
      props.setChoiceData(choiceData); // 선택한 상품명1 데이터를 부모 컴포넌트로 전달합니다.
    } else {
      props.setSelectedProduct(selectedProduct); // 선택한 product1 데이터를 부모 컴포넌트로 전달합니다.
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
    const newProductInfo = productData.find(
      (product) => product.product_1 === newProductName
    );
    if (!newProductInfo) {
      alert("선택한 상품에 대한 정보를 찾을 수 없습니다.");
      return;
    }

    // product, c_key 찾아서 전달
    const newSelectedProduct = [
      ...selectedProduct,
      { product1: newProductName, c_key: newProductInfo.c_key },
    ];
    setSelectedProduct(newSelectedProduct);

    // mode가 write가 아닐 때에만 choiceData를 업데이트
    if (mode !== "write") {
      // choiceData에 새로운 상품명1 추가
      const updatedChoiceData = choiceData
        ? `${choiceData},${newProductName}`
        : newProductName;
      setChoiceData(updatedChoiceData);
    }

    setNewProductName("");
  };

  const handleDelete = (index) => {
    // 선택한 상품명1을 선택 목록에서 제거
    const updatedSelectedProduct = [...selectedProduct];
    updatedSelectedProduct.splice(index, 1);
    setSelectedProduct(updatedSelectedProduct);

    // choiceData에서도 삭제
    const updatedChoiceData = choiceData.split(",");
    updatedChoiceData.splice(index, 1);
    setChoiceData(updatedChoiceData.join(","));
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
          {mode !== "write" &&
            choiceData.split(",").map((item, index) => (
              <div key={index}>
                <div style={{ paddingTop: "10px" }}>
                  {item}
                  <button onClick={() => handleDelete(index)}>삭제</button>
                </div>
              </div>
            ))}

          {mode === "write" &&
            selectedProduct.map((product, index) => (
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
