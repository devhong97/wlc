import React, { useState } from "react";
import PwSearch from "./PwSearch";
import IdSearch from "./IdSearch";

const Search = () => {
  const [tab, setTab] = useState(1);

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
        {tab === 2 && <PwSearch></PwSearch>}
      </div>
    </div>
  );
};

export default Search;
