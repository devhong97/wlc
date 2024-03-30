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

  // useEffect(() => {
  //   console.log("normalData", normalData);
  //   console.log("selectedProduct", selectedProduct);
  // }, [selectedProduct, selectedProduct]);

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
      props.closeModal(selectedProduct);
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

    // 선택한 name_2 데이터를 selectedProduct 배열에 추가
    const newSelectedProduct = {
      type: type,
      product1: product1,
      product2: product2,
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

  const handleDelete = (index) => {
    const updatedSelectedProduct = [...selectedProduct];
    updatedSelectedProduct.splice(index, 1);
    setSelectedProduct(updatedSelectedProduct);
  };

  const plusDataDelete = (index) => {
    const updatedSelectedProduct = normalData.split(",");
    console.log(updatedSelectedProduct);
    updatedSelectedProduct.splice(index, 1);
    props.updateSelectedProduct(updatedSelectedProduct.join(","));
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
                <button
                  onClick={() => plusDataDelete(selectedProduct.length + index)}
                >
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

export default BranchProductModal;
