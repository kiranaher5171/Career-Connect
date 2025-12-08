"use client";
import React, { useState, useEffect, useCallback } from "react";
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
  Snackbar,
  Alert,
  CircularProgress,
  Chip,
} from "@mui/material";
import { IoIosCloseCircleOutline } from "react-icons/io";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import PropTypes from "prop-types";

// Constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

// Helper function to format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// Helper function to format phone number
const formatPhoneNumber = (value) => {
  const phoneNumber = value.replace(/[^\d]/g, '');
  const phoneNumberLength = phoneNumber.length;
  if (phoneNumberLength < 4) return phoneNumber;
  if (phoneNumberLength < 7) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  }
  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
};

const ReferFriendDialog = ({ 
  open, 
  onClose, 
  jobId, 
  jobRole, 
  onSuccess,
  title = "Refer a Friend",
  submitButtonText = "Proceed to Document selection",
  cancelButtonText = "Cancel",
  enableAutoSave = true,
}) => {
  const [friendName, setFriendName] = useState("");
  const [friendEmail, setFriendEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [resumeFile, setResumeFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [message, setMessage] = useState("");
  const [messageLength, setMessageLength] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [fieldValidations, setFieldValidations] = useState({
    friendName: false,
    friendEmail: false,
    phoneNumber: false,
    resume: false,
  });

  // Auto-save draft to localStorage
  useEffect(() => {
    if (enableAutoSave && open) {
      const draftKey = `referral_draft_${jobId}`;
      const savedDraft = localStorage.getItem(draftKey);
      if (savedDraft) {
        try {
          const draft = JSON.parse(savedDraft);
          setFriendName(draft.friendName || "");
          setFriendEmail(draft.friendEmail || "");
          setPhoneNumber(draft.phoneNumber || "");
          setMessage(draft.message || "");
          setMessageLength(draft.message?.length || 0);
        } catch (error) {
          console.error('Error loading draft:', error);
        }
      }
    }
  }, [open, jobId, enableAutoSave]);

  // Save draft to localStorage
  const saveDraft = useCallback(() => {
    if (enableAutoSave) {
      const draftKey = `referral_draft_${jobId}`;
      const draft = {
        friendName,
        friendEmail,
        phoneNumber,
        message,
      };
      localStorage.setItem(draftKey, JSON.stringify(draft));
    }
  }, [friendName, friendEmail, phoneNumber, message, jobId, enableAutoSave]);

  // Auto-save on field changes
  useEffect(() => {
    if (enableAutoSave && open) {
      const timer = setTimeout(() => {
        saveDraft();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [friendName, friendEmail, phoneNumber, message, open, saveDraft, enableAutoSave]);

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        setErrors({ ...errors, resume: 'Please upload a PDF, DOC, or DOCX file' });
        setFieldValidations({ ...fieldValidations, resume: false });
        return;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        setErrors({ ...errors, resume: `File size must be less than ${formatFileSize(MAX_FILE_SIZE)}` });
        setFieldValidations({ ...fieldValidations, resume: false });
        return;
      }

      setResumeFile(file);
      setFileName(file.name);
      setFileSize(file.size);
      setErrors({ ...errors, resume: '' });
      setFieldValidations({ ...fieldValidations, resume: true });
    }
  };

  const handleRemoveFile = () => {
    setResumeFile(null);
    setFileName("");
    setFileSize(0);
    setErrors({ ...errors, resume: '' });
    setFieldValidations({ ...fieldValidations, resume: false });
    // Reset file input
    const fileInput = document.getElementById('resume-upload');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handlePhoneChange = (event) => {
    const value = event.target.value;
    // Allow only numbers, spaces, dashes, parentheses, and plus
    const phoneRegex = /^[0-9\s\-\(\)+]*$/;
    if (phoneRegex.test(value) || value === '') {
      // Auto-format phone number (optional - can be toggled)
      const formatted = formatPhoneNumber(value);
      setPhoneNumber(value);
      
      // Real-time validation
      const isValid = value.replace(/[^\d]/g, '').length >= 10;
      setFieldValidations({ ...fieldValidations, phoneNumber: isValid });
      
      if (isValid) {
        setErrors({ ...errors, phone: '' });
      }
    }
  };

  const handleSubmit = async () => {
    const newErrors = {};

    // Validate friend name
    if (!friendName.trim()) {
      newErrors.friendName = 'Friend name is required';
    }

    // Validate friend email
    if (!friendEmail.trim()) {
      newErrors.friendEmail = 'Friend email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(friendEmail)) {
      newErrors.friendEmail = 'Please enter a valid email address';
    }

    // Validate phone number
    if (!phoneNumber.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (phoneNumber.trim().length < 10) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Validate resume
    if (!resumeFile) {
      newErrors.resume = 'Please attach your resume';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showSnackbar('Please login to refer a friend', 'error');
        setLoading(false);
        return;
      }

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('jobId', jobId);
      formData.append('jobRole', jobRole || 'N/A');
      formData.append('friendName', friendName.trim());
      formData.append('friendEmail', friendEmail.trim());
      formData.append('phoneNumber', phoneNumber.trim());
      formData.append('resume', resumeFile);
      formData.append('message', message.trim());

      const response = await fetch('/api/referrals', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        showSnackbar('Referral sent successfully!', 'success');
        
        // Clear draft from localStorage
        if (enableAutoSave) {
          const draftKey = `referral_draft_${jobId}`;
          localStorage.removeItem(draftKey);
        }
        
        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess(data.data);
        }
        
        // Reset form and close dialog after a short delay
        setTimeout(() => {
          handleClose();
        }, 1500);
      } else {
        showSnackbar(data.error || 'Failed to send referral', 'error');
      }
    } catch (error) {
      console.error('Error sending referral:', error);
      showSnackbar('Failed to send referral. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFriendName("");
    setFriendEmail("");
    setPhoneNumber("");
    setResumeFile(null);
    setFileName("");
    setMessage("");
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle id="alert-dialog-title">
        {title}
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

      <DialogContent sx={{ minHeight: "50vh", pt: 3 }}>
        <Typography variant="body2" color="text.secondary" gutterBottom sx={{ mb: 3 }}>
          Refer a friend for the position: <strong>{jobRole}</strong>
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Friend's Name Field */}
          <Box className="textfield auto-complete">
            <TextField
              fullWidth
              label="Friend's Name"
              value={friendName}
              onChange={(e) => {
                const value = e.target.value;
                setFriendName(value);
                
                // Real-time validation
                const isValid = value.trim().length >= 2;
                setFieldValidations({ ...fieldValidations, friendName: isValid });
                
                if (isValid) {
                  setErrors({ ...errors, friendName: '' });
                }
              }}
              error={!!errors.friendName}
              helperText={errors.friendName || "Enter your friend's full name"}
              required
              InputProps={{
                endAdornment: fieldValidations.friendName && !errors.friendName ? (
                  <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />
                ) : null,
              }}
            />
          </Box>

          {/* Friend's Email Field */}
          <Box className="textfield auto-complete">
            <TextField
              fullWidth
              label="Friend's Email"
              type="email"
              value={friendEmail}
              onChange={(e) => {
                const value = e.target.value;
                setFriendEmail(value);
                
                // Real-time validation
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                const isValid = emailRegex.test(value);
                setFieldValidations({ ...fieldValidations, friendEmail: isValid });
                
                if (isValid) {
                  setErrors({ ...errors, friendEmail: '' });
                }
              }}
              error={!!errors.friendEmail}
              helperText={errors.friendEmail || "Enter your friend's email address"}
              required
              InputProps={{
                endAdornment: fieldValidations.friendEmail && !errors.friendEmail ? (
                  <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />
                ) : null,
              }}
            />
          </Box>

          {/* Phone Number Field */}
          <Box className="textfield auto-complete">
            <TextField
              fullWidth
              label="Phone Number"
              value={phoneNumber}
              onChange={handlePhoneChange}
              error={!!errors.phone}
              helperText={errors.phone || "Enter your friend's contact phone number (e.g., +1 (555) 123-4567)"}
              required
              placeholder="e.g., +1 (555) 123-4567"
              InputProps={{
                endAdornment: fieldValidations.phoneNumber && !errors.phone ? (
                  <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />
                ) : null,
              }}
            />
          </Box>

          {/* Resume Attachment Field */}
          <Box className="textfield auto-complete">
            <Typography variant="body2" sx={{ mb: 1, fontWeight: 500 }}>
              Attach Resume <span style={{ color: 'red' }}>*</span>
            </Typography>
            <Box
              sx={{
                border: `2px dashed ${errors.resume ? '#d32f2f' : fieldValidations.resume ? '#4caf50' : '#ccc'}`,
                borderRadius: 2,
                p: 2,
                textAlign: 'center',
                backgroundColor: fieldValidations.resume ? '#f1f8f4' : '#f9f9f9',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: fieldValidations.resume ? '#e8f5e9' : '#f0f0f0',
                  borderColor: errors.resume ? '#d32f2f' : fieldValidations.resume ? '#4caf50' : '#999',
                },
              }}
            >
              <input
                accept=".pdf,.doc,.docx"
                style={{ display: 'none' }}
                id="resume-upload"
                type="file"
                onChange={handleFileChange}
              />
              {!resumeFile ? (
                <label htmlFor="resume-upload">
                  <Button
                    component="span"
                    variant="outlined"
                    startIcon={<AttachFileIcon />}
                    sx={{ mb: 1 }}
                  >
                    Choose File
                  </Button>
                </label>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                      {fileName}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={handleRemoveFile}
                      sx={{ color: 'error.main' }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Chip 
                    label={formatFileSize(fileSize)} 
                    size="small" 
                    color="success"
                    variant="outlined"
                  />
                </Box>
              )}
              {errors.resume && (
                <Typography variant="caption" sx={{ color: 'error.main', display: 'block', mt: 1 }}>
                  {errors.resume}
                </Typography>
              )}
              <Typography variant="caption" sx={{ display: 'block', mt: 1, color: 'text.secondary' }}>
                Supported formats: PDF, DOC, DOCX (Max {formatFileSize(MAX_FILE_SIZE)})
              </Typography>
            </Box>
          </Box>

          {/* Message Field (Optional) */}
          <Box className="textfield auto-complete">
            <TextField
              fullWidth
              label="Message (Optional)"
              multiline
              rows={4}
              value={message}
              onChange={(e) => {
                const value = e.target.value;
                setMessage(value);
                setMessageLength(value.length);
              }}
              placeholder="Add a personal message to your friend..."
              helperText={`${messageLength} characters`}
              inputProps={{ maxLength: 500 }}
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions className="dialog-actions-bar">
        <Button 
          variant="outlined" 
          onClick={handleClose} 
          className="primary-outline-btn" 
          sx={{ minWidth: "100px" }}
          disabled={loading}
        >
          {cancelButtonText}
        </Button>
        <Button 
          variant="contained" 
          className="primary-action-btn" 
          sx={{ minWidth: "100px" }}
          onClick={handleSubmit}
          disabled={loading || !friendName.trim() || !friendEmail.trim() || !phoneNumber.trim() || !resumeFile}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
        >
          {loading ? "Sending..." : submitButtonText}
        </Button>
      </DialogActions>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

ReferFriendDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  jobId: PropTypes.string,
  jobRole: PropTypes.string,
  onSuccess: PropTypes.func,
  title: PropTypes.string,
  submitButtonText: PropTypes.string,
  cancelButtonText: PropTypes.string,
  enableAutoSave: PropTypes.bool,
};

export default ReferFriendDialog;

