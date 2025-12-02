"use client"; 
import { Container, Box, Typography, Grid, Card, CardContent, Button, Stack, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import HeaderFooterLayout from '@/layouts/header-footer-layout/HeaderFooterLayout';
import SearchIcon from '@mui/icons-material/Search';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

const FindJobs = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/auth/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'user') {
      router.push('/auth/login');
      return;
    }

    setUser(parsedUser);
    fetchJobs();
  }, [router]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/jobs?status=active');
      const data = await response.json();
      
      if (data.success) {
        setJobs(data.data);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    // Filter jobs based on search query
    // This is a simple client-side filter, you can enhance it with API filtering
    fetchJobs();
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = !searchQuery || 
      job.jobRole?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.designation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.jobDescription?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesLocation = !locationQuery || 
      job.location?.toLowerCase().includes(locationQuery.toLowerCase());
    
    return matchesSearch && matchesLocation;
  });

  if (!user) {
    return null;
  }

  return (
    <HeaderFooterLayout> 
      <Container maxWidth>
        <Box className="page-content" py={4}>
          <Typography variant="h4" className="fw6" gutterBottom>
            Find Jobs
          </Typography>
          <Typography variant="body1" className="text" gutterBottom mb={4}>
            Discover your next career opportunity
          </Typography>

          {/* Search Section */}
          <Card sx={{ mb: 4, p: 3 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
              <Box sx={{ flex: 1, width: '100%' }}>
                <Typography variant="body2" className="text" mb={1}>
                  Search Jobs
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, border: '1px solid #ddd', borderRadius: 1, p: 1 }}>
                  <SearchIcon sx={{ color: 'text.secondary' }} />
                  <input
                    type="text"
                    placeholder="Job title, keywords, or company"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    style={{
                      border: 'none',
                      outline: 'none',
                      flex: 1,
                      padding: '8px',
                      fontFamily: 'var(--font-outfit)'
                    }}
                  />
                </Box>
              </Box>
              <Box sx={{ flex: 1, width: '100%' }}>
                <Typography variant="body2" className="text" mb={1}>
                  Location
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, border: '1px solid #ddd', borderRadius: 1, p: 1 }}>
                  <LocationOnIcon sx={{ color: 'text.secondary' }} />
                  <input
                    type="text"
                    placeholder="City, state, or remote"
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    style={{
                      border: 'none',
                      outline: 'none',
                      flex: 1,
                      padding: '8px',
                      fontFamily: 'var(--font-outfit)'
                    }}
                  />
                </Box>
              </Box>
              <Button
                variant="contained"
                className="primary-action-btn"
                sx={{ mt: { xs: 0, md: 3 }, minWidth: 120 }}
                onClick={handleSearch}
                disableRipple
              >
                Search
              </Button>
            </Stack>
          </Card>

          {/* Job Listings */}
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" py={8}>
              <CircularProgress />
            </Box>
          ) : filteredJobs.length === 0 ? (
            <Box textAlign="center" py={8}>
              <Typography variant="h6" className="text" gutterBottom>
                No jobs found
              </Typography>
              <Typography variant="body2" className="text-secondary">
                Try adjusting your search criteria
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {filteredJobs.map((job) => (
                <Grid key={job._id} size={{ lg: 6, md: 6, xs: 12 }}>
                  <Card sx={{ height: '100%', '&:hover': { boxShadow: 4 }, cursor: 'pointer' }}>
                    <CardContent>
                      <Stack direction="row" spacing={2} alignItems="start">
                        <Box
                          sx={{
                            width: 60,
                            height: 60,
                            borderRadius: 1,
                            bgcolor: 'primary.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white'
                          }}
                        >
                          <WorkOutlineIcon />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" className="fw6" gutterBottom>
                            {job.jobRole || 'N/A'}
                          </Typography>
                          <Typography variant="body2" className="text" gutterBottom>
                            {job.designation || job.teamName || 'CareerConnect'}
                          </Typography>
                          <Stack direction="row" spacing={2} mt={1} flexWrap="wrap" gap={1}>
                            {job.location && (
                              <Typography variant="caption" className="text">
                                <LocationOnIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                                {job.location}
                              </Typography>
                            )}
                            {job.jobType && (
                              <Typography variant="caption" className="text">
                                <AccessTimeIcon sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
                                {job.jobType}
                              </Typography>
                            )}
                            {job.experience && (
                              <Typography variant="caption" className="text">
                                {job.experience}
                              </Typography>
                            )}
                            {job.salary && (
                              <Typography variant="caption" className="text">
                                {job.salary}
                              </Typography>
                            )}
                          </Stack>
                          <Button
                            variant="outlined"
                            size="small"
                            className="primary-outline-btn"
                            sx={{ mt: 2 }}
                            onClick={() => router.push(`/user/find-jobs/${job.slug || job._id}`)}
                            disableRipple
                          >
                            View Details
                          </Button>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Container>
    </HeaderFooterLayout>
  );
};

export default FindJobs;

