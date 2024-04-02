import React from "react";
import TableDefault from "../Table/TableDefault";
import { useAuth } from "../Context/AuthContext";

const Mypage = () => {
  const { decodeS4 } = useAuth();
  return (
    <div className="main_wrap">
      <div className="main_back">
        <div className="main_title_box">MyPage</div>
        <div className="board_list_wrap">
          <div className="list_area">
            {/* <TableDefault
              rows={hospitalList}
              columns={columns}
              viewModalOpen={viewModalOpen}
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mypage;
