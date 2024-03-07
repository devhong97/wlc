import React, { useEffect, useState } from 'react';
import MemberWriteModal from '../modal/MemberWriteModal';
import MemberViewModal from '../modal/MemberViewModal';
import TableDefault from '../Table/TableDefault';

const MemberList = () => {
    const [writeModal, setWriteModal] = useState(false);
    const [viewModal, setViewModal] = useState(false);
    const [detailIdx, setDetailIdx] = useState("");
    const [tab, setTab] = useState(1)

    useEffect(() => {
        getBoard(tab);
    }, [tab])

    const getBoard = (tab) => {
        //tab 실어서 데이터 호출
    }
    const columns = [
        { field: 'id', headerName: 'No', width: "50" },
        { field: 'name', headerName: '이름', },
        { field: 'phone', headerName: '연락처', },
        { field: 'date', headerName: '등록일', },
        { field: 'pay', headerName: '완료커미션', },
        { field: 'customer_num', headerName: '고객수', },
        { field: 'hope_num', headerName: '상담희망수', },
        { field: 'bank_num', headerName: '입금계좌', },
    ];

    const rows = [
        { id: 1, name: '유기홍', phone: "01012341234", date: "24.03.05", pay: 4000000, customer_num: 100, hope_num: 35, bank_num: '신한 123456789' },
        { id: 2, name: '이솔미', phone: "01078945678", date: "24.03.04", pay: 500000, customer_num: 50, hope_num: 5, bank_num: '신한 125684589' },
        { id: 3, name: '유기홍', phone: "01012341234", date: "24.03.05", pay: 4000000, customer_num: 100, hope_num: 35, bank_num: '신한 123456789' },
        { id: 4, name: '이솔미', phone: "01078945678", date: "24.03.04", pay: 500000, customer_num: 50, hope_num: 5, bank_num: '신한 125684589' },
        { id: 5, name: '유기홍', phone: "01012341234", date: "24.03.05", pay: 4000000, customer_num: 100, hope_num: 35, bank_num: '신한 123456789' },
        { id: 6, name: '이솔미', phone: "01078945678", date: "24.03.04", pay: 500000, customer_num: 50, hope_num: 5, bank_num: '신한 125684589' },
        { id: 7, name: '유기홍', phone: "01012341234", date: "24.03.05", pay: 4000000, customer_num: 100, hope_num: 35, bank_num: '신한 123456789' },
        { id: 8, name: '이솔미', phone: "01078945678", date: "24.03.04", pay: 500000, customer_num: 50, hope_num: 5, bank_num: '신한 125684589' },
        { id: 9, name: '유기홍', phone: "01012341234", date: "24.03.05", pay: 4000000, customer_num: 100, hope_num: 35, bank_num: '신한 123456789' },
    ];


    const writeModalOpen = () => {
        setWriteModal(!writeModal)
    }
    const viewModalOpen = (data) => {
        setViewModal(!viewModal)

        const idx = data.id
        setDetailIdx(idx)
    }
    const viewModalClose = () => {
        setViewModal(false)
    }

    return (
        <div className="main_wrap">
            <div className="main_back">
                <div className='main_title_box'>
                    직원 관리
                </div>
                <div className='tab_area'>
                    <div className='tab_back'>
                        <div className={`tab_menu ${tab === 1 && "active"}`} onClick={() => setTab(1)}>승인 사원</div>
                        <div className={`tab_menu ${tab === 2 && "active"}`} onClick={() => setTab(2)}>미승인 사원</div>
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
                            <div className="title_btn" onClick={() => writeModalOpen()}>등록</div>
                        </div>
                        <div className="table_box list">
                            <TableDefault rows={rows} columns={columns} viewModalOpen={viewModalOpen}></TableDefault>
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
            {writeModal && <MemberWriteModal closeModal={writeModalOpen}></MemberWriteModal>}
            {viewModal && <MemberViewModal closeModal={viewModalClose} detailIdx={detailIdx}></MemberViewModal>}
        </div>
    );
};

export default MemberList;