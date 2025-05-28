'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Play, 
  Pause,
  SkipForward,
  ArrowLeft,
  Camera,
  Clock,
  CheckCircle,
  AlertCircle,
  Volume2
} from 'lucide-react';

interface Question {
  id: string;
  question: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeLimit: number; // in seconds
  tips?: string[];
  followUp?: string;
}

interface InterviewSession {
  category: string;
  questions: Question[];
  currentQuestionIndex: number;
  isActive: boolean;
  startTime?: Date;
}

export default function InterviewPracticeSession() {
  const params = useParams();
  const router = useRouter();
  const category = params.category as string;
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasPermissions, setHasPermissions] = useState(false);
  const [isInterviewerSpeaking, setIsInterviewerSpeaking] = useState(false);

  // Sample questions - in real app, these would come from API
  const getQuestionsForCategory = (category: string): Question[] => {
    const questionSets: Record<string, Question[]> = {
      javascript: [
        {
          id: 'js1',
          question: 'Explain the difference between var, let, and const in JavaScript.',
          category: 'Variables',
          difficulty: 'beginner',
          timeLimit: 120,
          tips: ['Think about scope', 'Consider hoisting behavior', 'Mention reassignment rules'],
          followUp: 'Can you give an example of when you would use each one?'
        },
        {
          id: 'js2',
          question: 'What is a closure in JavaScript and how would you use it?',
          category: 'Functions',
          difficulty: 'intermediate',
          timeLimit: 180,
          tips: ['Explain lexical scoping', 'Give a practical example', 'Mention use cases'],
          followUp: 'What are some common pitfalls with closures?'
        },
        {
          id: 'js3',
          question: 'How does the event loop work in JavaScript?',
          category: 'Async',
          difficulty: 'advanced',
          timeLimit: 240,
          tips: ['Explain call stack', 'Mention callback queue', 'Discuss microtasks vs macrotasks'],
          followUp: 'How do promises fit into the event loop?'
        }
      ],
      python: [
        {
          id: 'py1',
          question: 'What is the difference between a list and a tuple in Python?',
          category: 'Data Types',
          difficulty: 'beginner',
          timeLimit: 120,
          tips: ['Discuss mutability', 'Mention performance differences', 'Give use cases'],
          followUp: 'When would you choose one over the other?'
        },
        {
          id: 'py2',
          question: 'Explain Python decorators and provide an example.',
          category: 'Advanced',
          difficulty: 'intermediate',
          timeLimit: 180,
          tips: ['Explain the @ syntax', 'Show a simple example', 'Mention common use cases'],
          followUp: 'How would you create a decorator that takes parameters?'
        }
      ],
      react: [
        {
          id: 'react1',
          question: 'What are React hooks and why were they introduced?',
          category: 'Hooks',
          difficulty: 'intermediate',
          timeLimit: 150,
          tips: ['Explain the problem they solve', 'Mention useState and useEffect', 'Discuss class vs functional components'],
          followUp: 'Can you create a custom hook example?'
        }
      ]
    };

    return questionSets[category] || [];
  };

  useEffect(() => {
    const questions = getQuestionsForCategory(category);
    if (questions.length === 0) {
      setError('No questions found for this category');
      setIsLoading(false);
      return;
    }

    setSession({
      category,
      questions,
      currentQuestionIndex: 0,
      isActive: false
    });
    setIsLoading(false);
  }, [category]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording && timeRemaining > 0) {
      timer = setTimeout(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0 && isRecording) {
      handleNextQuestion();
    }
    return () => clearTimeout(timer);
  }, [isRecording, timeRemaining]);

  const requestPermissions = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      mediaStreamRef.current = stream;
      setIsVideoEnabled(true);
      setIsAudioEnabled(true);
      setHasPermissions(true);
      setError(null);
    } catch (err) {
      setError('Camera and microphone access required for interview practice');
      console.error('Error accessing media devices:', err);
    }
  };

  const startInterview = () => {
    if (!session || !hasPermissions) return;
    
    setSession(prev => prev ? { ...prev, isActive: true, startTime: new Date() } : null);
    setTimeRemaining(session.questions[0].timeLimit);
    setIsRecording(true);
    speakQuestion(session.questions[0].question);
  };

  const speakQuestion = (question: string) => {
    setIsInterviewerSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(question);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.onend = () => setIsInterviewerSpeaking(false);
    speechSynthesis.speak(utterance);
  };

  const handleNextQuestion = () => {
    if (!session) return;

    const nextIndex = session.currentQuestionIndex + 1;
    if (nextIndex >= session.questions.length) {
      // Interview completed
      handleEndInterview();
      return;
    }

    setSession(prev => prev ? { ...prev, currentQuestionIndex: nextIndex } : null);
    setTimeRemaining(session.questions[nextIndex].timeLimit);
    speakQuestion(session.questions[nextIndex].question);
  };

  const handleEndInterview = () => {
    setIsRecording(false);
    setSession(prev => prev ? { ...prev, isActive: false } : null);
    
    // Clean up media stream
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    
    // Navigate to results page
    router.push(`/interview-practice/${category}/results`);
  };

  const toggleVideo = () => {
    if (mediaStreamRef.current) {
      const videoTrack = mediaStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };

  const toggleAudio = () => {
    if (mediaStreamRef.current) {
      const audioTrack = mediaStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading interview session...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => router.push('/interview-practice')}>
              Back to Categories
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!session) return null;

  const currentQuestion = session.questions[session.currentQuestionIndex];
  const progress = ((session.currentQuestionIndex + 1) / session.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => router.push('/interview-practice')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-semibold capitalize">{category} Interview</h1>
                <p className="text-sm text-gray-600">
                  Question {session.currentQuestionIndex + 1} of {session.questions.length}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {session.isActive && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4" />
                  <span className={timeRemaining <= 30 ? 'text-red-600 font-semibold' : ''}>
                    {formatTime(timeRemaining)}
                  </span>
                </div>
              )}
              <Progress value={progress} className="w-32" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Video Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Interview Session
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative bg-gray-900 rounded-lg overflow-hidden mb-4" style={{ aspectRatio: '16/9' }}>
                  {hasPermissions ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      muted
                      className="w-full h-full object-cover"
                      style={{ transform: 'scaleX(-1)' }} // Mirror effect
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-white">
                      <div className="text-center">
                        <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg mb-2">Camera Access Required</p>
                        <p className="text-sm opacity-75 mb-4">
                          Enable camera and microphone to start your interview practice
                        </p>
                        <Button onClick={requestPermissions} className="bg-blue-600 hover:bg-blue-700">
                          Enable Camera & Microphone
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {/* Video Controls Overlay */}
                  {hasPermissions && (
                    <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-2">
                      <Button
                        variant={isVideoEnabled ? "default" : "destructive"}
                        size="sm"
                        onClick={toggleVideo}
                      >
                        {isVideoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant={isAudioEnabled ? "default" : "destructive"}
                        size="sm"
                        onClick={toggleAudio}
                      >
                        {isAudioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                      </Button>
                    </div>
                  )}

                  {/* Recording Indicator */}
                  {isRecording && (
                    <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                      Recording
                    </div>
                  )}

                  {/* AI Interviewer Speaking Indicator */}
                  {isInterviewerSpeaking && (
                    <div className="absolute top-4 left-4 flex items-center gap-2 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                      <Volume2 className="h-4 w-4" />
                      AI Interviewer Speaking
                    </div>
                  )}
                </div>

                {/* Interview Controls */}
                <div className="flex justify-center gap-4">
                  {!session.isActive ? (
                    <Button 
                      onClick={startInterview} 
                      disabled={!hasPermissions}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Interview
                    </Button>
                  ) : (
                    <>
                      <Button onClick={handleNextQuestion} variant="outline">
                        <SkipForward className="h-4 w-4 mr-2" />
                        Next Question
                      </Button>
                      <Button onClick={handleEndInterview} variant="destructive">
                        End Interview
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Question Panel */}
          <div>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Current Question</CardTitle>
                  <Badge className={getDifficultyColor(currentQuestion.difficulty)}>
                    {currentQuestion.difficulty}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Category: {currentQuestion.category}</p>
                    <h3 className="text-lg font-semibold text-gray-900 leading-relaxed">
                      {currentQuestion.question}
                    </h3>
                  </div>

                  {currentQuestion.tips && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">💡 Tips:</h4>
                      <ul className="space-y-1">
                        {currentQuestion.tips.map((tip, index) => (
                          <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                            <span className="text-blue-600 mt-1">•</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {currentQuestion.followUp && session.isActive && (
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <h4 className="font-medium text-blue-900 mb-1">Follow-up:</h4>
                      <p className="text-sm text-blue-800">{currentQuestion.followUp}</p>
                    </div>
                  )}

                  <div className="text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>Time limit: {formatTime(currentQuestion.timeLimit)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Privacy Notice */}
            <Card className="mt-4 border-green-200 bg-green-50">
              <CardContent className="pt-4">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-green-900 mb-1">Privacy Protected</h4>
                    <p className="text-sm text-green-800">
                      Your video is processed locally and never stored. All data is deleted immediately after the session.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
