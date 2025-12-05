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
                   
                </Container>
            </HeaderFooterLayout>
        </>
    )
}

export default page

