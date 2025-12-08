"use client";
import React from 'react';
import { Box, Container, Typography, Card, CardContent, Stack, Grid } from '@mui/material'; 
import { MdWork, MdTrendingUp, MdGroups, MdSchool, MdAttachMoney, MdHealthAndSafety } from 'react-icons/md';

const WhyJoinUs = () => {
    const benefits = [
        {
            id: 1,
            title: "Work-Life Balance",
            description: "We believe in maintaining a healthy balance between work and personal life for all our employees.",
            icon: <MdWork size={50} />,
            color: "#1976d2"
        },
        {
            id: 2,
            title: "Career Growth",
            description: "Continuous learning opportunities and clear career progression paths for professional development.",
            icon: <MdTrendingUp size={50} />,
            color: "#2e7d32"
        },
        {
            id: 3,
            title: "Collaborative Culture",
            description: "Work in a supportive environment where teamwork and innovation are encouraged and valued.",
            icon: <MdGroups size={50} />,
            color: "#ed6c02"
        },
        {
            id: 4,
            title: "Learning & Development",
            description: "Access to training programs, workshops, and resources to enhance your skills and knowledge.",
            icon: <MdSchool size={50} />,
            color: "#9c27b0"
        },
        {
            id: 5,
            title: "Competitive Benefits",
            description: "Comprehensive benefits package including health insurance, retirement plans, and more.",
            icon: <MdAttachMoney size={50} />,
            color: "#d32f2f"
        },
        {
            id: 6,
            title: "Health & Wellness",
            description: "Employee wellness programs, gym memberships, and mental health support for your well-being.",
            icon: <MdHealthAndSafety size={50} />,
            color: "#0288d1"
        }
    ];

    return (
        <Box sx={{ py: 8, backgroundColor: '#ffffff' }}>
            <Container maxWidth="lg">
                <Stack spacing={4}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h2" className="fw6 col1" gutterBottom>
                            Why Join Us
                        </Typography>
                        <Typography variant="body1" className="text" sx={{ maxWidth: 600, mx: 'auto', mt: 2 }}>
                            Discover the benefits and opportunities that make us a great place to work
                        </Typography>
                    </Box>

                    <Grid container spacing={3}>
                        {benefits.map((benefit) => (
                            <Grid size={{ xs: 6, sm: 4, md: 3 }} key={benefit.id}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        textAlign: 'center',
                                        p: 3,
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: 4,
                                        },
                                    }}
                                >
                                    <CardContent sx={{ width: '100%' }}>
                                        <Stack spacing={2} alignItems="center">
                                            <Box
                                                sx={{
                                                    color: benefit.color,
                                                    mb: 1
                                                }}
                                            >
                                                {benefit.icon}
                                            </Box>
                                            <Typography variant="h6" className="fw6">
                                                {benefit.title}
                                            </Typography>
                                            <Typography variant="body2" className="text">
                                                {benefit.description}
                                            </Typography>
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

export default WhyJoinUs;

