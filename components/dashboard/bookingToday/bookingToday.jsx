import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";

const BookingToday = ({ bookings, checkInOrOut }) => {
  const columns = [
    { field: "roomId", headerName: "Room", width: 150 },
    { field: "guestFirstName", headerName: "Name", width: 200 },
    { field: "firstNight", headerName: "Check-in Date", width: 200 },
    { field: "lastNight", headerName: "Check-out Date", width: 150 },
    { field: "status", headerName: "Status", width: 150 },
  ];

  // Prepare the rows with a unique id
  const rows = bookings.map((booking, index) => ({
    ...booking,
    id: index, // Use index as a unique id
  }));

  return (
    <div className="bg-white p-5 rounded-xl mt-5">
      <h2 className="mb-5 font-bold text-[#202224]">{checkInOrOut}</h2>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          columns={columns}
          rows={rows}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          disableSelectionOnClick
          checkboxSelection={false}
        />
      </div>
    </div>
  );
};

export default BookingToday;
