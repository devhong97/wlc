import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useBranchContext } from "../Context/BranchContext";

const MemberWriteModal = (props) => {
  const {
    typeGroup,
    companyGroup,
    branchGroup,
    setContextType,
    setContextCompany,
  } = useBranchContext();
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bank, setBank] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [type, setType] = useState("");
  const [company, setCompany] = useState("");
  const [branchName, setBranchName] = useState("");
  const [branchIdx, setBranchIdx] = useState("");
  //등록 중복체크
  const [tel1, setTel1] = useState(""); // 연락처1
  const [tel2, setTel2] = useState(""); // 연락처2
  const [tel3, setTel3] = useState(""); // 연락처3
  const [idChk, setIdChk] = useState(""); // 아이디 중복체크
  const [regexMessage, setRegexMessage] = useState(""); //비밀번호 유효성검사

  // 아이디체크
  const handleId = (e) => {
    setId(e.target.value);
    handleIdChk(e.target.value);
  };

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

  // 아이디 중복체크
  const handleIdChk = (val) => {
    Axios.post("http://localhost:3001/api/post/check_id", {
      id: val,
    })
      .then((res) => {
        const result = res.data;
        if (result.available) {
          setIdChk(true);
        } else {
          setIdChk(false);
        }
      })
      .catch((err) => {
        console.error("Error fetching data: ", err);
      });
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

  const clearModal = () => {
    props.closeModal();
  };

  const handleSubmit = async () => {
    if (
      !id ||
      !password ||
      !name ||
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
    if (!idChk) {
      alert("이미 존재하는 아이디입니다.");
      return;
    }
    // 비밀번호 유효성검사 추가
    if (!regexMessage) {
      alert("비밀번호를 유효한 형식으로 입력해주세요.");
      return;
    }

    const phone = tel1 + "-" + tel2 + "-" + tel3;

    try {
      const response = await Axios.post(
        "http://localhost:3001/api/post/member",
        {
          id: id,
          password: password,
          name: name,
          email: email,
          phone: phone,
          bank: bank,
          deposit_account: bankAccount,
          branch_type: type,
          company_name: company,
          branch: branchName,
          branch_idx: branchIdx,
        }
      );

      alert("영업사원이 등록되었습니다.");
      console.log(response.data);
      props.closeModal();
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  return (
    <div className="modal_wrap">
      <div className="modal_back">
        <div className="modal_box">
          <div className="modal_title_box">
            <div className="modal_title">직원 등록</div>
            <div className="modal_close_btn" onClick={() => clearModal()}>
              X
            </div>
          </div>
          <div className="table_box">
            <div className="table_row">
              <div className="table_section">
                <div className="table_title">
                  아이디<p className="title_point">*</p>
                </div>
                <div className="table_contents w100">
                  <input
                    className="table_input modal"
                    type="text"
                    id="title"
                    placeholder="아이디를 입력해주세요."
                    value={id}
                    onChange={handleId}
                  ></input>
                  {idChk !== "" && (
                    <div
                      className="confirm_msg"
                      style={{
                        color: idChk ? "#007bff" : "red",
                        fontSize: "12px",
                      }}
                    >
                      {idChk
                        ? "사용가능한 아이디입니다."
                        : "이미 존재하는 아이디입니다."}
                    </div>
                  )}
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
                <div className="table_title">
                  이름<p className="title_point">*</p>
                </div>
                <div className="table_contents w100">
                  <input
                    className="table_input modal"
                    type="text"
                    id="title"
                    placeholder="이름을 입력해주세요."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  ></input>
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
                    maxLength="3"
                    onChange={(e) => handlePhone(e, "tel1")}
                  ></input>
                  &nbsp;-&nbsp;
                  <input
                    className="table_input phone"
                    type="number"
                    id="tel2"
                    value={tel2}
                    maxLength="4"
                    onChange={(e) => handlePhone(e, "tel2")}
                  ></input>
                  &nbsp;-&nbsp;
                  <input
                    className="table_input phone"
                    type="number"
                    id="tel3"
                    value={tel3}
                    maxLength="4"
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
          </div>

          <div className="modal_footer_box">
            <div className="modal_btn" onClick={handleSubmit}>
              등록
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

export default MemberWriteModal;
