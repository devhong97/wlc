import React, { useState } from "react";

const Register = () => {
  const [formData, setFormData] = useState({
    id: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    affiliation: "",
    email: "",
    agreeTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 여기에 회원가입 처리 로직을 추가하세요
    console.log("Form submitted:", formData);
  };

  return (

    <div className="register_wrap">
      <div className="register_back">
        <div className="logo_title_box">
          <div className="logo_img"></div>
          <div className="logo_title">WLC</div>
        </div>
        <div className="register_container">
          <form onSubmit={handleSubmit}>
            <div className="input_row">
              <div className="input_title">아이디</div>
              <input
                type="text"
                name="id"
                value={formData.id}
                placeholder="아이디를 입력해주세요."
                onChange={handleChange}
                className="register_input"
              />
            </div>
            <div className="input_row">
              <div className="input_title">비밀번호</div>
              <input
                type="password"
                name="password"
                value={formData.password}
                placeholder="비밀번호를 입력해주세요."
                onChange={handleChange}
                className="register_input"
              />
            </div>
            <div className="input_row">
              <div className="input_title blank"></div>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                placeholder="비밀번호를 확인해주세요."
                onChange={handleChange}
                className="register_input"
              />
            </div>
            <div className="input_row">
              <div className="input_title">소속</div>
              <select
                name="affiliation"
                value={formData.affiliation}
                onChange={handleChange}
                className="register_select"
              >
                <option value="">소속 선택</option>
                <option value="company">Company</option>
                <option value="school">School</option>
                <option value="organization">Organization</option>
              </select>
            </div>
            <div className="input_row">
              <div className="input_title">지점</div>
              <select
                name="affiliation"
                value={formData.affiliation}
                onChange={handleChange}
                className="register_select"
              >
                <option value="">지점 선택</option>
                <option value="company">Company</option>
                <option value="school">School</option>
                <option value="organization">Organization</option>
              </select>
            </div>
            <div className="input_row">
              <div className="input_title">이름</div>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                placeholder="이름을 입력해주세요."
                onChange={handleChange}
                className="register_input"
              />
            </div>
            <div className="input_row">
              <div className="input_title">이메일</div>
              <input
                type="email"
                name="email"
                value={formData.email}
                placeholder="이메일을 입력해주세요."
                onChange={handleChange}
                className="register_input"
              />
            </div>
            <div className="input_row terms">

              <input
                type="checkbox"
                name="agreeTerms"
                id="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="terms_checkbox"
              />
              <label className="terms_label" htmlFor="agreeTerms">약관에 동의합니다.
              </label>
            </div>
            <div className="register_btn_box">
              <button type="submit" className="register_btn">가입 신청</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
