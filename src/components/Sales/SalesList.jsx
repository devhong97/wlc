import React, { useEffect, useState } from "react";
import SalesViewModal from "../modal/SalesViewModal";

const SalesList = () => {
  const [viewModal, setViewModal] = useState(false);
  const [detailIdx, setDetailIdx] = useState("");
  const viewModalOpen = (idx) => {
    setViewModal(!viewModal);
    setDetailIdx(idx);
  };
  return (
    <div className="main_wrap">
      <div className="main_back">
        <div className="main_title_box">매출 관리</div>

      </div>
      {viewModal && (
        <SalesViewModal
          closeModal={viewModalOpen}
          detailIdx={detailIdx}
        ></SalesViewModal>
      )}
    </div>
  );
};

export default SalesList;
