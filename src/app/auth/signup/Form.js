"use client";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import {
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Snackbar,
  Alert,
  Autocomplete,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import LOGO from "../../../../public/assets/logo.svg";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const Form = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const roleOptions = [
    { label: "User", value: "user" },
    { label: "Admin", value: "admin" },
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleChange = (event, newValue) => {
    setFormData({
      ...formData,
      role: newValue ? newValue.value : "",
    });
  };

  const handleShowPasswordToggle = () => setShowPassword((prev) => !prev);
  const handleShowConfirmPasswordToggle = () =>
    setShowConfirmPassword((prev) => !prev);

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setSnackbarMessage("Passwords do not match");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setSnackbarMessage("Password must be at least 6 characters");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSnackbarMessage("Signup successful! Redirecting to login...");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        setTimeout(() => {
          router.push("/auth/login");
        }, 1500);
      } else {
        setSnackbarMessage(data.error || "Signup failed");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage("An error occurred. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box className="form-card">
        <Box pb={4} className="center">
          <Image 
            src="/assets/dpa_logo.png" 
            className="auth-logo" 
            alt="Job Portal Logo" 
            priority 
            loading="eager"
            width={200}
            height={60}
          />
        </Box>

        <Box mb={5} mt={1}>
          <Typography variant="h4" className="form-heading">
            SIGN UP
          </Typography>
        </Box>

        <Box>
          <form onSubmit={handleSignup}>
            <Grid container alignItems="top" justifyContent="center" spacing={3}>
              {/* First Name Field */}
              <Grid size={{ lg: 6, md: 6, sm: 12, xs: 12 }}>
                <Box className="form-textfield">
                  <TextField
                    placeholder="First Name"
                    variant="outlined"
                    fullWidth
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="end">
                          <PersonOutlinedIcon className="secondary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </Grid>

              {/* Last Name Field */}
              <Grid size={{ lg: 6, md: 6, sm: 12, xs: 12 }}>
                <Box className="form-textfield">
                  <TextField
                    placeholder="Last Name"
                    variant="outlined"
                    fullWidth
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="end">
                          <PersonOutlinedIcon className="secondary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </Grid>

              {/* Email Field */}
              <Grid size={{ lg: 12, md: 12, sm: 12, xs: 12 }}>
                <Box className="form-textfield">
                  <TextField
                    placeholder="Email Address"
                    variant="outlined"
                    fullWidth
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="end">
                          <EmailOutlinedIcon className="secondary" />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </Grid>

              {/* Role Field */}
              <Grid size={{ lg: 12, md: 12, sm: 12, xs: 12 }}>
                <Box className="form-textfield select-role">
                  <Autocomplete
                    options={roleOptions}
                    getOptionLabel={(option) => option.label}
                    value={roleOptions.find(option => option.value === formData.role) || null}
                    onChange={handleRoleChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select Role"
                        variant="outlined"
                        required
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                              <InputAdornment position="start">
                                <AdminPanelSettingsOutlinedIcon className="secondary" />
                              </InputAdornment>
                      ),
                    }}
                      />
                    )}
                  />
                </Box>
              </Grid>

              {/* Password Field */}
              <Grid size={{ lg: 12, md: 12, sm: 12, xs: 12 }}>
                <Box className="form-textfield">
                  <TextField
                    placeholder="Password"
                    variant="outlined"
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="end">
                          <LockOutlinedIcon className="secondary" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            onClick={handleShowPasswordToggle}
                            edge="end"
                          >
                            {showPassword ? (
                              <VisibilityOutlinedIcon
                                fontSize="small"
                                className="primary"
                              />
                            ) : (
                              <VisibilityOffOutlinedIcon
                                fontSize="small"
                                className="primary"
                              />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </Grid>

              {/* Confirm Password Field */}
              <Grid size={{ lg: 12, md: 12, sm: 12, xs: 12 }}>
                <Box className="form-textfield">
                  <TextField
                    placeholder="Confirm Password"
                    variant="outlined"
                    type={showConfirmPassword ? "text" : "password"}
                    fullWidth
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="end">
                          <LockOutlinedIcon className="secondary" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            size="small"
                            onClick={handleShowConfirmPasswordToggle}
                            edge="end"
                          >
                            {showConfirmPassword ? (
                              <VisibilityOutlinedIcon
                                fontSize="small"
                                className="primary"
                              />
                            ) : (
                              <VisibilityOffOutlinedIcon
                                fontSize="small"
                                className="primary"
                              />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Box>
              </Grid>

              {/* Submit Button */}
              <Grid size={{ lg: 12, md: 12, sm: 12, xs: 12 }}>
                <Box>
                  <Button
                    type="submit"
                    variant="contained"
                    className="auth-btn"
                    fullWidth
                    disableRipple
                    disabled={loading}
                  >
                    {loading ? "Signing Up..." : "Sign Up"}
                  </Button>
                </Box>
              </Grid>

              {/* Login Link */}
              <Grid size={{ lg: 12, md: 12, sm: 12, xs: 12 }}>
                <Box className="center" mt={2}>
                  <Typography variant="body2" className="text">
                    Already have an account?{" "}
                    <Link href="/auth/login" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}>
                      Login
                    </Link>
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%", maxWidth: "400px" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Form;
