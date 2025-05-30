import { create } from "zustand";

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  website?: string;
  linkedin?: string;
  github?: string;
  summary: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  achievements: string[];
}

export interface Skill {
  id: string;
  name: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  category: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  url?: string;
  github?: string;
  startDate: string;
  endDate: string;
}

export interface Certificate {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url?: string;
}

export interface Language {
  id: string;
  name: string;
  proficiency: "Basic" | "Conversational" | "Fluent" | "Native";
}

export interface ResumeSection {
  id: string;
  type:
    | "personal"
    | "experience"
    | "education"
    | "skills"
    | "projects"
    | "certificates"
    | "languages"
    | "custom";
  title: string;
  visible: boolean;
  order: number;
}

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  preview: string;
  layout: "single-column" | "two-column" | "modern" | "classic";
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
}

export interface ResumeData {
  id?: string;
  templateId: string;
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  certificates: Certificate[];
  languages: Language[];
  sections: ResumeSection[];
  customSections: { [key: string]: any };
  createdAt?: string;
  updatedAt?: string;
}

export interface ResumeState {
  // Current resume data
  resumeData: ResumeData;

  // UI state
  selectedTemplate: ResumeTemplate | null;
  availableTemplates: ResumeTemplate[];
  currentStep: "template" | "content" | "preview";
  isDragging: boolean;
  draggedSection: string | null;

  // Form state
  activeSection: string | null;
  isEditing: boolean;
  hasUnsavedChanges: boolean;

  // Export state
  isExporting: boolean;
  exportFormat: "pdf" | "docx" | "html";

