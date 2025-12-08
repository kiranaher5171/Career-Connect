"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export const useResumeForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
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
    professionalSummary: "",
    workExperience: [],
    education: [],
    skills: [],
    certifications: [],
    projects: [],
    languages: [],
  });

  useEffect(() => {
    loadResumeData();
  }, []);

  const loadResumeData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }

      const savedResume = localStorage.getItem("resumeData");
      if (savedResume) {
        const parsedData = JSON.parse(savedResume);
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
        if (!Array.isArray(parsedData.skills)) parsedData.skills = [];
        if (!Array.isArray(parsedData.languages)) parsedData.languages = [];
        setFormData(parsedData);
      }
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

  const handleRemoveSkill = (index) => {
    const updated = formData.skills.filter((_, i) => i !== index);
    setFormData({ ...formData, skills: updated });
  };

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

  const handleRemoveLanguage = (index) => {
    const updated = formData.languages.filter((_, i) => i !== index);
    setFormData({ ...formData, languages: updated });
  };

  return {
    formData,
    setFormData,
    handleChange,
    handleArrayChange,
    addArrayItem,
    removeArrayItem,
    handleAddSkill,
    handleRemoveSkill,
    handleAddLanguage,
    handleRemoveLanguage,
  };
};

