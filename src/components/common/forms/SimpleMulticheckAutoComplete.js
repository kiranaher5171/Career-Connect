"use client"
import { useState } from 'react';
import { Autocomplete, TextField, Box, Checkbox } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const SimpleMulticheckAutoComplete = ({ label, options = [], value, onChange, error, limitTags = 3, ...props }) => {
    const [internalValue, setInternalValue] = useState([]);
    
    // Use controlled value if provided, otherwise use internal state
    const currentValue = value !== undefined ? value : internalValue;

    const handleChange = (event, newValue) => {
        if (onChange) {
            onChange(event, newValue);
        } else {
            setInternalValue(newValue);
        }
    };

    return (
        <Box className="textfield auto-complete multicheck">
            <Autocomplete
                multiple
                options={options}
                value={currentValue}
                onChange={handleChange}
                disableCloseOnSelect
                limitTags={limitTags}
                getOptionLabel={(option) => {
                    if (typeof option === 'string') {
                        return option;
                    }
                    return option?.label || option?.title || String(option);
                }}
                isOptionEqualToValue={(option, value) => {
                    // Handle string comparison
                    if (typeof option === 'string' && typeof value === 'string') {
                        return option === value;
                    }
                    // Handle object comparison
                    if (typeof option === 'object' && typeof value === 'object') {
                        // Compare by label if available
                        if (option.label && value.label) {
                            return option.label === value.label;
                        }
                        // Compare by title if available
                        if (option.title && value.title) {
                            return option.title === value.title;
                        }
                        // Compare by value if available
                        if (option.value && value.value) {
                            return option.value === value.value;
                        }
                        // Fallback to reference equality
                        return option === value;
                    }
                    return false;
                }}
                renderOption={(props, option, { selected }) => {
                    const { key, ...optionProps } = props;
                    const optionLabel = typeof option === 'string' ? option : (option?.label || option?.title || String(option));
                    return (
                        <li key={key} {...optionProps}>
                            <Checkbox
                                icon={icon}
                                checkedIcon={checkedIcon}
                                style={{ marginRight: 8 }}
                                checked={selected}
                                disableRipple
                            />
                            {optionLabel}
                        </li>
                    );
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label={label}
                        size="small"
                        error={Boolean(error)}
                        helperText={error}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                "& .MuiOutlinedInput-notchedOutline": {
                                    border: error ? "2px solid red" : "2px solid var(--primary)",
                                },
                            },
                            "& .MuiInputLabel-root": {
                                color: error ? "red" : "rgba(0, 0, 0, 0.6)",
                            },
                        }}
                    />
                )}
                {...props}
            />
        </Box>
    );
};

export default SimpleMulticheckAutoComplete;

