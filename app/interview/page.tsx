"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Code, 
  Play, 
  BookOpen, 
  Trophy, 
  Users, 
  Clock, 
  Search,
  Filter,
  Star,
  TrendingUp,
  Download,
  Video,
  Mic,
  BarChart3
} from "lucide-react";
import { toast } from "sonner";

interface ProgrammingLanguage {
  id: string;
  name: string;
  slug: string;
  description: string;
  color_code: string;
  difficulty_level: string;
  popularity_rank: number;
  github_repo_url: string;
  documentation_url: string;
  question_count?: number;
  avg_difficulty?: string;
}

export default function InterviewPlatformPage() {
  const [languages, setLanguages] = useState<ProgrammingLanguage[]>([]);
  const [filteredLanguages, setFilteredLanguages] = useState<ProgrammingLanguage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');

  useEffect(() => {
    fetchLanguages();
  }, []);

  useEffect(() => {
    filterAndSortLanguages();
  }, [languages, searchTerm, difficultyFilter, sortBy]);

  const fetchLanguages = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/interview/languages');
      
      if (response.ok) {
        const data = await response.json();
        setLanguages(data.languages || []);
      } else {
        toast.error('Failed to fetch programming languages');
      }
    } catch (error) {
      console.error('Error fetching languages:', error);
      toast.error('Network error while fetching languages');
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortLanguages = () => {
    let filtered = languages.filter(lang => 
      lang.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lang.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (difficultyFilter !== 'all') {
      filtered = filtered.filter(lang => lang.difficulty_level === difficultyFilter);
    }

    // Sort languages
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popularity':
          return a.popularity_rank - b.popularity_rank;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'difficulty':
          const difficultyOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 };
          return difficultyOrder[a.difficulty_level] - difficultyOrder[b.difficulty_level];
        default:
          return 0;
      }
    });

    setFilteredLanguages(filtered);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLanguageIcon = (name: string) => {
    // You can add specific icons for each language here
    return <Code className="h-6 w-6" />;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading interview platform...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Master Your Technical Interviews
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Practice with AI-powered voice analysis, get instant feedback, and build confidence
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
                <Mic className="h-5 w-5" />
                <span>Voice Analysis</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
                <BarChart3 className="h-5 w-5" />
                <span>Progress Tracking</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
                <Video className="h-5 w-5" />
                <span>Expert Tutorials</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg">
                <Download className="h-5 w-5" />
                <span>PDF Resources</span>
              </div>
            </div>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Start Practicing Now
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search programming languages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Levels</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="popularity">Sort by Popularity</option>
                <option value="name">Sort by Name</option>
                <option value="difficulty">Sort by Difficulty</option>
              </select>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <Code className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">{languages.length}</div>
              <div className="text-gray-600">Programming Languages</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <BookOpen className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">2000+</div>
              <div className="text-gray-600">Interview Questions</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">50+</div>
              <div className="text-gray-600">Expert Tutors</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Trophy className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">95%</div>
              <div className="text-gray-600">Success Rate</div>
            </CardContent>
          </Card>
        </div>

        {/* Programming Languages Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Choose Your Programming Language
          </h2>
          
          {filteredLanguages.length === 0 ? (
            <div className="text-center py-12">
              <Code className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No languages found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLanguages.map((language) => (
                <Card key={language.id} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="p-2 rounded-lg"
                          style={{ backgroundColor: `${language.color_code}20` }}
                        >
                          {getLanguageIcon(language.name)}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{language.name}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge className={getDifficultyColor(language.difficulty_level)}>
                              {language.difficulty_level}
                            </Badge>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Star className="h-3 w-3" />
                              <span>#{language.popularity_rank}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {language.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        <span>200+ Questions</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>5-10 min each</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button asChild className="flex-1">
                        <Link href={`/interview/${language.slug}`}>
                          <Play className="h-4 w-4 mr-2" />
                          Start Interview
                        </Link>
                      </Button>
                      <Button variant="outline" asChild>
                        <Link href={`/interview/${language.slug}/questions`}>
                          <BookOpen className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                    
                    <div className="flex gap-2 mt-2">
                      <Button variant="ghost" size="sm" asChild className="flex-1">
                        <Link href={language.github_repo_url} target="_blank">
                          GitHub Repo
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" asChild className="flex-1">
                        <Link href={`/interview/${language.slug}/tutorials`}>
                          Tutorials
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Why Choose Our Interview Platform?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Mic className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Voice Analysis</h3>
              <p className="text-gray-600">
                Get real-time feedback on your speaking confidence, pace, and clarity during mock interviews.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
              <p className="text-gray-600">
                Monitor your improvement over time with detailed analytics and personalized recommendations.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Video className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Tutorials</h3>
              <p className="text-gray-600">
                Learn from industry experts with curated video tutorials and comprehensive study materials.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
