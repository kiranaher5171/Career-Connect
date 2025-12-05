"use client";
import React from 'react';
import { Box, Container, Typography, Stack, Grid } from '@mui/material'; 
import { MdPeople, MdWork, MdBusiness, MdTrendingUp } from 'react-icons/md';

const StatisticsSection = () => {
    const statistics = [
        {
            id: 1,
            number: "5,000+",
            label: "Team Members",
            icon: <MdPeople size={50} />,
            color: "#1976d2"
        },
        {
            id: 2,
            number: "200+",
            label: "Open Positions",
            icon: <MdWork size={50} />,
            color: "#2e7d32"
        },
        {
            id: 3,
            number: "50+",
            label: "Global Locations",
            icon: <MdBusiness size={50} />,
            color: "#ed6c02"
        },
        {
            id: 4,
            number: "95%",
            label: "Success Rate",
            icon: <MdTrendingUp size={50} />,
            color: "#9c27b0"
        }
    ];

    return (
        <Box sx={{ py: 8, backgroundColor: '#1930ab', color: '#ffffff' }}>
            <Container maxWidth="lg">
                <Stack spacing={4}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h2" className="fw6 white" gutterBottom>
                            Our Company by the Numbers
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.8)', maxWidth: 600, mx: 'auto', mt: 2 }}>
                            Join our growing team and be part of our success story
                        </Typography>
                    </Box>

                    <Grid container spacing={4}>
                        {statistics.map((stat) => (
                            <Grid size={{ xs: 6, sm: 4, md: 3, lg:3 }} key={stat.id}>
                                <Box
                                    sx={{
                                        textAlign: 'center',
                                        p: 3,
                                    }}
                                >
                                    <Stack spacing={2} alignItems="center">
                                        <Box
                                            sx={{
                                                color: stat.color,
                                                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                borderRadius: '50%',
                                                width: 100,
                                                height: 100,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            {stat.icon}
                                        </Box>
                                        <Box>
                                            <Typography variant="h3" className="fw6 white" gutterBottom>
                                                {stat.number}
                                            </Typography>
                                            <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                                                {stat.label}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Stack>
            </Container>
        </Box>
    );
};

export default StatisticsSection;

