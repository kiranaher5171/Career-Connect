"use client";
import React, { useState, useCallback, useEffect } from "react";
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
  Snackbar,
  Alert,
} from "@mui/material";
import { IoIosCloseCircleOutline } from "react-icons/io";
import DownloadIcon from "@mui/icons-material/Download";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";

// Google Fonts URL for Poppins and Outfit
const GOOGLE_FONTS_URL = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Outfit:wght@400;500;600;700&display=swap';

/**
 * Loads Google Fonts dynamically
 */
const loadGoogleFonts = () => {
  if (typeof document !== 'undefined') {
    const linkId = 'resume-google-fonts';
    if (!document.getElementById(linkId)) {
      const link = document.createElement('link');
      link.id = linkId;
      link.rel = 'stylesheet';
      link.href = GOOGLE_FONTS_URL;
      document.head.appendChild(link);
    }
  }
};

// Constants - same as email-template for consistency
const PDF_CONFIG = {
  marginTop: 15,
  marginBottom: 15,
  marginLeft: 15,
  marginRight: 15,
  pageWidth: 210, // A4 width in mm
  pageHeight: 297, // A4 height in mm
};

const PX_TO_MM = 0.264583; // 1px = 0.264583mm at 96dpi
const CANVAS_SCALE = 2; // html2canvas scale factor
const RENDER_DELAY = 200; // ms delay for rendering

/**
 * Prepares the element for PDF generation
 */
const prepareElementForCapture = (element) => {
  element.style.height = "fit-content";
  element.style.overflow = "visible";
  element.style.maxHeight = "none";

  // Force reflow
  element.offsetHeight;

  // Fix child elements
  const childElements = element.querySelectorAll(
    "div, section, article, table, td, tr"
  );
  childElements.forEach((el) => {
    el.style.height = "fit-content";
    el.style.overflow = "visible";
    el.style.maxHeight = "none";
  });
};

/**
 * Creates a canvas slice for a specific page
 */
const createPageCanvas = (sourceCanvas, sourceY, sourceHeight) => {
  const pageCanvas = document.createElement("canvas");
  pageCanvas.width = sourceCanvas.width;
  pageCanvas.height = Math.ceil(sourceHeight);
  const pageCtx = pageCanvas.getContext("2d");

  // Fill with white background
  pageCtx.fillStyle = "#ffffff";
  pageCtx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);

  // Extract the slice from original canvas
  pageCtx.drawImage(
    sourceCanvas,
    0,
    sourceY,
    sourceCanvas.width,
    sourceHeight,
    0,
    0,
    sourceCanvas.width,
    sourceHeight
  );

  return pageCanvas.toDataURL("image/png", 1.0);
};

/**
 * Splits canvas across multiple PDF pages - ensures ALL content is captured
 */
