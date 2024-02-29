import React from 'react';

const BranchWriteModal = (props) => {
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
                        <div className="modal_title">지점 등록</div>
                        <div className="modal_close_btn" onClick={() => clearModal()}>
                            X
                        </div>
                    </div>
                    <div className="table_box">
                        <div className="table_row">
                            <div className="table_section">
                                <div className="table_title">
                                    제목<p className="title_point">*</p>
                                </div>
                                <div className="table_contents w100">
                                    <input
                                        className="table_input modal"
                                        type="text"
                                        id="title"
                                        placeholder="제목을 입력해주세요."
                                    ></input>
                                </div>
                            </div>
                        </div>
                        <div className="table_row">
                            <div className="table_section">
                                <div className="table_title">
                                    기간<p className="title_point">*</p>
                                </div>
                                <div className="table_contents w100">
                                    <input
                                        className="table_input modal"
                                        type="text"
                                        id="date"
                                        placeholder="ex) 3~4일"
                                    ></input>
                                </div>
                            </div>
                        </div>

                        <div className="table_row">
                            <div className="table_section">
                                <div className="table_title">내용</div>
                                <div className="table_contents w100">
                                    <input
                                        className="table_input modal"
                                        type="text"
                                        id="contents"
                                        placeholder="ex) i. 미국 : 마이애미 ii. 온두라스 : 로아탄섬 iii. 멕시코 : 하베스트카예, 코스타마야, 코지멜"
                                    ></input>
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

export default BranchWriteModal;