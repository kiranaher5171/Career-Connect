"use client";
import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Stack, Avatar, Button } from '@mui/material';
import { useRouter } from 'next/navigation';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BusinessIcon from '@mui/icons-material/Business';

const TopCompanies = () => {
    const router = useRouter();

    const companies = [
        {
            id: 1,
            name: "Tech Solutions Inc.",
            logo: null,
            industry: "Technology",
            jobs: 245,
            location: "San Francisco, CA"
        },
        {
            id: 2,
            name: "Innovate Corp",
            logo: null,
            industry: "Innovation",
            jobs: 189,
            location: "New York, NY"
        },
        {
            id: 3,
            name: "Creative Studio",
            logo: null,
            industry: "Design",
            jobs: 156,
            location: "Los Angeles, CA"
        },
        {
            id: 4,
            name: "Analytics Pro",
            logo: null,
            industry: "Data Science",
            jobs: 132,
            location: "Seattle, WA"
        },
        {
            id: 5,
            name: "Cloud Systems",
            logo: null,
            industry: "Cloud Computing",
            jobs: 198,
            location: "Austin, TX"
        },
        {
            id: 6,
            name: "Growth Marketing",
            logo: null,
            industry: "Marketing",
            jobs: 167,
            location: "Chicago, IL"
        }
    ];

    const handleViewCompany = (companyId) => {
        router.push(`/user/find-jobs?company=${companyId}`);
    };

    const handleViewAll = () => {
        router.push('/user/find-jobs');
    };

    return (
        <Box sx={{ py: 8, backgroundColor: '#ffffff' }}>
            <Container maxWidth="lg">
                <Stack spacing={4}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h2" className="fw6 col1" gutterBottom>
                            Top Companies
                        </Typography>
                        <Typography variant="body1" className="text" sx={{ maxWidth: 600, mx: 'auto', mt: 2 }}>
                            Explore opportunities from leading companies across various industries
                        </Typography>
                    </Box>

                    <Grid container spacing={3}>
                        {companies.map((company) => (
                            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={company.id}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: 4,
                                        },
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => handleViewCompany(company.id)}
                                >
                                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                        <Stack spacing={2}>
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Avatar
                                                    sx={{
                                                        width: 60,
                                                        height: 60,
                                                        backgroundColor: '#1976d2',
                                                    }}
                                                >
                                                    <BusinessIcon />
                                                </Avatar>
                                                <Box sx={{ flexGrow: 1 }}>
                                                    <Typography variant="h6" className="fw6" gutterBottom>
                                                        {company.name}
                                                    </Typography>
                                                    <Typography variant="body2" className="text">
                                                        {company.industry}
                                                    </Typography>
                                                </Box>
                                            </Stack>

                                            <Box sx={{ pt: 2, borderTop: '1px solid #e0e0e0' }}>
                                                <Stack spacing={1}>
                                                    <Typography variant="body2" className="text">
                                                        <strong>{company.jobs}</strong> Open Positions
                                                    </Typography>
                                                    <Typography variant="body2" className="text">
                                                        {company.location}
                                                    </Typography>
                                                </Stack>
                                            </Box>

                                            <Button
                                                variant="outlined"
                                                size="small"
                                                endIcon={<ArrowForwardIcon />}
                                                sx={{ textTransform: 'none', mt: 1 }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleViewCompany(company.id);
                                                }}
                                            >
                                                View Jobs
                                            </Button>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    <Box sx={{ textAlign: 'center', mt: 4 }}>
                        <Button
                            variant="outlined"
                            size="large"
                            endIcon={<ArrowForwardIcon />}
                            onClick={handleViewAll}
                            sx={{ 
                                textTransform: 'none',
                                px: 4,
                                py: 1.5
                            }}
                        >
                            View All Companies
                        </Button>
                    </Box>
                </Stack>
            </Container>
        </Box>
    );
};

export default TopCompanies;

