'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, Code, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface Question {
  id: string;
  question_title: string;
  question_text: string;
  answer_text: string;
  code_example?: string;
  explanation?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  tags: string[];
  source?: string;
}

interface LanguageData {
  id: string;
  name: string;
  slug: string;
  color_code: string;
}

export default function QuestionsPage() {
  const params = useParams();
  const language = params.language as string;
  
  const [languageData, setLanguageData] = useState<LanguageData | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAnswers, setShowAnswers] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (language) {
      fetchLanguageData();
      fetchQuestions();
    }
  }, [language]);

  useEffect(() => {
    filterQuestions();
  }, [questions, searchTerm, selectedDifficulty, selectedCategory]);

  const fetchLanguageData = async () => {
    try {
      const response = await fetch(`/api/interview/languages/${language}`);
      if (response.ok) {
        const data = await response.json();
        setLanguageData(data.language);
      }
    } catch (error) {
      console.error('Error fetching language data:', error);
    }
  };

  const fetchQuestions = async () => {
    try {
      // Try to fetch from GitHub or external API first
      const response = await fetch(`/api/interview/questions/${language}`);
      if (response.ok) {
        const data = await response.json();
        setQuestions(data.questions || []);
      } else {
        // Fallback to static questions
        const staticQuestions = await getStaticQuestions(language);
        setQuestions(staticQuestions);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      const staticQuestions = await getStaticQuestions(language);
      setQuestions(staticQuestions);
    } finally {
      setIsLoading(false);
    }
  };

  const getStaticQuestions = async (lang: string): Promise<Question[]> => {
    // Import static questions
    const { staticQuestions } = await import('@/lib/static-questions');
    return staticQuestions[lang] || [];
  };

  const filterQuestions = () => {
    let filtered = questions;

    if (searchTerm) {
      filtered = filtered.filter(q => 
        q.question_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.question_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(q => q.difficulty === selectedDifficulty);
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(q => q.category === selectedCategory);
    }

    setFilteredQuestions(filtered);
  };

  const toggleAnswer = (questionId: string) => {
    setShowAnswers(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const refreshQuestions = () => {
    setIsLoading(true);
    fetchQuestions();
    toast.success('Questions refreshed!');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const categories = [...new Set(questions.map(q => q.category))];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" asChild>
              <Link href={`/interview/${language}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to {languageData?.name || language}
              </Link>
            </Button>
            <Button variant="outline" onClick={refreshQuestions}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
          
          <div className="flex items-center gap-4 mb-6">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl"
              style={{ backgroundColor: languageData?.color_code || '#6366f1' }}
            >
              {languageData?.name?.charAt(0) || language.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {languageData?.name || language} Interview Questions
              </h1>
              <p className="text-gray-600">
                {filteredQuestions.length} questions available
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Difficulties</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <div className="text-sm text-gray-600 flex items-center">
              Showing {filteredQuestions.length} of {questions.length} questions
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-6">
          {filteredQuestions.map((question, index) => (
            <Card key={question.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-gray-500">
                        #{index + 1}
                      </span>
                      <Badge className={getDifficultyColor(question.difficulty)}>
                        {question.difficulty}
                      </Badge>
                      <Badge variant="outline">
                        {question.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg mb-2">
                      {question.question_title}
                    </CardTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleAnswer(question.id)}
                  >
                    {showAnswers[question.id] ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-700">{question.question_text}</p>

                  {question.code_example && (
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                      <div className="flex items-center gap-2 mb-2">
                        <Code className="h-4 w-4" />
                        <span className="text-sm font-medium">Code Example</span>
                      </div>
                      <pre className="text-sm">
                        <code>{question.code_example}</code>
                      </pre>
                    </div>
                  )}

                  {showAnswers[question.id] && (
                    <div className="border-t pt-4">
                      <h4 className="font-semibold text-green-800 mb-2">Answer:</h4>
                      <p className="text-gray-700 mb-3">{question.answer_text}</p>
                      
                      {question.explanation && (
                        <div>
                          <h4 className="font-semibold text-blue-800 mb-2">Explanation:</h4>
                          <p className="text-gray-700">{question.explanation}</p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1">
                    {question.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {question.source && (
                    <p className="text-xs text-gray-500">
                      Source: {question.source}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredQuestions.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No questions found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
