import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Online Training Site - Master WordPress, Shopify & Web Development",
  description:
    "Learn WordPress, Shopify, and Web Development through comprehensive online courses taught by industry experts.",
  generator: "v0.dev",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>📚</text></svg>",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center justify-between">
              <Link href="/" className="text-2xl font-bold text-blue-600">
                TrainingHub
              </Link>
              <div className="flex items-center gap-6">
                <Link href="/" className="text-gray-600 hover:text-gray-900">
                  Courses
                </Link>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-gray-900"
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Contact
                </Link>
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </div>
            </nav>
          </div>
        </header>

        <main>{children}</main>

        <footer className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">TrainingHub</h3>
                <p className="text-gray-400">
                  Empowering developers with comprehensive online training
                  courses.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Courses</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <Link href="/course/wordpress" className="hover:text-white">
                      WordPress
                    </Link>
                  </li>
                  <li>
                    <Link href="/course/shopify" className="hover:text-white">
                      Shopify
                    </Link>
                  </li>
                  <li>
                    <Link href="/course/webdev" className="hover:text-white">
                      Web Development
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <Link href="/help" className="hover:text-white">
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="hover:text-white">
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/faq" className="hover:text-white">
                      FAQ
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-gray-400">
                  <li>
                    <Link href="/privacy" className="hover:text-white">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="hover:text-white">
                      Terms of Service
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>&copy; 2024 TrainingHub. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
