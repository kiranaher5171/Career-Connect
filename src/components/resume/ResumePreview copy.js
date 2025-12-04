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
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";

const ResumeSection = ({ title, children }) => (
  <Box mb={3}>
    <Typography className="h3" className="resume-heading" gutterBottom>
      {title}
    </Typography>
    <Box>{children}</Box>
  </Box>
);

const ResumePreview = ({ open, onClose, formData, onAISuggest, onDownload, aiModifiedFields = {}, isAILoading = false, hideDialog = false }) => {
  if (!open && !hideDialog) return null;
  const formatDate = (dateString) => {
    if (!dateString) return "Present";
    const date = new Date(dateString + "-01");
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
  };

  const nameParts = [
    formData.firstName || "",
    formData.middleName || "",
    formData.lastName || "",
  ].filter(Boolean);
  const fullName = nameParts.join(" ").trim() || "Your Name";

  const contactInfo = [];
  if (formData.email) contactInfo.push({ type: 'text', label: 'Email', value: formData.email });
  if (formData.phone) contactInfo.push({ type: 'text', label: 'Phone', value: formData.phone });
  if (formData.address) {
    const addressParts = [
      formData.address,
      formData.city,
      formData.state,
      formData.zipCode,
      formData.country,
    ].filter(Boolean);
    if (addressParts.length > 0)
      contactInfo.push({ type: 'text', label: 'Address', value: addressParts.join(", ") });
  }
  if (formData.linkedIn) contactInfo.push({ type: 'link', label: 'LinkedIn', value: formData.linkedIn, url: formData.linkedIn });
  if (formData.portfolio) contactInfo.push({ type: 'link', label: 'Portfolio', value: formData.portfolio, url: formData.portfolio });
  if (formData.github) contactInfo.push({ type: 'link', label: 'GitHub', value: formData.github, url: formData.github });

  const resumeContent = (
    <Box>
          {/* Header */}
          <Box
            sx={{
              // borderBottom: "2px solid #333",
              // pb: "15px",
              mb: "40px",
            }}
            className="header"
          >
            <Typography variant="h1" className="fw7 center resume-username" >
              {fullName}
            </Typography>
            {formData.designation && (
             <Typography variant="h3" className="center resume-subheading" >
                {formData.designation}
              </Typography>
            )}
            {contactInfo.length > 0 && (
              <Stack
                direction="row"
                spacing={2}
                flexWrap="wrap"
                alignItems="center"
                className="contact-info fx_c"
              >
                {contactInfo.map((info, idx) => (
                  info.type === 'link' ? (
                    <Link
                      key={idx}
                      href={info.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        color: 'inherit',
                        textDecoration: 'none',
                        '&:hover': {
                          color: '#1930ab',
                          textDecoration: 'underline',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      <Typography variant="body2" className="center text" gutterBottom>
                        {info.label}: {info.value}
                      </Typography>
                    </Link>
                  ) : (
                    <Typography key={idx} variant="body2" className="center text" gutterBottom>
                      {info.label}: {info.value}
                    </Typography>
                  )
                ))}
              </Stack>
            )}
          </Box>

          {/* Professional Summary */}
          {formData.professionalSummary && (
            <ResumeSection title="Professional Summary">
              <Typography 
                variant="body2" 
                className="text"
                component="div"
                sx={{
                  backgroundColor: aiModifiedFields.professionalSummary ? '#fff9c4' : 'transparent',
                  padding: aiModifiedFields.professionalSummary ? '8px' : 0,
                  borderRadius: aiModifiedFields.professionalSummary ? '4px' : 0,
                  transition: 'background-color 0.3s',
                  whiteSpace: 'pre-line',
                }}
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
                      <Typography variant="body1" className="resume-subheading"  >
                        {exp.jobTitle || ""}
                      </Typography>
                      <Typography variant="body2" className="text" gutterBottom>
                        {[exp.company, exp.location].filter(Boolean).join(", ")}
                      </Typography>
                    </Box>
                    <Typography variant="body2" className="text" gutterBottom>
                      {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                    </Typography>
                  </Stack>
                  {exp.description && (
                    <Box
                      sx={{
                        backgroundColor: (aiModifiedFields.workExperience && aiModifiedFields.workExperience[i]) ? '#fff9c4' : 'transparent',
                        padding: (aiModifiedFields.workExperience && aiModifiedFields.workExperience[i]) ? '8px' : 0,
                        borderRadius: (aiModifiedFields.workExperience && aiModifiedFields.workExperience[i]) ? '4px' : 0,
                        transition: 'background-color 0.3s',
                      }}
                    >
                      {exp.description.split('\n').some(line => line.trim().startsWith('•')) ? (
                        <ul style={{ margin: 0, paddingLeft: '20px', marginTop: '8px' }}>
                          {exp.description.split('\n')
                            .filter(line => line.trim().startsWith('•'))
                            .map((line, idx) => (
                              <li key={idx} style={{ marginBottom: '4px' }}>
                                <Typography variant="body2" className="text" component="span">
                                  {line.trim().substring(1).trim()}
                                </Typography>
                              </li>
                            ))}
                        </ul>
                      ) : (
                        <Typography 
                          variant="body2" 
                          className="text" 
                          component="div"
                          sx={{ whiteSpace: 'pre-line' }}
                        >
                          {exp.description}
                        </Typography>
                      )}
                    </Box>
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
                    <Typography variant="body1" className="resume-subheading" gutterBottom >
                        {edu.degree || ""}
                        {edu.field ? ` in ${edu.field}` : ""}
                      </Typography>
                      <Typography variant="body2" className="text" gutterBottom>
                        {[edu.institution, edu.location].filter(Boolean).join(", ")}
                      </Typography>
                      {edu.gpa && (
                    <Typography variant="body2" className="text">
                          GPA: {edu.gpa}
                        </Typography>
                      )}
                    </Box>
                   <Typography variant="body2" className="text" gutterBottom>
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                    </Typography>
                  </Stack>
                  {edu.summary && (
                    <Typography variant="body2" className="text" sx={{ mt: 1 }}>
                      {edu.summary}
                    </Typography>
                  )}
                </Box>
              ))}
            </ResumeSection>
          )}

          {/* Skills */}
          {formData.skills && (
            <ResumeSection title="Skills">
              <Box
                sx={{
                  backgroundColor: aiModifiedFields.skills ? '#fff9c4' : 'transparent',
                  padding: aiModifiedFields.skills ? '8px' : 0,
                  borderRadius: aiModifiedFields.skills ? '4px' : 0,
                  transition: 'background-color 0.3s',
                }}
              >
                {(Array.isArray(formData.skills)
                  ? formData.skills
                  : typeof formData.skills === "string"
                  ? formData.skills.split(",")
                  : []
                ).some(skill => typeof skill === 'string' && skill.includes('**')) ? (
                  // Categorized skills (AI enhanced)
                  <Box>
                    {(Array.isArray(formData.skills)
                      ? formData.skills
                      : typeof formData.skills === "string"
                      ? formData.skills.split("|")
                      : []
                    ).map((skill, i) => {
                      const skillStr = typeof skill === 'string' ? skill.trim() : String(skill).trim();
                      if (!skillStr) return null;
                      
                      // Parse category format: **Category** - skill1, skill2
                      const match = skillStr.match(/\*\*(.*?)\*\*\s*-\s*(.*)/);
                      if (match) {
                        const [, category, skills] = match;
                        return (
                          <Typography key={i} variant="body2" className="text" sx={{ mb: 0.5 }}>
                            <span className="black fw5">{category}</span> - {skills}
                          </Typography>
                        );
                      }
                      return (
                        <Typography key={i} variant="body2" className="text" sx={{ mb: 0.5 }}>
                          {skillStr}
                        </Typography>
                      );
                    })}
                  </Box>
                ) : (
                  // Regular skills (comma separated)
                  <Stack direction="row" spacing={1} flexWrap="wrap" className="skills-list">
                    {(Array.isArray(formData.skills)
                      ? formData.skills
                      : typeof formData.skills === "string"
                      ? formData.skills.split(",")
                      : []
                    ).map((skill, i) => (
                      <Typography key={i} variant="body2" className="text" gutterBottom>
                        {skill.trim()},
                      </Typography>
                    ))}
                  </Stack>
                )}
              </Box>
            </ResumeSection>
          )}

          {/* Certifications */}
          {formData.certifications && formData.certifications.length > 0 && (
            <ResumeSection title="Certifications">
              {formData.certifications.map((cert, i) => (
                <Box
                  key={i}
                  sx={{
                    mb: 2,
                    pl: 1,
                  }}
                  className="cert-item"
                >
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    mb={0.5}
                    className="item-header"
                    spacing={1}
                  >
                    <Box>
                      <Typography variant="body1" className="resume-subheading">
                        {cert.name || ""}
                      </Typography>
                      <Typography variant="body2" className="text" gutterBottom>
                        {cert.organization || ""}
                      </Typography>
                      {cert.credentialId && (
                        <Typography variant="body2" className="text" gutterBottom>
                          Credential ID: {cert.credentialId}
                        </Typography>
                      )}
                    </Box>
                    <Typography variant="body2" className="text" gutterBottom>
                      Issued: {formatDate(cert.issueDate)}
                      {cert.expirationDate
                        ? ` | Expires: ${formatDate(cert.expirationDate)}`
                        : ""}
                    </Typography>
                  </Stack>
                  {cert.summary && (
                    <Typography variant="body2" className="text" sx={{ mt: 1, whiteSpace: 'pre-line' }}>
                      {cert.summary}
                    </Typography>
                  )}
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
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: project.url ? 'pointer' : 'default' }}
                        onClick={() => {
                          if (project.url) {
                            window.open(project.url, '_blank', 'noopener,noreferrer');
                          }
                        }}
                      >
                       
                        <Typography 
                          variant="body2" 
                          className="resume-subheading" 
                          gutterBottom
                          sx={{  
                            '&:hover': project.url
                              ? { textDecoration: 'underline', color: '#1930ab' }
                              : {}
                          }}
                        >
                          {project.name || ""}
                        </Typography>
                        {project.url && (
                          <LinkOutlinedIcon fontSize="small" sx={{ color: 'var(--primary)' }} />
                        )}
                      </Box>
                      {project.technologies && (
                      <Typography variant="body2" className="text" gutterBottom>
                          Technologies: {project.technologies}
                        </Typography>
                      )}
                    </Box>
                    {project.date && (
                <Typography variant="body2" className="text" gutterBottom>
                        {formatDate(project.date)}
                      </Typography>
                    )}
                  </Stack>
                  {project.description && (
                  <Typography variant="body2" className="text" gutterBottom>
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
                    <Typography key={i} variant="body2" className="text" gutterBottom>
                      {lang.trim()},
                    </Typography>
                  ))}
              </Stack>
            </ResumeSection>
          )}
        </Box>
  );

  if (hideDialog) {
    return resumeContent;
  }

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
        {resumeContent}
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
          disabled={isAILoading}
          sx={{
            minWidth: "140px",
            borderColor: "var(--secondary)",
            color: "var(--secondary)",
          }}
        >
          {isAILoading ? "Processing..." : "AI Suggest"}
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
