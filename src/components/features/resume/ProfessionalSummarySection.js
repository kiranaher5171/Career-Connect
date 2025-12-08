"use client";
import React from "react";
import { Box, TextField } from "@mui/material";
import SectionCard from "./SectionCard";

const ProfessionalSummarySection = ({ formData, handleChange, expanded, onToggle }) => {
  return (
    <SectionCard
      title="Professional Summary"
      expanded={expanded}
      onToggle={onToggle}
    >
      <Box className="textfield auto-complete">
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Summary"
          name="professionalSummary"
          value={formData.professionalSummary}
          onChange={handleChange}
          placeholder="Write a brief summary of your professional background and key achievements..."
          sx={{ mt: 2 }}
        />
      </Box>
    </SectionCard>
  );
};

export default ProfessionalSummarySection;

