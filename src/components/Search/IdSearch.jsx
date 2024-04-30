import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBranchContext } from "../Context/BranchContext";

const IdSearch = () => {
  const {
    typeGroup,
    companyGroup,
    branchGroup,
    setContextType,
    setContextCompany,
  } = useBranchContext();

  const [name, setName] = useState(""); // 영업사원 이름
  const [tel1, setTel1] = useState(""); // 연락처1
  const [tel2, setTel2] = useState(""); // 연락처2
  const [tel3, setTel3] = useState(""); // 연락처3
  const [type, setType] = useState("");
  const [company, setCompany] = useState("");
  const [branchName, setBranchName] = useState("");
  const [branchIdx, setBranchIdx] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    setContextType(type);
  }, [type]);

  useEffect(() => {
    setContextCompany(company);
  }, [company]);

  const selectBranch = (num) => {
    setBranchIdx(num);
    const selectedBranch = branchGroup.find((data) => data.idx === Number(num));
    if (selectedBranch) {
      //console.log("선택된 지점:", selectedBranch);
      setBranchName(selectedBranch.branch_name);
    }
  };

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
    } else if (type === "") {
      alert("지점종류를 선택해주세요.");
      const typeInput = document.getElementById("user_branchType");
      if (typeInput) {
        typeInput.focus();
      }
      return;
    } else if (company === "") {
      alert("회사명을 선택해주세요.");
      const companyInput = document.getElementById("user_companyName");
      if (companyInput) {
        companyInput.focus();
      }
      return;
    } else if (branchName === "") {
      alert("지점명을 선택해주세요.");
      const branchNameInput = document.getElementById("user_branch");
      if (branchNameInput) {
        branchNameInput.focus();
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
    Axios.post("http://118.67.134.86:3001/api/post/id_search", {
      name: name,
      branchType: type,
      companyName: company,
      branchName: branchName,
      phone: totalPhone,
    })
      .then((res) => {
        // console.log("서버로 전송된 데이터:", {
        //   name: name,
        //   branchType: type,
        //   companyName: company,
        //   branchName: branchName,
        //   phone: totalPhone,
        // });

        if (res.data.success === true) {
          const userId = res.data.data[0].id;
          alert(`${name}님의 ID는 [ ${userId} ]입니다.`);
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
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="성명을 입력하세요."
          id="user_name"
          className="search_input"
        />
      </div>

      <div className="input_row">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          id="user_branchType"
          className="search_select"
        >
          <option value="">지점종류 선택</option>
          {typeGroup.map((type, index) => {
            return (
              <option key={index} value={type}>
                {type}
              </option>
            );
          })}
        </select>
      </div>
      <div className="input_row">
        <select
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          id="user_compnayName"
          className="search_select"
        >
          <option value="">회사명 선택</option>
          {companyGroup.map((type, index) => {
            return (
              <option key={index} value={type}>
                {type}
              </option>
            );
          })}
        </select>
      </div>
      <div className="input_row">
        <select
          value={branchIdx}
          onChange={(e) => selectBranch(e.target.value)}
          id="user_branch"
          className="search_select"
        >
          <option value="">지점명 선택</option>
          {branchGroup.map((data, index) => {
            return (
              <option key={index} value={data.idx}>
                {data.branch_name}
              </option>
            );
          })}
        </select>
      </div>
      <div className="input_row">
        <input
          type="number"
          value={tel1}
          onChange={(e) => handlePhone(e, "tel1")}
          id="tel1"
          maxlength="3"
          className="search_input phone"
          placeholder="010"
        />
        <p className="phone_icon">-</p>
        <input
          type="number"
          value={tel2}
          onChange={(e) => handlePhone(e, "tel2")}
          id="tel2"
          maxlength="4"
          className="search_input phone"
          placeholder="1234"
        />
        <p className="phone_icon">-</p>
        <input
          type="number"
          value={tel3}
          onChange={(e) => handlePhone(e, "tel3")}
          id="tel3"
          maxlength="4"
          className="search_input phone"
          placeholder="1234"
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
