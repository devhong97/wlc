import React, { useEffect, useState } from "react";
import Axios from "axios";

const ProductWriteModal = (props) => {
  const [categories, setCategories] = useState([]); // 상품 카테고리 목록
  const [products, setProducts] = useState([]); // 선택된 상품 카테고리에 속한 상품 목록
  const [selectedCategory, setSelectedCategory] = useState(""); // 선택된 상품 카테고리
  const [selectedProduct, setSelectedProduct] = useState(""); // 선택된 상품명1

  useEffect(() => {
    // 상품 카테고리 데이터 호출
    Axios.get("http://localhost:3001/api/get/categories")
      .then((response) => {
        setCategories(response.data); // 수정된 부분: response.data를 그대로 사용
        console.log("categories", response.data);
      })
      .catch((err) => {
        console.error("상품 카테고리 호출 실패:", err);
      });
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      // 선택된 상품 카테고리에 속한 상품명1 데이터 호출
      Axios.get(`http://localhost:3001/api/get/products/${selectedCategory}`)
        .then((response) => {
          setProducts(response.data.data);
        })
        .catch((err) => {
          console.error("상품 데이터 호출 실패:", err);
        });
    }
  }, [selectedCategory]); // selectedCategory 값이 변경될 때마다 호출

  // 상품 카테고리 변경 시 호출되는 함수
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  // 상품명1 변경 시 호출되는 함수
  const handleProductChange = (event) => {
    setSelectedProduct(event.target.value);
  };

  //모달 초기화
  const clearModal = () => {
    props.closeModal();
  };

  //지점 등록버튼
  const handleSubmit = async () => {
    // if (name === "") {
    //   alert("병원명을 입력해주세요.");
    //   const nameInput = document.getElementById("user_name");
    //   if (nameInput) {
    //     nameInput.focus();
    //   }
    //   return;
    // } else if (tel1 === "" || tel2 === "" || tel3 === "") {
    //   alert("연락처를 입력해주세요.");
    //   const numberInput = document.getElementById("user_number");
    //   if (numberInput) {
    //     numberInput.focus();
    //   }
    //   return;
    // } else if (selectedCity === "") {
    //   alert("지역(도)를 선택해주세요.");
    //   const provinceInput = document.getElementById("user_province");
    //   if (provinceInput) {
    //     provinceInput.focus();
    //   }
    //   return;
    // } else if (selectedDistrict === "") {
    //   alert("지역(시)를 선택해주세요.");
    //   const cityInput = document.getElementById("user_city");
    //   if (cityInput) {
    //     cityInput.focus();
    //   }
    //   return;
    // }

    // 병원등록
    Axios.post("http://localhost:3001/api/post/hospital", {
      //   hospitalName: name,
      //   number: number,
      //   province: selectedCity,
      //   city: selectedDistrict,
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
                    value={selectedCategory}
                    onChange={(e) => {
                      handleCategoryChange(e);
                      handleProductChange({ target: { value: "" } }); // 상품명1 선택 초기화
                    }}
                  >
                    <option value="">카테고리 선택</option>
                    {categories.map((category) => (
                      <option key={category.p_key} value={category.p_key}>
                        {category.product_1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="table_section half">
                <div className="table_title">상품명1</div>
                <div className="table_contents w100">
                  <select
                    name="product"
                    className="table_select"
                    value={selectedProduct}
                    onChange={handleProductChange}
                    disabled={!selectedCategory} // 상품 카테고리를 선택하지 않은 경우 비활성화
                  >
                    <option value="">선택</option>
                    {products.map((product) => (
                      <option key={product.p_key} value={product.p_key}>
                        {product.name_2}
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
                    id="title"
                    placeholder="상품명2를 입력해주세요."
                    //value={branchName}
                    //onChange={(e) => setBranchName(e.target.value)}
                  ></input>
                </div>
              </div>
              <div className="table_section half">
                <div className="table_title">의료수가</div>
                <div className="table_contents w100">
                  <input
                    className="table_input modal"
                    type="text"
                    id="title"
                    placeholder="의료수가"
                    readOnly
                    style={{ backgroundColor: "#f2f2f2" }}
                    //value={branchName}
                    //onChange={(e) => setBranchName(e.target.value)}
                  ></input>
                </div>
              </div>
              <div className="table_section">
                <div className="table_title">검진비용</div>
                <div className="table_contents w100">
                  <input
                    className="table_input modal"
                    type="text"
                    id="title"
                    placeholder="검진비용"
                    style={{ backgroundColor: "#f2f2f2" }}
                    //value={branchName}
                    //onChange={(e) => setBranchName(e.target.value)}
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
