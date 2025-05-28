'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, BookOpen, Clock, CheckCircle, Play } from 'lucide-react';
import { getTutorials, Tutorial } from '@/lib/tutorial-content';

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
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

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
      console.error('Error fetching language data:', error);
    }
  };

  const loadTutorials = () => {
    try {
      const tutorialList = getTutorials(language);
      setTutorials(tutorialList);
    } catch (error) {
      console.error('Error loading tutorials:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTutorials = tutorials.filter(tutorial => 
    selectedDifficulty === 'all' || tutorial.difficulty === selectedDifficulty
  );

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
              style={{ backgroundColor: languageData?.color_code || '#6366f1' }}
            >
              {languageData?.name?.charAt(0) || language.charAt(0).toUpperCase()}
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

          <div className="flex gap-2 mb-6">
            {['all', 'beginner', 'intermediate', 'advanced'].map((difficulty) => (
              <Button
                key={difficulty}
                variant={selectedDifficulty === difficulty ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedDifficulty(difficulty)}
                className="capitalize"
              >
                {difficulty === 'all' ? 'All Levels' : difficulty}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTutorials.map((tutorial) => (
            <Card key={tutorial.id} className="hover:shadow-xl transition-all duration-300">
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
                <CardTitle className="text-xl mb-2">
                  {tutorial.title}
                </CardTitle>
                <p className="text-gray-600 text-sm">
                  {tutorial.description}
                </p>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {tutorial.prerequisites && tutorial.prerequisites.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Prerequisites:</h4>
                      <div className="flex flex-wrap gap-1">
                        {tutorial.prerequisites.map((prereq, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {prereq}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">You'll learn:</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {tutorial.whatYouWillLearn.slice(0, 3).map((item, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{tutorial.sections.length} sections</span>
                    <span className="flex items-center gap-1">
                      <Play className="h-3 w-3" />
                      Interactive
                    </span>
                  </div>

                  <Button asChild className="w-full" size="lg">
                    <Link href={`/interview/${language}/tutorials/${tutorial.id}`}>
                      Start Tutorial
                      <Play className="h-4 w-4 ml-2" />
                    </Link>
                  </Button>
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
