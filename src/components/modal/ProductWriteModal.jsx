import React, { useEffect, useState } from "react";
import Axios from "axios";

const ProductWriteModal = (props) => {
  const [categories, setCategories] = useState([]); // 전체 상품카테고리
  const [products, setProducts] = useState([]); // 상품명1 데이터저장
  const [selectedCategory, setSelectedCategory] = useState(""); // 선택된 상품 카테고리
  const [selectedProduct, setSelectedProduct] = useState(""); // 선택된 상품명1
  const [name2, setName2] = useState(""); // 상품명2(직접입력)
  const [ogPriceTxt, setOgPriceTxt] = useState(""); // 의료수가
  const [priceTxt, setPriceTxt] = useState(""); // 검진비용
  const [commision1, setCommision1] = useState(""); // 지점장커미션
  const [commision2, setCommision2] = useState(""); // 영업자커미션
  const [commision3, setCommision3] = useState(""); // 브로커커미션
  const [pKey, setPKey] = useState(""); // p_key 값

  console.log(selectedCategory);

  useEffect(() => {
    Axios.get("https://www.wlcare.co.kr:8443/api/get/categories")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((err) => {
        console.error("상품 카테고리 호출 실패:", err);
      });
  }, []);

  const handleCategoryChange = (event) => {
    const selectedCategory = event.target.value;
    setSelectedCategory(selectedCategory);
  };

  useEffect(() => {
    if (selectedCategory !== "") {
      Axios.get(
        `https://www.wlcare.co.kr:8443/api/get/products/${selectedCategory}`
      )
        .then((response) => {
          setProducts(response.data);

          // 선택한 상품명1에 해당하는 c_key 찾기
          const selectedProductData = response.data.find(
            (product) => product.product_1 === selectedProduct
          );
          if (selectedProductData) {
            setPKey(selectedProductData.c_key);
          }
        })
        .catch((err) => {
          console.error("상품 데이터 호출 실패:", err);
        });
    }
  }, [selectedCategory, selectedProduct]);

  //모달 초기화
  const clearModal = () => {
    props.closeModal();
  };

  //지점 등록버튼
  const handleSubmit = async () => {
    if (selectedCategory === "") {
      alert("상품카테고리를 선택해주세요.");
      const selectedCategoryInput = document.getElementById("user_cate");
      if (selectedCategoryInput) {
        selectedCategoryInput.focus();
      }
      return;
    } else if (selectedProduct === "") {
      alert("상품명1을 선택해주세요.");
      const selectedProductInput = document.getElementById("user_prd");
      if (selectedProductInput) {
        selectedProductInput.focus();
      }
      return;
    } else if (name2 === "") {
      alert("상품명2를 입력해주세요.");
      const name2Input = document.getElementById("user_prd2");
      if (name2Input) {
        name2Input.focus();
      }
      return;
    } else if (ogPriceTxt === "") {
      alert("의료수가를 입력해주세요.");
      const ogPriceTxtInput = document.getElementById("user_price1");
      if (ogPriceTxtInput) {
        ogPriceTxtInput.focus();
      }
      return;
    } else if (priceTxt === "") {
      alert("검진비용을 입력해주세요.");
      const priceTxtInput = document.getElementById("user_price2");
      if (priceTxtInput) {
        priceTxtInput.focus();
      }
      return;
    }

    // 상품등록
    Axios.post("https://www.wlcare.co.kr:8443/api/post/product_write", {
      type: selectedCategory,
      name1: selectedProduct,
      name2: name2,
      ogPriceTxt: ogPriceTxt,
      priceTxt: priceTxt,
      commision1: commision1,
      commision2: commision2,
      commision3: commision3,
      pKey: pKey,
    })
      .then((res) => {
        console.log(res.data);
        alert(`상품등록이 완료되었습니다.`);
        clearModal();
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="modal_wrap">
      <div className="modal_back">
        <div className="modal_box">
          <div className="modal_title_box">
            <div className="modal_title">상품 등록</div>
            <div className="modal_close_btn" onClick={() => clearModal()}>
              X
            </div>
          </div>

          <div className="table_box">
            <div className="table_row">
              <div className="table_section half">
                <div className="table_title">
                  상품카테고리<p className="title_point">*</p>
                </div>
                <div className="table_contents w100">
                  <select
                    name="affiliation"
                    className="table_select"
                    id="user_cate"
                    value={selectedCategory}
                    onChange={(e) => {
                      handleCategoryChange(e);
                    }}
                  >
                    <option value="">카테고리 선택</option>
                    {[
                      ...new Set(categories.map((category) => category.type)),
                    ].map((type) => (
                      <option key={type} value={type}>
                        {type === "2" ? "패키지" : "단일"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="table_section half">
                <div className="table_title">
                  상품명1<p className="title_point">*</p>
                </div>
                <div className="table_contents w100">
                  <select
                    name="product"
                    className="table_select"
                    id="user_prd"
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    disabled={!selectedCategory} // 상품 카테고리를 선택하지 않은 경우 비활성화
                  >
                    <option value="">선택</option>
                    {products.length > 0 &&
                      products.map((product, index) => (
                        <option key={index} value={product.product_1}>
                          {product.product_1}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="table_row">
              <div className="table_section half">
                <div className="table_title">
                  상품명2<p className="title_point">*</p>
                </div>
                <div className="table_contents w100">
                  <input
                    className="table_input modal"
                    type="text"
                    id="user_prd2"
                    placeholder="상품명2를 입력해주세요."
                    value={name2}
                    onChange={(e) => setName2(e.target.value)}
                  ></input>
                </div>
              </div>
              <div className="table_section half">
                <div className="table_title">
                  의료수가<p className="title_point">*</p>
                </div>
                <div className="table_contents w100">
                  <input
                    className="table_input modal"
                    type="text"
                    id="user_price1"
                    placeholder="의료수가를 입력해주세요"
                    // readOnly
                    // style={{ backgroundColor: "#f2f2f2" }}
                    value={ogPriceTxt}
                    onChange={(e) => setOgPriceTxt(e.target.value)}
                  ></input>
                </div>
              </div>
            </div>

            <div className="table_row">
              <div className="table_section half">
                <div className="table_title">
                  검진비용<p className="title_point">*</p>
                </div>
                <div className="table_contents w100">
                  <input
                    className="table_input modal"
                    type="text"
                    id="user_price2"
                    placeholder="검진비용을 입력해주세요"
                    // style={{ backgroundColor: "#f2f2f2" }}
                    value={priceTxt}
                    onChange={(e) => setPriceTxt(e.target.value)}
                  ></input>
                </div>
              </div>
              <div className="table_section half">
                <div className="table_title">지점장커미션</div>
                <div className="table_contents w100">
                  <input
                    className="table_input modal"
                    type="text"
                    id="title"
                    placeholder="0"
                    // style={{ backgroundColor: "#f2f2f2" }}
                    value={commision1}
                    onChange={(e) => setCommision1(e.target.value)}
                  ></input>
                </div>
              </div>
            </div>

            <div className="table_row">
              <div className="table_section half">
                <div className="table_title">영업자커미션</div>
                <div className="table_contents w100">
                  <input
                    className="table_input modal"
                    type="text"
                    id="title"
                    placeholder="0"
                    // style={{ backgroundColor: "#f2f2f2" }}
                    value={commision2}
                    onChange={(e) => setCommision2(e.target.value)}
                  ></input>
                </div>
              </div>
              <div className="table_section half">
                <div className="table_title">브로커커미션</div>
                <div className="table_contents w100">
                  <input
                    className="table_input modal"
                    type="text"
                    id="title"
                    placeholder="0"
                    // style={{ backgroundColor: "#f2f2f2" }}
                    value={commision3}
                    onChange={(e) => setCommision3(e.target.value)}
                  ></input>
                </div>
              </div>
            </div>
          </div>

          <div className="modal_footer_box">
            <div className="modal_btn" onClick={handleSubmit}>
              등록
            </div>
            <div className="modal_btn close" onClick={clearModal}>
              닫기
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductWriteModal;
