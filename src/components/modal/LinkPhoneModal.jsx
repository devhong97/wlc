import React, { useState } from 'react';

const LinkPhoneModal = (props) => {
    const [tel1, setTel1] = useState(""); // 연락처1
    const [tel2, setTel2] = useState(""); // 연락처2
    const [tel3, setTel3] = useState(""); // 연락처3


    //연락처 체크
    const handlePhone = (e, target) => {
        const value = e.target.value;
        if (target === "tel1" && value.length === 3) {
            document.getElementById("tel2").focus();
        } else if (target === "tel2" && value.length === 4) {
            document.getElementById("tel3").focus();
        } else if (target === "tel3" && value.length === 4) {
        }

        if (target === "tel1") {
            setTel1(value);
        } else if (target === "tel2") {
            setTel2(value);
        } else if (target === "tel3") {
            setTel3(value);
        }
    };

    const clearModal = () => {
        props.closeModal()
    }
    return (
        <div className="modal_wrap">
            <div className="modal_back">
                <div className="modal_box">
                    <div className="modal_title_box">
                        <div className="modal_title">링크 전송하기</div>
                        <div className="modal_close_btn" onClick={() => clearModal()}>
                            X
                        </div>
                    </div>
                    <div className="table_box">

                        <div className="table_row">
                            <div className="table_section">
                                <div className="table_title">
                                    연락처<p className="title_point">*</p>
                                </div>
                                <div className="table_contents w100">
                                    <input
                                        type="number"
                                        value={tel1}
                                        onChange={(e) => handlePhone(e, "tel1")}
                                        id="tel"
                                        maxlength="3"
                                        className="table_input my_num"
                                    />
                                    &nbsp;-&nbsp;
                                    <input
                                        type="number"
                                        value={tel2}
                                        onChange={(e) => handlePhone(e, "tel2")}
                                        id="tel2"
                                        maxlength="4"
                                        className="table_input my_num"
                                    />
                                    &nbsp;-&nbsp;
                                    <input
                                        type="number"
                                        value={tel3}
                                        onChange={(e) => handlePhone(e, "tel3")}
                                        id="tel3"
                                        maxlength="4"
                                        className="table_input my_num"
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="modal_footer_box">
                        <div className="modal_btn">
                            전송
                        </div>
                        <div className="modal_btn close">
                            닫기
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LinkPhoneModal;