"use client";
import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  Container,
  Grid,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
} from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import WorkIcon from "@mui/icons-material/Work";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import GroupsIcon from "@mui/icons-material/Groups";
import PersonAddIcon from "@mui/icons-material/PersonAdd"; 
import { useRouter, useParams } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { ReferFriendDialog } from "@/components/dialogs";
import HeaderFooterLayout from "@/layouts/header-footer-layout/HeaderFooterLayout";
import ReplyAllIcon from '@mui/icons-material/ReplyAll';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

const JobDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug;
  const [job, setJob] = useState(null);
  const [error, setError] = useState(null);
  const [referDialogOpen, setReferDialogOpen] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchJobDetails();
    }
  }, [slug]);

  const fetchJobDetails = async () => {
    try {
      setError(null);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      const response = await fetch(`/api/jobs/${slug}`, {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 404) {
          setError("Job not found");
        } else {
          setError("Failed to load job details");
        }
        return;
      }

      const result = await response.json();
      if (result.success) {
        setJob(result.data);
      } else {
        setError(result.error || "Failed to load job details");
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error("Request timeout: Job details fetch took too long");
        setError("Request timeout. Please try again.");
      } else {
        console.error("Error fetching job details:", error);
        setError(error.message || "Failed to load job details");
      }
    }
  };

  if (error || !job) {
    return (
      <HeaderFooterLayout>
        <Box className="page-content">
          <Container maxWidth="lg">
            <Box sx={{ py: 4 }}>
              <Button
                disableRipple
                startIcon={<KeyboardBackspaceIcon />}
                onClick={() => router.push("/users/jobs")}
                className="back-btn"
                sx={{ mb: 3 }}
              >
                Back to Jobs
              </Button>
              <Box className="whitebox" sx={{ p: 4, textAlign: "center" }}>
                <Typography variant="h5" className="fw6 text" gutterBottom>
                  {error || "Job not found"}
                </Typography>
                <Typography variant="body1" className="text-secondary" sx={{ mb: 3 }}>
                  The job you're looking for doesn't exist or has been removed.
                </Typography>
                <Button
                  disableRipple
                  variant="contained"
                  onClick={() => router.push("/users/jobs")}
                  className="primary-action-btn"
                >
                  Browse All Jobs
                </Button>
              </Box>
            </Box>
          </Container>
        </Box>
      </HeaderFooterLayout>
    );
  }

  const skillsArray = Array.isArray(job.skills) ? job.skills : (job.skills ? job.skills.split(',').map(s => s.trim()) : []);

  return (
    <HeaderFooterLayout>
      <Box className="page-content">
        <Container maxWidth="lg">
          <Box sx={{ py: 4 }}>
            {/* Back Button */}
            <Button
            disableRipple
            variant="text"
              startIcon={<KeyboardBackspaceIcon />}
              onClick={() => router.push("/users/jobs")}
              className="back-btn" 
            >
              Back to Jobs
            </Button>

            {/* Job Header Card */}
            <Card className="whitebox" sx={{ p: 4, mb: 3 }}>
              <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: "var(--primary-light)" }}>
                            <WorkIcon sx={{ color: "var(--primary)" }} />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText 
                          primary={job.jobRole || "N/A"}
                          secondary={job.designation || ""}
                          primaryTypographyProps={{ 
                            variant: "h3", 
                            className: "fw6 text" 
                          }}
                          secondaryTypographyProps={{ 
                            variant: "body1", 
                            className: "text-secondary" 
                          }}
                        />
                      </ListItem>
                    </List>
                  </Grid>

                  {/* Job Information Grid */}
                  <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                    <Divider sx={{ my: 2 }} />
                    <Grid container spacing={2}>
                      {job.teamName && (
                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <GroupsIcon className="primary" sx={{ fontSize: 20 }} />
                            <Box>
                              <Typography variant="caption" className="text-secondary">
                                Team Name
                              </Typography>
                              <Typography variant="body1" className="fw5 text">
                                {job.teamName}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      )}
                      {job.jobType && (
                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <AccessTimeIcon className="primary" sx={{ fontSize: 20 }} />
                            <Box>
                              <Typography variant="caption" className="text-secondary">
                                Job Type
                              </Typography>
                              <Typography variant="body1" className="fw5 text">
                                {job.jobType}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      )}
                      {job.location && (
                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <LocationOnIcon className="primary" sx={{ fontSize: 20 }} />
                            <Box>
                              <Typography variant="caption" className="text-secondary">
                                Location
                              </Typography>
                              <Typography variant="body1" className="fw5 text">
                                {job.location}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      )}
                      {job.experience && (
                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <WorkIcon className="primary" sx={{ fontSize: 20 }} />
                            <Box>
                              <Typography variant="caption" className="text-secondary">
                                Experience
                              </Typography>
                              <Typography variant="body1" className="fw5 text">
                                {job.experience}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      )}
                      {job.salary && (
                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <AttachMoneyIcon className="primary" sx={{ fontSize: 20 }} />
                            <Box>
                              <Typography variant="caption" className="text-secondary">
                                Salary
                              </Typography>
                              <Typography variant="body1" className="fw5 text">
                                {job.salary}
                              </Typography>
                            </Box>
                          </Box>
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Professional Skills / Required Skills Section */}
            {skillsArray.length > 0 && (
              <Card className="whitebox" sx={{ p: 4, mb: 3 }}>
                <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
                  <Typography variant="h5" className="fw6 text" gutterBottom sx={{ mb: 2 }}>
                    Professional Skills / Required Skills
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {skillsArray.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        className="primary"
                        sx={{ backgroundColor: "var(--primary-light)", color: "var(--primary)" }}
                      />
                    ))}
                  </Box>
                </CardContent>
              </Card>
            )}

            {/* Key Responsibilities Section */}
            {job.keyResponsibilities && (
              <Card className="whitebox" sx={{ p: 4, mb: 3 }}>
                <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
                  <Typography variant="h5" className="fw6 text" gutterBottom sx={{ mb: 2 }}>
                    Key Responsibilities
                  </Typography>
                  <Box sx={{ 
                    "& p": { mb: 1.5 },
                    "& ul": { pl: 3, mb: 1 },
                    "& li": { mb: 1 },
                    "& strong": { fontWeight: 600 },
                  }}>
                    <ReactMarkdown>{job.keyResponsibilities}</ReactMarkdown>
                  </Box>
                </CardContent>
              </Card>
            )}

            {/* Minimum Qualifications Section */}
            {job.minimumQualifications && (
              <Card className="whitebox" sx={{ p: 4, mb: 3 }}>
                <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
                  <Typography variant="h5" className="fw6 text" gutterBottom sx={{ mb: 2 }}>
                    Minimum Qualifications
                  </Typography>
                  <Box sx={{ 
                    "& p": { mb: 1.5 },
                    "& ul": { pl: 3, mb: 1 },
                    "& li": { mb: 1 },
                    "& strong": { fontWeight: 600 },
                  }}>
                    <ReactMarkdown>{job.minimumQualifications}</ReactMarkdown>
                  </Box>
                </CardContent>
              </Card>
            )}

            {/* Benefits Section */}
            {job.benefits && (
              <Card className="whitebox" sx={{ p: 4, mb: 3 }}>
                <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
                  <Typography variant="h5" className="fw6 text" gutterBottom sx={{ mb: 2 }}>
                    Benefits
                  </Typography>
                  <Box sx={{ 
                    "& p": { mb: 1.5 },
                    "& ul": { pl: 3, mb: 1 },
                    "& li": { mb: 1 },
                    "& strong": { fontWeight: 600 },
                  }}>
                    <ReactMarkdown>{job.benefits}</ReactMarkdown>
                  </Box>
                </CardContent>
              </Card>
            )}

            {/* Job Description Section */}
            {job.jobDescription && (
              <Card className="whitebox" sx={{ p: 4, mb: 3 }}>
                <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
                  <Typography variant="h5" className="fw6 text" gutterBottom sx={{ mb: 3 }}>
                    Job Description
                  </Typography>
                  <Box sx={{ 
                    "& p": { mb: 2, lineHeight: 1.8 },
                    "& ul": { pl: 3, mb: 2 },
                    "& ol": { pl: 3, mb: 2 },
                    "& li": { mb: 1, lineHeight: 1.8 },
                    "& strong": { fontWeight: 600, color: "var(--text)" },
                    "& h1, & h2, & h3, & h4, & h5, & h6": { mb: 2, mt: 2 },
                    "& h1": { fontSize: "2rem" },
                    "& h2": { fontSize: "1.75rem" },
                    "& h3": { fontSize: "1.5rem" },
                  }}>
                    <ReactMarkdown>{job.jobDescription}</ReactMarkdown>
                  </Box>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap", mt: 4 }}>
              <Button
                disableRipple
                variant="outlined"
                startIcon={<KeyboardBackspaceIcon />}
                onClick={() => router.push("/users/jobs")}
                className="secondary-outline-btn"
                sx={{ minWidth: 150 }}
              >
                Back
              </Button>
              <Button
                disableRipple
                variant="contained"
                className="primary-action-btn"
                sx={{ minWidth: 150 }}
              >
                Apply Now
              </Button>
              <Button
                disableRipple
                variant="contained"
                startIcon={<PersonAddIcon />}
                className="secondary-action-btn"
                sx={{ minWidth: 150 }}
                onClick={() => setReferDialogOpen(true)}
              >
                Refer Friend
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Refer Friend Dialog */}
      {job && (
        <ReferFriendDialog
          open={referDialogOpen}
          onClose={() => setReferDialogOpen(false)}
          jobId={job._id?.toString() || job._id}
          jobRole={job.jobRole}
        />
      )}
    </HeaderFooterLayout>
  );
};

export default JobDetailsPage;
