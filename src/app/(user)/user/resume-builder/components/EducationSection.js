"use client";
import React from "react";
import { Box, Grid, TextField, Button, Typography, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SectionCard from "./SectionCard";

const EducationSection = ({ 
  formData, 
  handleArrayChange, 
  addArrayItem, 
  removeArrayItem, 
  expanded, 
  onToggle 
}) => {
  return (
    <SectionCard
      title="Education"
      expanded={expanded}
      onToggle={onToggle}
    >
      <Box sx={{ mt: 2 }}>
        {formData.education.map((edu, index) => (
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
                Education #{index + 1}
              </Typography>
              <IconButton
                size="small"
                onClick={() => removeArrayItem("education", index)}
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
                    label="Degree *"
                    value={edu.degree || ""}
                    onChange={(e) =>
                      handleArrayChange("education", index, "degree", e.target.value)
                    }
                    required
                  />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box className="textfield auto-complete">
                  <TextField
                    fullWidth
                    label="Field of Study"
                    value={edu.field || ""}
                    onChange={(e) =>
                      handleArrayChange("education", index, "field", e.target.value)
                    }
                    placeholder="e.g., Computer Science"
                  />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box className="textfield auto-complete">
                  <TextField
                    fullWidth
                    label="Institution *"
                    value={edu.institution || ""}
                    onChange={(e) =>
                      handleArrayChange("education", index, "institution", e.target.value)
                    }
                    required
                  />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box className="textfield auto-complete">
                  <TextField
                    fullWidth
                    label="Location"
                    value={edu.location || ""}
                    onChange={(e) =>
                      handleArrayChange("education", index, "location", e.target.value)
                    }
                  />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box className="textfield auto-complete">
                  <TextField
                    fullWidth
                    label="Start Date"
                    type="month"
                    value={edu.startDate || ""}
                    onChange={(e) =>
                      handleArrayChange("education", index, "startDate", e.target.value)
                    }
                  />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box className="textfield auto-complete">
                  <TextField
                    fullWidth
                    label="End Date / Graduation Date"
                    type="month"
                    value={edu.endDate || ""}
                    onChange={(e) =>
                      handleArrayChange("education", index, "endDate", e.target.value)
                    }
                  />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box className="textfield auto-complete">
                  <TextField
                    fullWidth
                    label="GPA (Optional)"
                    value={edu.gpa || ""}
                    onChange={(e) =>
                      handleArrayChange("education", index, "gpa", e.target.value)
                    }
                    placeholder="e.g., 3.8/4.0"
                  />
                </Box>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Box className="textfield auto-complete">
                  <TextField
                    fullWidth
                    label="Summary / Description (Optional)"
                    value={edu.summary || ""}
                    onChange={(e) =>
                      handleArrayChange("education", index, "summary", e.target.value)
                    }
                    multiline
                    rows={3}
                    placeholder="e.g., Relevant coursework, achievements, honors, etc."
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
            addArrayItem("education", {
              degree: "",
              field: "",
              institution: "",
              location: "",
              startDate: "",
              endDate: "",
              gpa: "",
              summary: "",
            })
          }
          className="primary-outline-btn"
        >
          Add Education
        </Button>
      </Box>
    </SectionCard>
  );
};

export default EducationSection;

