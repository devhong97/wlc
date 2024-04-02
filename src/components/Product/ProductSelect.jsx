import React, { useEffect, useState, useImperativeHandle, useRef } from "react";
import Axios from "axios";

const ProductSelect = (props, ref) => {
  const [searchOption, setSearchOption] = useState("VIP");
  const [searchInput, setSearchInput] = useState("");
  const [productList, setProductList] = useState([]);

  useImperativeHandle(ref, () => ({
    clearSearch,
  }));

  useEffect(() => {
    getProductType();
  }, []);

  const getProductType = async () => {
    try {
      const response = await Axios.get(
        "http://192.168.45.226:3001/api/get/reserv/product_list"
      );
      const allData = response.data.data;
      setProductList(allData);
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };
  const handleSearch = () => {
    if (props.setSearchData) {
      const searchData = {
        name_1: searchOption,
        name_2: searchInput,
      };

      props.setSearchData(searchData);
    }
  };
  const clearSearch = () => {
    if (props.setSearchData) {
      props.setSearchData([]);
      setSearchOption("VIP");
      setSearchInput("");
    }
  };
  return (
    <div className="list_select_area">
      <div className="search_select">
        <div className="search_input_container">
          <select
            className="list_select"
            value={searchOption}
            onChange={(e) => setSearchOption(e.target.value)}
          >
            <option value="">상품명</option>
            {productList.map((data, index) => {
              return (
                <option key={index} value={data.product_1}>
                  {data.product_1}
                </option>
              );
            })}
          </select>
          <div className="search_input">
            <input
              className="list_input"
              placeholder="검색어를 입력하세요"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            ></input>
            <div className="list_search" onClick={() => handleSearch()}>
              검색
            </div>
            <div
              className="list_search reset_btn"
              onClick={() => clearSearch()}
            >
              초기화
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.forwardRef(ProductSelect);
