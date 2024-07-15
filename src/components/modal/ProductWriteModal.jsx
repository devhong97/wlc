import React, { useEffect, useState } from "react";
import Axios from "axios";

const ProductWriteModal = (props) => {
  const [categories, setCategories] = useState([]); // 전체 상품카테고리
  const [products, setProducts] = useState([]); // 상품명1 데이터저장
  const [selectedCategory, setSelectedCategory] = useState(""); // 선택된 상품 카테고리
  const [selectedProduct, setSelectedProduct] = useState(""); // 선택된 상품명1
  const [name2, setName2] = useState(""); // 상품명2(직접입력)
  const [normalCost, setNormalCost] = useState(""); // 일반점검 검진비용(원가)
  const [normalRevenue, setNormalRevenue] = useState(""); // 일반점검 순수익(원가)
  const [cost, setCost] = useState(""); // 보험점검 후 검진비용(원가)
  const [revenue, setRevenue] = useState(""); // 보험점검 후 검진비용(원가)
  const [commision1, setCommision1] = useState(""); // 지점장커미션
  const [commision2, setCommision2] = useState(""); // 영업자커미션
  const [commision3, setCommision3] = useState(""); // 브로커커미션
  const [pKey, setPKey] = useState(""); // p_key 값

  console.log(selectedCategory);

  const formatNumberWithCommas = (number) => {
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // 일반점검 원가 입력 변경 핸들러
  const normalCostChange = (e) => {
    const rawValue = e.target.value.replace(/,/g, "");
    if (!isNaN(rawValue)) {
      setNormalCost(formatNumberWithCommas(rawValue));
    }
  };
  // 일반점검 순이익 입력 변경 핸들러
  const normalRevenueChange = (e) => {
    const rawValue = e.target.value.replace(/,/g, "");
    if (!isNaN(rawValue)) {
      setNormalRevenue(formatNumberWithCommas(rawValue));
    }
  };
  // 보험점검 후 원가 입력 변경 핸들러
  const costChange = (e) => {
    const rawValue = e.target.value.replace(/,/g, "");
    if (!isNaN(rawValue)) {
      setCost(formatNumberWithCommas(rawValue));
    }
  };
  // 보험점검 후 순이익 입력 변경 핸들러
  const revenueChange = (e) => {
    const rawValue = e.target.value.replace(/,/g, "");
    if (!isNaN(rawValue)) {
      setRevenue(formatNumberWithCommas(rawValue));
    }
  };

  useEffect(() => {
    Axios.get("http://localhost:3001/api/get/categories")
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
      Axios.get(`http://localhost:3001/api/get/products/${selectedCategory}`)
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
    } else if (normalCost === "") {
      alert("일반점검 검진비용을 입력해주세요.");
      const normalCostInput = document.getElementById("cos1");
      if (normalCostInput) {
        normalCostInput.focus();
      }
      return;
    } else if (normalRevenue === "") {
      alert("일반점검 순이익(20%)를 입력해주세요.");
      const normalRevenueInput = document.getElementById("cos2");
      if (normalRevenueInput) {
        normalRevenueInput.focus();
      }
      return;
    } else if (cost === "") {
      alert("보험점검 후 검진비용을 입력해주세요.");
      const costInput = document.getElementById("cos3");
      if (costInput) {
        costInput.focus();
      }
      return;
    } else if (revenue === "") {
      alert("보험점검 후 순이익(20%)를 입력해주세요.");
      const revenueInput = document.getElementById("cos4");
      if (revenueInput) {
        revenueInput.focus();
      }
      return;
    }

    // 상품등록
    Axios.post("http://localhost:3001/api/post/product_write", {
      type: selectedCategory,
      name1: selectedProduct,
      name2: name2,
      normalCost: normalCost,
      normalRevenue: normalRevenue,
      cost: cost,
      revenue: revenue,
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
                      ...new Set(
                        categories
                          .map((category) => category.type)
                          .sort((a, b) => a - b)
                      ),
                    ].map((type) => (
                      <option key={type} value={type}>
                        {type === "1"
                          ? "국가검진"
                          : type === "2"
                          ? "일반종합검진"
                          : type === "3"
                          ? "보험점검후검진"
                          : type}
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
              <div className="table_section">
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
            </div>
            <div className="table_row">
              <div className="table_section half">
                <div className="table_title">
                  일반점검(원가)<p className="title_point">*</p>
                </div>
                <div className="table_contents w100">
                  <input
                    className="table_input modal"
                    type="text"
                    id="cos1"
                    placeholder="검진비용을 입력해주세요"
                    // style={{ backgroundColor: "#f2f2f2" }}
                    value={normalCost}
                    onChange={normalCostChange}
                  ></input>
                </div>
              </div>
              <div className="table_section half">
                <div className="table_title">
                  일반점검 순이익<p className="title_point">*</p>
                </div>
                <div className="table_contents w100">
                  <input
                    className="table_input modal"
                    type="text"
                    id="cos2"
                    placeholder="순이익을 입력해주세요(판매가의 20%)"
                    // readOnly
                    // style={{ backgroundColor: "#f2f2f2" }}
                    value={normalRevenue}
                    onChange={normalRevenueChange}
                  ></input>
                </div>
              </div>
            </div>
            <div className="table_row">
              <div className="table_section half">
                <div className="table_title">
                  보험점검 후(원가)<p className="title_point">*</p>
                </div>
                <div className="table_contents w100">
                  <input
                    className="table_input modal"
                    type="text"
                    id="cos3"
                    placeholder="검진비용을 입력해주세요"
                    // style={{ backgroundColor: "#f2f2f2" }}
                    value={cost}
                    onChange={costChange}
                  ></input>
                </div>
              </div>
              <div className="table_section half">
                <div className="table_title">
                  보험점검 후 순이익<p className="title_point">*</p>
                </div>
                <div className="table_contents w100">
                  <input
                    className="table_input modal"
                    type="text"
                    id="cos4"
                    placeholder="순이익을 입력해주세요(판매가의 20%)"
                    // readOnly
                    // style={{ backgroundColor: "#f2f2f2" }}
                    value={revenue}
                    onChange={revenueChange}
                  ></input>
                </div>
              </div>
            </div>

            <div className="table_row">
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