const splitCanvasToPages = (canvas, pdf, scaleFactor) => {
  const { marginTop, marginLeft, marginRight, pageWidth, pageHeight } =
    PDF_CONFIG;
  const availableWidth = pageWidth - marginLeft - marginRight;
  const availableHeight = pageHeight - marginTop - PDF_CONFIG.marginBottom;

  // Convert canvas dimensions to mm
  const actualWidthPx = canvas.width / CANVAS_SCALE;
  const actualHeightPx = canvas.height / CANVAS_SCALE;

  const widthMm = actualWidthPx * PX_TO_MM;
  const heightMm = actualHeightPx * PX_TO_MM;

  // Scale to fit width while maintaining aspect ratio
  const scale = availableWidth / widthMm;
  const scaledWidth = availableWidth;
  const scaledHeight = heightMm * scale;

  const xOffset = marginLeft;
  let sourceY = 0; // Track position in canvas pixels directly
  let pageNumber = 0;
  const MAX_PAGES = 100; // Safety limit

  // Process pages until we've captured the entire canvas
  // Add small overlap to prevent cutting content in the middle
  const pageOverlap = Math.floor((5 / scale / PX_TO_MM) * CANVAS_SCALE); // 5mm overlap in canvas pixels

  while (sourceY < canvas.height && pageNumber < MAX_PAGES) {
    if (pageNumber > 0) {
      pdf.addPage();
      // Start new page with small overlap from previous page to ensure smooth transition
      sourceY = Math.max(0, sourceY - pageOverlap);
    }

    // Calculate remaining canvas pixels
    const remainingCanvasPixels = canvas.height - sourceY;

    // Calculate how many canvas pixels fit in one page (with some margin for rounding)
    const canvasPixelsPerPage = Math.floor(
      (availableHeight / scale / PX_TO_MM) * CANVAS_SCALE
    );

    // Determine if this is the last page - be more generous with tolerance
    // If remaining is less than 1.2x the page capacity, treat as last page
    const isLastPage = remainingCanvasPixels <= canvasPixelsPerPage * 1.2;

    let sourceHeight;
    let pageImageHeight;

    if (isLastPage) {
      // Last page - capture ALL remaining pixels from canvas, no matter how much
      sourceHeight = remainingCanvasPixels;
      // Convert back to mm for PDF display
      pageImageHeight = (sourceHeight / CANVAS_SCALE) * PX_TO_MM * scale;

      // Ensure the last page doesn't exceed available height too much
      // If it does, we'll still capture it but might need to adjust display
      if (pageImageHeight > availableHeight * 1.5) {
        // If it's way too big, scale it down but still capture all pixels
        pageImageHeight = availableHeight * 1.2; // Allow 20% overflow
      }
    } else {
      // Regular page - use calculated pixels per page (add overlap for next page)
      sourceHeight = canvasPixelsPerPage + pageOverlap;
      pageImageHeight = availableHeight;
    }

    // Final safety check - ensure we don't exceed canvas bounds
    sourceHeight = Math.min(sourceHeight, canvas.height - sourceY);

    // Validation
    if (sourceY >= canvas.height || sourceHeight <= 0) {
      break;
    }

    // Create page canvas and add to PDF
    const pageImgData = createPageCanvas(canvas, sourceY, sourceHeight);

    // For the last page, use the actual calculated height
    const displayHeight = isLastPage
      ? (sourceHeight / CANVAS_SCALE) * PX_TO_MM * scale
      : pageImageHeight;

    pdf.addImage(
      pageImgData,
      "PNG",
      xOffset,
      marginTop,
      scaledWidth,
      displayHeight
    );

    // Move to next position in canvas pixels (subtract overlap for next iteration)
    if (!isLastPage) {
      sourceY += canvasPixelsPerPage; // Move forward by page height, not including overlap
    } else {
      sourceY += sourceHeight; // Last page, move by full height
    }
    pageNumber++;

    // Safety check - if we've processed all canvas content, we're done
    if (sourceY >= canvas.height) {
      break;
    }

    // Additional check: if remaining pixels are very small, capture them anyway
    const finalRemaining = canvas.height - sourceY;
    if (finalRemaining > 0 && finalRemaining < 50) {
      // Less than 50 pixels remaining
      // Add one more page to capture the remaining content
      pdf.addPage();
      const finalPageImgData = createPageCanvas(
        canvas,
        sourceY,
        finalRemaining
      );
      const finalPageHeight =
        (finalRemaining / CANVAS_SCALE) * PX_TO_MM * scale;
      pdf.addImage(
        finalPageImgData,
        "PNG",
        xOffset,
        marginTop,
        scaledWidth,
        finalPageHeight
      );
      break;
    }
  }
};

const ResumeSection = ({ title, children }) => (
  <Box mb={3}>
    <Typography className="resume-heading" gutterBottom>
      {title}
    </Typography>
    <Box>{children}</Box>
  </Box>
);

