"use client";

import React, {useState} from "react";
import {DataGrid} from "@mui/x-data-grid";
import {Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select,} from "@mui/material";
import {MdEdit} from "react-icons/md";
import dayjs from "dayjs";
import {Button} from "@/components/ui/button";

const MainTasks = ({ tasks, canEditStatus }) => {
  const [rows, setRows] = useState(tasks);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  const handleOpenDialog = (task) => {
    setSelectedTask(task);
    setNewStatus(task.status);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTask(null);
    setNewStatus("");
  };

  const handleStatusChange = async () => {
    if (!selectedTask || newStatus === selectedTask.status) {
      handleCloseDialog();
      return;
    }

    try {
      const response = await fetch("/api/updateMainTasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedTask.id, status: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update task status");
      await response.json();
// Update the local state immediately
      setRows((prevRows) =>
        prevRows.map((row) =>
          row.id === selectedTask.id ? { ...row, status: newStatus } : row
        )
      );

      handleCloseDialog();
    } catch (error) {
      console.error("Error updating task status:", error);
      // Optionally, show an error message to the user
    }
  };

  const columns = [
    { field: "roomId", headerName: "Room", width: 100 },
    { field: "guestFirstName", headerName: "First Name", width: 130 },
    { field: "guestName", headerName: "Last Name", width: 130 },
    {
      field: "firstNight",
      headerName: "Check-In",
      width: 180,
      valueFormatter: (params) =>
        dayjs(params.value).format("YYYY-MM-DD HH:mm"),
    },
    {
      field: "lastNight",
      headerName: "Check-Out",
      width: 180,
      valueFormatter: (params) =>
        dayjs(params.value).format("YYYY-MM-DD HH:mm"),
    },
    { field: "customNotes", headerName: "Notes", width: 200 },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      renderCell: (params) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(
            params.value
          )}`}
        >
          {params.value}
        </span>
      ),
    },
    ...(canEditStatus
      ? [
          {
            field: "actions",
            headerName: "Actions",
            width: 100,
            renderCell: (params) => (
              <Button
                onClick={() => handleOpenDialog(params.row)}
                variant="ghost"
                className="p-1"
              >
                <MdEdit
                  className="text-gray-600 hover:text-indigo-600"
                  size={20}
                />
              </Button>
            ),
          },
        ]
      : []),
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "To Arrive":
        return "bg-yellow-100 text-yellow-800";
      case "Arrived":
        return "bg-green-100 text-green-800";
      case "In House":
        return "bg-blue-100 text-blue-800";
      case "Departed":
        return "bg-purple-100 text-purple-800";
      case "No Show":
        return "bg-red-100 text-red-800";
      case "Cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Main Tasks</h2>
      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={7}
          rowsPerPageOptions={[7, 14, 21]}
          disableSelectionOnClick
          className="border-none"
          sx={{
            "& .MuiDataGrid-cell:focus": {
              outline: "none",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#f3f4f6",
            },
          }}
        />
      </div>
      {canEditStatus && (
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          PaperProps={{
            style: {
              borderRadius: "0.5rem",
              padding: "1rem",
            },
          }}
        >
          <DialogTitle className="text-xl font-semibold text-gray-800">
            Edit Task Status
          </DialogTitle>
          <DialogContent>
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              fullWidth
              className="mt-4"
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
            <Button onClick={handleCloseDialog} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleStatusChange} variant="default">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default MainTasks;
