import React, { useEffect, useState } from 'react';
import CustomerViewModal from '../modal/CustomerViewModal';
import TableDefault from '../Table/TableDefault';
import {
    GridActionsCellItem,
} from '@mui/x-data-grid';
const CustomerList = () => {
    const [viewModal, setViewModal] = useState(false);
    const [detailIdx, setDetailIdx] = useState("");

    const columns = [
        { field: 'id', headerName: 'No', width: "50" },
        { field: 'name', headerName: '이름', width: "100" },
        { field: 'phone', headerName: '연락처', width: "150" },
        { field: 'date', headerName: '가입일', width: "100" },
        { field: 'product', headerName: '상품명', },
        { field: 'hospital', headerName: '병원', },
        { field: 'hope_date_1', headerName: '희망일1', width: "100" },
        { field: 'hope_date_2', headerName: '희망일2', width: "100" },
        { field: 'result_date', headerName: '확정일', width: "100" },
        { field: 'status', headerName: '검진유무', width: "100" },
        { field: 'pay_status', headerName: '입금여부', width: "100" },
        { field: 'hope_status', headerName: '상담희망', width: "100" },
        {
            field: 'send', headerName: '문자전송', width: "100", type: 'actions',
            renderCell: (params) => (
                <div className='list_inner_btn' onClick={() => sendMsg(params.row)}>
                    확인
                </div>
            )
        }
    ]

    const rows = [
        {
            id: 1, name: '유기홍', phone: "01012341234", date: "24.03.05",
            product: "vip상품", hospital: "천안병원", hope_date_1: "24.03.05", hope_date_2: "24.03.06",
            status: "N", pay_status: "Y", hope_status: "Y", result_date: "24.03.05"
        },
    ];
    const viewModalOpen = (idx) => {
        setViewModal(!viewModal)
        setDetailIdx(idx)
    }
    const viewModalClose = () => {
        setViewModal(false)
    }
    const sendMsg = (data) => {
        alert(data.id)
    }
    return (
        <div className="main_wrap">
            <div className="main_back">
                <div className='main_title_box'>
                    고객 관리
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
                            {/* <div className="title_btn">등록</div> */}
                        </div>
                        <div className="table_box list">
                            <TableDefault rows={rows} columns={columns} viewModalOpen={viewModalOpen}></TableDefault>
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
            {viewModal && <CustomerViewModal closeModal={viewModalOpen} detailIdx={detailIdx}></CustomerViewModal>}
        </div>

    );
};

export default CustomerList;