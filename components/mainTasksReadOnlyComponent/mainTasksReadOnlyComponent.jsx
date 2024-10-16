"use client";

import {useState, useEffect} from "react";
import {DataGrid} from "@mui/x-data-grid";
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
    Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import dayjs from "dayjs";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DateTimePicker} from "@mui/x-date-pickers/DateTimePicker";

const MainTasks = ({tasks}) => {
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
            .sort((a, b) => a.firstNight.diff(b.firstNight));
        setRows(sortedRows);
    }, [tasks]);

    const isEditableTask = (taskDate) => {
        const now = dayjs();
        return taskDate.isAfter(now.subtract(5, 'day')) && taskDate.isBefore(now.add(1, 'day'));
    };

    const handleOpenDialog = (task) => {
        if (!isEditableTask(dayjs(task.firstNight))) return;
        setSelectedTask({...task});
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
                headers: {"Content-Type": "application/json"},
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
        if (field !== "cleanStatus") return;
        setSelectedTask((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const formatDate = (date) => (date ? dayjs(date).format("DD-MM-YYYY HH:mm") : "");

    const columns = [
        {field: "roomId", headerName: "Room", flex: 0.5, minWidth: 70},
        {field: "guestFirstName", headerName: "First Name", flex: 1, minWidth: 120},
        {field: "guestName", headerName: "Last Name", flex: 1, minWidth: 120},
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
        {
            field: "updatedAt",
            headerName: "Updated At",
            flex: 1,
            minWidth: 150,
            renderCell: (params) => formatDate(params.row.updatedAt)
        },
        {field: "customNotes", headerName: "Notes", flex: 1, minWidth: 150},
        {field: "status", headerName: "Status", flex: 0.8, minWidth: 100},
        {field: "cleanStatus", headerName: "Clean Status", flex: 0.8, minWidth: 100},
        {
            field: "actions",
            headerName: "Actions",
            flex: 0.7,
            minWidth: 100,
            renderCell: (params) => {
                const canEdit = isEditableTask(dayjs(params.row.firstNight));
                return (
                    <Tooltip
                        title={canEdit ? "View/Edit" : "Cannot edit tasks outside of 5 days before and 1 day ahead"}>
            <span>
              <IconButton onClick={() => handleOpenDialog(params.row)} disabled={!canEdit}>
                <EditIcon/>
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
            style={{height: 690, width: "100%"}}
        >
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                style={{height: 631, width: "100%"}}
                autoPageSize
                rowsPerPageOptions={[5, 10, 20]}
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
                    View Task
                </DialogTitle>
                <DialogContent sx={{padding: "16px 24px", paddingTop: "16px"}}>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "16px",
                            marginTop: "8px",
                        }}
                    >
                        <TextField
                            label="Room"
                            fullWidth
                            variant="outlined"
                            value={selectedTask?.roomId || ""}
                            disabled
                        />
                        <TextField
                            label="First Name"
                            fullWidth
                            variant="outlined"
                            value={selectedTask?.guestFirstName || ""}
                            disabled
                        />
                        <TextField
                            label="Last Name"
                            fullWidth
                            variant="outlined"
                            value={selectedTask?.guestName || ""}
                            disabled
                        />
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                                label="Check-In Date"
                                value={selectedTask?.firstNight ? dayjs(selectedTask.firstNight) : null}
                                renderInput={(props) => (
                                    <TextField {...props} fullWidth variant="outlined"/>
                                )}
                                disabled
                            />
                            <DateTimePicker
                                label="Check-Out Date"
                                value={selectedTask?.lastNight ? dayjs(selectedTask.lastNight) : null}
                                renderInput={(props) => (
                                    <TextField {...props} fullWidth variant="outlined"/>
                                )}
                                disabled
                            />
                        </LocalizationProvider>
                        <TextField
                            label="Notes"
                            fullWidth
                            variant="outlined"
                            multiline
                            rows={4}
                            value={selectedTask?.customNotes || ""}
                            disabled
                        />
                        <TextField
                            label="Status"
                            fullWidth
                            variant="outlined"
                            value={selectedTask?.status || ""}
                            disabled
                        />
                        <TextField
                            select
                            label="Clean Status"
                            fullWidth
                            variant="outlined"
                            value={selectedTask?.cleanStatus || ""}
                            onChange={(e) => handleInputChange("cleanStatus", e.target.value)}
                            sx={{
                                backgroundColor: "#e8f4fd",
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        borderColor: "#2196f3",
                                        borderWidth: 2,
                                    },
                                    "&:hover fieldset": {
                                        borderColor: "#1976d2",
                                    },
                                },
                                "& .MuiInputLabel-root": {
                                    color: "#1976d2",
                                },
                            }}
                        >
                            <MenuItem value="To Clean">To Clean</MenuItem>
                            <MenuItem value="Cleaning">Cleaning</MenuItem>
                            <MenuItem value="Cleaned">Cleaned</MenuItem>
                        </TextField>
                    </Box>
                </DialogContent>
                <DialogActions
                    sx={{padding: "16px 24px", backgroundColor: "#f3f4f6"}}
                >
                    <Button onClick={handleCloseDialog} sx={{color: "#6B7280"}}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSaveChanges}
                        variant="contained"
                        sx={{
                            backgroundColor: "#4F46E5",
                            "&:hover": {backgroundColor: "#4338CA"},
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
