'use client';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { Box, Button, Grid, IconButton, InputAdornment, TextField, Tooltip, Typography, } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
const LOGO = "/assets/logo.svg";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


const Form = () => {
    const [showPassword, setShowPassword] = useState(false);
    const handleShowPasswordToggle = () => setShowPassword(!showPassword);
    return (
        <>

            <Box className="form-card">

                <Link href="/forgot-password">
                    <Tooltip placement='bottom' arrow title="Go Back">
                        <IconButton disableRipple size="large" className="form-back-btn">
                            <ArrowBackIcon fontSize='medium' />
                        </IconButton>
                    </Tooltip>
                </Link>

                <Box pb={4} className="center">
                    <Image src={LOGO} className="auth-logo" alt="iFieldSmart Technologies" width={200} height={60} priority />
                </Box>

                <Box mb={5} mt={1}>
                    <Typography variant='h4' className='form-heading'>RESET PASSWORD</Typography>
                </Box>

                <Box>
                    <Grid container alignItems="top" justifyContent="center" spacing={3}>
                        <Grid size={{ lg: 12, md: 12, sm: 12, xs: 12 }}>
                            <Box className="form-textfield">
                                <TextField
                                    placeholder="New Password"
                                    variant="outlined"
                                    type={showPassword ? 'text' : 'password'}
                                    fullWidth
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="end">
                                                <LockOutlinedIcon className='secondary' />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    size="small"
                                                    onClick={handleShowPasswordToggle}
                                                    edge="end"
                                                >
                                                    {showPassword ? (
                                                        <VisibilityOutlinedIcon fontSize="small" className='primary' />
                                                    ) : (
                                                        <VisibilityOffOutlinedIcon fontSize="small" className='primary' />
                                                    )}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>
                        </Grid>

                        {/* Password Field */}
                        <Grid size={{ lg: 12, md: 12, sm: 12, xs: 12 }}>
                            <Box className="form-textfield">
                                <TextField
                                    placeholder="Confirm Password"
                                    variant="outlined"
                                    type={showPassword ? 'text' : 'password'}
                                    fullWidth
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="end">
                                                <LockOutlinedIcon className='secondary' />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    size="small"
                                                    onClick={handleShowPasswordToggle}
                                                    edge="end"
                                                >
                                                    {showPassword ? (
                                                        <VisibilityOutlinedIcon fontSize="small" className='primary' />
                                                    ) : (
                                                        <VisibilityOffOutlinedIcon fontSize="small" className='primary' />
                                                    )}
                                                </IconButton>
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>
                        </Grid>


                        {/* Submit Button */}
                        <Grid size={{ lg: 12, md: 12, sm: 12, xs: 12 }}>
                            <Box>
                                <Link href="/password-updated">
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        className="auth-btn"
                                        fullWidth
                                        disableRipple
                                    >
                                        Set password
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
