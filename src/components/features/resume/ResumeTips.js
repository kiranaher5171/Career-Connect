"use client";
import React from "react";
import { Card, CardContent, Typography, Divider, Box } from "@mui/material";

const ResumeTips = () => {
  const tips = [
    "Keep your professional summary concise (2-3 sentences) and impactful",
    "Use action verbs (e.g., \"Led\", \"Developed\", \"Implemented\") in work experience",
    "Quantify achievements with numbers, percentages, or metrics when possible",
    "Tailor your resume to match specific job requirements and keywords",
    "Use bullet points for work experience (minimum 5 per role) for better readability",
    "Categorize skills by type (Frontend, Backend, Database, etc.) for ATS optimization",
    "Keep formatting consistent, professional, and ATS-friendly",
    "Include relevant certifications with brief summaries (2-3 lines)",
    "Proofread carefully for spelling, grammar, and formatting errors",
    "Use the AI Suggest feature to enhance your resume with ATS keywords",
  ];

  return (
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
          {tips.map((tip, index) => (
            <Typography key={index} component="li" variant="body2" sx={{ mb: 1.5, lineHeight: 1.6 }}>
              {tip}
            </Typography>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ResumeTips;

