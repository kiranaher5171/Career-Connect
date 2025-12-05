"use client";
import React from "react";
import { Grid, Box, TextField } from "@mui/material";
import SectionCard from "./SectionCard";

const PersonalInfoSection = ({ formData, handleChange, expanded, onToggle }) => {
  return (
    <SectionCard
      title="Personal Information"
      expanded={expanded}
      onToggle={onToggle}
    >
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Box className="textfield auto-complete">
            <TextField
              fullWidth
              label="First Name *"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Box className="textfield auto-complete">
            <TextField
              fullWidth
              label="Middle Name"
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
            />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Box className="textfield auto-complete">
            <TextField
              fullWidth
              label="Last Name *"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </Box>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Box className="textfield auto-complete">
            <TextField
              fullWidth
              label="Designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              placeholder="e.g., Software Engineer, Product Manager"
            />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Box className="textfield auto-complete">
            <TextField
              fullWidth
              label="Email *"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Box className="textfield auto-complete">
            <TextField
              fullWidth
              label="Phone *"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </Box>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Box className="textfield auto-complete">
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Box className="textfield auto-complete">
            <TextField
              fullWidth
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Box className="textfield auto-complete">
            <TextField
              fullWidth
              label="State"
              name="state"
              value={formData.state}
              onChange={handleChange}
            />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Box className="textfield auto-complete">
            <TextField
              fullWidth
              label="Zip Code"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
            />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Box className="textfield auto-complete">
            <TextField
              fullWidth
              label="Country"
              name="country"
              value={formData.country}
              onChange={handleChange}
            />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Box className="textfield auto-complete">
            <TextField
              fullWidth
              label="LinkedIn Profile"
              name="linkedIn"
              value={formData.linkedIn}
              onChange={handleChange}
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Box className="textfield auto-complete">
            <TextField
              fullWidth
              label="Portfolio Website"
              name="portfolio"
              value={formData.portfolio}
              onChange={handleChange}
              placeholder="https://yourportfolio.com"
            />
          </Box>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Box className="textfield auto-complete">
            <TextField
              fullWidth
              label="GitHub Profile"
              name="github"
              value={formData.github}
              onChange={handleChange}
              placeholder="https://github.com/yourusername"
            />
          </Box>
        </Grid>
      </Grid>
    </SectionCard>
  );
};

export default PersonalInfoSection;

