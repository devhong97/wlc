import React, { useEffect, useState } from "react";
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
  const [bank, setBank] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [type, setType] = useState("");
  const [company, setCompany] = useState("");
  const [branchName, setBranchName] = useState("");
  const [branchIdx, setBranchIdx] = useState("");
  const [customerNum, setCustomerNum] = useState(0);
  const [hopeNum, setHopeNum] = useState(0);
  const navigation = useNavigate();

  // 분류소스
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

  const selectType = (data) => {
    setType(data);
    //지점명 초기화
    setCompany("");
    setBranchIdx("");
    setBranchName("");
  };
  // ///////////////////

  useEffect(() => {
    setDetailValue();
  }, [memberData]);

  const clearModal = () => {
    props.closeModal();
  };

  const getDetail = async () => {
    try {
      const response = await Axios.get(
        "http://localhost:3001/api/get/member_detail",
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
    // setPassword(memberData.password);
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
  };

  const handleUpdate = async () => {
    if (
      !email ||
      !phone ||
      !bank ||
      !bankAccount ||
      !type ||
      !company ||
      !branchName ||
      !branchIdx
    ) {
      alert("필수 사항을 모두 입력해주세요");
      return;
    }
    const paramsArray = {
      email: email,
      phone: phone,
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
        "http://localhost:3001/api/post/member_edit",
        paramsArray
      );

      console.log(response.data);
      props.closeModal();
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };
  const deleteMember = async () => {
    try {
      const response = await Axios.post(
        "http://localhost:3001/api/post/member_delete",
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
        "http://localhost:3001/api/post/member_status",
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
  return (
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
                <div className="table_title">
                  아이디<p className="title_point">*</p>
                </div>
                <div className="table_contents w100">
                  <div className="table_inner_text">{memberData.id}</div>
                </div>
              </div>
            </div>
            <div className="table_row">
              <div className="table_section">
                <div className="table_title">
                  비밀번호<p className="title_point">*</p>
                </div>
                <div className="table_contents w100">
                  <input
                    className="table_input modal"
                    type="password"
                    id="title"
                    placeholder="비밀번호를 입력해주세요."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  ></input>
                </div>
              </div>
            </div>
            <div className="table_row">
              <div className="table_section">
                <div className="table_title">
                  이름<p className="title_point">*</p>
                </div>
                <div className="table_contents w100">
                  <div className="table_inner_text">{memberData.name}</div>
                </div>
              </div>
            </div>
            <div className="table_row">
              <div className="table_section">
                <div className="table_title">
                  이메일<p className="title_point">*</p>
                </div>
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
                    className="table_input modal"
                    type="text"
                    id="title"
                    placeholder="연락처를 입력해주세요."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  ></input>
                </div>
              </div>
            </div>
            <div className="table_row">
              <div className="table_section">
                <div className="table_title">
                  입금계좌<p className="title_point">*</p>
                </div>
                <div className="table_contents w100">
                  <select
                    value={bank}
                    onChange={(e) => setBank(e.target.value)}
                    id="user_bank"
                    className="table_select"
                  >
                    <option value="">은행 선택</option>
                    <option value="농협">농협</option>
                    <option value="기업">기업</option>
                    <option value="신한">신한</option>
                    <option value="토스뱅크">토스뱅크</option>
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
              <div className="modal_btn close" onClick={() => handleStatus(2)}>
                반려
              </div>
            </div>
          ) : (
            <div className="modal_footer_box">
              <div className="modal_btn" onClick={() => handleUpdate()}>
                수정
              </div>
              <div className="modal_btn close" onClick={() => deleteMember()}>
                삭제
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberViewModal;
