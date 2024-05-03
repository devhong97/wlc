import Axios from "axios";
import React, { useState } from "react";

const LinkPhoneModal = (props) => {
  const [tel1, setTel1] = useState(""); // 연락처1
  const [tel2, setTel2] = useState(""); // 연락처2
  const [tel3, setTel3] = useState(""); // 연락처3
  const [link, setLink] = useState(props.link); // 생성된링크

  const searchBoard = async () => {
    try {
      const response = await Axios.post(
        "https://www.wlcare.co.kr:8443/api/post/link_sms",
        {
          phone: tel1 + tel2 + tel3,
          link: link,
        }
      );
      const searchData = response.data;
      if (searchData.success) {
        // 전송 성공 시 입력 필드 초기화
        setTel1("");
        setTel2("");
        setTel3("");
        alert(`[${tel1}-${tel2}-${tel3}] 링크 전송이 완료되었습니다.`);
      }
    } catch (error) {
      console.error("Error searching data:", error);
    }
  };

  const handleSearch = () => {
    searchBoard();
  };

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

  const clearModal = () => {
    props.closeModal();
    console.log("눌림");
  };

  return (
    <div className="modal_wrap">
      <div className="modal_back">
        <div className="modal_box">
          <div className="modal_title_box">
            <div className="modal_title">링크 전송하기</div>
            <div className="modal_close_btn" onClick={() => clearModal()}>
              X
            </div>
          </div>
          <div className="table_box">
            <div className="table_row">
              <div className="table_section">
                <div className="table_title">
                  연락처<p className="title_point">*</p>
                </div>
                <div className="table_contents w100">
                  <input
                    type="number"
                    value={tel1}
                    onChange={(e) => handlePhone(e, "tel1")}
                    id="tel"
                    maxLength="3"
                    className="table_input my_num"
                  />
                  &nbsp;-&nbsp;
                  <input
                    type="number"
                    value={tel2}
                    onChange={(e) => handlePhone(e, "tel2")}
                    id="tel2"
                    maxLength="4"
                    className="table_input my_num"
                  />
                  &nbsp;-&nbsp;
                  <input
                    type="number"
                    value={tel3}
                    onChange={(e) => handlePhone(e, "tel3")}
                    id="tel3"
                    maxLength="4"
                    className="table_input my_num"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="modal_footer_box">
            <div className="modal_btn" onClick={handleSearch}>
              전송
            </div>
            <div className="modal_btn close" onClick={() => clearModal()}>
              닫기
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkPhoneModal;
