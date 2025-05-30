"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";

export function AuthHeader() {
  const { isLoaded } = useUser();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between text-sm">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            TrainingHub
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              Home
            </Link>
            <Link href="/search" className="text-gray-600 hover:text-gray-900">
              Search Courses
            </Link>
            <Link
              href="/subjects"
              className="text-gray-600 hover:text-gray-900"
            >
              Subjects
            </Link>
            <Link
              href="/interview"
              className="text-gray-600 hover:text-gray-900"
            >
              Interview Questions
            </Link>
            <Link
              href="/interview-practice"
              className="text-gray-600 hover:text-gray-900"
            >
              AI Interview Practice
            </Link>
            <Link
              href="/interview-simple"
              className="text-gray-600 hover:text-gray-900"
            >
              Simple Interview
            </Link>
            {isLoaded && (
              <SignedIn>
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Dashboard
                </Link>
              </SignedIn>
            )}
            <Link href="/contact" className="text-gray-600 hover:text-gray-900">
              Contact
            </Link>
            {isLoaded && (
              <>
                <SignedOut>
                  <SignInButton mode="modal">
                    <Button variant="outline" size="sm">
                      Sign In
                    </Button>
                  </SignInButton>
                  <Button asChild size="sm">
                    <Link href="/sign-up">Sign Up</Link>
                  </Button>
                </SignedOut>
                <SignedIn>
                  <UserButton afterSignOutUrl="/" />
                </SignedIn>
              </>
            )}
            {!isLoaded && (
              <Button variant="outline" size="sm" disabled>
                Loading...
              </Button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
