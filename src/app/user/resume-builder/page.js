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

// Reusable Tag Input Component
const TagInput = ({ onAdd, placeholder, label }) => {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    if (inputValue.trim()) {
      onAdd(inputValue);
      setInputValue("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
      <TextField
        fullWidth
        label={label}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={placeholder}
        size="small"
      />
      <Button
        variant="contained"
        onClick={handleAdd}
        startIcon={<AddIcon />}
        className="primary-action-btn"
        sx={{ minWidth: "120px" }}
      >
        Add More
      </Button>
    </Box>
  );
};

const ResumeBuilderPage = () => {
  const router = useRouter();
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [previewOpen, setPreviewOpen] = useState(false);
  const [aiModifiedFields, setAiModifiedFields] = useState({});
  const [isAILoading, setIsAILoading] = useState(false);

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
    middleName: "",
    lastName: "",
    designation: "",
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

    // Skills (array)
    skills: [],

    // Certifications (array)
    certifications: [],

    // Projects (array)
    projects: [],

    // Languages (array)
    languages: [],
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
        const parsedData = JSON.parse(savedResume);
        // Convert old string format to array format for backward compatibility
        if (typeof parsedData.skills === 'string') {
          parsedData.skills = parsedData.skills 
            ? parsedData.skills.split(',').map(s => s.trim()).filter(s => s)
            : [];
        }
        if (typeof parsedData.languages === 'string') {
          parsedData.languages = parsedData.languages 
            ? parsedData.languages.split(',').map(l => l.trim()).filter(l => l)
            : [];
        }
        // Ensure they are arrays
        if (!Array.isArray(parsedData.skills)) parsedData.skills = [];
        if (!Array.isArray(parsedData.languages)) parsedData.languages = [];
        setFormData(parsedData);
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

  // Handler for adding a new skill tag
  const handleAddSkill = (skillValue) => {
    if (skillValue && skillValue.trim()) {
      const trimmedSkill = skillValue.trim();
      if (!formData.skills.includes(trimmedSkill)) {
        setFormData({
          ...formData,
          skills: [...formData.skills, trimmedSkill],
        });
      }
    }
  };

  // Handler for removing a skill tag
  const handleRemoveSkill = (index) => {
    const updated = formData.skills.filter((_, i) => i !== index);
    setFormData({ ...formData, skills: updated });
  };

  // Handler for adding a new language tag
  const handleAddLanguage = (languageValue) => {
    if (languageValue && languageValue.trim()) {
      const trimmedLanguage = languageValue.trim();
      if (!formData.languages.includes(trimmedLanguage)) {
        setFormData({
          ...formData,
          languages: [...formData.languages, trimmedLanguage],
        });
      }
    }
  };

  // Handler for removing a language tag
  const handleRemoveLanguage = (index) => {
    const updated = formData.languages.filter((_, i) => i !== index);
    setFormData({ ...formData, languages: updated });
  };

  const handleSave = async () => {
    try {
      // Save to localStorage
      localStorage.setItem("resumeData", JSON.stringify(formData));
      
      // Also save to database
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

  const handleAISuggest = async () => {
    setIsAILoading(true);
    try {
      const response = await fetch('/api/ai/enhance-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resumeData: formData }),
      });

      const result = await response.json();

      if (result.success) {
        // Update form data with enhanced content
        setFormData(result.data);
        
        // Track which fields were modified by AI
        setAiModifiedFields(result.modifiedFields || {});
        
        showSnackbar(
          result.aiEnhanced
            ? "AI enhancements applied! Changes are highlighted in preview."
            : "Resume enhanced with ATS keywords!",
          "success"
        );
      } else {
        throw new Error(result.error || 'Failed to enhance resume');
      }
    } catch (error) {
      console.error('AI enhancement error:', error);
      // Fallback to basic enhancement
      handleBasicAISuggest();
    } finally {
      setIsAILoading(false);
    }
  };

  const handleBasicAISuggest = () => {
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

    // Categorize skills
    let enhancedSkills = Array.isArray(formData.skills) ? [...formData.skills] : [];
    
    // Check if skills are already categorized (contain **)
    const isCategorized = enhancedSkills.some(s => typeof s === 'string' && s.includes('**'));
    
    if (!isCategorized) {
      const skillCategories = {
        'Frontend': ['React', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Vue', 'Angular'],
        'Backend': ['Node.js', 'Python', 'Java', 'Express.js', 'Django', 'Spring'],
        'Database': ['SQL', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis'],
        'Cloud & DevOps': ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Jenkins', 'Git'],
        'Tools & Others': ['Git', 'REST APIs', 'GraphQL', 'Agile', 'Scrum', 'DevOps'],
      };

      const categorized = [];
      const usedSkills = new Set();

      Object.entries(skillCategories).forEach(([category, skills]) => {
        const matched = enhancedSkills.filter(skill => {
          const skillStr = typeof skill === 'string' ? skill : String(skill);
          return skills.some(catSkill => 
            skillStr.toLowerCase().includes(catSkill.toLowerCase()) ||
            catSkill.toLowerCase().includes(skillStr.toLowerCase())
          ) && !usedSkills.has(skillStr);
        });
        
        if (matched.length > 0) {
          matched.forEach(s => usedSkills.add(typeof s === 'string' ? s : String(s)));
          categorized.push(`**${category}** - ${matched.join(', ')}`);
        }
      });

      // Add remaining uncategorized skills to "Tools & Others" if it exists, otherwise create it
      const uncategorized = enhancedSkills.filter(s => {
        const skillStr = typeof s === 'string' ? s : String(s);
        return !usedSkills.has(skillStr);
      });
      if (uncategorized.length > 0) {
        // Check if "Tools & Others" category already exists
        const toolsOthersIndex = categorized.findIndex(cat => cat.includes('Tools & Others'));
        if (toolsOthersIndex >= 0) {
          // Append to existing "Tools & Others" category
          const existing = categorized[toolsOthersIndex];
          const match = existing.match(/\*\*Tools & Others\*\*\s*-\s*(.*)/);
          if (match) {
            categorized[toolsOthersIndex] = `**Tools & Others** - ${match[1]}, ${uncategorized.join(', ')}`;
          }
        } else {
          // Create "Tools & Others" category
          categorized.push(`**Tools & Others** - ${uncategorized.join(', ')}`);
        }
      }

      enhancedSkills = categorized.length > 0 ? categorized : enhancedSkills;
    }

    // Keep professional summary as paragraph (do NOT convert to bullet points)
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

    // Convert work experience descriptions to bullet points
    let enhancedWorkExperience = formData.workExperience ? [...formData.workExperience] : [];
    enhancedWorkExperience = enhancedWorkExperience.map(exp => {
      if (exp.description) {
        const sentences = exp.description.split(/[.!?\n]+/).filter(s => s.trim().length > 0);
        if (sentences.length > 0) {
          let bullets = sentences.map(s => `• ${s.trim()}`).join('\n');
          // Ensure minimum 5 bullet points
          if (sentences.length < 5) {
            const additional = [
              '• Collaborated with cross-functional teams to deliver high-quality solutions',
              '• Implemented best practices and coding standards',
              '• Participated in code reviews and technical discussions',
            ].slice(0, 5 - sentences.length);
            bullets += '\n' + additional.join('\n');
          }
          exp.description = bullets;
        }
      }
      return exp;
    });

    // Track modified fields
    const modifiedFields = {
      professionalSummary: currentSummary !== enhancedSummary,
      skills: JSON.stringify(formData.skills) !== JSON.stringify(enhancedSkills),
      workExperience: JSON.stringify(formData.workExperience) !== JSON.stringify(enhancedWorkExperience),
    };

    // Update form data
    setFormData({
      ...formData,
      professionalSummary: enhancedSummary,
      skills: enhancedSkills,
      workExperience: enhancedWorkExperience,
    });

    // Track AI modifications
    setAiModifiedFields(modifiedFields);

    showSnackbar(
      "Resume enhanced with ATS keywords! Changes are highlighted in preview.",
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

  const handleDownload = async () => {
    try {
      showSnackbar("Generating PDF...", "info");
      
      // Dynamically import jsPDF and html2canvas
      const jsPDFModule = await import('jspdf');
      const html2canvasModule = await import('html2canvas');
      const jsPDF = jsPDFModule.default;
      const html2canvas = html2canvasModule.default;
      
      const resumeContent = generateResumeHTML();
      const nameParts = [
        formData.firstName,
        formData.middleName,
        formData.lastName,
      ].filter(Boolean);
      const fileName = nameParts.join("_").trim() || "Resume";

      // Create a temporary container (off-screen but visible for html2canvas)
      const element = document.createElement('div');
      element.style.width = '210mm';
      element.style.margin = '0 auto';
      element.style.padding = '24px';
      element.style.backgroundColor = 'white';
      element.style.fontFamily = 'Arial, sans-serif';
      element.style.position = 'absolute';
      element.style.left = '-9999px';
      element.style.top = '0';
      element.style.overflow = 'visible';
      element.innerHTML = resumeContent;
      
      // Apply styles matching preview
      const style = document.createElement('style');
      style.textContent = `
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Arial', sans-serif;
          color: #333;
          background: white;
        }
        .header {
          margin-bottom: 40px;
          text-align: center;
        }
        .header h1 {
          font-size: 24px;
          line-height: normal;
          font-weight: 700;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: #1a1a1a;
          margin-bottom: 4px;
        }
        .designation {
          font-size: 16px;
          line-height: 1.8;
          font-weight: 400;
          color: #666;
          margin-bottom: 4px;
          text-align: center;
        }
        .contact-info {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          font-size: 12px;
          color: #666;
          justify-content: center;
          margin-top: 8px;
          align-items: center;
        }
        .contact-link {
          color: #666;
          text-decoration: none;
        }
        .section {
          margin-bottom: 24px;
          page-break-inside: avoid;
        }
        .section-title {
          font-size: 18px;
          line-height: 1.8;
          font-weight: 500;
          letter-spacing: 2px;
          margin-bottom: 15px;
          color: #1a1a1a;
          border-bottom: 1px solid #333;
          padding-bottom: 3px;
        }
        .experience-item, .education-item, .cert-item, .project-item {
          margin-bottom: 16px;
          padding-left: 8px;
        }
        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 4px;
          flex-wrap: wrap;
          gap: 8px;
        }
        .item-title {
          font-size: 16px;
          line-height: 1.8;
          font-weight: 400;
          margin-bottom: 4px;
          color: #1a1a1a;
        }
        .item-date {
          font-size: 12px;
          line-height: 1.8;
          color: #666;
          white-space: nowrap;
        }
        .item-company, .item-location {
          font-size: 12px;
          line-height: 1.8;
          color: #555;
          margin-bottom: 2px;
        }
        .item-description {
          font-size: 12px;
          line-height: 1.8;
          margin-top: 8px;
          text-align: justify;
          white-space: pre-line;
        }
        .item-description ul {
          margin: 0;
          padding-left: 20px;
          margin-top: 8px;
        }
        .item-description li {
          margin-bottom: 4px;
          font-size: 12px;
          line-height: 1.8;
        }
        .skills-list, .languages-list {
          font-size: 12px;
          line-height: 1.8;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .skills-list > div, .languages-list > div {
          margin: 0;
        }
        .summary {
          font-size: 12px;
          line-height: 1.8;
          text-align: justify;
          white-space: pre-line;
          margin-top: 8px;
        }
        .project-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          color: #1976d2;
          text-decoration: none;
        }
      `;
      element.appendChild(style);
      
      // Append to body temporarily
      document.body.appendChild(element);
      
      // Wait a bit for styles to apply and ensure proper rendering
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Force a reflow to ensure all styles are applied
      element.offsetHeight;
      
      // Convert to canvas with better quality settings
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: element.scrollWidth,
        height: element.scrollHeight,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        allowTaint: true,
        removeContainer: false,
      });
      
      // Remove element from DOM
      document.body.removeChild(element);
      
      // Calculate PDF dimensions - auto-increase height based on content
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      
      // Calculate actual content height
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png', 1.0);
      
      // Handle multiple pages if content is longer than one page
      let heightLeft = imgHeight;
      let position = 0;
      
      // Add first page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      // Add additional pages if needed (auto-increase height)
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      // Save PDF
      pdf.save(`${fileName}.pdf`);
      
      showSnackbar("PDF downloaded successfully!", "success");
    } catch (error) {
      console.error("Error generating PDF:", error);
      showSnackbar("Failed to generate PDF. Please try again.", "error");
    }
  };

  const generateResumeHTML = () => {
    const nameParts = [
      formData.firstName,
      formData.middleName,
      formData.lastName,
    ].filter(Boolean);
    const fullName = nameParts.join(" ").trim() || "Your Name";
    const contactInfo = [];

    const contactInfoItems = [];
    if (formData.email) contactInfoItems.push(`Email: ${formData.email}`);
    if (formData.phone) contactInfoItems.push(`Phone: ${formData.phone}`);
    if (formData.address) {
      const addressParts = [
        formData.address,
        formData.city,
        formData.state,
        formData.zipCode,
        formData.country,
      ].filter(Boolean);
      if (addressParts.length > 0)
        contactInfoItems.push(`Address: ${addressParts.join(", ")}`);
    }
    
    const contactLinks = [];
    if (formData.linkedIn) contactLinks.push(`<span>LinkedIn: <a href="${formData.linkedIn}" class="contact-link">${formData.linkedIn}</a></span>`);
    if (formData.portfolio) contactLinks.push(`<span>Portfolio: <a href="${formData.portfolio}" class="contact-link">${formData.portfolio}</a></span>`);
    if (formData.github) contactLinks.push(`<span>GitHub: <a href="${formData.github}" class="contact-link">${formData.github}</a></span>`);
    
    const allContactInfo = [...contactInfoItems.map(item => `<span>${item}</span>`), ...contactLinks];

    let html = `
      <div class="header">
        <h1>${fullName}</h1>
        ${formData.designation ? `<div class="designation">${formData.designation}</div>` : ''}
        ${allContactInfo.length > 0 ? `<div class="contact-info">${allContactInfo.join('')}</div>` : ''}
      </div>
    `;

    // Professional Summary
    if (formData.professionalSummary) {
      const summaryHtml = formData.professionalSummary.replace(/\n/g, '<br>');
      html += `
        <div class="section">
          <div class="section-title">Professional Summary</div>
          <div class="summary">${summaryHtml}</div>
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
              <div style="flex: 1;">
                <div class="item-title">${exp.jobTitle || ""}</div>
                <div class="item-company">${[exp.company, exp.location].filter(Boolean).join(", ")}</div>
              </div>
              <div class="item-date">${startDate} - ${endDate}</div>
            </div>
            ${
              exp.description
                ? (() => {
                    const lines = exp.description.split('\n').filter(line => line.trim());
                    const hasBullets = lines.some(line => line.trim().startsWith('•'));
                    if (hasBullets) {
                      const listItems = lines
                        .filter(line => line.trim().startsWith('•'))
                        .map(line => `<li>${line.trim().substring(1).trim()}</li>`)
                        .join('');
                      return `<div class="item-description"><ul>${listItems}</ul></div>`;
                    } else {
                      return `<div class="item-description">${exp.description.replace(/\n/g, '<br>')}</div>`;
                    }
                  })()
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
              <div style="flex: 1;">
                <div class="item-title" style="margin-bottom: 4px;">${edu.degree || ""}${
          edu.field ? ` in ${edu.field}` : ""
        }</div>
                <div class="item-company" style="margin-bottom: 2px;">${[edu.institution, edu.location].filter(Boolean).join(", ")}</div>
                ${
                  edu.gpa
                    ? `<div class="item-location">GPA: ${edu.gpa}</div>`
                    : ""
                }
              </div>
              <div class="item-date">${startDate} - ${endDate}</div>
            </div>
            ${
              edu.summary
                ? `<div class="summary">${edu.summary.replace(/\n/g, '<br>')}</div>`
                : ""
            }
          </div>
        `;
      });
      html += `</div>`;
    }

    // Skills
    if (formData.skills && Array.isArray(formData.skills) && formData.skills.length > 0) {
      const isCategorized = formData.skills.some(s => typeof s === 'string' && s.includes('**'));
      let skillsHtml = '';
      
      if (isCategorized) {
        // Categorized skills format
        skillsHtml = formData.skills
          .map(skill => {
            const skillStr = typeof skill === 'string' ? skill : String(skill);
            // Parse **Category** - skills format
            const match = skillStr.match(/\*\*(.*?)\*\*\s*-\s*(.*)/);
            if (match) {
              const [, category, skills] = match;
              return `<div><strong>${category}</strong> - ${skills}</div>`;
            }
            return `<div>${skillStr}</div>`;
          })
          .join('');
      } else {
        // Regular comma-separated skills - match preview format with commas
        skillsHtml = formData.skills.map(skill => `<div>${String(skill).trim()},</div>`).join('');
      }
      
      html += `
        <div class="section">
          <div class="section-title">Skills</div>
          <div class="skills-list">${skillsHtml}</div>
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
              <div style="flex: 1;">
                <div class="item-title" style="margin-bottom: 4px;">${cert.name || ""}</div>
                <div class="item-company" style="margin-bottom: 2px;">${cert.organization || ""}</div>
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
            ${
              cert.summary
                ? `<div class="summary">${cert.summary.replace(/\n/g, '<br>')}</div>`
                : ""
            }
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
              <div style="flex: 1;">
                <div class="item-title" style="margin-bottom: 4px;">
                  ${project.url ? `<a href="${project.url}" target="_blank" class="project-link">${project.name || ""} 🔗</a>` : (project.name || "")}
                </div>
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
                ? `<div class="item-description">${project.description.replace(/\n/g, '<br>')}</div>`
                : ""
            }
          </div>
        `;
      });
      html += `</div>`;
    }

    // Languages
    if (formData.languages && Array.isArray(formData.languages) && formData.languages.length > 0) {
      const languagesHtml = formData.languages.map(lang => `<div>${String(lang).trim()},</div>`).join('');
      html += `
        <div class="section">
          <div class="section-title">Languages</div>
          <div class="languages-list">${languagesHtml}</div>
        </div>
      `;
    }

    return html;
  };

  const loadSampleData = () => {
    const sampleData = {
      // Personal Information
      firstName: "John",
      middleName: "Michael",
      lastName: "Doe",
      designation: "Senior Software Engineer",
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
            "Led development of microservices architecture serving 100K+ daily active users, improving system scalability and performance by 40%.\nImplemented CI/CD pipelines using Jenkins and Docker, reducing deployment time by 60% and increasing deployment frequency.\nMentored a team of 5 junior developers, conducting code reviews and providing technical guidance on best practices.\nCollaborated with product managers and designers to deliver 15+ features on time, resulting in 25% increase in user engagement.\nOptimized database queries and implemented caching strategies, reducing API response times by 50% and improving overall application performance.",
        },
        {
          jobTitle: "Full Stack Developer",
          company: "Digital Innovations LLC",
          startDate: "2019-06",
          endDate: "2021-02",
          location: "San Francisco, CA",
          description:
            "Developed and maintained 8+ client-facing web applications using React, Node.js, and PostgreSQL, serving over 50K monthly active users.\nCollaborated with cross-functional teams including designers, product managers, and QA engineers to deliver features on time and within budget.\nOptimized database queries and implemented indexing strategies, improving page load times by 40% and reducing server costs by 30%.\nImplemented RESTful APIs and integrated third-party services including payment gateways and authentication providers.\nParticipated in agile development processes, including daily standups, sprint planning, and retrospectives, contributing to team velocity improvements.",
        },
        {
          jobTitle: "Junior Web Developer",
          company: "StartupXYZ",
          startDate: "2018-01",
          endDate: "2019-05",
          location: "San Francisco, CA",
          description:
            "Built responsive web applications using HTML, CSS, JavaScript, and React, ensuring cross-browser compatibility and mobile responsiveness.\nFixed 100+ bugs and implemented new features based on user feedback, improving user satisfaction scores by 35%.\nParticipated in daily standups and sprint planning meetings, contributing to team discussions and providing status updates.\nLearned and applied modern web development practices including version control with Git, code reviews, and testing methodologies.\nAssisted senior developers in implementing complex features and troubleshooting production issues, gaining valuable hands-on experience.",
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
          summary: "Graduated Magna Cum Laude with a focus on software engineering and algorithms. Completed senior capstone project on distributed systems, earning recognition from faculty. Active member of Computer Science Student Association, organizing tech talks and hackathons.",
        },
      ],

      // Skills
      skills: [
        "JavaScript",
        "TypeScript",
        "React",
        "Node.js",
        "Express.js",
        "MongoDB",
        "PostgreSQL",
        "AWS",
        "Docker",
        "Kubernetes",
        "Git",
        "REST APIs",
        "GraphQL",
        "Agile",
        "Scrum",
        "CI/CD",
        "Microservices",
        "System Design"
      ],

      // Certifications
      certifications: [
        {
          name: "AWS Certified Solutions Architect",
          organization: "Amazon Web Services",
          issueDate: "2022-06",
          expirationDate: "2025-06",
          credentialId: "AWS-ASA-12345",
          summary: "Demonstrated expertise in designing and deploying scalable, highly available systems on AWS. Proficient in EC2, S3, RDS, Lambda, and CloudFormation. Successfully architected cloud solutions for enterprise applications serving millions of users.",
        },
        {
          name: "MongoDB Certified Developer",
          organization: "MongoDB University",
          issueDate: "2021-09",
          expirationDate: "",
          credentialId: "MDB-DEV-67890",
          summary: "Validated skills in MongoDB database design, query optimization, and aggregation pipelines. Experienced in sharding, replication, and performance tuning for high-traffic applications. Implemented efficient data models for real-time applications.",
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
      languages: [
        "English (Native)",
        "Spanish (Conversational)",
        "French (Basic)"
      ],
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
      <Box className=" page-content">
      <Box className=" section" mt={2}>
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
                    <Box className="textfield auto-complete">
                      <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Summary"
                      name="professionalSummary"
                      value={formData.professionalSummary}
                      onChange={handleChange}
                      placeholder="Write a brief summary of your professional background and key achievements..."
                      sx={{ mt: 2 }}
                      />
                    </Box>
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
                              <Box className="textfield auto-complete">
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
                              </Box>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <Box className="textfield auto-complete">
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
                                  handleArrayChange(
                                    "workExperience",
                                    index,
                                    "startDate",
                                    e.target.value
                                  )
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
                                  handleArrayChange(
                                    "workExperience",
                                    index,
                                    "endDate",
                                    e.target.value
                                  )
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
                                  handleArrayChange(
                                    "workExperience",
                                    index,
                                    "location",
                                    e.target.value
                                  )
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
                                  handleArrayChange(
                                    "workExperience",
                                    index,
                                    "description",
                                    e.target.value
                                  )
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
                              <Box className="textfield auto-complete">     
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
                              </Box>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <Box className="textfield auto-complete">
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
                              </Box>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <Box className="textfield auto-complete">
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
                              </Box>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <Box className="textfield auto-complete">
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
                                  handleArrayChange(
                                    "education",
                                    index,
                                    "startDate",
                                    e.target.value
                                  )
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
                                  handleArrayChange(
                                    "education",
                                    index,
                                    "endDate",
                                    e.target.value
                                  )
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
                                  handleArrayChange(
                                    "education",
                                    index,
                                    "gpa",
                                    e.target.value
                                  )
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
                                  handleArrayChange(
                                    "education",
                                    index,
                                    "summary",
                                    e.target.value
                                  )
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
                    <Box sx={{ mt: 2 }}>
                      {/* Add new skill input */}
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
                      
                      {/* Display existing skills as chips */}
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
                              <Box className="textfield auto-complete">
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
                              </Box>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <Box className="textfield auto-complete">
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
                                  handleArrayChange(
                                    "certifications",
                                    index,
                                    "issueDate",
                                    e.target.value
                                  )
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
                                  handleArrayChange(
                                    "certifications",
                                    index,
                                    "expirationDate",
                                    e.target.value
                                  )
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
                                  handleArrayChange(
                                    "certifications",
                                    index,
                                    "credentialId",
                                    e.target.value
                                  )
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
                                  handleArrayChange(
                                    "certifications",
                                    index,
                                    "summary",
                                    e.target.value
                                  )
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
                              <Box className="textfield auto-complete">
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
                              </Box>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <Box className="textfield auto-complete">
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
                              </Box>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                              <Box className="textfield auto-complete">
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
                                  handleArrayChange(
                                    "projects",
                                    index,
                                    "date",
                                    e.target.value
                                  )
                                }
                              />
                              </Box>
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                              <Box className="textfield auto-complete">
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
                    <Box sx={{ mt: 2 }}>
                      {/* Add new language input */}
                      <Box className="textfield auto-complete" sx={{ mb: 2 }}>
                        <TextField
                          fullWidth
                          label="Add Language"
                          placeholder="e.g., English (Fluent), Spanish (Conversational)"
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              const value = e.target.value.trim();
                              if (value) {
                                handleAddLanguage(value);
                                e.target.value = "";
                              }
                            }
                          }}
                          size="small"
                        />
                      </Box>
                      
                      {/* Display existing languages as chips */}
                      {formData.languages && formData.languages.length > 0 && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {formData.languages.map((language, index) => (
                            <Chip
                              key={index}
                              label={language}
                              onDelete={() => handleRemoveLanguage(index)}
                              color="secondary"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      )}
                    </Box>
                  </Collapse>
                </CardContent>
              </Card>
            </Grid>

            {/* Right Column - Tips/Preview */}
            <Grid size={{ xs: 12, lg: 4 }}>
              <Card 
                className="whitebx" 
                sx={{ 
                  position: "sticky", 
                  top: 20,
                  maxHeight: 'calc(100vh - 40px)',
                  overflowY: 'auto',
                }}
              >
                <CardContent>
                  <Typography variant="h6" className="fw6" gutterBottom>
                    Resume Tips
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Box component="ul" sx={{ pl: 2, m: 0 }}>
                    <Typography component="li" variant="body2" sx={{ mb: 1.5, lineHeight: 1.6 }}>
                      Keep your professional summary concise (2-3 sentences) and impactful
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1.5, lineHeight: 1.6 }}>
                      Use action verbs (e.g., "Led", "Developed", "Implemented") in work experience
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1.5, lineHeight: 1.6 }}>
                      Quantify achievements with numbers, percentages, or metrics when possible
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1.5, lineHeight: 1.6 }}>
                      Tailor your resume to match specific job requirements and keywords
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1.5, lineHeight: 1.6 }}>
                      Use bullet points for work experience (minimum 5 per role) for better readability
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1.5, lineHeight: 1.6 }}>
                      Categorize skills by type (Frontend, Backend, Database, etc.) for ATS optimization
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1.5, lineHeight: 1.6 }}>
                      Keep formatting consistent, professional, and ATS-friendly
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1.5, lineHeight: 1.6 }}>
                      Include relevant certifications with brief summaries (2-3 lines)
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1.5, lineHeight: 1.6 }}>
                      Proofread carefully for spelling, grammar, and formatting errors
                    </Typography>
                    <Typography component="li" variant="body2" sx={{ mb: 1.5, lineHeight: 1.6 }}>
                      Use the AI Suggest feature to enhance your resume with ATS keywords
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
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
