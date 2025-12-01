'use client';
import { Box, Button, Grid, IconButton, Tooltip, Typography, } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import LOGO from "../../../../public/assets/logo.svg"; 
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


const Form = () => {
    return (
        <>
            <Box className="form-card">

                <Link href="/reset-password">
                    <Tooltip placement='bottom' arrow title="Go Back">
                        <IconButton disableRipple size="large" className="form-back-btn">
                            <ArrowBackIcon fontSize='medium' />
                        </IconButton>
                    </Tooltip>
                </Link>

                <Box pb={4} className="center">
                    <Image src={LOGO} className="auth-logo" alt="iFieldSmart Technologies" priority />
                </Box>

                <Box mb={5} mt={1}>
                    <Typography variant='h4' className='form-heading'>PASSWORD UPDATE</Typography>
                </Box>

                <Box>
                    <Grid container alignItems="top" justifyContent="center" spacing={3}>
                        <Grid size={{ lg: 12, md: 12, sm: 12, xs: 12 }}>
                            <Box>
                                <Image src="/assets/icon/success.png" alt='Done' className='auth-gif' width={400} height={400} />
                            </Box>
                        </Grid>

                        <Grid size={{ lg: 12, md: 12, sm: 12, xs: 12 }}>
                            <Box>
                                <Typography variant='h5' className="gray">
                                    Your password has been updated!
                                </Typography>
                            </Box>
                        </Grid>

                        {/* Submit Button */}
                        <Grid size={{ lg: 12, md: 12, sm: 12, xs: 12 }}>
                            <Box>
                                <Link href="/">
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        className="auth-btn"
                                        fullWidth
                                        disableRipple
                                    >
                                        Login
                                    </Button>
                                </Link>
                            </Box>
                        </Grid>

                    </Grid>
                </Box>
            </Box>
        </>
    );
};

export default Form;
