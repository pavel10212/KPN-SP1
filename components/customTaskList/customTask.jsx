import { DataGrid } from "@mui/x-data-grid";

const CustomTask = ({ tasks }) => {
  const columns = [
    { field: "taskTitle", headerName: "Task Title", width: 110 },
    { field: "guestFirstName", headerName: "First Name", width: 130 },
    { field: "guestName", headerName: "Guest Last Name", width: 130 },
    { field: "guestPhone", headerName: "Phone Number", width: 130 },
    { field: "location", headerName: "Location", width: 200 },
    { field: "taskDescription", headerName: "Description", width: 200 },
    { field: "date", headerName: "Time and Date", width: 200 },
    { field: "status", headerName: "Status", width: 120 },
  ];
  const rows = tasks.map((task, index) => ({
    ...task,
    id: index,
  }));
  return (
    <div className="bg-white p-5 rounded-xl mt-5">
      <h2 className="mb-5 font-bold text-[#202224]">Custom Tasks</h2>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          checkboxSelection
          rowsPerPageOptions={[5, 10, 20]}
        />
      </div>
    </div>
  );
};

export default CustomTask;
