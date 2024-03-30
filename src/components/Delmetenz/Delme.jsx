import Axios from "axios";
import React, { useState } from "react";
import "./Delme.css"; // CSS 파일 import

const Delme = () => {
  const [branchType, setBranchType] = useState("");
  const [companyName, setCompanyName] = useState("");

  const [pKey, setPKey] = useState("");
  const [cKey, setCKey] = useState("");
  const [type, setType] = useState("");
  const [product1, setProduct1] = useState("");

  const [detailPKey, setDetailPKey] = useState("");

  // 델미텐츠 지점등록
  const typeTotalInsert = async () => {
    try {
      const confirmResult = window.confirm("지점을 등록하시겠습니까?");
      if (confirmResult) {
        await Axios.post("http://localhost:3001/api/post/type_total", {
          branchType: branchType,
          companyName: companyName,
        });
        alert("지점등록 완료.");
        setBranchType("");
        setCompanyName("");
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 델미텐츠 상품카테고리 등록
  const productCategoryInsert = async () => {
    try {
      const confirmResult = window.confirm("카테고리를 등록하시겠습니까?");
      if (confirmResult) {
        await Axios.post("http://localhost:3001/api/post/product_category", {
          p_key: pKey,
          c_key: cKey,
          type: type,
          product_1: product1,
        });
        alert("카테고리등록 완료.");
        setPKey("");
        setCKey("");
        setType("");
        setProduct1("");
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 델미텐츠 검진항목 등록
  const productDetailInsert = async () => {
    try {
      const confirmResult = window.confirm("검진항목을 등록하시겠습니까?");
      if (confirmResult) {
        await Axios.post("http://localhost:3001/api/post/product_detail", {
          p_key: detailPKey,
        });
        alert("검진항목등록 완료.");
        setDetailPKey("");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="main_wrap delme">
      <div className="main_back delme">
        <div className="section delme">
          <div className="section_title delme">[ 지점등록(type_total) ]</div>
          <div>
            <span>지점종류: &nbsp;</span>
            <input
              type="text"
              value={branchType}
              onChange={(e) => setBranchType(e.target.value)}
            />
          </div>
          <br />
          <div>
            <span>회사명: &nbsp;</span>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
          <div className="delme-btn-wrap">
            <div className="delme_btn" onClick={typeTotalInsert}>
              등록
            </div>
          </div>
        </div>

        <div className="section delme">
          <div className="section_title delme">
            [ 상품카테고리(product_category) ]
          </div>
          <div>
            <span>p_key: &nbsp;</span>
            <input
              type="text"
              value={pKey}
              onChange={(e) => setPKey(e.target.value)}
            />
          </div>
          <div>
            <span>c_key: &nbsp;</span>
            <input
              type="text"
              value={cKey}
              onChange={(e) => setCKey(e.target.value)}
            />
          </div>
          <div>
            <span>카테고리: &nbsp;</span>
            <input
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
            />
          </div>
          <div>
            <span>상품명1: &nbsp;</span>
            <input
              type="text"
              value={product1}
              onChange={(e) => setProduct1(e.target.value)}
            />
          </div>

          <div className="delme-btn-wrap">
            <div className="delme_btn" onClick={typeTotalInsert}>
              등록
            </div>
          </div>
        </div>

        <div className="section delme">
          <div className="section_title delme">
            [ 검진항목(product_detail) ]
          </div>
          <div>
            <span>d_key: &nbsp;</span>
            <input
              type="text"
              value={detailPKey}
              onChange={(e) => setDetailPKey(e.target.value)}
            />
          </div>
          <div className="delme-btn-wrap">
            <div className="delme_btn" onClick={productDetailInsert}>
              등록
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Delme;
