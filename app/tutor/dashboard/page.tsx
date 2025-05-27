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
import { TutorOnly } from "@/components/RoleBasedRedirect";

// Enhanced mock data with real enrolled students and payment info
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

export default function TutorDashboardPage() {
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
    <TutorOnly>
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
                  <p className="text-gray-600">
                    Manage your courses and students
                  </p>
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
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-6"
            >
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger
                  value="overview"
                  className="flex items-center gap-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="courses"
                  className="flex items-center gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  My Courses
                </TabsTrigger>
                <TabsTrigger
                  value="students"
                  className="flex items-center gap-2"
                >
                  <Users className="h-4 w-4" />
                  Students
                </TabsTrigger>
                <TabsTrigger
                  value="schedule"
                  className="flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  Schedule
                </TabsTrigger>
                <TabsTrigger
                  value="earnings"
                  className="flex items-center gap-2"
                >
                  <DollarSign className="h-4 w-4" />
                  Earnings
                </TabsTrigger>
                <TabsTrigger
                  value="analytics"
                  className="flex items-center gap-2"
                >
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
                          <p className="text-sm font-medium text-gray-600">
                            Total Students
                          </p>
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
                          <p className="text-sm font-medium text-gray-600">
                            Active Courses
                          </p>
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
                          <p className="text-sm font-medium text-gray-600">
                            Total Earnings
                          </p>
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
                          <p className="text-sm font-medium text-gray-600">
                            Rating
                          </p>
                          <p className="text-2xl font-bold text-gray-900">
                            {tutorData.profile.rating}/5.0
                          </p>
                        </div>
                        <Star className="h-8 w-8 text-orange-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Button
                        className="h-20 flex-col gap-2"
                        variant="outline"
                        onClick={() => setActiveTab("schedule")}
                      >
                        <Video className="h-6 w-6" />
                        Start Session
                      </Button>
                      <Button
                        className="h-20 flex-col gap-2"
                        variant="outline"
                        onClick={() => setActiveTab("students")}
                      >
                        <MessageCircle className="h-6 w-6" />
                        Message Students
                      </Button>
                      <Button
                        className="h-20 flex-col gap-2"
                        variant="outline"
                        onClick={() => setActiveTab("courses")}
                      >
                        <FileText className="h-6 w-6" />
                        Create Assignment
                      </Button>
                      <Button
                        className="h-20 flex-col gap-2"
                        variant="outline"
                        onClick={() => setActiveTab("analytics")}
                      >
                        <BarChart3 className="h-6 w-6" />
                        View Analytics
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Courses Tab */}
              <TabsContent value="courses" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        My Courses
                      </CardTitle>
                      <Button size="sm" asChild>
                        <Link href="/tutor/courses/new">
                          <Plus className="h-4 w-4 mr-2" />
                          Create Course
                        </Link>
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {tutorData.courses.map((course) => (
                        <div key={course.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {course.title}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {course.students} students • ${course.price} •{" "}
                                {course.category}
                              </p>
                            </div>
                            <Badge
                              variant={
                                course.status === "active"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {course.status}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                            <div>Earnings: ${course.earnings}</div>
                            <div>Rating: {course.rating}/5.0</div>
                            <div>
                              Sessions: {course.completedSessions}/
                              {course.totalSessions}
                            </div>
                            <div>Growth: {course.enrollmentTrend}</div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                              Next session:{" "}
                              {new Date(
                                course.nextSession
                              ).toLocaleDateString()}{" "}
                              at{" "}
                              {new Date(course.nextSession).toLocaleTimeString(
                                [],
                                { hour: "2-digit", minute: "2-digit" }
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-3 w-3 mr-1" />
                                View Students
                              </Button>
                              <Button variant="outline" size="sm">
                                <Edit className="h-3 w-3 mr-1" />
                                Edit Course
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Students Tab */}
              <TabsContent value="students" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Enrolled Students
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {tutorData.students.map((student) => (
                        <div key={student.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <Users className="h-6 w-6 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">
                                  {student.name}
                                </h3>
                                <p className="text-sm text-gray-600">
                                  {student.course}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Joined: {student.joinedDate}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge variant="outline" className="mb-2">
                                <CreditCard className="h-3 w-3 mr-1" />
                                {student.paymentMethod}
                              </Badge>
                              <p className="text-sm font-medium text-green-600">
                                ${student.amountPaid}
                              </p>
                            </div>
                          </div>

                          <div className="mb-3">
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                              <span>Progress</span>
                              <span>{student.progress}%</span>
                            </div>
                            <Progress
                              value={student.progress}
                              className="h-2"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                            <div>
                              Assignments: {student.completedAssignments}/
                              {student.totalAssignments}
                            </div>
                            <div>Last Active: {student.lastActive}</div>
                          </div>

                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <a href={`mailto:${student.email}`}>
                                <Mail className="h-3 w-3 mr-1" />
                                Email
                              </a>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <a
                                href={`https://wa.me/+1234567890?text=Hi ${student.name}`}
                              >
                                <MessageCircle className="h-3 w-3 mr-1" />
                                WhatsApp
                              </a>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Earnings Tab */}
              <TabsContent value="earnings" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            This Month
                          </p>
                          <p className="text-2xl font-bold text-gray-900">
                            ${tutorData.earnings.thisMonth.toLocaleString()}
                          </p>
                        </div>
                        <DollarSign className="h-8 w-8 text-green-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            Pending
                          </p>
                          <p className="text-2xl font-bold text-gray-900">
                            ${tutorData.earnings.pending}
                          </p>
                        </div>
                        <Clock className="h-8 w-8 text-orange-600" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-600">
                            This Year
                          </p>
                          <p className="text-2xl font-bold text-gray-900">
                            ${tutorData.earnings.thisYear.toLocaleString()}
                          </p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-blue-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wallet className="h-5 w-5" />
                      Payment Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Wallet className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">PayPal</p>
                            <p className="text-sm text-gray-600">
                              Primary payment method
                            </p>
                          </div>
                        </div>
                        <p className="font-semibold text-blue-600">
                          $
                          {tutorData.earnings.paymentBreakdown.paypal.toLocaleString()}
                        </p>
                      </div>

                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <CreditCard className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium">Razorpay</p>
                            <p className="text-sm text-gray-600">
                              Indian students
                            </p>
                          </div>
                        </div>
                        <p className="font-semibold text-purple-600">
                          $
                          {tutorData.earnings.paymentBreakdown.razorpay.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </TutorOnly>
  );
}
