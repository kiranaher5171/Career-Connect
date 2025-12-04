"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Typography,
  Box,
  Container,
  Grid,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Chip,
  Autocomplete,
  Divider,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import Link from "next/link";
import { useRouter } from "next/navigation";
import HeaderFooterLayout from "@/layouts/header-footer-layout/HeaderFooterLayout";

const CreateJobAlertPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Form state
  const [formData, setFormData] = useState({
    alertName: "",
    emailNotifications: true,
    notificationFrequency: "daily",
    keywords: "",
    locations: [],
    categories: [],
    jobTypes: [],
    experienceLevels: [],
    salaryRange: { min: 0, max: 10000000 },
    skills: [],
  });

  // Fetch jobs for preview
  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/jobs?status=active", {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }

      const result = await response.json();
      if (result.success) {
        setJobs(result.data || []);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Get unique values from jobs
  const uniqueLocations = useMemo(() => {
    const locations = new Set();
    jobs.forEach((job) => {
      if (job.location) locations.add(job.location.trim());
    });
    return Array.from(locations).sort();
  }, [jobs]);

  const uniqueCategories = useMemo(() => {
    const categories = new Set();
    jobs.forEach((job) => {
      const cat = job.teamName || job.category;
      if (cat) categories.add(cat.trim());
    });
    return Array.from(categories).sort();
  }, [jobs]);

  const uniqueJobTypes = useMemo(() => {
    const types = new Set();
    jobs.forEach((job) => {
      if (job.jobType) types.add(job.jobType.trim());
    });
    return Array.from(types).sort();
  }, [jobs]);

  const uniqueExperienceLevels = useMemo(() => {
    const levels = new Set();
    jobs.forEach((job) => {
      if (job.experience) levels.add(job.experience.trim());
    });
    return Array.from(levels).sort();
  }, [jobs]);

  const uniqueSkills = useMemo(() => {
    const skills = new Set();
    jobs.forEach((job) => {
      if (job.skills) {
        const jobSkills = Array.isArray(job.skills)
          ? job.skills
          : job.skills.split(",").map((s) => s.trim());
        jobSkills.forEach((skill) => {
          if (skill) skills.add(skill.trim());
        });
      }
    });
    return Array.from(skills).sort();
  }, [jobs]);

  // Calculate matching jobs count
  const matchingJobsCount = useMemo(() => {
    if (jobs.length === 0) return 0;

    return jobs.filter((job) => {
      // Keywords
      if (formData.keywords) {
        const keywords = formData.keywords.toLowerCase();
        const jobText = `${job.jobRole || ""} ${job.designation || ""}`.toLowerCase();
        if (!jobText.includes(keywords)) return false;
      }

      // Location
      if (formData.locations.length > 0) {
        if (!formData.locations.includes(job.location)) return false;
      }

      // Category
      if (formData.categories.length > 0) {
        const jobCategory = job.teamName || job.category;
        if (!jobCategory || !formData.categories.includes(jobCategory)) return false;
      }

      // Job Type
      if (formData.jobTypes.length > 0) {
        if (!formData.jobTypes.includes(job.jobType)) return false;
      }

      // Experience
      if (formData.experienceLevels.length > 0) {
        if (!formData.experienceLevels.includes(job.experience)) return false;
      }

      // Skills
      if (formData.skills.length > 0) {
        const jobSkills = Array.isArray(job.skills)
          ? job.skills
          : job.skills.split(",").map((s) => s.trim());
        const hasMatch = formData.skills.some((skill) =>
          jobSkills.some((js) => js.toLowerCase().includes(skill.toLowerCase()))
        );
        if (!hasMatch) return false;
      }

      return true;
    }).length;
  }, [jobs, formData]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.alertName.trim()) {
      showSnackbar("Please enter an alert name", "error");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/users/job-alerts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create alert");
      }

      if (result.success) {
        showSnackbar("Job alert created successfully!", "success");
        setTimeout(() => {
          router.push("/user/job-alerts");
        }, 1500);
      }
    } catch (error) {
      console.error("Error creating alert:", error);
      showSnackbar(error.message || "Failed to create alert", "error");
    } finally {
      setSaving(false);
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const formatIndianCurrency = (value) => {
    if (value >= 100000) {
      const lakhs = value / 100000;
      return `${lakhs.toFixed(lakhs % 1 === 0 ? 0 : 1)} Lakh`;
    } else if (value >= 1000) {
      const thousands = value / 1000;
      return `${thousands.toFixed(thousands % 1 === 0 ? 0 : 1)} Thousand`;
    }
    return value.toString();
  };

  return (
    <HeaderFooterLayout>
      <Container maxWidth="md">
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
            <Typography variant="h4" className="fw6" gutterBottom>
              Create Job Alert
            </Typography>
            <Typography variant="body2" className="text-secondary">
              Set up criteria to get notified about new job opportunities
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Box className="whitebx" sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" className="fw6" gutterBottom>
                Basic Information
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="Alert Name"
                    fullWidth
                    required
                    value={formData.alertName}
                    onChange={(e) => handleChange("alertName", e.target.value)}
                    placeholder="e.g., Software Engineer in Bangalore"
                    helperText="Give your alert a descriptive name"
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.emailNotifications}
                        onChange={(e) =>
                          handleChange("emailNotifications", e.target.checked)
                        }
                      />
                    }
                    label="Enable Email Notifications"
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <FormControl fullWidth>
                    <InputLabel>Notification Frequency</InputLabel>
                    <Select
                      value={formData.notificationFrequency}
                      onChange={(e) =>
                        handleChange("notificationFrequency", e.target.value)
                      }
                      label="Notification Frequency"
                    >
                      <MenuItem value="instant">Instant</MenuItem>
                      <MenuItem value="daily">Daily Digest</MenuItem>
                      <MenuItem value="weekly">Weekly Digest</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>

            <Box className="whitebx" sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" className="fw6" gutterBottom>
                Search Criteria
              </Typography>
              <Divider sx={{ my: 2 }} />

              <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                  <TextField
                    label="Keywords / Job Title"
                    fullWidth
                    value={formData.keywords}
                    onChange={(e) => handleChange("keywords", e.target.value)}
                    placeholder="e.g., software engineer, developer"
                    helperText="Search for specific job titles or keywords"
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Autocomplete
                    multiple
                    options={uniqueLocations}
                    value={formData.locations}
                    onChange={(event, newValue) =>
                      handleChange("locations", newValue)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Locations"
                        placeholder="Select locations"
                      />
                    )}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          label={option}
                          size="small"
                          {...getTagProps({ index })}
                        />
                      ))
                    }
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Autocomplete
                    multiple
                    options={uniqueCategories}
                    value={formData.categories}
                    onChange={(event, newValue) =>
                      handleChange("categories", newValue)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Categories"
                        placeholder="Select categories"
                      />
                    )}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          label={option}
                          size="small"
                          {...getTagProps({ index })}
                        />
                      ))
                    }
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Autocomplete
                    multiple
                    options={uniqueJobTypes}
                    value={formData.jobTypes}
                    onChange={(event, newValue) =>
                      handleChange("jobTypes", newValue)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Job Types"
                        placeholder="Select job types"
                      />
                    )}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          label={option}
                          size="small"
                          {...getTagProps({ index })}
                        />
                      ))
                    }
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Autocomplete
                    multiple
                    options={uniqueExperienceLevels}
                    value={formData.experienceLevels}
                    onChange={(event, newValue) =>
                      handleChange("experienceLevels", newValue)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Experience Levels"
                        placeholder="Select experience levels"
                      />
                    )}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          label={option}
                          size="small"
                          {...getTagProps({ index })}
                        />
                      ))
                    }
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Typography variant="body2" gutterBottom>
                    Salary Range
                  </Typography>
                  <Box sx={{ px: 2 }}>
                    <Slider
                      value={[formData.salaryRange.min, formData.salaryRange.max]}
                      onChange={(e, newValue) =>
                        handleChange("salaryRange", {
                          min: newValue[0],
                          max: newValue[1],
                        })
                      }
                      valueLabelDisplay="auto"
                      valueLabelFormat={(value) =>
                        `₹${formatIndianCurrency(value)}`
                      }
                      min={0}
                      max={2000000}
                      step={50000}
                    />
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mt: 1,
                      }}
                    >
                      <Typography variant="body2" className="text-secondary">
                        ₹{formatIndianCurrency(formData.salaryRange.min)}
                      </Typography>
                      <Typography variant="body2" className="text-secondary">
                        ₹{formatIndianCurrency(formData.salaryRange.max)}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Autocomplete
                    multiple
                    freeSolo
                    options={uniqueSkills}
                    value={formData.skills}
                    onChange={(event, newValue) =>
                      handleChange("skills", newValue)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Skills / Tags"
                        placeholder="Select or type skills"
                      />
                    )}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          label={option}
                          size="small"
                          {...getTagProps({ index })}
                        />
                      ))
                    }
                  />
                </Grid>
              </Grid>
            </Box>

            <Box className="whitebx" sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" className="fw6" gutterBottom>
                Preview
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography variant="body1">
                  {loading
                    ? "Loading..."
                    : `${matchingJobsCount} job${
                        matchingJobsCount !== 1 ? "s" : ""
                      } match your criteria`}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
              <Button
                component={Link}
                href="/user/job-alerts"
                variant="outlined"
                disableRipple
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                className="primary-action-btn"
                disabled={saving}
                disableRipple
              >
                {saving ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Creating...
                  </>
                ) : (
                  "Create Alert"
                )}
              </Button>
            </Box>
          </form>
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

export default CreateJobAlertPage;

