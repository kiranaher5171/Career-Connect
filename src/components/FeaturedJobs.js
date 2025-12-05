"use client";
import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Button, Chip, Stack } from '@mui/material';
import { useRouter } from 'next/navigation';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BusinessIcon from '@mui/icons-material/Business';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const FeaturedJobs = () => {
    const router = useRouter();

    // Sample featured jobs data
    const featuredJobs = [
        {
            id: 1,
            title: "Senior Software Engineer",
            company: "Tech Solutions Inc.",
            location: "San Francisco, CA",
            type: "Full-time",
            salary: "$120,000 - $150,000",
            posted: "2 days ago",
            description: "We are looking for an experienced software engineer to join our dynamic team..."
        },
        {
            id: 2,
            title: "Product Manager",
            company: "Innovate Corp",
            location: "New York, NY",
            type: "Full-time",
            salary: "$130,000 - $160,000",
            posted: "1 day ago",
            description: "Lead product development initiatives and work with cross-functional teams..."
        },
        {
            id: 3,
            title: "UX/UI Designer",
            company: "Creative Studio",
            location: "Los Angeles, CA",
            type: "Full-time",
            salary: "$90,000 - $110,000",
            posted: "3 days ago",
            description: "Create beautiful and intuitive user experiences for our digital products..."
        },
        {
            id: 4,
            title: "Data Scientist",
            company: "Analytics Pro",
            location: "Seattle, WA",
            type: "Full-time",
            salary: "$140,000 - $170,000",
            posted: "5 days ago",
            description: "Analyze complex data sets and build predictive models for business insights..."
        },
        {
            id: 5,
            title: "Marketing Manager",
            company: "Growth Marketing",
            location: "Chicago, IL",
            type: "Full-time",
            salary: "$100,000 - $125,000",
            posted: "1 week ago",
            description: "Develop and execute marketing strategies to drive business growth..."
        },
        {
            id: 6,
            title: "DevOps Engineer",
            company: "Cloud Systems",
            location: "Austin, TX",
            type: "Full-time",
            salary: "$115,000 - $145,000",
            posted: "4 days ago",
            description: "Manage infrastructure and deployment pipelines for scalable applications..."
        }
    ];

    const handleViewJob = (jobId) => {
        router.push(`/user/find-jobs/${jobId}`);
    };

    const handleViewAll = () => {
        router.push('/user/find-jobs');
    };

    return (
        <Box sx={{ py: 8, backgroundColor: '#f2f2f2' }}>
            <Container maxWidth="lg">
                <Stack spacing={4}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h2" className="fw6 col1" gutterBottom>
                            Featured Jobs
                        </Typography>
                        <Typography variant="body1" className="text" sx={{ maxWidth: 600, mx: 'auto', mt: 2 }}>
                            Discover exciting career opportunities from top companies
                        </Typography>
                    </Box>

                    <Grid container spacing={3}>
                        {featuredJobs.map((job) => (
                            <Grid item xs={12} sm={6} md={4} key={job.id}>
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
                                    onClick={() => handleViewJob(job.id)}
                                >
                                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                                        <Stack spacing={2}>
                                            <Box>
                                                <Typography variant="h5" className="fw6" gutterBottom>
                                                    {job.title}
                                                </Typography>
                                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
                                                    <BusinessIcon fontSize="small" className="text" />
                                                    <Typography variant="body2" className="text">
                                                        {job.company}
                                                    </Typography>
                                                </Stack>
                                            </Box>

                                            <Stack spacing={1}>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <LocationOnIcon fontSize="small" className="text" />
                                                    <Typography variant="body2" className="text">
                                                        {job.location}
                                                    </Typography>
                                                </Stack>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    <WorkIcon fontSize="small" className="text" />
                                                    <Typography variant="body2" className="text">
                                                        {job.type}
                                                    </Typography>
                                                </Stack>
                                            </Stack>

                                            <Typography variant="body2" className="col1 fw6">
                                                {job.salary}
                                            </Typography>

                                            <Typography variant="body2" className="text" sx={{ 
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                            }}>
                                                {job.description}
                                            </Typography>

                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 1 }}>
                                                <Chip 
                                                    label={job.posted} 
                                                    size="small" 
                                                    sx={{ 
                                                        backgroundColor: '#e3f2fd',
                                                        color: '#1976d2',
                                                        fontSize: '0.75rem'
                                                    }} 
                                                />
                                                <Button
                                                    size="small"
                                                    endIcon={<ArrowForwardIcon />}
                                                    sx={{ textTransform: 'none' }}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleViewJob(job.id);
                                                    }}
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
                            View All Jobs
                        </Button>
                    </Box>
                </Stack>
            </Container>
        </Box>
    );
};

export default FeaturedJobs;

