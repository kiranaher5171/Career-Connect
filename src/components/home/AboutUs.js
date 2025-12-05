"use client";
import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Stack } from '@mui/material';
import { MdGroups, MdRocketLaunch, MdVisibility, MdStar } from 'react-icons/md';

const AboutUs = () => {
    const values = [
        {
            id: 1,
            title: "Innovation",
            description: "We continuously push boundaries and embrace new technologies to stay ahead in the industry.",
            icon: <MdRocketLaunch size={40} />,
            color: "#1976d2"
        },
        {
            id: 2,
            title: "Excellence",
            description: "We strive for excellence in everything we do, setting high standards for quality and performance.",
            icon: <MdStar size={40} />,
            color: "#2e7d32"
        },
        {
            id: 3,
            title: "Collaboration",
            description: "We believe in the power of teamwork and working together to achieve common goals.",
            icon: <MdGroups size={40} />,
            color: "#ed6c02"
        },
        {
            id: 4,
            title: "Vision",
            description: "We have a clear vision for the future and are committed to making a positive impact.",
            icon: <MdVisibility size={40} />,
            color: "#9c27b0"
        }
    ];

    return (
        <Box sx={{ py: 8, backgroundColor: '#ffffff' }}>
            <Container maxWidth="lg">
                <Stack spacing={6}>
                    {/* Header Section */}
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h2" className="fw6 col1" gutterBottom>
                            About Us
                        </Typography>
                        <Typography variant="body1" className="text" sx={{ maxWidth: 700, mx: 'auto', mt: 2 }}>
                            Learn more about our company, our mission, and the values that drive us forward
                        </Typography>
                    </Box>

                    {/* Main Content with Image */}
                    <Grid container spacing={4} alignItems="center">
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box
                                sx={{
                                    position: 'relative',
                                    width: '100%',
                                    height: { xs: 300, md: 400 },
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    boxShadow: 3,
                                }}
                            >
                                <Box
                                    component="img"
                                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop&q=80"
                                    alt="Our Team"
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                    }}
                                />
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Stack spacing={3}>
                                <Typography variant="h3" className="fw6 col1">
                                    Our Story
                                </Typography>
                                <Typography variant="body1" className="text" sx={{ lineHeight: 1.8 }}>
                                    Founded with a vision to transform the way people connect with career opportunities, 
                                    we have grown into a trusted platform that bridges the gap between talented professionals 
                                    and meaningful work. Our journey began with a simple belief: everyone deserves access 
                                    to opportunities that align with their skills, passions, and career aspirations.
                                </Typography>
                                <Typography variant="body1" className="text" sx={{ lineHeight: 1.8 }}>
                                    Today, we are proud to be a leading force in the recruitment industry, helping thousands 
                                    of professionals find their dream jobs while enabling companies to discover exceptional talent. 
                                    Our commitment to innovation, excellence, and user-centric design continues to drive our success.
                                </Typography>
                            </Stack>
                        </Grid>
                    </Grid>

                    {/* Mission & Vision */}
                    <Grid container spacing={4}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Card sx={{ height: '100%', p: 3, backgroundColor: '#f8f9fa' }}>
                                <CardContent>
                                    <Stack spacing={2}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                            <Box
                                                sx={{
                                                    width: 60,
                                                    height: 60,
                                                    borderRadius: '50%',
                                                    backgroundColor: '#e3f2fd',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: '#1976d2',
                                                }}
                                            >
                                                <MdRocketLaunch size={30} />
                                            </Box>
                                            <Typography variant="h4" className="fw6 col1">
                                                Our Mission
                                            </Typography>
                                        </Box>
                                        <Typography variant="body1" className="text" sx={{ lineHeight: 1.8 }}>
                                            To empower professionals worldwide by connecting them with career opportunities 
                                            that match their skills, values, and aspirations. We are committed to creating 
                                            a seamless, transparent, and efficient job search experience for everyone.
                                        </Typography>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Card sx={{ height: '100%', p: 3, backgroundColor: '#f8f9fa' }}>
                                <CardContent>
                                    <Stack spacing={2}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                            <Box
                                                sx={{
                                                    width: 60,
                                                    height: 60,
                                                    borderRadius: '50%',
                                                    backgroundColor: '#e8f5e9',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: '#2e7d32',
                                                }}
                                            >
                                                <MdVisibility size={30} />
                                            </Box>
                                            <Typography variant="h4" className="fw6 col1">
                                                Our Vision
                                            </Typography>
                                        </Box>
                                        <Typography variant="body1" className="text" sx={{ lineHeight: 1.8 }}>
                                            To become the world's most trusted career platform, where every professional 
                                            can discover opportunities that enable them to reach their full potential. 
                                            We envision a future where finding the perfect job is effortless and accessible to all.
                                        </Typography>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Values Section */}
                    <Box>
                        <Typography variant="h3" className="fw6 col1" sx={{ textAlign: 'center', mb: 4 }}>
                            Our Core Values
                        </Typography>
                        <Grid container spacing={3}>
                            {values.map((value) => (
                                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={value.id}>
                                    <Card
                                        sx={{
                                            height: '100%',
                                            textAlign: 'center',
                                            p: 3,
                                            transition: 'transform 0.2s, box-shadow 0.2s',
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: 4,
                                            },
                                        }}
                                    >
                                        <CardContent>
                                            <Stack spacing={2} alignItems="center">
                                                <Box
                                                    sx={{
                                                        color: value.color,
                                                        mb: 1
                                                    }}
                                                >
                                                    {value.icon}
                                                </Box>
                                                <Typography variant="h6" className="fw6">
                                                    {value.title}
                                                </Typography>
                                                <Typography variant="body2" className="text">
                                                    {value.description}
                                                </Typography>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>

                    {/* Team Image Section */}
                    <Grid container spacing={4}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box
                                sx={{
                                    position: 'relative',
                                    width: '100%',
                                    height: { xs: 250, md: 300 },
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    boxShadow: 3,
                                }}
                            >
                                <Box
                                    component="img"
                                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop&q=80"
                                    alt="Our Workplace"
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                    }}
                                />
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Box
                                sx={{
                                    position: 'relative',
                                    width: '100%',
                                    height: { xs: 250, md: 300 },
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    boxShadow: 3,
                                }}
                            >
                                <Box
                                    component="img"
                                    src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&h=600&fit=crop&q=80"
                                    alt="Our Culture"
                                    sx={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                    }}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </Stack>
            </Container>
        </Box>
    );
};

export default AboutUs;

