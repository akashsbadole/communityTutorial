"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  CheckCircle,
  Play,
  Plus,
  Video,
  ExternalLink,
} from "lucide-react";
import { getTutorials, Tutorial } from "@/lib/tutorial-content";
import { toast } from "sonner";

interface LanguageData {
  id: string;
  name: string;
  slug: string;
  color_code: string;
}

export default function TutorialsPage() {
  const params = useParams();
  const language = params.language as string;

  const [languageData, setLanguageData] = useState<LanguageData | null>(null);
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [showAddVideo, setShowAddVideo] = useState(false);
  const [videoForm, setVideoForm] = useState({
    title: "",
    description: "",
    videoUrl: "",
    difficulty: "intermediate",
    duration: "",
    instructorName: "",
  });

  useEffect(() => {
    if (language) {
      fetchLanguageData();
      loadTutorials();
    }
  }, [language]);

  const fetchLanguageData = async () => {
    try {
      const response = await fetch(`/api/interview/languages/${language}`);
      if (response.ok) {
        const data = await response.json();
        setLanguageData(data.language);
      }
    } catch (error) {
      console.error("Error fetching language data:", error);
    }
  };

  const loadTutorials = async () => {
    try {
      // First try to load from API (includes stored videos)
      const response = await fetch(`/api/interview/tutorials/${language}`);
      if (response.ok) {
        const data = await response.json();
        setTutorials(data.tutorials);
      } else {
        // Fallback to static tutorials
        const tutorialList = getTutorials(language);
        setTutorials(tutorialList);
      }
    } catch (error) {
      console.error("Error loading tutorials:", error);
      // Fallback to static tutorials
      try {
        const tutorialList = getTutorials(language);
        setTutorials(tutorialList);
      } catch (fallbackError) {
        console.error("Error loading static tutorials:", fallbackError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddVideo = async () => {
    if (!videoForm.title || !videoForm.description || !videoForm.videoUrl) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const response = await fetch(`/api/interview/tutorials/${language}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(videoForm),
      });

      if (response.ok) {
        const data = await response.json();
        toast.success("Video tutorial added successfully!");
        setShowAddVideo(false);
        setVideoForm({
          title: "",
          description: "",
          videoUrl: "",
          difficulty: "intermediate",
          duration: "",
          instructorName: "",
        });
        // Reload tutorials
        loadTutorials();
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to add video tutorial");
      }
    } catch (error) {
      console.error("Error adding video tutorial:", error);
      toast.error("Network error while adding video tutorial");
    }
  };

  const filteredTutorials = tutorials.filter(
    (tutorial) =>
      selectedDifficulty === "all" || tutorial.difficulty === selectedDifficulty
  );

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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tutorials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" asChild>
              <Link href={`/interview/${language}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to {languageData?.name || language}
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div
              className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg"
              style={{ backgroundColor: languageData?.color_code || "#6366f1" }}
            >
              {languageData?.name?.charAt(0) ||
                language.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Learn {languageData?.name || language}
              </h1>
              <p className="text-lg text-gray-600">
                Interactive tutorials like W3Schools and MDN
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-2">
              {["all", "beginner", "intermediate", "advanced"].map(
                (difficulty) => (
                  <Button
                    key={difficulty}
                    variant={
                      selectedDifficulty === difficulty ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => setSelectedDifficulty(difficulty)}
                    className="capitalize"
                  >
                    {difficulty === "all" ? "All Levels" : difficulty}
                  </Button>
                )
              )}
            </div>

            <Button
              onClick={() => setShowAddVideo(true)}
              className="flex items-center gap-2"
              variant="outline"
            >
              <Plus className="h-4 w-4" />
              Add Video Tutorial
            </Button>
          </div>

          {/* Add Video Form */}
          {showAddVideo && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Add YouTube Tutorial Video
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={videoForm.title}
                      onChange={(e) =>
                        setVideoForm((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter tutorial title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      YouTube URL *
                    </label>
                    <input
                      type="url"
                      value={videoForm.videoUrl}
                      onChange={(e) =>
                        setVideoForm((prev) => ({
                          ...prev,
                          videoUrl: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://youtube.com/watch?v=..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    value={videoForm.description}
                    onChange={(e) =>
                      setVideoForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Describe what this tutorial covers"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Difficulty
                    </label>
                    <select
                      value={videoForm.difficulty}
                      onChange={(e) =>
                        setVideoForm((prev) => ({
                          ...prev,
                          difficulty: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={videoForm.duration}
                      onChange={(e) =>
                        setVideoForm((prev) => ({
                          ...prev,
                          duration: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 30 minutes"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Instructor Name
                    </label>
                    <input
                      type="text"
                      value={videoForm.instructorName}
                      onChange={(e) =>
                        setVideoForm((prev) => ({
                          ...prev,
                          instructorName: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Instructor name"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleAddVideo} className="flex-1">
                    <Video className="h-4 w-4 mr-2" />
                    Add Video Tutorial
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowAddVideo(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTutorials.map((tutorial) => (
            <Card
              key={tutorial.id}
              className="hover:shadow-xl transition-all duration-300"
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-3">
                  <Badge className={getDifficultyColor(tutorial.difficulty)}>
                    {tutorial.difficulty}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    {tutorial.estimatedTime}
                  </div>
                </div>
                <CardTitle className="text-xl mb-2">{tutorial.title}</CardTitle>
                <p className="text-gray-600 text-sm">{tutorial.description}</p>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {tutorial.prerequisites &&
                    tutorial.prerequisites.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">
                          Prerequisites:
                        </h4>
                        <div className="flex flex-wrap gap-1">
                          {tutorial.prerequisites.map((prereq, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {prereq}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                      You'll learn:
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {tutorial.whatYouWillLearn
                        .slice(0, 3)
                        .map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>
                      {tutorial.sections?.length
                        ? `${tutorial.sections.length} sections`
                        : tutorial.type === "video"
                        ? "Video Tutorial"
                        : "External Resource"}
                    </span>
                    <span className="flex items-center gap-1">
                      {tutorial.type === "video" ? (
                        <>
                          <Video className="h-3 w-3" />
                          {tutorial.isStored ? "Stored" : "Video"}
                        </>
                      ) : (
                        <>
                          <ExternalLink className="h-3 w-3" />
                          External
                        </>
                      )}
                    </span>
                  </div>

                  {tutorial.type === "video" || !tutorial.sections ? (
                    <Button asChild className="w-full" size="lg">
                      <Link
                        href={tutorial.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {tutorial.type === "video"
                          ? "Watch Video"
                          : "Open Tutorial"}
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  ) : (
                    <Button asChild className="w-full" size="lg">
                      <Link
                        href={`/interview/${language}/tutorials/${tutorial.id}`}
                      >
                        Start Tutorial
                        <Play className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTutorials.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No tutorials found
            </h3>
            <p className="text-gray-600">
              No tutorials available for the selected difficulty level.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
