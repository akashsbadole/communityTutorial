"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  FileText,
  Settings,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

interface LanguageData {
  id: string;
  name: string;
  slug: string;
  description: string;
  color_code: string;
  statistics?: {
    total_questions: number;
    beginner_questions: number;
    intermediate_questions: number;
    advanced_questions: number;
  };
}

export default function PDFDownloadPage() {
  const params = useParams();
  const router = useRouter();
  const language = params.language as string;

  const [languageData, setLanguageData] = useState<LanguageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfSettings, setPdfSettings] = useState({
    difficulty: "all",
    includeAnswers: true,
    includeCodeExamples: true,
    format: "html",
  });

  useEffect(() => {
    if (language) {
      fetchLanguageData();
    }
  }, [language]);

  const fetchLanguageData = async () => {
    try {
      const response = await fetch(
        `/api/interview/languages/${language}?includeStats=true`
      );

      if (response.ok) {
        const data = await response.json();
        setLanguageData(data.language);
      } else {
        console.error("Failed to fetch language data:", response.status);
        toast.error("Failed to fetch language data");
      }
    } catch (error) {
      console.error("Error fetching language data:", error);
      toast.error("Network error while fetching language data");
    } finally {
      setIsLoading(false);
    }
  };

  const generatePDF = async () => {
    if (!languageData) return;

    setIsGenerating(true);
    try {
      // Store preferences first
      await fetch(`/api/interview/${language}/pdf`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pdfSettings),
      });

      // Generate PDF
      const params = new URLSearchParams({
        difficulty: pdfSettings.difficulty,
        includeAnswers: pdfSettings.includeAnswers.toString(),
        includeCodeExamples: pdfSettings.includeCodeExamples.toString(),
      });

      const response = await fetch(
        `/api/interview/${language}/pdf?${params.toString()}`
      );

      if (response.ok) {
        const htmlContent = await response.text();
        
        // Open in new window for PDF generation
        const newWindow = window.open("", "_blank");
        if (newWindow) {
          newWindow.document.write(htmlContent);
          newWindow.document.close();
          toast.success("PDF generated successfully! Check the new window.");
        } else {
          // Fallback: download as HTML file
          const blob = new Blob([htmlContent], { type: "text/html" });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${languageData.name}_interview_questions.html`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          toast.success("PDF downloaded as HTML file!");
        }
      } else {
        toast.error("Failed to generate PDF");
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.error("Network error while generating PDF");
    } finally {
      setIsGenerating(false);
    }
  };

  const getQuestionCount = (difficulty: string) => {
    if (!languageData?.statistics) return 0;
    
    switch (difficulty) {
      case "beginner":
        return languageData.statistics.beginner_questions;
      case "intermediate":
        return languageData.statistics.intermediate_questions;
      case "advanced":
        return languageData.statistics.advanced_questions;
      case "all":
        return languageData.statistics.total_questions;
      default:
        return 0;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading PDF generator...</p>
        </div>
      </div>
    );
  }

  if (!languageData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Language Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The requested programming language could not be found.
          </p>
          <Button asChild>
            <Link href="/interview">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Languages
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div
        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
        style={{
          background: `linear-gradient(135deg, ${languageData.color_code}dd, ${languageData.color_code}aa)`,
        }}
      >
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-white hover:bg-white/20"
            >
              <Link href={`/interview/${language}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to {languageData.name}
              </Link>
            </Button>
          </div>

          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <FileText className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">
                  Download {languageData.name} Questions
                </h1>
                <p className="text-lg text-white/90 mt-1">
                  Generate a PDF with interview questions and answers
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Settings */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-blue-600" />
                    PDF Generation Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Difficulty Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Difficulty Level
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { value: "all", label: "All Levels", count: getQuestionCount("all") },
                        { value: "beginner", label: "Beginner", count: getQuestionCount("beginner") },
                        { value: "intermediate", label: "Intermediate", count: getQuestionCount("intermediate") },
                        { value: "advanced", label: "Advanced", count: getQuestionCount("advanced") },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() =>
                            setPdfSettings((prev) => ({
                              ...prev,
                              difficulty: option.value,
                            }))
                          }
                          className={`p-3 border rounded-lg text-center transition-colors ${
                            pdfSettings.difficulty === option.value
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-gray-300 hover:border-gray-400"
                          }`}
                        >
                          <div className="font-medium">{option.label}</div>
                          <div className="text-sm text-gray-500">
                            {option.count} questions
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Content Options */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Content Options
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={pdfSettings.includeAnswers}
                          onChange={(e) =>
                            setPdfSettings((prev) => ({
                              ...prev,
                              includeAnswers: e.target.checked,
                            }))
                          }
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm">Include answers and explanations</span>
                      </label>
                      <label className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={pdfSettings.includeCodeExamples}
                          onChange={(e) =>
                            setPdfSettings((prev) => ({
                              ...prev,
                              includeCodeExamples: e.target.checked,
                            }))
                          }
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm">Include code examples</span>
                      </label>
                    </div>
                  </div>

                  {/* Generate Button */}
                  <div className="pt-4">
                    <Button
                      onClick={generatePDF}
                      disabled={isGenerating}
                      size="lg"
                      className="w-full"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating PDF...
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          Generate & Download PDF
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Preview */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-sm text-gray-600">
                    <div className="flex items-center justify-between mb-2">
                      <span>Language:</span>
                      <Badge variant="secondary">{languageData.name}</Badge>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span>Difficulty:</span>
                      <Badge variant="outline">
                        {pdfSettings.difficulty === "all" ? "All Levels" : pdfSettings.difficulty}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span>Questions:</span>
                      <span className="font-medium">
                        {getQuestionCount(pdfSettings.difficulty)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span>Include Answers:</span>
                      {pdfSettings.includeAnswers ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <span className="text-gray-400">No</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Code Examples:</span>
                      {pdfSettings.includeCodeExamples ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <span className="text-gray-400">No</span>
                      )}
                    </div>
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-xs text-gray-500">
                      The PDF will be generated as an HTML file that you can save as PDF using your browser's print function.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
