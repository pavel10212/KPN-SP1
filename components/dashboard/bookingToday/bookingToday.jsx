"use client";

import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";

const BookingToday = ({ bookings, checkInOrOut }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const columns = [
    { field: "roomId", headerName: "Room", width: 100 },
    { field: "guestFirstName", headerName: "Name", width: 150 },
    {
      field: "firstNight",
      headerName: "Check-in",
      width: 180,
      renderCell: (params) => formatDate(params.value),
    },
    {
      field: "lastNight",
      headerName: "Check-out",
      width: 180,
      renderCell: (params) => formatDate(params.value),
    },
    { field: "status", headerName: "Status", width: 120 },
  ];

  const [rows] = useState(
    bookings.map((booking, index) => ({
      ...booking,
      id: index,
    }))
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        {checkInOrOut}
      </h2>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          columns={columns}
          rows={rows}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          disableSelectionOnClick
          checkboxSelection={false}
          className="border-none"
        />
      </div>
    </div>
  );
};

export default BookingToday;
