import React from "react";
import { Dialog, IconButton, DialogContent, Typography, Button, Box, Stack, } from "@mui/material";
import { RiDeleteBin6Line } from "react-icons/ri";

const DeleteDialog = ({ open, onClose, onConfirm, jobTitle }) => {
    const handleClose = () => {
        if (onClose) onClose();
    };

    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        }
        handleClose();
    };

    return (
            <Dialog open={open} onClose={handleClose} maxWidth="xs" id="confirmation-dialog">
                <DialogContent>
                    <Box className="dialog-icon">
                    <IconButton className="dialog-icon-delete" disabled>
                        <RiDeleteBin6Line />
                        </IconButton>
                    </Box>

                    <Box className="center" pt={4}>
                        <Typography className="bk fw4" variant="h5">
                        Are you sure you want to delete{' '}
                        {jobTitle ? (
                            <span className="red fw5">"{jobTitle}"</span>
                        ) : (
                            'this item'
                        )}?
                        </Typography>
                    </Box>

                    <Box pt={4}>
                        <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
                        <Button variant="outlined" disableRipple className="primary-outline-btn" onClick={handleClose}> No </Button>
                        <Button variant="contained" disableRipple className="primary-action-btn" onClick={handleConfirm}> Yes </Button>
                        </Stack>
                    </Box>
                </DialogContent>
            </Dialog>
    );
};

export default DeleteDialog;
