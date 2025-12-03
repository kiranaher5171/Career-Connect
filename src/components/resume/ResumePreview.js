"use client";
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Box,
  Divider,
  Typography,
  Chip,
  Stack,
  Link,
} from "@mui/material";
import { IoIosCloseCircleOutline } from "react-icons/io";
import DownloadIcon from "@mui/icons-material/Download";
import SmartToyIcon from "@mui/icons-material/SmartToy";

const ResumeSection = ({ title, children }) => (
  <Box mb={3}>
    <Typography
      variant="h6"
      sx={{
        fontWeight: "bold",
        mb: 1,
        color: "#1a1a1a",
        borderBottom: "1px solid #ddd",
        pb: "5px",
        fontSize: "18px",
      }}
    >
      {title}
    </Typography>
    <Box>{children}</Box>
  </Box>
);

const ResumePreview = ({ open, onClose, formData, onAISuggest, onDownload }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "Present";
    const date = new Date(dateString + "-01");
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
  };

  const fullName =
    `${formData.firstName || ""} ${formData.lastName || ""}`.trim() ||
    "Your Name";

  const contactInfo = [];
  if (formData.email) contactInfo.push(`Email: ${formData.email}`);
  if (formData.phone) contactInfo.push(`Phone: ${formData.phone}`);
  if (formData.address) {
    const addressParts = [
      formData.address,
      formData.city,
      formData.state,
      formData.zipCode,
      formData.country,
    ].filter(Boolean);
    if (addressParts.length > 0)
      contactInfo.push(`Address: ${addressParts.join(", ")}`);
  }
  if (formData.linkedIn) contactInfo.push(`LinkedIn: ${formData.linkedIn}`);
  if (formData.portfolio) contactInfo.push(`Portfolio: ${formData.portfolio}`);
  if (formData.github) contactInfo.push(`GitHub: ${formData.github}`);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2, maxHeight: "90vh" },
      }}
    >
      <DialogTitle id="alert-dialog-title">
        Resume Preview
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <IoIosCloseCircleOutline className="white" />
        </IconButton>
      </DialogTitle>
      <Box>
        <Divider />
      </Box>
      <DialogContent
        sx={{
          minHeight: "50vh",
          p: 3,
          overflowY: "auto",
          bgcolor: "#f5f5f5",
        }}
      >
        <Box
          sx={{
            fontFamily: "'Arial', sans-serif",
            lineHeight: 1.6,
            color: "#333",
            maxWidth: "210mm",
            margin: "0 auto",
            padding: "30px",
            background: "white",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            borderRadius: "4px",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              borderBottom: "2px solid #333",
              pb: "15px",
              mb: "20px",
            }}
            className="header"
          >
            <Typography
              variant="h3"
              sx={{
                fontSize: "28px",
                mb: "10px",
                color: "#1a1a1a",
                fontWeight: "bold",
                lineHeight: 1.2,
              }}
            >
              {fullName}
            </Typography>
            {contactInfo.length > 0 && (
              <Stack
                direction="row"
                spacing={2}
                flexWrap="wrap"
                alignItems="center"
                className="contact-info"
                sx={{
                  fontSize: "12px",
                  color: "#666",
                  gap: "15px",
                }}
              >
                {contactInfo.map((info, idx) => (
                  <Typography key={idx} sx={{ fontSize: 12 }}>
                    {info}
                  </Typography>
                ))}
              </Stack>
            )}
          </Box>

          {/* Professional Summary */}
          {formData.professionalSummary && (
            <ResumeSection title="Professional Summary">
              <Typography
                sx={{
                  fontSize: "12px",
                  lineHeight: 1.6,
                  textAlign: "justify",
                }}
                className="summary"
              >
                {formData.professionalSummary}
              </Typography>
            </ResumeSection>
          )}

          {/* Work Experience */}
          {formData.workExperience && formData.workExperience.length > 0 && (
            <ResumeSection title="Work Experience">
              {formData.workExperience.map((exp, i) => (
                <Box
                  key={i}
                  sx={{
                    mb: 2,
                    pl: 1,
                  }}
                  className="experience-item"
                >
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    mb={0.5}
                    className="item-header"
                    spacing={1}
                  >
                    <Box>
                      <Typography
                        sx={{ fontWeight: "bold", fontSize: "14px" }}
                        className="item-title"
                      >
                        {exp.jobTitle || ""}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "13px",
                          color: "#555",
                          mb: 0.5,
                        }}
                        className="item-company"
                      >
                        {exp.company || ""}
                      </Typography>
                      {exp.location && (
                        <Typography
                          sx={{ fontSize: "13px", color: "#555", mb: 0.5 }}
                          className="item-location"
                        >
                          {exp.location}
                        </Typography>
                      )}
                    </Box>
                    <Typography
                      sx={{ fontSize: "12px", color: "#666" }}
                      className="item-date"
                    >
                      {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                    </Typography>
                  </Stack>
                  {exp.description && (
                    <Typography
                      sx={{
                        fontSize: "12px",
                        lineHeight: 1.5,
                        mt: "5px",
                        textAlign: "justify",
                      }}
                      className="item-description"
                    >
                      {exp.description}
                    </Typography>
                  )}
                </Box>
              ))}
            </ResumeSection>
          )}

          {/* Education */}
          {formData.education && formData.education.length > 0 && (
            <ResumeSection title="Education">
              {formData.education.map((edu, i) => (
                <Box
                  key={i}
                  sx={{
                    mb: 2,
                    pl: 1,
                  }}
                  className="education-item"
                >
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    mb={0.5}
                    className="item-header"
                    spacing={1}
                  >
                    <Box>
                      <Typography
                        sx={{ fontWeight: "bold", fontSize: "14px" }}
                        className="item-title"
                      >
                        {edu.degree || ""}
                        {edu.field ? ` in ${edu.field}` : ""}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "13px",
                          color: "#555",
                          mb: 0.5,
                        }}
                        className="item-company"
                      >
                        {edu.institution || ""}
                      </Typography>
                      {edu.location && (
                        <Typography
                          sx={{ fontSize: "13px", color: "#555", mb: 0.5 }}
                          className="item-location"
                        >
                          {edu.location}
                        </Typography>
                      )}
                      {edu.gpa && (
                        <Typography
                          sx={{ fontSize: "13px", color: "#555", mb: 0.5 }}
                          className="item-location"
                        >
                          GPA: {edu.gpa}
                        </Typography>
                      )}
                    </Box>
                    <Typography
                      sx={{ fontSize: "12px", color: "#666" }}
                      className="item-date"
                    >
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                    </Typography>
                  </Stack>
                </Box>
              ))}
            </ResumeSection>
          )}

          {/* Skills */}
          {formData.skills && (
            <ResumeSection title="Skills">
              <Stack direction="row" spacing={1} flexWrap="wrap" className="skills-list">
                {(Array.isArray(formData.skills)
                  ? formData.skills
                  : typeof formData.skills === "string"
                  ? formData.skills.split(",")
                  : []
                ).map((skill, i) => (
                  <Chip
                    key={i}
                    label={skill.trim()}
                    size="small"
                    sx={{
                      mb: 1,
                      mr: 1,
                      bgcolor: "#eef2fa",
                      color: "#222",
                    }}
                  />
                ))}
              </Stack>
            </ResumeSection>
          )}

          {/* Certifications */}
          {formData.certifications && formData.certifications.length > 0 && (
            <ResumeSection title="Certifications">
              {formData.certifications.map((cert, i) => (
                <Box key={i} sx={{ mb: 2, pl: 1 }} className="cert-item">
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    mb={0.5}
                    className="item-header"
                    spacing={1}
                  >
                    <Box>
                      <Typography
                        sx={{ fontWeight: "bold", fontSize: "14px" }}
                        className="item-title"
                      >
                        {cert.name || ""}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "13px",
                          color: "#555",
                          mb: 0.5,
                        }}
                        className="item-company"
                      >
                        {cert.organization || ""}
                      </Typography>
                      {cert.credentialId && (
                        <Typography
                          sx={{ fontSize: "13px", color: "#555", mb: 0.5 }}
                          className="item-location"
                        >
                          Credential ID: {cert.credentialId}
                        </Typography>
                      )}
                    </Box>
                    <Typography
                      sx={{ fontSize: "12px", color: "#666" }}
                      className="item-date"
                    >
                      Issued: {formatDate(cert.issueDate)}
                      {cert.expirationDate
                        ? ` | Expires: ${formatDate(cert.expirationDate)}`
                        : ""}
                    </Typography>
                  </Stack>
                </Box>
              ))}
            </ResumeSection>
          )}

          {/* Projects */}
          {formData.projects && formData.projects.length > 0 && (
            <ResumeSection title="Projects">
              {formData.projects.map((project, i) => (
                <Box key={i} sx={{ mb: 2, pl: 1 }} className="project-item">
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    mb={0.5}
                    className="item-header"
                    spacing={1}
                  >
                    <Box>
                      <Typography
                        sx={{ fontWeight: "bold", fontSize: "14px" }}
                        className="item-title"
                      >
                        {project.name || ""}
                        {project.url && (
                          <>
                            {" - "}
                            <Link
                              href={project.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{ color: "#1976d2", textDecoration: "none" }}
                            >
                              {project.url}
                            </Link>
                          </>
                        )}
                      </Typography>
                      {project.technologies && (
                        <Typography
                          sx={{
                            fontSize: "13px",
                            color: "#555",
                            mb: 0.5,
                          }}
                          className="item-company"
                        >
                          Technologies: {project.technologies}
                        </Typography>
                      )}
                    </Box>
                    {project.date && (
                      <Typography
                        sx={{ fontSize: "12px", color: "#666" }}
                        className="item-date"
                      >
                        {formatDate(project.date)}
                      </Typography>
                    )}
                  </Stack>
                  {project.description && (
                    <Typography
                      sx={{
                        fontSize: "12px",
                        lineHeight: 1.5,
                        mt: "5px",
                        textAlign: "justify",
                      }}
                      className="item-description"
                    >
                      {project.description}
                    </Typography>
                  )}
                </Box>
              ))}
            </ResumeSection>
          )}

          {/* Languages */}
          {formData.languages && (
            <ResumeSection title="Languages">
              <Stack direction="row" spacing={1} flexWrap="wrap" className="languages-list">
                {(Array.isArray(formData.languages)
                  ? formData.languages
                  : typeof formData.languages === "string"
                  ? formData.languages.split(",")
                  : []
                ).map((lang, i) => (
                  <Chip
                    key={i}
                    label={lang.trim()}
                    size="small"
                    sx={{
                      mb: 1,
                      mr: 1,
                      bgcolor: "#eef2fa",
                      color: "#222",
                    }}
                  />
                ))}
              </Stack>
            </ResumeSection>
          )}
        </Box>
      </DialogContent>
      <DialogActions className="dialog-actions-bar">
        <Button
          onClick={onClose}
          className="primary-outline-btn"
          variant="outlined"
          sx={{ minWidth: "100px" }}
        >
          Close
        </Button>
        <Button
          onClick={onAISuggest}
          className="secondary-outline-btn"
          variant="outlined"
          startIcon={<SmartToyIcon />}
          sx={{
            minWidth: "140px",
            borderColor: "var(--secondary)",
            color: "var(--secondary)",
          }}
        >
          AI Suggest
        </Button>
        <Button
          onClick={onDownload}
          className="primary-action-btn"
          variant="contained"
          startIcon={<DownloadIcon />}
          sx={{ minWidth: "140px" }}
        >
          Download PDF
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ResumePreview;
