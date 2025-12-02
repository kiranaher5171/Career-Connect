"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Typography,
  Box,
  Container,
  Grid,
  TextField,
  InputAdornment,
  Button,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Autocomplete,
  Checkbox,
  FormControlLabel,
  Slider,
  Divider,
  Collapse,
  Stack,
  Pagination,
} from "@mui/material";
// Import all Material Icons as Outlined variant and use fontSize="medium"
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import BusinessOutlinedIcon from "@mui/icons-material/BusinessOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import AttachMoneyOutlinedIcon from "@mui/icons-material/AttachMoneyOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import BookmarkBorderOutlinedIcon from "@mui/icons-material/BookmarkBorderOutlined";
import BookmarkOutlinedIcon from "@mui/icons-material/BookmarkOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import IconButton from "@mui/material/IconButton";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import ExpandMoreOutlinedIcon from "@mui/icons-material/ExpandMoreOutlined";
import ExpandLessOutlinedIcon from "@mui/icons-material/ExpandLessOutlined";
import { Snackbar, Alert, Skeleton } from "@mui/material"; 
import Link from "next/link"; 
import Image from "next/image";
import SearchIcon from "@mui/icons-material/Search";

const FindJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Hero section search states
  const [heroSearchQuery, setHeroSearchQuery] = useState("");
  const [heroLocation, setHeroLocation] = useState("");

  // Filter states
  const [selectedLocations, setSelectedLocations] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  const [selectedExperienceLevels, setSelectedExperienceLevels] = useState([]);
  const [selectedDatePosted, setSelectedDatePosted] = useState([]);
  const [salaryRange, setSalaryRange] = useState([300000, 500000]); // 3 to 5 Lakhs (default)
  const [selectedTags, setSelectedTags] = useState([]);
  const [showAllFilters, setShowAllFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;
  
  // Collapse states for each filter section
  const [locationExpanded, setLocationExpanded] = useState(true);
  const [categoryExpanded, setCategoryExpanded] = useState(true);
  const [jobTypeExpanded, setJobTypeExpanded] = useState(true);
  const [experienceExpanded, setExperienceExpanded] = useState(true);
  const [datePostedExpanded, setDatePostedExpanded] = useState(true);

  // Define fetch functions first using useCallback
  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch("/api/jobs", {
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
        },
        cache: "default", // Use default caching strategy
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();
      if (result.success) {
        setJobs(result.data || []);
      } else {
        throw new Error(result.error || "Failed to fetch jobs");
      }
    } catch (error) {
      if (error.name === "AbortError") {
        console.warn("Request timeout: Jobs fetch took too long");
        setSnackbar({
          open: true,
          message: "Request timeout. Please try again.",
          severity: "error",
        });
      } else {
        console.error("Error fetching jobs:", error);
        const errorMessage =
          error.message === "Failed to fetch"
            ? "Unable to connect to server. Please check your connection."
            : error.message || "Failed to load jobs. Please refresh the page.";
        setSnackbar({
          open: true,
          message: errorMessage,
          severity: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchSavedJobs = useCallback(async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        return; // User not logged in
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

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
          // User not authenticated, clear saved jobs
          setSavedJobs([]);
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        // Extract job IDs from saved jobs
        const savedJobIds = result.data.map(
          (item) => item.job._id || item.jobId
        );
        setSavedJobs(savedJobIds);
      }
    } catch (error) {
      if (error.name === "AbortError") {
        console.warn("Request timeout: Saved jobs fetch took too long");
      } else {
        console.error("Error fetching saved jobs:", error);
      }
      // Don't show error to user, just use empty array
      setSavedJobs([]);
    }
  }, []);

  // Predefined locations
  const predefinedLocations = [
    "Mumbai",
    "Nashik",
    "Gandhinagar",
    "USA: New York",
    "United Kingdom: London",
  ];

  // Hero section search handler
  const handleHeroSearch = useCallback(() => {
    const searchQueryTrimmed = heroSearchQuery.trim();
    const locationTrimmed = heroLocation.trim();

    // Update search term with job title/keywords
    setSearchTerm(searchQueryTrimmed);

    // Handle location
    if (locationTrimmed) {
      // Check if it matches a predefined location exactly
      if (predefinedLocations.includes(locationTrimmed)) {
        // Use exact location filter
        setSelectedLocations([locationTrimmed]);
      } else {
        // If not a predefined location, include in search term (which searches location field)
        if (searchQueryTrimmed) {
          setSearchTerm(`${searchQueryTrimmed} ${locationTrimmed}`.trim());
        } else {
          setSearchTerm(locationTrimmed);
        }
        // Clear selected locations if any were set
        setSelectedLocations([]);
      }
    } else {
      // If location is cleared, clear selected locations
      setSelectedLocations([]);
    }

    // Reset to first page when searching
    setCurrentPage(1);

    // Scroll to results section
    setTimeout(() => {
      const resultsSection = document.getElementById("job-results");
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  }, [heroSearchQuery, heroLocation]);

  // Predefined categories
  const predefinedCategories = [
    "Commerce",
    "Telecommunications",
    "Hotels & Tourism",
    "Education",
    "Financial Services",
    "Technology",
    "Healthcare",
    "Manufacturing",
    "Retail",
    "Real Estate",
  ];

  // Predefined job types
  const predefinedJobTypes = [
    "Full Time",
    "Part Time",
    "Freelance",
    "Seasonal",
    "Fixed-Price",
    "Contract",
    "Internship",
  ];

  // Predefined experience levels
  const predefinedExperienceLevels = [
    "No-experience",
    "Fresher",
    "Intermediate",
    "Expert",
    "Entry Level",
    "Mid Level",
    "Senior Level",
  ];

  // Helper functions to get unique values and counts
  const getUniqueLocations = useMemo(() => {
    // Return predefined locations with counts from actual jobs
    return predefinedLocations.map((loc) => ({
      label: loc,
      count: jobs.filter((job) => job.location === loc).length,
    }));
  }, [jobs]);

  const getUniqueCategories = useMemo(() => {
    // Return predefined categories with counts from actual jobs
    return predefinedCategories.map((cat) => ({
      label: cat,
      count: jobs.filter(
        (job) =>
          (job.teamName && job.teamName === cat) ||
          (job.category && job.category === cat)
      ).length,
    }));
  }, [jobs]);

  const getUniqueJobTypes = useMemo(() => {
    // Return predefined job types with counts from actual jobs
    return predefinedJobTypes.map((type) => ({
      label: type,
      count: jobs.filter((job) => job.jobType === type).length,
    }));
  }, [jobs]);

  const getUniqueExperienceLevels = useMemo(() => {
    // Return predefined experience levels with counts from actual jobs
    return predefinedExperienceLevels.map((level) => ({
      label: level,
      count: jobs.filter((job) => job.experience === level).length,
    }));
  }, [jobs]);

  const getUniqueTags = useMemo(() => {
    const allTags = [];
    jobs.forEach((job) => {
      if (job.skills) {
        const skills = Array.isArray(job.skills)
          ? job.skills
          : job.skills.split(",").map((s) => s.trim());
        allTags.push(...skills);
      }
    });
    return [...new Set(allTags)].filter((tag) => tag && tag.trim() !== "");
  }, [jobs]);

  // Date posted options with counts
  const datePostedOptions = useMemo(() => {
    const now = new Date();
    const options = [
      { label: "All", value: "all" },
      { label: "Last Hour", value: "1h" },
      { label: "Last 24 Hours", value: "24h" },
      { label: "Last 7 Days", value: "7d" },
      { label: "Last 30 Days", value: "30d" },
    ];

    return options.map((option) => {
      if (option.value === "all") {
        return { ...option, count: jobs.length };
      }

      let count = 0;
      jobs.forEach((job) => {
        if (!job.createdAt) return;
        const jobDate = new Date(job.createdAt);
        const diffInHours = (now - jobDate) / (1000 * 60 * 60);

        if (option.value === "1h" && diffInHours <= 1) count++;
        else if (option.value === "24h" && diffInHours <= 24) count++;
        else if (option.value === "7d" && diffInHours <= 168) count++;
        else if (option.value === "30d" && diffInHours <= 720) count++;
      });

      return { ...option, count };
    });
  }, [jobs]);

  // Use useMemo for filtered jobs to avoid unnecessary recalculations
  const filteredJobs = useMemo(() => {
    let filtered = jobs;

    // Search filter
    if (searchTerm.trim() !== "") {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.jobRole?.toLowerCase().includes(searchLower) ||
          job.companyName?.toLowerCase().includes(searchLower) ||
          job.designation?.toLowerCase().includes(searchLower) ||
          job.location?.toLowerCase().includes(searchLower)
      );
    }

    // Location filter
    if (selectedLocations.length > 0) {
      filtered = filtered.filter((job) =>
        selectedLocations.includes(job.location)
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(
        (job) =>
          selectedCategories.includes(job.teamName) ||
          selectedCategories.includes(job.category)
      );
    }

    // Job Type filter
    if (selectedJobTypes.length > 0) {
      filtered = filtered.filter((job) =>
        selectedJobTypes.includes(job.jobType)
      );
    }

    // Experience Level filter
    if (selectedExperienceLevels.length > 0) {
      filtered = filtered.filter((job) =>
        selectedExperienceLevels.includes(job.experience)
      );
    }

    // Date Posted filter
    if (selectedDatePosted.length > 0 && !selectedDatePosted.includes("all")) {
      const now = new Date();
      filtered = filtered.filter((job) => {
        if (!job.createdAt) return false;
        const jobDate = new Date(job.createdAt);
        const diffInHours = (now - jobDate) / (1000 * 60 * 60);

        return selectedDatePosted.some((option) => {
          if (option === "1h") return diffInHours <= 1;
          if (option === "24h") return diffInHours <= 24;
          if (option === "7d") return diffInHours <= 168;
          if (option === "30d") return diffInHours <= 720;
          return false;
        });
      });
    }

    // Salary filter - only apply if user has changed from default (3-5 lakh)
    if (salaryRange[0] !== 300000 || salaryRange[1] !== 500000) {
      filtered = filtered.filter((job) => {
        if (!job.salary) return false;
        const salaryStr = job.salary.replace(/[^0-9]/g, "");
        const salary = parseInt(salaryStr) || 0;
        return salary >= salaryRange[0] && salary <= salaryRange[1];
      });
    }

    // Tags filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter((job) => {
        if (!job.skills) return false;
        const skills = Array.isArray(job.skills)
          ? job.skills
          : job.skills.split(",").map((s) => s.trim());
        return selectedTags.some((tag) => skills.includes(tag));
      });
    }

    return filtered;
  }, [
    searchTerm,
    jobs,
    selectedLocations,
    selectedCategories,
    selectedJobTypes,
    selectedExperienceLevels,
    selectedDatePosted,
    salaryRange,
    selectedTags,
  ]);

  // Pagination logic
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const startIndex = (currentPage - 1) * jobsPerPage;
  const endIndex = startIndex + jobsPerPage;
  const paginatedJobs = filteredJobs.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredJobs.length]);

  // Call fetch functions on mount
  useEffect(() => {
    fetchJobs();
    fetchSavedJobs();
  }, [fetchJobs, fetchSavedJobs]);

  const handleSaveJob = useCallback(
    async (job) => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setSnackbar({
          open: true,
          message: "Please login to save jobs",
          severity: "warning",
        });
        return;
      }

      const isAlreadySaved = savedJobs.includes(job._id);

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        if (isAlreadySaved) {
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

          setSavedJobs((prev) => prev.filter((id) => id !== job._id));
          setSnackbar({
            open: true,
            message: "Job removed from saved jobs",
            severity: "info",
          });
        } else {
          // Add to saved jobs
          const response = await fetch("/api/users/saved-jobs", {
            method: "POST",
            signal: controller.signal,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ jobId: job._id }),
          });

          clearTimeout(timeoutId);

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to save job");
          }

          setSavedJobs((prev) => [...prev, job._id]);
          setSnackbar({
            open: true,
            message: "Job saved successfully!",
            severity: "success",
          });
        }
      } catch (error) {
        if (error.name === "AbortError") {
          setSnackbar({
            open: true,
            message: "Request timeout. Please try again.",
            severity: "error",
          });
        } else {
          console.error("Error saving/removing job:", error);
          setSnackbar({
            open: true,
            message: error.message || "Failed to save job. Please try again.",
            severity: "error",
          });
        }
      }
    },
    [savedJobs]
  );

  const isJobSaved = useCallback(
    (jobId) => {
      return savedJobs.includes(jobId);
    },
    [savedJobs]
  );

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getTimeAgo = useCallback((date) => {
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
  }, []);

  // Format salary in Indian format (Lakhs and Thousands)
  const formatIndianCurrency = useCallback((value) => {
    if (value >= 100000) {
      const lakhs = value / 100000;
      return `${lakhs.toFixed(lakhs % 1 === 0 ? 0 : 1)} Lakh`;
    } else if (value >= 1000) {
      const thousands = value / 1000;
      return `${thousands.toFixed(thousands % 1 === 0 ? 0 : 1)} Thousand`;
    }
    return value.toString();
  }, []);

  // Format salary with ₹ symbol
  const formatSalaryDisplay = useCallback((min, max) => {
    const minFormatted = formatIndianCurrency(min);
    const maxFormatted = formatIndianCurrency(max);
    return `₹${minFormatted} - ₹${maxFormatted}`;
  }, [formatIndianCurrency]);

  // Get active filters as chips
  const activeFilters = useMemo(() => {
    const filters = [];

    selectedLocations.forEach((loc) => {
      filters.push({ type: "location", label: `Location: ${loc}`, value: loc });
    });

    selectedCategories.forEach((cat) => {
      filters.push({ type: "category", label: `Category: ${cat}`, value: cat });
    });

    selectedJobTypes.forEach((type) => {
      filters.push({
        type: "jobType",
        label: `Job Type: ${type}`,
        value: type,
      });
    });

    selectedExperienceLevels.forEach((level) => {
      filters.push({
        type: "experience",
        label: `Experience: ${level}`,
        value: level,
      });
    });

    selectedDatePosted.forEach((date) => {
      if (date !== "all") {
        const dateLabel =
          datePostedOptions.find((opt) => opt.value === date)?.label || date;
        filters.push({
          type: "datePosted",
          label: `Date: ${dateLabel}`,
          value: date,
        });
      }
    });

    selectedTags.forEach((tag) => {
      filters.push({ type: "tag", label: `Tag: ${tag}`, value: tag });
    });

    // Only show salary filter chip if user has changed from default (3-5 lakh)
    if (salaryRange[0] !== 300000 || salaryRange[1] !== 500000) {
      filters.push({
        type: "salary",
        label: formatSalaryDisplay(salaryRange[0], salaryRange[1]),
        value: salaryRange,
      });
    }

    return filters;
  }, [
    selectedLocations,
    selectedCategories,
    selectedJobTypes,
    selectedExperienceLevels,
    selectedDatePosted,
    selectedTags,
    salaryRange,
    datePostedOptions,
  ]);

  // Auto-collapse when all filters are removed
  useEffect(() => {
    if (activeFilters.length === 0) {
      setShowAllFilters(false);
    }
  }, [activeFilters]);

  // Remove filter handler
  const handleRemoveFilter = useCallback(
    (filter) => {
      switch (filter.type) {
        case "location":
          setSelectedLocations(
            selectedLocations.filter((l) => l !== filter.value)
          );
          break;
        case "category":
          setSelectedCategories(
            selectedCategories.filter((c) => c !== filter.value)
          );
          break;
        case "jobType":
          setSelectedJobTypes(
            selectedJobTypes.filter((t) => t !== filter.value)
          );
          break;
        case "experience":
          setSelectedExperienceLevels(
            selectedExperienceLevels.filter((e) => e !== filter.value)
          );
          break;
        case "datePosted":
          setSelectedDatePosted(
            selectedDatePosted.filter((d) => d !== filter.value)
          );
          break;
        case "tag":
          setSelectedTags(selectedTags.filter((t) => t !== filter.value));
          break;
        case "salary":
          setSalaryRange([300000, 500000]); // Reset to default (3-5 lakh)
          break;
        default:
          break;
      }
    },
    [
      selectedLocations,
      selectedCategories,
      selectedJobTypes,
      selectedExperienceLevels,
      selectedDatePosted,
      selectedTags,
    ]
  );

  // Clear all filters
  const handleClearAllFilters = useCallback(() => {
    setSelectedLocations([]);
    setSelectedCategories([]);
    setSelectedJobTypes([]);
    setSelectedExperienceLevels([]);
    setSelectedDatePosted([]);
    setSelectedTags([]);
    setSalaryRange([300000, 500000]); // Reset to default
    setShowAllFilters(false); // Collapse when clearing all filters
  }, []);

  return (
    <HeaderFooterLayout>
      <Box className="page-content">
        {/* Hero Section */}
        <Box className="smHeroSection">
          <Image
            src="/assets/HeroBanner.jpg"
            alt="Background"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center' }}
            quality={100}
            priority
          />
          <Box className="gradient-overlay"></Box>
          <Box className="content">
            <Container maxWidth="lg">
              <Grid container spacing={0} alignItems="center" justifyContent="center" textAlign="center">
                <Grid size={{ lg: 9, md: 8, sm: 10, xs: 12 }}>  
                  <Box pt={3} pb={3}>
                    <Typography variant="h1" className='white fw4 lora' sx={{ mb: 2 }}>
                      Find Your Dream Job Today
                    </Typography>

                    <Typography variant="h6" className='white fw4 lora' sx={{ mb: 4, opacity: 0.9 }}>
                      Discover thousands of job opportunities across various industries. <br/>
                      Connect with top employers and take the next step in your career journey.
                    </Typography>

                    {/* Search Bar */}
                    <Box sx={{ 
                      mb: 4,
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      gap: 1,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                      <TextField
                        placeholder="Job title, keywords, or company"
                        value={heroSearchQuery}
                        onChange={(e) => setHeroSearchQuery(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleHeroSearch();
                          }
                        }}
                        sx={{
                          flex: { xs: 1, sm: 2 },
                          maxWidth: { xs: '100%', sm: '400px' },
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            borderRadius: '6px',
                            '& fieldset': {
                              border: 'none',
                            },
                          },
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon sx={{ color: 'var(--text-secondary)' }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                      <TextField
                        placeholder="Location"
                        value={heroLocation}
                        onChange={(e) => setHeroLocation(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleHeroSearch();
                          }
                        }}
                        sx={{
                          flex: { xs: 1, sm: 1 },
                          maxWidth: { xs: '100%', sm: '250px' },
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            borderRadius: '6px',
                            '& fieldset': {
                              border: 'none',
                            },
                          },
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocationOnOutlinedIcon sx={{ color: 'var(--text-secondary)' }} />
                            </InputAdornment>
                          ),
                        }}
                      />
                      <Button
                        onClick={handleHeroSearch}
                        className="primary-action-btn"
                        disableRipple
                        sx={{
                          minWidth: { xs: '100%', sm: '150px' },
                          height: '56px',
                          fontSize: '14px',
                          fontWeight: 600,
                        }}
                      >
                        Search Jobs
                      </Button>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Container>
          </Box>
        </Box>
        <Container maxWidth="lg">
          <Box className="section"> 

            <Grid container spacing={3} alignItems="flex-start">
              {/* Filter Sidebar */}
              <Grid size={{ xs: 12, sm: 12, md: 4, lg: 4 }}>
                <Box
                  className="whitebox"
                  sx={{ p: 3, position: "sticky", top: 80 }}
                >
                  {/* Filtering by Section */}
                  <Box sx={{ mb: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1.5,
                        cursor: "pointer",
                      }}
                      onClick={() => setShowAllFilters(!showAllFilters)}
                    >
                      <Typography variant="h6" className="fw6 text">
                        Filtering by:
                      </Typography>
                      {showAllFilters ? (
                        <ExpandLessOutlinedIcon fontSize="medium" />
                      ) : (
                        <ExpandMoreOutlinedIcon fontSize="medium" />
                      )}
                    </Box>
                    {/* Show text when collapsed OR when no filters */}
                    {(!showAllFilters || activeFilters.length === 0) && (
                      <Box ml={"12px"}>
                        <Typography variant="body2" className="text-secondary" sx={{ mt: 1 }}>
                          {activeFilters.length} filter{activeFilters.length !== 1 ? 's' : ''} applied
                        </Typography>
                        <Typography variant="body2" className="text-secondary">
                          You can remove them or clear all at once.
                        </Typography>
                      </Box>
                    )}
                    {/* Show chips only when expanded and filters exist */}
                    <Collapse in={showAllFilters && activeFilters.length > 0}>
                      {activeFilters.length > 0 && (
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 1,
                            mb: 2,
                          }}
                        >
                          {activeFilters.map((filter, index) => (
                            <Chip
                              key={`${filter.type}-${index}`}
                              label={filter.label}
                              onDelete={() => handleRemoveFilter(filter)}
                              deleteIcon={<CloseOutlinedIcon fontSize="medium" />}
                              size="small"
                              className="filter-chips"
                              sx={{
                                backgroundColor: "var(--primary)",
                                color: "#fff",
                                "& .MuiChip-deleteIcon": {
                                  color: "#fff",
                                  "&:hover": {
                                    color: "#f0f0f0",
                                  },
                                },
                              }}
                            />
                          ))}
                        </Box>
                      )}
                    </Collapse>
                  </Box>

                  <Divider sx={{ my: 3 }} /> 

                  {/* Location */}
                  <Box sx={{ mb: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1.5,
                        cursor: "pointer",
                      }}
                      onClick={() => setLocationExpanded(!locationExpanded)}
                    >
                      <Typography variant="h6" className="fw6 text">
                        Location
                      </Typography>
                      {locationExpanded ? (
                        <ExpandLessOutlinedIcon fontSize="medium" />
                      ) : (
                        <ExpandMoreOutlinedIcon fontSize="medium" />
                      )}
                    </Box>
                    <Collapse in={locationExpanded}>
                      <Box>
                        {getUniqueLocations.map((location) => (
                        <FormControlLabel
                          key={location.label}
                          control={
                            <Checkbox
                              checked={selectedLocations.includes(location.label)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedLocations([
                                    ...selectedLocations,
                                    location.label,
                                  ]);
                                } else {
                                  setSelectedLocations(
                                    selectedLocations.filter(
                                      (l) => l !== location.label
                                    )
                                  );
                                }
                              }}
                              size="small"
                            />
                          }
                          label={
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                width: "100%",
                              }}
                            >
                              <Typography variant="body2">
                                {location.label}
                              </Typography>
                              <Typography
                                variant="body2"
                                className="text-secondary"
                                sx={{ ml: 2 }}
                              >
                                ({location.count})
                              </Typography>
                            </Box>
                          }
                          sx={{ width: "100%", m: 0, mb: 0.5 }}
                        />
                        ))}
                      </Box>
                    </Collapse>
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  {/* Category */}
                  <Box sx={{ mb: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1.5,
                        cursor: "pointer",
                      }}
                      onClick={() => setCategoryExpanded(!categoryExpanded)}
                    >
                      <Typography variant="h6" className="fw6 text">
                        Category
                      </Typography>
                      {categoryExpanded ? (
                        <ExpandLessOutlinedIcon fontSize="medium" />
                      ) : (
                        <ExpandMoreOutlinedIcon fontSize="medium" />
                      )}
                    </Box>
                    <Collapse in={categoryExpanded}>
                      <Box>
                        {getUniqueCategories.map((category) => (
                          <FormControlLabel
                            key={category.label}
                            control={
                              <Checkbox
                                checked={selectedCategories.includes(
                                  category.label
                                )}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedCategories([
                                      ...selectedCategories,
                                      category.label,
                                    ]);
                                  } else {
                                    setSelectedCategories(
                                      selectedCategories.filter(
                                        (c) => c !== category.label
                                      )
                                    );
                                  }
                                }}
                                size="small"
                              />
                            }
                            label={
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  width: "100%",
                                }}
                              >
                                <Typography variant="body2">
                                  {category.label}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  className="text-secondary"
                                  sx={{ ml: 2 }}
                                >
                                  ({category.count})
                                </Typography>
                              </Box>
                            }
                            sx={{ width: "100%", m: 0, mb: 0.5 }}
                          />
                        ))}
                      </Box>
                    </Collapse>
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  {/* Job Type */}
                  <Box sx={{ mb: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1.5,
                        cursor: "pointer",
                      }}
                      onClick={() => setJobTypeExpanded(!jobTypeExpanded)}
                    >
                      <Typography variant="h6" className="fw6 text">
                        Job Type
                      </Typography>
                      {jobTypeExpanded ? (
                        <ExpandLessOutlinedIcon fontSize="medium" />
                      ) : (
                        <ExpandMoreOutlinedIcon fontSize="medium" />
                      )}
                    </Box>
                    <Collapse in={jobTypeExpanded}>
                      <Box>
                        {getUniqueJobTypes.map((type) => (
                        <FormControlLabel
                          key={type.label}
                          control={
                            <Checkbox
                              checked={selectedJobTypes.includes(type.label)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedJobTypes([
                                    ...selectedJobTypes,
                                    type.label,
                                  ]);
                                } else {
                                  setSelectedJobTypes(
                                    selectedJobTypes.filter(
                                      (t) => t !== type.label
                                    )
                                  );
                                }
                              }}
                              size="small"
                            />
                          }
                          label={
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                width: "100%",
                              }}
                            >
                              <Typography variant="body2">
                                {type.label}
                              </Typography>
                              <Typography
                                variant="body2"
                                className="text-secondary"
                                sx={{ ml: 2 }}
                              >
                                ({type.count})
                              </Typography>
                            </Box>
                          }
                          sx={{ width: "100%", m: 0, mb: 0.5 }}
                        />
                        ))}
                      </Box>
                    </Collapse>
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  {/* Experience Level */}
                  <Box sx={{ mb: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1.5,
                        cursor: "pointer",
                      }}
                      onClick={() => setExperienceExpanded(!experienceExpanded)}
                    >
                      <Typography variant="h6" className="fw6 text">
                        Experience Level
                      </Typography>
                      {experienceExpanded ? (
                        <ExpandLessOutlinedIcon fontSize="medium" />
                      ) : (
                        <ExpandMoreOutlinedIcon fontSize="medium" />
                      )}
                    </Box>
                    <Collapse in={experienceExpanded}>
                      <Box>
                        {getUniqueExperienceLevels.map((level) => (
                        <FormControlLabel
                          key={level.label}
                          control={
                            <Checkbox
                              checked={selectedExperienceLevels.includes(
                                level.label
                              )}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedExperienceLevels([
                                    ...selectedExperienceLevels,
                                    level.label,
                                  ]);
                                } else {
                                  setSelectedExperienceLevels(
                                    selectedExperienceLevels.filter(
                                      (l) => l !== level.label
                                    )
                                  );
                                }
                              }}
                              size="small"
                            />
                          }
                          label={
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                width: "100%",
                              }}
                            >
                              <Typography variant="body2">
                                {level.label}
                              </Typography>
                              <Typography
                                variant="body2"
                                className="text-secondary"
                                sx={{ ml: 2 }}
                              >
                                ({level.count})
                              </Typography>
                            </Box>
                          }
                          sx={{ width: "100%", m: 0, mb: 0.5 }}
                        />
                        ))}
                      </Box>
                    </Collapse>
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  {/* Date Posted */}
                  <Box sx={{ mb: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 1.5,
                        cursor: "pointer",
                      }}
                      onClick={() => setDatePostedExpanded(!datePostedExpanded)}
                    >
                      <Typography variant="h6" className="fw6 text">
                        Date Posted
                      </Typography>
                      {datePostedExpanded ? (
                        <ExpandLessOutlinedIcon fontSize="medium" />
                      ) : (
                        <ExpandMoreOutlinedIcon fontSize="medium" />
                      )}
                    </Box>
                    <Collapse in={datePostedExpanded}>
                      <Box>
                        {datePostedOptions.map((option) => (
                        <FormControlLabel
                          key={option.value}
                          control={
                            <Checkbox
                              checked={selectedDatePosted.includes(
                                option.value
                              )}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  if (option.value === "all") {
                                    setSelectedDatePosted(["all"]);
                                  } else {
                                    setSelectedDatePosted([
                                      ...selectedDatePosted.filter(
                                        (d) => d !== "all"
                                      ),
                                      option.value,
                                    ]);
                                  }
                                } else {
                                  setSelectedDatePosted(
                                    selectedDatePosted.filter(
                                      (d) => d !== option.value
                                    )
                                  );
                                }
                              }}
                              size="small"
                            />
                          }
                          label={
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                width: "100%",
                              }}
                            >
                              <Typography variant="body2">
                                {option.label}
                              </Typography>
                              <Typography
                                variant="body2"
                                className="text-secondary"
                                sx={{ ml: 2 }}
                              >
                                ({option.count || 0})
                              </Typography>
                            </Box>
                          }
                          sx={{ width: "100%", m: 0, mb: 0.5 }}
                        />
                        ))}
                      </Box>
                    </Collapse>
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  {/* Salary */}
                  <Box sx={{ mb: 3 }}>
                    <Typography
                      variant="h6"
                      className="fw6 text"
                      sx={{ mb: 1.5 }}
                    >
                      Salary
                    </Typography>
                    <Box sx={{ width: "100%" }}>
                      <Box px={"12px"}>
                        <Slider
                          value={salaryRange}
                          onChange={(e, newValue) => setSalaryRange(newValue)}
                          valueLabelDisplay="auto"
                          valueLabelFormat={(value) => `₹${formatIndianCurrency(value)}`}
                          getAriaValueText={(value) => `₹${formatIndianCurrency(value)}`}
                          min={300000}
                          max={1000000}
                          step={10000}
                          sx={{ color: "var(--secondary)" }}
                        />
                      <Typography
                        variant="body2" 
                        sx={{ mt: 1 }}
                      >
                        {formatSalaryDisplay(salaryRange[0], salaryRange[1])}
                      </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  {/* Tags */}
                  <Box>
                    <Typography
                      variant="h6"
                      className="fw6 text"
                      sx={{ mb: 1.5 }}
                    >
                      Tags
                    </Typography>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {getUniqueTags.slice(0, 10).map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          clickable
                          onClick={() => {
                            if (selectedTags.includes(tag)) {
                              setSelectedTags(
                                selectedTags.filter((t) => t !== tag)
                              );
                            } else {
                              setSelectedTags([...selectedTags, tag]);
                            }
                          }}
                          color={
                            selectedTags.includes(tag) ? "primary" : "default"
                          }
                          sx={{
                            fontSize: "13px !important",
                            padding: "4px 4px !important",
                            borderRadius: "6px !important",
                            backgroundColor: selectedTags.includes(tag)
                              ? "var(--secondary)"
                              : "#e0f7fa",
                            color: selectedTags.includes(tag)
                              ? "#fff"
                              : "var(--text)",
                            "&:hover": {
                              backgroundColor: selectedTags.includes(tag)
                                ? "var(--secondary)"
                                : "#b2ebf2",
                            },
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Box>
              </Grid>

              {/* Job Listings */}
              <Grid size={{ xs: 12, sm: 12, md: 8, lg: 8 }} id="job-results">
                <Box>
                  {filteredJobs.length === 0 ? (
                    <Box className="whitebox" sx={{ p: 3 }}>
                      <Typography
                        variant="body1"
                        className="text-secondary"
                        align="center"
                      >
                        {searchTerm
                          ? "No jobs found matching your search."
                          : "No jobs available at the moment. Check back later!"}
                      </Typography>
                    </Box>
                  ) : (
                    <>
                      <Grid container spacing={3}>
                        {paginatedJobs.map((job) => (
                        <Grid
                          size={{ xs: 12, sm: 12, md: 12, lg: 12 }}
                          key={job._id}
                        >
                          <Card
                            className="whitebox"
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
                                  borderRadius:"6px",
                                  fontSize:"12px"
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
                                  const jobUrl = `${window.location.origin}/users/jobs/${job.slug || job._id}`;
                                  navigator.clipboard.writeText(jobUrl);
                                  setSnackbar({
                                    open: true,
                                    message: "Job link copied to clipboard!",
                                    severity: "success",
                                  });
                                }}
                                aria-label="Copy job link" 
                              >
                                <ContentCopyOutlinedIcon fontSize="small" sx={{ color: "var(--text-secondary)" }} />
                              </IconButton>

                              {/* Save Job Icon */}
                              <IconButton
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  handleSaveJob(job);
                                }}
                                aria-label={
                                  isJobSaved(job._id)
                                    ? "Remove from saved jobs"
                                    : "Save job to favorites"
                                }
                                aria-pressed={isJobSaved(job._id)} 
                              >
                                {isJobSaved(job._id) ? (
                                  <BookmarkOutlinedIcon fontSize="medium" sx={{ color: "var(--primary)" }} />
                                ) : (
                                  <BookmarkBorderOutlinedIcon fontSize="medium" sx={{ color: "var(--text-secondary)" }} />
                                )}
                              </IconButton>
                            </Box>

                            <Link
                              href={`/users/jobs/${job.slug || job._id}`}
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
                          </Card>
                        </Grid>
                        ))}
                      </Grid>
                      {totalPages > 1 && (
                        <Box sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 2 }}>
                          <Stack spacing={2}>
                            <Pagination
                              count={totalPages}
                              page={currentPage}
                              onChange={(event, value) => setCurrentPage(value)}
                              variant="outlined"
                              shape="rounded"
                            />
                          </Stack>
                        </Box>
                      )}
                    </>
                  )}
                </Box>
              </Grid>
            </Grid>

            {/* Job Listings */}
          </Box>
        </Container>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </HeaderFooterLayout>
  );
};

export default FindJobsPage;
