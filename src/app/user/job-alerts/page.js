"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Typography,
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton,
  Snackbar,
  Alert,
  Button,
  Switch,
  FormControlLabel,
} from "@mui/material";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import NotificationsOffOutlinedIcon from "@mui/icons-material/NotificationsOffOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import Link from "next/link";
import { useRouter } from "next/navigation";
import HeaderFooterLayout from "@/layouts/header-footer-layout/HeaderFooterLayout";
import { ContainDialog } from "@/components/dialogs";

const JobAlertsPage = () => {
  const router = useRouter();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    alertId: null,
    alertName: "",
  });

  const fetchAlerts = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }

      const response = await fetch("/api/users/job-alerts", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/auth/login");
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        setAlerts(result.data || []);
      } else {
        setAlerts([]);
      }
    } catch (error) {
      console.error("Error fetching job alerts:", error);
      setAlerts([]);
      showSnackbar("Failed to load job alerts", "error");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const handleToggle = useCallback(
    async (alertId) => {
      const token = localStorage.getItem("token");
      if (!token) {
        showSnackbar("Please login to manage alerts", "warning");
        return;
      }

      try {
        const response = await fetch(`/api/users/job-alerts/${alertId}/toggle`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to toggle alert");
        }

        const result = await response.json();
        if (result.success) {
          // Update local state
          setAlerts((prev) =>
            prev.map((alert) =>
              alert._id === alertId
                ? { ...alert, isActive: result.data.isActive }
                : alert
            )
          );
          showSnackbar(
            `Alert ${result.data.isActive ? "activated" : "deactivated"}`,
            "success"
          );
        }
      } catch (error) {
        console.error("Error toggling alert:", error);
        showSnackbar("Failed to toggle alert", "error");
      }
    },
    []
  );

  const handleDelete = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token || !deleteDialog.alertId) {
      return;
    }

    try {
      const response = await fetch(
        `/api/users/job-alerts/${deleteDialog.alertId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete alert");
      }

      const result = await response.json();
      if (result.success) {
        setAlerts((prev) =>
          prev.filter((alert) => alert._id !== deleteDialog.alertId)
        );
        setDeleteDialog({ open: false, alertId: null, alertName: "" });
        showSnackbar("Job alert deleted successfully", "success");
      }
    } catch (error) {
      console.error("Error deleting alert:", error);
      showSnackbar("Failed to delete alert", "error");
    }
  }, [deleteDialog]);

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getCriteriaSummary = (alert) => {
    const parts = [];
    if (alert.keywords) parts.push(alert.keywords);
    if (alert.locations.length > 0) parts.push(alert.locations.join(", "));
    if (alert.categories.length > 0) parts.push(alert.categories.join(", "));
    return parts.join(" • ") || "No specific criteria";
  };

  return (
    <HeaderFooterLayout>
      <Container maxWidth="lg">
        <Box className="page-content" mt={2}>
          <Box
            mb={4}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box>
              <Typography variant="h4" className="fw6" gutterBottom>
                Job Alerts
              </Typography>
              <Typography variant="body1" className="text-secondary">
                Get notified when new jobs match your criteria
              </Typography>
            </Box>
            <Button
              component={Link}
              href="/user/job-alerts/new"
              variant="contained"
              className="primary-action-btn"
              startIcon={<AddOutlinedIcon />}
              disableRipple
            >
              Create New Alert
            </Button>
          </Box>

          {loading ? (
            <Box className="whitebx" sx={{ p: 3 }}>
              <Typography variant="body1" className="text-secondary" align="center">
                Loading job alerts...
              </Typography>
            </Box>
          ) : alerts.length === 0 ? (
            <Box className="whitebx" sx={{ p: 4, textAlign: "center" }}>
              <NotificationsActiveOutlinedIcon
                sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
              />
              <Typography variant="h6" className="fw6" gutterBottom>
                No Job Alerts
              </Typography>
              <Typography variant="body2" className="text-secondary" gutterBottom>
                Create your first job alert to get notified about new opportunities
                that match your criteria
              </Typography>
              <Box mt={3}>
                <Button
                  component={Link}
                  href="/user/job-alerts/new"
                  variant="contained"
                  className="primary-action-btn"
                  startIcon={<AddOutlinedIcon />}
                  disableRipple
                >
                  Create Your First Alert
                </Button>
              </Box>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {alerts.map((alert) => (
                <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }} key={alert._id}>
                  <Box className="whitebx" sx={{ p: 3, height: "100%" }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 2,
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            mb: 1,
                          }}
                        >
                          {alert.isActive ? (
                            <NotificationsActiveOutlinedIcon
                              sx={{ color: "var(--primary)", fontSize: 24 }}
                            />
                          ) : (
                            <NotificationsOffOutlinedIcon
                              sx={{ color: "text.secondary", fontSize: 24 }}
                            />
                          )}
                          <Typography variant="h6" className="fw6">
                            {alert.alertName}
                          </Typography>
                        </Box>
                        <Typography
                          variant="body2"
                          className="text-secondary"
                          sx={{ mb: 2 }}
                        >
                          {getCriteriaSummary(alert)}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                          <Chip
                            label={alert.isActive ? "Active" : "Inactive"}
                            size="small"
                            color={alert.isActive ? "success" : "default"}
                            sx={{ fontSize: "12px" }}
                          />
                          {alert.newJobsCount > 0 && (
                            <Chip
                              label={`${alert.newJobsCount} new job${
                                alert.newJobsCount !== 1 ? "s" : ""
                              }`}
                              size="small"
                              sx={{
                                backgroundColor: "var(--primary)",
                                color: "#fff",
                                fontSize: "12px",
                              }}
                            />
                          )}
                          <Chip
                            label={
                              alert.notificationFrequency === "instant"
                                ? "Instant"
                                : alert.notificationFrequency === "daily"
                                ? "Daily"
                                : "Weekly"
                            }
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: "12px" }}
                          />
                        </Box>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mt: 3,
                        pt: 2,
                        borderTop: "1px solid #e0e0e0",
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Switch
                            checked={alert.isActive}
                            onChange={() => handleToggle(alert._id)}
                            size="small"
                          />
                        }
                        label={alert.isActive ? "Active" : "Inactive"}
                        sx={{ m: 0 }}
                      />
                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton
                          component={Link}
                          href={`/user/job-alerts/${alert._id}/jobs`}
                          size="small"
                          aria-label="View jobs"
                        >
                          <VisibilityOutlinedIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          component={Link}
                          href={`/user/job-alerts/${alert._id}/edit`}
                          size="small"
                          aria-label="Edit alert"
                        >
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          onClick={() =>
                            setDeleteDialog({
                              open: true,
                              alertId: alert._id,
                              alertName: alert.alertName,
                            })
                          }
                          size="small"
                          aria-label="Delete alert"
                          sx={{ color: "error.main" }}
                        >
                          <DeleteOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Container>

      {/* Delete Confirmation Dialog */}
      <ContainDialog
        open={deleteDialog.open}
        onClose={() =>
          setDeleteDialog({ open: false, alertId: null, alertName: "" })
        }
        title="Delete Job Alert"
        content={`Are you sure you want to delete "${deleteDialog.alertName}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor="error"
      />

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
    </HeaderFooterLayout>
  );
};

export default JobAlertsPage;

