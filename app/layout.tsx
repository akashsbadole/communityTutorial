import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/footer";
import { ClerkProvider } from "@clerk/nextjs";
import { AuthHeader } from "@/components/auth-header";

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
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className} suppressHydrationWarning={true}>
          <AuthHeader />

          <main>{children}</main>

          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
