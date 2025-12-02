"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import { IoIosCloseCircleOutline } from "react-icons/io";
import PropTypes from "prop-types";

const ReferFriendDialog = ({ open, onClose, jobId, jobRole }) => {
  const [friendEmail, setFriendEmail] = useState("");
  const [friendName, setFriendName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // TODO: Implement refer friend API call
    console.log("Referring friend:", { jobId, jobRole, friendEmail, friendName, message });
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setFriendEmail("");
      setFriendName("");
      setMessage("");
      onClose();
    }, 1000);
  };

  const handleClose = () => {
    setFriendEmail("");
    setFriendName("");
    setMessage("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle id="refer-friend-dialog-title">
        Refer a Friend
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <IoIosCloseCircleOutline className="white" />
        </IconButton>
      </DialogTitle>
      <Box>
        <Divider />
      </Box>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ minHeight: "30vh", pt: 3 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Refer a friend for the position: <strong>{jobRole}</strong>
          </Typography>
          
          <Box className="textfield auto-complete" sx={{ mt: 3 }}>
            <TextField
              fullWidth
              label="Friend's Name"
              value={friendName}
              onChange={(e) => setFriendName(e.target.value)}
              required
            />
          </Box>

          <Box className="textfield auto-complete" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Friend's Email"
              type="email"
              value={friendEmail}
              onChange={(e) => setFriendEmail(e.target.value)}
              required
            />
          </Box>

          <Box className="textfield auto-complete" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Message (Optional)"
              multiline
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a personal message..."
            />
          </Box>
        </DialogContent>
        <DialogActions className="dialog-actions-bar">
          <Button
            variant="outlined"
            onClick={handleClose}
            className="primary-outline-btn"
            sx={{ minWidth: "100px" }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            className="primary-action-btn"
            sx={{ minWidth: "100px" }}
            disabled={loading || !friendEmail || !friendName}
          >
            {loading ? "Sending..." : "Send Referral"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

ReferFriendDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  jobId: PropTypes.string,
  jobRole: PropTypes.string,
};

export default ReferFriendDialog;

