"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Users,
  GraduationCap,
  BookOpen,
  DollarSign,
  TrendingUp,
  MessageSquare,
  Calendar,
  Settings,
  BarChart3,
  UserCheck,
  AlertTriangle,
  Clock,
  Star,
  Phone,
  Mail,
  Eye,
  Edit,
  Trash2,
  Download,
  Filter,
  Search,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { AdminOnly } from "@/components/RoleBasedRedirect";

// Mock data for Super Admin Dashboard
const adminDashboardData = {
  stats: {
    totalStudents: 1247,
    totalTutors: 89,
    totalCourses: 156,
    totalEarnings: 89750.5,
    monthlyGrowth: 12.5,
    activeSessions: 23,
    pendingSupport: 8,
    systemHealth: 98.5,
  },
  recentStudents: [
    {
      id: "student_001",
      name: "Alice Johnson",
      email: "alice@example.com",
      phone: "+1234567890",
      enrolledCourses: 3,
      totalSpent: 1250.0,
      joinedDate: "2024-01-15",
      status: "active",
      lastActivity: "2 hours ago",
    },
    {
      id: "student_002",
      name: "Bob Smith",
      email: "bob@example.com",
      phone: "+1234567891",
      enrolledCourses: 2,
      totalSpent: 850.0,
      joinedDate: "2024-02-20",
      status: "active",
      lastActivity: "1 day ago",
    },
    {
      id: "student_003",
      name: "Carol Davis",
      email: "carol@example.com",
      phone: "+1234567892",
      enrolledCourses: 1,
      totalSpent: 450.0,
      joinedDate: "2024-03-10",
      status: "inactive",
      lastActivity: "1 week ago",
    },
  ],
  recentTutors: [
    {
      id: "tutor_001",
      name: "John Doe",
      email: "john@example.com",
      phone: "+1987654321",
      specialization: "WordPress Development",
      totalStudents: 45,
      totalEarnings: 12500.0,
      rating: 4.8,
      joinedDate: "2023-08-15",
      status: "active",
      lastActivity: "30 minutes ago",
    },
    {
      id: "tutor_002",
      name: "Jane Wilson",
      email: "jane@example.com",
      phone: "+1987654322",
      specialization: "React Development",
      totalStudents: 38,
      totalEarnings: 9800.0,
      rating: 4.9,
      joinedDate: "2023-09-20",
      status: "active",
      lastActivity: "2 hours ago",
    },
  ],
  courseStats: [
    {
      id: 1,
      title: "WordPress Development Mastery",
      category: "Web Development",
      enrollments: 156,
      revenue: 23400.0,
      rating: 4.7,
      completion: 78,
      status: "active",
    },
    {
      id: 2,
      title: "React.js Complete Course",
      category: "Frontend Development",
      enrollments: 134,
      revenue: 20100.0,
      rating: 4.8,
      completion: 82,
      status: "active",
    },
    {
      id: 3,
      title: "Python for Beginners",
      category: "Programming",
      enrollments: 98,
      revenue: 14700.0,
      rating: 4.6,
      completion: 75,
      status: "active",
    },
  ],
  earningsData: {
    thisMonth: 15750.0,
    lastMonth: 14200.0,
    growth: 10.9,
    breakdown: {
      courseEnrollments: 12500.0,
      tutorCommissions: 2800.0,
      subscriptions: 450.0,
    },
  },
  systemHealth: {
    uptime: 99.8,
    responseTime: 245,
    activeUsers: 1247,
    errorRate: 0.02,
    lastBackup: "2 hours ago",
  },
};

