"use client";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Box,
  Button,
  Checkbox,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
const LOGO = "/assets/logo.svg";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

const Form = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();

  // Load saved email on component mount if remember me was previously checked
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedEmail = localStorage.getItem('rememberedEmail');
      if (savedEmail) {
        setFormData(prev => ({ ...prev, email: savedEmail }));
        setRememberMe(true);
      }
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleShowPasswordToggle = () => setShowPassword((prev) => !prev);

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          rememberMe: rememberMe,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store token in localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        // Handle remember me functionality
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", formData.email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        // Dispatch custom login event to notify all components (Header, ProfileMenus, etc.)
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('userLogin'));
        }

        setSnackbarMessage("Login successful! Redirecting...");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);

        // Redirect based on role
        setTimeout(() => {
          if (data.user.role === "admin") {
            router.push("/admin/dashboard");
          } else {
            router.push("/user/find-jobs");
          }
        }, 1500);
      } else {
        setSnackbarMessage(data.error || "Login failed");
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
          <Image src={LOGO} className="auth-logo" alt="iFieldSmart Technologies" width={200} height={60} priority />
        </Box>

        <Box mb={5} mt={1}>
          <Typography variant="h4" className="form-heading">
            LOGIN
          </Typography>
        </Box>

        <Box>
          <form onSubmit={handleLogin}>
            <Grid container alignItems="top" justifyContent="center" spacing={3}>
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

              <Grid size={{ lg: 12, md: 12, sm: 12, xs: 12 }}>
                <Box display="flex" alignItems="center">
                  <Checkbox
                    id="rememberMe"
                    color="primary"
                    className="checkbox col1"
                    size="small"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <Typography
                    htmlFor="rememberMe"
                    variant="body2"
                    className="col1 fw4 h6"
                    component="label"
                    sx={{ cursor: "pointer", userSelect: "none" }}
                  >
                    Remember Me
                  </Typography>
                </Box>
              </Grid>

              {/* Forgot Password */}
              <Grid size={{ lg: 12, md: 12, sm: 12, xs: 12 }}>
                <Box className="right" mt={0}>
                  <Typography variant="h6" className="primary fw6">
                    <a href="/forgot-password">Forgot Password?</a>
                  </Typography>
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
                    {loading ? "Logging in..." : "Login"}
                  </Button>
                </Box>
              </Grid>

              {/* Sign Up Link */}
              <Grid size={{ lg: 12, md: 12, sm: 12, xs: 12 }}>
                <Box className="center" mt={2}>
                  <Typography variant="body2" className="text-secondary">
                    Don't have an account?{" "}
                    <Link href="/auth/signup" style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}>
                      Sign Up
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
