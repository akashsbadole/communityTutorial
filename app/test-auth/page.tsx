"use client";

import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export default function TestAuthPage() {
  const { user, isLoaded } = useUser();
  const [apiResult, setApiResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const testApiAuth = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/debug-auth');
      const data = await response.json();
      setApiResult(data);
    } catch (error) {
      setApiResult({ error: error instanceof Error ? error.message : String(error) });
    } finally {
      setIsLoading(false);
    }
  };

  const testCourseBookingApi = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/course-booking');
      const data = await response.json();
      setApiResult({ courseBookingTest: data, status: response.status });
    } catch (error) {
      setApiResult({ error: error instanceof Error ? error.message : String(error) });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Authentication Test Page</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Frontend Authentication Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p><strong>User ID:</strong> {user?.id || 'Not signed in'}</p>
              <p><strong>Email:</strong> {user?.emailAddresses[0]?.emailAddress || 'N/A'}</p>
              <p><strong>Full Name:</strong> {user?.fullName || 'N/A'}</p>
              <p><strong>Is Loaded:</strong> {isLoaded ? 'Yes' : 'No'}</p>
              <p><strong>Is Authenticated:</strong> {user ? 'Yes' : 'No'}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Authentication Test</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4">
              <Button onClick={testApiAuth} disabled={isLoading}>
                Test Debug API
              </Button>
              <Button onClick={testCourseBookingApi} disabled={isLoading}>
                Test Course Booking API
              </Button>
            </div>
            
            {apiResult && (
              <div className="mt-4">
                <h3 className="font-semibold mb-2">API Response:</h3>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                  {JSON.stringify(apiResult, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {!user ? (
              <Button asChild>
                <a href="/sign-in">Sign In</a>
              </Button>
            ) : (
              <div className="space-y-2">
                <Button asChild>
                  <a href="/course-booking/wordpress-dev/tutor_001">Test Course Booking</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/student/dashboard">Go to Dashboard</a>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
