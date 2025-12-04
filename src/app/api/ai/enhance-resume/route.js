import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const body = await request.json();
    const { resumeData } = body;

    // Check if OpenAI API key is configured
    const apiKey = process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      // Fallback to basic ATS keyword enhancement if no API key
      return NextResponse.json({
        success: true,
        data: enhanceWithATSKeywords(resumeData),
        aiEnhanced: false,
      });
    }

    // Prepare prompt for ChatGPT
    const prompt = `You are a professional resume optimizer. Analyze the following resume data and enhance it with:
1. Keep professional summary as paragraph text (do NOT convert to bullet points)
2. Convert work experience descriptions to bullet points (minimum 5 bullet points, use \\n for line breaks)
3. Categorize skills into groups like: **Frontend** - React, JavaScript | **Backend** - Node.js, Python | **Database** - SQL, MongoDB
4. Add ATS (Applicant Tracking System) keywords relevant to the job seeker's field
5. Professional language improvements with action verbs and quantifiable achievements
6. Industry-standard terminology

Resume Data:
${JSON.stringify(resumeData, null, 2)}

Return the enhanced resume data in the same JSON structure. For skills, format as: "**Category** - Skill1, Skill2 | **Category2** - Skill3, Skill4" with each category on a new line. Do NOT create an "Other" category as "Tools & Others" already covers remaining skills.`;

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a professional resume optimizer. Return only valid JSON matching the input structure.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error('OpenAI API error');
    }

    const data = await response.json();
    const enhancedContent = JSON.parse(data.choices[0].message.content);

    // Track which fields were modified
    const modifiedFields = trackModifiedFields(resumeData, enhancedContent);

    return NextResponse.json({
      success: true,
      data: enhancedContent,
      modifiedFields,
      aiEnhanced: true,
    });
  } catch (error) {
    console.error('AI enhancement error:', error);
    
    // Fallback to basic enhancement
    const enhanced = enhanceWithATSKeywords(body.resumeData);
    return NextResponse.json({
      success: true,
      data: enhanced,
      modifiedFields: getDefaultModifiedFields(enhanced, body.resumeData),
      aiEnhanced: false,
    });
  }
}

// Fallback function for basic ATS keyword enhancement
function enhanceWithATSKeywords(resumeData) {
  const atsKeywords = {
    technical: [
      'JavaScript', 'TypeScript', 'React', 'Node.js', 'Express.js',
      'MongoDB', 'PostgreSQL', 'AWS', 'Docker', 'Kubernetes',
      'Git', 'REST APIs', 'GraphQL', 'Agile', 'Scrum', 'DevOps',
    ],
    soft: [
      'Problem Solving', 'Team Collaboration', 'Communication',
      'Leadership', 'Project Management', 'Time Management',
    ],
  };

  const enhanced = { ...resumeData };

  // Keep professional summary as paragraph (do NOT convert to bullet points)
  // Just enhance with ATS keywords if needed
  if (enhanced.professionalSummary) {
    const summary = enhanced.professionalSummary;
    const keywords = atsKeywords.technical.slice(0, 3).join(', ');
    if (!summary.toLowerCase().includes(keywords.toLowerCase())) {
      enhanced.professionalSummary = `${summary} Proficient in ${keywords}.`;
    }
  }

  // Convert work experience descriptions to bullet points
  if (enhanced.workExperience && Array.isArray(enhanced.workExperience)) {
    enhanced.workExperience = enhanced.workExperience.map(exp => {
      if (exp.description) {
        const sentences = exp.description.split(/[.!?]+/).filter(s => s.trim().length > 0);
        if (sentences.length > 0) {
          // Ensure minimum 5 bullet points
          let bullets = sentences.map(s => `• ${s.trim()}`).join('\n');
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
  }

  // Categorize skills
  if (Array.isArray(enhanced.skills)) {
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
      const matched = enhanced.skills.filter(skill => 
        skills.some(catSkill => 
          skill.toLowerCase().includes(catSkill.toLowerCase()) ||
          catSkill.toLowerCase().includes(skill.toLowerCase())
        ) && !usedSkills.has(skill)
      );
      
      if (matched.length > 0) {
        matched.forEach(s => usedSkills.add(s));
        categorized.push(`**${category}** - ${matched.join(', ')}`);
      }
    });

    // Add remaining uncategorized skills to "Tools & Others" if it exists, otherwise create it
    const uncategorized = enhanced.skills.filter(s => !usedSkills.has(s));
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

    enhanced.skills = categorized.length > 0 ? categorized : enhanced.skills;
  }

  return enhanced;
}

// Track which fields were modified
function trackModifiedFields(original, enhanced) {
  const modified = {};

  // Compare professional summary
  if (original.professionalSummary !== enhanced.professionalSummary) {
    modified.professionalSummary = true;
  }

  // Compare skills
  if (JSON.stringify(original.skills) !== JSON.stringify(enhanced.skills)) {
    modified.skills = true;
  }

  // Compare work experience
  if (original.workExperience && enhanced.workExperience) {
    original.workExperience.forEach((exp, index) => {
      if (enhanced.workExperience[index]) {
        if (exp.description !== enhanced.workExperience[index].description) {
          if (!modified.workExperience) modified.workExperience = {};
          modified.workExperience[index] = true;
        }
      }
    });
  }

  return modified;
}

// Get default modified fields for fallback
function getDefaultModifiedFields(enhanced, original) {
  return {
    professionalSummary: enhanced.professionalSummary !== original.professionalSummary,
    skills: JSON.stringify(enhanced.skills) !== JSON.stringify(original.skills),
  };
}

