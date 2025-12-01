"use client"
import React from 'react';
import { useState } from 'react';
import { Box } from '@mui/material'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';


const SimpleDatePicker = ({ label }) => {


    const [value, setValue] = useState(dayjs('yyyy-mm-dd'));


    return (
        <>

            <Box className="textfield datepicker">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label={label}
                        size="small"
                        onChange={(newValue) => setValue(newValue)}
                    />
                </LocalizationProvider>
            </Box>

        </>
    )
}

export default SimpleDatePicker

