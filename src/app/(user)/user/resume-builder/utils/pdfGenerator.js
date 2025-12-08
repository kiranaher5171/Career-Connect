export const formatDate = (dateString) => {
  if (!dateString) return "Present";
  const date = new Date(dateString + "-01");
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
};

export const generateResumeHTML = (formData) => {
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
      skillsHtml = formData.skills
        .map(skill => {
          const skillStr = typeof skill === 'string' ? skill : String(skill);
          const match = skillStr.match(/\*\*(.*?)\*\*\s*-\s*(.*)/);
          if (match) {
            const [, category, skills] = match;
            return `<div><strong>${category}</strong> - ${skills}</div>`;
          }
          return `<div>${skillStr}</div>`;
        })
        .join('');
    } else {
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

export const generatePDFStyles = () => {
  return `
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
};

