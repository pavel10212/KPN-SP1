"use client";

import React, {useEffect, useMemo, useState} from "react";
import {DataGrid} from "@mui/x-data-grid";
import {CalendarToday, CheckCircle, Search} from "@mui/icons-material";
import dayjs from "dayjs";

const AllBookings = ({bookings}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [rows, setRows] = useState([]);

    useEffect(() => {
        const formattedRows = bookings.map((booking, index) => ({
            ...booking,
            id: index,
            firstNight: booking.firstNight ? dayjs(booking.firstNight) : null,
            lastNight: booking.lastNight ? dayjs(booking.lastNight) : null,
        }));

        const sortedRows = formattedRows.sort((a, b) => {
            const dateComparison = a.firstNight.diff(b.firstNight);
            if (dateComparison !== 0) return dateComparison;
            return a.roomId.localeCompare(b.roomId, undefined, {numeric: true, sensitivity: 'base'});
        });

        setRows(sortedRows);
    }, [bookings]);

    const getStatusColor = (status) => {
        switch (status) {
            case "To Arrive":
                return "bg-yellow-100 text-yellow-800";
            case "Arrived":
                return "bg-green-100 text-green-800";
            case "In House":
                return "bg-blue-100 text-blue-800";
            case "Departed":
                return "bg-purple-100 text-purple-800";
            case "No Show":
                return "bg-red-100 text-red-800";
            case "Cancelled":
                return "bg-gray-100 text-gray-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    }

    const formatDate = (date) => date ? dayjs(date).format("DD-MM-YYYY") : "";

    const columns = useMemo(
        () => [
            {field: "roomId", headerName: "Room", flex: 0.5, minWidth: 100},
            {field: "guestFirstName", headerName: "First Name", flex: 1, minWidth: 150},
            {field: "guestName", headerName: "Last Name", flex: 1, minWidth: 150},
            {
                field: "firstNight",
                headerName: "Check-in",
                flex: 1,
                minWidth: 150,
                renderCell: (params) => formatDate(params.value),
            },
            {
                field: "lastNight",
                headerName: "Check-out",
                flex: 1,
                minWidth: 150,
                renderCell: (params) => formatDate(params.value),
            },
            {
                field: "status",
                headerName: "Status",
                flex: 0.7,
                minWidth: 120,
                renderCell: (params) => (
                    <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                            params.value
                        )}`}
                    >
            {params.value}
          </span>
                ),
            },
        ],
        []
    );

    const filteredRows = useMemo(
        () =>
            rows.filter(
                (booking) =>
                    booking.guestFirstName
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    booking.roomId.toLowerCase().includes(searchTerm.toLowerCase())
            ),
        [rows, searchTerm]
    );

    const totalBookings = filteredRows.length;
    const activeBookings = filteredRows.filter(
        (b) => b.status === "In House"
    ).length;

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 mt-5">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">All Bookings</h2>

            <div className="flex flex-wrap items-center justify-between mb-6">
                <div className="flex items-center space-x-4 mb-4 md:mb-0">
                    <div className="bg-blue-100 p-3 rounded-full">
                        <CalendarToday className="text-blue-500"/>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Total Bookings</p>
                        <p className="text-xl font-semibold">{totalBookings}</p>
                    </div>
                </div>

                <div className="flex items-center space-x-4 mb-4 md:mb-0">
                    <div className="bg-green-100 p-3 rounded-full">
                        <CheckCircle className="text-green-500"/>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Active Bookings</p>
                        <p className="text-xl font-semibold">{activeBookings}</p>
                    </div>
                </div>

                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search bookings..."
                        className="pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-2.5 text-gray-400"/>
                </div>
            </div>

            <div className="h-[400px] w-full">
                <DataGrid
                    columns={columns}
                    rows={filteredRows}
                    pageSize={10}
                    rowsPerPageOptions={[10, 25, 50]}
                    disableSelectionOnClick
                    checkboxSelection={false}
                    className="border-none"
                    sx={{
                        "& .MuiDataGrid-cell:focus": {
                            outline: "none",
                        },
                        "& .MuiDataGrid-row:hover": {
                            backgroundColor: "#f0f9ff",
                        },
                    }}
                />
            </div>
        </div>
    );
};

export default AllBookings;
