"use client";

import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  IconButton,
  TextField,
  Tooltip,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import dayjs from "dayjs";

const MainTasks = ({ tasks }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const sortedRows = tasks
      .map((task) => ({
        ...task,
        firstNight: task.firstNight ? dayjs(task.firstNight) : null,
        lastNight: task.lastNight ? dayjs(task.lastNight) : null,
      }))
      .filter((task) => task.firstNight && task.firstNight.isAfter(dayjs().subtract(5, 'day')))
      .sort((a, b) => a.firstNight.diff(b.firstNight));
    setRows(sortedRows);
  }, [tasks]);

  const handleOpenDialog = (task) => {
    if (dayjs(task.firstNight).isAfter(dayjs())) return;
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
          row.id === updatedTask.booking.id
            ? {
              ...row,
              ...updatedTask.booking,
              firstNight: dayjs(updatedTask.booking.firstNight),
              lastNight: dayjs(updatedTask.booking.lastNight),
            }
            : row
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

  const formatDate = (date) => (date ? dayjs(date).format("DD-MM-YYYY HH:mm") : "");

  const columns = [
    { field: "roomId", headerName: "Room", flex: 0.5, minWidth: 70 },
    { field: "guestFirstName", headerName: "First Name", flex: 1, minWidth: 120 },
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
    { field: "cleanStatus", headerName: "Clean Status", flex: 0.8, minWidth: 100 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.7,
      minWidth: 100,
      renderCell: (params) => {
        const canEdit = !dayjs(params.row.firstNight).isAfter(dayjs());
        return (
          <Tooltip title={canEdit ? "Edit" : "Cannot edit future tasks"}>
            <span>
              <IconButton onClick={() => handleOpenDialog(params.row)} disabled={!canEdit}>
                <EditIcon />
              </IconButton>
            </span>
          </Tooltip>
        );
      },
    },
  ];

  return (
    <div
      className="bg-white p-5 rounded-xl mt-1"
      style={{ height: 690, width: "100%" }}
    >
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        style={{ height: 631, width: "100%" }}
        autoPageSize
        rowsPerPageOptions={[5, 10, 20]}
        disableSelectionOnClick
      />
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
        <DialogContent sx={{ padding: "16px 24px", paddingTop: "16px" }}>
          <TextField
            select
            label="Clean Status"
            fullWidth
            variant="outlined"
            value={selectedTask?.cleanStatus || ""}
            onChange={(e) => handleInputChange("cleanStatus", e.target.value)}
            sx={{ marginTop: "16px" }}
          >
            <MenuItem value="To Clean">To Clean</MenuItem>
            <MenuItem value="Cleaned">Cleaned</MenuItem>
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
              "&:hover": { backgroundColor: "#4338CA" },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MainTasks;
