import React from 'react'
import { Box, Button, Container, Stack, Typography } from '@mui/material'
import Image from 'next/image';
import Grid from "@mui/material/Grid";
import { useRouter } from 'next/navigation'

const HeroSection = () => {
    const router = useRouter();

    return (
        <Box className="smHeroSection" sx={{ position: 'relative', width: '100%', height: '80vh', overflow: 'hidden' }}>
            <Image
                src="/assets/herobanner.jpg"
                alt="Background"
                fill
                style={{ objectFit: 'cover', objectPosition: 'center' }}
                quality={100}
                priority
            />
            <Box className="gradient-overlay" sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}></Box>
            <Box className="content" sx={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', alignItems: 'center' }}>
                <Container maxWidth="lg">
                    <Grid container spacing={0} alignItems="center" justifyContent="center">
                        <Grid item lg={10} md={10} sm={10} xs={12}>
                            <Box py={8} className="center">
                                <Stack spacing={4} alignItems="center">
                                    <Typography variant="h1" className="fw6 white" gutterBottom>
                                        Discover Your Next <span style={{ color: "#eeb92c" }}>Career Leap</span>
                                    </Typography>
                                    <Typography variant="h5" className="white" gutterBottom>
                                        Empowering talent and opportunity for a brighter future.
                                    </Typography>
                                    <Typography variant="body1" className="white" gutterBottom align="center" sx={{ maxWidth: 600 }}>
                                        CareerConnect bridges the gap between job seekers and employers, providing powerful job discovery, networking, and tailored opportunities for your professional journey.
                                    </Typography>
                                    <Stack direction="row" spacing={2} mt={4}>
                                        <Button
                                            variant="contained"
                                            className="primary-action-btn"
                                            size="large"
                                            onClick={() => router.push('/auth/signup')}
                                            disableRipple
                                        >
                                            Get Started
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            className="primary-outline-btn"
                                            size="large"
                                            onClick={() => router.push('/jobs')}
                                            disableRipple
                                        >
                                            Browse Jobs
                                        </Button>
                                    </Stack>
                                </Stack>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Box>
    )
}

export default HeroSection