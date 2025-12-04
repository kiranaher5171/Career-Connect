"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Typography,
  Box,
  Container,
  Grid,
  Chip,
  Button,
  IconButton,
  Snackbar,
  Alert,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Pagination,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import BookmarkOutlinedIcon from "@mui/icons-material/BookmarkOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import HeaderFooterLayout from "@/layouts/header-footer-layout/HeaderFooterLayout";

const MatchedJobsPage = () => {
  const router = useRouter();
  const params = useParams();
  const alertId = params.alertId;
  const [alert, setAlert] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedJobs, setSavedJobs] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [newJobsCount, setNewJobsCount] = useState(0);
  const jobsPerPage = 10;
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchAlert = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }

      const response = await fetch(`/api/users/job-alerts/${alertId}`, {
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
        throw new Error("Failed to fetch alert");
      }

      const result = await response.json();
      if (result.success) {
        setAlert(result.data);
      }
    } catch (error) {
      console.error("Error fetching alert:", error);
    }
  }, [alertId, router]);

  const fetchMatchedJobs = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }

      const response = await fetch(
        `/api/users/job-alerts/${alertId}/jobs?showAll=${showAll}&page=${currentPage}&limit=${jobsPerPage}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/auth/login");
          return;
        }
        throw new Error("Failed to fetch matched jobs");
      }

      const result = await response.json();
      if (result.success) {
        setJobs(result.data.jobs || []);
        setTotalJobs(result.data.total || 0);
        setNewJobsCount(result.data.newJobs || 0);
        setTotalPages(result.data.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching matched jobs:", error);
      showSnackbar("Failed to load matched jobs", "error");
    } finally {
      setLoading(false);
    }
  }, [alertId, showAll, currentPage, router]);

  const fetchSavedJobs = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("/api/users/saved-jobs", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) return;

      const result = await response.json();
      if (result.success) {
        const savedJobIds = result.data
          .filter((item) => item.job !== null)
          .map((item) => item.job._id || item.jobId);
        setSavedJobs(savedJobIds);
      }
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
    }
  }, []);

  useEffect(() => {
    fetchAlert();
    fetchSavedJobs();
  }, [fetchAlert, fetchSavedJobs]);

  useEffect(() => {
    fetchMatchedJobs();
  }, [fetchMatchedJobs]);

  const handleSaveJob = useCallback(
    async (job) => {
      const token = localStorage.getItem("token");
      if (!token) {
        showSnackbar("Please login to save jobs", "warning");
        return;
      }

      const isAlreadySaved = savedJobs.includes(job._id);

      try {
        if (isAlreadySaved) {
          const response = await fetch(
            `/api/users/saved-jobs?jobId=${job._id}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (!response.ok) throw new Error("Failed to remove saved job");

          setSavedJobs((prev) => prev.filter((id) => id !== job._id));
          showSnackbar("Job removed from saved jobs", "info");
        } else {
          const response = await fetch("/api/users/saved-jobs", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ jobId: job._id }),
          });

          if (!response.ok) throw new Error("Failed to save job");

          setSavedJobs((prev) => [...prev, job._id]);
          showSnackbar("Job saved successfully!", "success");
        }
      } catch (error) {
        console.error("Error saving/removing job:", error);
        showSnackbar("Failed to save job", "error");
      }
    },
    [savedJobs]
  );

  const isJobSaved = (jobId) => {
    return savedJobs.includes(jobId);
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getTimeAgo = (date) => {
    if (!date) return "";
    const now = new Date();
    const jobDate = new Date(date);
    const diffInMinutes = Math.floor((now - jobDate) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} day${days > 1 ? "s" : ""} ago`;
    }
  };

  return (
    <HeaderFooterLayout>
      <Container maxWidth="lg">
        <Box className="page-content" mt={2}>
          <Box mb={3}>
            <Button
              component={Link}
              href="/user/job-alerts"
              startIcon={<ArrowBackOutlinedIcon />}
              sx={{ mb: 2 }}
            >
              Back to Job Alerts
            </Button>
            {alert && (
              <>
                <Typography variant="h4" className="fw6" gutterBottom>
                  {alert.alertName}
                </Typography>
                <Typography variant="body2" className="text-secondary">
                  Jobs matching your alert criteria
                </Typography>
              </>
            )}
          </Box>

          {alert && (
            <Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
              <Box>
                <Typography variant="body1" className="fw6">
                  {totalJobs} matching job{totalJobs !== 1 ? "s" : ""}
                </Typography>
                {newJobsCount > 0 && (
                  <Chip
                    label={`${newJobsCount} new job${newJobsCount !== 1 ? "s" : ""}`}
                    size="small"
                    sx={{
                      backgroundColor: "var(--primary)",
                      color: "#fff",
                      mt: 1,
                    }}
                  />
                )}
              </Box>
              <ToggleButtonGroup
                value={showAll ? "all" : "new"}
                exclusive
                onChange={(e, value) => {
                  if (value !== null) {
                    setShowAll(value === "all");
                    setCurrentPage(1);
                  }
                }}
                size="small"
              >
                <ToggleButton value="new">New Jobs</ToggleButton>
                <ToggleButton value="all">All Jobs</ToggleButton>
              </ToggleButtonGroup>
            </Box>
          )}

          {loading ? (
            <Box className="whitebx" sx={{ p: 3 }}>
              <Typography variant="body1" className="text-secondary" align="center">
                Loading jobs...
              </Typography>
            </Box>
          ) : jobs.length === 0 ? (
            <Box className="whitebx" sx={{ p: 4, textAlign: "center" }}>
              <WorkOutlineOutlinedIcon
                sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
              />
              <Typography variant="h6" className="fw6" gutterBottom>
                No Matching Jobs
              </Typography>
              <Typography variant="body2" className="text-secondary">
                {showAll
                  ? "No jobs match your alert criteria yet."
                  : "No new jobs match your alert criteria."}
              </Typography>
            </Box>
          ) : (
            <>
              <Grid container spacing={3}>
                {jobs.map((job) => (
                  <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }} key={job._id}>
                    <Box
                      className="whitebx"
                      sx={{ p: 3, position: "relative" }}
                    >
                      {job.createdAt && (
                        <Chip
                          label={getTimeAgo(job.createdAt)}
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 16,
                            left: 16,
                            backgroundColor: "#e8f5e9",
                            color: "#2e7d32",
                            fontWeight: 500,
                            borderRadius: "6px",
                            fontSize: "12px",
                          }}
                        />
                      )}

                      <Box
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          zIndex: 1,
                          display: "flex",
                          gap: 1,
                        }}
                      >
                        <IconButton
                          onClick={(e) => {
                            e.preventDefault();
                            const jobUrl = `${window.location.origin}/user/find-jobs/${job.slug || job._id}`;
                            navigator.clipboard.writeText(jobUrl);
                            showSnackbar("Job link copied!", "success");
                          }}
                          size="small"
                        >
                          <ContentCopyOutlinedIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          onClick={(e) => {
                            e.preventDefault();
                            handleSaveJob(job);
                          }}
                          size="small"
                        >
                          {isJobSaved(job._id) ? (
                            <BookmarkOutlinedIcon
                              fontSize="small"
                              sx={{ color: "var(--primary)" }}
                            />
                          ) : (
                            <BookmarkBorderOutlinedIcon fontSize="small" />
                          )}
                        </IconButton>
                      </Box>

                      <Link
                        href={`/user/find-jobs/${job.slug || job._id}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <Box sx={{ mt: 4 }}>
                          <List sx={{ p: 0 }}>
                            <ListItem sx={{ px: 0, py: 0.5 }}>
                              <ListItemAvatar>
                                <Avatar className="card-avtar">
                                  <WorkOutlineOutlinedIcon fontSize="medium" />
                                </Avatar>
                              </ListItemAvatar>
                              <ListItemText
                                primary={job.jobRole || "N/A"}
                                secondary={job.designation || ""}
                                primaryTypographyProps={{
                                  variant: "h6",
                                  className: "fw6 text",
                                }}
                                secondaryTypographyProps={{
                                  variant: "body2",
                                  className: "text-secondary",
                                }}
                              />
                            </ListItem>
                          </List>

                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 2,
                              mt: 2,
                            }}
                          >
                            {job.jobType && (
                              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                <AccessTimeOutlinedIcon className="secondary" fontSize="medium" />
                                <Typography variant="body2" className="text-secondary">
                                  {job.jobType}
                                </Typography>
                              </Box>
                            )}
                            {job.location && (
                              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                <LocationOnOutlinedIcon className="secondary" fontSize="medium" />
                                <Typography variant="body2" className="text-secondary">
                                  {job.location}
                                </Typography>
                              </Box>
                            )}
                            {job.experience && (
                              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                <WorkOutlineOutlinedIcon className="secondary" fontSize="medium" />
                                <Typography variant="body2" className="text-secondary">
                                  {job.experience}
                                </Typography>
                              </Box>
                            )}
                            {job.salary && (
                              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                                <AttachMoneyOutlinedIcon className="secondary" fontSize="medium" />
                                <Typography variant="body2" className="text-secondary">
                                  {job.salary}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </Link>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              {totalPages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(event, value) => setCurrentPage(value)}
                    variant="outlined"
                    shape="rounded"
                  />
                </Box>
              )}
            </>
          )}
        </Box>
      </Container>

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

export default MatchedJobsPage;

