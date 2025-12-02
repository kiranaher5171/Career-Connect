"use client";

import { Box, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import HeaderFooterLayout from '@/layouts/header-footer-layout/HeaderFooterLayout';

export const dynamic = 'force-dynamic';

const NotFoundPage = () => {
    const [countdown, setCountdown] = useState(3)
    const router = useRouter()

    useEffect(() => {
        // Set up the countdown timer
        const timer = setInterval(() => {
            setCountdown((prevCount) => {
                if (prevCount === 1) {
                    // Redirect when countdown reaches 1
                    clearInterval(timer)
                    // Use a setTimeout to delay the push, avoiding the render issue
                    setTimeout(() => router.push('/'), 0)
                }
                return prevCount - 1
            })
        }, 1000)

        return () => clearInterval(timer) // Cleanup timer on component unmount
    }, [router])

    return (
        <HeaderFooterLayout>
            <Box height={'100vh'} display='flex' alignItems="center" justifyContent="center" width={'100%'}>
                <Box className="center">
                    <Typography variant='h5' gutterBottom>The page you are asking for is Not Found. It may be under construction.</Typography>
                    <Typography variant='h6'>Redirecting to homepage in {countdown} seconds.</Typography>
                </Box>
            </Box>
        </HeaderFooterLayout>
    )
}

export default NotFoundPage
