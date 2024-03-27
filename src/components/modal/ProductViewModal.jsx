import React, { useEffect, useState } from "react";
import MemberListModal from "./MemberListModal";
import Axios from "axios";
import BranchProductModal from "./BranchProductModal";

const ProductViewModal = (props) => {
  const [detailNum, setDetailNum] = useState(""); // 상세페이지 Idx
  // const [selectNum, setSelectNum] = useState(""); // 지점장 선택 시 Idx
  const [listModal, setListModal] = useState(false); // 지점장 선택 Modal
  const [productModal, setProductModal] = useState(false); // 지점판매상품모달
  const [branchDetailData, setBranchDetailData] = useState([]); //지점상세 모달 데이터
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

  // LIST에서 가져온 상세보기 idx 호출
  useEffect(() => {
    if (props.detailIdx) {
      setDetailNum(props.detailIdx);
      getDetail();
    }
  }, [props.detailIdx]);

  const getDetail = async () => {
    try {
      const response = await Axios.get(
        "http://localhost:3001/api/get/branch_detail",
        {
          params: {
            idx: props.detailIdx,
          },
        }
      );
      const allData = response.data;
      const allProduct = allData[0].product;
      setBranchDetailData(allData[0]);
      const product2 = allData[0]?.product
        ? allData[0].product.replace(/\|/g, ", ")
        : null;
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };

  // 수정완료버튼
  const handleSubmit = async () => {
    const confirmModify = window.confirm(`수정을 완료하시겠습니까?`);
    if (!confirmModify) {
      return;
    }
    try {
      const response = await Axios.post(
        "http://localhost:3001/api/post/branch_modify",
        {
          // branchType: type,
          // bgrade: bgrade,
          // companyName: company,
          // branchName: branchName,
          // ownerName: selectName,
          // location: location,
          // idx: props.detailIdx,
        }
      );
      alert("수정이 완료되었습니다.");
      props.closeModal();
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };

  // 지점삭제버튼
  const deleteBranch = async () => {
    const confirmDelete = window.confirm(
      `[${branchDetailData.branch_name}] 지점을 삭제하시겠습니까?`
    );
    if (!confirmDelete) {
      return;
    }

    try {
      const response = await Axios.post(
        "http://localhost:3001/api/post/branch_delete",
        {
          idx: props.detailIdx,
        }
      );
      alert("상품이 삭제되었습니다.");
      props.closeModal("reload");
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };

  // 지점장 선택 모달창 OPEN 버튼
  const listModalOpen = () => {
    setListModal(!listModal);
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
            <div className="modal_title">지점 상세</div>
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
                  // onChange={(e) => {
                  //   handleCategoryChange(e);
                  // }}
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
                    id="title"
                    placeholder="상품명2를 입력해주세요."
                    value={name2}
                    onChange={(e) => setName2(e.target.value)}
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
                    // placeholder="의료수가 입력"
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
                <div className="table_title">검진비용</div>
                <div className="table_contents w100">
                  <input
                    className="table_input modal"
                    type="text"
                    id="title"
                    // placeholder="검진비용"
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
            <div className="modal_btn close" onClick={() => deleteBranch()}>
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
