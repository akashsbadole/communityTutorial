"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  BookOpen, 
  Calendar, 
  Clock,
  MessageCircle,
  Star,
  Play,
  CheckCircle,
  TrendingUp,
  Users,
  Mail,
  Phone
} from "lucide-react"
import Link from "next/link"

// Mock data - in real app, this would come from API/database
const mockStudentData = {
  profile: {
    name: "Alice Johnson",
    email: "alice@example.com",
    enrolledCourses: 2,
    completedCourses: 1,
    totalHours: 45,
    averageProgress: 75
  },
  enrolledCourses: [
    {
      id: "wordpress-dev",
      title: "WordPress Development",
      tutor: "John Smith",
      tutorEmail: "john.smith@traininghub.com",
      tutorWhatsApp: "+1-555-0101",
      progress: 65,
      status: "in-progress",
      nextSession: "2024-01-22T19:00:00Z",
      totalSessions: 16,
      completedSessions: 10,
      price: "$299",
      enrolledDate: "2024-01-01"
    },
    {
      id: "react-basics",
      title: "React Fundamentals",
      tutor: "Sarah Wilson", 
      tutorEmail: "sarah@traininghub.com",
      tutorWhatsApp: "+1-555-0102",
      progress: 85,
      status: "in-progress",
      nextSession: "2024-01-23T18:00:00Z",
      totalSessions: 12,
      completedSessions: 10,
      price: "$249",
      enrolledDate: "2024-01-05"
    }
  ],
  upcomingSessions: [
    {
      id: 1,
      course: "WordPress Development",
      tutor: "John Smith",
      date: "2024-01-22",
      time: "19:00",
      duration: "2 hours",
      type: "Live Session",
      meetingLink: "https://zoom.us/j/123456789"
    },
    {
      id: 2,
      course: "React Fundamentals", 
      tutor: "Sarah Wilson",
      date: "2024-01-23",
      time: "18:00", 
      duration: "2 hours",
      type: "Live Session",
      meetingLink: "https://zoom.us/j/987654321"
    },
    {
      id: 3,
      course: "WordPress Development",
      tutor: "John Smith",
      date: "2024-01-24",
      time: "19:00",
      duration: "2 hours", 
      type: "Q&A Session",
      meetingLink: "https://zoom.us/j/123456789"
    }
  ],
  recentActivity: [
    {
      id: 1,
      type: "session_completed",
      course: "React Fundamentals",
      description: "Completed: State Management with Hooks",
      date: "2024-01-20"
    },
    {
      id: 2,
      type: "assignment_submitted", 
      course: "WordPress Development",
      description: "Submitted: Custom Theme Project",
      date: "2024-01-19"
    },
    {
      id: 3,
      type: "session_completed",
      course: "WordPress Development", 
      description: "Completed: Plugin Development Basics",
      date: "2024-01-18"
    }
  ],
  recommendations: [
    {
      id: "advanced-react",
      title: "Advanced React Patterns",
      tutor: "Mike Chen",
      price: "$399",
      rating: 4.9,
      students: 156
    },
    {
      id: "vue-basics",
      title: "Vue.js Fundamentals", 
      tutor: "Emma Davis",
      price: "$199",
      rating: 4.7,
      students: 89
    }
  ]
}

export default function StudentDashboardPage() {
  const { user } = useUser()
  const [studentData, setStudentData] = useState(mockStudentData)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {studentData.profile.name}!
            </h1>
            <p className="text-gray-600">Continue your learning journey</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Enrolled Courses</p>
                    <p className="text-2xl font-bold text-gray-900">{studentData.profile.enrolledCourses}</p>
                  </div>
                  <BookOpen className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-2xl font-bold text-gray-900">{studentData.profile.completedCourses}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Learning Hours</p>
                    <p className="text-2xl font-bold text-gray-900">{studentData.profile.totalHours}</p>
                  </div>
                  <Clock className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Progress</p>
                    <p className="text-2xl font-bold text-gray-900">{studentData.profile.averageProgress}%</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* My Courses */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      My Courses
                    </CardTitle>
                    <Button size="sm" asChild>
                      <Link href="/subjects">
                        Browse More Courses
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {studentData.enrolledCourses.map((course) => (
                      <div key={course.id} className="border rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-gray-900 text-lg">{course.title}</h3>
                            <p className="text-gray-600">by {course.tutor}</p>
                          </div>
                          <Badge variant={course.status === "in-progress" ? "default" : "secondary"}>
                            {course.status}
                          </Badge>
                        </div>
                        
                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>Progress</span>
                            <span>{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                          <div>Sessions: {course.completedSessions}/{course.totalSessions}</div>
                          <div>Next: {new Date(course.nextSession).toLocaleDateString()}</div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" asChild>
                              <a href={`mailto:${course.tutorEmail}?subject=Question about ${course.title}`}>
                                <Mail className="h-3 w-3 mr-1" />
                                Email Tutor
                              </a>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <a href={`https://wa.me/${course.tutorWhatsApp.replace(/[^0-9]/g, '')}?text=Hi, I'm your student in ${course.title}`}>
                                <MessageCircle className="h-3 w-3 mr-1" />
                                WhatsApp
                              </a>
                            </Button>
                          </div>
                          <Button size="sm">
                            <Play className="h-3 w-3 mr-1" />
                            Continue Learning
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {studentData.recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3 p-3 border rounded-lg">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{activity.description}</p>
                          <p className="text-sm text-gray-600">{activity.course}</p>
                          <p className="text-xs text-gray-500">{new Date(activity.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Upcoming Sessions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Upcoming Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {studentData.upcomingSessions.slice(0, 3).map((session) => (
                      <div key={session.id} className="border rounded-lg p-3">
                        <h4 className="font-medium text-gray-900">{session.course}</h4>
                        <p className="text-sm text-gray-600">with {session.tutor}</p>
                        <div className="text-sm text-gray-600 mt-2">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {session.date} at {session.time}
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Clock className="h-3 w-3" />
                            {session.duration} • {session.type}
                          </div>
                        </div>
                        <Button size="sm" className="w-full mt-3" asChild>
                          <a href={session.meetingLink} target="_blank" rel="noopener noreferrer">
                            Join Session
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recommended Courses */}
              <Card>
                <CardHeader>
                  <CardTitle>Recommended for You</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {studentData.recommendations.map((course) => (
                      <div key={course.id} className="border rounded-lg p-3">
                        <h4 className="font-medium text-gray-900">{course.title}</h4>
                        <p className="text-sm text-gray-600">by {course.tutor}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="text-sm">
                            <span className="font-medium text-green-600">{course.price}</span>
                            <div className="flex items-center gap-1 text-gray-600">
                              <Star className="h-3 w-3 fill-current text-yellow-500" />
                              {course.rating} • {course.students} students
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full mt-2" asChild>
                          <Link href={`/subjects/${course.id}`}>
                            View Details
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Support */}
              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full" asChild>
                    <a href="https://wa.me/+15551234567?text=Hi, I need help with my courses">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      WhatsApp Support
                    </a>
                  </Button>
                  
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/help">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Help Center
                    </Link>
                  </Button>
                  
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/contact">
                      <Mail className="h-4 w-4 mr-2" />
                      Contact Support
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
