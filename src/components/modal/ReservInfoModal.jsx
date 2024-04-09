import React from "react";
import { useAuth } from "../Context/AuthContext";
import { useReservContext } from "../Context/ReservContext";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import moment from "moment";
const ReservInfoModal = (props) => {
  const {
    customerData,
    product,
    hospitalIdx,
    hospitalOriginKey,
    hopeDate1,
    hopeDate2,
    uploadFiles,
  } = useReservContext();
  const { decodeS3, decodeS1 } = useAuth();
  const navigation = useNavigate();

  const submitHandle = async () => {
    let uid = decodeS1();
    let termsStatus = "N";
    if (customerData.m_terms === true) {
      termsStatus = "Y";
    }

    let sendParams = {
      contractor_name: customerData.name,
      name: customerData.customerName,
      number: customerData.customerNumber,
      phone: customerData.phone,
      c_phone: customerData.cPhone,
      p_key: product,
      h_key: hospitalOriginKey,
      hope_date_1: hopeDate1,
      hope_date_2: hopeDate2,
      marketing_terms: termsStatus,
      manager_uid: uid,
    };
    try {
      const response = await Axios.post(
        "http://localhost:3001/api/post/customer",
        sendParams
      );
      console.log(response.data);
      uploadFiles(response.data.data);
      // alert("등록이 완료되었습니다.");
      // navigation("/");
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };
  return (
    <div className="modal_wrap">
      <div className="modal_back">
        <div className="modal_box">
          <div style={{ textAlign: "center", padding: 20 }}>
            등록을 완료하시겠습니까?
          </div>
          <div className="modal_footer_box">
            <div className="modal_btn" onClick={() => submitHandle()}>
              완료
            </div>
            <div className="modal_btn close" onClick={props.closeModal}>
              취소
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservInfoModal;