export default function SuperAdminDashboard() {
  const { user } = useUser();
  const [dashboardData, setDashboardData] = useState(adminDashboardData);
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is super admin
  const isSuperAdmin =
    user?.publicMetadata?.role === "admin" ||
    user?.emailAddresses?.[0]?.emailAddress === "admin@traininghub.com";

  useEffect(() => {
    if (!isSuperAdmin) {
      toast.error("Access denied. Super Admin privileges required.");
      return;
    }

    // Fetch real dashboard data
    fetchDashboardData();
  }, [isSuperAdmin]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, fetch from API
      // const response = await fetch("/api/admin/dashboard");
      // const data = await response.json();
      // setDashboardData(data);

      // For now, use mock data
      setTimeout(() => {
        setIsLoading(false);
        toast.success("Dashboard data refreshed");
      }, 1000);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
      setIsLoading(false);
    }
  };

  const sendSMSToStudents = async () => {
    try {
      const response = await fetch("/api/admin/send-sms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "upcoming_class",
          message:
            "Reminder: Your class starts in 1 hour. Join link will be sent shortly.",
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(`SMS sent to ${data.sentCount} enrolled students`);
      } else {
        toast.error(data.error || "Failed to send SMS");
      }
    } catch (error) {
      console.error("Error sending SMS:", error);
      toast.error("Failed to send SMS notifications");
    }
  };

  if (!isSuperAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Access denied. Super Admin privileges required to view this page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <AdminOnly>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Super Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Welcome back, {user?.fullName || "Admin"}
              </p>
              <Badge variant="outline" className="mt-2">
                🔒 This is dummy data for demonstration
              </Badge>
            </div>
            <div className="flex gap-3">
              <Button onClick={sendSMSToStudents} variant="outline">
                <Phone className="h-4 w-4 mr-2" />
                Send SMS to Students
              </Button>
              <Button onClick={fetchDashboardData} disabled={isLoading}>
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
                />
                Refresh Data
              </Button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Students
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardData.stats.totalStudents.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  +{dashboardData.stats.monthlyGrowth}% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Tutors
                </CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardData.stats.totalTutors}
                </div>
                <p className="text-xs text-muted-foreground">
                  Active and verified tutors
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Courses
                </CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardData.stats.totalCourses}
                </div>
                <p className="text-xs text-muted-foreground">
                  Across all categories
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Earnings
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${dashboardData.stats.totalEarnings.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Platform revenue
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="tutors">Tutors</TabsTrigger>
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="earnings">Earnings</TabsTrigger>
              <TabsTrigger value="system">System</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* System Health */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      System Health
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Uptime</span>
                      <span className="font-semibold">
                        {dashboardData.systemHealth.uptime}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Response Time</span>
                      <span className="font-semibold">
                        {dashboardData.systemHealth.responseTime}ms
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Active Users</span>
                      <span className="font-semibold">
                        {dashboardData.systemHealth.activeUsers}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Error Rate</span>
                      <span className="font-semibold">
                        {dashboardData.systemHealth.errorRate}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Backup</span>
                      <span className="font-semibold">
                        {dashboardData.systemHealth.lastBackup}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm">
                          New student enrolled in WordPress course
                        </span>
                        <span className="text-xs text-gray-500 ml-auto">
                          2 min ago
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-sm">
                          Tutor completed live session
                        </span>
                        <span className="text-xs text-gray-500 ml-auto">
                          15 min ago
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                        <span className="text-sm">Support ticket resolved</span>
                        <span className="text-xs text-gray-500 ml-auto">
                          1 hour ago
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="text-sm">
                          Payment processed successfully
                        </span>
                        <span className="text-xs text-gray-500 ml-auto">
                          2 hours ago
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Students Tab */}
            <TabsContent value="students" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Student Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.recentStudents.map((student) => (
                      <div key={student.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold">{student.name}</h3>
                            <p className="text-sm text-gray-600">
                              {student.email}
                            </p>
                            <p className="text-sm text-gray-600">
                              {student.phone}
                            </p>
                          </div>
                          <Badge
                            variant={
                              student.status === "active"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {student.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
                          <div>
                            <span className="text-gray-600">Courses:</span>
                            <span className="font-medium ml-1">
                              {student.enrolledCourses}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Spent:</span>
                            <span className="font-medium ml-1">
                              ${student.totalSpent}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Joined:</span>
                            <span className="font-medium ml-1">
                              {student.joinedDate}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Last Active:</span>
                            <span className="font-medium ml-1">
                              {student.lastActivity}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3 mr-1" />
                            View Details
                          </Button>
                          <Button size="sm" variant="outline">
                            <Mail className="h-3 w-3 mr-1" />
                            Send Message
                          </Button>
                          <Button size="sm" variant="outline">
                            <Phone className="h-3 w-3 mr-1" />
                            Send SMS
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tutors Tab */}
            <TabsContent value="tutors" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Tutor Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.recentTutors.map((tutor) => (
                      <div key={tutor.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold">{tutor.name}</h3>
                            <p className="text-sm text-gray-600">
                              {tutor.email}
                            </p>
                            <p className="text-sm text-gray-600">
                              {tutor.specialization}
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge variant="default">{tutor.status}</Badge>
                            <div className="flex items-center gap-1 mt-1">
                              <Star className="h-3 w-3 text-yellow-500" />
                              <span className="text-sm font-medium">
                                {tutor.rating}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
                          <div>
                            <span className="text-gray-600">Students:</span>
                            <span className="font-medium ml-1">
                              {tutor.totalStudents}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Earnings:</span>
                            <span className="font-medium ml-1">
                              ${tutor.totalEarnings}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Joined:</span>
                            <span className="font-medium ml-1">
                              {tutor.joinedDate}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Last Active:</span>
                            <span className="font-medium ml-1">
                              {tutor.lastActivity}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3 mr-1" />
                            View Profile
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3 mr-1" />
                            Edit Details
                          </Button>
                          <Button size="sm" variant="outline">
                            <DollarSign className="h-3 w-3 mr-1" />
                            View Earnings
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Courses Tab */}
            <TabsContent value="courses" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Course Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardData.courseStats.map((course) => (
                      <div key={course.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold">{course.title}</h3>
                            <p className="text-sm text-gray-600">
                              {course.category}
                            </p>
                          </div>
                          <Badge variant="default">{course.status}</Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-3 text-sm">
                          <div>
                            <span className="text-gray-600">Enrollments:</span>
                            <span className="font-medium ml-1">
                              {course.enrollments}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Revenue:</span>
                            <span className="font-medium ml-1">
                              ${course.revenue}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Rating:</span>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3 text-yellow-500" />
                              <span className="font-medium">
                                {course.rating}
                              </span>
                            </div>
                          </div>
                          <div>
                            <span className="text-gray-600">Completion:</span>
                            <span className="font-medium ml-1">
                              {course.completion}%
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Status:</span>
                            <span className="font-medium ml-1">
                              {course.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3 mr-1" />
                            View Course
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3 mr-1" />
                            Edit Course
                          </Button>
                          <Button size="sm" variant="outline">
                            <BarChart3 className="h-3 w-3 mr-1" />
                            Analytics
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="h-5 w-5" />
                      Monthly Earnings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>This Month</span>
                        <span className="text-2xl font-bold">
                          $
                          {dashboardData.earningsData.thisMonth.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Last Month</span>
                        <span className="text-lg">
                          $
                          {dashboardData.earningsData.lastMonth.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Growth</span>
                        <Badge
                          variant="default"
                          className="bg-green-100 text-green-800"
                        >
                          <TrendingUp className="h-3 w-3 mr-1" />+
                          {dashboardData.earningsData.growth}%
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Course Enrollments</span>
                        <span className="font-semibold">
                          $
                          {dashboardData.earningsData.breakdown.courseEnrollments.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tutor Commissions</span>
                        <span className="font-semibold">
                          $
                          {dashboardData.earningsData.breakdown.tutorCommissions.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Subscriptions</span>
                        <span className="font-semibold">
                          $
                          {dashboardData.earningsData.breakdown.subscriptions.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* System Tab */}
            <TabsContent value="system" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      System Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>SMS Notifications</span>
                        <Badge variant="default">Enabled</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Email Notifications</span>
                        <Badge variant="default">Enabled</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Auto Backups</span>
                        <Badge variant="default">Daily</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Maintenance Mode</span>
                        <Badge variant="secondary">Disabled</Badge>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t">
                      <Button className="w-full">
                        <Settings className="h-4 w-4 mr-2" />
                        Manage Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Download className="h-5 w-5" />
                      Data Export
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export Student Data
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export Tutor Data
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export Course Data
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export Financial Data
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminOnly>
  );
}
