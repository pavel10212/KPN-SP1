"use client";

import { useState, useEffect, useRef } from "react";
import { DataGrid } from "@mui/x-data-grid";
import dayjs from "dayjs";

const DriverMaintenanceTasks = ({ user, userTasks }) => {
  const [rows] = useState(
    userTasks.map((task) => ({
      ...task,
      date: task.date ? new Date(task.date).toISOString() : null,
    }))
  );
  const gridRef = useRef(null);

  const formatDate = (date) =>
    date ? dayjs(date).format("DD-MM-YYYY HH:mm") : "";

  const commonColumns = [
    { field: "taskTitle", headerName: "Task Title", flex: 1, minWidth: 150 },
    { field: "location", headerName: "Location", flex: 1, minWidth: 150 },
    {
      field: "date",
      headerName: "Date & Time",
      flex: 1,
      minWidth: 180,
      renderCell: (params) => formatDate(params.row.date),
    },
    {
      field: "taskDescription",
      headerName: "Description",
      flex: 1.5,
      minWidth: 200,
    },
    { field: "status", headerName: "Status", flex: 0.8, minWidth: 120 },
  ];

  const driverColumns = [
    {
      field: "guestFirstName",
      headerName: "Guest First Name",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "guestName",
      headerName: "Guest Last Name",
      flex: 1,
      minWidth: 150,
    },
    { field: "guestPhone", headerName: "Phone Number", flex: 1, minWidth: 150 },
  ];

  const columns =
    user.role === "Driver"
      ? [...commonColumns, ...driverColumns]
      : commonColumns;

  useEffect(() => {
    const resizeGrid = () => {
      if (gridRef.current && gridRef.current.api) {
        const newColumnWidths = columns.map((col) => ({
          field: col.field,
          width: gridRef.current.clientWidth / columns.length,
        }));
        gridRef.current.api.setColumnWidths(newColumnWidths);
      }
    };

    resizeGrid();
    window.addEventListener("resize", resizeGrid);

    return () => {
      window.removeEventListener("resize", resizeGrid);
    };
  }, [columns]);

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 h-auto flex flex-col">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        {user.role === "Driver" ? "Driver Tasks" : "Maintenance Tasks"}
      </h2>
      <div style={{ height: "auto", width: "100%" }}>
        <DataGrid
          ref={gridRef}
          columns={columns}
          rows={rows}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          checkboxSelection={false}
          disableSelectionOnClick
          className="border-none"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f3f4f6",
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: "#ffffff",
            },
          }}
        />
      </div>
    </div>
  );
};

export default DriverMaintenanceTasks;
