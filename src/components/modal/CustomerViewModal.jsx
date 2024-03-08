import React, { useEffect, useState } from 'react';

const CustomerViewModal = (props) => {
    const [detailNum, setDetailNum] = useState("");
    const [inspectionStatus, setInspectionStatus] = useState("n")
    const [hopeStatus, setHopeStatus] = useState("n")
    const [payStatus, setPayStatus] = useState("n")
    useEffect(() => {
        if (props.detailIdx) {
            console.log(props.detailIdx);
            setDetailNum(props.detailIdx);
            getDetail();
        }
    }, [props.detailIdx])
    const clearModal = () => {
        props.closeModal()
    }
    const getDetail = () => {
        //detailNum 사용하여 상세 api 호출
    }
    const handleSubmit = () => {

    }
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
                                <div className="table_title">
                                    이름
                                </div>
                                <div className="table_contents w100">
                                    <input
                                        className="table_input w100"
                                        type="text"
                                        id="title"
                                        placeholder="지점명을 입력해주세요."
                                    ></input>
                                </div>
                            </div>
                            <div className="table_section half">
                                <div className="table_title">
                                    연락처
                                </div>
                                <div className="table_contents w100">
                                    <input
                                        className="table_input w100"
                                        type="text"
                                        id="title"
                                        placeholder="지점명을 입력해주세요."
                                    ></input>
                                </div>
                            </div>
                        </div>
                        <div className="table_row">
                            <div className="table_section half">
                                <div className="table_title">
                                    가입일
                                </div>
                                <div className="table_contents w100">
                                    <input
                                        className="table_input w100"
                                        type="text"
                                        id="title"
                                        placeholder="지점명을 입력해주세요."
                                    ></input>
                                </div>
                            </div>
                            <div className="table_section half">
                                <div className="table_title">
                                    영업자
                                </div>
                                <div className="table_contents w100">
                                    <input
                                        className="table_input w100"
                                        type="text"
                                        id="title"
                                        placeholder="지점명을 입력해주세요."
                                    ></input>
                                </div>
                            </div>
                        </div>
                        <div className="table_row">

                        </div>
                        <div className="table_row">
                            <div className="table_section">
                                <div className="table_title">
                                    상품명
                                </div>
                                <div className="table_contents w100">
                                    <input
                                        className="table_input modal"
                                        type="text"
                                        id="title"
                                        placeholder="지점명을 입력해주세요."
                                    ></input>
                                </div>
                            </div>
                        </div>
                        <div className="table_row">
                            <div className="table_section">
                                <div className="table_title">
                                    병원
                                </div>
                                <div className="table_contents w100">
                                    <input
                                        className="table_input modal"
                                        type="text"
                                        id="title"
                                        placeholder="지점명을 입력해주세요."
                                    ></input>
                                </div>
                            </div>
                        </div>
                        <div className="table_row">
                            <div className="table_section half">
                                <div className="table_title">
                                    희망일1
                                </div>
                                <div className="table_contents w100">
                                    <input
                                        className="table_input modal"
                                        type="text"
                                        id="title"
                                        placeholder="지점명을 입력해주세요."
                                    ></input>
                                </div>
                            </div>
                            <div className="table_section half">
                                <div className="table_title">
                                    희망일2
                                </div>
                                <div className="table_contents w100">
                                    <input
                                        className="table_input modal"
                                        type="text"
                                        id="title"
                                        placeholder="지점명을 입력해주세요."
                                    ></input>
                                </div>
                            </div>
                        </div>
                        <div className="table_row">
                            <div className="table_section">
                                <div className="table_title">
                                    검진확정일
                                </div>
                                <div className="table_contents w100">
                                    <input
                                        className="table_input modal"
                                        type="text"
                                        id="title"
                                        placeholder="지점명을 입력해주세요."
                                    ></input>
                                </div>
                            </div>
                        </div>
                        <div className="table_row">
                            <div className="table_section triple">
                                <div className="table_title">
                                    검진유무
                                </div>
                                <div className="table_contents w100">
                                    <div className='table_radio'>
                                        <label>
                                            <input
                                                type="radio"
                                                name="inspectionStatus"
                                                value="y"
                                                checked={inspectionStatus === 'y'}
                                                onChange={(e) => setInspectionStatus(e.target.value)}
                                            />
                                            Yes
                                        </label>
                                    </div>
                                    <div className='table_radio'>
                                        <label>
                                            <input
                                                type="radio"
                                                name="inspectionStatus"
                                                value="n"
                                                checked={inspectionStatus === 'n'}
                                                onChange={(e) => setInspectionStatus(e.target.value)}
                                            />
                                            No
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="table_section triple">
                                <div className="table_title">
                                    상담희망
                                </div>
                                <div className="table_contents w100">
                                    <div className='table_radio'>
                                        <label>
                                            <input
                                                type="radio"
                                                name="hopeStatus"
                                                value="y"
                                                checked={hopeStatus === 'y'}
                                                onChange={(e) => setHopeStatus(e.target.value)}
                                            />
                                            Yes
                                        </label>
                                    </div>
                                    <div className='table_radio'>
                                        <label>
                                            <input
                                                type="radio"
                                                name="hopeStatus"
                                                value="n"
                                                checked={hopeStatus === 'n'}
                                                onChange={(e) => setHopeStatus(e.target.value)}
                                            />
                                            No
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="table_section triple">
                                <div className="table_title">
                                    입금유무
                                </div>
                                <div className="table_contents w100">
                                    <div className='table_radio'>
                                        <label>
                                            <input
                                                type="radio"
                                                name="payStatus"
                                                value="y"
                                                checked={payStatus === 'y'}
                                                onChange={(e) => setPayStatus(e.target.value)}
                                            />
                                            Yes
                                        </label>
                                    </div>
                                    <div className='table_radio'>
                                        <label>
                                            <input
                                                type="radio"
                                                name="payStatus"
                                                value="n"
                                                checked={payStatus === 'n'}
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
                                <div className="table_title image">
                                    비고
                                </div>
                                <div className="table_contents w100">
                                    <textarea
                                        className="table_textarea"

                                    ></textarea>
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