import Axios from "axios";
import React, { useEffect, useState } from "react";

const SalesViewModal = (props) => {
  const [detailNum, setDetailNum] = useState("");
  const [isChecked, setIsChecked] = useState(false); // 계약유무체크
  const [memo, setMemo] = useState(""); //비고

  useEffect(() => {
    if (props.detailIdx) {
      setDetailNum(props.detailIdx);
      setIsChecked(props.detailIdx.contract === "Y");
      setMemo(props.detailIdx.memo);
      getDetail();
    }
  }, [props.detailIdx, detailNum]);

  const handleCheckboxChange = () => {
    const contractStatus = isChecked ? "무" : "유";

    const confirmation = window.confirm(
      `계약 상태를 "${contractStatus}"(으)로 변경하시겠습니까?`
    );
    if (confirmation) {
      setIsChecked(!isChecked);
      updateContractStatus(contractStatus);
      alert("계약상태가 변경되었습니다.");
    } else {
      console.log("변경이 취소되었습니다.");
    }
  };

  const updateContractStatus = (status) => {
    Axios.post("http://localhost:3001/api/post/updateContract", {
      detailIdx: detailNum.idx,
      status: status === "유" ? "Y" : "N",
      memo: memo,
    })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleMemoUpdate = () => {
    Axios.post("http://localhost:3001/api/post/updateMemo", {
      detailIdx: detailNum.idx,
      memo: memo,
    })
      .then((res) => {
        console.log(res);
        alert("메모가 업데이트되었습니다.");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const clearModal = () => {
    props.closeModal();
  };

  const getDetail = () => {
    //detailNum 사용하여 상세 api 호출
  };

  const handleSubmit = () => {};
  return (
    <div className="modal_wrap">
      <div className="modal_back">
        <div className="modal_box">
          <div className="modal_title_box">
            <div className="modal_title">실적관리 상세</div>
            <div className="modal_close_btn" onClick={() => clearModal()}>
              X
            </div>
          </div>
          <div className="table_box">
            <div className="table_row">
              <div className="table_section half">
                <div className="table_title">
                  계약자성명<p className="title_point">*</p>
                </div>
                <div className="table_contents w100">
                  {detailNum.contractor_name}
                </div>
              </div>
              <div className="table_section half">
                <div className="table_title">검진자성명</div>
                <div className="table_contents w100">{detailNum.name}</div>
              </div>
            </div>
            <div className="table_row">
              <div className="table_section half">
                <div className="table_title">
                  계약자 연락처<p className="title_point">*</p>
                </div>
                <div className="table_contents w100">{detailNum.phone}</div>
              </div>
              <div className="table_section half">
                <div className="table_title">검진자 연락처</div>
                <div className="table_contents w100">{detailNum.phone}</div>
              </div>
            </div>

            <div className="table_row">
              <div className="table_section half">
                <div className="table_title">가입일</div>
                <div className="table_contents w100">{detailNum.date}</div>
              </div>
              <div className="table_section half">
                <div className="table_title">선택상품</div>
                <div className="table_contents w100">{detailNum.product}</div>
              </div>
            </div>

            <div className="table_row">
              <div className="table_section half">
                <div className="table_title">검진병원</div>
                <div className="table_contents w100">{detailNum.hospital}</div>
              </div>
              <div className="table_section half">
                <div className="table_title">검진일</div>
                <div className="table_contents w100">
                  {detailNum.result_date}
                </div>
              </div>
            </div>
            <div className="table_row">
              <div className="table_section half">
                <div className="table_title">상담희망</div>
                <div className="table_contents w100">
                  {detailNum.hope_status}
                </div>
              </div>
              <div className="table_section half">
                <div className="table_title">계약</div>
                <div className="table_contents w100">
                  <input
                    className="chk_input checkx"
                    type="checkbox"
                    id="contractCheckbox"
                    checked={isChecked}
                    onChange={handleCheckboxChange}
                  />
                  <label className="sla" htmlFor="contractCheckbox">
                    유
                  </label>
                  <input
                    className="chk_input checkx"
                    type="checkbox"
                    id="noContractCheckbox"
                    checked={!isChecked}
                    onChange={handleCheckboxChange}
                  />
                  <label className="sla" htmlFor="noContractCheckbox">
                    무
                  </label>
                </div>
              </div>
            </div>
            <div className="table_row">
              <div className="table_section">
                <div className="table_title">비고</div>
                <div className="table_contents w100">
                  <textarea
                    className="table_textarea"
                    type="text"
                    id="title"
                    placeholder="메모를 입력해주세요."
                    style={{ backgroundColor: "#f2f2f2" }}
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                  ></textarea>
                  <div className="update_button" onClick={handleMemoUpdate}>
                    수정
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesViewModal;
