"use client";
import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const TagInput = ({ onAdd, placeholder, label }) => {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    if (inputValue.trim()) {
      onAdd(inputValue);
      setInputValue("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
      <TextField
        fullWidth
        label={label}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        size="small"
      />
      <Button
        variant="contained"
        onClick={handleAdd}
        startIcon={<AddIcon />}
        className="primary-action-btn"
        sx={{ minWidth: "120px" }}
      >
        Add More
      </Button>
    </Box>
  );
};

export default TagInput;

