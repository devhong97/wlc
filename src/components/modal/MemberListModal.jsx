import React from 'react';

const MemberListModal = (props) => {
    const clearModal = () => {
        props.closeModal()
    }
    const selectRow = (name, num) => {
        props.chooseData(name, num);
        clearModal();
    }
    return (
        <div className="modal_wrap">
            <div className="modal_back">
                <div className="modal_box">
                    <div className="modal_title_box">
                        <div className="modal_title">회원 목록</div>
                        <div className="modal_close_btn" onClick={() => clearModal()}>
                            X
                        </div>
                    </div>

                    <div className="board_list_wrap">
                        <div className="list_area">
                            <div className="search_box">
                                <div className="search_select">
                                    <select className="list_select">
                                        <option>메뉴</option>
                                        <option>제목</option>
                                        <option>내용</option>
                                        <option>작성자</option>
                                    </select>
                                </div>
                                <div className="search_input">
                                    <input
                                        className="list_input"
                                        placeholder="검색어를 입력하세요"
                                    ></input>
                                    <div className="list_search" style={{ marginRight: 10 }}>
                                        검색
                                    </div>
                                    <div className="list_search reset_btn">초기화</div>
                                </div>
                                <div className="title_btn">등록</div>
                            </div>
                            <div className="table_box">
                                <table className="list_table">
                                    <tbody>
                                        <tr className="table_header">
                                            <th className="table_header_col ">No.</th>
                                            <th className="table_header_col short_col">이름</th>
                                            <th className="table_header_col">연락처</th>
                                            <th className="table_header_col ">등록일</th>
                                            <th className="table_header_col ">종류</th>
                                            <th className="table_header_col ">지점</th>
                                            <th className="table_header_col short_col">-</th>
                                        </tr>
                                        <tr className="table_body">
                                            <td className="table_col ">1</td>
                                            <td className="table_col short_col pointer">유기홍</td>
                                            <td className="table_col ">01012341234</td>
                                            <td className="table_col ">24.02.28</td>
                                            <td className="table_col ">보험사</td>
                                            <td className="table_col ">천안1지점</td>
                                            <td className="table_col short_col">
                                                <div className='table_option_box'>
                                                    <div className='option_btn' onClick={() => selectRow("유기홍", 1)}>선택</div>
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="pagination_box">
                            <button>{`<<`}</button>
                            <button>{`<`}</button>
                            <button>1</button>
                            <button>{`>`}</button>
                            <button>{`>>`}</button>
                        </div>
                    </div>
                    <div className="modal_footer_box">

                        <div className="modal_btn close" onClick={clearModal}>
                            닫기
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemberListModal;