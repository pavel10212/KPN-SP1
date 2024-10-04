"use client";

import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import dayjs from "dayjs";

const CustomTaskHistory = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    console.log(tasks, "tasks")
  }, [tasks]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/getCompletedCustomTasks");
      if (!response.ok) throw new Error("Failed to fetch tasks");
      const data = await response.json();
      const tasksWithParsedDates = data.map(task => ({
        ...task,
        updatedAt: dayjs(task.updatedAt).isValid() ? dayjs(task.updatedAt).toDate() : null
      }));
      setTasks(tasksWithParsedDates);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: "taskTitle", headerName: "Task Title", flex: 1 },
    { field: "guestName", headerName: "Guest Name", flex: 1 },
    { field: "location", headerName: "Location", flex: 1 },
    {
      field: "updatedAt",
      headerName: "Completion Date",
      flex: 1,
      valueGetter: (params) => dayjs(params.value).format("DD-MM-YYYY HH:mm")
    },
    { field: "role", headerName: "Assigned Role", flex: 1 },
  ];

  return (
    <div className="bg-white p-5 rounded-xl mt-1">
      <h1>Custom Task History</h1>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={tasks}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          loading={loading}
          getRowId={(row) => row.id}
        />
      </div>
    </div>
  );
};

export default CustomTaskHistory;
