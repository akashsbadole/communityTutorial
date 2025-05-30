"use client";

import React, { useState } from "react";
import { useResumeStore } from "@/lib/stores/resume-store";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  Trash2,
  GripVertical,
  Eye,
  EyeOff,
  User,
  Briefcase,
  GraduationCap,
  Code,
  FolderOpen,
  Award,
  Globe,
  Edit3,
} from "lucide-react";
import { toast } from "sonner";
import { SectionManager } from "./DragDropSection";

// Simple drag and drop implementation (will be enhanced with @dnd-kit later)
interface DragDropSectionProps {
  children: React.ReactNode;
  sectionId: string;
  onReorder?: (fromIndex: number, toIndex: number) => void;
}

const DragDropSection: React.FC<DragDropSectionProps> = ({
  children,
  sectionId,
}) => {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div
      className={`transition-all ${isDragging ? "opacity-50" : ""}`}
      draggable
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
    >
      {children}
    </div>
  );
};

// Personal Information Section
const PersonalInfoSection: React.FC = () => {
  const { resumeData, updatePersonalInfo } = useResumeStore();
  const { personalInfo } = resumeData;

  const handleChange = (field: keyof typeof personalInfo, value: string) => {
    updatePersonalInfo({ [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-blue-600" />
          <CardTitle>Personal Information</CardTitle>
        </div>
        <CardDescription>
          Your basic contact information and professional summary
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              value={personalInfo.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              placeholder="John Doe"
            />
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={personalInfo.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="john@example.com"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone *</Label>
            <Input
              id="phone"
              value={personalInfo.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+1 (555) 123-4567"
            />
          </div>
          <div>
            <Label htmlFor="location">Location *</Label>
            <Input
              id="location"
              value={personalInfo.location}
              onChange={(e) => handleChange("location", e.target.value)}
              placeholder="New York, NY"
            />
          </div>
          <div>
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={personalInfo.website || ""}
              onChange={(e) => handleChange("website", e.target.value)}
              placeholder="https://yourwebsite.com"
            />
          </div>
          <div>
            <Label htmlFor="linkedin">LinkedIn</Label>
            <Input
              id="linkedin"
              value={personalInfo.linkedin || ""}
              onChange={(e) => handleChange("linkedin", e.target.value)}
              placeholder="https://linkedin.com/in/johndoe"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="summary">Professional Summary</Label>
          <Textarea
            id="summary"
            value={personalInfo.summary}
            onChange={(e) => handleChange("summary", e.target.value)}
            placeholder="Write a brief professional summary highlighting your key skills and experience..."
            rows={4}
          />
        </div>
      </CardContent>
    </Card>
  );
};

// Experience Section
const ExperienceSection: React.FC = () => {
  const { resumeData, addExperience, updateExperience, removeExperience } =
    useResumeStore();
  const { experience } = resumeData;

  const handleAddExperience = () => {
    addExperience({
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
      achievements: [],
    });
  };

  const handleUpdateExperience = (id: string, field: string, value: any) => {
    updateExperience(id, { [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-blue-600" />
            <CardTitle>Work Experience</CardTitle>
          </div>
          <Button
            onClick={handleAddExperience}
            size="sm"
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            Add Experience
          </Button>
        </div>
        <CardDescription>
          Your professional work history and achievements
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {experience.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No work experience added yet</p>
            <p className="text-sm">Click "Add Experience" to get started</p>
          </div>
        ) : (
          experience.map((exp, index) => (
            <DragDropSection key={exp.id} sectionId={exp.id}>
              <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                      <Badge variant="outline">Experience {index + 1}</Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeExperience(exp.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Company *</Label>
                      <Input
                        value={exp.company}
                        onChange={(e) =>
                          handleUpdateExperience(
                            exp.id,
                            "company",
                            e.target.value
                          )
                        }
                        placeholder="Company Name"
                      />
                    </div>
                    <div>
                      <Label>Position *</Label>
                      <Input
                        value={exp.position}
                        onChange={(e) =>
                          handleUpdateExperience(
                            exp.id,
                            "position",
                            e.target.value
                          )
                        }
                        placeholder="Job Title"
                      />
                    </div>
                    <div>
                      <Label>Start Date *</Label>
                      <Input
                        type="month"
                        value={exp.startDate}
                        onChange={(e) =>
                          handleUpdateExperience(
                            exp.id,
                            "startDate",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <Input
                        type="month"
                        value={exp.endDate}
                        onChange={(e) =>
                          handleUpdateExperience(
                            exp.id,
                            "endDate",
                            e.target.value
                          )
                        }
                        disabled={exp.current}
                      />
                      <div className="flex items-center gap-2 mt-2">
                        <Switch
                          checked={exp.current}
                          onCheckedChange={(checked) =>
                            handleUpdateExperience(exp.id, "current", checked)
                          }
                        />
                        <Label className="text-sm">
                          Currently working here
                        </Label>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label>Job Description</Label>
                    <Textarea
                      value={exp.description}
                      onChange={(e) =>
                        handleUpdateExperience(
                          exp.id,
                          "description",
                          e.target.value
                        )
                      }
                      placeholder="Describe your role and responsibilities..."
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>
            </DragDropSection>
          ))
        )}
      </CardContent>
    </Card>
  );
};

// Skills Section
const SkillsSection: React.FC = () => {
  const { resumeData, addSkill, updateSkill, removeSkill } = useResumeStore();
  const { skills } = resumeData;

  const [newSkill, setNewSkill] = useState({
    name: "",
    level: "Intermediate" as const,
    category: "",
  });

  const handleAddSkill = () => {
    if (newSkill.name.trim()) {
      addSkill(newSkill);
      setNewSkill({ name: "", level: "Intermediate", category: "" });
      toast.success("Skill added successfully!");
    }
  };

  const skillLevels = [
    "Beginner",
    "Intermediate",
    "Advanced",
    "Expert",
  ] as const;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Code className="h-5 w-5 text-blue-600" />
          <CardTitle>Skills</CardTitle>
        </div>
        <CardDescription>
          Your technical and professional skills
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add new skill */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 bg-gray-50 rounded-lg">
          <Input
            placeholder="Skill name"
            value={newSkill.name}
            onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
          />
          <Input
            placeholder="Category (optional)"
            value={newSkill.category}
            onChange={(e) =>
              setNewSkill({ ...newSkill, category: e.target.value })
            }
          />
          <select
            className="px-3 py-2 border border-gray-300 rounded-md"
            value={newSkill.level}
            onChange={(e) =>
              setNewSkill({ ...newSkill, level: e.target.value as any })
            }
          >
            {skillLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
          <Button onClick={handleAddSkill} className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </div>

        {/* Skills list */}
        <div className="space-y-2">
          {skills.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Code className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No skills added yet</p>
              <p className="text-sm">Add your first skill above</p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge
                  key={skill.id}
                  variant="secondary"
                  className="flex items-center gap-2 px-3 py-1"
                >
                  <span>{skill.name}</span>
                  <span className="text-xs opacity-70">({skill.level})</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSkill(skill.id)}
                    className="h-4 w-4 p-0 hover:bg-red-100"
                  >
                    <Trash2 className="h-3 w-3 text-red-600" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Main Resume Builder Component
export const ResumeBuilder: React.FC = () => {
  const { resumeData } = useResumeStore();
  const { sections } = resumeData;

  const visibleSections = sections
    .filter((section) => section.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      {/* Section Manager */}
      <SectionManager />

      {/* Content Sections */}
      {visibleSections.map((section) => {
        switch (section.type) {
          case "personal":
            return <PersonalInfoSection key={section.id} />;
          case "experience":
            return <ExperienceSection key={section.id} />;
          case "skills":
            return <SkillsSection key={section.id} />;
          default:
            return (
              <Card key={section.id}>
                <CardContent className="py-8 text-center text-gray-500">
                  <Edit3 className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p>{section.title} section coming soon</p>
                </CardContent>
              </Card>
            );
        }
      })}
    </div>
  );
};
