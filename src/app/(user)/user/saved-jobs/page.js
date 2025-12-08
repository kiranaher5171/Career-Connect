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
  Stack,
  Pagination,
  IconButton,
  Snackbar,
  Alert,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
} from "@mui/material";
import BookmarkOutlinedIcon from "@mui/icons-material/BookmarkOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import Link from "next/link";
import HeaderFooterLayout from "@/components/layouts/header-footer-layout/HeaderFooterLayout";
import { useRouter } from "next/navigation";

const SavedJobsPage = () => {
  const router = useRouter();
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;

  const fetchSavedJobs = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch("/api/users/saved-jobs", {
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/auth/login");
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        // Filter out saved jobs where the job itself is null (job might have been deleted)
        const validSavedJobs = result.data
          .filter((item) => item.job !== null)
          .map((item) => item.job);
        setSavedJobs(validSavedJobs);
      } else {
        setSavedJobs([]);
      }
    } catch (error) {
      if (error.name === "AbortError") {
        console.warn("Request timeout: Saved jobs fetch took too long");
      } else {
        console.error("Error fetching saved jobs:", error);
      }
      setSavedJobs([]);
      showSnackbar("Failed to load saved jobs", "error");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchSavedJobs();
  }, [fetchSavedJobs]);

  const handleSaveJob = useCallback(
    async (job) => {
      const token = localStorage.getItem("token");
      if (!token) {
        showSnackbar("Please login to save jobs", "warning");
        return;
      }

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        // Remove from saved jobs
        const response = await fetch(
          `/api/users/saved-jobs?jobId=${job._id}`,
          {
            method: "DELETE",
            signal: controller.signal,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error("Failed to remove saved job");
        }

        // Remove from local state
        setSavedJobs((prev) => prev.filter((j) => j._id !== job._id));
        showSnackbar("Job removed from saved jobs", "info");
      } catch (error) {
        console.error("Error removing saved job:", error);
        showSnackbar("Failed to remove saved job", "error");
      }
    },
    []
  );

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return `${Math.floor(diffInSeconds / 604800)}w ago`;
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return "Not disclosed";
    if (!max) return `₹${(min / 1000).toFixed(0)}k+`;
    return `₹${(min / 1000).toFixed(0)}k - ₹${(max / 1000).toFixed(0)}k`;
  };

  // Pagination logic
  const totalPages = Math.ceil(savedJobs.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const endIndex = startIndex + jobsPerPage;
  const paginatedJobs = savedJobs.slice(startIndex, endIndex);

  // Reset to page 1 when saved jobs change
  useEffect(() => {
    setCurrentPage(1);
  }, [savedJobs.length]);

  return (
    <HeaderFooterLayout>
      <Container maxWidth>
        <Box className="page-content" mt={2}>
          <Box mb={4}>
            <Typography variant="h4" className="fw6" gutterBottom>
              Saved Jobs
            </Typography>
            <Typography variant="body1" className="text-secondary">
              {savedJobs.length === 0
                ? "You haven't saved any jobs yet"
                : `You have ${savedJobs.length} saved job${savedJobs.length !== 1 ? "s" : ""}`}
            </Typography>
          </Box>

          {loading ? (
            <Box className="whitebx" sx={{ p: 3 }}>
              <Typography variant="body1" className="text-secondary" align="center">
                Loading saved jobs...
              </Typography>
            </Box>
          ) : savedJobs.length === 0 ? (
            <Box className="whitebx" sx={{ p: 4, textAlign: "center" }}>
              <BookmarkBorderOutlinedIcon
                sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
              />
              <Typography variant="h6" className="fw6" gutterBottom>
                No Saved Jobs
              </Typography>
              <Typography variant="body2" className="text-secondary" gutterBottom>
                Start saving jobs you're interested in by clicking the bookmark icon
              </Typography>
              <Box mt={3}>
                <Link href="/user/find-jobs" style={{ textDecoration: "none" }}>
                  <Typography
                    variant="body1"
                    sx={{
                      color: "var(--primary)",
                      fontWeight: 500,
                      cursor: "pointer",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    Browse Jobs →
                  </Typography>
                </Link>
              </Box>
            </Box>
          ) : (
            <>
              <Grid container spacing={3}>
                {paginatedJobs.map((job) => (
                  <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }} key={job._id}>
                    <Box
                      className="whitebx"
                      sx={{ p: 3, position: "relative" }}
                    >
                      {/* Time Posted Badge */}
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

                      {/* Action Icons - Save and Share */}
                      <Box
                        sx={{
                          position: "absolute",
                          top: 8,
                          right: 8,
                          zIndex: 1,
                          display: "flex",
                          gap: 1,
                          alignItems: "center",
                        }}
                      >
                        {/* Copy Link Icon */}
                        <IconButton
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const jobUrl = `${window.location.origin}/user/find-jobs/${job.slug || job._id}`;
                            navigator.clipboard.writeText(jobUrl);
                            showSnackbar("Job link copied to clipboard!", "success");
                          }}
                          aria-label="Copy job link"
                        >
                          <ContentCopyOutlinedIcon
                            fontSize="small"
                            sx={{ color: "var(--text-secondary)" }}
                          />
                        </IconButton>

                        {/* Save Job Icon */}
                        <IconButton
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleSaveJob(job);
                          }}
                          aria-label="Remove from saved jobs"
                        >
                          <BookmarkOutlinedIcon
                            fontSize="medium"
                            sx={{ color: "var(--primary)" }}
                          />
                        </IconButton>
                      </Box>

                      <Link
                        href={`/user/find-jobs/${job.slug || job._id}`}
                        prefetch={true}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <CardContent
                          sx={{
                            p: 0,
                            "&:last-child": { pb: 0 },
                            mt: 4,
                            cursor: "pointer",
                            "&:hover": {
                              opacity: 0.9,
                            },
                          }}
                        >
                          <Box>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "flex-start",
                                gap: 2,
                              }}
                            >
                              <Box sx={{ flex: 1 }} mt={1}>
                                <List
                                  sx={{
                                    width: "100%",
                                    bgcolor: "background.paper",
                                    p: 0,
                                  }}
                                >
                                  <ListItem sx={{ px: 0, py: 0.5 }}>
                                    <ListItemAvatar>
                                      <Avatar className="card-avtar">
                                        <WorkOutlineOutlinedIcon fontSize="medium" />
                                      </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                      primary={job.jobRole || job.title || "N/A"}
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
                              </Box>
                            </Box>

                            {/* Job Details Icons */}
                            <Box
                              sx={{
                                display: "flex",
                                flexWrap: "wrap",
                                gap: 2,
                                mt: 2,
                              }}
                            >
                              {job.jobType && (
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                  }}
                                >
                                  <AccessTimeOutlinedIcon
                                    className="secondary"
                                    fontSize="medium"
                                  />
                                  <Typography
                                    variant="body2"
                                    className="text-secondary"
                                  >
                                    {job.jobType}
                                  </Typography>
                                </Box>
                              )}
                              {job.location && (
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                  }}
                                >
                                  <LocationOnOutlinedIcon
                                    className="secondary"
                                    fontSize="medium"
                                  />
                                  <Typography
                                    variant="body2"
                                    className="text-secondary"
                                  >
                                    {job.location}
                                  </Typography>
                                </Box>
                              )}
                              {job.experience && (
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                  }}
                                >
                                  <WorkOutlineOutlinedIcon
                                    className="secondary"
                                    fontSize="medium"
                                  />
                                  <Typography
                                    variant="body2"
                                    className="text-secondary"
                                  >
                                    {job.experience}
                                  </Typography>
                                </Box>
                              )}
                              {job.salary && (
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                  }}
                                >
                                  <AttachMoneyOutlinedIcon
                                    className="secondary"
                                    fontSize="medium"
                                  />
                                  <Typography
                                    variant="body2"
                                    className="text-secondary"
                                  >
                                    {job.salary}
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          </Box>
                        </CardContent>
                      </Link>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              {/* Pagination */}
              {totalPages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={(event, value) => setCurrentPage(value)}
                    color="primary"
                    size="large"
                  />
                </Box>
              )}
            </>
          )}
        </Box>
      </Container>

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

export default SavedJobsPage;

