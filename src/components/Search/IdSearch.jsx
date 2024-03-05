import Axios from "axios";
import React, { useState } from "react";

const IdSearch = () => {
  const [id, setId] = useState("");
  const [phone, setPhone] = useState("");

  const handleSearch = () => {
    // id와 phone을 서버로 전송하는 요청
    Axios.post("http://localhost:3001/api/post/id_search", {
      id: id,
      phone: phone,
    })
      .then((res) => {
        console.log(res.data); // 서버에서 받은 응답 데이터 처리
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
          value={id}
          onChange={(e) => setId(e.target.value)}
          placeholder="이름을 입력하세요."
          className="register_input"
        />
      </div>

      <div className="input_row">
        <div className="input_title">분류1</div>
        <select name="affiliation" className="register_select">
          <option value="">분류1 선택</option>
          <option value="분류1-1">분류1-1</option>
          <option value="분류1-2">분류1-2</option>
          <option value="분류1-3">분류1-3</option>
        </select>
      </div>
      <div className="input_row">
        <div className="input_title">분류2</div>
        <select name="affiliation" className="register_select">
          <option value="">분류2 선택</option>
          <option value="분류2-1">분류2-1</option>
          <option value="분류2-2">분류2-2</option>
          <option value="분류2-3">분류2-3</option>
        </select>
      </div>
      <div className="input_row">
        <div className="input_title">지점</div>
        <select name="affiliation" className="register_select">
          <option value="">지점 선택</option>
          <option value="지점1">지점1</option>
          <option value="지점2">지점2</option>
          <option value="지점3">지점3</option>
        </select>
      </div>
      <div className="input_row">
        <div className="input_title">번호</div>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="번호를 입력해주세요."
          className="register_input"
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
