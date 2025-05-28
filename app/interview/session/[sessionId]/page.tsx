"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import VoiceAnalysis from "@/components/VoiceAnalysis";
import { 
  Clock, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle,
  Code,
  BookOpen,
  BarChart3,
  Trophy,
  Home,
  RotateCcw
} from "lucide-react";
import { toast } from "sonner";

interface Question {
  id: string;
  question_title: string;
  question_text: string;
  answer_text: string;
  code_example?: string;
  explanation?: string;
  difficulty: string;
  category: string;
  time_to_answer: number;
  tags: string[];
}

interface SessionData {
  id: string;
  language_id: string;
  language_name: string;
  total_questions: number;
  current_question: number;
  session_status: string;
  start_time: string;
  questions: Question[];
}

interface VoiceAnalysisResult {
  transcript: string;
  confidence_score: number;
  speaking_pace: number;
  volume_consistency: number;
  pause_analysis: any;
  clarity_score: number;
  overall_score: number;
  feedback: string[];
  recommendations: string[];
}

export default function InterviewSessionPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;
  
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [responses, setResponses] = useState<any[]>([]);
  const [sessionTimer, setSessionTimer] = useState(0);
  const [questionTimer, setQuestionTimer] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  useEffect(() => {
    if (sessionId) {
      fetchSessionData();
    }
  }, [sessionId]);

  useEffect(() => {
    // Session timer
    const interval = setInterval(() => {
      setSessionTimer(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Question timer
    let interval: NodeJS.Timeout;
    if (currentQuestion && !showAnswer && !sessionCompleted) {
      interval = setInterval(() => {
        setQuestionTimer(prev => {
          if (prev >= currentQuestion.time_to_answer) {
            // Auto-move to next question when time is up
            handleNextQuestion();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentQuestion, showAnswer, sessionCompleted]);

  const fetchSessionData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/interview/sessions/${sessionId}`);
      
      if (response.ok) {
        const data = await response.json();
        setSessionData(data.session);
        if (data.session.questions && data.session.questions.length > 0) {
          setCurrentQuestion(data.session.questions[0]);
          setCurrentQuestionIndex(0);
        }
      } else {
        toast.error('Failed to fetch session data');
        router.push('/interview');
      }
    } catch (error) {
      console.error('Error fetching session data:', error);
      toast.error('Network error while fetching session');
      router.push('/interview');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceAnalysisComplete = async (analysis: VoiceAnalysisResult) => {
    if (!currentQuestion || !sessionData) return;

    try {
      // Save response to database
      const response = await fetch('/api/interview/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionData.id,
          questionId: currentQuestion.id,
          studentAnswer: analysis.transcript,
          responseTime: questionTimer,
          confidenceScore: analysis.confidence_score,
          voiceAnalysis: analysis
        }),
      });

      if (response.ok) {
        const responseData = await response.json();
        setResponses(prev => [...prev, responseData.response]);
        toast.success('Response recorded successfully');
      } else {
        toast.error('Failed to save response');
      }
    } catch (error) {
      console.error('Error saving response:', error);
      toast.error('Network error while saving response');
    }
  };

  const handleNextQuestion = () => {
    if (!sessionData) return;

    const nextIndex = currentQuestionIndex + 1;
    
    if (nextIndex >= sessionData.questions.length) {
      // Session completed
      completeSession();
    } else {
      setCurrentQuestionIndex(nextIndex);
      setCurrentQuestion(sessionData.questions[nextIndex]);
      setQuestionTimer(0);
      setShowAnswer(false);
      setIsRecording(false);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(prevIndex);
      setCurrentQuestion(sessionData.questions[prevIndex]);
      setQuestionTimer(0);
      setShowAnswer(false);
      setIsRecording(false);
    }
  };

  const completeSession = async () => {
    try {
      const response = await fetch(`/api/interview/sessions/${sessionId}/complete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          totalDuration: sessionTimer,
          responses: responses
        }),
      });

      if (response.ok) {
        setSessionCompleted(true);
        toast.success('Interview session completed!');
      } else {
        toast.error('Failed to complete session');
      }
    } catch (error) {
      console.error('Error completing session:', error);
      toast.error('Network error while completing session');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading interview session...</p>
        </div>
      </div>
    );
  }

  if (sessionCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-green-100 rounded-full">
                <Trophy className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl text-green-600">Interview Completed!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <p className="text-gray-600">
              Congratulations! You've completed your {sessionData?.language_name} interview session.
            </p>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{sessionData?.total_questions}</div>
                <div className="text-sm text-gray-600">Questions</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600">{formatTime(sessionTimer)}</div>
                <div className="text-sm text-gray-600">Total Time</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{responses.length}</div>
                <div className="text-sm text-gray-600">Responses</div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => router.push(`/interview/session/${sessionId}/results`)} className="flex-1">
                <BarChart3 className="h-4 w-4 mr-2" />
                View Detailed Results
              </Button>
              <Button variant="outline" onClick={() => router.push('/interview')} className="flex-1">
                <Home className="h-4 w-4 mr-2" />
                Back to Interview Hub
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!sessionData || !currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Code className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Session Not Found</h2>
          <p className="text-gray-600 mb-4">The requested interview session could not be found.</p>
          <Button onClick={() => router.push('/interview')}>
            <Home className="h-4 w-4 mr-2" />
            Back to Interview Hub
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold">{sessionData.language_name} Interview</h1>
              <Badge className={getDifficultyColor(currentQuestion.difficulty)}>
                {currentQuestion.difficulty}
              </Badge>
              <Badge variant="outline">
                {currentQuestion.category}
              </Badge>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Session: {formatTime(sessionTimer)}</span>
              </div>
              <div>
                Question {currentQuestionIndex + 1} of {sessionData.total_questions}
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <Progress 
              value={((currentQuestionIndex + 1) / sessionData.total_questions) * 100} 
              className="h-2" 
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Question Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Question */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{currentQuestion.question_title}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>{formatTime(questionTimer)} / {formatTime(currentQuestion.time_to_answer)}</span>
                  </div>
                </div>
                <Progress 
                  value={(questionTimer / currentQuestion.time_to_answer) * 100} 
                  className="h-1" 
                />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">{currentQuestion.question_text}</p>
                </div>

                {currentQuestion.code_example && (
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                    <pre><code>{currentQuestion.code_example}</code></pre>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {currentQuestion.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Show Answer Button */}
                {!showAnswer && (
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAnswer(true)}
                    className="w-full"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Show Answer & Explanation
                  </Button>
                )}

                {/* Answer Section */}
                {showAnswer && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Answer:</h4>
                    <p className="text-blue-800 mb-4">{currentQuestion.answer_text}</p>
                    
                    {currentQuestion.explanation && (
                      <>
                        <h4 className="font-semibold text-blue-900 mb-2">Explanation:</h4>
                        <p className="text-blue-800">{currentQuestion.explanation}</p>
                      </>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Voice Analysis */}
            <VoiceAnalysis
              isRecording={isRecording}
              onStartRecording={() => setIsRecording(true)}
              onStopRecording={() => setIsRecording(false)}
              onAnalysisComplete={handleVoiceAnalysisComplete}
              question={currentQuestion.question_text}
              timeLimit={currentQuestion.time_to_answer}
            />

            {/* Navigation */}
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              
              <Button onClick={handleNextQuestion}>
                {currentQuestionIndex === sessionData.total_questions - 1 ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete Session
                  </>
                ) : (
                  <>
                    Next Question
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Session Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Session Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {Math.round(((currentQuestionIndex + 1) / sessionData.total_questions) * 100)}%
                  </div>
                  <div className="text-sm text-gray-600">Complete</div>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Questions Answered:</span>
                    <span>{responses.length} / {sessionData.total_questions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time Elapsed:</span>
                    <span>{formatTime(sessionTimer)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current Question:</span>
                    <span>{formatTime(questionTimer)} / {formatTime(currentQuestion.time_to_answer)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="ghost" className="w-full justify-start" onClick={() => setShowAnswer(!showAnswer)}>
                  <BookOpen className="h-4 w-4 mr-2" />
                  {showAnswer ? 'Hide' : 'Show'} Answer
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => setQuestionTimer(0)}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset Timer
                </Button>
                <Button variant="ghost" className="w-full justify-start" onClick={() => router.push('/interview')}>
                  <Home className="h-4 w-4 mr-2" />
                  Exit Session
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
