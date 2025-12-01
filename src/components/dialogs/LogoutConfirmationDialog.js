import React from "react";
import { Dialog, IconButton, DialogContent, Typography, Button, Box, Stack, } from "@mui/material";
import { FaExclamation } from "react-icons/fa";

const LogoutConfirmationDialog = ({ open, onClose, onCancel, onConfirm }) => {
    const handleClose = () => {
        if (onClose) onClose();
    };

    const handleCancel = () => {
        if (onCancel) onCancel();
        handleClose();
    };

    const handleConfirm = () => {
        if (onConfirm) onConfirm();
        handleClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" id="logout-confirmation-dialog">
            <DialogContent>
                <Box className="fx_c dialog-icon">
                    <IconButton className="dialog-icon-confirmation" disabled>
                        <FaExclamation />
                    </IconButton>
                </Box>

                <Box className="center" pt={4}>
                    <Typography className="bk fw4" variant="h5" gutterBottom>
                        Are you sure you want to <span className="fw6 bl">logout</span>?
                    </Typography>
                    <Typography className="text-secondary" variant="body2"  >
                        You will be logged out of your account. Any unsaved changes will be lost.
                    </Typography>
                </Box>

                <Box pt={4}>
                    <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
                        <Button 
                            variant="outlined" 
                            disableRipple 
                            className="primary-outline-btn" 
                            onClick={handleCancel}
                        >
                            No
                        </Button>
                        <Button 
                            variant="contained" 
                            disableRipple 
                            className="primary-action-btn" 
                            onClick={handleConfirm}
                        >
                            Yes
                        </Button>
                    </Stack>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default LogoutConfirmationDialog;

