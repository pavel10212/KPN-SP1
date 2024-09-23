"use client";

import { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Select,
  Snackbar,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs from "dayjs";

const CustomTask = ({ tasks, readOnly = false, isAdmin = false }) => {
  const [rows, setRows] = useState(
    tasks.map((task) => ({
      ...task,
      id: task.id,
      date: task.date ? dayjs(task.date) : null,
    }))
  );
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [snackbar, setSnackbar] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  const handleOpenDialog = (task) => {
    setSelectedTask({ ...task, date: dayjs(task.date) });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTask(null);
  };

  const handleSaveChanges = async () => {
    if (readOnly) return;
    try {
      const taskToUpdate = {
        ...selectedTask,
        date: selectedTask.date.toISOString(),
      };

      const response = await fetch("/api/updateCustomTasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskToUpdate),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      const { task: updatedTask } = await response.json();
      updateRowData({ ...updatedTask, date: dayjs(updatedTask.date) });
      handleCloseDialog();
      setSnackbar({
        message: "Task updated successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error updating task:", error);
      setSnackbar({ message: "Failed to update task", severity: "error" });
    }
  };

  const updateRowData = (updatedTask) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === updatedTask.id ? { ...row, ...updatedTask } : row
      )
    );
  };

  const handleDeleteTask = async () => {
    if (readOnly || !taskToDelete) return;
    try {
      const response = await fetch("/api/deleteCustomTask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: taskToDelete.id }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      setRows((prevRows) =>
        prevRows.filter((row) => row.id !== taskToDelete.id)
      );
      setSnackbar({
        message: "Task deleted successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting task:", error);
      setSnackbar({ message: "Failed to delete task", severity: "error" });
    } finally {
      setDeleteConfirmOpen(false);
      setTaskToDelete(null);
    }
  };

  const handleInputChange = (field, value) => {
    if (readOnly) return;
    setSelectedTask((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const formatDate = (date) =>
    date ? dayjs(date).format("YYYY-MM-DD HH:mm:ss") : "";

  const columns = [
    { field: "taskTitle", headerName: "Task Title", flex: 1, minWidth: 110 },
    {
      field: "guestFirstName",
      headerName: "First Name",
      flex: 1,
      minWidth: 110,
    },
    {
      field: "guestName",
      headerName: "Guest Last Name",
      flex: 1,
      minWidth: 130,
    },
    { field: "guestPhone", headerName: "Phone Number", flex: 1, minWidth: 130 },
    { field: "location", headerName: "Location", flex: 1, minWidth: 150 },
    {
      field: "taskDescription",
      headerName: "Description",
      flex: 1.5,
      minWidth: 200,
    },
    {
      field: "date",
      headerName: "Time and Date",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => formatDate(params.row.date),
    },
    { field: "status", headerName: "Status", flex: 0.8, minWidth: 100 },
    ...(isAdmin
      ? [{ field: "role", headerName: "Assigned Role", flex: 1, minWidth: 130 }]
      : []),
    ...(!readOnly
      ? [
          {
            field: "actions",
            headerName: "Actions",
            flex: 0.7,
            minWidth: 100,
            renderCell: (params) => (
              <>
                <IconButton onClick={() => handleOpenDialog(params.row)}>
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={() => {
                    setTaskToDelete(params.row);
                    setDeleteConfirmOpen(true);
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </>
            ),
          },
        ]
      : []),
  ];

  return (
    <div className="bg-white p-5 rounded-xl mt-1">
      <div style={{ height: 490, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          style={{ height: 475, width: "100%" }}
          autoPageSize
          rowsPerPageOptions={[5, 10, 20]}
          disableSelectionOnClick={true}
        />
      </div>
      {!readOnly && (
        <>
          <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogContent>
              <TextField
                margin="dense"
                label="Task Title"
                type="text"
                fullWidth
                value={selectedTask?.taskTitle || ""}
                onChange={(e) => handleInputChange("taskTitle", e.target.value)}
              />
              <TextField
                margin="dense"
                label="Location"
                type="text"
                fullWidth
                value={selectedTask?.location || ""}
                onChange={(e) => handleInputChange("location", e.target.value)}
              />
              <TextField
                margin="dense"
                label="Phone Number"
                type="text"
                fullWidth
                value={selectedTask?.guestPhone || ""}
                onChange={(e) =>
                  handleInputChange("guestPhone", e.target.value)
                }
              />
              <TextField
                margin="dense"
                label="Description"
                type="text"
                fullWidth
                multiline
                rows={4}
                value={selectedTask?.taskDescription || ""}
                onChange={(e) =>
                  handleInputChange("taskDescription", e.target.value)
                }
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Date & Time"
                  value={selectedTask?.date}
                  onChange={(newValue) => handleInputChange("date", newValue)}
                  renderInput={(props) => (
                    <TextField {...props} margin="dense" fullWidth />
                  )}
                />
              </LocalizationProvider>
              <Select
                margin="dense"
                fullWidth
                value={selectedTask?.status || ""}
                onChange={(e) => handleInputChange("status", e.target.value)}
              >
                <MenuItem value="Assigned">Assigned</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </Select>
              {isAdmin && (
                <Select
                  margin="dense"
                  fullWidth
                  value={selectedTask?.role || ""}
                  onChange={(e) => handleInputChange("role", e.target.value)}
                >
                  <MenuItem value="Driver">Driver</MenuItem>
                  <MenuItem value="Maintenance">Maintenance</MenuItem>
                </Select>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cancel</Button>
              <Button
                onClick={handleSaveChanges}
                variant="contained"
                color="primary"
              >
                Save
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            open={deleteConfirmOpen}
            onClose={() => setDeleteConfirmOpen(false)}
          >
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
              Are you sure you want to delete this task?
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteConfirmOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleDeleteTask} color="error">
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
      <Snackbar
        open={!!snackbar}
        autoHideDuration={6000}
        onClose={() => setSnackbar(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        {snackbar && (
          <Alert
            onClose={() => setSnackbar(null)}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        )}
      </Snackbar>
    </div>
  );
};

export default CustomTask;
