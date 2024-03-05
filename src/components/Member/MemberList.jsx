import React, { useState } from 'react';
import MemberWriteModal from '../modal/MemberWriteModal';
import MemberViewModal from '../modal/MemberViewModal';
import { DataGrid } from '@mui/x-data-grid';

const MemberList = () => {
    const [writeModal, setWriteModal] = useState(false);
    const [viewModal, setViewModal] = useState(false);
    const [detailIdx, setDetailIdx] = useState("");

    const commonProps = {
        headerClassName: 'table_header',
        cellClassName: 'table_cell',
        width: "170"
    };

    const columns = [
        { field: 'id', headerName: 'No', ...commonProps },
        { field: 'name', headerName: '이름', ...commonProps },
        { field: 'phone', headerName: '연락처', ...commonProps },
        { field: 'date', headerName: '등록일', ...commonProps },
        { field: 'pay', headerName: '완료커미션', ...commonProps },
        { field: 'customer_num', headerName: '고객수', ...commonProps },
        { field: 'hope_num', headerName: '상담희망수', ...commonProps },
        { field: 'bank_num', headerName: '입금계좌', ...commonProps },
    ];

    const rows = [
        { id: 1, name: '유기홍', phone: "01012341234", date: "24.03.05", pay: 4000000, customer_num: 100, hope_num: 35, bank_num: '신한 123456789' },
        { id: 2, name: '이솔미', phone: "01078945678", date: "24.03.04", pay: 500000, customer_num: 50, hope_num: 5, bank_num: '신한 125684589' },
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
                            <DataGrid
                                rows={rows}
                                columns={columns}
                                // disableColumnMenu
                                onRowSelectionModelChange={(newSelectionModel) => {
                                    const selectedIDs = new Set(newSelectionModel);
                                    const selectedRows = rows.filter((r) => selectedIDs.has(r.id));
                                    viewModalOpen(selectedRows[0]);
                                }}

                            />
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
            {writeModal && <MemberWriteModal closeModal={writeModalOpen}></MemberWriteModal>}
            {viewModal && <MemberViewModal closeModal={viewModalClose} detailIdx={detailIdx}></MemberViewModal>}
        </div>
    );
};

export default MemberList;