"use client";

import React, { useState, useRef } from "react";
import { useResumeStore } from "@/lib/stores/resume-store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
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
  Settings,
} from "lucide-react";

const sectionIcons = {
  personal: User,
  experience: Briefcase,
  education: GraduationCap,
  skills: Code,
  projects: FolderOpen,
  certificates: Award,
  languages: Globe,
  custom: Settings,
};

interface DragDropSectionProps {
  children: React.ReactNode;
  sectionId: string;
  title: string;
  visible: boolean;
  order: number;
  onToggleVisibility: (sectionId: string) => void;
  onReorder: (draggedId: string, targetId: string, position: "before" | "after") => void;
}

export const DragDropSection: React.FC<DragDropSectionProps> = ({
  children,
  sectionId,
  title,
  visible,
  order,
  onToggleVisibility,
  onReorder,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOver, setDragOver] = useState<"before" | "after" | null>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.setData("text/plain", sectionId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDragOver(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";

    if (!dragRef.current) return;

    const rect = dragRef.current.getBoundingClientRect();
    const midpoint = rect.top + rect.height / 2;
    const position = e.clientY < midpoint ? "before" : "after";
    setDragOver(position);
  };

  const handleDragLeave = () => {
    setDragOver(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData("text/plain");
    
    if (draggedId !== sectionId && dragOver) {
      onReorder(draggedId, sectionId, dragOver);
    }
    
    setDragOver(null);
  };

  const IconComponent = sectionIcons[sectionId as keyof typeof sectionIcons] || Settings;

  return (
    <div
      ref={dragRef}
      className={`relative transition-all duration-200 ${
        isDragging ? "opacity-50 scale-95" : ""
      } ${
        dragOver === "before" ? "border-t-4 border-blue-500" : ""
      } ${
        dragOver === "after" ? "border-b-4 border-blue-500" : ""
      }`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Card className={`${!visible ? "opacity-60" : ""}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="cursor-move p-1 hover:bg-gray-100 rounded">
                <GripVertical className="h-4 w-4 text-gray-400" />
              </div>
              <IconComponent className="h-5 w-5 text-blue-600" />
              <div>
                <CardTitle className="text-lg">{title}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    Order: {order + 1}
                  </Badge>
                  <Badge variant={visible ? "default" : "secondary"} className="text-xs">
                    {visible ? "Visible" : "Hidden"}
                  </Badge>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleVisibility(sectionId)}
                className="flex items-center gap-1"
              >
                {visible ? (
                  <>
                    <Eye className="h-4 w-4" />
                    <span className="text-xs">Hide</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="h-4 w-4" />
                    <span className="text-xs">Show</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        {visible && <CardContent>{children}</CardContent>}
      </Card>
    </div>
  );
};

// Section Manager Component
export const SectionManager: React.FC = () => {
  const { resumeData, reorderSections, toggleSectionVisibility } = useResumeStore();
  const { sections } = resumeData;

  const handleReorder = (draggedId: string, targetId: string, position: "before" | "after") => {
    const draggedIndex = sections.findIndex(s => s.id === draggedId);
    const targetIndex = sections.findIndex(s => s.id === targetId);
    
    if (draggedIndex === -1 || targetIndex === -1) return;

    const newSections = [...sections];
    const [draggedSection] = newSections.splice(draggedIndex, 1);
    
    let insertIndex = targetIndex;
    if (draggedIndex < targetIndex) {
      insertIndex = position === "before" ? targetIndex - 1 : targetIndex;
    } else {
      insertIndex = position === "before" ? targetIndex : targetIndex + 1;
    }
    
    newSections.splice(insertIndex, 0, draggedSection);
    
    // Update order values
    const updatedSections = newSections.map((section, index) => ({
      ...section,
      order: index,
    }));
    
    reorderSections(updatedSections);
  };

  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resume Sections</CardTitle>
        <CardDescription>
          Drag sections to reorder them, toggle visibility, and customize your resume layout
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {sortedSections.map((section) => (
          <DragDropSection
            key={section.id}
            sectionId={section.id}
            title={section.title}
            visible={section.visible}
            order={section.order}
            onToggleVisibility={toggleSectionVisibility}
            onReorder={handleReorder}
          >
            <div className="text-sm text-gray-600">
              {section.type === "personal" && "Your contact information and professional summary"}
              {section.type === "experience" && "Your work history and professional experience"}
              {section.type === "education" && "Your educational background and qualifications"}
              {section.type === "skills" && "Your technical and professional skills"}
              {section.type === "projects" && "Your notable projects and achievements"}
              {section.type === "certificates" && "Your certifications and credentials"}
              {section.type === "languages" && "Languages you speak and proficiency levels"}
              {section.type === "custom" && "Custom section content"}
            </div>
          </DragDropSection>
        ))}
        
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 text-blue-700 mb-2">
            <GripVertical className="h-4 w-4" />
            <span className="font-medium text-sm">Drag & Drop Tips</span>
          </div>
          <ul className="text-xs text-blue-600 space-y-1">
            <li>• Drag sections by the grip handle to reorder them</li>
            <li>• Toggle visibility to show/hide sections in your resume</li>
            <li>• Hidden sections won't appear in the final resume</li>
            <li>• Section order affects how they appear in your resume</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