const ResumePreview = ({
  open,
  onClose,
  formData,
  onAISuggest,
  onDownload,
  aiModifiedFields = {},
  isAILoading = false,
  hideDialog = false,
  hideAISuggest = false,
}) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [isGenerating, setIsGenerating] = useState(false);

  // Load Google Fonts on component mount
  useEffect(() => {
    loadGoogleFonts();
  }, []);

  /**
   * Shows snackbar notification
   */
  const showSnackbar = useCallback((message, severity) => {
    setSnackbar({ open: true, message, severity });
  }, []);

  /**
   * Closes snackbar
   */
  const handleCloseSnackbar = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  /**
   * Handles PDF download - captures the content from dialog
   */
  const handleDownloadPDF = useCallback(async () => {
    if (isGenerating) return; // Prevent multiple simultaneous downloads

    try {
      setIsGenerating(true);
      showSnackbar("Generating PDF...", "info");

      // Dynamic imports for better code splitting
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import("jspdf"),
        import("html2canvas"),
      ]);

      // Find the content element in the dialog
      const contentElement = document.getElementById("resume-content-table");
      if (!contentElement) {
        throw new Error("Content element not found");
      }

      // Create a wrapper element for PDF generation
      const element = document.createElement("div");
      element.id = "resume-pdf-content";
      element.style.width = "800px";
      element.style.margin = "0 auto";
      // element.style.padding = "0px 30px";
      // element.style.backgroundColor = "#f4f4f4";
      element.style.fontFamily = "'Poppins', 'Outfit', sans-serif";
      
      // Ensure fonts are loaded for PDF
      const fontLink = document.createElement('link');
      fontLink.rel = 'stylesheet';
      fontLink.href = GOOGLE_FONTS_URL;
      document.head.appendChild(fontLink);
      element.style.position = "absolute";
      element.style.left = "-9999px";
      element.style.top = "0";
      element.style.overflow = "visible";
      element.style.height = "fit-content";

      // Clone the table content
      const clonedTable = contentElement.cloneNode(true);
      element.appendChild(clonedTable);

      document.body.appendChild(element);

      // Wait for fonts to load and rendering
      await new Promise((resolve) => setTimeout(resolve, RENDER_DELAY));
      
      // Additional delay to ensure fonts are fully loaded
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Prepare element for capture
      prepareElementForCapture(element);
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Convert to canvas - ensure full height is captured
      const canvas = await html2canvas(element, {
        scale: CANVAS_SCALE,
        useCORS: true,
        logging: false,
        // backgroundColor: "#f4f4f4",
        width: element.scrollWidth,
        height: element.scrollHeight,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        allowTaint: true,
        removeContainer: false,
        scrollX: 0,
        scrollY: 0,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById("resume-pdf-content");
          if (clonedElement) {
            prepareElementForCapture(clonedElement);
            // Ensure all content is visible in cloned document
            clonedElement.scrollHeight; // Force measurement
          }
        },
      });

      // Verify canvas captured full content
      const expectedHeight = element.scrollHeight * CANVAS_SCALE;
      if (canvas.height < expectedHeight * 0.9) {
        console.warn(
          "Canvas height may be incomplete. Expected:",
          expectedHeight,
          "Got:",
          canvas.height
        );
      }

      // Clean up temporary element
      document.body.removeChild(element);

      // Create PDF and split across pages
      const pdf = new jsPDF("p", "mm", "a4");
      const {
        marginLeft,
        marginRight,
        marginTop,
        marginBottom,
        pageWidth,
        pageHeight,
      } = PDF_CONFIG;
      const availableWidth = pageWidth - marginLeft - marginRight;
      const availableHeight = pageHeight - marginTop - marginBottom;
      const actualWidthPx = canvas.width / CANVAS_SCALE;
      const actualHeightPx = canvas.height / CANVAS_SCALE;
      const widthMm = actualWidthPx * PX_TO_MM;
      const heightMm = actualHeightPx * PX_TO_MM;

      // Calculate scale to fit width
      const scaleFactor = availableWidth / widthMm;
      const scaledHeight = heightMm * scaleFactor;

      // Try to fit on single page first if content is not too large
      if (scaledHeight <= availableHeight * 1.1) {
        // Content fits on one page (with 10% tolerance)
        const imgData = canvas.toDataURL("image/png", 1.0);
        pdf.addImage(
          imgData,
          "PNG",
          marginLeft,
          marginTop,
          availableWidth,
          scaledHeight
        );
      } else {
        // Content is too large, split across pages
        splitCanvasToPages(canvas, pdf, scaleFactor);
      }

      // Save PDF
      pdf.save("Resume-Preview.pdf");
      showSnackbar("PDF downloaded successfully!", "success");
    } catch (error) {
      console.error("Error generating PDF:", error);
      showSnackbar(
        error.message || "Failed to generate PDF. Please try again.",
        "error"
      );
    } finally {
      setIsGenerating(false);
    }
  }, [isGenerating, showSnackbar]);

  // Early return after all hooks are called
  if (!open && !hideDialog) return null;
  const formatDate = (dateString) => {
    if (!dateString) return "Present";
    const date = new Date(dateString + "-01");
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const nameParts = [
    formData.firstName || "",
    formData.middleName || "",
    formData.lastName || "",
  ].filter(Boolean);
  const fullName = nameParts.join(" ").trim() || "Your Name";

  const contactInfo = [];
  if (formData.email)
    contactInfo.push({ type: "text", label: "Email", value: formData.email });
  if (formData.phone)
    contactInfo.push({ type: "text", label: "Phone", value: formData.phone });
  if (formData.address) {
    const addressParts = [
      formData.address,
      formData.city,
      formData.state,
      formData.zipCode,
      formData.country,
    ].filter(Boolean);
    if (addressParts.length > 0)
      contactInfo.push({
        type: "text",
        label: "Address",
        value: addressParts.join(", "),
      });
  }
  if (formData.linkedIn)
    contactInfo.push({
      type: "link",
      label: "LinkedIn",
      value: formData.linkedIn,
      url: formData.linkedIn,
    });
  if (formData.portfolio)
    contactInfo.push({
      type: "link",
      label: "Portfolio",
      value: formData.portfolio,
      url: formData.portfolio,
    });
  if (formData.github)
    contactInfo.push({
      type: "link",
      label: "GitHub",
      value: formData.github,
      url: formData.github,
    });

  // Helper function to render multi-line text with proper line breaks
  const renderMultiLineText = (text) => {
    if (!text) return null;
    return text.split("\n").map((line, idx) => (
      <React.Fragment key={idx}>
        {line}
        {idx < text.split("\n").length - 1 && <br />}
      </React.Fragment>
    ));
  };

  // Helper function to render bullet points
  const renderBulletPoints = (text) => {
    if (!text) return null;
    const lines = text.split("\n").filter((line) => line.trim());
    const hasBullets = lines.some((line) => line.trim().startsWith("•"));

    if (hasBullets) {
      return (
        <ul
          style={{
            margin: "6px 0",
            paddingLeft: "20px",
            listStyleType: "disc",
          }}
        >
          {lines
            .filter((line) => line.trim().startsWith("•"))
            .map((line, idx) => (
              <li
                key={idx}
                style={{
                  marginBottom: "3px",
                  color: "#5b5b5b",
                  fontSize: "15px",
                  lineHeight: "1.6",
                  paddingLeft: "4px",
                }}
              >
                {line.trim().substring(1).trim()}
              </li>
            ))}
        </ul>
      );
    }
    return (
      <p
        style={{
          color: "#5b5b5b", 
          fontSize: "14px", 
          lineHeight: "1.8",    
          fontWeight:"400", 
          letterSpacing:"0.5px",
          textAlign: "justify", 
          letterSpacing:"1px",
          whiteSpace: "pre-line",
        }}
      >
        {text}
      </p>
    );
  };

  const resumeContent = (
    <table
      id="resume-content-table"
      role="presentation"
      cellSpacing="0"
      cellPadding="0"
      border="0"
      style={{ 
        width: "100%",
        fontFamily: "'Poppins', 'Outfit', sans-serif",
      }}
    >
      <tbody>
        <tr>
          <td >
            {/* Header Section */}
            <div style={{ marginBottom: "30px", textAlign: "center" }}>
              <p
                style={{
                  color: "#000",
                  fontSize: "27px",
                  lineHeight: "1.2", 
                  fontWeight: 600,
                  letterSpacing: "5px",
                  textTransform:"uppercase",
                  paddingBottom:"6px",
                }}
              >
                {fullName.toUpperCase()}
              </p>
              {formData.designation && (
                <p
                  style={{
                    color: "#09234F",
                    fontSize: "17px",
                    lineHeight: "1.4", 
                    letterSpacing: "2px",
                    fontWeight: 400,
                    paddingBottom:"15px",
                  }}
                >
                  {formData.designation}
                </p>
              )}
              {contactInfo.length > 0 && (
                <div style={{ marginTop: "12px" }}>
                  
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                      color: "#5b5b5b",
                      fontSize: "13px",
                      lineHeight: "1.6",
                      fontWeight: "400",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {/* First line: Email, Phone, Address */}
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        gap: "6px",
                      }}
                    >
                      {contactInfo
                        .filter((info) => ["Email", "Phone", "Address"].includes(info.label))
                        .map((info, idx) => (
                          <span key={idx}>
                            <span style={{ fontWeight: "400" }}>{info.label}:</span>{" "}
                            {info.type === "link" ? (
                              <a
                                href={info.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  color: "#5b5b5b",
                                  fontSize: "13px",
                                  lineHeight: "1.6",
                                  fontWeight: "400",
                                  letterSpacing: "0.5px",
                                  textDecoration: "none",
                                }}
                              >
                                {info.value}
                              </a>
                            ) : (
                              <span>{info.value}</span>
                            )}
                          </span>
                        ))}
                    </div>
                    {/* Second line: LinkedIn, Portfolio, GitHub */}
                    <div
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        gap: "16px",
                      }}
                    >
                      {contactInfo
                        .filter((info) => ["LinkedIn", "Portfolio", "GitHub"].includes(info.label))
                        .map((info, idx) => (
                          <span key={idx}>
                            <span style={{ fontWeight: "400" }}>{info.label}:</span>{" "}
                            {info.type === "link" ? (
                              <a
                                href={info.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  color: "#5b5b5b",
                                  fontSize: "13px",
                                  lineHeight: "1.6",
                                  fontWeight: "400",
                                  letterSpacing: "0.5px",
                                  textDecoration: "none",
                                }}
                              >
                                {info.value}
                              </a>
                            ) : (
                              <span>{info.value}</span>
                            )}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Professional Summary */}
            {formData.professionalSummary && (
              <div style={{ marginBottom: "28px" }}>
                <h5
                  style={{
                    color: "#000",
                    fontSize: "17px",
                    lineHeight: "1.8",
                    margin: "0 0 15px 0",
                    fontWeight: 500,
                    letterSpacing: "2px",
                    borderBottom: "1px solid #5b5b5b ",
                    paddingBottom: "6px",
                  }}
                >
                  Professional Summary
                </h5>
                <p
                  style={{
                    color: "#5b5b5b", 
                    fontSize: "14px", 
                    lineHeight: "1.8",    
                    fontWeight:"400", 
                    letterSpacing:"0.5px",
                    textAlign: "justify", 
                    whiteSpace: "pre-line",
                  }}
                >
                  {formData.professionalSummary}
                </p>
              </div>
            )}

            {/* Work Experience */}
            {formData.workExperience && formData.workExperience.length > 0 && (
              <div style={{ marginBottom: "28px" }}>
                <h5
                  style={{
                    color: "#000",
                    fontSize: "17px",
                    lineHeight: "1.8",
                    margin: "0 0 15px 0",
                    fontWeight: 500,
                    letterSpacing: "2px",
                    borderBottom: "1px solid #5b5b5b ",
                    paddingBottom: "6px",
                  }}
                >
                  Work Experience
                </h5>
                {formData.workExperience.map((exp, i) => (
                  <div key={i} style={{ marginBottom: "20px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "6px",
                      }}
                    >
                      <div style={{ flex: "1" }}>
                        <p
                          style={{
                            color: "#000 !important", 
                            fontSize: "15px", 
                            lineHeight: "1.8",    
                            fontWeight:"500", 
                            letterSpacing:"1px"
                          }}
                        >
                          {exp.jobTitle || ""}
                        </p>
                        <p
                          style={{
                            color: "#5b5b5b", 
                            fontSize: "14px", 
                            lineHeight: "1.8",    
                            fontWeight:"400", 
                            letterSpacing:"0.5px",
                            textAlign: "justify", 
                            letterSpacing:"1px",
                            letterSpacing:"0.5px",
                          }}
                        >
                          {[exp.company, exp.location]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      </div>
                      <p
                        style={{
                          color: "#5b5b5b", 
                          fontSize: "14px", 
                          lineHeight: "1.8",    
                          fontWeight:"400", 
                          letterSpacing:"0.5px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                      </p>
                    </div>
                    {exp.description && (
                      <div style={{ marginTop: "8px", paddingLeft: "0" }}>
                        {renderBulletPoints(exp.description)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Education */}
            {formData.education && formData.education.length > 0 && (
              <div style={{ marginBottom: "28px" }}>
                <h5
                  style={{
                    color: "#000",
                    fontSize: "17px",
                    lineHeight: "1.8",
                    margin: "0 0 15px 0",
                    fontWeight: 500,
                    letterSpacing: "2px",
                    borderBottom: "1px solid #5b5b5b ",
                    paddingBottom: "6px",
                  }}
                >
                  Education
                </h5>
                {formData.education.map((edu, i) => (
                  <div key={i} style={{ marginBottom: "20px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "6px",
                      }}
                    >
                      <div style={{ flex: "1" }}>
                        <p
                          style={{
                            color: "#000 !important", 
                            fontSize: "15px", 
                            lineHeight: "1.8",    
                            fontWeight:"500", 
                            letterSpacing:"1px"
                          }}
                        >
                          {edu.degree || ""}
                          {edu.field ? ` in ${edu.field}` : ""}
                        </p>
                        <p
                          style={{
                            color: "#5b5b5b", 
                            fontSize: "14px", 
                            lineHeight: "1.8",    
                            fontWeight:"400", 
                            letterSpacing:"0.5px",
                          }}
                        >
                          {[edu.institution, edu.location]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                        {edu.gpa && (
                          <p
                            style={{
                              color: "#5b5b5b", 
                              fontSize: "14px", 
                              lineHeight: "1.8",    
                              fontWeight:"400", 
                              letterSpacing:"0.5px",
                            }}
                          >
                            GPA: {edu.gpa}
                          </p>
                        )}
                      </div>
                      <p
                        style={{
                          color: "#5b5b5b", 
                          fontSize: "14px", 
                          lineHeight: "1.8",    
                          fontWeight:"400", 
                          letterSpacing:"0.5px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                      </p>
                    </div>
                    {edu.summary && (
                      <p
                        style={{
                          color: "#5b5b5b", 
                          fontSize: "14px", 
                          lineHeight: "1.8",    
                          fontWeight:"400", 
                          letterSpacing:"0.5px",
                          whiteSpace: "pre-line",
                        }}
                      >
                        {edu.summary}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Skills */}
            {formData.skills && (
              <div style={{ marginBottom: "28px" }}>
                <h5
                  style={{
                    color: "#000",
                    fontSize: "17px",
                    lineHeight: "1.8",
                    margin: "0 0 15px 0",
                    fontWeight: 500,
                    letterSpacing: "2px",
                    borderBottom: "1px solid #5b5b5b ",
                    paddingBottom: "6px",
                  }}
                >
                  Skills
                </h5>
                <div
                  style={{
                    color: "#5b5b5b", 
                    fontSize: "14px", 
                    lineHeight: "1.8",    
                    fontWeight:"400", 
                    letterSpacing:"0.5px",
                  }}
                >
                  {(Array.isArray(formData.skills)
                    ? formData.skills
                    : typeof formData.skills === "string"
                    ? formData.skills.split(",")
                    : []
                  ).some(
                    (skill) => typeof skill === "string" && skill.includes("**")
                  ) ? (
                    // Categorized skills (AI enhanced)
                    <div>
                      {(Array.isArray(formData.skills)
                        ? formData.skills
                        : typeof formData.skills === "string"
                        ? formData.skills.split("|")
                        : []
                      ).map((skill, i) => {
                        const skillStr =
                          typeof skill === "string"
                            ? skill.trim()
                            : String(skill).trim();
                        if (!skillStr) return null;

                        // Parse category format: **Category** - skill1, skill2
                        const match = skillStr.match(
                          /\*\*(.*?)\*\*\s*-\s*(.*)/
                        );
                        if (match) {
                          const [, category, skills] = match;
                          return (
                            <p
                              key={i}
                              style={{ margin: "4px 0", lineHeight: "1.6" }}
                            >
                              <strong style={{ fontWeight: 600 }}>
                                {category}
                              </strong>{" "}
                              - {skills}
                            </p>
                          );
                        }
                        return (
                          <p
                            key={i}
                            style={{ margin: "4px 0", lineHeight: "1.6" }}
                          >
                            {skillStr}
                          </p>
                        );
                      })}
                    </div>
                  ) : (
                    // Regular skills (comma separated)
                    <p style={{ margin: "0", lineHeight: "1.6" }}>
                      {(Array.isArray(formData.skills)
                        ? formData.skills
                        : typeof formData.skills === "string"
                        ? formData.skills.split(",")
                        : []
                      ).map((skill, i) => (
                        <span key={i}>
                          {skill.trim()}
                          {i <
                            (Array.isArray(formData.skills)
                              ? formData.skills
                              : formData.skills.split(",")
                            ).length -
                              1 && ", "}
                        </span>
                      ))}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Certifications */}
            {formData.certifications && formData.certifications.length > 0 && (
              <div style={{ marginBottom: "28px" }}>
                <h5
                  style={{
                    color: "#000",
                    fontSize: "17px",
                    lineHeight: "1.8",
                    margin: "0 0 15px 0",
                    fontWeight: 500,
                    letterSpacing: "2px",
                    borderBottom: "1px solid #5b5b5b ",
                    paddingBottom: "6px",
                  }}
                >
                  Certifications
                </h5>
                {formData.certifications.map((cert, i) => (
                  <div key={i} style={{ marginBottom: "20px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "6px",
                      }}
                    >
                      <div style={{ flex: "1" }}>
                        <p
                          style={{
                            color: "#000 !important", 
                            fontSize: "15px", 
                            lineHeight: "1.8",    
                            fontWeight:"500", 
                            letterSpacing:"1px"
                          }}
                        >
                          {cert.name || ""}
                        </p>
                        <p
                          style={{
                            color: "#5b5b5b", 
                   fontSize: "14px", 
                   lineHeight: "1.8",    
                   fontWeight:"400", 
                   letterSpacing:"0.5px",
                          }}
                        >
                          {cert.organization || ""}
                        </p>
                        {cert.credentialId && (
                          <p
                            style={{
                              color: "#5b5b5b", 
                   fontSize: "14px", 
                   lineHeight: "1.8",    
                   fontWeight:"400", 
                   letterSpacing:"0.5px",
                            }}
                          >
                            Credential ID: {cert.credentialId}
                          </p>
                        )}
                      </div>
                      <p
                        style={{
                          color: "#5b5b5b", 
                          fontSize: "14px", 
                          lineHeight: "1.8",    
                          fontWeight:"400", 
                          letterSpacing:"0.5px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        Issued: {formatDate(cert.issueDate)}
                        {cert.expirationDate
                          ? ` | Expires: ${formatDate(cert.expirationDate)}`
                          : ""}
                      </p>
                    </div>
                    {cert.summary && (
                      <p
                        style={{
                          color: "#5b5b5b", 
                          fontSize: "14px", 
                          lineHeight: "1.8",    
                          fontWeight:"400", 
                          letterSpacing:"0.5px",
                        }}
                      >
                        {cert.summary}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Projects */}
            {formData.projects && formData.projects.length > 0 && (
              <div style={{ marginBottom: "28px" }}>
                <h5
                  style={{
                    color: "#000",
                    fontSize: "17px",
                    lineHeight: "1.8",
                    margin: "0 0 15px 0",
                    fontWeight: 500,
                    letterSpacing: "2px",
                    borderBottom: "1px solid #5b5b5b ",
                    paddingBottom: "6px",
                  }}
                >
                  Projects
                </h5>
                {formData.projects.map((project, i) => (
                  <div key={i} style={{ marginBottom: "20px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "6px",
                      }}
                    >
                      <div style={{ flex: "1" }}>
                        <p
                          style={{
                            color: "#000 !important", 
                            fontSize: "15px", 
                            lineHeight: "1.8",    
                            fontWeight:"500", 
                            letterSpacing:"1px"
                          }}
                        >
                          {project.url ? (
                            <a
                              href={project.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                color: "#000 !important", 
                                fontSize: "15px", 
                                lineHeight: "1.8",    
                                fontWeight:"500", 
                                letterSpacing:"1px",
                                gap: "4px",
                              }}
                            >
                              {project.name || ""} 🔗
                            </a>
                          ) : (
                            project.name || ""
                          )}
                        </p>
                        {project.technologies && (
                          <p
                            style={{
                              color: "#5b5b5b",
                              fontSize: "14px",
                              lineHeight: "1.8",
                              fontWeight: "400",
                              letterSpacing: "0.5px",
                            }}
                          >
                            Technologies: {project.technologies}
                          </p>
                        )}
                      </div>
                      {project.date && (
                        <p
                          style={{
                            color: "#5b5b5b", 
                   fontSize: "14px", 
                   lineHeight: "1.8",    
                   fontWeight:"400", 
                   letterSpacing:"0.5px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {formatDate(project.date)}
                        </p>
                      )}
                    </div>
                    {project.description && (
                      <p
                        style={{
                          color: "#5b5b5b",
                          fontSize: "14px",
                          lineHeight: "1.8",
                          fontWeight: "400",
                          letterSpacing: "0.5px",
                        }}
                      >
                        {project.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Languages */}
            {formData.languages && (
              <div style={{ marginBottom: "28px" }}>
                <h5
                  style={{
                    color: "#000",
                    fontSize: "17px",
                    lineHeight: "1.8",
                    margin: "0 0 15px 0",
                    fontWeight: 500,
                    letterSpacing: "2px",
                    borderBottom: "1px solid #5b5b5b ",
                    paddingBottom: "6px",
                  }}
                >
                  Languages
                </h5>
                <p
                  style={{
                    color: "#5b5b5b",
                    fontSize: "14px",
                    lineHeight: "1.8",
                    fontWeight: "400",
                    letterSpacing: "0.5px",
                  }}
                >
                  {(Array.isArray(formData.languages)
                    ? formData.languages
                    : typeof formData.languages === "string"
                    ? formData.languages.split(",")
                    : []
                  ).map((lang, i, arr) => (
                    <span key={i}>
                      {lang.trim()}
                      {i < arr.length - 1 && ", "}
                    </span>
                  ))}
                </p>
              </div>
            )}
          </td>
        </tr>
      </tbody>
    </table>
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
        <Box id="resume-preview-content">{resumeContent}</Box>
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
        {!hideAISuggest && (
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
        )}
        <Button
          onClick={handleDownloadPDF}
          className="primary-action-btn"
          variant="contained"
          startIcon={<DownloadIcon />}
          disabled={isGenerating}
          sx={{ minWidth: "140px" }}
        >
          {isGenerating ? "Generating..." : "Download PDF"}
        </Button>
      </DialogActions>

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
    </Dialog>
  );
};

export default ResumePreview;
