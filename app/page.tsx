import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Code,
  ShoppingCart,
  Clock,
  Users,
  MessageCircle,
  Linkedin,
  Search,
  HeadphonesIcon,
  CheckCircle,
  Star,
  Globe,
  Briefcase,
  Video,
  FileText,
  HelpCircle,
  Sparkles,
  Rocket,
  Play,
  Volume2,
  Shield,
  Zap,
} from "lucide-react";
import { getAllCourses } from "@/lib/db";
import { StickyEnrollmentForm } from "@/components/sticky-enrollment-form";

const getIconForCourse = (slug: string) => {
  switch (slug) {
    case "wordpress":
      return BookOpen;
    case "shopify":
      return ShoppingCart;
    case "webdev":
      return Code;
    default:
      return BookOpen;
  }
};

export default async function HomePage() {
  const courses = await getAllCourses();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Development Notice */}
        {process.env.NODE_ENV === "development" && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-yellow-800">
                <strong>Development Mode:</strong> Application running with mock
                data (database connection unavailable)
              </span>
            </div>
          </div>
        )}

        {/* Modern Hero Section */}
        <div className="text-center mb-20">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-3xl blur-3xl"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-white/20">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles className="h-4 w-4" />
                <span>New Interactive Features Available!</span>
              </div>

              <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-6">
                Master Your Skills with Expert Training
              </h1>

              <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
                Join thousands of students learning WordPress, Shopify, and Web
                Development through our comprehensive online courses with{" "}
                <strong>live sessions</strong>, <strong>real-time chat</strong>,
                <strong>assignment submissions</strong>, and{" "}
                <strong>24/7 support</strong>.
              </p>

              {/* Feature Highlights */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="flex flex-col items-center p-4 bg-blue-50 rounded-xl">
                  <Video className="h-8 w-8 text-blue-600 mb-2" />
                  <span className="text-sm font-medium text-blue-900">
                    Live Sessions
                  </span>
                </div>
                <div className="flex flex-col items-center p-4 bg-green-50 rounded-xl">
                  <MessageCircle className="h-8 w-8 text-green-600 mb-2" />
                  <span className="text-sm font-medium text-green-900">
                    Real-time Chat
                  </span>
                </div>
                <div className="flex flex-col items-center p-4 bg-purple-50 rounded-xl">
                  <FileText className="h-8 w-8 text-purple-600 mb-2" />
                  <span className="text-sm font-medium text-purple-900">
                    Assignments
                  </span>
                </div>
                <div className="flex flex-col items-center p-4 bg-orange-50 rounded-xl">
                  <HelpCircle className="h-8 w-8 text-orange-600 mb-2" />
                  <span className="text-sm font-medium text-orange-900">
                    24/7 Support
                  </span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold shadow-lg"
                >
                  <Rocket className="h-5 w-5 mr-2" />
                  Start Learning Today
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-gray-300 hover:border-blue-600 px-8 py-4 text-lg font-semibold"
                >
                  <Play className="h-5 w-5 mr-2" />
                  Watch Demo
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">5,000+</div>
                  <div className="text-sm text-gray-600">Students Enrolled</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">98%</div>
                  <div className="text-sm text-gray-600">Satisfaction Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">24/7</div>
                  <div className="text-sm text-gray-600">Expert Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Interview Platform - Featured Section */}
        <div className="mb-20">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl shadow-2xl p-8 md:p-12 max-w-6xl mx-auto text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/20 to-transparent"></div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/10 rounded-full"></div>
            </div>

            <div className="relative z-10">
              <div className="text-center mb-12">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-6">
                  <Video className="h-10 w-10 text-white" />
                </div>
                <h2 className="text-4xl md:text-5xl font-bold mb-4">
                  🚀 AI Interview Practice Platform
                </h2>
                <p className="text-xl md:text-2xl text-purple-100 max-w-4xl mx-auto mb-6">
                  Master your interview skills with our cutting-edge AI-powered
                  platform featuring
                  <strong className="text-white">
                    {" "}
                    real-time video analysis
                  </strong>
                  ,<strong className="text-white"> instant feedback</strong>,
                  and
                  <strong className="text-white">
                    {" "}
                    privacy-first approach
                  </strong>
                </p>
                <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-sm font-medium">
                  <Sparkles className="h-4 w-4" />
                  <span>Most Popular Feature - Try Free Now!</span>
                </div>
              </div>

              {/* Key Features Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-lg mb-4">
                    <Video className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    5-Min Video Analysis
                  </h3>
                  <p className="text-purple-100 text-sm">
                    Real-time facial expression, eye contact, and posture
                    analysis with auto-deletion
                  </p>
                </div>

                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-lg mb-4">
                    <Volume2 className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    AI Voice Interviewer
                  </h3>
                  <p className="text-purple-100 text-sm">
                    Natural TTS questions with speech analysis and confidence
                    scoring
                  </p>
                </div>

                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-lg mb-4">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    Privacy Protected
                  </h3>
                  <p className="text-purple-100 text-sm">
                    No video storage - everything deleted immediately after
                    session
                  </p>
                </div>

                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-lg mb-4">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    Instant Feedback
                  </h3>
                  <p className="text-purple-100 text-sm">
                    Live analysis with downloadable results and improvement
                    suggestions
                  </p>
                </div>
              </div>

              {/* 3-Step Process */}
              <div className="bg-white/10 rounded-2xl p-8 mb-8">
                <h3 className="text-2xl font-bold text-center mb-8">
                  Simple 3-Step Process
                </h3>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-xl font-bold">1</span>
                    </div>
                    <h4 className="text-lg font-semibold mb-2">
                      Start Interview
                    </h4>
                    <p className="text-purple-100 text-sm">
                      Click start, allow camera access, and begin your practice
                      session
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-xl font-bold">2</span>
                    </div>
                    <h4 className="text-lg font-semibold mb-2">
                      Answer Questions
                    </h4>
                    <p className="text-purple-100 text-sm">
                      Listen to AI questions and answer while getting real-time
                      feedback
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-xl font-bold">3</span>
                    </div>
                    <h4 className="text-lg font-semibold mb-2">Get Results</h4>
                    <p className="text-purple-100 text-sm">
                      Download your video and receive detailed performance
                      analysis
                    </p>
                  </div>
                </div>
              </div>

              {/* CTA Section */}
              <div className="text-center">
                <div className="mb-6">
                  <div className="inline-flex items-center gap-4 text-sm text-purple-100 mb-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      <span>5 Free Questions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      <span>No Registration Required</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      <span>Instant Results</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    size="lg"
                    className="bg-white text-purple-600 hover:bg-purple-50 font-semibold px-8 py-4 text-lg shadow-lg"
                    asChild
                  >
                    <Link href="/interview-simple">
                      <Play className="h-5 w-5 mr-2" />
                      Start Free Interview Practice
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 text-lg font-semibold"
                    asChild
                  >
                    <Link href="/interview-practice">
                      <Video className="h-5 w-5 mr-2" />
                      View All Languages
                    </Link>
                  </Button>
                </div>

                <p className="text-purple-100 text-sm mt-4">
                  ⭐ Join 10,000+ students who improved their interview
                  confidence
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {courses.map((course: any) => {
            const IconComponent = getIconForCourse(course.slug);
            return (
              <Card
                key={course.slug}
                className="hover:shadow-lg transition-shadow duration-300 bg-white"
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl">{course.name}</CardTitle>
                  </div>
                  <CardDescription className="text-gray-600">
                    {course.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Duration:</span>
                      <span className="font-medium">{course.duration}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Level:</span>
                      <span className="font-medium">{course.level}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Price:</span>
                      <Badge
                        variant="secondary"
                        className="font-bold text-green-700"
                      >
                        {course.price}
                      </Badge>
                    </div>
                  </div>
                  <Button asChild className="w-full">
                    <Link href={`/course/${course.slug}`}>
                      View Course Details
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* 24/7 Tutor Support Section */}
        <div className="mt-20 mb-16">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-8 md:p-12 max-w-6xl mx-auto text-white">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
                <HeadphonesIcon className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                24/7 Tutor Support - We're Always Here for You!
              </h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Your success is our priority. Get instant help from expert
                tutors anytime, anywhere. We'll support you until your course is
                completed successfully.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-lg mb-4">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Instant Messaging
                </h3>
                <p className="text-blue-100">
                  Get immediate responses via WhatsApp, email, or our platform
                  messaging system.
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-lg mb-4">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Global Availability
                </h3>
                <p className="text-blue-100">
                  Our tutors are available across different time zones to help
                  you whenever you need.
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 rounded-lg mb-4">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Until Completion</h3>
                <p className="text-blue-100">
                  We don't stop helping until you successfully complete your
                  course and achieve your goals.
                </p>
              </div>
            </div>

            <div className="bg-white/10 rounded-xl p-6 mb-8">
              <h4 className="text-lg font-semibold mb-4 text-center">
                How to Get Help:
              </h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-bold">1</span>
                  </div>
                  <div>
                    <h5 className="font-semibold mb-1">Send a Message</h5>
                    <p className="text-blue-100 text-sm">
                      WhatsApp, email, or platform chat - choose your preferred
                      method
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-bold">2</span>
                  </div>
                  <div>
                    <h5 className="font-semibold mb-1">Get Instant Response</h5>
                    <p className="text-blue-100 text-sm">
                      Our tutors respond within minutes, not hours
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-bold">3</span>
                  </div>
                  <div>
                    <h5 className="font-semibold mb-1">Solve Your Problem</h5>
                    <p className="text-blue-100 text-sm">
                      Get detailed explanations, code reviews, and personalized
                      guidance
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-bold">4</span>
                  </div>
                  <div>
                    <h5 className="font-semibold mb-1">Continue Learning</h5>
                    <p className="text-blue-100 text-sm">
                      Move forward with confidence and keep building your skills
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-8 py-3"
                asChild
              >
                <a href="https://wa.me/+15551234567?text=Hi! I need help with my course">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Get Help Now via WhatsApp
                </a>
              </Button>
              <p className="text-blue-100 text-sm mt-3">
                Average response time: Under 5 minutes
              </p>
            </div>
          </div>
        </div>

        {/* Placement Assistance Section */}
        <div className="mt-16 mb-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                <Briefcase className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Career Support & Placement Assistance
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                While we don't have a formal placement program, we provide
                comprehensive career support to help you land your dream job
                through popular job platforms.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                  <Linkedin className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">
                  LinkedIn Optimization
                </h3>
                <p className="text-gray-600 text-sm">
                  Profile optimization, networking strategies, and job search
                  techniques
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mb-4">
                  <Search className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">
                  Naukri.com Support
                </h3>
                <p className="text-gray-600 text-sm">
                  Resume building, profile setup, and application strategies for
                  India's top job portal
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
                  <Globe className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">
                  Global Job Portals
                </h3>
                <p className="text-gray-600 text-sm">
                  Indeed, Glassdoor, AngelList, and other international job
                  platforms
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900">
                  Interview Prep
                </h3>
                <p className="text-gray-600 text-sm">
                  Mock interviews, technical questions, and confidence building
                  sessions
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-8 mb-8">
              <h4 className="text-xl font-semibold mb-6 text-center text-gray-900">
                What We Help You With:
              </h4>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h5 className="font-semibold text-gray-900">
                        Resume & Portfolio Building
                      </h5>
                      <p className="text-gray-600 text-sm">
                        Create compelling resumes and showcase your projects
                        effectively
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h5 className="font-semibold text-gray-900">
                        Job Search Strategy
                      </h5>
                      <p className="text-gray-600 text-sm">
                        Learn how to find and apply for the right opportunities
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h5 className="font-semibold text-gray-900">
                        Profile Optimization
                      </h5>
                      <p className="text-gray-600 text-sm">
                        Optimize your LinkedIn, Naukri, and other job portal
                        profiles
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h5 className="font-semibold text-gray-900">
                        Interview Preparation
                      </h5>
                      <p className="text-gray-600 text-sm">
                        Practice technical and behavioral interviews with
                        experts
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h5 className="font-semibold text-gray-900">
                        Networking Guidance
                      </h5>
                      <p className="text-gray-600 text-sm">
                        Build professional connections and expand your network
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h5 className="font-semibold text-gray-900">
                        Freelancing Support
                      </h5>
                      <p className="text-gray-600 text-sm">
                        Start your freelancing career with Upwork, Fiverr, and
                        more
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-200">
              <div className="text-center">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  🎯 Our Success Rate
                </h4>
                <p className="text-gray-600 mb-4">
                  85% of our students find jobs or freelancing opportunities
                  within 3 months of course completion
                </p>
                <div className="flex justify-center gap-8 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      500+
                    </div>
                    <div className="text-gray-600">Students Placed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      ₹4.5L
                    </div>
                    <div className="text-gray-600">Average Package</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      85%
                    </div>
                    <div className="text-gray-600">Success Rate</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-8">
              <Button
                size="lg"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-3"
                asChild
              >
                <Link href="/contact">
                  <Briefcase className="h-5 w-5 mr-2" />
                  Get Career Support
                </Link>
              </Button>
              <p className="text-gray-500 text-sm mt-3">
                Available for all enrolled students at no extra cost
              </p>
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Start Learning?
            </h2>
            <p className="text-gray-600 mb-6">
              Choose a course above and begin your journey to becoming a skilled
              developer. All courses include hands-on projects, expert
              mentorship, and lifetime access.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
              <span>✓ Expert Instructors</span>
              <span>✓ Hands-on Projects</span>
              <span>✓ Lifetime Access</span>
              <span>✓ Certificate of Completion</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Enrollment Form */}
      <StickyEnrollmentForm courses={courses} />
    </div>
  );
}
