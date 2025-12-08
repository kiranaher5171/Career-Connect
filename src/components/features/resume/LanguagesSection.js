"use client";
import React from "react";
import { Box, TextField, Chip } from "@mui/material";
import SectionCard from "./SectionCard";

const LanguagesSection = ({ 
  formData, 
  handleAddLanguage, 
  handleRemoveLanguage, 
  expanded, 
  onToggle 
}) => {
  return (
    <SectionCard
      title="Languages"
      expanded={expanded}
      onToggle={onToggle}
    >
      <Box sx={{ mt: 2 }}>
        <Box className="textfield auto-complete" sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Add Language"
            placeholder="e.g., English (Native), Spanish (Conversational)"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const value = e.target.value.trim();
                if (value) {
                  handleAddLanguage(value);
                  e.target.value = "";
                }
              }
            }}
            size="small"
          />
        </Box>
        
        {formData.languages && formData.languages.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {formData.languages.map((language, index) => (
              <Chip
                key={index}
                label={language}
                onDelete={() => handleRemoveLanguage(index)}
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
        )}
      </Box>
    </SectionCard>
  );
};

export default LanguagesSection;

