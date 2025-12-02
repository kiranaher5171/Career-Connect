"use client";
import React, { useState } from 'react'
import { Box, Container, Stack, Typography, TextField, InputAdornment, Button } from '@mui/material' 
import Image from 'next/image';
import Grid from "@mui/material/Grid";
import { useRouter } from 'next/navigation';
import SearchIcon from '@mui/icons-material/Search';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import TrendingUpOutlinedIcon from '@mui/icons-material/TrendingUpOutlined';

const HeroSection = () => {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [location, setLocation] = useState('');

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        if (location) params.append('location', location);
        router.push(`/users/jobs?${params.toString()}`);
    };

    return (
        <>
            <Box className="smHeroSection">
                <Image
                    src="/assets/HeroBanner.jpg"
                    alt="Background"
                    fill
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                    quality={100}
                    priority
                />
                <Box className="gradient-overlay"></Box>
                <Box className="content">
                    <Container maxWidth="lg">
                        <Grid container spacing={0} alignItems="center" justifyContent="center" textAlign="center">
                            <Grid size={{ lg: 9, md: 8, sm: 10, xs: 12 }}>  
                                <Box pt={3} pb={3}>
                                    <Typography variant="h1" className='white fw4 lora' sx={{ mb: 2 }}>
                                        Find Your Dream Job Today
                                    </Typography>

                                    <Typography variant="h6" className='white fw4 lora' sx={{ mb: 4, opacity: 0.9 }}>
                                        Discover thousands of job opportunities across various industries. <br/>
                                        Connect with top employers and take the next step in your career journey.
                                    </Typography>

                                    {/* Search Bar */}
                                    <Box sx={{ 
                                        mb: 4,
                                        display: 'flex',
                                        flexDirection: { xs: 'column', sm: 'row' },
                                        gap: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <TextField
                                            placeholder="Job title, keywords, or company"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleSearch();
                                                }
                                            }}
                                            sx={{
                                                flex: { xs: 1, sm: 2 },
                                                maxWidth: { xs: '100%', sm: '400px' },
                                                '& .MuiOutlinedInput-root': {
                                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                    borderRadius: '6px',
                                                    '& fieldset': {
                                                        border: 'none',
                                                    },
                                                },
                                            }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <SearchIcon sx={{ color: 'var(--text-secondary)' }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                        <TextField
                                            placeholder="Location"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleSearch();
                                                }
                                            }}
                                            sx={{
                                                flex: { xs: 1, sm: 1 },
                                                maxWidth: { xs: '100%', sm: '250px' },
                                                '& .MuiOutlinedInput-root': {
                                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                                    borderRadius: '6px',
                                                    '& fieldset': {
                                                        border: 'none',
                                                    },
                                                },
                                            }}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <LocationOnOutlinedIcon sx={{ color: 'var(--text-secondary)' }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                        <Button
                                            onClick={handleSearch}
                                            className="primary-action-btn"
                                            disableRipple
                                            sx={{
                                                minWidth: { xs: '100%', sm: '150px' },
                                                height: '56px',
                                                fontSize: '14px',
                                                fontWeight: 600,
                                            }}
                                        >
                                            Search Jobs
                                        </Button>
                                    </Box> 
                                </Box>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>
            </Box>
        </>
    )
}

export default HeroSection