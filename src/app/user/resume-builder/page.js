"use client";
import React, { useState } from "react";
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import DownloadIcon from "@mui/icons-material/Download";
import PreviewIcon from "@mui/icons-material/Preview";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import HeaderFooterLayout from "@/layouts/header-footer-layout/HeaderFooterLayout";
import ResumePreview from "@/components/resume/ResumePreview";
import { useResumeForm } from "./hooks/useResumeForm";
import { usePDFDownload } from "./hooks/usePDFDownload";
import { useAIEnhancement } from "./hooks/useAIEnhancement";
import { getSampleResumeData } from "./utils/sampleData";
import PersonalInfoSection from "./components/PersonalInfoSection";
import ProfessionalSummarySection from "./components/ProfessionalSummarySection";
import WorkExperienceSection from "./components/WorkExperienceSection";
import EducationSection from "./components/EducationSection";
import SkillsSection from "./components/SkillsSection";
import CertificationsSection from "./components/CertificationsSection";
import ProjectsSection from "./components/ProjectsSection";
import LanguagesSection from "./components/LanguagesSection";
import ResumeTips from "./components/ResumeTips";

const ResumeBuilderPage = () => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [previewOpen, setPreviewOpen] = useState(false);

  // Section collapse states
  const [personalInfoExpanded, setPersonalInfoExpanded] = useState(true);
  const [summaryExpanded, setSummaryExpanded] = useState(true);
  const [experienceExpanded, setExperienceExpanded] = useState(true);
  const [educationExpanded, setEducationExpanded] = useState(true);
  const [skillsExpanded, setSkillsExpanded] = useState(true);
  const [certificationsExpanded, setCertificationsExpanded] = useState(false);
  const [projectsExpanded, setProjectsExpanded] = useState(false);
  const [languagesExpanded, setLanguagesExpanded] = useState(false);

  // Custom hooks
  const {
    formData,
    setFormData,
    handleChange,
    handleArrayChange,
    addArrayItem,
    removeArrayItem,
    handleAddSkill,
    handleRemoveSkill,
    handleAddLanguage,
    handleRemoveLanguage,
  } = useResumeForm();

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const { handleDownload } = usePDFDownload(formData, showSnackbar);
  const { isAILoading, aiModifiedFields, handleAISuggest } = useAIEnhancement(
    formData,
    setFormData,
    showSnackbar
  );

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSave = async () => {
    try {
      localStorage.setItem("resumeData", JSON.stringify(formData));
      
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch('/api/users/resume', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ resumeData: formData }),
          });
          
          if (!response.ok) {
            console.error('Failed to save resume to database');
          }
    } catch (error) {
          console.error('Error saving resume to database:', error);
        }
      }

      showSnackbar("Resume saved successfully!", "success");
    } catch (error) {
      console.error("Error saving resume:", error);
      showSnackbar("Failed to save resume", "error");
    }
  };

  const handlePreview = () => {
    setPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setPreviewOpen(false);
  };

  const handlePreviewDownload = () => {
    handleClosePreview();
    handleDownload();
  };

  const loadSampleData = () => {
    const sampleData = getSampleResumeData();
    setFormData(sampleData);
    showSnackbar(
      "Sample data loaded successfully! You can now edit and customize it.",
      "success"
    );
  };

  return (
    <HeaderFooterLayout>
      <Container maxWidth="lg">
        <Box className="page-content">
          <Box className="section" mt={2}>
          {/* Header */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={4}
          >
            <Typography variant="h4" className="fw6">
              Resume Builder
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                startIcon={<AutoAwesomeIcon />}
                onClick={loadSampleData}
                className="secondary-outline-btn"
                sx={{
                  borderColor: "var(--secondary)",
                  color: "var(--secondary)",
                }}
              >
                Load Sample Data
              </Button>
              <Button
                variant="outlined"
                startIcon={<PreviewIcon />}
                onClick={handlePreview}
                className="primary-outline-btn"
              >
                Preview
              </Button>
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={handleDownload}
                className="primary-outline-btn"
              >
                Download PDF
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSave}
                className="primary-action-btn"
              >
                Save Resume
              </Button>
            </Stack>
          </Box>

          <Grid container spacing={3}>
            {/* Left Column - Form */}
            <Grid size={{ xs: 12, lg: 8 }}>
                <PersonalInfoSection
                  formData={formData}
                  handleChange={handleChange}
                  expanded={personalInfoExpanded}
                  onToggle={() => setPersonalInfoExpanded(!personalInfoExpanded)}
                />

                <ProfessionalSummarySection
                  formData={formData}
                  handleChange={handleChange}
                  expanded={summaryExpanded}
                  onToggle={() => setSummaryExpanded(!summaryExpanded)}
                />

                <WorkExperienceSection
                  formData={formData}
                  handleArrayChange={handleArrayChange}
                  addArrayItem={addArrayItem}
                  removeArrayItem={removeArrayItem}
                  expanded={experienceExpanded}
                  onToggle={() => setExperienceExpanded(!experienceExpanded)}
                />

                <EducationSection
                  formData={formData}
                  handleArrayChange={handleArrayChange}
                  addArrayItem={addArrayItem}
                  removeArrayItem={removeArrayItem}
                  expanded={educationExpanded}
                  onToggle={() => setEducationExpanded(!educationExpanded)}
                />

                <SkillsSection
                  formData={formData}
                  handleAddSkill={handleAddSkill}
                  handleRemoveSkill={handleRemoveSkill}
                  expanded={skillsExpanded}
                  onToggle={() => setSkillsExpanded(!skillsExpanded)}
                />

                <CertificationsSection
                  formData={formData}
                  handleArrayChange={handleArrayChange}
                  addArrayItem={addArrayItem}
                  removeArrayItem={removeArrayItem}
                  expanded={certificationsExpanded}
                  onToggle={() => setCertificationsExpanded(!certificationsExpanded)}
                />

                <ProjectsSection
                  formData={formData}
                  handleArrayChange={handleArrayChange}
                  addArrayItem={addArrayItem}
                  removeArrayItem={removeArrayItem}
                  expanded={projectsExpanded}
                  onToggle={() => setProjectsExpanded(!projectsExpanded)}
                />

                <LanguagesSection
                  formData={formData}
                  handleAddLanguage={handleAddLanguage}
                  handleRemoveLanguage={handleRemoveLanguage}
                  expanded={languagesExpanded}
                  onToggle={() => setLanguagesExpanded(!languagesExpanded)}
                />
                            </Grid>

              {/* Right Column - Tips */}
            <Grid size={{ xs: 12, lg: 4 }}>
                <ResumeTips />
            </Grid>
          </Grid>
          </Box>
        </Box>
      </Container>

      {/* Preview Dialog */}
      <ResumePreview
        open={previewOpen}
        onClose={handleClosePreview}
        formData={formData}
        onAISuggest={handleAISuggest}
        aiModifiedFields={aiModifiedFields}
        isAILoading={isAILoading}
        onDownload={handlePreviewDownload}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </HeaderFooterLayout>
  );
};

export default ResumeBuilderPage;
