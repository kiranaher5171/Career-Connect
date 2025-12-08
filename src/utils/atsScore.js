/**
 * Calculate ATS (Applicant Tracking System) Score
 * Evaluates resume completeness and ATS-friendliness
 * Returns score, percentage, and feedback suggestions
 */
export const calculateATSScore = (data) => {
  if (!data) return { score: 0, maxScore: 100, percentage: 0, feedback: [] };

  let score = 0;
  const maxScore = 100;
  const feedback = [];

  // 1. Personal Information (15 points)
  const personalInfoScore = 15;
  let personalInfoPoints = 0;
  if (data.firstName && data.lastName) personalInfoPoints += 5;
  if (data.email) personalInfoPoints += 3;
  if (data.phone) personalInfoPoints += 2;
  if (data.address || data.city) personalInfoPoints += 2;
  if (data.linkedIn || data.portfolio || data.github) personalInfoPoints += 3;
  score += personalInfoPoints;
  if (personalInfoPoints < personalInfoScore) {
    feedback.push("Complete all personal information fields");
  }

  // 2. Professional Summary (15 points)
  const summaryScore = 15;
  let summaryPoints = 0;
  if (data.professionalSummary) {
    const summaryLength = data.professionalSummary.trim().length;
    if (summaryLength >= 100 && summaryLength <= 500) summaryPoints = 15;
    else if (summaryLength >= 50) summaryPoints = 10;
    else if (summaryLength > 0) summaryPoints = 5;
  }
  score += summaryPoints;
  if (summaryPoints < summaryScore) {
    feedback.push("Add a professional summary (100-500 characters recommended)");
  }

  // 3. Work Experience (30 points)
  const workExpScore = 30;
  let workExpPoints = 0;
  if (data.workExperience && Array.isArray(data.workExperience) && data.workExperience.length > 0) {
    const avgPointsPerExp = workExpScore / Math.max(data.workExperience.length, 1);
    data.workExperience.forEach((exp) => {
      let expPoints = 0;
      if (exp.jobTitle) expPoints += avgPointsPerExp * 0.3;
      if (exp.company) expPoints += avgPointsPerExp * 0.3;
      if (exp.startDate) expPoints += avgPointsPerExp * 0.2;
      if (exp.description && exp.description.trim().length >= 100) {
        expPoints += avgPointsPerExp * 0.2;
        // Check for bullet points
        if (exp.description.includes('•') || exp.description.split('\n').length >= 3) {
          expPoints += avgPointsPerExp * 0.1;
        }
      }
      workExpPoints += Math.min(expPoints, avgPointsPerExp);
    });
    workExpPoints = Math.min(workExpPoints, workExpScore);
  }
  score += workExpPoints;
  if (workExpPoints < workExpScore) {
    feedback.push("Add detailed work experience with descriptions (minimum 100 characters per role)");
  }

  // 4. Education (15 points)
  const educationScore = 15;
  let educationPoints = 0;
  if (data.education && Array.isArray(data.education) && data.education.length > 0) {
    const avgPointsPerEdu = educationScore / Math.max(data.education.length, 1);
    data.education.forEach((edu) => {
      let eduPoints = 0;
      if (edu.degree) eduPoints += avgPointsPerEdu * 0.4;
      if (edu.institution) eduPoints += avgPointsPerEdu * 0.4;
      if (edu.startDate) eduPoints += avgPointsPerEdu * 0.1;
      if (edu.endDate) eduPoints += avgPointsPerEdu * 0.1;
      educationPoints += Math.min(eduPoints, avgPointsPerEdu);
    });
    educationPoints = Math.min(educationPoints, educationScore);
  }
  score += educationPoints;
  if (educationPoints < educationScore) {
    feedback.push("Add education details (degree and institution required)");
  }

  // 5. Skills (15 points)
  const skillsScore = 15;
  let skillsPoints = 0;
  if (data.skills && Array.isArray(data.skills) && data.skills.length > 0) {
    if (data.skills.length >= 10) skillsPoints = 15;
    else if (data.skills.length >= 5) skillsPoints = 10;
    else if (data.skills.length >= 3) skillsPoints = 5;
  } else if (data.skills && typeof data.skills === 'string' && data.skills.trim().length > 0) {
    skillsPoints = 10; // Skills as string
  }
  score += skillsPoints;
  if (skillsPoints < skillsScore) {
    feedback.push("Add at least 5-10 relevant skills");
  }

  // 6. Certifications (5 points)
  const certScore = 5;
  let certPoints = 0;
  if (data.certifications && Array.isArray(data.certifications) && data.certifications.length > 0) {
    certPoints = Math.min(data.certifications.length * 2.5, certScore);
  }
  score += certPoints;

  // 7. Projects (5 points)
  const projectsScore = 5;
  let projectsPoints = 0;
  if (data.projects && Array.isArray(data.projects) && data.projects.length > 0) {
    projectsPoints = Math.min(data.projects.length * 2.5, projectsScore);
  }
  score += projectsPoints;

  const percentage = Math.round((score / maxScore) * 100);
  
  return {
    score: Math.round(score),
    maxScore,
    percentage,
    feedback: feedback.slice(0, 5), // Limit to 5 feedback items
  };
};

