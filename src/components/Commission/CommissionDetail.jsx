import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
const CommissionDetail = (props) => {
    const [selectMember, setSelectMember] = useState([])
    const commonProps = {
        headerClassName: 'table_header',
        cellClassName: 'table_cell',
        width: "300",
        headerAlign: 'center',
    };
    const branchColumns = [
        { field: 'id', headerName: 'No', ...commonProps, width: "50" },
        { field: 'branch_name', headerName: '지점명', ...commonProps },
        { field: 'manager', headerName: '지점장', ...commonProps },
        { field: 'pay', headerName: '금액', ...commonProps },
        { field: 'bank_num', headerName: '입금계좌', ...commonProps },
        {
            field: 'check_btn', headerName: '입금확인', ...commonProps, type: 'actions',
            renderCell: (params) => (
                <div className='table_inner_btn' onClick={() => checkPay(params.row)}>
                    확인
                </div>
            )
        },
    ]
    const branchRows = [
        {
            id: 1,
            branch_name: '천안지점',
            manager: '유기홍',
            pay: 4000000,
            bank_num: '신한 123456123456',
        },
    ];
    const memberColumns = [
        { field: 'id', headerName: 'No', ...commonProps, width: "50" },
        { field: 'name', headerName: '사원명', ...commonProps, width: "350" },
        { field: 'pay', headerName: '금액', ...commonProps, width: "350" },
        { field: 'bank_num', headerName: '입금계좌', ...commonProps, width: "350" },
        { field: 'pay_status', headerName: '입금현황', ...commonProps, width: "350" },
    ]
    const memberRows = [
        {
            id: 1,
            name: '유기홍',
            pay: 4000000,
            bank_num: '신한 123456123456',
            pay_status: "N"
        },
        {
            id: 2,
            name: '유기홍',
            pay: 4000000,
            bank_num: '신한 123456123456',
            pay_status: "N"
        },
        {
            id: 3,
            name: '유기홍',
            pay: 4000000,
            bank_num: '신한 123456123456',
            pay_status: "N"
        },
    ];
    const checkPay = (data) => {
        console.log(data);
    }
    const checkMember = (data) => {
        console.log(data);
        setSelectMember(data);
    }
    const updateMemberPay = () => {
        if (selectMember.length !== 0) {
            alert(selectMember)
        } else {
            alert("선택된 사원이 없습니다.")
        }
    }
    return (
        <div className='detail_wrap'>
            <div className='detail_back'>
                <div className='detail_title_box'>
                    <div className='detail_title'>커미션 관리 상세</div>
                </div>
                <div className='detail_container'>
                    <div className='detail_title_box'>
                        <div className='detail_title sub'>지점 커미션</div>
                    </div>
                    <div className='detail_table_box top'>
                        <DataGrid
                            rows={branchRows}
                            columns={branchColumns}
                            disableColumnMenu
                        />
                    </div>
                </div>
                <div className='detail_container'>
                    <div className='detail_title_box'>
                        <div className='detail_title sub'>사원 커미션</div>
                        <div className='title_btn' onClick={() => updateMemberPay()}>선택완료</div>
                    </div>
                    <div className='detail_table_box'>
                        <DataGrid
                            rows={memberRows}
                            columns={memberColumns}
                            disableColumnMenu
                            checkboxSelection
                            onRowSelectionModelChange={(newSelectionModel) => {
                                checkMember(newSelectionModel);
                            }}
                            initialState={{
                                pagination: { paginationModel: { pageSize: 10 } },
                            }}
                            pageSizeOptions={[10, 50, 100]}
                            localeText={{
                                MuiTablePagination: {
                                    labelDisplayedRows: ({ from, to, count }) =>
                                        `${from} - ${to} of ${count}`,
                                    labelRowsPerPage: "per page"
                                },
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommissionDetail;