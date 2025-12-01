import React from 'react'
import { Box, Container, Stack, Typography } from '@mui/material' 
import Image from 'next/image';
import Grid from "@mui/material/Grid";
import { MdNavigateNext } from "react-icons/md";

const HeroSection = () => {
    return (
        <Box className="smHeroSection" sx={{ position: 'relative', width: '100%', height: '300px', overflow: 'hidden' }}>
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
                    <Grid container spacing={0} alignItems="center" justifyContent="flex-start">
                        <Grid size={{ lg: 10, md: 10, sm: 10, xs: 12 }}>
                            {/* Static Breadcrumbs */}
                            <Stack direction="row" alignItems="center" justifyContent="flex-start" spacing={1}>
                                <Typography variant="h5" className='fw4 white'>
                                    CareerConnect
                                </Typography>
                                <MdNavigateNext style={{ color: 'white' }} />
                                <Typography variant="h5" className='fw5 white'>
                                    Dashboard
                                </Typography>
                            </Stack>
                            {/* Static Breadcrumbs */}
                            <Box pt={3} pb={3}>
                                <Typography variant="h1" className='white fw4 lora'>
                                    Welcome to
                                    <br />
                                    <span className='fw6'>CareerConnect Portal</span>
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Box>
    )
}

export default HeroSection