"use client";
import React from "react";
import { Card, CardContent, Box, Typography, Divider, Collapse } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const SectionCard = ({ title, expanded, onToggle, children }) => {
  return (
    <Card className="whitebx" sx={{ mb: 3 }}>
      <CardContent>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
          sx={{ cursor: "pointer" }}
          onClick={onToggle}
        >
          <Typography variant="h6" className="fw6">
            {title}
          </Typography>
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </Box>
        <Divider />
        <Collapse in={expanded}>{children}</Collapse>
      </CardContent>
    </Card>
  );
};

export default SectionCard;

