import React from "react";
import { Dialog, IconButton, DialogContent, Typography, Button, Box, Stack, } from "@mui/material";
import { FaExclamation } from "react-icons/fa";

const ConformationDialog = ({ open, onClose }) => {
    const handleClose = () => {
        if (onClose) onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xs" id="confirmation-dialog">
            <DialogContent>
                <Box className="dialog-icon">
                    <IconButton className="dialog-icon-confirmation" disabled>
                        <FaExclamation />
                    </IconButton>
                </Box>

                <Box className="center" pt={4}>
                    <Typography className="bk fw4" variant="h5">
                        Are you sure you want to update the document <span className="fw6 bl">MyDocuments_UploadDocument_User Story_Final (1).docx</span> ?
                    </Typography>
                </Box>

                <Box pt={4}>
                    <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
                        <Button variant="outlined" disableRipple className="primary-outline-btn" onClick={handleClose}> No </Button>
                        <Button variant="contained" disableRipple className="primary-action-btn" onClick={handleClose}> Yes </Button>
                    </Stack>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default ConformationDialog;
