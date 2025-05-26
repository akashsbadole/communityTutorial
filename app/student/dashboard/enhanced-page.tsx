"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Phone,
  Bell,
  Video,
  AlertCircle,
  Download,
  Upload,
  Send,
  HelpCircle,
  Zap,
  GraduationCap,
  CalendarDays,
  ClipboardList,
  HeadphonesIcon,
  FileText,
  Award,
  Target,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

// Enhanced mock data with course details, assignments, and support
const enhancedStudentData = {
  profile: {
    name: "Alice Johnson",
    email: "alice@example.com",
    enrolledCourses: 2,
    completedCourses: 1,
    totalHours: 45,
    averageProgress: 75,
  },
  enrolledCourses: [
    {
      id: "wordpress-dev",
      title: "WordPress Development",
      tutor: "John Doe",
      tutorId: "tutor_001",
      tutorEmail: "john.doe@example.com",
      tutorPhone: "+1234567890",
      tutorWhatsApp: "+1987654321",
      progress: 65,
      status: "in-progress",
      nextSession: "2024-01-22T19:00:00Z",
      totalSessions: 16,
      completedSessions: 10,
      price: "$299",
      enrolledDate: "2024-01-01",
      description:
        "Learn to build professional WordPress websites from scratch",
      syllabus: [
        { module: "WordPress Basics", completed: true, duration: "4 hours" },
        { module: "Theme Development", completed: true, duration: "6 hours" },
        { module: "Plugin Development", completed: false, duration: "8 hours" },
        {
          module: "Advanced Customization",
          completed: false,
          duration: "6 hours",
        },
      ],
      assignments: [
        {
          id: 1,
          title: "Create Custom Theme",
          description: "Build a responsive WordPress theme from scratch",
          dueDate: "2024-01-25",
          status: "pending",
          submittedDate: null,
          grade: null,
          feedback: null,
        },
        {
          id: 2,
          title: "Plugin Development Project",
          description: "Develop a custom WordPress plugin with admin interface",
          dueDate: "2024-01-30",
          status: "not-started",
          submittedDate: null,
          grade: null,
          feedback: null,
        },
      ],
      resources: [
        { name: "WordPress Codex", url: "#", type: "documentation" },
        { name: "Theme Development Guide", url: "#", type: "pdf" },
        { name: "Sample Code Repository", url: "#", type: "github" },
      ],
    },
  ],
  upcomingSessions: [
    {
      id: 1,
      course: "WordPress Development",
      tutor: "John Doe",
      date: "2024-01-22",
      time: "19:00",
      duration: "2 hours",
      type: "Live Session",
      topic: "Advanced Plugin Development",
      meetingLink: "https://zoom.us/j/123456789",
      agenda: [
        "Plugin architecture overview",
        "Database integration",
        "Admin interface creation",
        "Q&A session",
      ],
    },
  ],
  supportTickets: [
    {
      id: 1,
      subject: "Issue with WordPress installation",
      status: "open",
      priority: "medium",
      createdDate: "2024-01-20",
      lastUpdate: "2024-01-21",
      messages: [
        {
          id: 1,
          sender: "student",
          message: "I'm having trouble installing WordPress locally",
          timestamp: "2024-01-20T10:00:00Z",
        },
        {
          id: 2,
          sender: "support",
          message:
            "I'll help you with that. Can you share your system details?",
          timestamp: "2024-01-20T10:30:00Z",
        },
      ],
    },
  ],
  achievements: [
    {
      id: 1,
      title: "First Course Enrolled",
      description: "Successfully enrolled in your first course",
      earnedDate: "2024-01-01",
      icon: "🎯",
    },
    {
      id: 2,
      title: "Assignment Submitted",
      description: "Submitted your first assignment on time",
      earnedDate: "2024-01-15",
      icon: "📝",
    },
  ],
};

