import { NextRequest, NextResponse } from "next/server";
import { getQuestionsByDifficulty } from "@/lib/static-questions";

// GitHub repositories for interview questions
const GITHUB_REPOS: Record<string, string> = {
  javascript: 'sudheerj/javascript-interview-questions',
  python: 'learning-zone/python-interview-questions',
  java: 'learning-zone/java-interview-questions',
  react: 'sudheerj/reactjs-interview-questions',
  nodejs: 'learning-zone/nodejs-interview-questions',
  typescript: 'Devinterview-io/typescript-interview-questions',
  csharp: 'learning-zone/csharp-interview-questions',
  cpp: 'learning-zone/cpp-interview-questions',
  go: 'learning-zone/golang-interview-questions',
  rust: 'learning-zone/rust-interview-questions'
};

interface GitHubQuestion {
  title: string;
  content: string;
  difficulty?: string;
  category?: string;
}

// Get interview questions for a specific language
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ language: string }> }
) {
  try {
    const resolvedParams = await params;
    console.log(`[API] Getting questions for language: ${resolvedParams.language}`);

    const { searchParams } = new URL(request.url);
    const source = searchParams.get('source') || 'static'; // 'static', 'github', 'all'
    const difficulty = searchParams.get('difficulty') || 'mixed';
    const limit = parseInt(searchParams.get('limit') || '30');

    let questions: any[] = [];

    // Get static questions first
    if (source === 'static' || source === 'all') {
      const staticQuestions = getQuestionsByDifficulty(
        resolvedParams.language,
        difficulty as any,
        limit
      );
      questions = [...questions, ...staticQuestions];
    }

    // Fetch from GitHub if requested
    if (source === 'github' || source === 'all') {
      try {
        const githubQuestions = await fetchGitHubQuestions(resolvedParams.language, limit);
        questions = [...questions, ...githubQuestions];
      } catch (error) {
        console.error('Error fetching GitHub questions:', error);
        // Continue with static questions if GitHub fails
      }
    }

    // Remove duplicates and limit results
    const uniqueQuestions = questions
      .filter((q, index, self) => 
        index === self.findIndex(item => item.question_title === q.question_title)
      )
      .slice(0, limit);

    return NextResponse.json({
      success: true,
      questions: uniqueQuestions,
      total_count: uniqueQuestions.length,
      source,
      language: resolvedParams.language
    });

  } catch (error) {
    console.error(`[API] Error getting questions for ${resolvedParams.language}:`, error);
    return NextResponse.json(
      { error: "Failed to get questions", code: "QUESTIONS_FETCH_ERROR" },
      { status: 500 }
    );
  }
}

