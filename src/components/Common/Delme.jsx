import Axios from "axios";
import React, { useState } from "react";

const Delme = () => {
  const [branchType, setBranchType] = useState("");
  const [companyName, setCompanyName] = useState("");

  // 델미텐츠 지점등록
  const typeTotalInsert = async () => {
    try {
      const confirmResult = window.confirm("지점을 등록하시겠습니까?");
      if (confirmResult) {
        await Axios.post("http://49.50.174.248:3001/api/post/type_total", {
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

  return (
    <div className="main_wrap">
      <div className="main_back">
        <div>[ type_total 테이블 ]</div>
        <div>
          1. branch_type(지점종류)
          <br />
          2. company_name(회사명) 등록
        </div>
        <br />
        <div>
          지점종류: &nbsp;
          <input
            type="text"
            value={branchType}
            onChange={(e) => setBranchType(e.target.value)}
          />
        </div>
        <br />
        <div>
          회사명: &nbsp;
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>
        <br />
        <div onClick={typeTotalInsert}>등록(버튼임)</div>
      </div>
    </div>
  );
};

export default Delme;
