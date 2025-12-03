"use client";
import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  IconButton,
  Stack,
  Autocomplete,
  Chip,
  Collapse,
  Snackbar,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import SaveIcon from "@mui/icons-material/Save";
import DownloadIcon from "@mui/icons-material/Download";
import PreviewIcon from "@mui/icons-material/Preview";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import HeaderFooterLayout from "@/layouts/header-footer-layout/HeaderFooterLayout";
import { useRouter } from "next/navigation";
import ResumePreview from "@/components/resume/ResumePreview";

const ResumeBuilderPage = () => {
  const router = useRouter();
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

  // Form data
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    linkedIn: "",
    portfolio: "",
    github: "",

    // Professional Summary
    professionalSummary: "",

    // Work Experience (array)
    workExperience: [],

    // Education (array)
    education: [],

    // Skills
    skills: "",

    // Certifications (array)
    certifications: [],

    // Projects (array)
    projects: [],

    // Languages
    languages: "",
  });

  useEffect(() => {
    // Load saved resume data from localStorage or API
    loadResumeData();
  }, []);

  const loadResumeData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }

      // Try to load from localStorage first
      const savedResume = localStorage.getItem("resumeData");
      if (savedResume) {
        setFormData(JSON.parse(savedResume));
      }

      // TODO: Load from API if available
      // const response = await fetch("/api/user/resume", {
      //   headers: { Authorization: `Bearer ${token}` },
      // });
      // if (response.ok) {
      //   const data = await response.json();
      //   if (data.success) setFormData(data.data);
      // }
    } catch (error) {
      console.error("Error loading resume:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleArrayChange = (section, index, field, value) => {
    const updated = [...formData[section]];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, [section]: updated });
  };

  const addArrayItem = (section, defaultItem) => {
    setFormData({
      ...formData,
      [section]: [...formData[section], defaultItem],
    });
  };

  const removeArrayItem = (section, index) => {
    const updated = formData[section].filter((_, i) => i !== index);
    setFormData({ ...formData, [section]: updated });
  };

  const handleSave = async () => {
    try {
      // Save to localStorage
      localStorage.setItem("resumeData", JSON.stringify(formData));

      // TODO: Save to API
      // const token = localStorage.getItem("token");
      // const response = await fetch("/api/user/resume", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${token}`,
      //   },
      //   body: JSON.stringify(formData),
      // });

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

  const handleAISuggest = () => {
    // Common ATS keywords for tech/software development roles
    const atsKeywords = {
      technical: [
        "JavaScript",
        "TypeScript",
        "React",
        "Node.js",
        "Python",
        "Java",
        "C++",
        "SQL",
        "MongoDB",
        "PostgreSQL",
        "AWS",
        "Docker",
        "Kubernetes",
        "Git",
        "CI/CD",
        "REST APIs",
        "GraphQL",
        "Microservices",
        "Agile",
        "Scrum",
        "DevOps",
        "System Design",
        "Machine Learning",
        "Data Structures",
        "Algorithms",
        "Object-Oriented Programming",
        "Test-Driven Development",
        "API Development",
        "Cloud Computing",
        "Linux",
        "Database Design",
        "Software Architecture",
      ],
      soft: [
        "Problem Solving",
        "Team Collaboration",
        "Communication",
        "Leadership",
        "Project Management",
        "Time Management",
        "Critical Thinking",
        "Adaptability",
        "Innovation",
        "Analytical Skills",
      ],
      methodologies: [
        "Agile Methodology",
        "Scrum Framework",
        "Kanban",
        "Waterfall",
        "DevOps Practices",
        "Continuous Integration",
        "Continuous Deployment",
        "Test Automation",
        "Code Review",
      ],
    };

    // Enhance professional summary with ATS keywords
    const currentSummary = formData.professionalSummary || "";
    const suggestedKeywords = [
      ...atsKeywords.technical.slice(0, 5),
      ...atsKeywords.soft.slice(0, 3),
      ...atsKeywords.methodologies.slice(0, 2),
    ].join(", ");

    // Enhance skills if empty or minimal
    let enhancedSkills = formData.skills;
    if (!enhancedSkills || enhancedSkills.split(",").length < 10) {
      const existingSkills = enhancedSkills
        ? enhancedSkills.split(",").map((s) => s.trim())
        : [];
      const newSkills = atsKeywords.technical
        .filter(
          (skill) =>
            !existingSkills.some((existing) =>
              existing.toLowerCase().includes(skill.toLowerCase())
            )
        )
        .slice(0, 10);
      enhancedSkills = [...existingSkills, ...newSkills].join(", ");
    }

    // Enhance professional summary
    let enhancedSummary = currentSummary;
    if (!enhancedSummary || enhancedSummary.length < 100) {
      enhancedSummary = `Experienced professional with expertise in ${atsKeywords.technical
        .slice(0, 5)
        .join(", ")}. 
      Proven track record in ${atsKeywords.methodologies[0]} and ${
        atsKeywords.methodologies[1]
      }. 
      Strong ${atsKeywords.soft
        .slice(0, 2)
        .join(
          " and "
        )} skills with a focus on delivering high-quality solutions.`;
    } else {
      // Add ATS keywords to existing summary if not present
      const summaryLower = enhancedSummary.toLowerCase();
      const missingKeywords = atsKeywords.technical
        .filter((keyword) => !summaryLower.includes(keyword.toLowerCase()))
        .slice(0, 3);

      if (missingKeywords.length > 0) {
        enhancedSummary += ` Proficient in ${missingKeywords.join(", ")}.`;
      }
    }

    // Update form data
    setFormData({
      ...formData,
      professionalSummary: enhancedSummary,
      skills: enhancedSkills,
    });

    showSnackbar(
      "AI suggestions applied! ATS keywords and enhancements added to your resume.",
      "success"
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Present";
    const date = new Date(dateString + "-01");
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const handleDownload = () => {
    try {
      // Create a printable version of the resume
      const printWindow = window.open("", "_blank");
      const resumeContent = generateResumeHTML();

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Resume - ${formData.firstName} ${formData.lastName}</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body {
                font-family: 'Arial', sans-serif;
                line-height: 1.4;
                color: #333;
                max-width: 210mm;
                margin: 0 auto;
                padding: 15mm;
                background: white;
                font-size: 10px;
              }
              .header {
                border-bottom: 2px solid #333;
                padding-bottom: 8px;
                margin-bottom: 12px;
              }
              .header h1 {
                font-size: 20px;
                margin-bottom: 5px;
                color: #1a1a1a;
                line-height: 1.2;
              }
              .contact-info {
                display: flex;
                flex-wrap: wrap;
                gap: 8px;
                font-size: 9px;
                color: #666;
              }
              .section {
                margin-bottom: 12px;
              }
              .section-title {
                font-size: 12px;
                font-weight: bold;
                margin-bottom: 6px;
                color: #1a1a1a;
                border-bottom: 1px solid #ddd;
                padding-bottom: 3px;
              }
              .experience-item, .education-item, .cert-item, .project-item {
                margin-bottom: 8px;
                padding-left: 5px;
              }
              .item-header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 3px;
                flex-wrap: wrap;
              }
              .item-title {
                font-weight: bold;
                font-size: 10px;
              }
              .item-date {
                font-size: 9px;
                color: #666;
              }
              .item-company, .item-location {
                font-size: 9px;
                color: #555;
                margin-bottom: 2px;
              }
              .item-description {
                font-size: 9px;
                line-height: 1.3;
                margin-top: 3px;
                text-align: justify;
              }
              .skills-list, .languages-list {
                font-size: 9px;
                line-height: 1.4;
              }
              .summary {
                font-size: 9px;
                line-height: 1.4;
                text-align: justify;
              }
              @media print {
                body { 
                  padding: 10mm;
                  font-size: 9px;
                }
                .section { 
                  page-break-inside: avoid;
                  margin-bottom: 10px;
                }
                .header h1 { font-size: 18px; }
                .section-title { font-size: 11px; }
                .item-title { font-size: 9px; }
                .item-description, .summary { font-size: 8px; }
              }
            </style>
          </head>
          <body>
            ${resumeContent}
          </body>
        </html>
      `);

      printWindow.document.close();

      // Wait for content to load, then print
      setTimeout(() => {
        printWindow.print();
        // Optionally close after printing
        // printWindow.close();
      }, 250);

      showSnackbar(
        "PDF download initiated! Use the print dialog to save as PDF.",
        "success"
      );
    } catch (error) {
      console.error("Error generating PDF:", error);
      showSnackbar("Failed to generate PDF. Please try again.", "error");
    }
  };

  const generateResumeHTML = () => {
    const fullName =
      `${formData.firstName} ${formData.lastName}`.trim() || "Your Name";
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
    if (formData.portfolio)
      contactInfo.push(`Portfolio: ${formData.portfolio}`);
    if (formData.github) contactInfo.push(`GitHub: ${formData.github}`);

    let html = `
      <div class="header">
        <h1>${fullName}</h1>
        <div class="contact-info">${contactInfo.join(" | ")}</div>
      </div>
    `;

    // Professional Summary
    if (formData.professionalSummary) {
      html += `
        <div class="section">
          <div class="section-title">Professional Summary</div>
          <div class="summary">${formData.professionalSummary}</div>
        </div>
      `;
    }

    // Work Experience
    if (formData.workExperience && formData.workExperience.length > 0) {
      html += `
        <div class="section">
          <div class="section-title">Work Experience</div>
      `;
      formData.workExperience.forEach((exp) => {
        const startDate = formatDate(exp.startDate);
        const endDate = formatDate(exp.endDate);
        html += `
          <div class="experience-item">
            <div class="item-header">
              <div>
                <div class="item-title">${exp.jobTitle || ""}</div>
                <div class="item-company">${exp.company || ""}</div>
                ${
                  exp.location
                    ? `<div class="item-location">${exp.location}</div>`
                    : ""
                }
              </div>
              <div class="item-date">${startDate} - ${endDate}</div>
            </div>
            ${
              exp.description
                ? `<div class="item-description">${exp.description}</div>`
                : ""
            }
          </div>
        `;
      });
      html += `</div>`;
    }

    // Education
    if (formData.education && formData.education.length > 0) {
      html += `
        <div class="section">
          <div class="section-title">Education</div>
      `;
      formData.education.forEach((edu) => {
        const startDate = formatDate(edu.startDate);
        const endDate = formatDate(edu.endDate);
        html += `
          <div class="education-item">
            <div class="item-header">
              <div>
                <div class="item-title">${edu.degree || ""}${
          edu.field ? ` in ${edu.field}` : ""
        }</div>
                <div class="item-company">${edu.institution || ""}</div>
                ${
                  edu.location
                    ? `<div class="item-location">${edu.location}</div>`
                    : ""
                }
                ${
                  edu.gpa
                    ? `<div class="item-location">GPA: ${edu.gpa}</div>`
                    : ""
                }
              </div>
              <div class="item-date">${startDate} - ${endDate}</div>
            </div>
          </div>
        `;
      });
      html += `</div>`;
    }

    // Skills
    if (formData.skills) {
      html += `
        <div class="section">
          <div class="section-title">Skills</div>
          <div class="skills-list">${formData.skills}</div>
        </div>
      `;
    }

    // Certifications
    if (formData.certifications && formData.certifications.length > 0) {
      html += `
        <div class="section">
          <div class="section-title">Certifications</div>
      `;
      formData.certifications.forEach((cert) => {
        const issueDate = formatDate(cert.issueDate);
        const expDate = cert.expirationDate
          ? formatDate(cert.expirationDate)
          : "No expiration";
        html += `
          <div class="cert-item">
            <div class="item-header">
              <div>
                <div class="item-title">${cert.name || ""}</div>
                <div class="item-company">${cert.organization || ""}</div>
                ${
                  cert.credentialId
                    ? `<div class="item-location">Credential ID: ${cert.credentialId}</div>`
                    : ""
                }
              </div>
              <div class="item-date">Issued: ${issueDate}${
          cert.expirationDate ? ` | Expires: ${expDate}` : ""
        }</div>
            </div>
          </div>
        `;
      });
      html += `</div>`;
    }

    // Projects
    if (formData.projects && formData.projects.length > 0) {
      html += `
        <div class="section">
          <div class="section-title">Projects</div>
      `;
      formData.projects.forEach((project) => {
        const projectDate = formatDate(project.date);
        html += `
          <div class="project-item">
            <div class="item-header">
              <div>
                <div class="item-title">${project.name || ""}${
          project.url
            ? ` - <a href="${project.url}" target="_blank">${project.url}</a>`
            : ""
        }</div>
                ${
                  project.technologies
                    ? `<div class="item-company">Technologies: ${project.technologies}</div>`
                    : ""
                }
              </div>
              ${
                project.date
                  ? `<div class="item-date">${projectDate}</div>`
                  : ""
              }
            </div>
            ${
              project.description
                ? `<div class="item-description">${project.description}</div>`
                : ""
            }
          </div>
        `;
      });
      html += `</div>`;
    }

    // Languages
    if (formData.languages) {
      html += `
        <div class="section">
          <div class="section-title">Languages</div>
          <div class="languages-list">${formData.languages}</div>
        </div>
      `;
    }

    return html;
  };

  const loadSampleData = () => {
    const sampleData = {
      // Personal Information
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@email.com",
      phone: "+1 (555) 123-4567",
      address: "123 Main Street",
      city: "San Francisco",
      state: "California",
      zipCode: "94102",
      country: "United States",
      linkedIn: "https://linkedin.com/in/johndoe",
      portfolio: "https://johndoe.dev",
      github: "https://github.com/johndoe",

      // Professional Summary
      professionalSummary:
        "Experienced Full Stack Developer with 5+ years of expertise in building scalable web applications using React, Node.js, and MongoDB. Proven track record of delivering high-quality software solutions that improve user experience and business outcomes. Passionate about clean code, agile methodologies, and continuous learning.",

      // Work Experience
      workExperience: [
        {
          jobTitle: "Senior Full Stack Developer",
          company: "Tech Solutions Inc.",
          startDate: "2021-03",
          endDate: "",
          location: "San Francisco, CA",
          description:
            "Led development of microservices architecture serving 100K+ daily active users. Implemented CI/CD pipelines reducing deployment time by 60%. Mentored junior developers and conducted code reviews. Technologies: React, Node.js, MongoDB, AWS, Docker, Kubernetes.",
        },
        {
          jobTitle: "Full Stack Developer",
          company: "Digital Innovations LLC",
          startDate: "2019-06",
          endDate: "2021-02",
          location: "San Francisco, CA",
          description:
            "Developed and maintained multiple client-facing web applications using React and Node.js. Collaborated with cross-functional teams to deliver features on time. Optimized database queries improving page load times by 40%. Technologies: React, Node.js, PostgreSQL, Express.js.",
        },
        {
          jobTitle: "Junior Web Developer",
          company: "StartupXYZ",
          startDate: "2018-01",
          endDate: "2019-05",
          location: "San Francisco, CA",
          description:
            "Built responsive web applications using HTML, CSS, JavaScript, and React. Fixed bugs and implemented new features based on user feedback. Participated in daily standups and sprint planning. Technologies: HTML, CSS, JavaScript, React, REST APIs.",
        },
      ],

      // Education
      education: [
        {
          degree: "Bachelor of Science",
          field: "Computer Science",
          institution: "University of California, Berkeley",
          location: "Berkeley, CA",
          startDate: "2014-09",
          endDate: "2018-05",
          gpa: "3.8/4.0",
        },
      ],

      // Skills
      skills:
        "JavaScript, TypeScript, React, Node.js, Express.js, MongoDB, PostgreSQL, AWS, Docker, Kubernetes, Git, REST APIs, GraphQL, Agile, Scrum, CI/CD, Microservices, System Design",

      // Certifications
      certifications: [
        {
          name: "AWS Certified Solutions Architect",
          organization: "Amazon Web Services",
          issueDate: "2022-06",
          expirationDate: "2025-06",
          credentialId: "AWS-ASA-12345",
        },
        {
          name: "MongoDB Certified Developer",
          organization: "MongoDB University",
          issueDate: "2021-09",
          expirationDate: "",
          credentialId: "MDB-DEV-67890",
        },
      ],

      // Projects
      projects: [
        {
          name: "E-Commerce Platform",
          url: "https://github.com/johndoe/ecommerce-platform",
          technologies: "React, Node.js, MongoDB, Stripe API, AWS",
          date: "2023-01",
          description:
            "Built a full-stack e-commerce platform with payment integration, user authentication, and admin dashboard. Implemented real-time inventory management and order tracking. Deployed on AWS with auto-scaling capabilities.",
        },
        {
          name: "Task Management App",
          url: "https://github.com/johndoe/task-manager",
          technologies: "React, Node.js, PostgreSQL, Socket.io",
          date: "2022-08",
          description:
            "Developed a collaborative task management application with real-time updates using WebSockets. Features include drag-and-drop interface, team collaboration, and notification system.",
        },
        {
          name: "Weather Dashboard",
          url: "https://github.com/johndoe/weather-dashboard",
          technologies: "React, OpenWeatherMap API, Chart.js",
          date: "2021-12",
          description:
            "Created a responsive weather dashboard displaying current conditions and 7-day forecasts. Integrated multiple weather APIs and implemented data visualization using Chart.js.",
        },
      ],

      // Languages
      languages: "English (Native), Spanish (Conversational), French (Basic)",
    };

    setFormData(sampleData);
    showSnackbar(
      "Sample data loaded successfully! You can now edit and customize it.",
      "success"
    );
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <HeaderFooterLayout>
      <Container maxWidth="lg">
        <Box className="page-content" mt={2}>
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
              {/* Personal Information */}
              <Card className="whitebx" sx={{ mb: 3 }}>
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                    sx={{ cursor: "pointer" }}
                    onClick={() =>
                      setPersonalInfoExpanded(!personalInfoExpanded)
                    }
                  >
                    <Typography variant="h6" className="fw6">
                      Personal Information
                    </Typography>
                    {personalInfoExpanded ? (
                      <ExpandLessIcon />
                    ) : (
                      <ExpandMoreIcon />
                    )}
                  </Box>
                  <Divider />
                  <Collapse in={personalInfoExpanded}>
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
                            label="Last Name *"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
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
                        <TextField
                          fullWidth
                          label="City"
                          name="city"
                          value={formData.city}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField
                          fullWidth
                          label="State"
                          name="state"
                          value={formData.state}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 4 }}>
                        <TextField
                          fullWidth
                          label="Zip Code"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="Country"
                          name="country"
                          value={formData.country}
                          onChange={handleChange}
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="LinkedIn Profile"
                          name="linkedIn"
                          value={formData.linkedIn}
                          onChange={handleChange}
                          placeholder="https://linkedin.com/in/yourprofile"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="Portfolio Website"
                          name="portfolio"
                          value={formData.portfolio}
                          onChange={handleChange}
                          placeholder="https://yourportfolio.com"
                        />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField
                          fullWidth
                          label="GitHub Profile"
                          name="github"
                          value={formData.github}
                          onChange={handleChange}
                          placeholder="https://github.com/yourusername"
                        />
                      </Grid>
                    </Grid>
                  </Collapse>
                </CardContent>
              </Card>

              {/* Professional Summary */}
              <Card className="whitebx" sx={{ mb: 3 }}>
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                    sx={{ cursor: "pointer" }}
                    onClick={() => setSummaryExpanded(!summaryExpanded)}
                  >
                    <Typography variant="h6" className="fw6">
                      Professional Summary
                    </Typography>
                    {summaryExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </Box>
                  <Divider />
                  <Collapse in={summaryExpanded}>
                    <TextField
                      fullWidth
                      multiline
                      rows={5}
                      label="Summary"
                      name="professionalSummary"
                      value={formData.professionalSummary}
                      onChange={handleChange}
                      placeholder="Write a brief summary of your professional background and key achievements..."
                      sx={{ mt: 2 }}
                    />
                  </Collapse>
                </CardContent>
              </Card>

              {/* Work Experience */}
              <Card className="whitebx" sx={{ mb: 3 }}>
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                    sx={{ cursor: "pointer" }}
                    onClick={() => setExperienceExpanded(!experienceExpanded)}
                  >
                    <Typography variant="h6" className="fw6">
                      Work Experience
                    </Typography>
                    {experienceExpanded ? (
                      <ExpandLessIcon />
                    ) : (
                      <ExpandMoreIcon />
                    )}
                  </Box>
                  <Divider />
                  <Collapse in={experienceExpanded}>
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
                              onClick={() =>
                                removeArrayItem("workExperience", index)
                              }
                              color="error"
                            >
                              <DeleteOutlineIcon />
                            </IconButton>
                          </Box>
                          <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <TextField
                                fullWidth
                                label="Job Title *"
                                value={exp.jobTitle || ""}
                                onChange={(e) =>
                                  handleArrayChange(
                                    "workExperience",
                                    index,
                                    "jobTitle",
                                    e.target.value
                                  )
                                }
                                required
                              />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <TextField
                                fullWidth
                                label="Company *"
                                value={exp.company || ""}
                                onChange={(e) =>
                                  handleArrayChange(
                                    "workExperience",
                                    index,
                                    "company",
                                    e.target.value
                                  )
                                }
                                required
                              />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <TextField
                                fullWidth
                                label="Start Date"
                                type="month"
                                value={exp.startDate || ""}
                                onChange={(e) =>
                                  handleArrayChange(
                                    "workExperience",
                                    index,
                                    "startDate",
                                    e.target.value
                                  )
                                }
                              />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <TextField
                                fullWidth
                                label="End Date"
                                type="month"
                                value={exp.endDate || ""}
                                onChange={(e) =>
                                  handleArrayChange(
                                    "workExperience",
                                    index,
                                    "endDate",
                                    e.target.value
                                  )
                                }
                                placeholder="Present"
                              />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                              <TextField
                                fullWidth
                                label="Location"
                                value={exp.location || ""}
                                onChange={(e) =>
                                  handleArrayChange(
                                    "workExperience",
                                    index,
                                    "location",
                                    e.target.value
                                  )
                                }
                              />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                              <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Description"
                                value={exp.description || ""}
                                onChange={(e) =>
                                  handleArrayChange(
                                    "workExperience",
                                    index,
                                    "description",
                                    e.target.value
                                  )
                                }
                                placeholder="Describe your responsibilities and achievements..."
                              />
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
                  </Collapse>
                </CardContent>
              </Card>

              {/* Education */}
              <Card className="whitebx" sx={{ mb: 3 }}>
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                    sx={{ cursor: "pointer" }}
                    onClick={() => setEducationExpanded(!educationExpanded)}
                  >
                    <Typography variant="h6" className="fw6">
                      Education
                    </Typography>
                    {educationExpanded ? (
                      <ExpandLessIcon />
                    ) : (
                      <ExpandMoreIcon />
                    )}
                  </Box>
                  <Divider />
                  <Collapse in={educationExpanded}>
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
                              onClick={() =>
                                removeArrayItem("education", index)
                              }
                              color="error"
                            >
                              <DeleteOutlineIcon />
                            </IconButton>
                          </Box>
                          <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <TextField
                                fullWidth
                                label="Degree *"
                                value={edu.degree || ""}
                                onChange={(e) =>
                                  handleArrayChange(
                                    "education",
                                    index,
                                    "degree",
                                    e.target.value
                                  )
                                }
                                required
                              />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <TextField
                                fullWidth
                                label="Field of Study"
                                value={edu.field || ""}
                                onChange={(e) =>
                                  handleArrayChange(
                                    "education",
                                    index,
                                    "field",
                                    e.target.value
                                  )
                                }
                              />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <TextField
                                fullWidth
                                label="Institution *"
                                value={edu.institution || ""}
                                onChange={(e) =>
                                  handleArrayChange(
                                    "education",
                                    index,
                                    "institution",
                                    e.target.value
                                  )
                                }
                                required
                              />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <TextField
                                fullWidth
                                label="Location"
                                value={edu.location || ""}
                                onChange={(e) =>
                                  handleArrayChange(
                                    "education",
                                    index,
                                    "location",
                                    e.target.value
                                  )
                                }
                              />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <TextField
                                fullWidth
                                label="Start Date"
                                type="month"
                                value={edu.startDate || ""}
                                onChange={(e) =>
                                  handleArrayChange(
                                    "education",
                                    index,
                                    "startDate",
                                    e.target.value
                                  )
                                }
                              />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <TextField
                                fullWidth
                                label="End Date / Graduation Date"
                                type="month"
                                value={edu.endDate || ""}
                                onChange={(e) =>
                                  handleArrayChange(
                                    "education",
                                    index,
                                    "endDate",
                                    e.target.value
                                  )
                                }
                              />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <TextField
                                fullWidth
                                label="GPA (Optional)"
                                value={edu.gpa || ""}
                                onChange={(e) =>
                                  handleArrayChange(
                                    "education",
                                    index,
                                    "gpa",
                                    e.target.value
                                  )
                                }
                                placeholder="e.g., 3.8/4.0"
                              />
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
                          })
                        }
                        className="primary-outline-btn"
                      >
                        Add Education
                      </Button>
                    </Box>
                  </Collapse>
                </CardContent>
              </Card>

              {/* Skills */}
              <Card className="whitebx" sx={{ mb: 3 }}>
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                    sx={{ cursor: "pointer" }}
                    onClick={() => setSkillsExpanded(!skillsExpanded)}
                  >
                    <Typography variant="h6" className="fw6">
                      Skills
                    </Typography>
                    {skillsExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </Box>
                  <Divider />
                  <Collapse in={skillsExpanded}>
                    <TextField
                      fullWidth
                      multiline
                      rows={3}
                      label="Skills (comma-separated)"
                      name="skills"
                      value={formData.skills}
                      onChange={handleChange}
                      placeholder="e.g., JavaScript, React, Node.js, MongoDB, Python"
                      sx={{ mt: 2 }}
                    />
                  </Collapse>
                </CardContent>
              </Card>

              {/* Certifications */}
              <Card className="whitebx" sx={{ mb: 3 }}>
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                    sx={{ cursor: "pointer" }}
                    onClick={() =>
                      setCertificationsExpanded(!certificationsExpanded)
                    }
                  >
                    <Typography variant="h6" className="fw6">
                      Certifications
                    </Typography>
                    {certificationsExpanded ? (
                      <ExpandLessIcon />
                    ) : (
                      <ExpandMoreIcon />
                    )}
                  </Box>
                  <Divider />
                  <Collapse in={certificationsExpanded}>
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
                              onClick={() =>
                                removeArrayItem("certifications", index)
                              }
                              color="error"
                            >
                              <DeleteOutlineIcon />
                            </IconButton>
                          </Box>
                          <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <TextField
                                fullWidth
                                label="Certification Name *"
                                value={cert.name || ""}
                                onChange={(e) =>
                                  handleArrayChange(
                                    "certifications",
                                    index,
                                    "name",
                                    e.target.value
                                  )
                                }
                                required
                              />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <TextField
                                fullWidth
                                label="Issuing Organization"
                                value={cert.organization || ""}
                                onChange={(e) =>
                                  handleArrayChange(
                                    "certifications",
                                    index,
                                    "organization",
                                    e.target.value
                                  )
                                }
                              />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <TextField
                                fullWidth
                                label="Issue Date"
                                type="month"
                                value={cert.issueDate || ""}
                                onChange={(e) =>
                                  handleArrayChange(
                                    "certifications",
                                    index,
                                    "issueDate",
                                    e.target.value
                                  )
                                }
                              />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <TextField
                                fullWidth
                                label="Expiration Date (if applicable)"
                                type="month"
                                value={cert.expirationDate || ""}
                                onChange={(e) =>
                                  handleArrayChange(
                                    "certifications",
                                    index,
                                    "expirationDate",
                                    e.target.value
                                  )
                                }
                              />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                              <TextField
                                fullWidth
                                label="Credential ID / URL"
                                value={cert.credentialId || ""}
                                onChange={(e) =>
                                  handleArrayChange(
                                    "certifications",
                                    index,
                                    "credentialId",
                                    e.target.value
                                  )
                                }
                                placeholder="Certificate ID or verification URL"
                              />
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
                          })
                        }
                        className="primary-outline-btn"
                      >
                        Add Certification
                      </Button>
                    </Box>
                  </Collapse>
                </CardContent>
              </Card>

              {/* Projects */}
              <Card className="whitebx" sx={{ mb: 3 }}>
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                    sx={{ cursor: "pointer" }}
                    onClick={() => setProjectsExpanded(!projectsExpanded)}
                  >
                    <Typography variant="h6" className="fw6">
                      Projects
                    </Typography>
                    {projectsExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  </Box>
                  <Divider />
                  <Collapse in={projectsExpanded}>
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
                              <TextField
                                fullWidth
                                label="Project Name *"
                                value={project.name || ""}
                                onChange={(e) =>
                                  handleArrayChange(
                                    "projects",
                                    index,
                                    "name",
                                    e.target.value
                                  )
                                }
                                required
                              />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <TextField
                                fullWidth
                                label="Project URL"
                                value={project.url || ""}
                                onChange={(e) =>
                                  handleArrayChange(
                                    "projects",
                                    index,
                                    "url",
                                    e.target.value
                                  )
                                }
                                placeholder="https://project-url.com"
                              />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <TextField
                                fullWidth
                                label="Technologies Used"
                                value={project.technologies || ""}
                                onChange={(e) =>
                                  handleArrayChange(
                                    "projects",
                                    index,
                                    "technologies",
                                    e.target.value
                                  )
                                }
                                placeholder="e.g., React, Node.js, MongoDB"
                              />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <TextField
                                fullWidth
                                label="Date"
                                type="month"
                                value={project.date || ""}
                                onChange={(e) =>
                                  handleArrayChange(
                                    "projects",
                                    index,
                                    "date",
                                    e.target.value
                                  )
                                }
                              />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                              <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Description"
                                value={project.description || ""}
                                onChange={(e) =>
                                  handleArrayChange(
                                    "projects",
                                    index,
                                    "description",
                                    e.target.value
                                  )
                                }
                                placeholder="Describe the project, your role, and key achievements..."
                              />
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
                  </Collapse>
                </CardContent>
              </Card>

              {/* Languages */}
              <Card className="whitebx" sx={{ mb: 3 }}>
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                    sx={{ cursor: "pointer" }}
                    onClick={() => setLanguagesExpanded(!languagesExpanded)}
                  >
                    <Typography variant="h6" className="fw6">
                      Languages
                    </Typography>
                    {languagesExpanded ? (
                      <ExpandLessIcon />
                    ) : (
                      <ExpandMoreIcon />
                    )}
                  </Box>
                  <Divider />
                  <Collapse in={languagesExpanded}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      label="Languages (comma-separated)"
                      name="languages"
                      value={formData.languages}
                      onChange={handleChange}
                      placeholder="e.g., English (Fluent), Spanish (Conversational), French (Basic)"
                      sx={{ mt: 2 }}
                    />
                  </Collapse>
                </CardContent>
              </Card>
            </Grid>

            {/* Right Column - Tips/Preview */}
            <Grid size={{ xs: 12, lg: 4 }}>
              <Card className="whitebx" sx={{ position: "sticky", top: 20 }}>
                <CardContent>
                  <Typography variant="h6" className="fw6" gutterBottom>
                    Resume Tips
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box component="ul" sx={{ pl: 2 }}>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                      Keep your professional summary concise (2-3 sentences)
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                      Use action verbs in your work experience descriptions
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                      Quantify your achievements with numbers when possible
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                      Tailor your resume to match job requirements
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                      Keep formatting consistent and professional
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                      Proofread for spelling and grammar errors
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* Preview Dialog */}
      <ResumePreview
        open={previewOpen}
        onClose={handleClosePreview}
        formData={formData}
        onAISuggest={handleAISuggest}
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
