import React, { useEffect, useState } from "react";
import TableDefault from "../Table/TableDefault";
import { useAuth } from "../Context/AuthContext";
import moment from "moment";
import Axios from "axios";
import MyPageViewModal from "../modal/MyPageViewModal";

const Mypage = () => {
  const { decodeS1 } = useAuth();
  const [detailIdx, setDetailIdx] = useState("");
  const [viewModal, setViewModal] = useState(false);
  const [myData, setMyData] = useState([]);

  console.log(decodeS1());
  useEffect(() => {
    getMyData();
  }, []); // 빈 배열 전달하여 한 번만 실행되도록 함

  const viewModalOpen = () => {};

  const dataViewModal = () => {
    setViewModal(!viewModal);
  };

  const closeModal = () => {
    setViewModal(false);
  };

  const getMyData = async () => {
    try {
      const response = await Axios.get("http://localhost:3001/api/get/mydata", {
        params: {
          uid: decodeS1(),
        },
      });
      const allData = response.data.data;
      console.log(allData);
      setMyData(allData);
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };

  const columns = [
    { field: "id", headerName: "아이디" },
    { field: "email", headerName: "이메일" },
    { field: "phone", headerName: "연락처" },
    { field: "branch", headerName: "소속지점" },
    { field: "bank", headerName: "은행" },
    { field: "deposit_account", headerName: "계좌번호" },
    { field: "date", headerName: "가입일" },
  ];

  const rows = myData.map((data, index) => ({
    id: data.id,
    email: data.email,
    phone: data.phone,
    branch: data.branch,
    bank: data.bank,
    depositAccount: data.deposit_account,
    date: moment(data.date).format("YYYY.MM.DD"),
    idx: data.idx,
  }));

  return (
    <div className="main_wrap">
      <div className="main_back">
        <div className="main_title_box">MyPage</div>
        <div className="board_list_wrap">
          <div className="list_area">
            <div className="search_box">
              <div className="title_btn" onClick={() => dataViewModal()}>
                수정
              </div>
            </div>
            <TableDefault
              rows={rows}
              columns={columns}
              viewModalOpen={viewModalOpen}
            />
          </div>
        </div>
        {viewModal && (
          <MyPageViewModal
            closeModal={closeModal}
            detailIdx={detailIdx}
          ></MyPageViewModal>
        )}
      </div>
    </div>
  );
};

export default Mypage;
