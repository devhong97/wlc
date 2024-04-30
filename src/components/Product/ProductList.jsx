import React, { useEffect, useRef, useState } from "react";
import BranchViewModal from "../modal/BranchViewModal";
import TableDefault from "../Table/TableDefault";
import Axios from "axios";
import moment from "moment";
import HospitalWriteModal from "../modal/HospitalWriteModal";
import HospitalViewModal from "../modal/HospitalViewModal";
import ProductWriteModal from "../modal/ProductWriteModal";
import ProductViewModal from "./../modal/ProductViewModal";
import ProductSelect from "./ProductSelect";

const ProductList = () => {
  const selectRef = useRef(null);
  const [writeModal, setWriteModal] = useState(false); // 병원등록 모달
  const [viewModal, setViewModal] = useState(false); // 병원상세 수정모달
  const [detailIdx, setDetailIdx] = useState(""); //상세페이지 Idx
  const [productList, setProduct] = useState([]); // 병원 리스트
  const [detailData, setDetailData] = useState([]);
  const [searchData, setSearchData] = useState([]);

  useEffect(() => {
    fetchProductList();
  }, [searchData]);

  const fetchProductList = () => {
    const resultParams = {};
    if (searchData) {
      resultParams.searchData = searchData;
    }
    Axios.get("http://118.67.134.86:3001/api/get/product_list", {
      params: resultParams,
    })
      .then((res) => {
        if (res.data.success) {
          // 서버로부터 받아온 데이터를 rows로 설정합니다.
          setProduct(
            res.data.data.map((data, index) => ({
              id: index + 1,
              type: data.type === "2" ? "패키지" : "단일",
              realType: data.type,
              name1: data.name_1,
              name2: data.name_2,
              ogPriceTxt: data.og_price_txt,
              priceTxt: data.price_txt,
              date: moment(data.date).format("YYYY.MM.DD"),

              //커미션
              commision1: data.commision_manager,
              commision2: data.commision_user,
              commision3: data.commision_broker,
              idx: data.idx,
            }))
          );
        } else {
          console.error("지점 관리 데이터호출 실패");
          if (searchData) {
            //alert("검색조건에 맞는 데이터가 없습니다.");
            selectRef.current.clearSearch();
          }
        }
      })
      .catch((err) => {
        console.error("지점 관리 데이터호출 실패:", err);
      });
  };

  const columns = [
    { field: "id", headerName: "No", flex: 0.5 },
    { field: "type", headerName: "상품카테고리" },
    { field: "name1", headerName: "상품명1" },
    { field: "name2", headerName: "상품명2" },
    { field: "ogPriceTxt", headerName: "의료수가" },
    { field: "priceTxt", headerName: "검진비용" },
    { field: "date", headerName: "상품등록일" },
  ];

  const writeModalOpen = () => {
    setWriteModal(!writeModal);
  };
  const viewModalOpen = (data) => {
    const idx = data.idx;
    setViewModal(!viewModal);
    setDetailData(data);
  };
  const viewModalClose = (status) => {
    setViewModal(false);
    if (status === "reload") {
      window.location.reload();
    } else {
      fetchProductList();
    }
  };

  return (
    <div className="main_wrap">
      <div className="main_back">
        <div className="main_title_box">상품 관리</div>
        <div className="board_list_wrap">
          <div className="list_area">
            <div className="search_box">
              <ProductSelect
                ref={selectRef}
                setSearchData={setSearchData}
              ></ProductSelect>
              <div className="title_btn" onClick={() => writeModalOpen()}>
                상품등록
              </div>
            </div>
            <div className="table_box list">
              {productList.length === 0 ? (
                <div>정보가 없습니다.</div>
              ) : (
                <TableDefault
                  rows={productList}
                  columns={columns}
                  viewModalOpen={viewModalOpen}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      {writeModal && (
        <ProductWriteModal closeModal={writeModalOpen}></ProductWriteModal>
      )}
      {viewModal && (
        <ProductViewModal
          closeModal={viewModalClose}
          detailIdx={detailIdx}
          detailData={detailData}
        ></ProductViewModal>
      )}
    </div>
  );
};

export default ProductList;
