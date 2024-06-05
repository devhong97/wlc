import Axios from "axios";
import React, { useEffect, useState } from "react";

const InspectionViewModal = (props) => {
  const [detailNum, setDetailNum] = useState("");
  const [isChecked, setIsChecked] = useState(false); // 예약유무체크
  const [memo, setMemo] = useState(""); // 비고
  const [uid, setUid] = useState("");
  const [contractStatus, setContractStatus] = useState(""); // 계약 상태

  useEffect(() => {
    if (props.detailIdx) {
      setDetailNum(props.detailIdx);
      setIsChecked(props.detailIdx);
      setMemo(props.detailIdx.memo);

      // 선택된 게시글의 인덱스를 찾음
      const selectedIndex = props.arrayData.findIndex(
        (data) => data.idx === props.detailIdx.idx
      );

      const uidArray = props.arrayData.map((data) => data.uid);
      setUid(uidArray[selectedIndex]);
      setContractStatus(props.detailIdx.hope_status); // 초기 계약 상태 설정
      getDetail();
    }
  }, [props.detailIdx]);

  const saveContractStatus = async (newStatus) => {
    try {
      const response = await Axios.post(
        "http://localhost:3001/api/post/inspect_status",
        {
          idx: detailNum.idx,
          contract: newStatus,
        }
      );
      console.log(response.data);
      setContractStatus(newStatus); // 상태 업데이트
    } catch (error) {
      console.error("Error saving contract status", error);
    }
  };

  const handleContractChange = (e) => {
    const newStatus = e.target.value;
    if (
      window.confirm(`[${detailNum.name}]님의 계약상태를 변경하시겠습니까?`)
    ) {
      saveContractStatus(newStatus);
    }
  };

  const clearModal = () => {
    props.closeModal();
  };

  const getDetail = () => {
    // detailNum 사용하여 상세 api 호출
  };

  return (
    <div className="modal_wrap">
      <div className="modal_back">
        <div className="modal_box">
          <div className="modal_title_box">
            <div className="modal_title">보험점검 예약관리 상세</div>
            <div className="modal_close_btn" onClick={clearModal}>
              X
            </div>
          </div>
          <div className="table_box">
            <div className="table_row">
              <div className="table_section half">
                <div className="table_title">예약자성명</div>
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
                <div className="table_title">예약자 연락처</div>
                <div className="table_contents w100">{detailNum.phone}</div>
              </div>
              <div className="table_section half">
                <div className="table_title">검진자 연락처</div>
                <div className="table_contents w100">{detailNum.phone_2}</div>
              </div>
            </div>
            <div className="table_row">
              <div className="table_section">
                <div className="table_title">검진자 주소</div>
                <div className="table_contents w100">{detailNum.address}</div>
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
                  <div className="table_radio">
                    <input
                      type="radio"
                      value="Y"
                      checked={contractStatus === "Y"}
                      onChange={handleContractChange}
                    />{" "}
                    Y
                  </div>
                  <div className="table_radio">
                    <input
                      type="radio"
                      value="N"
                      checked={contractStatus === "N"}
                      onChange={handleContractChange}
                    />{" "}
                    N
                  </div>
                </div>
              </div>
            </div>
            <div className="table_row">
              <div className="table_section half">
                <div className="table_title">상담희망일자</div>
                <div className="table_contents w100">
                  {detailNum.consulting_date}
                </div>
              </div>
              <div className="table_section half">
                <div className="table_title">상담희망시간</div>
                <div className="table_contents w100">
                  {detailNum.consulting_time}
                </div>
              </div>
            </div>
            <div className="table_row">
              <div className="table_section half">
                <div className="table_title">보험점검장소</div>
                <div className="table_contents w100">
                  {detailNum.consulting_location}
                </div>
              </div>
            </div>
            <div className="table_row">
              <div className="table_section">
                <div className="table_title image">비고</div>
                <div className="table_contents w100">
                  <textarea
                    className="table_textarea"
                    type="text"
                    id="title"
                    style={{ backgroundColor: "#f2f2f2" }}
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    readOnly
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          <div className="modal_footer_box">
            <div className="modal_btn close" onClick={clearModal}>
              닫기
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspectionViewModal;
