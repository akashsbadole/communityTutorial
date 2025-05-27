"use client";

import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Award, 
  Download, 
  Share2, 
  Verified, 
  Calendar,
  User,
  BookOpen,
  Star,
  Shield,
  QrCode
} from "lucide-react";

interface CertificateProps {
  certificate: {
    certificateNumber: string;
    studentName: string;
    courseName: string;
    grade: string;
    score: number;
    issueDate: string;
    verificationUrl: string;
    design?: {
      backgroundColor?: string;
      primaryColor?: string;
      secondaryColor?: string;
      accentColor?: string;
    };
    metadata?: {
      totalTopics?: number;
      completedTopics?: number;
      timeSpent?: string;
      achievements?: string[];
    };
  };
  showActions?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export default function Certificate({ certificate, showActions = true, size = 'large' }: CertificateProps) {
  const {
    certificateNumber,
    studentName,
    courseName,
    grade,
    score,
    issueDate,
    verificationUrl,
    design = {},
    metadata = {}
  } = certificate;

  const {
    backgroundColor = '#ffffff',
    primaryColor = '#2563eb',
    secondaryColor = '#1e40af',
    accentColor = '#f59e0b'
  } = design;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+': case 'A': return 'text-green-600';
      case 'B+': case 'B': return 'text-blue-600';
      case 'C+': case 'C': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const handleDownload = () => {
    // In a real implementation, this would generate and download a PDF
    console.log('Downloading certificate:', certificateNumber);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Certificate of Completion - ${courseName}`,
        text: `I've completed ${courseName} and earned a certificate!`,
        url: verificationUrl
      });
    } else {
      // Fallback to copying URL
      navigator.clipboard.writeText(verificationUrl);
    }
  };

  const sizeClasses = {
    small: 'max-w-md',
    medium: 'max-w-2xl',
    large: 'max-w-4xl'
  };

  return (
    <div className={`mx-auto ${sizeClasses[size]}`}>
      <Card 
        className="relative overflow-hidden border-2 shadow-2xl"
        style={{ 
          backgroundColor,
          borderColor: primaryColor,
          background: `linear-gradient(135deg, ${backgroundColor} 0%, ${backgroundColor}f0 100%)`
        }}
      >
        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-32 h-32 rounded-full" style={{ backgroundColor: primaryColor }}></div>
          <div className="absolute top-10 right-10 w-24 h-24 rounded-full" style={{ backgroundColor: accentColor }}></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 rounded-full" style={{ backgroundColor: secondaryColor }}></div>
          <div className="absolute bottom-10 left-10 w-20 h-20 rounded-full" style={{ backgroundColor: accentColor }}></div>
        </div>

        {/* Certificate Content */}
        <div className="relative z-10 p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div 
                className="p-4 rounded-full"
                style={{ backgroundColor: `${primaryColor}20` }}
              >
                <Award className="h-12 w-12" style={{ color: primaryColor }} />
              </div>
            </div>
            
            <h1 
              className="text-3xl md:text-4xl font-bold mb-2"
              style={{ color: primaryColor }}
            >
              Certificate of Completion
            </h1>
            
            <div className="flex justify-center items-center gap-2 mb-4">
              <Verified className="h-5 w-5 text-green-600" />
              <span className="text-green-600 font-semibold">Verified Certificate</span>
            </div>
          </div>

          {/* Main Content */}
          <div className="text-center mb-8">
            <p className="text-lg text-gray-600 mb-4">This is to certify that</p>
            
            <h2 
              className="text-2xl md:text-3xl font-bold mb-6"
              style={{ color: secondaryColor }}
            >
              {studentName}
            </h2>
            
            <p className="text-lg text-gray-600 mb-4">has successfully completed the course</p>
            
            <h3 
              className="text-xl md:text-2xl font-semibold mb-6 px-4"
              style={{ color: primaryColor }}
            >
              {courseName}
            </h3>

            {/* Grade and Score */}
            <div className="flex justify-center items-center gap-6 mb-6">
              <div className="text-center">
                <div className={`text-3xl font-bold ${getGradeColor(grade)}`}>
                  {grade}
                </div>
                <div className="text-sm text-gray-500">Grade</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold" style={{ color: accentColor }}>
                  {score}%
                </div>
                <div className="text-sm text-gray-500">Score</div>
              </div>
            </div>
          </div>

          {/* Certificate Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-500" />
                <div>
                  <div className="text-sm text-gray-500">Issue Date</div>
                  <div className="font-semibold">{formatDate(issueDate)}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-gray-500" />
                <div>
                  <div className="text-sm text-gray-500">Certificate ID</div>
                  <div className="font-mono text-sm">{certificateNumber}</div>
                </div>
              </div>
            </div>

            {metadata.totalTopics && (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-gray-500" />
                  <div>
                    <div className="text-sm text-gray-500">Topics Completed</div>
                    <div className="font-semibold">{metadata.completedTopics}/{metadata.totalTopics}</div>
                  </div>
                </div>
                
                {metadata.timeSpent && (
                  <div className="flex items-center gap-3">
                    <Star className="h-5 w-5 text-gray-500" />
                    <div>
                      <div className="text-sm text-gray-500">Time Invested</div>
                      <div className="font-semibold">{metadata.timeSpent}</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Achievements */}
          {metadata.achievements && metadata.achievements.length > 0 && (
            <div className="mb-8">
              <h4 className="text-lg font-semibold mb-3 text-center" style={{ color: primaryColor }}>
                Achievements
              </h4>
              <div className="flex flex-wrap justify-center gap-2">
                {metadata.achievements.map((achievement, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary"
                    className="text-xs"
                    style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
                  >
                    {achievement}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Verification */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
              <QrCode className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                Verify at: <span className="font-mono">{verificationUrl}</span>
              </span>
            </div>
          </div>

          {/* Signature Area */}
          <div className="border-t pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-center">
                <div className="border-b border-gray-300 mb-2 pb-1">
                  <div className="h-8"></div>
                </div>
                <div className="text-sm text-gray-600">TrainingHub Platform</div>
                <div className="text-xs text-gray-500">Authorized Signature</div>
              </div>
              
              <div className="text-center">
                <div className="border-b border-gray-300 mb-2 pb-1">
                  <div className="h-8"></div>
                </div>
                <div className="text-sm text-gray-600">{formatDate(issueDate)}</div>
                <div className="text-xs text-gray-500">Date of Issue</div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Border */}
        <div 
          className="absolute inset-0 border-8 rounded-lg pointer-events-none"
          style={{ borderColor: `${primaryColor}30` }}
        ></div>
      </Card>

      {/* Action Buttons */}
      {showActions && (
        <div className="flex justify-center gap-4 mt-6">
          <Button onClick={handleDownload} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
          
          <Button variant="outline" onClick={handleShare} className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Share Certificate
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => window.open(verificationUrl, '_blank')}
            className="flex items-center gap-2"
          >
            <Verified className="h-4 w-4" />
            Verify Online
          </Button>
        </div>
      )}
    </div>
  );
}