  // Actions
  setTemplate: (template: ResumeTemplate) => void;
  setCurrentStep: (step: "template" | "content" | "preview") => void;
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  addExperience: (experience: Omit<Experience, "id">) => void;
  updateExperience: (id: string, experience: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  addEducation: (education: Omit<Education, "id">) => void;
  updateEducation: (id: string, education: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  addSkill: (skill: Omit<Skill, "id">) => void;
  updateSkill: (id: string, skill: Partial<Skill>) => void;
  removeSkill: (id: string) => void;
  addProject: (project: Omit<Project, "id">) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  removeProject: (id: string) => void;
  addCertificate: (certificate: Omit<Certificate, "id">) => void;
  updateCertificate: (id: string, certificate: Partial<Certificate>) => void;
  removeCertificate: (id: string) => void;
  addLanguage: (language: Omit<Language, "id">) => void;
  updateLanguage: (id: string, language: Partial<Language>) => void;
  removeLanguage: (id: string) => void;
  reorderSections: (sections: ResumeSection[]) => void;
  toggleSectionVisibility: (sectionId: string) => void;
  setActiveSection: (sectionId: string | null) => void;
  setIsEditing: (editing: boolean) => void;
  setDragState: (isDragging: boolean, draggedSection?: string | null) => void;
  saveResume: () => Promise<void>;
  loadResume: (id: string) => Promise<void>;
  exportResume: (format: "pdf" | "docx" | "html") => Promise<void>;
  resetResume: () => void;
}

// Default templates
const defaultTemplates: ResumeTemplate[] = [
  {
    id: "modern",
    name: "Modern Professional",
    description: "Clean, modern design with a two-column layout",
    preview: "/templates/modern-preview.png",
    layout: "two-column",
    colorScheme: {
      primary: "#2563eb",
      secondary: "#64748b",
      accent: "#0ea5e9",
      text: "#1e293b",
      background: "#ffffff",
    },
  },
  {
    id: "classic",
    name: "Classic Traditional",
    description: "Traditional single-column layout with clean typography",
    preview: "/templates/classic-preview.png",
    layout: "single-column",
    colorScheme: {
      primary: "#1f2937",
      secondary: "#6b7280",
      accent: "#374151",
      text: "#111827",
      background: "#ffffff",
    },
  },
  {
    id: "creative",
    name: "Creative Designer",
    description: "Bold, creative design with modern elements",
    preview: "/templates/creative-preview.png",
    layout: "modern",
    colorScheme: {
      primary: "#7c3aed",
      secondary: "#a78bfa",
      accent: "#8b5cf6",
      text: "#1f2937",
      background: "#ffffff",
    },
  },
  {
    id: "minimal",
    name: "Minimal Clean",
    description: "Minimalist design focusing on content",
    preview: "/templates/minimal-preview.png",
    layout: "single-column",
    colorScheme: {
      primary: "#000000",
      secondary: "#6b7280",
      accent: "#374151",
      text: "#111827",
      background: "#ffffff",
    },
  },
];

// Default sections
const defaultSections: ResumeSection[] = [
  {
    id: "personal",
    type: "personal",
    title: "Personal Information",
    visible: true,
    order: 0,
  },
  {
    id: "experience",
    type: "experience",
    title: "Work Experience",
    visible: true,
    order: 1,
  },
  {
    id: "education",
    type: "education",
    title: "Education",
    visible: true,
    order: 2,
  },
  { id: "skills", type: "skills", title: "Skills", visible: true, order: 3 },
  {
    id: "projects",
    type: "projects",
    title: "Projects",
    visible: false,
    order: 4,
  },
  {
    id: "certificates",
    type: "certificates",
    title: "Certificates",
    visible: false,
    order: 5,
  },
  {
    id: "languages",
    type: "languages",
    title: "Languages",
    visible: false,
    order: 6,
  },
];

// Initial resume data
const initialResumeData: ResumeData = {
  templateId: "modern",
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    linkedin: "",
    github: "",
    summary: "",
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certificates: [],
  languages: [],
  sections: defaultSections,
  customSections: {},
};

// Generate unique ID
const generateId = () => Math.random().toString(36).substr(2, 9);

export const useResumeStore = create<ResumeState>((set, get) => ({
  // Initial state
  resumeData: initialResumeData,
  selectedTemplate: defaultTemplates[0],
  availableTemplates: defaultTemplates,
  currentStep: "template",
  isDragging: false,
  draggedSection: null,
  activeSection: null,
  isEditing: false,
  hasUnsavedChanges: false,
  isExporting: false,
  exportFormat: "pdf",

  // Actions
  setTemplate: (template: ResumeTemplate) =>
    set((state) => ({
      selectedTemplate: template,
      resumeData: { ...state.resumeData, templateId: template.id },
      hasUnsavedChanges: true,
    })),

  setCurrentStep: (step: "template" | "content" | "preview") =>
    set({ currentStep: step }),

  updatePersonalInfo: (info: Partial<PersonalInfo>) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        personalInfo: { ...state.resumeData.personalInfo, ...info },
      },
      hasUnsavedChanges: true,
    })),

