"use client";

import {useState} from "react";
import {DataGrid} from "@mui/x-data-grid";
import dayjs from "dayjs";
import {useSession} from "next-auth/react";

const DriverMaintenanceTasks = ({user, userTasks}) => {
    const {data: session} = useSession()
    const [rows] = useState(
        userTasks.map((task) => ({
            ...task,
            id: task.id,
            date: task.date ? new Date(task.date).toISOString() : null,
        }))
    );

    const formatDate = (date) =>
        date ? dayjs(date).format("YYYY-MM-DD HH:mm:ss") : "";

    const columnsIfDriver = [
        {field: "taskTitle", headerName: "Task Title", width: 200},
        {field: "guestFirstName", headerName: "Guest First Name", width: 150},
        {field: "guestName", headerName: "Guest Last Name", width: 150},
        {field: "guestPhone", headerName: "Phone Number", width: 150},
        {field: "location", headerName: "Location", width: 200},
        {
            field: "date",
            headerName: "Date & Time",
            width: 200,
            renderCell: (params) => formatDate(params.row.date),
        },
        {field: "taskDescription", headerName: "Description", width: 300},
        {field: "status", headerName: "Status", width: 120},
    ];
    const columnsIfMaintenance = [
        {field: "taskTitle", headerName: "Task Title", width: 200},
        {field: "location", headerName: "Location", width: 200},
        {
            field: "date",
            headerName: "Date & Time",
            width: 200,
            renderCell: (params) => formatDate(params.row.date),
        },
        {field: "taskDescription", headerName: "Description", width: 300},
        {field: "status", headerName: "Status", width: 120},
    ];

    return (
        <div className="bg-white p-5 rounded-xl mt-5">
            <h2 className="mb-5 font-bold text-[#202224]">
                {user.role === "Driver" ? "Driver Tasks" : "Maintenance Tasks"}
            </h2>
            <div style={{height: 300, width: "100%"}}>
                <DataGrid
                    rows={rows}
                    columns={user.role === "Driver" ? columnsIfDriver : columnsIfMaintenance}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10, 20]}
                    checkboxSelection={false}
                    disableSelectionOnClick
                />
            </div>
        </div>
    );
};

export default DriverMaintenanceTasks;
