import { DataGrid } from "@mui/x-data-grid";

const BookingToday = ({ bookings }) => {
  const columns = [
    { field: "Room", headerName: "Room", width: 150 },
    { field: "Name", headerName: "Name", width: 200 },
    { field: "CheckIn", headerName: "Check-in Date", width: 200 },
    { field: "CheckOut", headerName: "Check-out Date", width: 150 },
  ];
  return (
    <div className="bg-white p-5 rounded-xl mt-5" style={{ height: 400, width: '100%' }}>
      <h2 className="mb-5 font-bold text-[#202224]">Today's Bookings</h2>
      <DataGrid columns={columns} rows={bookings} />
    </div>
  );
};

export default BookingToday;