"use client";
import React from 'react';
import { Box, Container, Typography, Card, CardContent, Stack, Grid } from '@mui/material'; 
import { useRouter } from 'next/navigation';
import { MdCode, MdBusinessCenter, MdDesignServices, MdAnalytics, MdEngineering, MdAccountBalance, MdLocalHospital, MdSchool } from 'react-icons/md';

const JobCategories = () => {
    const router = useRouter();

    const categories = [
        {
            id: 1,
            name: "Technology",
            icon: <MdCode size={40} />,
            jobs: "2,450+",
            color: "#1976d2"
        },
        {
            id: 2,
            name: "Business",
            icon: <MdBusinessCenter size={40} />,
            jobs: "1,890+",
            color: "#2e7d32"
        },
        {
            id: 3,
            name: "Design",
            icon: <MdDesignServices size={40} />,
            jobs: "1,230+",
            color: "#ed6c02"
        },
        {
            id: 4,
            name: "Data Science",
            icon: <MdAnalytics size={40} />,
            jobs: "980+",
            color: "#9c27b0"
        },
        {
            id: 5,
            name: "Engineering",
            icon: <MdEngineering size={40} />,
            jobs: "1,650+",
            color: "#d32f2f"
        },
        {
            id: 6,
            name: "Finance",
            icon: <MdAccountBalance size={40} />,
            jobs: "1,120+",
            color: "#0288d1"
        },
        {
            id: 7,
            name: "Healthcare",
            icon: <MdLocalHospital size={40} />,
            jobs: "890+",
            color: "#c62828"
        },
        {
            id: 8,
            name: "Education",
            icon: <MdSchool size={40} />,
            jobs: "750+",
            color: "#1565c0"
        }
    ];

    const handleCategoryClick = (categoryName) => {
        router.push(`/user/find-jobs?category=${encodeURIComponent(categoryName)}`);
    };

    return (
        <Box sx={{ py: 8, backgroundColor: '#ffffff' }}>
            <Container maxWidth="lg">
                <Stack spacing={4}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h2" className="fw6 col1" gutterBottom>
                            Browse by Department
                        </Typography>
                        <Typography variant="body1" className="text" sx={{ maxWidth: 600, mx: 'auto', mt: 2 }}>
                            Explore opportunities across different departments and find your perfect role
                        </Typography>
                    </Box>

                    <Grid container spacing={3}>
                        {categories.map((category) => (
                            <Grid size={{ xs: 6, sm: 4, md: 3 }} key={category.id}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        textAlign: 'center',
                                        p: 3,
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                        cursor: 'pointer',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: 4,
                                        },
                                    }}
                                    onClick={() => handleCategoryClick(category.name)}
                                >
                                    <CardContent sx={{ width: '100%' }}>
                                        <Stack spacing={2} alignItems="center">
                                            <Box
                                                sx={{
                                                    color: category.color,
                                                    mb: 1
                                                }}
                                            >
                                                {category.icon}
                                            </Box>
                                            <Typography variant="h6" className="fw6">
                                                {category.name}
                                            </Typography>
                                            <Typography variant="body2" className="text">
                                                {category.jobs} Jobs
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

export default JobCategories;

