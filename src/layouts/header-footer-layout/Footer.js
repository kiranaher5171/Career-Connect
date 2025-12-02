'use client'
import React from 'react'
import { Box, Button, Container, IconButton, Typography, List, ListItemButton, ListItemText, Grid } from '@mui/material';
import { FaLinkedin } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { MdCall } from "react-icons/md";
import { MdEmail } from "react-icons/md";
import Image from 'next/image';
import Link from 'next/link'; 
// import logo from '../../public/assets/dpa_logo.png'

const Footer = () => {

    const currentYear = new Date().getFullYear();

    return (
        <>
            <Box id="footer" className={`footer bg-lgray`}>
                <Box className="footer-bg" aria-hidden="true">
                    {/* <Image
                        src="/assets/hero-banner/footer-bg.png"
                        alt=""
                        fill
                        priority={false}
                        sizes="100vw"
                        style={{ objectFit: 'cover', objectPosition: 'center' }}
                    /> */}
                </Box>
                <Container maxWidth="lg" className="footer-inner">

                    <Box className="brdBtm" pb={2}>

                        <Grid container spacing={2} alignItems={"flex-start"} justifyContent={"flex-start"}>

                            <Grid size={{ lg: 4, md: 4, sm: 4, xs: 12 }}>
                                <Box className="">
                                    <Box className="social-icons">

                                        <Box mb={10}>
                                            <Link href="/">
                                                {/* <Image
                                                    src={logo}
                                                    alt="logo"
                                                    width={120}
                                                    height={40} 
                                                    priority
                                                /> */}
                                                <Typography variant='h3' className='white fw6 footer-heading'>TechCareer Hub</Typography>
                                            </Link>
                                        </Box>

                                        <Box pb={2}>
                                            <Typography variant='h6' className='white fw6 footer-heading'>Follow us</Typography>
                                        </Box>

                                        <a href="https://www.linkedin.com/company/decimalpointanalytics/" target="_blank" rel="noopener noreferrer">
                                            <IconButton size="medium" aria-label='Follow us on LinkedIn'>
                                                <FaLinkedin className='wh' style={{ fontSize: '20px' }} />
                                            </IconButton>
                                        </a>

                                        <a href="https://www.instagram.com/decimalpointanalytics/" target="_blank" rel="noopener noreferrer">
                                            <IconButton size="medium" aria-label='Follow us on Instagram'>
                                                <FaInstagram style={{ fontSize: '20px' }} />
                                            </IconButton>
                                        </a>

                                        <a href="https://www.youtube.com/c/DecimalPointAnalytics" target="_blank" rel="noopener noreferrer">
                                            <IconButton size="medium" aria-label='Follow us on Youtube'>
                                                <FaYoutube style={{ fontSize: '20px' }} />
                                            </IconButton>
                                        </a>

                                        <a href="https://www.facebook.com/decimalpointanalyticspl" target="_blank" rel="noopener noreferrer">
                                            <IconButton size="medium" aria-label='Follow us on Facebook'>
                                                <FaFacebook style={{ fontSize: '20px' }} />
                                            </IconButton>
                                        </a>

                                    </Box>
                                </Box>
                            </Grid>

                            <Grid size={{ lg: 4, md: 4, sm: 4, xs: 12 }}>
                                <Box>
                                    <Box pb={2}>
                                        <Typography variant='h6' className='white fw6 footer-heading'>Featured links</Typography>
                                    </Box>
                                    <Link href="/about" style={{ textDecoration: 'none' }}>
                                        <Button variant='text' fullWidth className="footerMenu" disableRipple>
                                            <span className="menuLine" />  About Us
                                        </Button>
                                    </Link>
                                    <Link href="/users/jobs" style={{ textDecoration: 'none' }}>
                                        <Button variant='text' fullWidth className="footerMenu" disableRipple>
                                            <span className="menuLine" />  Find Jobs
                                        </Button>
                                    </Link>
                                    <Link href="/contact" style={{ textDecoration: 'none' }}>
                                        <Button variant='text' fullWidth className="footerMenu" disableRipple>
                                            <span className="menuLine" />  Contact Us
                                        </Button>
                                    </Link>
                                    <Link href="/auth/signup" style={{ textDecoration: 'none' }}>
                                        <Button variant='text' fullWidth className="footerMenu" disableRipple>
                                            <span className="menuLine" />  Sign Up
                                        </Button>
                                    </Link>
                                    <Link href="/auth/login" style={{ textDecoration: 'none' }}>
                                        <Button variant='text' fullWidth className="footerMenu" disableRipple>
                                            <span className="menuLine" />  Login
                                        </Button>
                                    </Link>
                                </Box>
                            </Grid>

                            <Grid size={{ lg: 4, md: 4, sm: 4, xs: 12 }}>
                                <Box>
                                    <Box pb={2}>
                                        <Typography variant='h6' className='white fw6 footer-heading'>KEEP IN TOUCH</Typography>
                                    </Box>
                                    <List disablePadding className="footer-list">
                                        <ListItemButton disableRipple className="footerMenu" component="a" href="https://maps.app.goo.gl/" target="_blank" rel="noopener noreferrer">
                                            {/* <MdLocationPin style={{ marginRight: 6, fontSize: '57px' }} /> */}
                                            <ListItemText primary="TechCareer Hub Inc.
                                                                    1234 Innovation Drive, Suite 500
                                                                    San Francisco, CA 94105
                                                                    United States" />
                                        </ListItemButton>
                                        <ListItemButton disableRipple className="footerMenu" component="a" href="tel:+14155551234">
                                            <MdCall style={{ marginRight: 6, fontSize: '17px' }} />
                                            <ListItemText primary="+1 (415) 555-1234" />
                                        </ListItemButton>
                                        <ListItemButton disableRipple className="footerMenu" component="a" href="mailto:info@techcareerhub.com">
                                            <MdEmail style={{ marginRight: 6, fontSize: '17px' }} />
                                            <ListItemText primary="info@techcareerhub.com" />
                                        </ListItemButton>
                                    </List>
                                </Box>
                            </Grid>

                        </Grid>
                    </Box>

                    <Box mt={2} className="center">
                        <Typography variant='h6' className="fw5 white">
                            All rights reserved &copy;{currentYear} TechCareer Hub Inc.
                        </Typography>
                    </Box>

                </Container>
            </Box>
        </>

    )
}

export default Footer

