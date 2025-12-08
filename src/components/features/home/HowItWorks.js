"use client";
import React from 'react';
import { Box, Container, Typography, Stack, Card, CardContent,Grid } from '@mui/material'; 
import { MdPersonAdd, MdSearch, MdSend, MdCheckCircle } from 'react-icons/md';

const HowItWorks = () => {
    const steps = [
        {
            id: 1,
            title: "Create Your Profile",
            description: "Sign up and build your professional profile with your skills, experience, and career goals.",
            icon: <MdPersonAdd size={50} />,
            step: "01"
        },
        {
            id: 2,
            title: "Browse Openings",
            description: "Explore our current job openings filtered by department, location, and role type.",
            icon: <MdSearch size={50} />,
            step: "02"
        },
        {
            id: 3,
            title: "Apply Easily",
            description: "Apply to positions with one click. Upload your resume and showcase your skills.",
            icon: <MdSend size={50} />,
            step: "03"
        },
        {
            id: 4,
            title: "Join Our Team",
            description: "Connect with our hiring team, attend interviews, and start your career journey.",
            icon: <MdCheckCircle size={50} />,
            step: "04"
        }
    ];

    return (
        <Box sx={{ py: 8, backgroundColor: '#f2f2f2' }}>
            <Container maxWidth="lg">
                <Stack spacing={4}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h2" className="fw6 col1" gutterBottom>
                            How to Apply
                        </Typography>
                        <Typography variant="body1" className="text" sx={{ maxWidth: 600, mx: 'auto', mt: 2 }}>
                            Join our team in four simple steps and start your career journey with us
                        </Typography>
                    </Box>

                    <Grid container spacing={4}>
                        {steps.map((step, index) => (
                            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={step.id}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        textAlign: 'center',
                                        position: 'relative',
                                        p: 3,
                                        backgroundColor: '#ffffff',
                                    }}
                                >
                                    <CardContent>
                                        <Stack spacing={3} alignItems="center">
                                            <Box
                                                sx={{
                                                    position: 'relative',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        width: 100,
                                                        height: 100,
                                                        borderRadius: '50%',
                                                        backgroundColor: '#e3f2fd',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: '#1976d2',
                                                    }}
                                                >
                                                    {step.icon}
                                                </Box>
                                                <Box
                                                    sx={{
                                                        position: 'absolute',
                                                        top: -10,
                                                        right: -10,
                                                        width: 40,
                                                        height: 40,
                                                        borderRadius: '50%',
                                                        backgroundColor: '#1976d2',
                                                        color: '#ffffff',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '0.875rem',
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    {step.step}
                                                </Box>
                                            </Box>
                                            <Box>
                                                <Typography variant="h5" className="fw6" gutterBottom>
                                                    {step.title}
                                                </Typography>
                                                <Typography variant="body2" className="text">
                                                    {step.description}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Stack>
            </Container>
        </Box>
    );
};

export default HowItWorks;

