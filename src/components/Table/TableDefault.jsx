import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
const TableDefault = (props) => {
    const [tableRows, setTableRows] = useState([])
    const [tableColumns, setTableColumns] = useState([])
    const commonProps = {
        headerClassName: 'table_header',
        cellClassName: 'table_cell',
        headerAlign: 'center',
        flex: 1,
    };

    useEffect(() => {
        if (props.rows) {
            setTableRows(props.rows);
        }
        if (props.columns) {
            const updatedColumns = props.columns.map(column => ({ ...commonProps, ...column }));
            setTableColumns(updatedColumns);
        }
    }, [props]);
    const generateRandom = () => {
        var length = 8,
            charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
            retVal = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return retVal;
    }

    return (
        <div style={{ width: "100%" }}>
            <DataGrid
                rows={tableRows}
                columns={tableColumns}
                // getRowId={(row) => generateRandom()}
                disableColumnMenu
                onRowSelectionModelChange={(newSelectionModel) => {
                    const selectedIDs = new Set(newSelectionModel);
                    const selectedRows = tableRows.filter((r) => selectedIDs.has(r.id));
                    props.viewModalOpen(selectedRows[0]);
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
    );
};

export default TableDefault;