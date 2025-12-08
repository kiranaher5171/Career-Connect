"use client";
import React from "react";
import { Box, TextField, Chip } from "@mui/material";
import SectionCard from "./SectionCard";

const SkillsSection = ({ 
  formData, 
  handleAddSkill, 
  handleRemoveSkill, 
  expanded, 
  onToggle 
}) => {
  return (
    <SectionCard
      title="Skills"
      expanded={expanded}
      onToggle={onToggle}
    >
      <Box sx={{ mt: 2 }}>
        <Box className="textfield auto-complete" sx={{ mb: 2 }}>
          <TextField
            fullWidth
            label="Add Skill"
            placeholder="e.g., JavaScript, React, Node.js"
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const value = e.target.value.trim();
                if (value) {
                  handleAddSkill(value);
                  e.target.value = "";
                }
              }
            }}
            size="small"
          />
        </Box>
        
        {formData.skills && formData.skills.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {formData.skills.map((skill, index) => (
              <Chip
                key={index}
                label={skill}
                onDelete={() => handleRemoveSkill(index)}
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

export default SkillsSection;

