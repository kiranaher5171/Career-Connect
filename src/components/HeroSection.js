import React, { useState } from 'react'
import { Box, Button, Container, Stack, Typography } from '@mui/material'
import Grid from "@mui/material/Grid";
import { useRouter } from 'next/navigation'

const HeroSection = () => {
    const router = useRouter();
    const [videoError, setVideoError] = useState(false);

    return (
        <Box className="smHeroSection" sx={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
            {!videoError ? (
                <Box
                    component="video"
                    autoPlay
                    loop
                    muted
                    playsInline
                    onError={() => setVideoError(true)}
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center',
                        zIndex: 0,
                    }}
                >
                    <source src="https://media-d.global.abb/is/content/abbc/ABB%20com%20Engineered%20to%20outrun" type="video/mp4" />
                </Box>
            ) : (
                <Box
                    component="img"
                    src="/assets/herobanner.jpg"
                    alt="Background Fallback"
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center',
                        zIndex: 0,
                    }}
                />
            )}
            <Box className="gradient-overlay" sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}></Box>
            <Box className="content" sx={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', alignItems: 'center' }}>
                <Container maxWidth="lg">
                    <Grid container spacing={0} alignItems="center" justifyContent="flex-start">
                        <Grid size={{ xs: 12, sm: 12, md: 12, lg: 12 }}>
                            <Box pt={8}>
                                <Stack spacing={3} alignItems="flex-start">
                                    <Typography variant="h1" className=" white banner-heading" gutterBottom>
                                        Discover Your Next <span style={{ color: "#eeb92c" }}>Career Opportunity</span>
                                    </Typography>
                                    <Typography variant="h1" className="fw4 white"  >
                                        Connect with top employers and explore thousands of job <br/> opportunities with CareerConnect.
                                    </Typography> 
                                    <Stack justifyContent="flex-start" direction="row" spacing={2} pt={4}>
                                        <Button
                                            variant="contained"
                                            className="signin-btn"
                                            size="large"
                                            onClick={() => router.push('/auth/signup')}
                                            disableRipple
                                        >
                                            Get Started
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