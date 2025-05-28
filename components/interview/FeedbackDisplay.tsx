'use client';

import { useInterviewStore } from '@/lib/stores/interview-store';
import { Eye, User, Volume2, TrendingUp, CheckCircle, AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export function FeedbackDisplay() {
  const { analysisResults, realTimeAnalysis, isRecording } = useInterviewStore();

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    if (score >= 70) return 'Average';
    if (score >= 60) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <div className="space-y-4">
      {/* Overall Score */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center">
          <div className="relative inline-block mb-4">
            <div className="w-20 h-20 rounded-full border-4 border-gray-200 flex items-center justify-center mx-auto relative">
              <div 
                className={`absolute inset-0 rounded-full border-4 ${
                  analysisResults.overallScore >= 8 ? 'border-green-500' :
                  analysisResults.overallScore >= 6 ? 'border-yellow-500' : 'border-red-500'
                }`}
                style={{
                  background: `conic-gradient(${
                    analysisResults.overallScore >= 8 ? '#10b981' :
                    analysisResults.overallScore >= 6 ? '#f59e0b' : '#ef4444'
                  } ${analysisResults.overallScore * 36}deg, transparent 0deg)`
                }}
              ></div>
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center relative z-10">
                <span className={`text-lg font-bold ${getScoreColor(analysisResults.overallScore * 10)}`}>
                  {analysisResults.overallScore}/10
                </span>
              </div>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Overall Performance
          </h3>
          <p className={`text-sm font-medium ${getScoreColor(analysisResults.overallScore * 10)}`}>
            {getScoreLabel(analysisResults.overallScore * 10)}
          </p>
        </div>
      </div>

      {/* Real-time Indicators */}
      {isRecording && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Live Analysis
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className={`p-3 rounded-lg ${
              realTimeAnalysis.faceDetected ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center gap-2 mb-1">
                <User className={`h-4 w-4 ${realTimeAnalysis.faceDetected ? 'text-green-600' : 'text-red-600'}`} />
                <span className="text-xs font-medium">Face</span>
              </div>
              <p className={`text-xs ${realTimeAnalysis.faceDetected ? 'text-green-700' : 'text-red-700'}`}>
                {realTimeAnalysis.faceDetected ? 'Detected' : 'Not Detected'}
              </p>
            </div>

            <div className={`p-3 rounded-lg ${
              realTimeAnalysis.lookingAtCamera ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
            }`}>
              <div className="flex items-center gap-2 mb-1">
                <Eye className={`h-4 w-4 ${realTimeAnalysis.lookingAtCamera ? 'text-green-600' : 'text-yellow-600'}`} />
                <span className="text-xs font-medium">Eye Contact</span>
              </div>
              <p className={`text-xs ${realTimeAnalysis.lookingAtCamera ? 'text-green-700' : 'text-yellow-700'}`}>
                {realTimeAnalysis.lookingAtCamera ? 'Good' : 'Look at Camera'}
              </p>
            </div>

            <div className={`p-3 rounded-lg ${
              realTimeAnalysis.goodPosture ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'
            }`}>
              <div className="flex items-center gap-2 mb-1">
                <User className={`h-4 w-4 ${realTimeAnalysis.goodPosture ? 'text-green-600' : 'text-yellow-600'}`} />
                <span className="text-xs font-medium">Posture</span>
              </div>
              <p className={`text-xs ${realTimeAnalysis.goodPosture ? 'text-green-700' : 'text-yellow-700'}`}>
                {realTimeAnalysis.goodPosture ? 'Good' : 'Adjust Position'}
              </p>
            </div>

            <div className={`p-3 rounded-lg ${
              realTimeAnalysis.speaking ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50 border border-gray-200'
            }`}>
              <div className="flex items-center gap-2 mb-1">
                <Volume2 className={`h-4 w-4 ${realTimeAnalysis.speaking ? 'text-blue-600' : 'text-gray-600'}`} />
                <span className="text-xs font-medium">Audio</span>
              </div>
              <p className={`text-xs ${realTimeAnalysis.speaking ? 'text-blue-700' : 'text-gray-700'}`}>
                {realTimeAnalysis.speaking ? 'Speaking' : 'Silent'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Scores */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h4 className="font-medium text-gray-900 mb-4">Performance Metrics</h4>
        <div className="space-y-4">
          {/* Confidence */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Confidence</span>
              <span className={`text-sm font-semibold ${getScoreColor(analysisResults.confidence)}`}>
                {analysisResults.confidence}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(analysisResults.confidence)}`}
                style={{ width: `${analysisResults.confidence}%` }}
              ></div>
            </div>
          </div>

          {/* Eye Contact */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Eye Contact</span>
              <span className={`text-sm font-semibold ${getScoreColor(analysisResults.eyeContact)}`}>
                {analysisResults.eyeContact}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(analysisResults.eyeContact)}`}
                style={{ width: `${analysisResults.eyeContact}%` }}
              ></div>
            </div>
          </div>

          {/* Posture */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Posture</span>
              <span className={`text-sm font-semibold ${getScoreColor(analysisResults.posture)}`}>
                {analysisResults.posture}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(analysisResults.posture)}`}
                style={{ width: `${analysisResults.posture}%` }}
              ></div>
            </div>
          </div>

          {/* Engagement */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Engagement</span>
              <span className={`text-sm font-semibold ${getScoreColor(analysisResults.engagement)}`}>
                {analysisResults.engagement}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(analysisResults.engagement)}`}
                style={{ width: `${analysisResults.engagement}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Suggestions */}
      {analysisResults.suggestions.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            Improvement Tips
          </h4>
          <ul className="space-y-2">
            {analysisResults.suggestions.slice(0, 3).map((suggestion, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Privacy Notice */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <span className="text-xs font-medium text-green-900">Privacy Protected</span>
        </div>
        <p className="text-xs text-green-800 mt-1">
          All analysis is done locally. No video or audio is stored or transmitted.
        </p>
      </div>
    </div>
  );
}
