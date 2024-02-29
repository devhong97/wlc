import React, { useEffect, useState } from 'react';
import BranchWriteModal from '../modal/BranchWriteModal';

const BranchList = () => {
    const [writeModal, setWriteModal] = useState(false);

    const writeModalOpen = () => {
        setWriteModal(!writeModal)
    }

    return (
        <div className="main_wrap">
            <div className="main_back">
                <div className='main_title_box'>
                    지점 관리
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
                            <div className="title_btn" onClick={() => writeModalOpen()}>등록</div>
                        </div>
                        <div className="table_box">
                            <table className="list_table">
                                <tbody>
                                    <tr className="table_header">
                                        <th className="table_header_col ">No.</th>
                                        <th className="table_header_col short_col">코드</th>
                                        <th className="table_header_col">종류</th>
                                        <th className="table_header_col ">지점명</th>
                                        <th className="table_header_col ">지점장</th>
                                        <th className="table_header_col ">지역</th>
                                        <th className="table_header_col short_col">생성일</th>
                                        <th className="table_header_col short_col">-</th>
                                    </tr>
                                    <tr className="table_body">
                                        <td className="table_col ">1</td>
                                        <td className="table_col short_col">a123123</td>
                                        <td className="table_col ">보험사</td>
                                        <td className="table_col ">천안1지점</td>
                                        <td className="table_col ">유기홍</td>
                                        <td className="table_col ">천안</td>
                                        <td className="table_col short_col">24.02.28</td>
                                        <td className="table_col short_col">
                                            <div className='table_option_box'>
                                                <div className='option_btn'>수정</div>
                                                <div className='option_btn del'>삭제</div>
                                            </div>
                                        </td>
                                    </tr>
                                    {/* <tr
                      className="table_header"
                      style={{ backgroundColor: "#fff" }}
                    >
                      <td colSpan="7" style={{ textAlign: "center" }}>
                        <p style={{ fontSize: 18, padding: 50 }}>
                          [ 공지사항 ]
                          <br /> 검색 결과가 없습니다.
                        </p>
                      </td>
                    </tr> */}
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
            </div>
            {writeModal && <BranchWriteModal closeModal={writeModalOpen}></BranchWriteModal>}
        </div>
    );
};

export default BranchList;