import React, { useEffect, useState } from "react";
import Axios from "axios";
import BranchProductModal from "./BranchProductModal";

const ProductViewModal = (props) => {
  const [detailNum, setDetailNum] = useState(""); // 상세페이지 Idx
  const [productModal, setProductModal] = useState(false); // 지점판매상품모달
  const [categories, setCategories] = useState([]); // 전체 상품카테고리
  const [products, setProducts] = useState([]); // 상품명1 데이터저장
  const [selectedCategory, setSelectedCategory] = useState(
    props.detailData.realType
  ); // 선택된 상품 카테고리
  const [selectedProduct, setSelectedProduct] = useState(
    props.detailData.name1
  ); // 선택된 상품명1
  const [name2, setName2] = useState(props.detailData.name2); // 상품명2(직접입력)
  const [normalCost, setNormalCost] = useState(props.detailData.normalCost); // 일반점검 원가
  const [normalRevenue, setNormalRevenue] = useState(
    props.detailData.normalRevenue
  ); // 일반점검 후 순이익(20%)
  const [cost, setCost] = useState(props.detailData.cost); // 보험점검 후 원가
  const [revenue, setRevenue] = useState(props.detailData.revenue); // 보험점검 후 순이익(20%)
  const [commision1, setCommision1] = useState(props.detailData.commision1); // 지점장커미션
  const [commision2, setCommision2] = useState(props.detailData.commision2); // 영업자커미션
  const [commision3, setCommision3] = useState(props.detailData.commision3); // 브로커커미션
  const [pKey, setPKey] = useState(""); // p_key 값

  const formatNumberWithCommas = (number) => {
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // 일반점검 원가 입력 변경 핸들러
  const normalCostChange = (e) => {
    const rawValue = e.target.value.replace(/,/g, ""); // 콤마 제거
    if (!isNaN(rawValue)) {
      setNormalCost(formatNumberWithCommas(rawValue));
    }
  };

  // 일번점검 순이익 입력 변경 핸들러
  const normalRevenueChange = (e) => {
    const rawValue = e.target.value.replace(/,/g, ""); // 콤마 제거
    if (!isNaN(rawValue)) {
      setNormalRevenue(formatNumberWithCommas(rawValue));
    }
  };

  // 보험점검 후 원가 입력 변경 핸들러
  const costChange = (e) => {
    const rawValue = e.target.value.replace(/,/g, ""); // 콤마 제거
    if (!isNaN(rawValue)) {
      setCost(formatNumberWithCommas(rawValue));
    }
  };

  // 보험점검 후 순이익 입력 변경 핸들러
  const revenueChange = (e) => {
    const rawValue = e.target.value.replace(/,/g, ""); // 콤마 제거
    if (!isNaN(rawValue)) {
      setRevenue(formatNumberWithCommas(rawValue));
    }
  };

  // LIST에서 가져온 상세보기 idx 호출
  useEffect(() => {
    if (props.detailIdx) {
      setDetailNum(props.detailIdx);
    }
  }, [props.detailIdx]);

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

  // 수정완료버튼
  const handleSubmit = async () => {
    if (!selectedCategory || !selectedProduct || !name2) {
      alert("필수 사항을 모두 입력해주세요");
      return;
    }

    const confirmModify = window.confirm(`수정을 완료하시겠습니까?`);
    if (!confirmModify) {
      return;
    }
    try {
      const response = await Axios.post(
        "http://localhost:3001/api/post/product_modify",
        {
          type: selectedCategory,
          pKey: pKey,
          name1: selectedProduct,
          name2: name2,
          normalCost: normalCost,
          normalRevenue: normalRevenue,
          cost: cost,
          revenue: revenue,
          commision1: commision1,
          commision2: commision2,
          commision3: commision3,
          idx: props.detailData.idx,
        }
      );
      alert("수정이 완료되었습니다.");
      props.closeModal();
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };

  // 상품삭제버튼
  const deleteProduct = async () => {
    const confirmDelete = window.confirm(` 상품을 삭제하시겠습니까?`);
    if (!confirmDelete) {
      return;
    }

    try {
      const response = await Axios.post(
        "http://localhost:3001/api/post/product_delete",
        {
          idx: props.detailData.idx,
        }
      );
      alert("상품이 삭제되었습니다.");
      props.closeModal("reload");
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };

  // 지점판매상품 선택 모달창 OPEN 버튼
  const productModalOpen = () => {
    setProductModal(!productModal);
  };

  // 모달창닫기
  const clearModal = () => {
    props.closeModal();
  };

  return (
    <div className="modal_wrap">
      <div className="modal_back">
        <div className="modal_box">
          <div className="modal_title_box">
            <div className="modal_title">상품 상세</div>
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
                <div className="table_title">상품명1</div>
                <div className="table_contents w100">
                  <select
                    name="product"
                    className="table_select"
                    value={selectedProduct}
                    onChange={(e) => setSelectedProduct(e.target.value)}
                    // disabled={!selectedCategory} // 상품 카테고리를 선택하지 않은 경우 비활성화
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
              <div className="table_section ">
                <div className="table_title">
                  상품명2<p className="title_point">*</p>
                </div>
                <div className="table_contents w100">
                  <input
                    className="table_input modal"
                    type="text"
                    id="title"
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
                    id="title"
                    // placeholder="의료수가 입력"
                    // readOnly
                    // style={{ backgroundColor: "#f2f2f2" }}
                    value={normalCost}
                    onChange={normalCostChange}
                  ></input>
                </div>
              </div>
              <div className="table_section half">
                <div className="table_title">
                  일반점검(순이익)<p className="title_point">*</p>
                </div>
                <div className="table_contents w100">
                  <input
                    className="table_input modal"
                    type="text"
                    id="title"
                    // placeholder="의료수가 입력"
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
                    id="title"
                    // placeholder="의료수가 입력"
                    // readOnly
                    // style={{ backgroundColor: "#f2f2f2" }}
                    value={cost}
                    onChange={costChange}
                  ></input>
                </div>
              </div>
              <div className="table_section half">
                <div className="table_title">
                  보험점검 후(순이익)<p className="title_point">*</p>
                </div>
                <div className="table_contents w100">
                  <input
                    className="table_input modal"
                    type="text"
                    id="title"
                    // placeholder="의료수가 입력"
                    // readOnly
                    // style={{ backgroundColor: "#f2f2f2" }}
                    value={revenue}
                    onChange={revenueChange}
                  ></input>
                </div>
              </div>
            </div>
            <div className="table_row">
              <div className="table_section">
                <div className="table_title">지점장커미션</div>
                <div className="table_contents w100">
                  <input
                    className="table_input modal"
                    type="text"
                    id="title"
                    // placeholder="지점장커미션"
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
                    // placeholder="영업자커미션"
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
                    // placeholder="브로커커미션"
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
              수정
            </div>
            <div className="modal_btn close" onClick={() => deleteProduct()}>
              삭제
            </div>
          </div>
        </div>
      </div>
      {productModal && (
        <BranchProductModal
          closeModal={productModalOpen}
          detailIdx={props.detailIdx}
        ></BranchProductModal>
      )}
    </div>
  );
};

export default ProductViewModal;
