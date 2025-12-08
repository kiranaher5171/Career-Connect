import React from 'react'

import { Box, TextField } from '@mui/material'

const SimpleTextField = ({ label }) => {

    return (

        <>

            <Box className='textfield w100'>

                <TextField id="outlined-basic" fullWidth label={label} variant="outlined" />

            </Box>

        </>

    )

}

export default SimpleTextField