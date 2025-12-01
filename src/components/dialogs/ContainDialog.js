"use client";
import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Box, Divider, Typography } from "@mui/material";
import { IoIosCloseCircleOutline } from "react-icons/io";

const ContainDialog = ({ open, onClose }) => {

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle id="alert-dialog-title"> 
                    Enter Here Dialog Title 
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{ position: "absolute", right: 8, top: 8 }}
                >
                    <IoIosCloseCircleOutline className="white" />
                </IconButton>
            </DialogTitle>
            <Box>
                <Divider />
            </Box>


            <DialogContent sx={{ minHeight: "50vh" }}>


            </DialogContent>
            <DialogActions className="dialog-actions-bar">
                <Button variant="outlined" onClick={onClose} className="primary-outline-btn" sx={{ minWidth: "100px" }}>Cancel</Button>
                <Button variant="contained" className="primary-action-btn" sx={{ minWidth: "100px" }}>Proceed to Document selection </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ContainDialog;
