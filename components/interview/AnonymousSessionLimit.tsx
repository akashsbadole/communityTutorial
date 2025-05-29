'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAnonymousSessionStore } from '@/lib/stores/anonymous-session-store';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Lock, 
  User, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  Star
} from 'lucide-react';

interface AnonymousSessionLimitProps {
  onContinue?: () => void;
}

export function AnonymousSessionLimit({ onContinue }: AnonymousSessionLimitProps) {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const {
    questionsAnswered,
    canContinue,
    getRemainingQuestions,
    hasShownLoginPrompt,
    setLoginPromptShown,
    resetSession
  } = useAnonymousSessionStore();

  const [showPrompt, setShowPrompt] = useState(false);
  const remainingQuestions = getRemainingQuestions();
  const progress = (questionsAnswered / 5) * 100;

  useEffect(() => {
    // If user is logged in, reset the anonymous session
    if (isLoaded && user) {
      resetSession();
      return;
    }

    // Show prompt when user reaches the limit
    if (!canContinue() && !hasShownLoginPrompt) {
      setShowPrompt(true);
      setLoginPromptShown(true);
    }
  }, [questionsAnswered, user, isLoaded, canContinue, hasShownLoginPrompt, setLoginPromptShown, resetSession]);

  const handleSignUp = () => {
    router.push('/sign-up?redirect_url=' + encodeURIComponent(window.location.pathname));
  };

  const handleSignIn = () => {
    router.push('/sign-in?redirect_url=' + encodeURIComponent(window.location.pathname));
  };

  const handleContinueAnyway = () => {
    setShowPrompt(false);
    if (onContinue) {
      onContinue();
    }
  };

  // Don't show anything if user is logged in
  if (isLoaded && user) {
    return null;
  }

  // Show limit reached modal
  if (showPrompt) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-xl">Free Trial Complete!</CardTitle>
            <p className="text-gray-600">
              You've completed 5 practice questions. Sign up to continue with unlimited access!
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Benefits */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Unlimited interview practice</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Advanced video analysis</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Progress tracking & analytics</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Download interview recordings</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-4">
              <Button 
                onClick={handleSignUp}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <User className="h-4 w-4 mr-2" />
                Create Free Account
              </Button>
              <Button 
                onClick={handleSignIn}
                variant="outline"
                className="w-full"
              >
                Already have an account? Sign In
              </Button>
              <Button 
                onClick={handleContinueAnyway}
                variant="ghost"
                className="w-full text-gray-500 text-sm"
              >
                Continue without account (limited features)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show progress indicator for anonymous users
  if (!user && questionsAnswered > 0) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">
              Free Trial Progress
            </span>
          </div>
          <span className="text-sm text-blue-700">
            {remainingQuestions} questions remaining
          </span>
        </div>
        <Progress value={progress} className="h-2 mb-2" />
        <p className="text-xs text-blue-700">
          Sign up for unlimited access to all interview features!
        </p>
      </div>
    );
  }

  return null;
}
