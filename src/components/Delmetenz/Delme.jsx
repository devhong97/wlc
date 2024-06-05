import Axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import "./Delme.css"; // CSS 파일 import
/* eslint-disable-next-line */
import { Editor } from "@toast-ui/react-editor";
import "@toast-ui/editor/dist/toastui-editor.css";
import colorSyntax from "@toast-ui/editor-plugin-color-syntax";
import "tui-color-picker/dist/tui-color-picker.css";
import "@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css";

const Delme = () => {
  const [branchType, setBranchType] = useState("");
  const [companyName, setCompanyName] = useState("");

  //product_category
  const [pKey, setPKey] = useState("");
  const [cKey, setCKey] = useState("");
  const [type, setType] = useState("");
  const [product1, setProduct1] = useState("");
  const [ogPrice, setOgPrice] = useState("");
  const [priceTxt, setPriceTxt] = useState("");
  const [cost, setCost] = useState("");

  const [content, setContent] = useState(""); // 게시글
  const [content2, setContent2] = useState(""); // 게시글
  const [detailPKey, setDetailPKey] = useState("");
  const editorRef1 = useRef(null);
  const editorRef2 = useRef(null);

  useEffect(() => {
    fetchTermsData();
  }, []);

  const fetchTermsData = async () => {
    try {
      const response = await Axios.get(
        "http://localhost:3001/api/get/terms_data"
      );
      const termsData = response.data.terms_info; // 서버에서 받은 데이터
      const mTermsData = response.data.marketing;
      setContent(termsData); // content를 가져와서 setContent에 전달
      setContent2(mTermsData);
      editorRef1.current.getInstance().setHTML(termsData);
      editorRef2.current.getInstance().setHTML(mTermsData);
    } catch (error) {
      console.error("데이터 가져오기 중 오류 발생", error);
    }
  };

  //Editor 파일 업로드 관련 함수
  const onUploadImage = async (blob, callback) => {
    try {
      const formData = new FormData();
      formData.append("image", blob);

      // 서버의 엔드포인트 URL을 올바르게 수정해야 합니다.
      const response = await Axios.post(
        "http://localhost:3001/api/post/upload", // 서버 엔드포인트 경로를 확인하세요
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // 업로드된 이미지의 URL을 받아와서 callback 함수에 전달합니다.
      const imageUrl = response.data.imageUrl;
      console.log("Uploaded image URL:", imageUrl); // 이미지 URL 콘솔에 출력
      callback(imageUrl, "alt text");
    } catch (error) {
      console.error("이미지 업로드 중 오류 발생", error);
    }
  };

  //내용 체크
  const handleContent = () => {
    const editorInstance = editorRef1.current.getInstance();
    const htmlContent = editorInstance.getHTML();
    setContent(htmlContent);
  };

  //내용 체크
  const handleContent2 = () => {
    const editorInstance = editorRef2.current.getInstance();
    const htmlContent = editorInstance.getHTML();
    setContent2(htmlContent);
  };

  // 델미텐츠 지점등록
  const typeTotalInsert = async () => {
    try {
      const confirmResult = window.confirm("지점을 등록하시겠습니까?");
      if (confirmResult) {
        await Axios.post("http://localhost:3001/api/post/d_type_total", {
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
        await Axios.post("http://localhost:3001/api/post/d_product_category", {
          p_key: pKey,
          c_key: cKey,
          type: type,
          product_1: product1,
          og_price: ogPrice,
          priceTxt: priceTxt,
          cost: cost,
        });
        alert("카테고리등록 완료.");
        setPKey("");
        setCKey("");
        setType("");
        setProduct1("");
        setOgPrice("");
        setPriceTxt("");
        setCost("");
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

  // 개인정보약관동의 내용
  const termsInsert = async () => {
    try {
      const confirmResult = window.confirm("수정완료 하시겠습니까?");
      if (confirmResult) {
        await Axios.post("http://localhost:3001/api/post/terms_text", {
          content: content, // content 변수명 수정
        });
        alert("개인정보약관동의 내용 수정완료.");
      }
    } catch (err) {
      console.log(err);
    }
  };

  // 마케팅약관동의 내용
  const marketingInsert = async () => {
    try {
      const confirmResult = window.confirm("수정완료 등록하시겠습니까?");
      if (confirmResult) {
        await Axios.post("http://localhost:3001/api/post/marketing_text", {
          content2: content2, // content2 변수명 수정
        });
        alert("마케팅약관동의 내용 수정완료.");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="main_wrap delme">
      <div className="main_back delme">
        <div className="section delme">
          <div className="section_title delme">
            <p className="dep1">[ 지점등록 ]</p>
            <p className="dep2">[ type_total ]</p>
          </div>
          <div class="input-container">
            <span class="label">지점종류: &nbsp;</span>
            <input
              type="text"
              value={branchType}
              onChange={(e) => setBranchType(e.target.value)}
              class="input-field"
            />
          </div>
          <div class="input-container">
            <span class="label">회사명: &nbsp;</span>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              class="input-field"
            />
          </div>
          <div class="delme-btn-wrap">
            <div class="delme_btn" onClick={typeTotalInsert}>
              등록
            </div>
          </div>
        </div>

        <div className="section delme">
          <div className="section_title delme">
            <p className="dep1">[ 상품카테고리 ]</p>
            <p className="dep2">[ product_category ]</p>
          </div>
          <div class="input-container">
            <span class="label">p_key: &nbsp;</span>
            <input
              type="text"
              value={pKey}
              onChange={(e) => setPKey(e.target.value)}
              class="input-field"
            />
          </div>
          <div class="input-container">
            <span class="label">c_key: &nbsp;</span>
            <input
              type="text"
              value={cKey}
              onChange={(e) => setCKey(e.target.value)}
              class="input-field"
            />
          </div>
          <div class="input-container">
            <span class="label">타입: &nbsp;</span>
            <input
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              class="input-field"
            />
          </div>
          <div class="input-container">
            <span class="label">상품명1: &nbsp;</span>
            <input
              type="text"
              value={product1}
              onChange={(e) => setProduct1(e.target.value)}
              class="input-field"
            />
          </div>
          <div class="input-container">
            <span class="label">의료수가: &nbsp;</span>
            <input
              type="text"
              value={ogPrice}
              onChange={(e) => setOgPrice(e.target.value)}
              class="input-field"
            />
          </div>
          <div class="input-container">
            <span class="label">검진비용: &nbsp;</span>
            <input
              type="text"
              value={priceTxt}
              onChange={(e) => setPriceTxt(e.target.value)}
              class="input-field"
            />
          </div>
          <div class="input-container">
            <span class="label">원가: &nbsp;</span>
            <input
              type="text"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              class="input-field"
            />
          </div>
          <div className="delme-btn-wrap">
            <div className="delme_btn" onClick={productCategoryInsert}>
              등록
            </div>
          </div>
        </div>

        <div className="section delme">
          <div className="section_title delme">
            <p className="dep1">[ 검진항목 ]</p>
            <p className="dep2">[ product_detail ]</p>
          </div>
          <div class="input-container">
            <span class="label">d_key: &nbsp;</span>
            <input
              type="text"
              value={detailPKey}
              onChange={(e) => setDetailPKey(e.target.value)}
              class="input-field"
            />
          </div>
          <div className="delme-btn-wrap">
            <div className="delme_btn" onClick={productDetailInsert}>
              등록
            </div>
          </div>
        </div>

        <div className="section delme">
          <div className="section_title delme">
            <p>[ 개인정보약관동의 내용 ]</p>
          </div>
          <div style={{ textAlign: "left" }}>
            <Editor
              initialValue={content} // content를 Editor의 초기값으로 사용;
              height="300px"
              initialEditType="wysiwyg"
              plugins={[colorSyntax]}
              placeholder="내용을 입력하세요"
              ref={editorRef1}
              hooks={{
                addImageBlobHook: onUploadImage,
              }}
              onChange={handleContent} // value가 아니라 함수 자체를 전달
              id="content"
            ></Editor>
          </div>
          <div className="delme-btn-wrap">
            <div className="delme_btn" onClick={termsInsert}>
              등록
            </div>
          </div>
        </div>
        <div className="section delme">
          <div className="section_title delme">
            <p>[ 마케팅약관동의 내용 ]</p>
          </div>
          <div style={{ textAlign: "left" }}>
            <Editor
              initialValue={content2} // content를 Editor의 초기값으로 사용;
              height="300px"
              initialEditType="wysiwyg"
              plugins={[colorSyntax]}
              placeholder="내용을 입력하세요"
              ref={editorRef2}
              hooks={{
                addImageBlobHook: onUploadImage,
              }}
              onChange={handleContent2} // value가 아니라 함수 자체를 전달
              id="content"
            ></Editor>
          </div>
          <div className="delme-btn-wrap">
            <div className="delme_btn" onClick={marketingInsert}>
              등록
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Delme;
