"use client"; 
import { Container, Box, Typography, Grid, Card, CardContent, Button, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import HeaderFooterLayout from '@/layouts/header-footer-layout/HeaderFooterLayout';
import SearchIcon from '@mui/icons-material/Search';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const FindJobs = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);

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
  }, [router]);

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
                disableRipple
              >
                Search
              </Button>
            </Stack>
          </Card>

          {/* Job Listings */}
          <Grid container spacing={3}>
            {/* Sample Job Card 1 */}
            <Grid size={{ lg: 6, md: 6, xs: 12 }}>
              <Card sx={{ height: '100%', '&:hover': { boxShadow: 4 } }}>
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
                        Software Developer
                      </Typography>
                      <Typography variant="body2" className="text" gutterBottom>
                        Tech Company Inc.
                      </Typography>
                      <Stack direction="row" spacing={2} mt={1}>
                        <Typography variant="caption" className="text">
                          <LocationOnIcon sx={{ fontSize: 16, verticalAlign: 'middle' }} /> Remote
                        </Typography>
                        <Typography variant="caption" className="text">
                          Full-time
                        </Typography>
                      </Stack>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ mt: 2 }}
                        disableRipple
                      >
                        View Details
                      </Button>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Sample Job Card 2 */}
            <Grid size={{ lg: 6, md: 6, xs: 12 }}>
              <Card sx={{ height: '100%', '&:hover': { boxShadow: 4 } }}>
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
                        Product Manager
                      </Typography>
                      <Typography variant="body2" className="text" gutterBottom>
                        StartupXYZ
                      </Typography>
                      <Stack direction="row" spacing={2} mt={1}>
                        <Typography variant="caption" className="text">
                          <LocationOnIcon sx={{ fontSize: 16, verticalAlign: 'middle' }} /> New York, NY
                        </Typography>
                        <Typography variant="caption" className="text">
                          Full-time
                        </Typography>
                      </Stack>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ mt: 2 }}
                        disableRipple
                      >
                        View Details
                      </Button>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Sample Job Card 3 */}
            <Grid size={{ lg: 6, md: 6, xs: 12 }}>
              <Card sx={{ height: '100%', '&:hover': { boxShadow: 4 } }}>
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
                        UX Designer
                      </Typography>
                      <Typography variant="body2" className="text" gutterBottom>
                        Design Studio
                      </Typography>
                      <Stack direction="row" spacing={2} mt={1}>
                        <Typography variant="caption" className="text">
                          <LocationOnIcon sx={{ fontSize: 16, verticalAlign: 'middle' }} /> San Francisco, CA
                        </Typography>
                        <Typography variant="caption" className="text">
                          Contract
                        </Typography>
                      </Stack>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ mt: 2 }}
                        disableRipple
                      >
                        View Details
                      </Button>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>

            {/* Sample Job Card 4 */}
            <Grid size={{ lg: 6, md: 6, xs: 12 }}>
              <Card sx={{ height: '100%', '&:hover': { boxShadow: 4 } }}>
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
                        Data Analyst
                      </Typography>
                      <Typography variant="body2" className="text" gutterBottom>
                        Analytics Corp
                      </Typography>
                      <Stack direction="row" spacing={2} mt={1}>
                        <Typography variant="caption" className="text">
                          <LocationOnIcon sx={{ fontSize: 16, verticalAlign: 'middle' }} /> Chicago, IL
                        </Typography>
                        <Typography variant="caption" className="text">
                          Full-time
                        </Typography>
                      </Stack>
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ mt: 2 }}
                        disableRipple
                      >
                        View Details
                      </Button>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </HeaderFooterLayout>
  );
};

export default FindJobs;

