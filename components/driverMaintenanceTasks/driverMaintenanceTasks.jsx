"use client";

import React, {useState} from "react";
import {DataGrid} from "@mui/x-data-grid";
import dayjs from "dayjs";

const DriverMaintenanceTasks = ({ user, userTasks }) => {
  const [rows] = useState(
    userTasks.map((task) => ({
      ...task,
      id: task.id,
      date: task.date ? new Date(task.date).toISOString() : null,
    }))
  );

  const formatDate = (date) =>
    date ? dayjs(date).format("YYYY-MM-DD HH:mm:ss") : "";

  const columns = [
    { field: "taskTitle", headerName: "Task Title", width: 200 },
    { field: "guestFirstName", headerName: "Guest First Name", width: 150 },
    { field: "guestName", headerName: "Guest Last Name", width: 150 },
    { field: "guestPhone", headerName: "Phone Number", width: 150 },
    { field: "location", headerName: "Location", width: 200 },
    {
      field: "date",
      headerName: "Date & Time",
      width: 200,
      renderCell: (params) => formatDate(params.row.date),
    },
    { field: "taskDescription", headerName: "Description", width: 300 },
    { field: "status", headerName: "Status", width: 120 },
  ];

  return (
    <div className="bg-white p-5 rounded-xl mt-5">
      <h2 className="mb-5 font-bold text-[#202224]">
        {user.role === "Driver" ? "Driver Tasks" : "Maintenance Tasks"}
      </h2>
      <div style={{ height: 300, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
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
