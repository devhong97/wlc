import React, { useEffect, useState } from "react";
import Axios from "axios";

const HospitalProductModal = (props) => {
  const [productData, setProductData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [newProductName, setNewProductName] = useState(""); // 새로운 상품명1을 위한 state
  const [choiceData, setChoiceData] = useState(props.selectedProduct || []);
  const [updateSelect, setUpdateSelect] = useState([]);
  const [deleteSelect, setDeleteSelect] = useState([]);
  const [mode, setMode] = useState(props.setMode);

  //const choiceItems = choiceData ? choiceData.split(",") : [];

  useEffect(() => {
    console.log(props.selectedProduct);
    console.log(choiceData);
    getDetail();
  }, [props.detailIdx]);

  // 지점판매상품 리스트 호출
  const getDetail = async () => {
    try {
      const response = await Axios.get(
        "http://localhost:3001/api/get/hospital_product"
      );
      const allData = response.data;
      setProductData(allData);
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };

  // 등록/수정
  const handleSubmit = async () => {
    props.closeModal("reload");
    console.log("choiceData", choiceData);
    if (mode !== "write") {
      props.setChoiceData(choiceData); // 선택한 상품명1 데이터를 부모 컴포넌트로 전달합니다.
      props.setUpdateProduct(updateSelect);
      props.setDeleteProduct(deleteSelect);
    } else {
      props.setSelectedProduct(selectedProduct); // 선택한 product1 데이터를 부모 컴포넌트로 전달합니다.
    }
  };

  const clearModal = () => {
    props.closeModal("reload");
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
      {
        product1: newProductName,
        p_key: newProductInfo.p_key,
        c_key: newProductInfo.c_key,
      },
    ];
    console.log(newSelectedProduct);
    setSelectedProduct(newSelectedProduct);

    // mode가 write가 아닐 때에만 choiceData를 업데이트
    if (mode !== "write") {
      // choiceData에 새로운 상품명1 추가
      const updatedChoiceData = [
        ...choiceData,
        {
          product1: newProductName,
          p_key: newProductInfo.p_key,
          c_key: newProductInfo.c_key,
        },
      ];
      setUpdateSelect((prev) => [
        ...prev,
        {
          product1: newProductName,
          p_key: newProductInfo.p_key,
          c_key: newProductInfo.c_key,
        },
      ]);
      setChoiceData(updatedChoiceData);
    }

    setNewProductName("");
  };

  const handleDelete = (index) => {
    const updatedSelectedProduct = [...selectedProduct];
    updatedSelectedProduct.splice(index, 1);
    setSelectedProduct(updatedSelectedProduct);

    const deletedItem = choiceData[index];
    const newData = choiceData.filter((item, idx) => idx !== index);
    setChoiceData(newData);
    setDeleteSelect((prev) => [...prev, deletedItem]);
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
            choiceData.map((item, index) => (
              <div key={index} className="hash_row">
                <div className="hash_box">
                  <div className="hash_text">{item.product1}</div>
                  <div className="hash_btn" onClick={() => handleDelete(index)}>
                    X
                  </div>
                </div>
              </div>
            ))}
          {mode === "write" &&
            selectedProduct.map((product, index) => (
              <div key={index} className="hash_row">
                <div className="hash_box">
                  <div className="hash_text">{product.product1}</div>
                  <div className="hash_btn" onClick={() => handleDelete(index)}>
                    X
                  </div>
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
