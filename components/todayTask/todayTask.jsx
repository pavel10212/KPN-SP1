"use client";

import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CustomNotesDialog from "../customNotesDialog/customNotesDialog";
import { Button, Tooltip, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

const TodayTask = ({ tasks }) => {
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
  }));

  const [rows, setRows] = useState(initialTasks);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [openExpandedNote, setOpenExpandedNote] = useState(false);
  const [expandedNote, setExpandedNote] = useState("");

  const handleStatusChange = async (id, newStatus) => {
    const updatedRows = rows.map((row) => {
      if (row.id === id) {
        return { ...row, status: newStatus };
      }
      return row;
    });
    setRows(updatedRows);

    await fetch("/api/updateTaskStatus", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, newStatus }),
    });
  };

  const handleOpenDialog = (task) => {
    setSelectedTask(task);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedTask(null);
  };

  const handleSaveNotes = async (newNotes) => {
    const updatedRows = rows.map((row) => {
      if (row.id === selectedTask.id) {
        return { ...row, customNotes: newNotes };
      }
      return row;
    });
    setRows(updatedRows);

    await fetch("/api/updateTaskStatus", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: selectedTask.id, customNotes: newNotes }),
    });
    handleCloseDialog();
  };

  const handleExpandNote = (note) => {
    setExpandedNote(note);
    setOpenExpandedNote(true);
  };

  const columns = [
    { field: "roomId", headerName: "Room", width: 110 },
    { field: "guestName", headerName: "Name", width: 150 },
    { field: "firstNight", headerName: "Check-In Date", width: 130 },
    { field: "lastNight", headerName: "Check-Out Date", width: 130 },
    {
      field: "customNotes",
      headerName: "Notes",
      width: 200,
      renderCell: (params) => (
        <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
          <Tooltip title={params.value || "No notes"}>
            <div
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                flexGrow: 1,
                cursor: "pointer",
              }}
              onClick={() => handleExpandNote(params.value)}
            >
              {params.value || "No notes"}
            </div>
          </Tooltip>
          <IconButton size="small" onClick={() => handleOpenDialog(params.row)}>
            <EditIcon fontSize="small" />
          </IconButton>
        </div>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 200,
      renderCell: (params) => (
        <Select
          labelId={`status-select-label-${params.id}`}
          id={`status-select-${params.id}`}
          value={params.value}
          onChange={(event) =>
            handleStatusChange(params.id, event.target.value)
          }
          size="small"
          fullWidth
        >
          {statusOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      ),
    },
  ];

  return (
    <div className="bg-white p-5 rounded-xl mt-5">
      <h2 className="mb-5 font-bold text-[#202224]">Today's Tasks</h2>
      <div style={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          autoPageSize
          rowsPerPageOptions={[5, 10, 20]}
          disableSelectionOnClick={true}
        />
      </div>
      <CustomNotesDialog
        open={openDialog}
        onClose={handleCloseDialog}
        onSave={handleSaveNotes}
        initialNotes={selectedTask?.customNotes || ""}
      />
      <Dialog
        open={openExpandedNote}
        onClose={() => setOpenExpandedNote(false)}
      >
        <DialogTitle>Note Details</DialogTitle>
        <DialogContent>{expandedNote || "No notes"}</DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenExpandedNote(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TodayTask;
