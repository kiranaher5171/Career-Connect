'use client';
import { Box, Button, IconButton, Grid, InputAdornment, TextField, Typography, Tooltip, } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link'; 
import LOGO from "../../../../public/assets/logo.svg";
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';


const Form = () => {


    return (
        <> 
            <Box className="form-card">
 
                <Link href="/">
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
                    <Typography variant='h4' className='form-heading'>FORGOT PASSWORD</Typography>
                </Box>


                <Box>
                    <Typography variant='h5' className="gray">
                        Provide your account's email for which you want to reset your password!
                    </Typography>
                </Box>

                <Box mt={'50px'}>
                    <Grid container alignItems="top" justifyContent="center" spacing={3}>
                        <Grid size={{ lg: 12, md: 12, sm: 12, xs: 12 }}>
                            <Box className="form-textfield">
                                <TextField
                                    placeholder="Email Address"
                                    variant="outlined"
                                    fullWidth
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="end">
                                                <EmailOutlinedIcon className='secondary' />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Box>
                        </Grid>




                        {/* Submit Button */}
                        <Grid size={{ lg: 12, md: 12, sm: 12, xs: 12 }}>
                            <Box>
                                <Link href="/reset-password">
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        className="auth-btn"
                                        fullWidth
                                        disableRipple
                                    >
                                        Submit
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
