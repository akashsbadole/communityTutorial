'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, ArrowRight, CheckCircle } from 'lucide-react';

export default function TutorRegisterPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && user) {
      // If user is already signed in, redirect to tutor setup
      router.push('/tutor/setup');
    }
  }, [isLoaded, user, router]);

  const handleSignUp = () => {
    router.push('/sign-up');
  };

  const handleSignIn = () => {
    router.push('/sign-in');
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Become a Tutor
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join our platform and start teaching students worldwide. Share your expertise and earn money doing what you love.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card>
              <CardHeader>
                <CheckCircle className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Flexible Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Set your own hours and teach when it's convenient for you.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CheckCircle className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Competitive Earnings</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Earn competitive rates with our transparent pricing system.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CheckCircle className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Global Reach</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Teach students from around the world and expand your impact.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Registration Card */}
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <UserPlus className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Ready to Start Teaching?</CardTitle>
              <CardDescription>
                Create your account and set up your tutor profile
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={handleSignUp}
                className="w-full"
                size="lg"
              >
                Sign Up as Tutor
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              <div className="text-center">
                <span className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <button
                    onClick={handleSignIn}
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Sign In
                  </button>
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          <div className="mt-12 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              Tutor Requirements
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                Expertise in your subject area
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                Reliable internet connection
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                Commitment to helping students succeed
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                Professional communication skills
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
