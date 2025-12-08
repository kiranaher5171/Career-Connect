import React from "react";
import { Dialog, IconButton, DialogContent, Typography, Button, Box, Stack, } from "@mui/material";
import { IoCheckmarkDone } from "react-icons/io5";

const SuccessDialog = ({ open, onClose }) => {
    const handleClose = () => {
        if (onClose) onClose();
    };

    return (
            <Dialog open={open} onClose={handleClose} maxWidth="xs" id="confirmation-dialog">
                <DialogContent>
                    <Box className="dialog-icon">
                    <IconButton className="dialog-icon-success" disabled>
                        <IoCheckmarkDone />
                        </IconButton>
                    </Box>

                    <Box className="center" pt={4}>
                        <Typography className="bk fw4" variant="h5">
                        Operation completed successfully!
                        </Typography>
                    </Box>

                    <Box pt={4}>
                        <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
                        <Button variant="contained" disableRipple className="primary-action-btn" onClick={handleClose}> OK </Button>
                        </Stack>
                    </Box>
                </DialogContent>
            </Dialog>
    );
};

export default SuccessDialog;
