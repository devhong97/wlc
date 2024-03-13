import React, { useState } from 'react';
import Axios from "axios";

const MemberWriteModal = (props) => {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [bankAccount, setBankAccount] = useState("");
    const [category1, setCategory1] = useState("");
    const [category2, setCategory2] = useState("");
    const [branchName, setBranchName] = useState("");

    const clearModal = () => {
        props.closeModal()
    }
    const handleSubmit = () => {

    }
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
                                        value={id} onChange={(e) => setId(e.target.value)}
                                    ></input>
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
                                        type="text"
                                        id="title"
                                        placeholder="비밀번호를 입력해주세요."
                                        value={password} onChange={(e) => setPassword(e.target.value)}
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
                                    <input
                                        className="table_input modal"
                                        type="text"
                                        id="title"
                                        placeholder="이름을 입력해주세요."
                                        value={name} onChange={(e) => setName(e.target.value)}
                                    ></input>
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
                                        value={email} onChange={(e) => setEmail(e.target.value)}
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
                                        value={phone} onChange={(e) => setPhone(e.target.value)}
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
                                    <input
                                        className="table_input modal"
                                        type="text"
                                        id="title"
                                        placeholder="계좌를 입력해주세요."
                                        value={bankAccount} onChange={(e) => setBankAccount(e.target.value)}
                                    ></input>
                                </div>
                            </div>
                        </div>
                        <div className="table_row">
                            <div className="table_section half">
                                <div className="table_title">
                                    분류1<p className="title_point">*</p>
                                </div>
                                <div className="table_contents w100">
                                    <select
                                        name="affiliation"
                                        className="table_select"
                                        value={category1} onChange={(e) => setCategory1(e.target.value)}
                                    >
                                        <option value="">선택</option>
                                        <option value="company">Company</option>
                                        <option value="school">School</option>
                                        <option value="organization">Organization</option>
                                    </select>
                                </div>
                            </div>
                            <div className="table_section half">
                                <div className="table_title">
                                    분류2<p className="title_point">*</p>
                                </div>
                                <div className="table_contents w100">
                                    <select
                                        name="affiliation"
                                        className="table_select"
                                        value={category2} onChange={(e) => setCategory2(e.target.value)}
                                    >
                                        <option value="">선택</option>
                                        <option value="company">Company</option>
                                        <option value="school">School</option>
                                        <option value="organization">Organization</option>
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
                                        value={branchName} onChange={(e) => setBranchName(e.target.value)}
                                    >
                                        <option value="">선택</option>
                                        <option value="company">Company</option>
                                        <option value="school">School</option>
                                        <option value="organization">Organization</option>
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