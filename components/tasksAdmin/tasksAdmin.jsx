"use client";

import {useCallback, useEffect, useState} from "react";
import {DataGrid} from "@mui/x-data-grid";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    MenuItem,
    TextField,
} from "@mui/material";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DateTimePicker} from "@mui/x-date-pickers/DateTimePicker";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs from "dayjs";
import {Box} from "@mui/material";

const TaskAdmin = ({tasks}) => {
    const statusOptions = [
        "To Arrive",
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

    useEffect(() => {
        const sortedRows = tasks
            .map((task) => ({
                ...task,
                id: task.id,
                status: task.status || "Booked",
                firstNight: task.firstNight ? dayjs(task.firstNight) : null,
                lastNight: task.lastNight ? dayjs(task.lastNight) : null,
            }))
            .filter((task) => {
                return task.firstNight && task.firstNight.isAfter(dayjs().subtract(5, 'day'));
            })
            .sort((a, b) => a.firstNight.diff(b.firstNight));

        setRows(sortedRows);
    }, [tasks]);

    const [rows, setRows] = useState(initialTasks);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [taskToDelete, setTaskToDelete] = useState(null);
    const isDateTodayOrBefore = (date) => {
        return dayjs(date).isSame(dayjs(), 'day') || dayjs(date).isBefore(dayjs(), 'day');
    };

    const handleEditClick = (task) => {
        setSelectedTask({...task});
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
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(selectedTask),
            });

            if (!response.ok) throw new Error("Failed to update task");
            const updatedTask = await response.json();
            console.log("Updated task:", updatedTask);
            updateRowData(updatedTask);

            try {
                await sendNotification(updatedTask);
                await sendNotificationToTab(updatedTask.booking);
            } catch (notificationError) {
                console.error("Failed to send notification:", notificationError);
            }

            handleCloseEditDialog();
        } catch (error) {
            console.error("Error updating task:", error);
        }
    };

    const sendNotificationToTab = async (task) => {
        console.log(task);
        console.log(task.guestFirstName);
        console.log(task.guestName);
        try {
            const response = await fetch("/api/notificationCoHostMaid", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    title: "Task Updated",
                    message: `Task for ${task.guestFirstName} ${task.guestName} in Room ${task.roomId} has been updated.`,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to send notification");
            }
        } catch (error) {
            console.error("Error sending notification:", error);
        }
    };

    const sendNotification = async (task) => {
        console.log("Sending notification for task:", task);
        try {
            const response = await fetch("/api/sendTopicNotificationMain", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    sentTopic: "taskUpdates",
                    sentTitle: "Task Updated",
                    sentMsg: `Task for ${task.booking.guestFirstName} ${task.booking.guestName} in Room ${task.booking.roomId} has been updated.`,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to send notification");
            }

            console.log("Notification sent successfully");
        } catch (error) {
            console.error("Error sending notification:", error);
        }
    };

    const updateRowData = useCallback((updatedTask) => {
        setRows((prevRows) =>
            prevRows.map((row) =>
                row.id === updatedTask.id ? {
                    ...row,
                    ...updatedTask,
                    firstNight: dayjs(updatedTask.firstNight),
                    lastNight: dayjs(updatedTask.lastNight)
                } : row
            )
        );
    }, []);

    const handleInputChange = (field, value) => {
        setSelectedTask((prev) => {
            if ((field === 'status' || field === 'cleanStatus') && !isDateTodayOrBefore(prev.firstNight)) {
                return prev;
            }
            const updated = {...prev, [field]: value};
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
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({id: taskToDelete}),
            });
            handleCloseDeleteDialog();
        }
    };

    const formatDate = (date) =>
        date ? dayjs(date).format("DD-MM-YYYY HH:mm") : "";

    const columns = [
        {field: "roomId", headerName: "Room", flex: 0.5, minWidth: 70},
        {field: "guestFirstName", headerName: "First Name", flex: 0.8, minWidth: 100},
        {field: "guestName", headerName: "Last Name", flex: 0.8, minWidth: 100},
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
        {field: "customNotes", headerName: "Notes", flex: 1, minWidth: 150},
        {field: "status", headerName: "Status", flex: 0.8, minWidth: 100},
        {field: "cleanStatus", headerName: "Clean Status", flex: 0.8, minWidth: 100},
        {
            field: "actions",
            headerName: "Actions",
            flex: 0.7,
            minWidth: 100,
            renderCell: (params) => (
                <>
                    <IconButton
                        onClick={() => handleEditClick(params.row)}
                    >
                        <EditIcon/>
                    </IconButton>
                    <IconButton onClick={() => handleDeleteClick(params.id)}>
                        <DeleteIcon/>
                    </IconButton>
                </>
            ),
        },
    ];

    return (
        <div
            className="bg-white p-5 rounded-xl mt-1"
            style={{height: 530, width: "100%"}}
        >
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={5}
                style={{height: 475, width: "100%"}}
                autoPageSize
                rowsPerPageOptions={[5, 10, 20]}
                disableSelectionOnClick={true}
            />

            <Dialog
                open={openEditDialog}
                onClose={handleCloseEditDialog}
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
                            onChange={(e) => handleInputChange("roomId", e.target.value)}
                        />
                        <TextField
                            label="Name"
                            fullWidth
                            variant="outlined"
                            value={selectedTask?.guestName || ""}
                            onChange={(e) => handleInputChange("guestName", e.target.value)}
                        />
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker
                                label="Check-In Date"
                                value={
                                    selectedTask?.firstNight
                                        ? dayjs(selectedTask.firstNight)
                                        : null
                                }
                                onChange={(newValue) =>
                                    handleInputChange("firstNight", newValue.toISOString())
                                }
                                renderInput={(props) => (
                                    <TextField {...props} fullWidth variant="outlined"/>
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
                                    <TextField {...props} fullWidth variant="outlined"/>
                                )}
                            />
                        </LocalizationProvider>
                        <TextField
                            label="Notes"
                            fullWidth
                            variant="outlined"
                            multiline
                            rows={4}
                            value={selectedTask?.customNotes || ""}
                            onChange={(e) => handleInputChange("customNotes", e.target.value)}
                        />
                        <TextField
                            select
                            label="Status"
                            fullWidth
                            variant="outlined"
                            value={selectedTask?.status || ""}
                            onChange={(e) => handleInputChange("status", e.target.value)}
                            disabled={!isDateTodayOrBefore(selectedTask?.firstNight)}
                        >
                            {statusOptions.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            select
                            label="Clean Status"
                            fullWidth
                            variant="outlined"
                            value={selectedTask?.cleanStatus || ""}
                            onChange={(e) => handleInputChange("cleanStatus", e.target.value)}
                            disabled={!isDateTodayOrBefore(selectedTask?.firstNight)}
                        >
                            <MenuItem value="To Clean">To Clean</MenuItem>
                            <MenuItem value="Cleaned">Cleaned</MenuItem>
                        </TextField>
                    </Box>
                </DialogContent>
                <DialogActions
                    sx={{padding: "16px 24px", backgroundColor: "#f3f4f6"}}
                >
                    <Button onClick={handleCloseEditDialog} sx={{color: "#6B7280"}}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSaveEdit}
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
            <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
                <DialogTitle>Delete Task</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this task?
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
                    <Button
                        onClick={handleConfirmDelete}
                        variant="contained"
                        sx={{
                            backgroundColor: "#4F46E5",
                            "&:hover": {
                                backgroundColor: "#4338CA",
                            },
                        }}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default TaskAdmin;