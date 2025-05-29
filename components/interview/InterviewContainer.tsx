"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useInterviewStore } from "@/lib/stores/interview-store";
import { useAnonymousSessionStore } from "@/lib/stores/anonymous-session-store";
import { useUser } from "@clerk/nextjs";
import { VideoAnalyzer } from "./VideoAnalyzer";
import { QuestionSpeaker } from "./QuestionSpeaker";
import { FeedbackDisplay } from "./FeedbackDisplay";
import { AnonymousSessionLimit } from "./AnonymousSessionLimit";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Home, RotateCcw, Play } from "lucide-react";

export function InterviewContainer() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState<Date | null>(null);

  const {
    currentQuestion,
    questions,
    isRecording,
    videoReady,
    sessionStarted,
    sessionCompleted,
    setRecording,
    setSessionStarted,
    nextQuestion,
    previousQuestion,
    resetSession,
  } = useInterviewStore();

  const { incrementQuestions, canContinue, getRemainingQuestions } =
    useAnonymousSessionStore();

  const currentQuestionData = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRecording && questionStartTime) {
      interval = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor(
          (now.getTime() - questionStartTime.getTime()) / 1000
        );
        setTimeElapsed(elapsed);

        // Auto-advance if time limit exceeded
        if (elapsed >= currentQuestionData.timeLimit) {
          setRecording(false);
          setQuestionStartTime(null);
          setTimeout(() => {
            handleNextQuestion();
          }, 1000);
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording, questionStartTime, currentQuestionData?.timeLimit]);

  // Reset timer when question changes
  useEffect(() => {
    setTimeElapsed(0);
    setQuestionStartTime(null);
  }, [currentQuestion]);

  const handleStartSession = () => {
    if (!videoReady) {
      alert("Please enable camera access first");
      return;
    }
    setSessionStarted(true);
  };

  const handleNextQuestion = () => {
    setRecording(false);
    setQuestionStartTime(null);

    // Track question completion for anonymous users
    if (!user) {
      incrementQuestions();
      console.log(
        `Anonymous user completed question. Remaining: ${
          getRemainingQuestions() - 1
        }`
      );

      // Check if user has reached the limit
      if (!canContinue()) {
        console.log("Anonymous user reached question limit");
        // The AnonymousSessionLimit component will handle showing the prompt
        return;
      }
    }

    nextQuestion();
  };

  const handlePreviousQuestion = () => {
    setRecording(false);
    setQuestionStartTime(null);
    previousQuestion();
  };

  const handleEndSession = () => {
    setRecording(false);
    setQuestionStartTime(null);
    router.push("/interview-simple/results");
  };

  const handleRestartSession = () => {
    resetSession();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getTimeColor = () => {
    const remaining = currentQuestionData.timeLimit - timeElapsed;
    if (remaining <= 10) return "text-red-600";
    if (remaining <= 30) return "text-yellow-600";
    return "text-gray-600";
  };

  if (sessionCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center bg-white rounded-lg shadow-lg p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🎉</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Interview Complete!
          </h2>
          <p className="text-gray-600 mb-6">
            Great job! You've completed all {questions.length} questions.
          </p>
          <div className="space-y-3">
            <Button onClick={handleEndSession} className="w-full">
              View Results
            </Button>
            <Button
              variant="outline"
              onClick={handleRestartSession}
              className="w-full"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Start New Interview
            </Button>
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="w-full"
            >
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!sessionStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Anonymous Session Limit */}
            <AnonymousSessionLimit />

            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                AI Interview Practice
              </h1>
              <p className="text-gray-600">
                Practice your interview skills with real-time video analysis
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Video Setup */}
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Camera Setup
                </h2>
                <VideoAnalyzer />
              </div>

              {/* Instructions */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    How It Works
                  </h2>
                  <div className="bg-white rounded-lg p-6 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-blue-600">
                          1
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          Enable Camera
                        </h3>
                        <p className="text-sm text-gray-600">
                          Allow camera access for video analysis
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-blue-600">
                          2
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          Listen to Questions
                        </h3>
                        <p className="text-sm text-gray-600">
                          AI interviewer will speak each question
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-blue-600">
                          3
                        </span>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          Answer & Get Feedback
                        </h3>
                        <p className="text-sm text-gray-600">
                          Receive real-time analysis of your performance
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-2">
                    Interview Details
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Questions:</span>
                      <span className="font-medium">{questions.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Estimated Time:</span>
                      <span className="font-medium">15-20 minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Analysis:</span>
                      <span className="font-medium">Real-time feedback</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleStartSession}
                  disabled={!videoReady}
                  className="w-full h-12 text-lg"
                >
                  {videoReady ? (
                    <>
                      <Play className="h-5 w-5 mr-2" />
                      Start Interview
                    </>
                  ) : (
                    "Enable Camera First"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Anonymous Session Limit */}
      <AnonymousSessionLimit />

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                AI Interview Practice
              </h1>
              <p className="text-sm text-gray-600">
                Question {currentQuestion + 1} of {questions.length}
                {!user && (
                  <span className="ml-2 text-blue-600">
                    • {getRemainingQuestions()} free questions left
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {isRecording && (
                <div className={`text-sm font-medium ${getTimeColor()}`}>
                  {formatTime(timeElapsed)} /{" "}
                  {formatTime(currentQuestionData.timeLimit)}
                </div>
              )}
              <Progress value={progress} className="w-32" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Video Section */}
          <div className="lg:col-span-2 space-y-6">
            <VideoAnalyzer />
            <QuestionSpeaker />

            {/* Navigation Controls */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestion === 0 || isRecording}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>

                <Button
                  variant="outline"
                  onClick={handleNextQuestion}
                  disabled={currentQuestion === questions.length - 1}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>

              <div className="flex justify-center mt-4">
                <Button
                  variant="ghost"
                  onClick={handleEndSession}
                  className="text-gray-600 hover:text-gray-900"
                >
                  End Interview
                </Button>
              </div>
            </div>
          </div>

          {/* Feedback Section */}
          <div>
            <FeedbackDisplay />
          </div>
        </div>
      </div>
    </div>
  );
}
