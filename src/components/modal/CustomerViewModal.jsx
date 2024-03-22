import React, { useEffect, useState } from "react";
import Axios from "axios";
import moment from "moment";
const CustomerViewModal = (props) => {
  const [memberData, setMemberData] = useState([]);
  const [detailNum, setDetailNum] = useState("");
  const [inspectionStatus, setInspectionStatus] = useState("N");
  const [hopeStatus, setHopeStatus] = useState("N");
  const [payStatus, setPayStatus] = useState("N");
  // const [c_name, setCName] = useState(""); //계약자 이름
  // const [name, setName] = useState(""); //검진자 이름
  const [phone, setPhone] = useState(""); // 연락처
  // const [date, setDate] = useState("");//가입일
  const [hope_date_1, setHopeDate1] = useState("");//희망일1
  const [hope_date_2, setHopeDate2] = useState("");//희망일2
  const [product, setProduct] = useState("");//상품명
  const [hospital, setHospital] = useState("");//병원명
  const [result_date, setResultDate] = useState("");//검진확정일
  const [memo, setMemo] = useState("");//비고
  const [manager, setManager] = useState("");//영업자 이름
  const [branch, setBranch] = useState("");//지점 이름
  useEffect(() => {
    if (props.detailIdx) {
      console.log(props.detailIdx);
      setDetailNum(props.detailIdx);
      getDetail();
    }
  }, [props.detailIdx]);

  useEffect(() => {
    setDetailValue();
  }, [memberData]);

  const clearModal = () => {
    props.closeModal();
  };
  const getDetail = async () => {
    try {
      const response = await Axios.get(
        "http://localhost:3001/api/get/customer_detail",
        {
          params: {
            idx: props.detailIdx,
          },
        }
      );
      const allData = response.data;
      setMemberData(allData[0]);
      setDetailValue();
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };

  const setDetailValue = () => {
    // setCName(memberData.contractor_name);
    // setName(memberData.name);
    setPhone(memberData.phone);
    // setDate(memberData.date);
    setHopeDate1(memberData.hope_date_1);
    setHopeDate2(memberData.hope_date_2);
    setProduct(memberData.product);
    setHospital(memberData.hospital);
    setResultDate(memberData.result_date);
    setMemo(memberData.memo);
    setManager(memberData.manager);
    setBranch(memberData.branch);
    setInspectionStatus(memberData.status);
    setHopeStatus(memberData.hope_status);
    setPayStatus(memberData.pay_status);
  };

  const handleSubmit = () => { };
  const handleRadioChange = (event) => {
    setInspectionStatus(event.target.value);
  };
  return (
    <div className="modal_wrap">
      <div className="modal_back">
        <div className="modal_box">
          <div className="modal_title_box">
            <div className="modal_title">고객 상세</div>
            <div className="modal_close_btn" onClick={() => clearModal()}>
              X
            </div>
          </div>
          <div className="table_box">
            <div className="table_row">
              <div className="table_section half">
                <div className="table_title">검진자</div>
                <div className="table_contents w100">
                  <div className="table_inner_text">{memberData.name}</div>
                </div>
              </div>
              <div className="table_section half">
                <div className="table_title">계약자</div>
                <div className="table_contents w100">
                  <div className="table_inner_text">{memberData.contractor_name}</div>
                </div>
              </div>
            </div>
            <div className="table_row">
              <div className="table_section half">
                <div className="table_title">가입일</div>
                <div className="table_contents w100">
                  <div className="table_inner_text">{moment(memberData.date).format("YYYY-MM-DD")}</div>
                </div>
              </div>
              <div className="table_section half">
                <div className="table_title">영업자</div>
                <div className="table_contents w100">
                  <div className="table_inner_text">{memberData.manager}</div>
                </div>
              </div>
            </div>
            <div className="table_row">
              <div className="table_section half">
                <div className="table_title">지점명</div>
                <div className="table_contents w100">
                  <div className="table_inner_text">{memberData.branch}</div>
                </div>
              </div>
              <div className="table_section half">
                <div className="table_title">영업자</div>
                <div className="table_contents w100">
                  <div className="table_inner_text">{memberData.manager}</div>
                </div>
              </div>
            </div>
            <div className="table_row">
              <div className="table_section half">
                <div className="table_title">상품명</div>
                <div className="table_contents w100">
                  <input
                    className="table_input modal"
                    type="text"
                    id="title"
                    placeholder="상품명을 입력해주세요."
                    value={product}
                  ></input>
                </div>
              </div>
              <div className="table_section half">
                <div className="table_title">병원</div>
                <div className="table_contents w100">
                  <input
                    className="table_input modal"
                    type="text"
                    id="title"
                    placeholder="병원명을 입력해주세요."
                    value={hospital}
                  ></input>
                </div>
              </div>
            </div>
            <div className="table_row">
              <div className="table_section half">
                <div className="table_title">희망일1</div>
                <div className="table_contents w100">
                  <input
                    className="table_input modal"
                    type="text"
                    id="title"
                    placeholder="희망일을 입력해주세요."
                    value={hope_date_1}
                    onChange={() => setHopeDate1()}
                  ></input>
                </div>
              </div>
              <div className="table_section half">
                <div className="table_title">희망일2</div>
                <div className="table_contents w100">
                  <input
                    className="table_input modal"
                    type="text"
                    id="title"
                    placeholder="희망일을 입력해주세요."
                    value={hope_date_2}
                    onChange={() => setHopeDate2()}
                  ></input>
                </div>
              </div>
            </div>
            <div className="table_row">
              <div className="table_section">
                <div className="table_title">검진확정일</div>
                <div className="table_contents w100">
                  <input
                    className="table_input modal"
                    type="text"
                    id="title"
                    placeholder="확정일 입력해주세요."
                    value={result_date}
                    onChange={() => setResultDate()}
                  ></input>
                </div>
              </div>
            </div>
            <div className="table_row">
              <div className="table_section triple">
                <div className="table_title">검진유무</div>
                <div className="table_contents w100">
                  <div className="table_radio">
                    <label>
                      <input
                        type="radio"
                        name="inspectionStatus"
                        value="y"
                        checked={inspectionStatus === "Y"}
                        onChange={(e) => setInspectionStatus(e.target.value)}
                      />
                      Yes
                    </label>
                  </div>
                  <div className="table_radio">
                    <label>
                      <input
                        type="radio"
                        name="inspectionStatus"
                        value="n"
                        checked={inspectionStatus === "N"}
                        onChange={(e) => setInspectionStatus(e.target.value)}
                      />
                      No
                    </label>
                  </div>
                </div>
              </div>
              <div className="table_section triple">
                <div className="table_title">상담희망</div>
                <div className="table_contents w100">
                  <div className="table_radio">
                    <label>
                      <input
                        type="radio"
                        name="hopeStatus"
                        value="y"
                        checked={hopeStatus === "Y"}
                        onChange={(e) => setHopeStatus(e.target.value)}
                      />
                      Yes
                    </label>
                  </div>
                  <div className="table_radio">
                    <label>
                      <input
                        type="radio"
                        name="hopeStatus"
                        value="n"
                        checked={hopeStatus === "N"}
                        onChange={(e) => setHopeStatus(e.target.value)}
                      />
                      No
                    </label>
                  </div>
                </div>
              </div>
              <div className="table_section triple">
                <div className="table_title">입금유무</div>
                <div className="table_contents w100">
                  <div className="table_radio">
                    <label>
                      <input
                        type="radio"
                        name="payStatus"
                        value="y"
                        checked={payStatus === "Y"}
                        onChange={(e) => setPayStatus(e.target.value)}
                      />
                      Yes
                    </label>
                  </div>
                  <div className="table_radio">
                    <label>
                      <input
                        type="radio"
                        name="payStatus"
                        value="n"
                        checked={payStatus === "N"}
                        onChange={(e) => setPayStatus(e.target.value)}
                      />
                      No
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="table_row">
              <div className="table_section">
                <div className="table_title image">비고</div>
                <div className="table_contents w100">
                  <textarea className="table_textarea" value={memo} onChange={(e) => setMemo(e.target.value)}></textarea>
                </div>
              </div>
            </div>
          </div>

          <div className="modal_footer_box">
            <div className="modal_btn" onClick={handleSubmit}>
              수정
            </div>
            <div className="modal_btn close" onClick={clearModal}>
              닫기
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerViewModal;
