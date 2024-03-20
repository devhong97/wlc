import React, { useState } from "react";
import PwSearch from "./PwSearch";
import IdSearch from "./IdSearch";
import PwChangeModal from "../modal/PwChangeModal";

const Search = () => {
  const [tab, setTab] = useState(1);
  const [showPwChangeModal, setShowPwChangeModal] = useState(false); // 비밀번호 변경 모달 표시 여부
  const [userData, setUserData] = useState([]);
  // 페이지전환 시 사용(num값에 따라 페이지만 이동)
  const moveTab = (num) => {
    setTab(num);
  };
  return (
    <div className="register_wrap">
      <div className="register_back search">
        <div className="register_tab_area">
          <div
            className={`tab_menu ${tab === 1 && "active"}`}
            onClick={() => moveTab(1)}
          >
            아이디 찾기
          </div>
          <div
            className={`tab_menu ${tab === 2 && "active"}`}
            onClick={() => moveTab(2)}
          >
            비밀번호 찾기
          </div>
        </div>
        {tab === 1 && <IdSearch></IdSearch>}
        {tab === 2 && <PwSearch setShowPwChangeModal={setShowPwChangeModal} setUserData={setUserData}></PwSearch>}
      </div>
      {showPwChangeModal && <PwChangeModal userData={userData} closeModal={setShowPwChangeModal} />}
    </div>
  );
};

export default Search;
