"use client";

import React from "react";
import { useResumeStore } from "@/lib/stores/resume-store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Download,
  Save,
  Eye,
  Edit3,
  Palette,
  Layout,
  ArrowLeft,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { ResumeBuilder } from "@/components/resume/ResumeBuilder";
import { ResumePreview } from "@/components/resume/ResumePreview";

export default function ResumePage() {
  const {
    currentStep,
    setCurrentStep,
    selectedTemplate,
    availableTemplates,
    setTemplate,
    hasUnsavedChanges,
    saveResume,
    exportResume,
    isExporting,
  } = useResumeStore();

  const handleSave = async () => {
    try {
      await saveResume();
      toast.success("Resume saved successfully!");
    } catch (error) {
      toast.error("Failed to save resume. Please try again.");
    }
  };

  const handleExport = async (format: "pdf" | "docx" | "html") => {
    try {
      await exportResume(format);
      toast.success(`Resume exported as ${format.toUpperCase()}!`);
    } catch (error) {
      toast.error(`Failed to export resume as ${format.toUpperCase()}.`);
    }
  };

  const steps = [
    { id: "template", title: "Choose Template", icon: Palette },
    { id: "content", title: "Add Content", icon: Edit3 },
    { id: "preview", title: "Preview & Export", icon: Eye },
  ];

  const currentStepIndex = steps.findIndex((step) => step.id === currentStep);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <FileText className="h-8 w-8 text-blue-600" />
                <h1 className="text-2xl font-bold text-gray-900">
                  Resume Builder
                </h1>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                <Sparkles className="h-3 w-3 mr-1" />
                AI-Powered
              </Badge>
            </div>

            <div className="flex items-center gap-3">
              {hasUnsavedChanges && (
                <Badge
                  variant="outline"
                  className="text-orange-600 border-orange-200"
                >
                  Unsaved changes
                </Badge>
              )}

              <Button
                variant="outline"
                onClick={handleSave}
                disabled={!hasUnsavedChanges}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save
              </Button>

              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport("pdf")}
                  disabled={isExporting}
                  className="flex items-center gap-1"
                >
                  <Download className="h-3 w-3" />
                  PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExport("docx")}
                  disabled={isExporting}
                  className="flex items-center gap-1"
                >
                  <Download className="h-3 w-3" />
                  DOCX
                </Button>
              </div>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mt-6">
            <div className="flex items-center gap-4">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = step.id === currentStep;
                const isCompleted = index < currentStepIndex;

                return (
                  <React.Fragment key={step.id}>
                    <div
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all ${
                        isActive
                          ? "bg-blue-100 text-blue-700 border-2 border-blue-200"
                          : isCompleted
                          ? "bg-green-100 text-green-700 border-2 border-green-200"
                          : "bg-gray-100 text-gray-500 border-2 border-gray-200 hover:bg-gray-200"
                      }`}
                      onClick={() => setCurrentStep(step.id as any)}
                    >
                      <StepIcon className="h-4 w-4" />
                      <span className="font-medium text-sm">{step.title}</span>
                    </div>
                    {index < steps.length - 1 && (
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {currentStep === "template" && (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Choose Your Resume Template
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Select a professional template that matches your style and
                industry. All templates are ATS-friendly and fully customizable.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {availableTemplates.map((template) => (
                <Card
                  key={template.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedTemplate?.id === template.id
                      ? "ring-2 ring-blue-500 shadow-lg"
                      : "hover:shadow-md"
                  }`}
                  onClick={() => setTemplate(template)}
                >
                  <CardHeader className="pb-3">
                    <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-3 flex items-center justify-center">
                      <Layout className="h-12 w-12 text-gray-400" />
                    </div>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription className="text-sm">
                      {template.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{
                          backgroundColor: template.colorScheme.primary,
                        }}
                      />
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: template.colorScheme.accent }}
                      />
                      <span className="text-xs text-gray-500 ml-1">
                        {template.layout}
                      </span>
                    </div>
                    {selectedTemplate?.id === template.id && (
                      <Badge className="w-full justify-center bg-blue-600">
                        Selected
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-center mt-8">
              <Button
                onClick={() => setCurrentStep("content")}
                disabled={!selectedTemplate}
                className="px-8 py-3 text-lg"
              >
                Continue to Content
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {currentStep === "content" && (
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Build Your Resume Content
              </h2>
              <p className="text-gray-600">
                Add your information and drag sections to reorder them.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Content Editor */}
              <div className="space-y-6">
                <ResumeBuilder />
              </div>

              {/* Live Preview */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Live Preview</CardTitle>
                    <CardDescription>
                      See how your resume looks in real-time
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="transform scale-75 origin-top-left w-[133%]">
                      <ResumePreview />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentStep("template")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Templates
              </Button>
              <Button
                onClick={() => setCurrentStep("preview")}
                className="flex items-center gap-2"
              >
                Preview & Export
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {currentStep === "preview" && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Preview & Export Your Resume
              </h2>
              <p className="text-gray-600">
                Review your resume and export it in your preferred format.
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <ResumePreview />
            </div>

            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentStep("content")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Editor
              </Button>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleExport("pdf")}
                  disabled={isExporting}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export PDF
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleExport("docx")}
                  disabled={isExporting}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export DOCX
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
