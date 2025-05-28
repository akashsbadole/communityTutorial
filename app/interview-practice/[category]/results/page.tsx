'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  Clock, 
  Target, 
  TrendingUp,
  RotateCcw,
  Home,
  Share2,
  Download,
  Star,
  Award,
  BookOpen,
  ArrowRight
} from 'lucide-react';

interface InterviewResults {
  category: string;
  questionsAnswered: number;
  totalQuestions: number;
  duration: string;
  completionDate: Date;
  overallScore: number;
  strengths: string[];
  improvements: string[];
  recommendations: string[];
}

export default function InterviewResultsPage() {
  const params = useParams();
  const router = useRouter();
  const category = params.category as string;
  
  const [results, setResults] = useState<InterviewResults | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading results - in real app, this would come from API/localStorage
    setTimeout(() => {
      const mockResults: InterviewResults = {
        category: category,
        questionsAnswered: 3,
        totalQuestions: 3,
        duration: '8:45',
        completionDate: new Date(),
        overallScore: 85,
        strengths: [
          'Clear communication and articulation',
          'Good understanding of fundamental concepts',
          'Structured approach to problem-solving',
          'Confident delivery and body language'
        ],
        improvements: [
          'Could provide more specific examples',
          'Consider discussing edge cases',
          'Practice explaining complex concepts more simply'
        ],
        recommendations: [
          'Review advanced concepts in closures and async programming',
          'Practice more system design questions',
          'Work on providing concrete examples from experience',
          'Consider taking our Advanced JavaScript course'
        ]
      };
      setResults(mockResults);
      setIsLoading(false);
    }, 1500);
  }, [category]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return { label: 'Excellent', color: 'bg-green-100 text-green-800' };
    if (score >= 80) return { label: 'Good', color: 'bg-blue-100 text-blue-800' };
    if (score >= 70) return { label: 'Average', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'Needs Improvement', color: 'bg-red-100 text-red-800' };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Analyzing your interview performance...</p>
        </div>
      </div>
    );
  }

  if (!results) return null;

  const scoreBadge = getScoreBadge(results.overallScore);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Award className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Interview Complete!</h1>
            </div>
            <p className="text-gray-600">
              Great job completing your {category} interview practice session
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Overall Score */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="pt-8">
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <div className="w-32 h-32 rounded-full border-8 border-gray-200 flex items-center justify-center mx-auto relative">
                  <div 
                    className="absolute inset-0 rounded-full border-8 border-blue-600"
                    style={{
                      background: `conic-gradient(#2563eb ${results.overallScore * 3.6}deg, transparent 0deg)`
                    }}
                  ></div>
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center relative z-10">
                    <span className={`text-3xl font-bold ${getScoreColor(results.overallScore)}`}>
                      {results.overallScore}%
                    </span>
                  </div>
                </div>
              </div>
              <Badge className={`${scoreBadge.color} text-lg px-4 py-2 mb-4`}>
                {scoreBadge.label}
              </Badge>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Overall Performance</h2>
              <p className="text-gray-600">
                You answered {results.questionsAnswered} out of {results.totalQuestions} questions
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Session Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Session Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-semibold">{results.duration}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Questions Completed</span>
                  <span className="font-semibold">
                    {results.questionsAnswered}/{results.totalQuestions}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Completion Rate</span>
                  <span className="font-semibold">
                    {Math.round((results.questionsAnswered / results.totalQuestions) * 100)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Category</span>
                  <span className="font-semibold capitalize">{results.category}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Date</span>
                  <span className="font-semibold">
                    {results.completionDate.toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Strengths */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <CheckCircle className="h-5 w-5" />
                Your Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {results.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{strength}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Areas for Improvement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-700">
                <Target className="h-5 w-5" />
                Areas for Improvement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {results.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Target className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{improvement}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <TrendingUp className="h-5 w-5" />
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {results.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Button 
            onClick={() => router.push(`/interview-practice/${category}`)}
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Practice Again
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => router.push('/interview-practice')}
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Try Another Category
          </Button>
          
          <Button 
            variant="outline"
            className="flex items-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            Share Results
          </Button>
          
          <Button 
            variant="outline"
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download Report
          </Button>
        </div>

        {/* Next Steps */}
        <Card className="bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200">
          <CardHeader>
            <CardTitle className="text-indigo-900">Continue Your Learning Journey</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-indigo-900 mb-2">📚 Study Materials</h4>
                <p className="text-sm text-indigo-800 mb-3">
                  Enhance your knowledge with our comprehensive tutorials
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/interview/${category}/tutorials`}>
                    View Tutorials
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
              
              <div>
                <h4 className="font-semibold text-indigo-900 mb-2">❓ Practice Questions</h4>
                <p className="text-sm text-indigo-800 mb-3">
                  Test your knowledge with our question bank
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/interview/${category}/questions`}>
                    Practice Questions
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Tracking */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Performance Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Track Your Progress
              </h3>
              <p className="text-gray-600 mb-4">
                Sign up to save your interview results and track improvement over time
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Create Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
