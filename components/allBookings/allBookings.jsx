import React from "react";
import { DataGrid } from "@mui/x-data-grid";

const AllBookings = ({ bookings }) => {
  const columns = [
    { field: "roomId", headerName: "Room", width: 150 },
    { field: "guestFirstName", headerName: "Name", width: 200 },
    { field: "firstNight", headerName: "Check-in Date", width: 200 },
    { field: "lastNight", headerName: "Check-out Date", width: 200 },
    { field: "status", headerName: "Status", width: 150 },
  ];

  const rows = bookings.map((booking, index) => ({
    ...booking,
    id: index,
  }));

  return (
    <div className="bg-white p-5 rounded-xl mt-5">
      <h2 className="mb-5 font-bold text-[#202224]">All Bookings</h2>
      <div style={{ height: 1000, width: "100%" }}>
        <DataGrid
          columns={columns}
          rows={rows}
          rowsPerPageOptions={[5, 10, 20]}
          disableSelectionOnClick
          checkboxSelection={false}
        />
      </div>
    </div>
  );
};

export default AllBookings;
