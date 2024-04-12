import React, { useEffect, useState, useImperativeHandle, useRef } from "react";
import { useBranchContext } from "../Context/BranchContext";
import Axios from "axios";

const CommisionSelect = (props, ref) => {
  const {
    typeGroup,
    companyGroup,
    branchGroup,
    setContextType,
    setContextCompany,
  } = useBranchContext();
  const [type, setType] = useState("");
  const [company, setCompany] = useState("");
  const [branchName, setBranchName] = useState("");
  const [branchIdx, setBranchIdx] = useState("");
  const [product, setProduct] = useState("");
  const [hospital, setHospital] = useState("");
  const [productList, setProductList] = useState([]);
  const [hospitalList, setHospitalList] = useState([]);
  const [searchOption, setSearchOption] = useState("manager");
  const [searchInput, setSearchInput] = useState("");

  useImperativeHandle(ref, () => ({
    clearSearch,
  }));
  useEffect(() => {
    if (props.defaultSelect) {
      setSearchOption("manager");
      setSearchInput(props.defaultSelect.manager);
    }
  }, [props.defaultSelect]);
  useEffect(() => {
    setContextType(type);
  }, [type]);

  useEffect(() => {
    setContextCompany(company);
  }, [company]);
  useEffect(() => {
    getProduct();
    getHospital();
  }, []);

  const getProduct = async () => {
    try {
      const response = await Axios.get(
        "http://localhost:3001/api/get/reserv/product_list"
      );
      const allData = response.data.data;
      setProductList(allData);
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };

  const getHospital = async () => {
    try {
      const response = await Axios.get(
        "http://localhost:3001/api/get/reserv/hospital_list"
      );
      const allData = response.data.data;
      setHospitalList(allData);
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };

  const selectBranch = (num) => {
    setBranchIdx(num);
    const selectedBranch = branchGroup.find((data) => data.branch_idx === num);
    if (selectedBranch) {
      setBranchName(selectedBranch.branch_name);
    }
  };

  const selectType = (data) => {
    setType(data);
    setCompany("");
    setBranchIdx("");
    setBranchName("");
  };

  const resetData = () => {
    setProduct("");
    setHospital("");
    setSearchOption("manager");
    setSearchInput("");
  };

  const handleSearch = () => {
    if (props.setSearchData) {
      const searchData = {
        branch_type: type,
        company_name: company,
        branch_name: branchName,
        product: product,
        hospital: hospital,
      };

      searchData[searchOption] = searchInput;

      props.setSearchData(searchData);
    }
  };
  const clearSearch = () => {
    if (props.setSearchData) {
      props.setSearchData([]);
      selectType("");
      resetData();
    }
  };
  return (
    <div className="list_select_area">
      <div className="search_select">
        <select
          className="list_select"
          value={type}
          onChange={(e) => selectType(e.target.value)}
        >
          <option value="">지점종류</option>
          {typeGroup.map((type, index) => {
            return (
              <option key={index} value={type}>
                {type}
              </option>
            );
          })}
        </select>
        <select
          className="list_select"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        >
          <option value="">회사명</option>
          {companyGroup.map((data, index) => {
            return (
              <option key={index} value={data}>
                {data}
              </option>
            );
          })}
        </select>
        <select
          className="list_select"
          value={branchIdx}
          onChange={(e) => selectBranch(e.target.value)}
        >
          <option value="">지점명</option>
          {branchGroup.map((data, index) => {
            return (
              <option key={index} value={data.branch_idx}>
                {data.branch_name}
              </option>
            );
          })}
        </select>
        <select
          className="list_select"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
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
        <select
          className="list_select"
          value={hospital}
          onChange={(e) => setHospital(e.target.value)}
        >
          <option value="">병원</option>
          {hospitalList.map((data, index) => {
            return (
              <option key={index} value={data.name}>
                {data.name}
              </option>
            );
          })}
        </select>
        <div className="search_input_container ">
          <select
            className="list_select"
            value={searchOption}
            onChange={(e) => setSearchOption(e.target.value)}
          >
            <option value="manager">영업자명</option>
            <option value="contractor_name">계약자명</option>
            <option value="name">검진자명</option>
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

export default React.forwardRef(CommisionSelect);
