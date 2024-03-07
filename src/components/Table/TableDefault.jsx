import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
const TableDefault = (props) => {
    const [tableRows, setTableRows] = useState([])
    const [tableColumns, setTableColumns] = useState([])
    const commonProps = {
        headerClassName: 'table_header',
        cellClassName: 'table_cell',
        width: "200",
        headerAlign: 'center',
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

    return (
        <div>
            <DataGrid
                rows={tableRows}
                columns={tableColumns}
                disableColumnMenu
                onRowSelectionModelChange={(newSelectionModel) => {
                    const selectedIDs = new Set(newSelectionModel);
                    const selectedRows = tableRows.filter((r) => selectedIDs.has(r.id));
                    props.viewModalOpen(newSelectionModel);
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