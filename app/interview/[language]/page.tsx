"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Play,
  BookOpen,
  Video,
  Download,
  Clock,
  Trophy,
  BarChart3,
  Mic,
  Code,
  Users,
  Star,
  ArrowLeft,
  Settings,
  Target,
} from "lucide-react";
import { toast } from "sonner";

interface LanguageData {
  id: string;
  name: string;
  slug: string;
  description: string;
  color_code: string;
  difficulty_level: string;
  github_repo_url: string;
  documentation_url: string;
  statistics?: {
    total_questions: number;
    beginner_questions: number;
    intermediate_questions: number;
    advanced_questions: number;
    total_sessions: number;
    avg_score: number;
    avg_confidence: number;
    video_count: number;
  };
}

interface UserProgress {
  total_sessions: number;
  avg_score: number;
  avg_confidence: number;
  last_session_date: string;
  weak_categories: string[];
  strong_categories: string[];
}

export default function LanguageInterviewPage() {
  const params = useParams();
  const language = params.language as string;

  const [languageData, setLanguageData] = useState<LanguageData | null>(null);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [sessionSettings, setSessionSettings] = useState({
    questionCount: 10,
    timeLimit: 300, // 5 minutes per question
    includeVoiceAnalysis: true,
    difficulty: "mixed",
  });

  useEffect(() => {
    if (language) {
      fetchLanguageData();
      // Remove progress fetching for public access
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

  const fetchUserProgress = async () => {
    try {
      const response = await fetch(`/api/interview/progress/${language}`);

      if (response.ok) {
        const data = await response.json();
        setUserProgress(data.progress);
      } else if (response.status === 401) {
        // User not authenticated, which is fine for demo
        console.log("User not authenticated - skipping progress");
      } else {
        // User might not have any progress yet, which is fine
        console.log("No user progress found");
      }
    } catch (error) {
      console.error("Error fetching user progress:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const startInterviewSession = async () => {
    try {
      const response = await fetch("/api/interview/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          languageId: languageData?.id,
          sessionSettings,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Redirect to interview session page
        window.location.href = `/interview/session/${data.sessionId}`;
      } else {
        toast.error("Failed to start interview session");
      }
    } catch (error) {
      console.error("Error starting interview session:", error);
      toast.error("Network error while starting session");
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading interview platform...</p>
        </div>
      </div>
    );
  }

  if (!languageData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Code className="h-16 w-16 text-gray-400 mx-auto mb-4" />
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
              <Link href="/interview">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Languages
              </Link>
            </Button>
          </div>

          <div className="max-w-4xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-white/20 rounded-lg">
                <Code className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">
                  {languageData.name} Interview Prep
                </h1>
                <p className="text-lg text-white/90 mt-1">
                  {languageData.description}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Badge
                className={`${getDifficultyColor(
                  languageData.difficulty_level
                )} border-0`}
              >
                {languageData.difficulty_level}
              </Badge>
              <Badge
                variant="secondary"
                className="bg-white/20 text-white border-0"
              >
                {languageData.statistics?.total_questions || 0} Questions
              </Badge>
              <Badge
                variant="secondary"
                className="bg-white/20 text-white border-0"
              >
                {languageData.statistics?.video_count || 0} Tutorial Videos
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Start */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5 text-blue-600" />
                  Quick Start Interview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">
                  Start a mock interview session with AI-powered voice analysis
                  and instant feedback.
                </p>

                {/* Session Settings */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Number of Questions
                    </label>
                    <select
                      value={sessionSettings.questionCount}
                      onChange={(e) =>
                        setSessionSettings((prev) => ({
                          ...prev,
                          questionCount: parseInt(e.target.value),
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={5}>5 Questions</option>
                      <option value={10}>10 Questions</option>
                      <option value={15}>15 Questions</option>
                      <option value={20}>20 Questions</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Difficulty Level
                    </label>
                    <select
                      value={sessionSettings.difficulty}
                      onChange={(e) =>
                        setSessionSettings((prev) => ({
                          ...prev,
                          difficulty: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="mixed">Mixed Difficulty</option>
                      <option value="beginner">Beginner Only</option>
                      <option value="intermediate">Intermediate Only</option>
                      <option value="advanced">Advanced Only</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="voiceAnalysis"
                    checked={sessionSettings.includeVoiceAnalysis}
                    onChange={(e) =>
                      setSessionSettings((prev) => ({
                        ...prev,
                        includeVoiceAnalysis: e.target.checked,
                      }))
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="voiceAnalysis"
                    className="text-sm text-gray-700"
                  >
                    Enable voice analysis and confidence scoring
                  </label>
                </div>

                <Button
                  onClick={startInterviewSession}
                  size="lg"
                  className="w-full"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Interview Session
                </Button>
              </CardContent>
            </Card>

            {/* Question Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-green-600" />
                  Question Categories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {languageData.statistics?.beginner_questions || 0}
                    </div>
                    <div className="text-sm text-gray-600">Beginner</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {languageData.statistics?.intermediate_questions || 0}
                    </div>
                    <div className="text-sm text-gray-600">Intermediate</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {languageData.statistics?.advanced_questions || 0}
                    </div>
                    <div className="text-sm text-gray-600">Advanced</div>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button variant="outline" asChild className="flex-1">
                    <Link href={`/interview/${language}/questions`}>
                      <BookOpen className="h-4 w-4 mr-2" />
                      Browse Questions
                    </Link>
                  </Button>
                  <Button variant="outline" asChild className="flex-1">
                    <Link href={`/interview/${language}/pdf`}>
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tutorial Videos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5 text-purple-600" />
                  Expert Tutorial Videos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Learn from industry experts with curated tutorial videos
                  covering key concepts and interview tips.
                </p>
                <Button asChild className="w-full">
                  <Link href={`/interview/${language}/tutorials`}>
                    <Video className="h-4 w-4 mr-2" />
                    Watch Tutorial Videos
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Progress */}
            {userProgress && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    Your Progress
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Average Score</span>
                      <span>{userProgress?.avg_score?.toFixed(1) || "0"}%</span>
                    </div>
                    <Progress
                      value={userProgress?.avg_score || 0}
                      className="h-2"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Confidence Level</span>
                      <span>
                        {userProgress?.avg_confidence?.toFixed(1) || "0"}%
                      </span>
                    </div>
                    <Progress
                      value={userProgress?.avg_confidence || 0}
                      className="h-2"
                    />
                  </div>

                  <div className="text-sm text-gray-600">
                    <div>
                      Sessions Completed: {userProgress?.total_sessions || 0}
                    </div>
                    <div>
                      Last Session:{" "}
                      {userProgress?.last_session_date
                        ? new Date(
                            userProgress.last_session_date
                          ).toLocaleDateString()
                        : "Never"}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle>Learning Resources</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="ghost"
                  asChild
                  className="w-full justify-start"
                >
                  <Link href={`/interview/${language}/questions`}>
                    <Code className="h-4 w-4 mr-2" />
                    Interview Questions
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  asChild
                  className="w-full justify-start"
                >
                  <Link href={`/interview/${language}/tutorials`}>
                    <BookOpen className="h-4 w-4 mr-2" />
                    Tutorials & Guides
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  asChild
                  className="w-full justify-start"
                >
                  <Link
                    href={languageData?.github_repo_url || "#"}
                    target="_blank"
                  >
                    <Code className="h-4 w-4 mr-2" />
                    GitHub Repository
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  asChild
                  className="w-full justify-start"
                >
                  <Link
                    href={languageData?.documentation_url || "#"}
                    target="_blank"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Official Documentation
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Platform Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Sessions</span>
                  <span className="font-semibold">
                    {languageData.statistics?.total_sessions || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Average Score</span>
                  <span className="font-semibold">
                    {languageData.statistics?.avg_score?.toFixed(1) || 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Success Rate</span>
                  <span className="font-semibold text-green-600">95%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
