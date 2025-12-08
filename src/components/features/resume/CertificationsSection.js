"use client";
import React from "react";
import { Box, Grid, TextField, Button, Typography, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SectionCard from "./SectionCard";

const CertificationsSection = ({ 
  formData, 
  handleArrayChange, 
  addArrayItem, 
  removeArrayItem, 
  expanded, 
  onToggle 
}) => {
  return (
    <SectionCard
      title="Certifications"
      expanded={expanded}
      onToggle={onToggle}
    >
      <Box sx={{ mt: 2 }}>
        {formData.certifications.map((cert, index) => (
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
                Certification #{index + 1}
              </Typography>
              <IconButton
                size="small"
                onClick={() => removeArrayItem("certifications", index)}
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
                    label="Certification Name *"
                    value={cert.name || ""}
                    onChange={(e) =>
                      handleArrayChange("certifications", index, "name", e.target.value)
                    }
                    required
                  />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box className="textfield auto-complete">
                  <TextField
                    fullWidth
                    label="Issuing Organization"
                    value={cert.organization || ""}
                    onChange={(e) =>
                      handleArrayChange("certifications", index, "organization", e.target.value)
                    }
                  />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box className="textfield auto-complete">
                  <TextField
                    fullWidth
                    label="Issue Date"
                    type="month"
                    value={cert.issueDate || ""}
                    onChange={(e) =>
                      handleArrayChange("certifications", index, "issueDate", e.target.value)
                    }
                  />
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box className="textfield auto-complete">
                  <TextField
                    fullWidth
                    label="Expiration Date (if applicable)"
                    type="month"
                    value={cert.expirationDate || ""}
                    onChange={(e) =>
                      handleArrayChange("certifications", index, "expirationDate", e.target.value)
                    }
                  />
                </Box>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Box className="textfield auto-complete">
                  <TextField
                    fullWidth
                    label="Credential ID / URL"
                    value={cert.credentialId || ""}
                    onChange={(e) =>
                      handleArrayChange("certifications", index, "credentialId", e.target.value)
                    }
                    placeholder="Certificate ID or verification URL"
                  />
                </Box>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <Box className="textfield auto-complete">
                  <TextField
                    fullWidth
                    label="Summary / Description (Optional)"
                    value={cert.summary || ""}
                    onChange={(e) =>
                      handleArrayChange("certifications", index, "summary", e.target.value)
                    }
                    multiline
                    rows={3}
                    placeholder="e.g., Key skills validated, areas of expertise, etc."
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
            addArrayItem("certifications", {
              name: "",
              organization: "",
              issueDate: "",
              expirationDate: "",
              credentialId: "",
              summary: "",
            })
          }
          className="primary-outline-btn"
        >
          Add Certification
        </Button>
      </Box>
    </SectionCard>
  );
};

export default CertificationsSection;

