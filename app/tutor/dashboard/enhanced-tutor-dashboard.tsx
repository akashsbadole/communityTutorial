"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BookOpen,
  Calendar,
  Clock,
  MessageCircle,
  Star,
  Users,
  DollarSign,
  TrendingUp,
  Video,
  Mail,
  Phone,
  Bell,
  Award,
  Target,
  BarChart3,
  FileText,
  Settings,
  Plus,
  Eye,
  Edit,
  CreditCard,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

// Enhanced tutor data with real enrolled students and payment info
const enhancedTutorData = {
  profile: {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1234567890",
    whatsapp: "+1987654321",
    rating: 4.9,
    totalStudents: 156,
    totalEarnings: 12450,
    coursesTeaching: 3,
    completedSessions: 89,
    responseRate: 98,
    joinedDate: "2023-06-15",
  },
  courses: [
    {
      id: 1,
      title: "WordPress Development Mastery",
      students: 45,
      price: 299.99,
      earnings: 8500,
      rating: 4.9,
      status: "active",
      nextSession: "2024-01-22T19:00:00Z",
      totalSessions: 16,
      completedSessions: 12,
      category: "Web Development",
      enrollmentTrend: "+15%",
      paymentMethods: ["PayPal", "Razorpay"],
    },
    {
      id: 2,
      title: "Advanced WordPress Plugins",
      students: 28,
      price: 199.99,
      earnings: 3200,
      rating: 4.8,
      status: "active",
      nextSession: "2024-01-23T18:00:00Z",
      totalSessions: 12,
      completedSessions: 8,
      category: "Web Development",
      enrollmentTrend: "+8%",
      paymentMethods: ["PayPal", "Razorpay"],
    },
  ],
  students: [
    {
      id: "student_001",
      name: "Alice Johnson",
      email: "alice@example.com",
      course: "WordPress Development Mastery",
      progress: 75,
      lastActive: "2024-01-21",
      status: "active",
      joinedDate: "2024-01-01",
      completedAssignments: 8,
      totalAssignments: 12,
      paymentStatus: "paid",
      paymentMethod: "PayPal",
      amountPaid: 299.99,
    },
    {
      id: "student_002",
      name: "Bob Smith",
      email: "bob@example.com",
      course: "WordPress Development Mastery",
      progress: 60,
      lastActive: "2024-01-20",
      status: "active",
      joinedDate: "2024-01-05",
      completedAssignments: 6,
      totalAssignments: 12,
      paymentStatus: "paid",
      paymentMethod: "Razorpay",
      amountPaid: 299.99,
    },
    {
      id: "student_003",
      name: "Carol Davis",
      email: "carol@example.com",
      course: "Advanced WordPress Plugins",
      progress: 90,
      lastActive: "2024-01-19",
      status: "active",
      joinedDate: "2023-12-20",
      completedAssignments: 10,
      totalAssignments: 10,
      paymentStatus: "paid",
      paymentMethod: "PayPal",
      amountPaid: 199.99,
    },
  ],
  upcomingSessions: [
    {
      id: 1,
      course: "WordPress Development Mastery",
      student: "Alice Johnson",
      date: "2024-01-22",
      time: "19:00",
      duration: "2 hours",
      type: "Live Session",
      topic: "Advanced Plugin Development",
      meetingLink: "https://zoom.us/j/123456789",
      studentCount: 12,
    },
    {
      id: 2,
      course: "Advanced WordPress Plugins",
      student: "Group Session",
      date: "2024-01-23",
      time: "18:00",
      duration: "1.5 hours",
      type: "Group Session",
      topic: "Custom Post Types",
      meetingLink: "https://zoom.us/j/987654321",
      studentCount: 8,
    },
  ],
  earnings: {
    thisMonth: 2450,
    lastMonth: 2100,
    thisYear: 12450,
    pending: 350,
    nextPayout: "2024-01-25",
    payoutMethod: "PayPal",
    paymentBreakdown: {
      paypal: 8500,
      razorpay: 3950,
    },
  },
  analytics: {
    studentSatisfaction: 96,
    courseCompletion: 87,
    responseTime: "< 2 hours",
    sessionAttendance: 94,
  },
};

export default function EnhancedTutorDashboard() {
  const { user } = useUser();
  const [tutorData, setTutorData] = useState(enhancedTutorData);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading real data
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome back, {user?.fullName || tutorData.profile.name}!
                </h1>
                <p className="text-gray-600">Manage your courses and students</p>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant="secondary" className="px-3 py-1">
                  <Star className="h-4 w-4 mr-1" />
                  {tutorData.profile.rating} Rating
                </Badge>
                <Button asChild>
                  <Link href="/tutor/courses/new">
                    <Plus className="h-4 w-4 mr-1" />
                    Create Course
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Enhanced Tabs Navigation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="courses" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                My Courses
              </TabsTrigger>
              <TabsTrigger value="students" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Students
              </TabsTrigger>
              <TabsTrigger value="schedule" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Schedule
              </TabsTrigger>
              <TabsTrigger value="earnings" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Earnings
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Analytics
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Students</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {tutorData.profile.totalStudents}
                        </p>
                      </div>
                      <Users className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Active Courses</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {tutorData.profile.coursesTeaching}
                        </p>
                      </div>
                      <BookOpen className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                        <p className="text-2xl font-bold text-gray-900">
                          ${tutorData.profile.totalEarnings.toLocaleString()}
                        </p>
                      </div>
                      <DollarSign className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Rating</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {tutorData.profile.rating}/5.0
                        </p>
                      </div>
                      <Star className="h-8 w-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Continue with other content... */}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
