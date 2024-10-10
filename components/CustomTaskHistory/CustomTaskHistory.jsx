"use client";

import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { MdArrowBack } from "react-icons/md";


const CustomTaskHistory = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchTasks();
    console.log(tasks);
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/getCompletedCustomTasks");
      if (!response.ok) throw new Error("Failed to fetch tasks");
      const data = await response.json();
      const tasksWithParsedDates = data.map((task) => ({
        ...task,
        updatedAt: dayjs(task.updatedAt).isValid()
          ? dayjs(task.updatedAt).toDate()
          : null,
      }));
      setTasks(tasksWithParsedDates);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) =>
    date ? dayjs(date).format("DD-MM-YYYY HH:mm") : "";

  const columns = [
    { field: "taskTitle", headerName: "Task Title", flex: 1, minWidth: 150 },
    { field: "guestName", headerName: "Guest Name", flex: 1, minWidth: 150 },
    { field: "location", headerName: "Location", flex: 1, minWidth: 150 },
    {
      field: "updatedAt",
      headerName: "Completion Date",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => formatDate(params.value),
    },
    { field: "role", headerName: "Assigned Role", flex: 1, minWidth: 150 },
  ];

  return (
    <div
      className="bg-white p-5 rounded-xl mt-1 relative"
      style={{ height: 620, width: "100%" }}
    >
      <h2 className="text-2xl font-semibold mb-4">History</h2>
      <button
        onClick={() => router.push("/dashboard/task")}
        className="absolute top-2 right-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center"
      >
        <MdArrowBack className="mr-2" /> Back
      </button>
      <DataGrid
        rows={tasks}
        columns={columns}
        pageSize={5}
        style={{ height: 530, width: "100%" }}
        autoPageSize
        rowsPerPageOptions={[5, 10, 20]}
        disableSelectionOnClick
        loading={loading}
        getRowId={(row) => row.id}
      />
    </div>
  );
};

export default CustomTaskHistory;
