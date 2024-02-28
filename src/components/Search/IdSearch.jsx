import React, { useState } from "react";

const IdSearch = () => {
  const [id, setId] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <div>
      <input type="text" value={id} placeholder="성명을 입력하세요." />
      <select name="affiliation" value={1} onChange={1}>
        <option value="">소속 분류1</option>
        <option value="company">Company</option>
        <option value="school">School</option>
        <option value="organization">Organization</option>
      </select>
      <select name="affiliation" value={1} onChange={1}>
        <option value="">소속 분류2</option>
        <option value="company">Company</option>
        <option value="school">School</option>
        <option value="organization">Organization</option>
      </select>
      <input type="text" value={phone} placeholder="연락처 입력하세요." />
    </div>
  );
};

export default IdSearch;
