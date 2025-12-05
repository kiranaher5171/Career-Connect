"use client";
import HeroSection from '@/components/HeroSection';
import HeaderFooterLayout from '@/layouts/header-footer-layout/HeaderFooterLayout';
import { Container, Box, Button, Typography, Stack } from '@mui/material'
import { useRouter } from 'next/navigation';
import React from 'react'

const page = () => {
    const router = useRouter();

    return (
        <>
            <HeaderFooterLayout>
                <HeroSection/>
                <Container maxWidth>
                    <Box py={8} className="">
                        <Stack spacing={4} alignItems="center">
                            <Typography variant="h2" className="fw6 col1" gutterBottom>
                                Welcome to CareerConnect
                            </Typography>
                            <Typography variant="h5" className="text" gutterBottom>
                                Your gateway to career opportunities
                            </Typography>
                            <Stack direction="row" spacing={2} mt={4}>
                                <Button
                                    variant="contained"
                                    className="primary-action-btn"
                                    size="large"
                                    onClick={() => router.push('/auth/signup')}
                                    disableRipple
                                >
                                    Sign Up
                                </Button>
                                <Button
                                    variant="outlined"
                                    className="primary-outline-btn"
                                    size="large"
                                    onClick={() => router.push('/auth/login')}
                                    disableRipple
                                >
                                    Login
                                </Button>
                            </Stack>
                        </Stack>
                    </Box>
                </Container>
            </HeaderFooterLayout>
        </>
    )
}

export default page