export default function EnhancedStudentDashboard() {
  const { user } = useUser();
  const [studentData, setStudentData] = useState(enhancedStudentData);
  const [activeTab, setActiveTab] = useState("overview");
  const [supportMessage, setSupportMessage] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);

  // Submit support ticket
  const submitSupportTicket = async () => {
    if (!supportMessage.trim()) {
      toast.error("Please enter a message");
      return;
    }

    try {
      // Here you would call your API to create a support ticket
      toast.success("Support ticket submitted successfully!");
      setSupportMessage("");
    } catch (error) {
      toast.error("Failed to submit support ticket");
    }
  };

  // Submit assignment
  const submitAssignment = async (assignmentId: number, file: File) => {
    try {
      // Here you would upload the file and update assignment status
      toast.success("Assignment submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit assignment");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.fullName || studentData.profile.name}!
            </h1>
            <p className="text-gray-600">Continue your learning journey</p>
          </div>

          {/* Enhanced Tabs Navigation */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="courses" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                My Courses
              </TabsTrigger>
              <TabsTrigger value="schedule" className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                Schedule
              </TabsTrigger>
              <TabsTrigger
                value="assignments"
                className="flex items-center gap-2"
              >
                <ClipboardList className="h-4 w-4" />
                Assignments
              </TabsTrigger>
              <TabsTrigger value="support" className="flex items-center gap-2">
                <HeadphonesIcon className="h-4 w-4" />
                Support
              </TabsTrigger>
              <TabsTrigger
                value="achievements"
                className="flex items-center gap-2"
              >
                <Award className="h-4 w-4" />
                Achievements
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
                          Enrolled Courses
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {studentData.profile.enrolledCourses}
                        </p>
                      </div>
                      <BookOpen className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Completed
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {studentData.profile.completedCourses}
                        </p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Learning Hours
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {studentData.profile.totalHours}
                        </p>
                      </div>
                      <Clock className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">
                          Avg Progress
                        </p>
                        <p className="text-2xl font-bold text-gray-900">
                          {studentData.profile.averageProgress}%
                        </p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-orange-600" />
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
                    <Button className="h-20 flex-col gap-2" variant="outline">
                      <Video className="h-6 w-6" />
                      Join Live Session
                    </Button>
                    <Button className="h-20 flex-col gap-2" variant="outline">
                      <ClipboardList className="h-6 w-6" />
                      Submit Assignment
                    </Button>
                    <Button className="h-20 flex-col gap-2" variant="outline">
                      <MessageCircle className="h-6 w-6" />
                      Message Tutor
                    </Button>
                    <Button className="h-20 flex-col gap-2" variant="outline">
                      <HelpCircle className="h-6 w-6" />
                      Get Support
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Courses Tab */}
            <TabsContent value="courses" className="space-y-6">
              {studentData.enrolledCourses.map((course) => (
                <Card key={course.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-xl">
                          {course.title}
                        </CardTitle>
                        <p className="text-gray-600">by {course.tutor}</p>
                      </div>
                      <Badge
                        variant={
                          course.status === "in-progress"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {course.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Course Progress */}
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Overall Progress</span>
                        <span>{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-3" />
                    </div>

                    {/* Course Syllabus */}
                    <div>
                      <h4 className="font-semibold mb-3">Course Modules</h4>
                      <div className="space-y-2">
                        {course.syllabus.map((module, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              {module.completed ? (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              ) : (
                                <div className="h-5 w-5 border-2 border-gray-300 rounded-full" />
                              )}
                              <div>
                                <p className="font-medium">{module.module}</p>
                                <p className="text-sm text-gray-600">
                                  {module.duration}
                                </p>
                              </div>
                            </div>
                            {module.completed ? (
                              <Badge variant="secondary">Completed</Badge>
                            ) : (
                              <Button size="sm" variant="outline">
                                <Play className="h-4 w-4 mr-1" />
                                Start
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Course Resources */}
                    <div>
                      <h4 className="font-semibold mb-3">Course Resources</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {course.resources.map((resource, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            className="justify-start"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            {resource.name}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Tutor Contact */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-3">Contact Your Tutor</h4>
                      <div className="flex flex-wrap gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <a href={`mailto:${course.tutorEmail}`}>
                            <Mail className="h-4 w-4 mr-1" />
                            Email
                          </a>
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <a href={`tel:${course.tutorPhone}`}>
                            <Phone className="h-4 w-4 mr-1" />
                            Call
                          </a>
                        </Button>
                        <Button size="sm" variant="outline" asChild>
                          <a
                            href={`https://wa.me/${course.tutorWhatsApp.replace(
                              /[^0-9]/g,
                              ""
                            )}`}
                          >
                            <MessageCircle className="h-4 w-4 mr-1" />
                            WhatsApp
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Schedule Tab */}
            <TabsContent value="schedule" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Upcoming Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {studentData.upcomingSessions.map((session) => (
                      <div key={session.id} className="border rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">
                              {session.course}
                            </h3>
                            <p className="text-gray-600">
                              with {session.tutor}
                            </p>
                            <p className="text-sm text-gray-500">
                              {session.topic}
                            </p>
                          </div>
                          <Badge variant="outline">{session.type}</Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                          <div>
                            <p className="text-gray-600">Date</p>
                            <p className="font-medium">
                              {new Date(session.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Time</p>
                            <p className="font-medium">{session.time}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Duration</p>
                            <p className="font-medium">{session.duration}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Status</p>
                            <Badge variant="secondary">Scheduled</Badge>
                          </div>
                        </div>

                        {/* Session Agenda */}
                        <div className="mb-4">
                          <h4 className="font-medium mb-2">Session Agenda</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {session.agenda.map((item, index) => (
                              <li
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="flex gap-2">
                          <Button asChild>
                            <a
                              href={session.meetingLink}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Video className="h-4 w-4 mr-1" />
                              Join Session
                            </a>
                          </Button>
                          <Button variant="outline">
                            <Calendar className="h-4 w-4 mr-1" />
                            Add to Calendar
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Assignments Tab */}
            <TabsContent value="assignments" className="space-y-6">
              {studentData.enrolledCourses.map((course) => (
                <Card key={course.id}>
                  <CardHeader>
                    <CardTitle>{course.title} - Assignments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {course.assignments.map((assignment) => (
                        <div
                          key={assignment.id}
                          className="border rounded-lg p-6"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-semibold text-lg">
                                {assignment.title}
                              </h3>
                              <p className="text-gray-600 mb-2">
                                {assignment.description}
                              </p>
                              <p className="text-sm text-gray-500">
                                Due:{" "}
                                {new Date(
                                  assignment.dueDate
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge
                              variant={
                                assignment.status === "pending"
                                  ? "default"
                                  : assignment.status === "submitted"
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {assignment.status}
                            </Badge>
                          </div>

                          {assignment.status === "submitted" &&
                            assignment.grade && (
                              <div className="bg-green-50 p-4 rounded-lg mb-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <CheckCircle className="h-5 w-5 text-green-600" />
                                  <span className="font-medium">
                                    Grade: {assignment.grade}
                                  </span>
                                </div>
                                {assignment.feedback && (
                                  <p className="text-sm text-gray-700">
                                    {assignment.feedback}
                                  </p>
                                )}
                              </div>
                            )}

                          <div className="flex gap-2">
                            {assignment.status === "not-started" ||
                            assignment.status === "pending" ? (
                              <>
                                <Button>
                                  <Upload className="h-4 w-4 mr-1" />
                                  Upload Assignment
                                </Button>
                                <Button variant="outline">
                                  <FileText className="h-4 w-4 mr-1" />
                                  View Instructions
                                </Button>
                              </>
                            ) : (
                              <Button variant="outline">
                                <Download className="h-4 w-4 mr-1" />
                                Download Submission
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            {/* Support Tab */}
            <TabsContent value="support" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Create New Ticket */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HelpCircle className="h-5 w-5" />
                      Get Support
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="support-subject">Subject</Label>
                      <Input
                        id="support-subject"
                        placeholder="Brief description of your issue"
                      />
                    </div>
                    <div>
                      <Label htmlFor="support-message">Message</Label>
                      <Textarea
                        id="support-message"
                        placeholder="Describe your issue in detail..."
                        value={supportMessage}
                        onChange={(e) => setSupportMessage(e.target.value)}
                        rows={4}
                      />
                    </div>
                    <div>
                      <Label htmlFor="support-priority">Priority</Label>
                      <select className="w-full p-2 border rounded-md">
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                    <Button onClick={submitSupportTicket} className="w-full">
                      <Send className="h-4 w-4 mr-1" />
                      Submit Support Ticket
                    </Button>
                  </CardContent>
                </Card>

                {/* Support Tickets */}
                <Card>
                  <CardHeader>
                    <CardTitle>My Support Tickets</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {studentData.supportTickets.map((ticket) => (
                        <div key={ticket.id} className="border rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-medium">{ticket.subject}</h3>
                            <Badge
                              variant={
                                ticket.status === "open"
                                  ? "default"
                                  : ticket.status === "resolved"
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {ticket.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-600 mb-3">
                            <p>
                              Created:{" "}
                              {new Date(
                                ticket.createdDate
                              ).toLocaleDateString()}
                            </p>
                            <p>
                              Last Update:{" "}
                              {new Date(ticket.lastUpdate).toLocaleDateString()}
                            </p>
                            <p>Priority: {ticket.priority}</p>
                          </div>
                          <Button size="sm" variant="outline">
                            View Conversation
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Help */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Help</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="outline" className="h-20 flex-col gap-2">
                      <Video className="h-6 w-6" />
                      Technical Issues
                    </Button>
                    <Button variant="outline" className="h-20 flex-col gap-2">
                      <BookOpen className="h-6 w-6" />
                      Course Content
                    </Button>
                    <Button variant="outline" className="h-20 flex-col gap-2">
                      <Users className="h-6 w-6" />
                      Tutor Communication
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Achievements Tab */}
            <TabsContent value="achievements" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Your Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {studentData.achievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className="border rounded-lg p-6"
                      >
                        <div className="flex items-start gap-4">
                          <div className="text-4xl">{achievement.icon}</div>
                          <div>
                            <h3 className="font-semibold text-lg">
                              {achievement.title}
                            </h3>
                            <p className="text-gray-600 mb-2">
                              {achievement.description}
                            </p>
                            <p className="text-sm text-gray-500">
                              Earned on{" "}
                              {new Date(
                                achievement.earnedDate
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Progress Milestones */}
              <Card>
                <CardHeader>
                  <CardTitle>Progress Milestones</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 border rounded-lg">
                      <Target className="h-8 w-8 text-blue-600" />
                      <div className="flex-1">
                        <h3 className="font-medium">Complete First Course</h3>
                        <p className="text-sm text-gray-600">
                          Finish all modules in one course
                        </p>
                        <Progress value={65} className="mt-2" />
                      </div>
                      <span className="text-sm text-gray-500">65%</span>
                    </div>

                    <div className="flex items-center gap-4 p-4 border rounded-lg">
                      <GraduationCap className="h-8 w-8 text-green-600" />
                      <div className="flex-1">
                        <h3 className="font-medium">Submit 5 Assignments</h3>
                        <p className="text-sm text-gray-600">
                          Complete and submit assignments
                        </p>
                        <Progress value={40} className="mt-2" />
                      </div>
                      <span className="text-sm text-gray-500">2/5</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
