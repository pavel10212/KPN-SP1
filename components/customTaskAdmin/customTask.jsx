"use client";

import { useState } from "react";
import { DataGrid, gridClasses } from "@mui/x-data-grid";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Box,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { toast } from "sonner";

const CustomTask = ({ tasks, isAdmin }) => {
  const [rows, setRows] = useState(
    tasks.map((task) => ({
      ...task,
      id: task.id,
      date: task.date ? dayjs(task.date) : null,
    }))
  );
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
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
    try {
      const taskToUpdate = isAdmin
        ? { ...selectedTask, date: selectedTask.date.toISOString() }
        : { id: selectedTask.id, status: selectedTask.status };

      const response = await fetch("/api/updateCustomTasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskToUpdate),
      });

      if (!response.ok) throw new Error("Failed to update task");

      const { task: updatedTask } = await response.json();
      updateRowData(
        isAdmin
          ? { ...updatedTask, date: dayjs(updatedTask.date) }
          : updatedTask
      );

      await sendNotification(updatedTask.role, {
        title: "Task Updated",
        message: `Task "${updatedTask.taskTitle}" has been updated`,
      });

      if (
        (updatedTask.role === "Maintenance" &&
          updatedTask.status === "Completed") ||
        (updatedTask.role === "Driver" && updatedTask.status === "Dropped Off")
      ) {
        await sendNotification("admin", {
          title: "Task Completed",
          message: `${updatedTask.role} task "${
            updatedTask.taskTitle
          }" has been ${updatedTask.status.toLowerCase()}`,
        });
      }

      handleCloseDialog();
      toast.success("Task updated successfully");
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
    }
  };

  const sendNotification = async (target, { title, message }) => {
    try {
      const notification = await fetch(
        `/api/notificationTabSend/?who=${target}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, message }),
        }
      );

      if (!notification.ok)
        throw new Error(`Failed to send notification to ${target}`);
    } catch (error) {
      console.error(`Error sending notification to ${target}:`, error);
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
    try {
      const response = await fetch("/api/deleteCustomTask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: taskToDelete.id }),
      });

      if (!response.ok) throw new Error("Failed to delete task");

      setRows((prevRows) =>
        prevRows.filter((row) => row.id !== taskToDelete.id)
      );
      toast.success("Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
    } finally {
      setDeleteConfirmOpen(false);
      setTaskToDelete(null);
    }
  };

  const handleInputChange = (field, value) => {
    setSelectedTask((prev) => ({ ...prev, [field]: value }));
  };

  const formatDate = (date) =>
    date ? dayjs(date).format("DD-MM-YYYY HH:mm") : "";

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
    {
      field: "updatedAt",
      headerName: "Last Updated",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => formatDate(params.row.updatedAt),
    },
    { field: "status", headerName: "Status", flex: 0.8, minWidth: 100 },
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
          {isAdmin && (
            <IconButton
              onClick={() => {
                setTaskToDelete(params.row);
                setDeleteConfirmOpen(true);
              }}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </>
      ),
    },
  ];

  return (
    <div className="bg-white p-5 rounded-xl mt-1">
      <div style={{ width: "100%", overflow: "hidden" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          autoHeight
          getRowHeight={() => "auto"}
          getEstimatedRowHeight={() => 100}
          sx={{
            [`& .${gridClasses.cell}`]: {
              py: 1,
            },
          }}
          rowsPerPageOptions={[5, 10, 20]}
          disableSelectionOnClick
          className="border-none"
        />
      </div>
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
          {isAdmin ? "Edit Task" : "Update Status"}
        </DialogTitle>
        <DialogContent sx={{ padding: "16px 24px", paddingTop: "16px" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              marginTop: "8px",
            }}
          >
            {isAdmin && (
              <>
                <TextField
                  label="Task Title"
                  fullWidth
                  variant="outlined"
                  value={selectedTask?.taskTitle || ""}
                  onChange={(e) =>
                    handleInputChange("taskTitle", e.target.value)
                  }
                />
                <TextField
                  label="Location"
                  fullWidth
                  variant="outlined"
                  value={selectedTask?.location || ""}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                />
                <TextField
                  label="Phone Number"
                  fullWidth
                  variant="outlined"
                  value={selectedTask?.guestPhone || ""}
                  onChange={(e) =>
                    handleInputChange("guestPhone", e.target.value)
                  }
                />
                <TextField
                  label="Description"
                  fullWidth
                  variant="outlined"
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
                      <TextField {...props} fullWidth variant="outlined" />
                    )}
                  />
                </LocalizationProvider>
              </>
            )}
            <TextField
              select
              label="Status"
              fullWidth
              variant="outlined"
              value={selectedTask?.status || ""}
              onChange={(e) => handleInputChange("status", e.target.value)}
            >
              <MenuItem value="">Select Status</MenuItem>
              {selectedTask?.role === "Driver"
                ? ["Assigned", "Accepted", "Picked Up", "Dropped Off"].map(
                    (status) => (
                      <MenuItem key={status} value={status}>
                        {status}
                      </MenuItem>
                    )
                  )
                : selectedTask?.role === "Maintenance"
                ? ["Assigned", "In Progress", "Completed"].map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))
                : null}
            </TextField>
          </Box>
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
              "&:hover": { backgroundColor: "#4338CA" },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {isAdmin && (
        <Dialog
          open={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
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
            Delete Task
          </DialogTitle>
          <DialogContent sx={{ padding: "16px 24px", paddingTop: "16px" }}>
            Are you sure you want to delete this task?
          </DialogContent>
          <DialogActions
            sx={{ padding: "16px 24px", backgroundColor: "#f3f4f6" }}
          >
            <Button
              onClick={() => setDeleteConfirmOpen(false)}
              sx={{ color: "#6B7280" }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteTask}
              variant="contained"
              sx={{
                backgroundColor: "#4F46E5",
                "&:hover": { backgroundColor: "#4338CA" },
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default CustomTask;
