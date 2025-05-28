"use client";

import Link from "next/link";
import { useState } from "react";
import {
  BookOpen,
  Code,
  ShoppingCart,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  HelpCircle,
  Shield,
  FileText,
  Menu,
  Loader2,
  CheckCircle,
  AlertCircle,
  Coffee,
  Heart,
  ExternalLink,
  Video,
} from "lucide-react";
import { toast } from "sonner";

const footerSections = [
  {
    title: "Courses",
    links: [
      { name: "WordPress Course", href: "/course/wordpress", icon: BookOpen },
      { name: "Shopify Course", href: "/course/shopify", icon: ShoppingCart },
      { name: "Web Development", href: "/course/webdev", icon: Code },
      { name: "All Courses", href: "/", icon: BookOpen },
    ],
  },
  {
    title: "Interview Prep",
    links: [
      { name: "Interview Questions", href: "/interview", icon: HelpCircle },
      {
        name: "AI Interview Practice",
        href: "/interview-practice",
        icon: Code,
      },
      {
        name: "Simple Interview",
        href: "/interview-simple",
        icon: Video,
      },
      {
        name: "Tutorials",
        href: "/interview/javascript/tutorials",
        icon: BookOpen,
      },
      {
        name: "Practice Tests",
        href: "/interview/javascript/questions",
        icon: FileText,
      },
    ],
  },
  {
    title: "Support",
    links: [
      { name: "Help Center", href: "/help", icon: HelpCircle },
      { name: "Contact Us", href: "/contact", icon: Mail },
      { name: "FAQ", href: "/faq", icon: HelpCircle },
      { name: "Site Menu", href: "/menu", icon: Menu },
    ],
  },
  {
    title: "Legal",
    links: [
      { name: "Privacy Policy", href: "/privacy", icon: Shield },
      { name: "Terms of Service", href: "/terms", icon: FileText },
    ],
  },
  // {
  //   title: "Company",
  //   links: [
  //     { name: "About Us", href: "/about", icon: null },
  //     { name: "Our Mission", href: "/about#mission", icon: null },
  //     { name: "Instructors", href: "/about#team", icon: null },
  //     { name: "Careers", href: "/about#careers", icon: null },
  //   ],
  // },
];

const socialLinks = [
  { name: "Facebook", href: "#", icon: Facebook },
  { name: "Twitter", href: "#", icon: Twitter },
  { name: "Instagram", href: "#", icon: Instagram },
  { name: "LinkedIn", href: "#", icon: Linkedin },
  { name: "YouTube", href: "#", icon: Youtube },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleEmailSubscription = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setIsSubscribing(true);
    setSubscriptionStatus("idle");

    try {
      const response = await fetch("/api/email/subscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          source: "footer",
          preferences: {
            newsletter: true,
            course_updates: true,
            promotional: true,
          },
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubscriptionStatus("success");
        setEmail("");
        toast.success(
          data.message || "Successfully subscribed to our newsletter!"
        );

        // Show additional info if Mailchimp integration is working
        if (data.mailchimp_integrated) {
          toast.info(
            "You'll receive a confirmation email from Mailchimp shortly."
          );
        }
      } else {
        setSubscriptionStatus("error");
        toast.error(data.error || "Failed to subscribe. Please try again.");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      setSubscriptionStatus("error");
      toast.error("Network error. Please check your connection and try again.");
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="text-2xl font-bold text-blue-400 mb-4 block"
            >
              TrainingHub
            </Link>
            <p className="text-gray-300 mb-6 leading-relaxed text-sm">
              Empowering developers and entrepreneurs with comprehensive online
              courses in WordPress, Shopify, and Web Development. Learn from
              industry experts and build your dream career.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-300">
                <Mail className="h-4 w-4 text-blue-400" />
                <span className="text-[10px]">info@seoauditcheck.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Phone className="h-4 w-4 text-blue-400" />
                <span className="text-[10px]">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <MapPin className="h-4 w-4 text-blue-400" />
                <span className="text-[10px]">
                  123 Learning Street, Education City
                </span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index} className="lg:col-span-1">
              <h3 className="text-lg font-semibold text-white mb-4 text-[13px]">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => {
                  const IconComponent = link.icon;
                  return (
                    <li key={linkIndex}>
                      <Link
                        href={link.href}
                        className="text-gray-300 text-sm hover:text-blue-400 transition-colors flex items-center gap-2"
                      >
                        {IconComponent && <IconComponent className="h-4 w-4" />}
                        {link.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Links & Newsletter */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <span className="text-gray-300 mr-2 text-[11px]">Follow us:</span>
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <Link
                    key={index}
                    href={social.href}
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                    aria-label={social.name}
                  >
                    <IconComponent className="h-5 w-5" />
                  </Link>
                );
              })}
            </div>

            {/* Newsletter Signup */}
            <div className="flex items-center gap-3">
              <span className="text-gray-300 text-[11px]">Stay updated:</span>
              <form onSubmit={handleEmailSubscription} className="flex gap-2">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    disabled={isSubscribing}
                    className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-[10px]"
                    required
                  />
                  {subscriptionStatus === "success" && (
                    <CheckCircle className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-400" />
                  )}
                  {subscriptionStatus === "error" && (
                    <AlertCircle className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-400" />
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isSubscribing || !email}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-md transition-colors flex items-center gap-2"
                >
                  {isSubscribing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-[10px]">Subscribing...</span>
                    </>
                  ) : (
                    <>
                      <Mail className="h-4 w-4" />
                      <span className="text-[10px]">Subscribe</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Donation Button */}
            <div className="flex items-center gap-3">
              <span className="text-gray-300 text-[10px]">Support us:</span>
              <a
                href="https://www.buymeacoffee.com/akashbad"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-md transition-all duration-300 flex items-center gap-2 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Coffee className="h-4 w-4" />
                <span className="text-[10px]">Buy me a coffee</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} TrainingHub. All rights reserved.
            </div>

            <div className="flex items-center gap-6 text-[12px]">
              <Link
                href="/privacy"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/contact"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
