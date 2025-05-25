"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  BookOpen, 
  MessageCircle, 
  Calendar,
  DollarSign,
  TrendingUp,
  Plus,
  Phone,
  Mail,
  Clock,
  Star,
  Settings
} from "lucide-react"
import Link from "next/link"

// Mock data - in real app, this would come from API/database
const mockTutorData = {
  profile: {
    name: "John Smith",
    email: "john.smith@traininghub.com",
    phone: "+1-555-0101",
    whatsapp: "+1-555-0101",
    subjects: ["WordPress Development", "React Fundamentals"],
    totalStudents: 45,
    activeSubjects: 2,
    rating: 4.8,
    totalEarnings: "$12,450"
  },
  subjects: [
    {
      id: "wordpress-dev",
      title: "WordPress Development",
      students: 25,
      maxStudents: 30,
      price: "$299",
      status: "active",
      nextSession: "2024-01-22T19:00:00Z"
    },
    {
      id: "react-basics",
      title: "React Fundamentals", 
      students: 20,
      maxStudents: 25,
      price: "$249",
      status: "active",
      nextSession: "2024-01-23T18:00:00Z"
    }
  ],
  recentStudents: [
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice@example.com",
      subject: "WordPress Development",
      enrolledDate: "2024-01-15",
      status: "active"
    },
    {
      id: 2,
      name: "Bob Wilson",
      email: "bob@example.com", 
      subject: "React Fundamentals",
      enrolledDate: "2024-01-14",
      status: "active"
    },
    {
      id: 3,
      name: "Carol Davis",
      email: "carol@example.com",
      subject: "WordPress Development", 
      enrolledDate: "2024-01-13",
      status: "completed"
    }
  ],
  upcomingSessions: [
    {
      id: 1,
      subject: "WordPress Development",
      date: "2024-01-22",
      time: "19:00",
      duration: "2 hours",
      students: 25
    },
    {
      id: 2,
      subject: "React Fundamentals",
      date: "2024-01-23", 
      time: "18:00",
      duration: "2 hours",
      students: 20
    }
  ]
}

export default function TutorDashboardPage() {
  const { user } = useUser()
  const [tutorData, setTutorData] = useState(mockTutorData)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {tutorData.profile.name}!
            </h1>
            <p className="text-gray-600">Manage your subjects and connect with students</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Students</p>
                    <p className="text-2xl font-bold text-gray-900">{tutorData.profile.totalStudents}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Subjects</p>
                    <p className="text-2xl font-bold text-gray-900">{tutorData.profile.activeSubjects}</p>
                  </div>
                  <BookOpen className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Rating</p>
                    <p className="text-2xl font-bold text-gray-900">{tutorData.profile.rating}</p>
                  </div>
                  <Star className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                    <p className="text-2xl font-bold text-gray-900">{tutorData.profile.totalEarnings}</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* My Subjects */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5" />
                      My Subjects
                    </CardTitle>
                    <Button size="sm" asChild>
                      <Link href="/tutor/subjects/new">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Subject
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tutorData.subjects.map((subject) => (
                      <div key={subject.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">{subject.title}</h3>
                            <p className="text-sm text-gray-600">
                              {subject.students}/{subject.maxStudents} students • {subject.price}
                            </p>
                          </div>
                          <Badge variant={subject.status === "active" ? "default" : "secondary"}>
                            {subject.status}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-600">
                            Next session: {new Date(subject.nextSession).toLocaleDateString()} at{" "}
                            {new Date(subject.nextSession).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              View Students
                            </Button>
                            <Button variant="outline" size="sm">
                              Edit
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Students */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Recent Student Enrollments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tutorData.recentStudents.map((student) => (
                      <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{student.name}</p>
                            <p className="text-sm text-gray-600">{student.subject}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-600">
                            Enrolled: {new Date(student.enrolledDate).toLocaleDateString()}
                          </p>
                          <div className="flex gap-2 mt-1">
                            <Button variant="outline" size="sm" asChild>
                              <a href={`mailto:${student.email}`}>
                                <Mail className="h-3 w-3 mr-1" />
                                Email
                              </a>
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <a href={`https://wa.me/${tutorData.profile.whatsapp.replace(/[^0-9]/g, '')}?text=Hi ${student.name}, this is your tutor from TrainingHub`}>
                                <MessageCircle className="h-3 w-3 mr-1" />
                                WhatsApp
                              </a>
                            </Button>
                          </div>
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
                    {tutorData.upcomingSessions.map((session) => (
                      <div key={session.id} className="border rounded-lg p-3">
                        <h4 className="font-medium text-gray-900">{session.subject}</h4>
                        <div className="text-sm text-gray-600 mt-1">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {session.date} at {session.time}
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Clock className="h-3 w-3" />
                            {session.duration}
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Users className="h-3 w-3" />
                            {session.students} students
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" asChild>
                    <Link href="/tutor/subjects/new">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Subject
                    </Link>
                  </Button>
                  
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/tutor/students">
                      <Users className="h-4 w-4 mr-2" />
                      View All Students
                    </Link>
                  </Button>
                  
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/tutor/schedule">
                      <Calendar className="h-4 w-4 mr-2" />
                      Manage Schedule
                    </Link>
                  </Button>
                  
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/tutor/profile">
                      <Settings className="h-4 w-4 mr-2" />
                      Profile Settings
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Support */}
              <Card>
                <CardHeader>
                  <CardTitle>Support & Help</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full" asChild>
                    <a href={`https://wa.me/+15551234567?text=Hi, I need help with my tutor dashboard`}>
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
                      Contact Admin
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
