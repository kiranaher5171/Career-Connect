"use client";
import React from "react";
import { Box, Grid, TextField, Button, Typography, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SectionCard from "./SectionCard";

const WorkExperienceSection = ({ 
  formData, 
  handleArrayChange, 
  addArrayItem, 
  removeArrayItem, 
  expanded, 
  onToggle 
}) => {
  return (
    <SectionCard
      title="Work Experience"
      expanded={expanded}
      onToggle={onToggle}
    >
      <Box sx={{ mt: 2 }}>
        {formData.workExperience.map((exp, index) => (
          <Box
            key={index}
            sx={{
              mb: 3,
              p: 2,
              border: "1px solid #e0e0e0",
              borderRadius: 2,
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="subtitle1" className="fw6">
                Experience #{index + 1}
              </Typography>
              <IconButton
                size="small"
                onClick={() => removeArrayItem("workExperience", index)}
                color="error"
              >
                <DeleteOutlineIcon />
              </IconButton>
            </Box>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box className="textfield auto-complete">
                  <TextField
                    fullWidth
                    label="Job Title *"
                    value={exp.jobTitle || ""}
                    onChange={(e) =>
                      handleArrayChange("workExperience", index, "jobTitle", e.target.value)
                    }
                    required
                  />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box className="textfield auto-complete">
                  <TextField
                    fullWidth
                    label="Company *"
                    value={exp.company || ""}
                    onChange={(e) =>
                      handleArrayChange("workExperience", index, "company", e.target.value)
                    }
                    required
                  />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box className="textfield auto-complete">
                  <TextField
                    fullWidth
                    label="Start Date"
                    type="month"
                    value={exp.startDate || ""}
                    onChange={(e) =>
                      handleArrayChange("workExperience", index, "startDate", e.target.value)
                    }
                  />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box className="textfield auto-complete">
                  <TextField
                    fullWidth
                    label="End Date"
                    type="month"
                    value={exp.endDate || ""}
                    onChange={(e) =>
                      handleArrayChange("workExperience", index, "endDate", e.target.value)
                    }
                    placeholder="Present"
                  />
                </Box>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Box className="textfield auto-complete">
                  <TextField
                    fullWidth
                    label="Location"
                    value={exp.location || ""}
                    onChange={(e) =>
                      handleArrayChange("workExperience", index, "location", e.target.value)
                    }
                  />
                </Box>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Box className="textfield auto-complete">
                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    label="Description *"
                    value={exp.description || ""}
                    onChange={(e) =>
                      handleArrayChange("workExperience", index, "description", e.target.value)
                    }
                    placeholder="Describe your responsibilities and achievements (minimum 5 lines recommended)..."
                    required
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        ))}
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() =>
            addArrayItem("workExperience", {
              jobTitle: "",
              company: "",
              startDate: "",
              endDate: "",
              location: "",
              description: "",
            })
          }
          className="primary-outline-btn"
        >
          Add Experience
        </Button>
      </Box>
    </SectionCard>
  );
};

export default WorkExperienceSection;

