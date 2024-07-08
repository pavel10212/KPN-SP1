"use client";

import { useState, useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";

const TaskAdmin = ({ tasks }) => {
  const statusOptions = [
    "To Arrive",
    "Arrived",
    "In House",
    "Departed",
    "No Show",
    "Cancelled",
  ];

  const initialTasks = tasks.map((task) => ({
    ...task,
    id: task.id,
    status: task.status || "Booked",
    firstNight: task.firstNight
      ? new Date(task.firstNight).toISOString()
      : null,
    lastNight: task.lastNight ? new Date(task.lastNight).toISOString() : null,
  }));

  const [rows, setRows] = useState(initialTasks);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const handleEditClick = (task) => {
    setSelectedTask({ ...task });
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setSelectedTask(null);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch("/api/updateMainTasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(selectedTask),
      });

      if (!response.ok) throw new Error("Failed to update task");

      const updatedTask = await response.json();
      updateRowData(updatedTask);
      handleCloseEditDialog();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const updateRowData = useCallback((updatedTask) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === updatedTask.id ? { ...row, ...updatedTask } : row
      )
    );
  }, []);

  const handleInputChange = (field, value) => {
    setSelectedTask((prev) => {
      const updated = { ...prev, [field]: value };
      updateRowData(updated);
      return updated;
    });
  };

  const handleDeleteClick = (id) => {
    setTaskToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setTaskToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (taskToDelete) {
      setRows(rows.filter((row) => row.id !== taskToDelete));
      await fetch("/api/deleteTask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: taskToDelete }),
      });
      handleCloseDeleteDialog();
    }
  };

  const formatDate = (date) =>
    date ? dayjs(date).format("YYYY-MM-DD HH:mm:ss") : "";

  const columns = [
    { field: "roomId", headerName: "Room", width: 110 },
    { field: "guestName", headerName: "Name", width: 150 },
    {
      field: "firstNight",
      headerName: "Check-In Date",
      width: 200,
      renderCell: (params) => formatDate(params.row.firstNight),
    },
    {
      field: "lastNight",
      headerName: "Check-Out Date",
      width: 200,
      renderCell: (params) => formatDate(params.row.lastNight),
    },
    { field: "customNotes", headerName: "Notes", width: 200 },
    { field: "status", headerName: "Status", width: 130 },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEditClick(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDeleteClick(params.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <div
      className="bg-white p-5 rounded-xl mt-5"
      style={{ height: 600, width: "100%" }}
    >
      <h2 className="mb-5 font-bold text-[#202224]">Today&apos;s Tasks</h2>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        style={{ height: 500, width: "100%" }}
        autoPageSize
        rowsPerPageOptions={[5, 10, 20]}
        disableSelectionOnClick={true}
      />

      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Room"
            fullWidth
            value={selectedTask?.roomId || ""}
            onChange={(e) => handleInputChange("roomId", e.target.value)}
          />
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            value={selectedTask?.guestName || ""}
            onChange={(e) => handleInputChange("guestName", e.target.value)}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Check-In Date"
              value={
                selectedTask?.firstNight ? dayjs(selectedTask.firstNight) : null
              }
              onChange={(newValue) =>
                handleInputChange("firstNight", newValue.toISOString())
              }
              renderInput={(props) => (
                <TextField {...props} margin="dense" fullWidth />
              )}
            />
            <DateTimePicker
              label="Check-Out Date"
              value={
                selectedTask?.lastNight ? dayjs(selectedTask.lastNight) : null
              }
              onChange={(newValue) =>
                handleInputChange("lastNight", newValue.toISOString())
              }
              renderInput={(props) => (
                <TextField {...props} margin="dense" fullWidth />
              )}
            />
          </LocalizationProvider>
          <TextField
            margin="dense"
            label="Notes"
            fullWidth
            multiline
            rows={4}
            value={selectedTask?.customNotes || ""}
            onChange={(e) => handleInputChange("customNotes", e.target.value)}
          />
          <Select
            margin="dense"
            fullWidth
            value={selectedTask?.status || ""}
            onChange={(e) => handleInputChange("status", e.target.value)}
          >
            {statusOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this task? This action cannot be
          undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TaskAdmin;
