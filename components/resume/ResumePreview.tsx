"use client";

import React from "react";
import { useResumeStore } from "@/lib/stores/resume-store";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Github,
  Calendar,
  Building,
  GraduationCap,
  Award,
  Languages,
} from "lucide-react";

// Modern Template Component
const ModernTemplate: React.FC = () => {
  const { resumeData, selectedTemplate } = useResumeStore();
  const { personalInfo, experience, education, skills, projects, certificates, languages } = resumeData;
  const colorScheme = selectedTemplate?.colorScheme;

  if (!colorScheme) return null;

  return (
    <div className="bg-white text-gray-900 font-sans leading-relaxed">
      {/* Header Section */}
      <div 
        className="px-8 py-6 text-white"
        style={{ backgroundColor: colorScheme.primary }}
      >
        <h1 className="text-3xl font-bold mb-2">{personalInfo.fullName || "Your Name"}</h1>
        <div className="flex flex-wrap gap-4 text-sm opacity-90">
          {personalInfo.email && (
            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{personalInfo.location}</span>
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-center gap-1">
              <Globe className="h-4 w-4" />
              <span>{personalInfo.website}</span>
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="flex items-center gap-1">
              <Linkedin className="h-4 w-4" />
              <span>LinkedIn</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-8 p-8">
        {/* Left Column */}
        <div className="col-span-2 space-y-6">
          {/* Professional Summary */}
          {personalInfo.summary && (
            <section>
              <h2 
                className="text-xl font-bold mb-3 pb-2 border-b-2"
                style={{ color: colorScheme.primary, borderColor: colorScheme.primary }}
              >
                Professional Summary
              </h2>
              <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
            </section>
          )}

          {/* Work Experience */}
          {experience.length > 0 && (
            <section>
              <h2 
                className="text-xl font-bold mb-4 pb-2 border-b-2"
                style={{ color: colorScheme.primary, borderColor: colorScheme.primary }}
              >
                Work Experience
              </h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="border-l-3 pl-4" style={{ borderColor: colorScheme.accent }}>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold text-lg" style={{ color: colorScheme.text }}>
                        {exp.position || "Position Title"}
                      </h3>
                      <span className="text-sm text-gray-600 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Building className="h-4 w-4 text-gray-500" />
                      <span className="font-medium" style={{ color: colorScheme.secondary }}>
                        {exp.company || "Company Name"}
                      </span>
                    </div>
                    {exp.description && (
                      <p className="text-gray-700 text-sm leading-relaxed">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <section>
              <h2 
                className="text-xl font-bold mb-4 pb-2 border-b-2"
                style={{ color: colorScheme.primary, borderColor: colorScheme.primary }}
              >
                Projects
              </h2>
              <div className="space-y-3">
                {projects.map((project) => (
                  <div key={project.id} className="border-l-3 pl-4" style={{ borderColor: colorScheme.accent }}>
                    <h3 className="font-semibold" style={{ color: colorScheme.text }}>
                      {project.name || "Project Name"}
                    </h3>
                    <p className="text-gray-700 text-sm">{project.description}</p>
                    {project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {project.technologies.map((tech, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Skills */}
          {skills.length > 0 && (
            <section>
              <h2 
                className="text-lg font-bold mb-3 pb-2 border-b-2"
                style={{ color: colorScheme.primary, borderColor: colorScheme.primary }}
              >
                Skills
              </h2>
              <div className="space-y-3">
                {/* Group skills by category */}
                {Array.from(new Set(skills.map(s => s.category || "General"))).map(category => (
                  <div key={category}>
                    {category !== "General" && (
                      <h4 className="font-medium text-sm mb-2" style={{ color: colorScheme.secondary }}>
                        {category}
                      </h4>
                    )}
                    <div className="space-y-2">
                      {skills
                        .filter(skill => (skill.category || "General") === category)
                        .map((skill) => (
                          <div key={skill.id} className="flex justify-between items-center">
                            <span className="text-sm">{skill.name}</span>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4].map((level) => (
                                <div
                                  key={level}
                                  className={`w-2 h-2 rounded-full ${
                                    level <= (skill.level === "Expert" ? 4 : skill.level === "Advanced" ? 3 : skill.level === "Intermediate" ? 2 : 1)
                                      ? "opacity-100"
                                      : "opacity-30"
                                  }`}
                                  style={{ backgroundColor: colorScheme.accent }}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section>
              <h2 
                className="text-lg font-bold mb-3 pb-2 border-b-2"
                style={{ color: colorScheme.primary, borderColor: colorScheme.primary }}
              >
                Education
              </h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <h3 className="font-semibold text-sm" style={{ color: colorScheme.text }}>
                      {edu.degree || "Degree"} in {edu.field || "Field"}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                      <GraduationCap className="h-3 w-3" />
                      <span>{edu.institution || "Institution"}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Calendar className="h-3 w-3" />
                      <span>{edu.startDate} - {edu.endDate}</span>
                    </div>
                    {edu.gpa && (
                      <p className="text-xs text-gray-600 mt-1">GPA: {edu.gpa}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certificates */}
          {certificates.length > 0 && (
            <section>
              <h2 
                className="text-lg font-bold mb-3 pb-2 border-b-2"
                style={{ color: colorScheme.primary, borderColor: colorScheme.primary }}
              >
                Certificates
              </h2>
              <div className="space-y-2">
                {certificates.map((cert) => (
                  <div key={cert.id}>
                    <h3 className="font-semibold text-sm" style={{ color: colorScheme.text }}>
                      {cert.name || "Certificate Name"}
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Award className="h-3 w-3" />
                      <span>{cert.issuer || "Issuer"}</span>
                    </div>
                    <p className="text-xs text-gray-600">{cert.date}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <section>
              <h2 
                className="text-lg font-bold mb-3 pb-2 border-b-2"
                style={{ color: colorScheme.primary, borderColor: colorScheme.primary }}
              >
                Languages
              </h2>
              <div className="space-y-2">
                {languages.map((lang) => (
                  <div key={lang.id} className="flex justify-between items-center">
                    <span className="text-sm">{lang.name}</span>
                    <span className="text-xs" style={{ color: colorScheme.secondary }}>
                      {lang.proficiency}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

// Classic Template Component
const ClassicTemplate: React.FC = () => {
  const { resumeData, selectedTemplate } = useResumeStore();
  const { personalInfo, experience, education, skills } = resumeData;
  const colorScheme = selectedTemplate?.colorScheme;

  if (!colorScheme) return null;

  return (
    <div className="bg-white text-gray-900 font-serif leading-relaxed p-8">
      {/* Header */}
      <div className="text-center mb-8 border-b-2 pb-6" style={{ borderColor: colorScheme.primary }}>
        <h1 className="text-4xl font-bold mb-2" style={{ color: colorScheme.primary }}>
          {personalInfo.fullName || "Your Name"}
        </h1>
        <div className="flex justify-center gap-4 text-sm text-gray-600">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>•</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {personalInfo.location && <span>•</span>}
          {personalInfo.location && <span>{personalInfo.location}</span>}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {personalInfo.summary && (
          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: colorScheme.primary }}>
              PROFESSIONAL SUMMARY
            </h2>
            <p className="text-gray-700">{personalInfo.summary}</p>
          </section>
        )}

        {experience.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: colorScheme.primary }}>
              WORK EXPERIENCE
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold">{exp.position || "Position Title"}</h3>
                    <span className="text-sm text-gray-600">
                      {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                    </span>
                  </div>
                  <p className="font-medium text-gray-700 mb-2">{exp.company || "Company Name"}</p>
                  {exp.description && <p className="text-gray-700 text-sm">{exp.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {education.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: colorScheme.primary }}>
              EDUCATION
            </h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold">
                        {edu.degree || "Degree"} in {edu.field || "Field"}
                      </h3>
                      <p className="text-gray-700">{edu.institution || "Institution"}</p>
                    </div>
                    <span className="text-sm text-gray-600">
                      {edu.startDate} - {edu.endDate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {skills.length > 0 && (
          <section>
            <h2 className="text-xl font-bold mb-3" style={{ color: colorScheme.primary }}>
              SKILLS
            </h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span key={skill.id} className="text-sm text-gray-700">
                  {skill.name}
                  {skill !== skills[skills.length - 1] && <span className="ml-2">•</span>}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

// Main Resume Preview Component
export const ResumePreview: React.FC = () => {
  const { selectedTemplate } = useResumeStore();

  const renderTemplate = () => {
    switch (selectedTemplate?.layout) {
      case "two-column":
      case "modern":
        return <ModernTemplate />;
      case "single-column":
      case "classic":
        return <ClassicTemplate />;
      default:
        return <ModernTemplate />;
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-0">
        <div 
          className="w-full bg-white shadow-lg"
          style={{ 
            aspectRatio: "8.5/11",
            fontSize: "12px",
            lineHeight: "1.4"
          }}
        >
          {renderTemplate()}
        </div>
      </CardContent>
    </Card>
  );
};