async function fetchGitHubQuestions(language: string, limit: number = 30): Promise<any[]> {
  const repoPath = GITHUB_REPOS[language];
  if (!repoPath) {
    throw new Error(`No GitHub repository configured for ${language}`);
  }

  try {
    // Fetch README content from GitHub API
    const response = await fetch(
      `https://api.github.com/repos/${repoPath}/readme`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'TrainingHub-Interview-Platform'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json();
    const content = Buffer.from(data.content, 'base64').toString('utf-8');

    // Parse questions from README content
    const questions = parseQuestionsFromMarkdown(content, language);
    
    return questions.slice(0, limit);

  } catch (error) {
    console.error(`Error fetching from GitHub repo ${repoPath}:`, error);
    throw error;
  }
}

function parseQuestionsFromMarkdown(content: string, language: string): any[] {
  const questions: any[] = [];
  
  try {
    // Split content by common question patterns
    const sections = content.split(/(?:^|\n)(?:#+\s*|\*\*|##\s*|\d+\.\s*)/);
    
    let questionCounter = 1;
    
    for (const section of sections) {
      const trimmed = section.trim();
      if (trimmed.length < 10) continue; // Skip very short sections
      
      // Look for question patterns
      const questionMatch = trimmed.match(/^(.+?)\?/);
      if (questionMatch) {
        const questionTitle = questionMatch[1].trim();
        
        // Extract the rest as answer/explanation
        const remainingContent = trimmed.substring(questionMatch[0].length).trim();
        
        // Determine difficulty based on keywords
        const difficulty = determineDifficulty(questionTitle + ' ' + remainingContent);
        
        // Determine category based on keywords
        const category = determineCategory(questionTitle, language);
        
        // Extract code examples
        const codeMatch = remainingContent.match(/```[\s\S]*?```/g);
        const codeExample = codeMatch ? codeMatch[0].replace(/```\w*\n?|\n?```/g, '') : undefined;
        
        // Clean answer text (remove code blocks for separate field)
        const answerText = remainingContent
          .replace(/```[\s\S]*?```/g, '')
          .replace(/\n+/g, ' ')
          .trim()
          .substring(0, 500); // Limit length
        
        if (questionTitle.length > 5 && answerText.length > 10) {
          questions.push({
            id: `github_${language}_${questionCounter++}`,
            question_title: questionTitle + '?',
            question_text: questionTitle + '?',
            answer_text: answerText || 'Answer not available in source.',
            code_example: codeExample,
            explanation: remainingContent.length > answerText.length ? 
              remainingContent.substring(answerText.length, answerText.length + 300) : undefined,
            difficulty,
            category,
            time_to_answer: difficulty === 'beginner' ? 180 : difficulty === 'intermediate' ? 300 : 420,
            tags: extractTags(questionTitle + ' ' + remainingContent),
            source: `GitHub: ${GITHUB_REPOS[language]}`
          });
        }
      }
    }
    
    console.log(`Parsed ${questions.length} questions from GitHub for ${language}`);
    return questions;
    
  } catch (error) {
    console.error('Error parsing markdown:', error);
    return [];
  }
}

function determineDifficulty(text: string): 'beginner' | 'intermediate' | 'advanced' {
  const lowerText = text.toLowerCase();
  
  const advancedKeywords = ['advanced', 'complex', 'optimization', 'performance', 'architecture', 'design pattern', 'algorithm', 'memory', 'concurrency', 'async', 'promise', 'closure', 'prototype'];
  const beginnerKeywords = ['basic', 'simple', 'introduction', 'what is', 'define', 'syntax', 'variable', 'function', 'loop'];
  
  const advancedScore = advancedKeywords.filter(keyword => lowerText.includes(keyword)).length;
  const beginnerScore = beginnerKeywords.filter(keyword => lowerText.includes(keyword)).length;
  
  if (advancedScore > 0) return 'advanced';
  if (beginnerScore > 0) return 'beginner';
  return 'intermediate';
}

function determineCategory(text: string, language: string): string {
  const lowerText = text.toLowerCase();
  
  const categories: Record<string, string[]> = {
    'Functions': ['function', 'method', 'callback', 'arrow', 'closure'],
    'Variables': ['variable', 'const', 'let', 'var', 'scope'],
    'Objects': ['object', 'class', 'inheritance', 'prototype', 'this'],
    'Arrays': ['array', 'list', 'iteration', 'map', 'filter'],
    'Async Programming': ['async', 'await', 'promise', 'callback', 'event'],
    'Syntax': ['syntax', 'operator', 'expression', 'statement'],
    'Data Types': ['type', 'string', 'number', 'boolean', 'null'],
    'Error Handling': ['error', 'exception', 'try', 'catch', 'throw'],
    'Performance': ['performance', 'optimization', 'memory', 'speed'],
    'Testing': ['test', 'unit', 'mock', 'debug']
  };
  
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      return category;
    }
  }
  
  return 'General';
}

function extractTags(text: string): string[] {
  const lowerText = text.toLowerCase();
  const commonTags = [
    'basics', 'advanced', 'syntax', 'function', 'variable', 'object', 'array',
    'async', 'promise', 'callback', 'class', 'inheritance', 'prototype',
    'scope', 'closure', 'this', 'event', 'dom', 'api', 'json', 'error',
    'performance', 'memory', 'algorithm', 'data-structure', 'testing'
  ];
  
  return commonTags.filter(tag => lowerText.includes(tag)).slice(0, 5);
}
