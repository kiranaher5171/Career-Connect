"use client";
import { generateResumeHTML, generatePDFStyles } from "../utils/pdfGenerator";

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
  element.style.height = 'fit-content';
  element.style.overflow = 'visible';
  element.style.maxHeight = 'none';
  
  // Force reflow
  element.offsetHeight;
  
  // Fix child elements
  const childElements = element.querySelectorAll('div, section, article');
  childElements.forEach(el => {
    el.style.height = 'fit-content';
    el.style.overflow = 'visible';
    el.style.maxHeight = 'none';
  });
};

/**
 * Creates a canvas slice for a specific page
 */
const createPageCanvas = (sourceCanvas, sourceY, sourceHeight) => {
  const pageCanvas = document.createElement('canvas');
  pageCanvas.width = sourceCanvas.width;
  pageCanvas.height = Math.ceil(sourceHeight);
  const pageCtx = pageCanvas.getContext('2d');
  
  // Fill with white background
  pageCtx.fillStyle = '#ffffff';
  pageCtx.fillRect(0, 0, pageCanvas.width, pageCanvas.height);
  
  // Extract the slice from original canvas
  pageCtx.drawImage(
    sourceCanvas,
    0, sourceY,
    sourceCanvas.width, sourceHeight,
    0, 0,
    sourceCanvas.width, sourceHeight
  );
  
  return pageCanvas.toDataURL('image/png', 1.0);
};

/**
 * Splits canvas across multiple PDF pages - ensures ALL content is captured
 */
const splitCanvasToPages = (canvas, pdf, scaleFactor) => {
  const { marginTop, marginLeft, marginRight, pageWidth, pageHeight } = PDF_CONFIG;
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
  while (sourceY < canvas.height && pageNumber < MAX_PAGES) {
    if (pageNumber > 0) {
      pdf.addPage();
    }
    
    // Calculate remaining canvas pixels
    const remainingCanvasPixels = canvas.height - sourceY;
    
    // Calculate how many canvas pixels fit in one page (with some margin for rounding)
    const canvasPixelsPerPage = Math.floor((availableHeight / scale) / PX_TO_MM * CANVAS_SCALE);
    
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
      // Regular page - use calculated pixels per page
      sourceHeight = canvasPixelsPerPage;
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
    
    pdf.addImage(pageImgData, 'PNG', xOffset, marginTop, scaledWidth, displayHeight);
    
    // Move to next position in canvas pixels
    sourceY += sourceHeight;
    pageNumber++;
    
    // Safety check - if we've processed all canvas content, we're done
    if (sourceY >= canvas.height) {
      break;
    }
    
    // Additional check: if remaining pixels are very small, capture them anyway
    const finalRemaining = canvas.height - sourceY;
    if (finalRemaining > 0 && finalRemaining < 50) { // Less than 50 pixels remaining
      // Add one more page to capture the remaining content
      pdf.addPage();
      const finalPageImgData = createPageCanvas(canvas, sourceY, finalRemaining);
      const finalPageHeight = (finalRemaining / CANVAS_SCALE) * PX_TO_MM * scale;
      pdf.addImage(finalPageImgData, 'PNG', xOffset, marginTop, scaledWidth, finalPageHeight);
      break;
    }
  }
};

export const usePDFDownload = (formData, showSnackbar) => {
  const handleDownload = async () => {
    try {
      showSnackbar("Generating PDF...", "info");
      
      // Dynamic imports for better code splitting
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import('jspdf'),
        import('html2canvas'),
      ]);
      
      const resumeContent = generateResumeHTML(formData);
      const nameParts = [
        formData.firstName,
        formData.middleName,
        formData.lastName,
      ].filter(Boolean);
      const fileName = nameParts.join("_").trim() || "Resume";

      // Create temporary element for rendering
      const element = document.createElement('div');
      element.id = 'resume-pdf-content';
      element.style.width = `${PDF_CONFIG.pageWidth}mm`;
      element.style.margin = '0 auto';
      element.style.padding = '24px';
      element.style.backgroundColor = 'white';
      element.style.fontFamily = 'Arial, sans-serif';
      element.style.position = 'absolute';
      element.style.left = '-9999px';
      element.style.top = '0';
      element.style.overflow = 'visible';
      element.style.height = 'fit-content';
      element.innerHTML = resumeContent;
      
      const style = document.createElement('style');
      style.textContent = generatePDFStyles();
      element.appendChild(style);
      
      document.body.appendChild(element);
      
      // Wait for rendering
      await new Promise(resolve => setTimeout(resolve, RENDER_DELAY));
      
      // Prepare element for capture
      prepareElementForCapture(element);
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Convert to canvas - ensure full height is captured
      const canvas = await html2canvas(element, {
        scale: CANVAS_SCALE,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: element.scrollWidth,
        height: element.scrollHeight,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        allowTaint: true,
        removeContainer: false,
        scrollX: 0,
        scrollY: 0,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.getElementById('resume-pdf-content');
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
        console.warn('Canvas height may be incomplete. Expected:', expectedHeight, 'Got:', canvas.height);
      }
      
      // Clean up temporary element
      document.body.removeChild(element);
      
      // Create PDF and split across pages
      const pdf = new jsPDF('p', 'mm', 'a4');
      const { marginLeft, marginRight, pageWidth } = PDF_CONFIG;
      const availableWidth = pageWidth - marginLeft - marginRight;
      const actualWidthPx = canvas.width / CANVAS_SCALE;
      const widthMm = actualWidthPx * PX_TO_MM;
      const scaleFactor = availableWidth / widthMm;
      
      splitCanvasToPages(canvas, pdf, scaleFactor);

      // Save PDF
      pdf.save(`${fileName}.pdf`);
      showSnackbar("PDF downloaded successfully!", "success");
    } catch (error) {
      console.error("Error generating PDF:", error);
      showSnackbar(
        error.message || "Failed to generate PDF. Please try again.",
        "error"
      );
    }
  };

  return { handleDownload };
};
