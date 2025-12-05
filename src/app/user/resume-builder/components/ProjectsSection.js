"use client";
import React from "react";
import { Box, Grid, TextField, Button, Typography, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SectionCard from "./SectionCard";

const ProjectsSection = ({ 
  formData, 
  handleArrayChange, 
  addArrayItem, 
  removeArrayItem, 
  expanded, 
  onToggle 
}) => {
  return (
    <SectionCard
      title="Projects"
      expanded={expanded}
      onToggle={onToggle}
    >
      <Box sx={{ mt: 2 }}>
        {formData.projects.map((project, index) => (
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
                Project #{index + 1}
              </Typography>
              <IconButton
                size="small"
                onClick={() => removeArrayItem("projects", index)}
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
                    label="Project Name *"
                    value={project.name || ""}
                    onChange={(e) =>
                      handleArrayChange("projects", index, "name", e.target.value)
                    }
                    required
                  />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box className="textfield auto-complete">
                  <TextField
                    fullWidth
                    label="Project URL"
                    value={project.url || ""}
                    onChange={(e) =>
                      handleArrayChange("projects", index, "url", e.target.value)
                    }
                    placeholder="https://project-url.com"
                  />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box className="textfield auto-complete">
                  <TextField
                    fullWidth
                    label="Technologies Used"
                    value={project.technologies || ""}
                    onChange={(e) =>
                      handleArrayChange("projects", index, "technologies", e.target.value)
                    }
                    placeholder="e.g., React, Node.js, MongoDB"
                  />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box className="textfield auto-complete">
                  <TextField
                    fullWidth
                    label="Date"
                    type="month"
                    value={project.date || ""}
                    onChange={(e) =>
                      handleArrayChange("projects", index, "date", e.target.value)
                    }
                  />
                </Box>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Box className="textfield auto-complete">
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Description"
                    value={project.description || ""}
                    onChange={(e) =>
                      handleArrayChange("projects", index, "description", e.target.value)
                    }
                    placeholder="Describe the project, your role, and key achievements..."
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
            addArrayItem("projects", {
              name: "",
              url: "",
              technologies: "",
              date: "",
              description: "",
            })
          }
          className="primary-outline-btn"
        >
          Add Project
        </Button>
      </Box>
    </SectionCard>
  );
};

export default ProjectsSection;

