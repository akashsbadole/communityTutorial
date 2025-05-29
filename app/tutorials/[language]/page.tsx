"use client";

import React, { useState } from "react";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BookOpen,
  Code,
  Play,
  ChevronRight,
  CheckCircle,
  ArrowLeft,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { completeTutorials } from "@/lib/complete-tutorials";

interface PageProps {
  params: Promise<{ language: string }>;
}

export default function TutorialPage({ params }: PageProps) {
  const [currentChapter, setCurrentChapter] = useState(0);
  const [completedChapters, setCompletedChapters] = useState<Set<number>>(
    new Set()
  );

  // This would normally be async, but we're using static data
  const resolvedParams = React.use(params);
  const tutorial =
    completeTutorials[
      resolvedParams.language as keyof typeof completeTutorials
    ];

  if (!tutorial) {
    notFound();
  }

  const markChapterComplete = (chapterIndex: number) => {
    setCompletedChapters((prev) => new Set([...prev, chapterIndex]));
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button variant="ghost" asChild className="mb-4">
              <Link href="/interview">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Interview Platform
              </Link>
            </Button>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Code className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {tutorial.title}
                </h1>
                <p className="text-gray-600">{tutorial.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                {tutorial.chapters.length} chapters
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                {tutorial.interviewQuestions.length} interview questions
              </span>
            </div>
          </div>

          <Tabs defaultValue="tutorial" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="tutorial">Interactive Tutorial</TabsTrigger>
              <TabsTrigger value="questions">Interview Questions</TabsTrigger>
            </TabsList>

            {/* Tutorial Content */}
            <TabsContent value="tutorial" className="space-y-6">
              <div className="grid lg:grid-cols-4 gap-6">
                {/* Chapter Navigation */}
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Chapters</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {tutorial.chapters.map((chapter, index) => (
                        <button
                          key={chapter.id}
                          onClick={() => setCurrentChapter(index)}
                          className={`w-full text-left p-3 rounded-lg transition-colors ${
                            currentChapter === index
                              ? "bg-blue-100 text-blue-900 border border-blue-200"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {completedChapters.has(index) ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                            )}
                            <span className="text-sm font-medium">
                              {chapter.title}
                            </span>
                          </div>
                        </button>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                {/* Chapter Content */}
                <div className="lg:col-span-3">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>
                            {tutorial.chapters[currentChapter].title}
                          </CardTitle>
                          <CardDescription>
                            Chapter {currentChapter + 1} of{" "}
                            {tutorial.chapters.length}
                          </CardDescription>
                        </div>
                        <Button
                          onClick={() => markChapterComplete(currentChapter)}
                          disabled={completedChapters.has(currentChapter)}
                          variant={
                            completedChapters.has(currentChapter)
                              ? "secondary"
                              : "default"
                          }
                        >
                          {completedChapters.has(currentChapter) ? (
                            <>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Completed
                            </>
                          ) : (
                            "Mark Complete"
                          )}
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Chapter Content */}
                      <div className="prose max-w-none">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: tutorial.chapters[
                              currentChapter
                            ].content.replace(/\n/g, "<br/>"),
                          }}
                        />
                      </div>

                      {/* Code Example */}
                      {tutorial.chapters[currentChapter].codeExample && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            <Code className="h-4 w-4" />
                            Code Example
                          </h4>
                          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                            <pre className="text-sm">
                              <code>
                                {tutorial.chapters[currentChapter].codeExample}
                              </code>
                            </pre>
                          </div>
                          {/* <Button variant="outline" size="sm" className="mt-2">
                            <Play className="h-4 w-4 mr-2" />
                            Try it yourself
                          </Button> */}
                        </div>
                      )}

                      {/* Exercises */}
                      {tutorial.chapters[currentChapter].exercises && (
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-3">
                            Practice Exercises
                          </h4>
                          <div className="space-y-2">
                            {tutorial.chapters[currentChapter].exercises.map(
                              (exercise, index) => (
                                <div
                                  key={index}
                                  className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg"
                                >
                                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-xs font-bold text-blue-600">
                                      {index + 1}
                                    </span>
                                  </div>
                                  <span className="text-sm text-gray-700">
                                    {exercise}
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}

                      {/* Navigation */}
                      <div className="flex justify-between pt-6 border-t">
                        <Button
                          variant="outline"
                          onClick={() =>
                            setCurrentChapter(Math.max(0, currentChapter - 1))
                          }
                          disabled={currentChapter === 0}
                        >
                          Previous Chapter
                        </Button>
                        <Button
                          onClick={() =>
                            setCurrentChapter(
                              Math.min(
                                tutorial.chapters.length - 1,
                                currentChapter + 1
                              )
                            )
                          }
                          disabled={
                            currentChapter === tutorial.chapters.length - 1
                          }
                        >
                          Next Chapter
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Interview Questions */}
            <TabsContent value="questions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Interview Questions</CardTitle>
                  <CardDescription>
                    Practice with {tutorial.interviewQuestions.length} carefully
                    curated interview questions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="space-y-4">
                    {tutorial.interviewQuestions.map((question, index) => (
                      <AccordionItem
                        key={question.id}
                        value={question.id}
                        className="border rounded-lg px-4"
                      >
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center gap-3 text-left">
                            <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                              {index + 1}
                            </span>
                            <div className="flex-1">
                              <div className="font-medium">
                                {question.question}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge
                                  className={getDifficultyColor(
                                    question.difficulty
                                  )}
                                >
                                  {question.difficulty}
                                </Badge>
                                <Badge variant="outline">
                                  {question.category}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-4">
                          <div className="space-y-4">
                            <div>
                              <h5 className="font-semibold text-gray-900 mb-2">
                                Answer:
                              </h5>
                              <p className="text-gray-700">{question.answer}</p>
                            </div>
                            {question.codeExample && (
                              <div>
                                <h5 className="font-semibold text-gray-900 mb-2">
                                  Code Example:
                                </h5>
                                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                                  <pre className="text-sm">
                                    <code>{question.codeExample}</code>
                                  </pre>
                                </div>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
