"use client";
import { useState } from "react";

export const useAIEnhancement = (formData, setFormData, showSnackbar) => {
  const [isAILoading, setIsAILoading] = useState(false);
  const [aiModifiedFields, setAiModifiedFields] = useState({});

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
        setFormData(result.data);
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
      showSnackbar("AI enhancement failed. Please try again.", "error");
    } finally {
      setIsAILoading(false);
    }
  };

  return {
    isAILoading,
    aiModifiedFields,
    handleAISuggest,
  };
};

