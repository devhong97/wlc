import React, { useEffect, useState } from 'react';
import TableDefault from '../Table/TableDefault';
import { useNavigate } from 'react-router-dom';

const CommissionList = () => {
    const navigate = useNavigate();


    const columns = [
        { field: 'id', headerName: 'No', flex: 0.5 },
        { field: 'category', headerName: '종류', },
        { field: 'company_name', headerName: '회사명', },
        { field: 'name', headerName: '지점명', },
        { field: 'pay', headerName: '커미션금액', },
        { field: 'address', headerName: '지역', },
        { field: 'date', headerName: '생성일', },
        { field: 'member_num', headerName: '사원수', maxWidth: 100 },
    ];

    const rows = [
        {
            id: 1, category: '보험사', company_name: "회사명", name: "지점명",
            pay: 4000000, address: "충남 천안", date: '24.03.07', member_num: 30
        },
    ];


    const moveDetailPage = (id) => {
        navigate(`/commission/${id}`)
    }
    return (
        <div className="main_wrap">
            <div className="main_back">
                <div className='main_title_box'>
                    커미션 관리
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
                        </div>
                        <div className="table_box list">
                            <TableDefault rows={rows} columns={columns} viewModalOpen={moveDetailPage}></TableDefault>
                        </div>
                    </div>
                    {/* <div className="pagination_box">
                    <button>{`<<`}</button>
                    <button>{`<`}</button>
                    <button>1</button>
                    <button>{`>`}</button>
                    <button>{`>>`}</button>
                </div> */}
                </div>
            </div>
        </div>
    );
};

export default CommissionList;