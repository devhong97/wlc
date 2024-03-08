import Axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const IdSearch = () => {
  const [name, setName] = useState("");
  const [companyType, setCompanyType] = useState(""); // 회사종류
  const [companyName, setCompanyName] = useState(""); // 회사명
  const [branch, setBranch] = useState(""); // 지점
  const [tel1, setTel1] = useState(""); // 연락처1
  const [tel2, setTel2] = useState(""); // 연락처2
  const [tel3, setTel3] = useState(""); // 연락처3
  const navigate = useNavigate();

  const totalPhone = `${tel1}-${tel2}-${tel3}`;

  //연락처 체크
  const handlePhone = (e, target) => {
    const value = e.target.value;
    if (target === "tel1" && value.length === 3) {
      document.getElementById("tel2").focus();
    } else if (target === "tel2" && value.length === 4) {
      document.getElementById("tel3").focus();
    } else if (target === "tel3" && value.length === 4) {
    }

    if (target === "tel1") {
      setTel1(value);
    } else if (target === "tel2") {
      setTel2(value);
    } else if (target === "tel3") {
      setTel3(value);
    }
  };

  const handleSearch = () => {
    if (name === "") {
      alert("이름을 입력해주세요.");
      const nameInput = document.getElementById("user_name");
      if (nameInput) {
        nameInput.focus();
      }
      return;
    } else if (companyType === "") {
      alert("분류1을 입력해주세요.");
      const companyTypeInput = document.getElementById("user_companyType");
      if (companyTypeInput) {
        companyTypeInput.focus();
      }
      return;
    } else if (companyName === "") {
      alert("분류2을 입력해주세요.");
      const companyNameInput = document.getElementById("user_companyName");
      if (companyNameInput) {
        companyNameInput.focus();
      }
      return;
    } else if (branch === "") {
      alert("지점을 입력해주세요.");
      const branchInput = document.getElementById("user_branch");
      if (branchInput) {
        branchInput.focus();
      }
      return;
    } else if (tel1 === "" || tel2 === "" || tel3 === "") {
      alert("연락처를 입력해주세요.");
      const phoneInput = document.getElementById("tel1");
      if (phoneInput) {
        phoneInput.focus();
      }
      return;
    }

    // id와 phone을 서버로 전송하는 요청
    Axios.post("http://localhost:3001/api/post/id_search", {
      name: name,
      companyType: companyType,
      companyName: companyName,
      branch: branch,
      phone: totalPhone,
    })
      .then((res) => {
        if (res.data.success === true) {
          const userId = res.data.data[0].id;
          alert(`${name}님의 ID는 [ ${userId} ]입니다.`);
          navigate("/");
        } else {
          alert("일치하는 정보가 없습니다.");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="register_container">
      <div className="input_row">
        <div className="input_title">이름</div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름을 입력하세요."
          id="user_name"
          className="register_input"
        />
      </div>

      <div className="input_row">
        <div className="input_title">분류1</div>
        <select
          value={companyType}
          onChange={(e) => setCompanyType(e.target.value)}
          id="user_companyType"
          className="register_select"
        >
          <option value="">회사종류 선택</option>
          <option value="보험사">보험사</option>
          <option value="상조">상조</option>
          <option value="무소속">무소속</option>
        </select>
      </div>
      <div className="input_row">
        <div className="input_title">분류2</div>
        <select
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          id="user_companyName"
          className="register_select"
        >
          <option value="">회사명 선택</option>
          <option value="기홍에셋">기홍에셋</option>
          <option value="기홍상조">기홍상조</option>
          <option value="무소속">무소속</option>
        </select>
      </div>
      <div className="input_row">
        <div className="input_title">지점</div>
        <select
          value={branch}
          onChange={(e) => setBranch(e.target.value)}
          id="user_branch"
          className="register_select"
        >
          <option value="">지점 선택</option>
          <option value="아산점">아산점</option>
          <option value="지점2">지점2</option>
          <option value="지점3">지점3</option>
        </select>
      </div>
      <div className="input_row">
        <div className="input_title">연락처</div>
        <input
          type="phone"
          value={tel1}
          onChange={(e) => handlePhone(e, "tel1")}
          id="tel1"
          maxlength="3"
          className="register_input phone"
        />
        <p className="phone_icon">-</p>
        <input
          type="phone"
          value={tel2}
          onChange={(e) => handlePhone(e, "tel2")}
          id="tel2"
          maxlength="4"
          className="register_input phone"
        />
        <p className="phone_icon">-</p>
        <input
          type="phone"
          value={tel3}
          onChange={(e) => handlePhone(e, "tel3")}
          id="tel3"
          maxlength="4"
          className="register_input phone"
        />
      </div>
      <div className="register_btn_box search">
        <button className="register_btn" onClick={() => handleSearch()}>
          찾기
        </button>
      </div>
    </div>
  );
};

export default IdSearch;
