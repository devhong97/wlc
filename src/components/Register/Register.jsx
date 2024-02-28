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
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="id"
        value={formData.id}
        placeholder="아이디"
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        placeholder="비밀번호"
        onChange={handleChange}
      />
      <input
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        placeholder="비밀번호 확인"
        onChange={handleChange}
      />
      <select
        name="affiliation"
        value={formData.affiliation}
        onChange={handleChange}
      >
        <option value="">소속 선택</option>
        <option value="company">Company</option>
        <option value="school">School</option>
        <option value="organization">Organization</option>
      </select>
      <select
        name="affiliation"
        value={formData.affiliation}
        onChange={handleChange}
      >
        <option value="">지점 선택</option>
        <option value="company">Company</option>
        <option value="school">School</option>
        <option value="organization">Organization</option>
      </select>
      <input
        type="text"
        name="fullName"
        value={formData.fullName}
        placeholder="성명"
        onChange={handleChange}
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        placeholder="이메일"
        onChange={handleChange}
      />
      <label>
        <input
          type="checkbox"
          name="agreeTerms"
          checked={formData.agreeTerms}
          onChange={handleChange}
        />
        I agree to the terms and conditions
      </label>
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
