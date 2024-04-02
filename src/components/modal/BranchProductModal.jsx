import React, { useEffect, useState } from "react";
import Axios from "axios";

const BranchProductModal = (props) => {
  const [productData, setProductData] = useState([]);
  const [type, setType] = useState("");
  const [product1, setProduct1] = useState("");
  const [product2, setProduct2] = useState("");
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [uniqueTypes, setUniqueTypes] = useState([]);
  const [normalData, setNormalData] = useState(props.selectedProduct);

  useEffect(() => {
    console.log("normalData", normalData); // 기존상품데이터
    console.log("selectedProduct", selectedProduct); // 생성된 상품
  }, [selectedProduct, selectedProduct]);

  useEffect(() => {
    getDetail();
  }, [props.detailIdx]);

  useEffect(() => {
    // productData가 업데이트될 때마다 중복 제거된 type을 계산
    const types = [...new Set(productData.map((item) => item.type))];
    setUniqueTypes(types);
    // console.log("types", types);
  }, [productData]);

  // 지점판매상품 리스트호출
  const getDetail = async () => {
    try {
      const response = await Axios.get(
        "http://localhost:3001/api/get/branch_product"
      );
      const allData = response.data;

      // 타입 데이터 수정
      const modifiedData = allData.map((item) => ({
        ...item,
        type:
          item.type === "2" ? "패키지" : item.type === "1" ? "단일" : item.type,
      }));

      setProductData(modifiedData);
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };

  const handleSubmit = async () => {
    const confirmModify = window.confirm(`수정을 완료하시겠습니까?`);
    if (!confirmModify) {
      return;
    }

    try {
      const response = await Axios.post(
        "http://localhost:3001/api/post/branch_product_modify",
        {
          normalData: normalData, //DB에 있던 기존 지점판매상품
          selectedProduct: selectedProduct, //새로 선택한 지점판매상품
          idx: props.detailIdx,
        }
      );
      alert("수정이 완료되었습니다.");
      // const mergedData = {
      //   normalData: normalData,
      //   selectedProduct: selectedProduct,
      // };
      // props.mergedData(mergedData);
      props.closeModal();
      // console.log("mergedData", mergedData);
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };

  const clearModal = () => {
    props.closeModal();
  };

  const handleCreate = () => {
    // 상품종류, 상품명1, 상품명2가 모두 선택되었는지 확인
    if (!type || !product1 || !product2) {
      alert("상품종류, 상품명1, 상품명2를 모두 선택해야 합니다.");
      return;
    }

    const trimmedProduct2 = product2.trim();

    // 선택한 name_2 데이터를 selectedProduct 배열에 추가
    const newSelectedProduct = {
      id: Date.now(),
      type: type,
      product1: product1,
      product2: trimmedProduct2,
    };
    setSelectedProduct([...selectedProduct, newSelectedProduct]);
    // select box 값 초기화
    setType("");
    setProduct1("");
    setProduct2("");
  };
  useEffect(() => {
    console.log("selectedProduct", selectedProduct);
  }, [selectedProduct]);

  const handleProductChange = (value, index) => {
    const updatedSelectedProduct = [...selectedProduct];
    updatedSelectedProduct[index].product2 = value;
    setSelectedProduct(updatedSelectedProduct);
  };

  const plusDataDelete = (productName) => {
    const updatedNormalData = normalData
      .split(",")
      .filter((item) => item !== productName)
      .join(",");
    setNormalData(updatedNormalData); // 정상적으로 업데이트된 데이터로 설정
  };

  const handleDelete = (id) => {
    const updatedSelectedProduct = selectedProduct.filter(
      (product) => product.id !== id
    );
    setSelectedProduct(updatedSelectedProduct);
  };

  return (
    <div className="modal_wrap">
      <div className="modal_back">
        <div className="modal_box">
          <div className="modal_title_box">
            <div className="modal_title">지점판매상품 관리</div>
            <div className="modal_close_btn" onClick={() => clearModal()}>
              X
            </div>
          </div>
          <div className="table_box">
            <div className="table_row">
              <div className="table_section">
                <div className="table_title">
                  상품종류<p className="title_point">*</p>
                </div>
                <div className="table_contents w100">
                  <select
                    name="affiliation"
                    className="table_select"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option value="">선택</option>
                    {uniqueTypes.map((item, index) => (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
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
                    name="affiliation"
                    className="table_select"
                    value={product1}
                    onChange={(e) => setProduct1(e.target.value)}
                  >
                    <option value="">선택</option>
                    {[
                      ...new Set(
                        productData
                          .filter((item) => item.type === type)
                          .map((item) => item.name_1)
                      ),
                    ].map((name, index) => (
                      <option key={index} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="table_box">
            <div className="table_row">
              <div className="table_section">
                <div className="table_title">
                  상품명2<p className="title_point">*</p>
                </div>
                <div className="table_contents w100">
                  <select
                    name="affiliation"
                    className="table_select"
                    value={product2}
                    onChange={(e) => setProduct2(e.target.value)}
                  >
                    <option value="">선택</option>
                    {productData
                      .filter((item) => item.name_1 === product1) // name_1이 일치하는 데이터 필터링
                      .map((item, index) => (
                        <option key={index} value={item.name_2}>
                          {item.name_2}
                        </option>
                      ))}
                  </select>
                  &nbsp;&nbsp;
                  <div className="add_btn" onClick={handleCreate}>
                    생성
                  </div>
                </div>
              </div>
            </div>
          </div>
          <br />
          {typeof normalData === "string" &&
            normalData.split(",").map((productName, index) => (
              <div key={index}>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) =>
                    handleProductChange(
                      e.target.value,
                      index + selectedProduct.length
                    )
                  }
                />
                <button onClick={() => plusDataDelete(productName)}>
                  삭제
                </button>
              </div>
            ))}
          {selectedProduct.map((product, index) => (
            <div key={index}>
              <div style={{ paddingTop: "10px" }}>
                <input
                  type="text"
                  value={product.product2}
                  onChange={(e) => handleProductChange(e.target.value, index)}
                />
                <button
                  onClick={() => {
                    console.log("Deleting selected product:", product);
                    handleDelete(product.id);
                  }}
                >
                  삭제
                </button>
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

export default BranchProductModal;
