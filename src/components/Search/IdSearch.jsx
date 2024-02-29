import React, { useState } from "react";

const IdSearch = () => {
  const [id, setId] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <div className="register_container">
      <div className="input_row">
        <div className="input_title">이름</div>
        <input type="text" value={id} placeholder="이름을 입력하세요." className="register_input" />
      </div>

      <div className="input_row">
        <div className="input_title">소속</div>
        <select
          name="affiliation"
          className="register_select"
        >
          <option value="">소속 선택</option>
          <option value="company">Company</option>
          <option value="school">School</option>
          <option value="organization">Organization</option>
        </select>
      </div>
      <div className="input_row">
        <div className="input_title">지점</div>
        <select
          name="affiliation"
          className="register_select"
        >
          <option value="">지점 선택</option>
          <option value="company">Company</option>
          <option value="school">School</option>
          <option value="organization">Organization</option>
        </select>
      </div>
      <div className="input_row">
        <div className="input_title">번호</div>
        <input
          value={phone}
          placeholder="번호를 입력해주세요."
          className="register_input"
        />
      </div>
      <div className="register_btn_box search">
        <button className="register_btn">찾기</button>
      </div>
    </div>


  );
};

export default IdSearch;
