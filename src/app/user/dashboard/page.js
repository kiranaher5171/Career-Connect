"use client"; 
import { Container, Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import HeaderFooterLayout from '@/layouts/header-footer-layout/HeaderFooterLayout';  

const UserDashboard = () => {
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
        <Box className="page-content">
          <Typography variant="h4" className="fw6" gutterBottom>
            Welcome, {user.firstName} {user.lastName}
          </Typography>
          <Typography variant="body1" className="text" gutterBottom>
            User Dashboard - CareerConnect
          </Typography>

          <Grid container spacing={3} mt={2}>
            {/* Field 1 for User */}
            <Grid size={{ lg: 4, md: 6, xs: 12 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" className="fw6" gutterBottom>
                    Job Applications
                  </Typography>
                  <Typography variant="body2" className="text">
                    View and manage your job applications
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Field 2 for User */}
            <Grid size={{ lg: 4, md: 6, xs: 12 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" className="fw6" gutterBottom>
                    Profile Settings
                  </Typography>
                  <Typography variant="body2" className="text">
                    Update your profile information
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Field 3 for User */}
            <Grid size={{ lg: 4, md: 6, xs: 12 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" className="fw6" gutterBottom>
                    Saved Jobs
                  </Typography>
                  <Typography variant="body2" className="text">
                    View your saved job listings
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </HeaderFooterLayout>
  );
};

export default UserDashboard;