  addExperience: (experience: Omit<Experience, "id">) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        experience: [
          ...state.resumeData.experience,
          { ...experience, id: generateId() },
        ],
      },
      hasUnsavedChanges: true,
    })),

  updateExperience: (id: string, experience: Partial<Experience>) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        experience: state.resumeData.experience.map((exp) =>
          exp.id === id ? { ...exp, ...experience } : exp
        ),
      },
      hasUnsavedChanges: true,
    })),

  removeExperience: (id: string) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        experience: state.resumeData.experience.filter((exp) => exp.id !== id),
      },
      hasUnsavedChanges: true,
    })),

  addEducation: (education: Omit<Education, "id">) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        education: [
          ...state.resumeData.education,
          { ...education, id: generateId() },
        ],
      },
      hasUnsavedChanges: true,
    })),

  updateEducation: (id: string, education: Partial<Education>) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        education: state.resumeData.education.map((edu) =>
          edu.id === id ? { ...edu, ...education } : edu
        ),
      },
      hasUnsavedChanges: true,
    })),

  removeEducation: (id: string) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        education: state.resumeData.education.filter((edu) => edu.id !== id),
      },
      hasUnsavedChanges: true,
    })),

  addSkill: (skill: Omit<Skill, "id">) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        skills: [...state.resumeData.skills, { ...skill, id: generateId() }],
      },
      hasUnsavedChanges: true,
    })),

  updateSkill: (id: string, skill: Partial<Skill>) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        skills: state.resumeData.skills.map((s) =>
          s.id === id ? { ...s, ...skill } : s
        ),
      },
      hasUnsavedChanges: true,
    })),

  removeSkill: (id: string) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        skills: state.resumeData.skills.filter((s) => s.id !== id),
      },
      hasUnsavedChanges: true,
    })),

  addProject: (project: Omit<Project, "id">) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        projects: [
          ...state.resumeData.projects,
          { ...project, id: generateId() },
        ],
      },
      hasUnsavedChanges: true,
    })),

  updateProject: (id: string, project: Partial<Project>) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        projects: state.resumeData.projects.map((p) =>
          p.id === id ? { ...p, ...project } : p
        ),
      },
      hasUnsavedChanges: true,
    })),

  removeProject: (id: string) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        projects: state.resumeData.projects.filter((p) => p.id !== id),
      },
      hasUnsavedChanges: true,
    })),

  addCertificate: (certificate: Omit<Certificate, "id">) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        certificates: [
          ...state.resumeData.certificates,
          { ...certificate, id: generateId() },
        ],
      },
      hasUnsavedChanges: true,
    })),

  updateCertificate: (id: string, certificate: Partial<Certificate>) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        certificates: state.resumeData.certificates.map((cert) =>
          cert.id === id ? { ...cert, ...certificate } : cert
        ),
      },
      hasUnsavedChanges: true,
    })),

  removeCertificate: (id: string) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        certificates: state.resumeData.certificates.filter(
          (cert) => cert.id !== id
        ),
      },
      hasUnsavedChanges: true,
    })),

  addLanguage: (language: Omit<Language, "id">) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        languages: [
          ...state.resumeData.languages,
          { ...language, id: generateId() },
        ],
      },
      hasUnsavedChanges: true,
    })),

  updateLanguage: (id: string, language: Partial<Language>) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        languages: state.resumeData.languages.map((lang) =>
          lang.id === id ? { ...lang, ...language } : lang
        ),
      },
      hasUnsavedChanges: true,
    })),

  removeLanguage: (id: string) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        languages: state.resumeData.languages.filter((lang) => lang.id !== id),
      },
      hasUnsavedChanges: true,
    })),

  reorderSections: (sections: ResumeSection[]) =>
    set((state) => ({
      resumeData: { ...state.resumeData, sections },
      hasUnsavedChanges: true,
    })),

  toggleSectionVisibility: (sectionId: string) =>
    set((state) => ({
      resumeData: {
        ...state.resumeData,
        sections: state.resumeData.sections.map((section) =>
          section.id === sectionId
            ? { ...section, visible: !section.visible }
            : section
        ),
      },
      hasUnsavedChanges: true,
    })),

  setActiveSection: (sectionId: string | null) =>
    set({ activeSection: sectionId }),

  setIsEditing: (editing: boolean) => set({ isEditing: editing }),

  setDragState: (isDragging: boolean, draggedSection?: string | null) =>
    set({ isDragging, draggedSection: draggedSection || null }),

  saveResume: async () => {
    const { resumeData } = get();
    try {
      const response = await fetch("/api/resume/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resumeData),
      });

      if (response.ok) {
        set({ hasUnsavedChanges: false });
      }
    } catch (error) {
      console.error("Failed to save resume:", error);
    }
  },

  loadResume: async (id: string) => {
    try {
      const response = await fetch(`/api/resume/${id}`);
      if (response.ok) {
        const resumeData = await response.json();
        set({ resumeData, hasUnsavedChanges: false });
      }
    } catch (error) {
      console.error("Failed to load resume:", error);
    }
  },

  exportResume: async (format: "pdf" | "docx" | "html") => {
    set({ isExporting: true, exportFormat: format });
    try {
      const { resumeData } = get();
      const response = await fetch("/api/resume/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeData, format }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `resume.${format}`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Failed to export resume:", error);
    } finally {
      set({ isExporting: false });
    }
  },

  resetResume: () =>
    set({
      resumeData: initialResumeData,
      selectedTemplate: defaultTemplates[0],
      currentStep: "template",
      activeSection: null,
      isEditing: false,
      hasUnsavedChanges: false,
    }),
}));
