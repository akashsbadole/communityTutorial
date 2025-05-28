'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Video, 
  Camera, 
  Mic, 
  Play, 
  Users, 
  Clock, 
  Star,
  ArrowRight,
  Shield,
  Zap,
  Target,
  BookOpen
} from 'lucide-react';

interface InterviewCategory {
  id: string;
  title: string;
  description: string;
  questionCount: number;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  topics: string[];
  icon: string;
}

const interviewCategories: InterviewCategory[] = [
  {
    id: 'javascript',
    title: 'JavaScript Interview',
    description: 'Practice JavaScript concepts with our AI interviewer',
    questionCount: 25,
    duration: '30-45 min',
    difficulty: 'intermediate',
    topics: ['ES6+', 'Async/Await', 'DOM', 'Functions', 'Objects'],
    icon: '🟨'
  },
  {
    id: 'python',
    title: 'Python Interview',
    description: 'Master Python programming interview questions',
    questionCount: 30,
    duration: '35-50 min',
    difficulty: 'intermediate',
    topics: ['OOP', 'Data Structures', 'Algorithms', 'Libraries'],
    icon: '🐍'
  },
  {
    id: 'react',
    title: 'React Interview',
    description: 'Frontend React development interview practice',
    questionCount: 20,
    duration: '25-40 min',
    difficulty: 'advanced',
    topics: ['Hooks', 'State Management', 'Components', 'Performance'],
    icon: '⚛️'
  },
  {
    id: 'nodejs',
    title: 'Node.js Interview',
    description: 'Backend development with Node.js interview prep',
    questionCount: 22,
    duration: '30-45 min',
    difficulty: 'intermediate',
    topics: ['Express', 'APIs', 'Database', 'Authentication'],
    icon: '🟢'
  },
  {
    id: 'general',
    title: 'General Programming',
    description: 'Common programming concepts and problem solving',
    questionCount: 35,
    duration: '40-60 min',
    difficulty: 'beginner',
    topics: ['Algorithms', 'Data Structures', 'Logic', 'Best Practices'],
    icon: '💻'
  },
  {
    id: 'system-design',
    title: 'System Design',
    description: 'Architecture and system design interview questions',
    questionCount: 15,
    duration: '45-60 min',
    difficulty: 'advanced',
    topics: ['Scalability', 'Databases', 'Microservices', 'Architecture'],
    icon: '🏗️'
  }
];

const features = [
  {
    icon: <Video className="h-6 w-6" />,
    title: 'Real-time Video Practice',
    description: 'Practice with live camera feed and AI interviewer'
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: 'Privacy First',
    description: 'No video storage - everything deleted immediately'
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: 'Instant Feedback',
    description: 'Get immediate feedback on your responses'
  },
  {
    icon: <Target className="h-6 w-6" />,
    title: 'Targeted Practice',
    description: 'Focus on specific technologies and skill levels'
  }
];

export default function InterviewPracticePage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

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
          <p className="text-gray-600">Loading interview platform...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <Video className="h-12 w-12 mr-4" />
              <h1 className="text-4xl md:text-5xl font-bold">
                AI Interview Practice
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Practice real interviews with our AI interviewer. Get instant feedback, 
              build confidence, and ace your next technical interview.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-blue-100">
              <div className="flex items-center gap-2">
                <Camera className="h-4 w-4" />
                <span>Live Video Practice</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Privacy Protected</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                <span>Instant Feedback</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose Our AI Interview Platform?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Experience the most realistic interview practice with cutting-edge AI technology
            and privacy-first approach.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="text-blue-600 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Interview Categories */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Choose Your Interview Category
            </h2>
            <p className="text-gray-600">
              Select from our comprehensive collection of technical interview categories
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {interviewCategories.map((category) => (
              <Card key={category.id} className="hover:shadow-lg transition-shadow group">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{category.icon}</span>
                    <Badge className={getDifficultyColor(category.difficulty)}>
                      {category.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl">{category.title}</CardTitle>
                  <p className="text-gray-600 text-sm">{category.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1 text-gray-600">
                        <BookOpen className="h-4 w-4" />
                        Questions
                      </span>
                      <span className="font-medium">{category.questionCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1 text-gray-600">
                        <Clock className="h-4 w-4" />
                        Duration
                      </span>
                      <span className="font-medium">{category.duration}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2">Topics covered:</p>
                    <div className="flex flex-wrap gap-1">
                      {category.topics.map((topic, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button asChild className="w-full group-hover:bg-blue-700">
                    <Link href={`/interview-practice/${category.id}`}>
                      Start Practice
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-lg p-8 shadow-lg">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Choose Category</h3>
              <p className="text-gray-600 text-sm">
                Select your interview category and difficulty level
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Start Practice</h3>
              <p className="text-gray-600 text-sm">
                Enable camera and begin your AI-powered interview session
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Get Feedback</h3>
              <p className="text-gray-600 text-sm">
                Receive instant feedback and improve your interview skills
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
