"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";

export function AuthHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isLoaded } = useUser();

  return (
    <header className="bg-white shadow-sm border-b z-[999] relative">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between text-sm">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-blue-600">
            TrainingHub
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <NavLinks isLoaded={isLoaded} />
          </div>

          {/* Mobile Toggle Button */}
          <button
            className="md:hidden text-gray-700 z-[1000]" // Ensure button is above other elements
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </div>

      {/* Mobile Nav Drawer */}
      {menuOpen && (
        <div className="fixed inset-0 bg-white z-[998] flex flex-col gap-4 p-6 md:hidden overflow-y-auto">
          <NavLinks isLoaded={isLoaded} closeMenu={() => setMenuOpen(false)} />
        </div>
      )}
    </header>
  );
}

// Extracted for reusability
function NavLinks({
  isLoaded,
  closeMenu,
}: {
  isLoaded: boolean;
  closeMenu?: () => void;
}) {
  const linkClasses = "text-gray-600 hover:text-gray-900";

  const handleClick = () => {
    if (closeMenu) closeMenu();
  };

  return (
    <>
      <Link href="/" className={linkClasses} onClick={handleClick}>
        Home
      </Link>
      <Link href="/search" className={linkClasses} onClick={handleClick}>
        Search Courses
      </Link>
      <Link href="/subjects" className={linkClasses} onClick={handleClick}>
        Subjects
      </Link>
      <Link href="/interview" className={linkClasses} onClick={handleClick}>
        Interview Questions
      </Link>
      <Link
        href="/interview-practice"
        className={linkClasses}
        onClick={handleClick}
      >
        AI Interview Practice
      </Link>
      <Link
        href="/interview-simple"
        className={linkClasses}
        onClick={handleClick}
      >
        Simple Interview
      </Link>
      {isLoaded && (
        <SignedIn>
          <Link href="/dashboard" className={linkClasses} onClick={handleClick}>
            Dashboard
          </Link>
        </SignedIn>
      )}
      <Link href="/contact" className={linkClasses} onClick={handleClick}>
        Contact
      </Link>

      {isLoaded ? (
        <>
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="outline" size="sm" onClick={handleClick}>
                Sign In
              </Button>
            </SignInButton>
            <Button asChild size="sm" onClick={handleClick}>
              <Link href="/sign-up">Sign Up</Link>
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </>
      ) : (
        <Button variant="outline" size="sm" disabled>
          Loading...
        </Button>
      )}
    </>
  );
}
