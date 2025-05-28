"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Code,
  Play,
  Eye,
  CheckCircle,
  Clock,
  List,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { getTutorial, Tutorial } from "@/lib/tutorial-content";
import {
  getTutorialInterviewQuestions,
  TutorialInterviewQuestion,
} from "@/lib/tutorial-interview-questions";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface LanguageData {
  id: string;
  name: string;
  slug: string;
  color_code: string;
}

export default function TutorialPage() {
  const params = useParams();
  const language = params.language as string;
  const tutorialId = params.tutorialId as string;

  const [languageData, setLanguageData] = useState<LanguageData | null>(null);
  const [tutorial, setTutorial] = useState<Tutorial | null>(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(true);
  const [interviewQuestions, setInterviewQuestions] = useState<
    TutorialInterviewQuestion[]
  >([]);
  const [openQuestions, setOpenQuestions] = useState<Record<string, boolean>>(
    {}
  );

  useEffect(() => {
    if (language && tutorialId) {
      fetchLanguageData();
      loadTutorial();
    }
  }, [language, tutorialId]);

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

  const loadTutorial = () => {
    try {
      const tutorialData = getTutorial(language, tutorialId);
      setTutorial(tutorialData);

      // Load interview questions for this language
      const questions = getTutorialInterviewQuestions(language);
      setInterviewQuestions(questions);
    } catch (error) {
      console.error("Error loading tutorial:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const currentSection = tutorial?.sections[currentSectionIndex];
  const isFirstSection = currentSectionIndex === 0;
  const isLastSection =
    currentSectionIndex === (tutorial?.sections.length || 0) - 1;

  const nextSection = () => {
    if (!isLastSection) {
      setCurrentSectionIndex((prev) => prev + 1);
    }
  };

  const prevSection = () => {
    if (!isFirstSection) {
      setCurrentSectionIndex((prev) => prev - 1);
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

  const toggleQuestion = (questionId: string) => {
    setOpenQuestions((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tutorial...</p>
        </div>
      </div>
    );
  }

  if (!tutorial) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Tutorial not found
          </h3>
          <p className="text-gray-600 mb-6">
            The tutorial you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link href={`/interview/${language}/tutorials`}>
              Back to Tutorials
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              asChild
              className="text-white hover:bg-white/20"
            >
              <Link href={`/interview/${language}/tutorials`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Tutorials
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-white/20 font-bold text-lg">
              {languageData?.name?.charAt(0) ||
                language.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-1">{tutorial.title}</h1>
              <div className="flex items-center gap-4 text-sm text-blue-100">
                <Badge className={getDifficultyColor(tutorial.difficulty)}>
                  {tutorial.difficulty}
                </Badge>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {tutorial.estimatedTime}
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  {tutorial.sections.length} sections
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        {showSidebar && (
          <div className="w-80 bg-gray-50 border-r border-gray-200 min-h-screen">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">
                  Table of Contents
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSidebar(false)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                {tutorial.sections.map((section, index) => (
                  <button
                    key={section.id}
                    onClick={() => setCurrentSectionIndex(index)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      index === currentSectionIndex
                        ? "bg-blue-100 text-blue-900 border border-blue-200"
                        : "hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {index + 1}. {section.title}
                      </span>
                      {index < currentSectionIndex && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1">
          {!showSidebar && (
            <div className="p-4 border-b border-gray-200">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSidebar(true)}
              >
                <List className="h-4 w-4 mr-2" />
                Show Contents
              </Button>
            </div>
          )}

          <div className="max-w-4xl mx-auto p-8">
            {/* Section Content */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm text-gray-500">
                  Section {currentSectionIndex + 1} of{" "}
                  {tutorial.sections.length}
                </span>
                <Separator orientation="vertical" className="h-4" />
                <span className="text-sm text-gray-500">
                  {currentSection?.title}
                </span>
              </div>

              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {currentSection?.title}
              </h2>

              {/* Content */}
              <div className="prose prose-lg max-w-none mb-8">
                <div
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html:
                      currentSection?.content.replace(/\n/g, "<br>") || "",
                  }}
                />
              </div>

              {/* Code Example */}
              {currentSection?.codeExample && (
                <Card className="mb-8">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Code className="h-5 w-5" />
                      Example
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                      <pre className="text-sm">
                        <code>{currentSection.codeExample}</code>
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Try It Yourself */}
              {currentSection?.tryItYourself && (
                <Card className="mb-8 border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg text-green-800">
                      <Play className="h-5 w-5" />
                      Try It Yourself
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
                      <pre className="text-sm">
                        <code>{currentSection.tryItYourself}</code>
                      </pre>
                    </div>
                    {currentSection.output && (
                      <div>
                        <h4 className="font-semibold text-green-800 mb-2">
                          Expected Output:
                        </h4>
                        <div className="bg-gray-100 p-3 rounded border text-sm font-mono">
                          <pre>{currentSection.output}</pre>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Tips */}
              {currentSection?.tips && currentSection.tips.length > 0 && (
                <Card className="mb-8 border-blue-200 bg-blue-50">
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-800">
                      💡 Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {currentSection.tips.map((tip, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-blue-700"
                        >
                          <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-8 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={prevSection}
                disabled={isFirstSection}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>

              <div className="text-sm text-gray-500">
                {currentSectionIndex + 1} / {tutorial.sections.length}
              </div>

              <Button
                onClick={nextSection}
                disabled={isLastSection}
                className="flex items-center gap-2"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Completion */}
            {isLastSection && (
              <Card className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                <CardContent className="py-8 text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Congratulations! 🎉
                  </h3>
                  <p className="text-gray-600 mb-6">
                    You've completed the {tutorial.title} tutorial!
                  </p>
                  <div className="flex justify-center gap-4">
                    <Button variant="outline" asChild>
                      <Link href={`/interview/${language}/tutorials`}>
                        More Tutorials
                      </Link>
                    </Button>
                    <Button asChild>
                      <Link href={`/interview/${language}/questions`}>
                        Practice Questions
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Interview Questions Section */}
            <div className="mt-16">
              <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl text-blue-900">
                    <HelpCircle className="h-6 w-6" />
                    Interview Questions for {languageData?.name || language}
                  </CardTitle>
                  <p className="text-blue-700">
                    Test your knowledge with these {interviewQuestions.length}{" "}
                    interview questions
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {interviewQuestions.map((question, index) => (
                      <Collapsible
                        key={question.id}
                        open={openQuestions[question.id]}
                        onOpenChange={() => toggleQuestion(question.id)}
                      >
                        <CollapsibleTrigger asChild>
                          <Card className="cursor-pointer hover:shadow-md transition-shadow border border-gray-200">
                            <CardHeader className="pb-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                    Q{index + 1}
                                  </span>
                                  <Badge
                                    className={getDifficultyColor(
                                      question.difficulty
                                    )}
                                  >
                                    {question.difficulty}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {question.category}
                                  </Badge>
                                </div>
                                {openQuestions[question.id] ? (
                                  <ChevronUp className="h-5 w-5 text-gray-500" />
                                ) : (
                                  <ChevronDown className="h-5 w-5 text-gray-500" />
                                )}
                              </div>
                              <h3 className="text-left font-semibold text-gray-900 leading-tight">
                                {question.question}
                              </h3>
                            </CardHeader>
                          </Card>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <Card className="mt-2 border-l-4 border-l-green-500 bg-green-50">
                            <CardContent className="pt-4">
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-semibold text-green-800 mb-2">
                                    Answer:
                                  </h4>
                                  <p className="text-gray-700 leading-relaxed">
                                    {question.answer}
                                  </p>
                                </div>

                                {question.codeExample && (
                                  <div>
                                    <h4 className="font-semibold text-green-800 mb-2">
                                      Code Example:
                                    </h4>
                                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                                      <pre className="text-sm">
                                        <code>{question.codeExample}</code>
                                      </pre>
                                    </div>
                                  </div>
                                )}

                                {question.relatedTopics.length > 0 && (
                                  <div>
                                    <h4 className="font-semibold text-green-800 mb-2">
                                      Related Topics:
                                    </h4>
                                    <div className="flex flex-wrap gap-1">
                                      {question.relatedTopics.map(
                                        (topic, idx) => (
                                          <Badge
                                            key={idx}
                                            variant="secondary"
                                            className="text-xs"
                                          >
                                            {topic}
                                          </Badge>
                                        )
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </div>

                  {interviewQuestions.length === 0 && (
                    <div className="text-center py-8">
                      <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">
                        Interview questions for {languageData?.name || language}{" "}
                        are coming soon!
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
