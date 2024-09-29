"use client";

import {useMemo} from "react";
import {DataGrid} from "@mui/x-data-grid";

const BookingToday = ({bookings, checkInOrOut, excludeField, isMaid}) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    const columns = useMemo(() => {
        const allColumns = [
            {field: "roomId", headerName: "Room", flex: 0.5, minWidth: 70},
            {field: "guestFirstName", headerName: "Name", flex: 1, minWidth: 120},
            {
                field: "firstNight",
                headerName: "Check-in",
                flex: 1,
                minWidth: 160,
                renderCell: (params) => formatDate(params.value),
            },
            {
                field: "lastNight",
                headerName: "Check-out",
                flex: 1,
                minWidth: 160,
                renderCell: (params) => formatDate(params.value),
            },
            {field: "status", headerName: "Status", flex: 0.8, minWidth: 100},
        ];

        let filteredColumns = allColumns.filter((column) => column.field !== excludeField);

        if (isMaid) {
            filteredColumns.push({field: "cleanStatus", headerName: "Clean Status", flex: 0.8, minWidth: 100});
        }

        return filteredColumns;
    }, [excludeField, isMaid]);

    const rows = useMemo(
        () =>
            bookings.map((booking, index) => ({
                ...booking,
                id: index,
            })),
        [bookings]
    );

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 h-auto flex flex-col">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {checkInOrOut}
            </h2>
            <div className="flex-grow">
                <DataGrid
                    columns={columns}
                    rows={rows}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10, 20]}
                    disableSelectionOnClick
                    checkboxSelection={false}
                    className="border-none"
                    autoHeight
                    density="compact"
                />
            </div>
        </div>
    );
};

export default BookingToday;