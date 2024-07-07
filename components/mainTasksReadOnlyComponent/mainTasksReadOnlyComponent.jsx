"use client";

import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import dayjs from "dayjs";

const MainTasksReadOnly = ({ tasks, canEditStatus }) => {
  const [rows, setRows] = useState(tasks);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleOpenDialog = (task) => {
    setSelectedTask(task);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTask(null);
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const response = await fetch("/api/updateTaskStatus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedTask.id, status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update task status");

      const updatedTask = await response.json();
      setRows(
        rows.map((row) =>
          row.id === updatedTask.id
            ? { ...row, status: updatedTask.status }
            : row
        )
      );
      handleCloseDialog();
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const columns = [
    { field: "roomId", headerName: "Room", width: 110 },
    { field: "guestFirstName", headerName: "First Name", width: 130 },
    { field: "guestName", headerName: "Last Name", width: 130 },
    {
      field: "firstNight",
      headerName: "Check-In Date",
      width: 180,
      valueFormatter: (params) =>
        dayjs(params.value).format("YYYY-MM-DD HH:mm"),
    },
    {
      field: "lastNight",
      headerName: "Check-Out Date",
      width: 180,
      valueFormatter: (params) =>
        dayjs(params.value).format("YYYY-MM-DD HH:mm"),
    },
    { field: "customNotes", headerName: "Notes", width: 200 },
    { field: "status", headerName: "Status", width: 120 },
    ...(canEditStatus
      ? [
          {
            field: "actions",
            headerName: "Actions",
            width: 100,
            renderCell: (params) => (
              <IconButton onClick={() => handleOpenDialog(params.row)}>
                <EditIcon />
              </IconButton>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="bg-white p-5 rounded-xl mt-5">
      <h2 className="mb-5 font-bold text-[#202224]">Main Tasks</h2>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          disableSelectionOnClick
        />
      </div>
      {canEditStatus && (
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Edit Task Status</DialogTitle>
          <DialogContent>
            <Select
              value={selectedTask?.status || ""}
              onChange={(e) => handleStatusChange(e.target.value)}
              fullWidth
            >
              <MenuItem value="To Arrive">To Arrive</MenuItem>
              <MenuItem value="Arrived">Arrived</MenuItem>
              <MenuItem value="In House">In House</MenuItem>
              <MenuItem value="Departed">Departed</MenuItem>
              <MenuItem value="No Show">No Show</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </Select>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default MainTasksReadOnly;
