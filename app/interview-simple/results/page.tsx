"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useInterviewStore } from "@/lib/stores/interview-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Award,
  Eye,
  User,
  Volume2,
  TrendingUp,
  RotateCcw,
  Home,
  CheckCircle,
  AlertTriangle,
  Share2,
  Download,
} from "lucide-react";

export default function SimpleResultsPage() {
  const router = useRouter();
  const {
    analysisResults,
    questions,
    resetSession,
    recordedVideoBlob,
    videoDownloadUrl,
  } = useInterviewStore();
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Show details after a brief delay for better UX
    setTimeout(() => setShowDetails(true), 500);
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 9)
      return {
        label: "Excellent",
        color: "bg-green-100 text-green-800",
        emoji: "🌟",
      };
    if (score >= 7)
      return { label: "Good", color: "bg-blue-100 text-blue-800", emoji: "👍" };
    if (score >= 5)
      return {
        label: "Average",
        color: "bg-yellow-100 text-yellow-800",
        emoji: "👌",
      };
    return {
      label: "Needs Improvement",
      color: "bg-red-100 text-red-800",
      emoji: "📈",
    };
  };

  const handleRestart = () => {
    resetSession();
    router.push("/interview-simple");
  };

  // Handle video download
  const handleVideoDownload = () => {
    if (!videoDownloadUrl || !recordedVideoBlob) {
      alert("No video recording available for download");
      return;
    }

    // Create download link
    const link = document.createElement("a");
    link.href = videoDownloadUrl;
    link.download = `interview-recording-${
      new Date().toISOString().split("T")[0]
    }.webm`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const scoreBadge = getScoreBadge(analysisResults.overallScore);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Award className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">
                Interview Complete!
              </h1>
            </div>
            <p className="text-gray-600">
              Here's your performance summary from the AI interview analysis
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Overall Score */}
          <Card
            className={`transition-all duration-1000 ${
              showDetails
                ? "opacity-100 transform translate-y-0"
                : "opacity-0 transform translate-y-4"
            }`}
          >
            <CardContent className="pt-8">
              <div className="text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-32 h-32 rounded-full border-8 border-gray-200 flex items-center justify-center mx-auto relative">
                    <div
                      className={`absolute inset-0 rounded-full border-8 transition-all duration-2000 ${
                        analysisResults.overallScore >= 8
                          ? "border-green-500"
                          : analysisResults.overallScore >= 6
                          ? "border-yellow-500"
                          : "border-red-500"
                      }`}
                      style={{
                        background: `conic-gradient(${
                          analysisResults.overallScore >= 8
                            ? "#10b981"
                            : analysisResults.overallScore >= 6
                            ? "#f59e0b"
                            : "#ef4444"
                        } ${
                          showDetails ? analysisResults.overallScore * 36 : 0
                        }deg, transparent 0deg)`,
                        transition: "background 2s ease-in-out",
                      }}
                    ></div>
                    <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center relative z-10">
                      <span
                        className={`text-2xl font-bold ${getScoreColor(
                          analysisResults.overallScore * 10
                        )}`}
                      >
                        {analysisResults.overallScore}/10
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <span className="text-4xl mb-2 block">
                    {scoreBadge.emoji}
                  </span>
                  <div
                    className={`inline-block px-4 py-2 rounded-full text-lg font-semibold ${scoreBadge.color} mb-2`}
                  >
                    {scoreBadge.label}
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Overall Interview Performance
                </h2>
                <p className="text-gray-600">
                  You completed {questions.length} questions with AI video
                  analysis
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Performance Breakdown */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card
              className={`transition-all duration-1000 delay-300 ${
                showDetails
                  ? "opacity-100 transform translate-y-0"
                  : "opacity-0 transform translate-y-4"
              }`}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium">Confidence</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-1000 delay-500 ${
                            analysisResults.confidence >= 80
                              ? "bg-green-500"
                              : analysisResults.confidence >= 60
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{
                            width: showDetails
                              ? `${analysisResults.confidence}%`
                              : "0%",
                          }}
                        ></div>
                      </div>
                      <span
                        className={`text-sm font-semibold ${getScoreColor(
                          analysisResults.confidence
                        )}`}
                      >
                        {analysisResults.confidence}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium">Eye Contact</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-1000 delay-700 ${
                            analysisResults.eyeContact >= 80
                              ? "bg-green-500"
                              : analysisResults.eyeContact >= 60
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{
                            width: showDetails
                              ? `${analysisResults.eyeContact}%`
                              : "0%",
                          }}
                        ></div>
                      </div>
                      <span
                        className={`text-sm font-semibold ${getScoreColor(
                          analysisResults.eyeContact
                        )}`}
                      >
                        {analysisResults.eyeContact}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium">Posture</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-1000 delay-900 ${
                            analysisResults.posture >= 80
                              ? "bg-green-500"
                              : analysisResults.posture >= 60
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{
                            width: showDetails
                              ? `${analysisResults.posture}%`
                              : "0%",
                          }}
                        ></div>
                      </div>
                      <span
                        className={`text-sm font-semibold ${getScoreColor(
                          analysisResults.posture
                        )}`}
                      >
                        {analysisResults.posture}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Volume2 className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium">Engagement</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-1000 delay-1100 ${
                            analysisResults.engagement >= 80
                              ? "bg-green-500"
                              : analysisResults.engagement >= 60
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{
                            width: showDetails
                              ? `${analysisResults.engagement}%`
                              : "0%",
                          }}
                        ></div>
                      </div>
                      <span
                        className={`text-sm font-semibold ${getScoreColor(
                          analysisResults.engagement
                        )}`}
                      >
                        {analysisResults.engagement}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              className={`transition-all duration-1000 delay-500 ${
                showDetails
                  ? "opacity-100 transform translate-y-0"
                  : "opacity-0 transform translate-y-4"
              }`}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  Key Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analysisResults.suggestions.length > 0 ? (
                  <ul className="space-y-3">
                    {analysisResults.suggestions
                      .slice(0, 4)
                      .map((suggestion, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-sm"
                        >
                          <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{suggestion}</span>
                        </li>
                      ))}
                  </ul>
                ) : (
                  <div className="text-center py-4">
                    <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      Great job! No major areas for improvement detected.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div
            className={`grid md:grid-cols-4 gap-4 transition-all duration-1000 delay-700 ${
              showDetails
                ? "opacity-100 transform translate-y-0"
                : "opacity-0 transform translate-y-4"
            }`}
          >
            <Button onClick={handleRestart} className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              Practice Again
            </Button>

            <Button
              variant="outline"
              asChild
              className="flex items-center gap-2"
            >
              <Link href="/interview-practice">
                <TrendingUp className="h-4 w-4" />
                Advanced Practice
              </Link>
            </Button>

            <Button
              variant="outline"
              onClick={handleVideoDownload}
              disabled={!videoDownloadUrl || !recordedVideoBlob}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {recordedVideoBlob ? "Download Video" : "No Video Available"}
            </Button>

            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Back to Home
            </Button>
          </div>

          {/* Video Recording Info */}
          {recordedVideoBlob && (
            <Card
              className={`bg-blue-50 border-blue-200 transition-all duration-1000 delay-800 ${
                showDetails
                  ? "opacity-100 transform translate-y-0"
                  : "opacity-0 transform translate-y-4"
              }`}
            >
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-2">
                  <Download className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-900">
                    Video Recording Available
                  </span>
                </div>
                <p className="text-sm text-blue-800 mb-3">
                  Your interview session was recorded locally. You can download
                  it for review or sharing.
                </p>
                <div className="flex items-center gap-4 text-xs text-blue-700">
                  <span>📹 Format: WebM</span>
                  <span>
                    💾 Size:{" "}
                    {Math.round((recordedVideoBlob.size / 1024 / 1024) * 100) /
                      100}{" "}
                    MB
                  </span>
                  <span>🔒 Stored locally only</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Privacy Notice */}
          <Card
            className={`bg-green-50 border-green-200 transition-all duration-1000 delay-900 ${
              showDetails
                ? "opacity-100 transform translate-y-0"
                : "opacity-0 transform translate-y-4"
            }`}
          >
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-900">
                  Privacy Protected
                </span>
              </div>
              <p className="text-sm text-green-800 mt-1">
                All video analysis was performed locally in your browser.
                {recordedVideoBlob
                  ? " Your video recording is stored locally and can be downloaded. No data was transmitted to servers."
                  : " No video or audio data was stored or transmitted to any servers."}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
