// CustomNotesDialog.js
import React, {useEffect, useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField,} from "@mui/material";

const CustomNotesDialog = ({ open, onClose, onSave, initialNotes }) => {
  const [notes, setNotes] = useState(initialNotes || "");

  useEffect(() => {
    if (open) {
      setNotes(initialNotes || "");
    }
  }, [open, initialNotes]);

  const handleSave = () => {
    onSave(notes);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Custom Notes</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Custom Notes"
          type="text"
          fullWidth
          multiline
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomNotesDialog;
