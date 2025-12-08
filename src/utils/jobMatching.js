/**
 * Job Matching Utility
 * Matches jobs against alert criteria
 */

// Extract numeric salary from salary string
function extractSalary(salaryString) {
  if (!salaryString) return 0;
  
  // Remove all non-numeric characters except commas and dots
  const cleaned = salaryString.replace(/[^\d,.]/g, '');
  
  // Extract numbers (handle formats like "5,00,000" or "500000")
  const numbers = cleaned.match(/\d+/g);
  if (!numbers || numbers.length === 0) return 0;
  
  // If multiple numbers, take the average or first
  // Common formats: "5-10 Lakhs" or "₹5,00,000 - ₹10,00,000"
  if (numbers.length >= 2) {
    // Take average of min and max
    const min = parseInt(numbers[0].replace(/,/g, ''));
    const max = parseInt(numbers[1].replace(/,/g, ''));
    return Math.floor((min + max) / 2);
  }
  
  // Single number
  const num = parseInt(numbers[0].replace(/,/g, ''));
  
  // If number is less than 1000, it might be in lakhs (multiply by 100000)
  if (num < 1000 && salaryString.toLowerCase().includes('lakh')) {
    return num * 100000;
  }
  
  return num;
}

/**
 * Match a job against alert criteria
 * @param {Object} job - Job object from database
 * @param {Object} alert - Alert object with criteria
 * @returns {boolean} - True if job matches alert criteria
 */
export function matchJobToAlert(job, alert) {
  // Keywords match
  if (alert.keywords && alert.keywords.trim() !== '') {
    const keywords = alert.keywords.toLowerCase().trim();
    const jobText = `${job.jobRole || ''} ${job.designation || ''} ${job.description || ''}`.toLowerCase();
    
    // Split keywords and check if all are present
    const keywordArray = keywords.split(/\s+/);
    const allKeywordsMatch = keywordArray.every(keyword => 
      jobText.includes(keyword.toLowerCase())
    );
    
    if (!allKeywordsMatch) return false;
  }

  // Location match
  if (alert.locations && alert.locations.length > 0) {
    if (!job.location || !alert.locations.includes(job.location)) {
      return false;
    }
  }

  // Category match
  if (alert.categories && alert.categories.length > 0) {
    const jobCategory = job.teamName || job.category;
    if (!jobCategory || !alert.categories.includes(jobCategory)) {
      return false;
    }
  }

  // Job type match
  if (alert.jobTypes && alert.jobTypes.length > 0) {
    if (!job.jobType || !alert.jobTypes.includes(job.jobType)) {
      return false;
    }
  }

  // Experience level match
  if (alert.experienceLevels && alert.experienceLevels.length > 0) {
    if (!job.experience || !alert.experienceLevels.includes(job.experience)) {
      return false;
    }
  }

  // Salary range match
  if (alert.salaryRange && (alert.salaryRange.min > 0 || alert.salaryRange.max < 10000000)) {
    const jobSalary = extractSalary(job.salary);
    if (jobSalary > 0) {
      if (jobSalary < alert.salaryRange.min || jobSalary > alert.salaryRange.max) {
        return false;
      }
    }
  }

  // Skills match (at least one skill should match)
  if (alert.skills && alert.skills.length > 0) {
    const jobSkills = Array.isArray(job.skills)
      ? job.skills.map(s => s.trim().toLowerCase())
      : (job.skills || '').split(',').map(s => s.trim().toLowerCase());
    
    const alertSkills = alert.skills.map(s => s.trim().toLowerCase());
    
    const hasMatchingSkill = alertSkills.some(alertSkill =>
      jobSkills.some(jobSkill => 
        jobSkill.includes(alertSkill) || alertSkill.includes(jobSkill)
      )
    );
    
    if (!hasMatchingSkill) return false;
  }

  return true;
}

/**
 * Find all jobs matching an alert
 * @param {Array} jobs - Array of all jobs
 * @param {Object} alert - Alert object with criteria
 * @param {Array} excludeJobIds - Array of job IDs to exclude (already sent)
 * @returns {Array} - Array of matching job objects
 */
export function findMatchingJobs(jobs, alert, excludeJobIds = []) {
  return jobs.filter(job => {
    // Exclude jobs that have already been sent
    if (excludeJobIds.includes(job._id.toString())) {
      return false;
    }
    
    // Only match active jobs
    if (job.status !== 'active') {
      return false;
    }
    
    return matchJobToAlert(job, alert);
  });
}

/**
 * Get count of new matching jobs for an alert
 * @param {Array} jobs - Array of all jobs
 * @param {Object} alert - Alert object with criteria
 * @returns {number} - Count of new matching jobs
 */
export function getNewJobsCount(jobs, alert) {
  const excludeJobIds = (alert.jobsMatched || []).map(id => 
    typeof id === 'object' ? id.toString() : id
  );
  const matchingJobs = findMatchingJobs(jobs, alert, excludeJobIds);
  return matchingJobs.length;
}

