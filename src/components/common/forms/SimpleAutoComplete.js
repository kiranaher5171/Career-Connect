import { Box, TextField } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';




const SimpleAutoComplete = ({ label ,options ,onChange,error,value,disabled}) => {
    // console.log("prefilled value",  value);
    // console.log(options.find((option) => option.value == value) || null);
    return (
        <>
            <Box className='textfield auto-complete'>

                <Autocomplete
                    disablePortal
                    fullWidth
                    id="combo-box-demo"
                    getOptionLabel={(option) => option.label}
                    options={options}
                    value={options.find((option) => option.value == value) || null}
                    renderInput={(params) => <TextField {...params} label={label} variant='outlined' size='small' />}
                    onChange={onChange}
                    disabled={disabled}
                    error={error}
                />
            </Box>
        </>

    )
}

export default SimpleAutoComplete