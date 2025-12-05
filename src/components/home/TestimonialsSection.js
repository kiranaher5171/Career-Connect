"use client";
import React from 'react';
import { Box, Container, Typography, Card, CardContent, Stack, Avatar, Rating, Grid } from '@mui/material'; 
import { MdFormatQuote } from 'react-icons/md';

const TestimonialsSection = () => {
    const testimonials = [
        {
            id: 1,
            name: "Sarah Johnson",
            role: "Software Engineer",
            company: "Tech Solutions Inc.",
            image: null,
            rating: 5,
            text: "I've been with the company for three years and it's been an amazing journey. The growth opportunities and supportive culture make it a great place to work."
        },
        {
            id: 2,
            name: "Michael Chen",
            role: "Product Manager",
            company: "Innovate Corp",
            image: null,
            rating: 5,
            text: "The collaborative environment and focus on innovation make every day exciting. I've learned so much and grown both personally and professionally."
        },
        {
            id: 3,
            name: "Emily Rodriguez",
            role: "UX Designer",
            company: "Creative Studio",
            image: null,
            rating: 5,
            text: "The work-life balance here is exceptional. I can pursue my passion while contributing to meaningful projects that make a real impact."
        },
        {
            id: 4,
            name: "David Thompson",
            role: "Data Scientist",
            company: "Analytics Pro",
            image: null,
            rating: 5,
            text: "The leadership team truly cares about employee development. I've had access to amazing training programs and mentorship opportunities."
        }
    ];

    return (
        <Box sx={{ py: 8, backgroundColor: '#f2f2f2' }}>
            <Container maxWidth="lg">
                <Stack spacing={4}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h2" className="fw6 col1" gutterBottom>
                            What Our Team Says
                        </Typography>
                        <Typography variant="body1" className="text" sx={{ maxWidth: 600, mx: 'auto', mt: 2 }}>
                            Hear from our employees about their experience working with us
                        </Typography>
                    </Box>

                    <Grid container spacing={3}>
                        {testimonials.map((testimonial) => (
                            <Grid size={{ xs: 6, sm: 4, md: 6, lg:6 }} key={testimonial.id}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        p: 3,
                                        position: 'relative',
                                        backgroundColor: '#ffffff',
                                    }}
                                >
                                    <CardContent>
                                        <Stack spacing={3}>
                                            <Box
                                                sx={{
                                                    position: 'absolute',
                                                    top: 20,
                                                    right: 20,
                                                    color: '#e0e0e0',
                                                }}
                                            >
                                                <MdFormatQuote size={60} />
                                            </Box>
                                            
                                            <Rating value={testimonial.rating} readOnly size="small" />
                                            
                                            <Typography variant="body1" className="text" sx={{ pt: 2 }}>
                                                "{testimonial.text}"
                                            </Typography>

                                            <Stack direction="row" spacing={2} alignItems="center" sx={{ pt: 2, borderTop: '1px solid #e0e0e0' }}>
                                                <Avatar
                                                    sx={{
                                                        width: 50,
                                                        height: 50,
                                                        backgroundColor: '#1976d2',
                                                    }}
                                                >
                                                    {testimonial.name.charAt(0)}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="body1" className="fw6">
                                                        {testimonial.name}
                                                    </Typography>
                                                    <Typography variant="body2" className="text">
                                                        {testimonial.role} at {testimonial.company}
                                                    </Typography>
                                                </Box>
                                            </Stack>
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

export default TestimonialsSection;

