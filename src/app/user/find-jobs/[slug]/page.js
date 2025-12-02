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
  CircularProgress,
} from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import WorkIcon from "@mui/icons-material/Work";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import GroupsIcon from "@mui/icons-material/Groups";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import HeaderFooterLayout from '@/layouts/header-footer-layout/HeaderFooterLayout';
import { useRouter, useParams } from "next/navigation";

const JobDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug;
  const [job, setJob] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchJobDetails();
    }
  }, [slug]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/jobs/slug/${slug}`);
      const data = await response.json();
      
      if (data.success) {
        setJob(data.data);
      } else {
        setError(data.error || "Job not found");
      }
    } catch (error) {
      console.error("Error fetching job details:", error);
      setError("Failed to load job details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <HeaderFooterLayout>
        <Container maxWidth="lg">
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <CircularProgress />
          </Box>
        </Container>
      </HeaderFooterLayout>
    );
  }

  if (error || !job) {
    return (
      <HeaderFooterLayout>
        <Container maxWidth="lg">
          <Box sx={{ py: 4 }}>
            <Button
              disableRipple
              startIcon={<KeyboardBackspaceIcon />}
              onClick={() => router.push("/user/find-jobs")}
              className="back-btn"
              sx={{ mb: 3 }}
            >
              Back to Jobs
            </Button>
            <Card sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="h5" className="fw6 text" gutterBottom>
                {error || "Job not found"}
              </Typography>
              <Typography variant="body1" className="text-secondary" sx={{ mb: 3 }}>
                The job you're looking for doesn't exist or has been removed.
              </Typography>
              <Button
                disableRipple
                variant="contained"
                onClick={() => router.push("/user/find-jobs")}
                className="primary-action-btn"
              >
                Browse All Jobs
              </Button>
            </Card>
          </Box>
        </Container>
      </HeaderFooterLayout>
    );
  }

  const skillsArray = Array.isArray(job.skills) 
    ? job.skills 
    : (job.skills ? job.skills.split(',').map(s => s.trim()).filter(s => s) : []);

  return (
    <HeaderFooterLayout>
      <Container maxWidth="lg">
        <Box sx={{ py: 4 }}>
          {/* Back Button */}
          <Button
            disableRipple
            variant="text"
            startIcon={<KeyboardBackspaceIcon />}
            onClick={() => router.push("/user/find-jobs")}
            className="back-btn"
            sx={{ mb: 3 }}
          >
            Back to Jobs
          </Button>

          {/* Job Header Card */}
          <Card sx={{ p: 4, mb: 3 }}>
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
            <Card sx={{ p: 4, mb: 3 }}>
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
            <Card sx={{ p: 4, mb: 3 }}>
              <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
                <Typography variant="h5" className="fw6 text" gutterBottom sx={{ mb: 2 }}>
                  Key Responsibilities
                </Typography>
                <Typography variant="body1" className="text" sx={{ whiteSpace: 'pre-line' }}>
                  {job.keyResponsibilities}
                </Typography>
              </CardContent>
            </Card>
          )}

          {/* Minimum Qualifications Section */}
          {job.minimumQualifications && (
            <Card sx={{ p: 4, mb: 3 }}>
              <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
                <Typography variant="h5" className="fw6 text" gutterBottom sx={{ mb: 2 }}>
                  Minimum Qualifications
                </Typography>
                <Typography variant="body1" className="text" sx={{ whiteSpace: 'pre-line' }}>
                  {job.minimumQualifications}
                </Typography>
              </CardContent>
            </Card>
          )}

          {/* Benefits Section */}
          {job.benefits && (
            <Card sx={{ p: 4, mb: 3 }}>
              <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
                <Typography variant="h5" className="fw6 text" gutterBottom sx={{ mb: 2 }}>
                  Benefits
                </Typography>
                <Typography variant="body1" className="text" sx={{ whiteSpace: 'pre-line' }}>
                  {job.benefits}
                </Typography>
              </CardContent>
            </Card>
          )}

          {/* Job Description Section */}
          {job.jobDescription && (
            <Card sx={{ p: 4, mb: 3 }}>
              <CardContent sx={{ p: 0, "&:last-child": { pb: 0 } }}>
                <Typography variant="h5" className="fw6 text" gutterBottom sx={{ mb: 3 }}>
                  Job Description
                </Typography>
                <Typography variant="body1" className="text" sx={{ whiteSpace: 'pre-line', lineHeight: 1.8 }}>
                  {job.jobDescription}
                </Typography>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap", mt: 4 }}>
            <Button
              disableRipple
              variant="outlined"
              startIcon={<KeyboardBackspaceIcon />}
              onClick={() => router.push("/user/find-jobs")}
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
            >
              Refer Friend
            </Button>
          </Box>
        </Box>
      </Container>
    </HeaderFooterLayout>
  );
};

export default JobDetailsPage;

