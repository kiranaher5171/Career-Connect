"use client";
import MainLayout from '../../../layouts/sidebar-layout/MainLayout';
import { Container, Box, Typography, Grid, Card, CardContent } from '@mui/material';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import HeaderFooterLayout from '@/layouts/header-footer-layout/HeaderFooterLayout';
import HeroSection from '../../../components/HeroSection';

const AdminDashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);

  const checkAuth = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/auth/login');
      return false;
    }

    try {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== 'admin') {
        router.push('/auth/login');
        return false;
      }
      setUser(parsedUser);
      return true;
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/auth/login');
      return false;
    }
  };

  useEffect(() => {
    // Initial auth check
    checkAuth();

    // Listen for logout events and storage changes
    const handleLogout = () => {
      router.push('/');
    };

    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === 'user') {
        checkAuth();
      }
    };

    window.addEventListener('userLogout', handleLogout);
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('userLogout', handleLogout);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [router]);

  if (!user) {
    return null;
  }

  return (
    <HeaderFooterLayout>
          <HeroSection/>
      <Container maxWidth>
        <Box>
          <Typography variant="h4" className="fw6" gutterBottom>
            Welcome, Admin {user.firstName} {user.lastName}
          </Typography>
          <Typography variant="body1" className="text" gutterBottom>
            Admin Dashboard - CareerConnect
          </Typography>

          <Grid container spacing={3} mt={2}>
            {/* Field 1 for Admin */}
            <Grid size={{ lg: 4, md: 6, xs: 12 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" className="fw6" gutterBottom>
                    User Management
                  </Typography>
                  <Typography variant="body2" className="text">
                    Manage all users and their accounts
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Field 2 for Admin */}
            <Grid size={{ lg: 4, md: 6, xs: 12 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" className="fw6" gutterBottom>
                    Job Postings
                  </Typography>
                  <Typography variant="body2" className="text">
                    Create and manage job postings
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Field 3 for Admin */}
            <Grid size={{ lg: 4, md: 6, xs: 12 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" className="fw6" gutterBottom>
                    Analytics & Reports
                  </Typography>
                  <Typography variant="body2" className="text">
                    View platform analytics and reports
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

export default AdminDashboard;

