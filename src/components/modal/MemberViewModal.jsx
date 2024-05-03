import React, { Fragment, useEffect, useState } from "react";
import Axios from "axios";
import moment from "moment";
import { useBranchContext } from "../Context/BranchContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const MemberViewModal = (props) => {
  const { decodeS4 } = useAuth();
  const userGrade = decodeS4();
  const {
    typeGroup,
    companyGroup,
    branchGroup,
    setContextType,
    setContextCompany,
  } = useBranchContext();
  const [memberData, setMemberData] = useState([]);
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [tel1, setTel1] = useState(""); // 연락처1
  const [tel2, setTel2] = useState(""); // 연락처2
  const [tel3, setTel3] = useState(""); // 연락처3
  const [bank, setBank] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [type, setType] = useState("");
  const [company, setCompany] = useState("");
  const [branchName, setBranchName] = useState("");
  const [branchIdx, setBranchIdx] = useState("");
  const [customerNum, setCustomerNum] = useState(0);
  const [hopeNum, setHopeNum] = useState(0);
  const [contractNum, setContractNum] = useState(0);
  const [regexMessage, setRegexMessage] = useState(""); //비밀번호 유효성검사
  const navigation = useNavigate();

  useEffect(() => {
    if (props.detailIdx) {
      console.log(props.detailIdx);
      getDetail();
    } else {
      props.closeModal();
    }
  }, [props.detailIdx]);

  useEffect(() => {
    setContextType(type);
  }, [type]);

  useEffect(() => {
    setContextCompany(company);
  }, [company]);

  const selectBranch = (num) => {
    setBranchIdx(num);
    const selectedBranch = branchGroup.find((data) => data.branch_idx === num);
    if (selectedBranch) {
      setBranchName(selectedBranch.branch_name);
    }
  };

  useEffect(() => {
    if (memberData.phone) {
      const phoneNumber = memberData.phone;
      const cleanedPhoneNumber = phoneNumber.replace(/-/g, "");
      const tel1 = cleanedPhoneNumber.substring(0, 3);
      const tel2 = cleanedPhoneNumber.substring(3, 7);
      const tel3 = cleanedPhoneNumber.substring(7);
      setTel1(tel1);
      setTel2(tel2);
      setTel3(tel3);
    }
  }, [memberData]);

  //연락처 체크
  const handlePhone = (e, target) => {
    let value = e.target.value;

    // 숫자만 남기고 다른 문자는 제거
    value = value.replace(/\D/g, "");

    // 최대 길이를 초과하지 않도록 체크
    if (value.length > 4) {
      value = value.slice(0, 4);
    }

    if (target === "tel1" && value.length === 3) {
      document.getElementById("tel2").focus();
    } else if (target === "tel2" && value.length === 4) {
      document.getElementById("tel3").focus();
    }

    // 상태 업데이트
    if (target === "tel1") {
      setTel1(value);
    } else if (target === "tel2") {
      setTel2(value);
    } else if (target === "tel3") {
      setTel3(value);
    }
  };

  const selectType = (data) => {
    setType(data);
    //지점명 초기화
    setCompany("");
    setBranchIdx("");
    setBranchName("");
  };

  useEffect(() => {
    setDetailValue();
  }, [memberData]);

  const clearModal = () => {
    props.closeModal();
  };

  const getDetail = async () => {
    try {
      const response = await Axios.get(
        "https://www.wlcare.co.kr:8443/api/get/member_detail",
        {
          params: {
            idx: props.detailIdx.idx,
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
    setEmail(memberData.email);
    setPhone(memberData.phone);
    setBank(memberData.bank);
    setBankAccount(memberData.deposit_account);
    setType(memberData.branch_type);
    setCompany(memberData.company_name);
    setBranchName(memberData.branch);
    setBranchIdx(memberData.branch_idx);
    setCustomerNum(
      memberData.customer_list ? memberData.customer_list.length : 0
    );
    setHopeNum(memberData.hope_list ? memberData.hope_list.length : 0);
    setContractNum(
      memberData.contract_list ? memberData.contract_list.length : 0
    );
  };

  // 비밀번호 체크
  const handlePw = (e) => {
    const password = e.target.value;
    setPassword(password);

    // 비밀번호 유효성검사[대문자, 소문자, 숫자, 특수문자 모두포함 8글자 이상]
    const Regex = new RegExp(
      "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
    );
    if (!Regex.test(password)) {
      setRegexMessage(false); // 조건과 불일치 시 false
    } else {
      setRegexMessage(true); // 조건과 일치할 시 true
    }
  };

  const handleUpdate = async () => {
    if (
      !tel1 ||
      !tel2 ||
      !tel3 ||
      !type ||
      !company ||
      !branchName ||
      !branchIdx
    ) {
      alert("필수 사항을 모두 입력해주세요");
      return;
    }
    // 비밀번호 유효성검사 추가
    if (!regexMessage && password !== "") {
      alert("비밀번호를 유효한 형식으로 입력해주세요.");
      return;
    }
    const phoneNumber = `${tel1}-${tel2}-${tel3}`;
    const paramsArray = {
      email: email,
      phone: phoneNumber,
      bank: bank,
      deposit_account: bankAccount,
      branch_type: type,
      company_name: company,
      branch: branchName,
      branch_idx: branchIdx,
      idx: props.detailIdx.idx,
    };

    // 비밀번호 수정 시에 params에 추가
    if (password !== "") {
      paramsArray.password = password;
    }

    try {
      const response = await Axios.post(
        "https://www.wlcare.co.kr:8443/api/post/member_edit",
        paramsArray
      );
      alert("정보수정이 완료되었습니다.");
      console.log(response.data);
      props.closeModal();
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  const deleteMember = async () => {
    try {
      const response = await Axios.post(
        "https://www.wlcare.co.kr:8443/api/post/member_delete",
        {
          idx: props.detailIdx.idx,
        }
      );
      alert("삭제되었습니다.");
      props.closeModal("reload");
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };

  const checkGrade = (data) => {
    switch (data) {
      case 1:
        return "슈퍼관리자";
      case 2:
        return "지점관리자";
      case 3:
        return "영업사원";
      default:
        return "";
    }
  };

  const handleStatus = async (num) => {
    try {
      const response = await Axios.post(
        "https://www.wlcare.co.kr:8443/api/post/member_status",
        {
          status: num,
          idx: props.detailIdx.idx,
        }
      );

      console.log(response.data);
      props.closeModal("reload");
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  const moveCustomer = (num) => {
    let defaultSelect = {};
    if (num === 1) {
      //가입고객수
      defaultSelect.manager = memberData.name;
    } else {
      //상담희망고객
      defaultSelect.manager = memberData.name;
      defaultSelect.hope = "Y";
    }
    navigation("/customer", {
      state: { grade: userGrade, defaultSelect: defaultSelect },
    });
  };

  let jsxContent;

  switch (decodeS4()) {
    case "슈퍼관리자":
      jsxContent = (
        <div className="modal_wrap">
          <div className="modal_back">
            <div className="modal_box">
              <div className="modal_title_box">
                <div className="modal_title">직원 상세</div>
                <div className="modal_close_btn" onClick={() => clearModal()}>
                  X
                </div>
              </div>
              <div className="table_box">
                <div className="table_row">
                  <div className="table_section">
                    <div className="table_title">가입일</div>
                    <div className="table_contents w100">
                      <div className="table_inner_text">{memberData.date}</div>
                    </div>
                  </div>
                </div>
                <div className="table_row">
                  <div className="table_section">
                    <div className="table_title">직급</div>
                    <div className="table_contents w100">
                      <div className="table_inner_text">
                        {checkGrade(memberData.grade)}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="table_row">
                  <div className="table_section">
                    <div className="table_title">아이디</div>
                    <div className="table_contents w100">
                      <div className="table_inner_text">{memberData.id}</div>
                    </div>
                  </div>
                </div>
                <div className="table_row">
                  <div className="table_section">
                    <div className="table_title">비밀번호</div>
                    <div className="table_contents w100">
                      <input
                        className="table_input modal"
                        type="password"
                        id="title"
                        placeholder="비밀번호를 입력해주세요."
                        value={password}
                        onChange={handlePw}
                      ></input>
                      {password && (
                        <div>
                          {regexMessage !== "" && (
                            <div
                              className="confirm_msg"
                              style={{
                                color: regexMessage ? "#007bff" : "red",
                                fontSize: "12px",
                              }}
                            >
                              {regexMessage
                                ? "사용 가능한 비밀번호입니다."
                                : "비밀번호는 최소 8자 이상이어야 하며, 대문자, 소문자, 숫자, 특수문자를 모두 포함해야 합니다."}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="table_row">
                  <div className="table_section">
                    <div className="table_title">이름</div>
                    <div className="table_contents w100">
                      <div className="table_inner_text">{memberData.name}</div>
                    </div>
                  </div>
                </div>
                <div className="table_row">
                  <div className="table_section">
                    <div className="table_title">이메일</div>
                    <div className="table_contents w100">
                      <input
                        className="table_input modal"
                        type="text"
                        id="title"
                        placeholder="이메일을 입력해주세요."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      ></input>
                    </div>
                  </div>
                </div>
                <div className="table_row">
                  <div className="table_section">
                    <div className="table_title">
                      연락처<p className="title_point">*</p>
                    </div>
                    <div className="table_contents w100">
                      <input
                        className="table_input phone"
                        type="number"
                        id="tel1"
                        value={tel1}
                        onChange={(e) => handlePhone(e, "tel1")}
                      ></input>
                      &nbsp;-&nbsp;
                      <input
                        className="table_input phone"
                        type="number"
                        id="tel2"
                        value={tel2}
                        onChange={(e) => handlePhone(e, "tel2")}
                      ></input>
                      &nbsp;-&nbsp;
                      <input
                        className="table_input phone"
                        type="number"
                        id="tel3"
                        value={tel3}
                        onChange={(e) => handlePhone(e, "tel3")}
                      ></input>
                    </div>
                  </div>
                </div>
                <div className="table_row">
                  <div className="table_section">
                    <div className="table_title">입금계좌</div>
                    <div className="table_contents w100">
                      <select
                        value={bank}
                        onChange={(e) => setBank(e.target.value)}
                        id="user_bank"
                        className="table_select"
                      >
                        <option value="">은행 선택</option>
                        <option value="KB국민은행">KB국민은행</option>
                        <option value="우리은행">우리은행</option>
                        <option value="SC제일은행">SC제일은행</option>
                        <option value="한국씨티은행">한국씨티은행</option>
                        <option value="하나은행">하나은행</option>
                        <option value="신한은행">신한은행</option>
                        <option value="케이뱅크">케이뱅크</option>
                        <option value="카카오뱅크">카카오뱅크</option>
                        <option value="토스뱅크">토스뱅크</option>
                        <option value="한국산업은행">한국산업은행</option>
                        <option value="중소기업은행">중소기업은행</option>
                        <option value="한국수출입은행">한국수출입은행</option>
                        <option value="수협은행">수협은행</option>
                        <option value="NH농협은행">NH농협은행</option>
                        <option value="대구은행">대구은행</option>
                        <option value="부산은행">부산은행</option>
                        <option value="경남은행">경남은행</option>
                        <option value="광주은행">광주은행</option>
                        <option value="전북은행">전북은행</option>
                        <option value="제주은행">제주은행</option>
                      </select>
                      <input
                        className="table_input modal"
                        type="text"
                        id="title"
                        placeholder="계좌를 입력해주세요."
                        value={bankAccount}
                        onChange={(e) => setBankAccount(e.target.value)}
                      ></input>
                    </div>
                  </div>
                </div>
                <div className="table_row">
                  <div className="table_section half">
                    <div className="table_title">
                      지점종류<p className="title_point">*</p>
                    </div>
                    <div className="table_contents w100">
                      <select
                        name="affiliation"
                        className="table_select"
                        value={type}
                        onChange={(e) => selectType(e.target.value)}
                      >
                        <option value="">선택</option>
                        {typeGroup.map((type, index) => {
                          return (
                            <option key={index} value={type}>
                              {type}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                  <div className="table_section half">
                    <div className="table_title">
                      회사명<p className="title_point">*</p>
                    </div>
                    <div className="table_contents w100">
                      <select
                        name="affiliation"
                        className="table_select"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                      >
                        <option value="">선택</option>
                        {companyGroup.map((data, index) => {
                          return (
                            <option key={index} value={data}>
                              {data}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="table_row">
                  <div className="table_section">
                    <div className="table_title">
                      지점명<p className="title_point">*</p>
                    </div>
                    <div className="table_contents w100">
                      <select
                        name="affiliation"
                        className="table_select"
                        value={branchIdx}
                        onChange={(e) => selectBranch(e.target.value)}
                      >
                        <option value="">선택</option>
                        {branchGroup.map((data, index) => {
                          return (
                            <option key={index} value={data.branch_idx}>
                              {data.branch_name}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                </div>
                {memberData.status === 1 && (
                  <div className="table_row">
                    <div className="table_section half">
                      <div className="table_title">가입고객수</div>
                      <div className="table_contents w100">
                        <div className="table_inner_text">{customerNum}</div>
                        {customerNum !== 0 && (
                          <div
                            className="table_more_btn"
                            onClick={() => moveCustomer(1)}
                          >
                            자세히보기
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="table_section half">
                      <div className="table_title">상담희망고객수</div>
                      <div className="table_contents w100">
                        <div className="table_inner_text">{hopeNum}</div>
                        {/* {hopeNum !== 0 && (
                        <div className="table_more_btn" onClick={() => moveCustomer(2)}>자세히보기</div>
                      )} */}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {memberData.status === 3 ? (
                <div className="modal_footer_box">
                  <div className="modal_btn" onClick={() => handleStatus(1)}>
                    승인
                  </div>
                  <div
                    className="modal_btn close"
                    onClick={() => handleStatus(2)}
                  >
                    반려
                  </div>
                </div>
              ) : (
                <div className="modal_footer_box">
                  <div className="modal_btn" onClick={() => handleUpdate()}>
                    수정
                  </div>
                  <div
                    className="modal_btn close"
                    onClick={() => deleteMember()}
                  >
                    삭제
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
      break;
    case "지점관리자":
      jsxContent = (
        <div className="modal_wrap">
          <div className="modal_back">
            <div className="modal_box">
              <div className="modal_title_box">
                <div className="modal_title">영업사원 상세</div>
                <div className="modal_close_btn" onClick={() => clearModal()}>
                  X
                </div>
              </div>
              <div className="table_box">
                <div className="table_row">
                  <div className="table_section">
                    <div className="table_title">등록일</div>
                    <div className="table_contents w100">
                      <div className="table_inner_text">{memberData.date}</div>
                    </div>
                  </div>
                </div>
                <div className="table_row">
                  <div className="table_section">
                    <div className="table_title">아이디</div>
                    <div className="table_contents w100">
                      <div className="table_inner_text">{memberData.id}</div>
                    </div>
                  </div>
                </div>
                <div className="table_row">
                  <div className="table_section">
                    <div className="table_title">이름</div>
                    <div className="table_contents w100">
                      <div className="table_inner_text">{memberData.name}</div>
                    </div>
                  </div>
                </div>
                <div className="table_row">
                  <div className="table_section">
                    <div className="table_title">이메일</div>
                    <div className="table_contents w100">
                      <div className="table_inner_text">{memberData.email}</div>
                    </div>
                  </div>
                </div>
                <div className="table_row">
                  <div className="table_section">
                    <div className="table_title">연락처</div>
                    <div className="table_contents w100">
                      <div className="table_inner_text">{memberData.phone}</div>
                    </div>
                  </div>
                </div>
                {memberData.status === 1 && (
                  <Fragment>
                    <div className="table_row">
                      <div className="table_section half">
                        <div className="table_title">가입고객수</div>
                        <div className="table_contents w100">
                          <div className="table_inner_text">{customerNum}</div>
                        </div>
                      </div>
                      <div className="table_section half">
                        <div className="table_title">상담희망고객수</div>
                        <div className="table_contents w100">
                          <div className="table_inner_text">{hopeNum}</div>
                          {/* {hopeNum !== 0 && (
                        <div className="table_more_btn" onClick={() => moveCustomer(2)}>자세히보기</div>
                      )} */}
                        </div>
                      </div>
                    </div>
                    <div className="table_row">
                      <div className="table_section">
                        <div className="table_title">계약고객수</div>
                        <div className="table_contents w100">
                          <div className="table_inner_text">{contractNum}</div>
                        </div>
                      </div>
                    </div>
                  </Fragment>
                )}
              </div>

              {memberData.status === 3 ? (
                <div className="modal_footer_box">
                  <div className="modal_btn" onClick={() => handleStatus(1)}>
                    승인
                  </div>
                  <div
                    className="modal_btn close"
                    onClick={() => handleStatus(2)}
                  >
                    반려
                  </div>
                </div>
              ) : (
                <div className="modal_footer_box">
                  <div
                    className="modal_btn close"
                    onClick={() => deleteMember()}
                  >
                    삭제
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      );
      break;
    default:
      jsxContent = null;
      break;
  }

  return jsxContent;
};

export default MemberViewModal;
