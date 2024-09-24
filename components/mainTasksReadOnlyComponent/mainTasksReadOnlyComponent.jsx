"use client";

import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  IconButton,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import dayjs from "dayjs";
import { Button } from "@mui/material";

const MainTasks = ({ tasks, canEditStatus }) => {
  const [rows, setRows] = useState(
    tasks.map((task) => ({
      ...task,
      id: task.id,
      firstNight: task.firstNight ? dayjs(task.firstNight) : null,
      lastNight: task.lastNight ? dayjs(task.lastNight) : null,
    }))
  );
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleOpenDialog = (task) => {
    setSelectedTask({ ...task });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTask(null);
  };

  const handleSaveChanges = async () => {
    try {
      const response = await fetch("/api/updateMainTasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedTask),
      });

      if (!response.ok) throw new Error("Failed to update task");
      const updatedTask = await response.json();

      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === updatedTask.id ? { ...row, ...updatedTask } : row
        )
      );

      handleCloseDialog();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setSelectedTask((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatDate = (date) =>
    date ? dayjs(date).format("YYYY-MM-DD HH:mm:ss") : "";

  const columns = [
    { field: "roomId", headerName: "Room", flex: 0.5, minWidth: 70 },
    {
      field: "guestFirstName",
      headerName: "First Name",
      flex: 1,
      minWidth: 120,
    },
    { field: "guestName", headerName: "Last Name", flex: 1, minWidth: 120 },
    {
      field: "firstNight",
      headerName: "Check-In Date",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => formatDate(params.row.firstNight),
    },
    {
      field: "lastNight",
      headerName: "Check-Out Date",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => formatDate(params.row.lastNight),
    },
    { field: "customNotes", headerName: "Notes", flex: 1, minWidth: 150 },
    { field: "status", headerName: "Status", flex: 0.8, minWidth: 100 },
    ...(canEditStatus
      ? [
          {
            field: "actions",
            headerName: "Actions",
            flex: 0.7,
            minWidth: 100,
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
    <div
      className="bg-white p-5 rounded-xl mt-1"
      style={{ height: 530, width: "100%" }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        style={{ height: 475, width: "100%" }}
        autoPageSize
        rowsPerPageOptions={[5, 10, 20]}
        disableSelectionOnClick={true}
      />

      {canEditStatus && (
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle
            sx={{
              backgroundColor: "#f3f4f6",
              padding: "16px 24px",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            Edit Task
          </DialogTitle>
          <DialogContent
            sx={{
              padding: "16px 24px",
              paddingTop: "16px",
            }}
          >
            <TextField
              select
              label="Status"
              fullWidth
              variant="outlined"
              value={selectedTask?.status || ""}
              onChange={(e) => handleInputChange("status", e.target.value)}
              sx={{ marginTop: "16px" }}
            >
              <MenuItem value="To Arrive">To Arrive</MenuItem>
              <MenuItem value="Arrived">Arrived</MenuItem>
              <MenuItem value="In House">In House</MenuItem>
              <MenuItem value="Departed">Departed</MenuItem>
              <MenuItem value="No Show">No Show</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions
            sx={{ padding: "16px 24px", backgroundColor: "#f3f4f6" }}
          >
            <Button onClick={handleCloseDialog} sx={{ color: "#6B7280" }}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveChanges}
              variant="contained"
              sx={{
                backgroundColor: "#4F46E5",
                "&:hover": {
                  backgroundColor: "#4338CA",
                },
              }}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default MainTasks;
