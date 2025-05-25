"use client"

import { useUser } from "@clerk/nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  BookOpen, 
  MessageCircle, 
  Calendar,
  Settings,
  Plus,
  TrendingUp,
  Clock,
  Star
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && user) {
      // Check user role and redirect accordingly
      const userRole = user.publicMetadata?.role as string
      
      if (userRole === "tutor") {
        router.push("/tutor/dashboard")
      } else if (userRole === "student") {
        router.push("/student/dashboard")
      }
      // If no role is set, show role selection
    }
  }, [isLoaded, user, router])

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">Please sign in to continue</h2>
            <Button asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Role selection page
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Welcome Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome, {user.firstName || user.emailAddresses[0].emailAddress}!
            </h1>
            <p className="text-lg text-gray-600">
              Choose your role to get started with TrainingHub
            </p>
          </div>

          {/* Role Selection Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Tutor Card */}
            <Card className="bg-white hover:shadow-lg transition-shadow duration-300 border-2 hover:border-blue-200">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-4 bg-blue-100 rounded-full w-fit">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl text-gray-900">I'm a Tutor</CardTitle>
                <CardDescription className="text-gray-600">
                  Share your expertise and teach students worldwide
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <BookOpen className="h-4 w-4 text-blue-600" />
                    <span>Create and manage training subjects</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span>View registered students</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <MessageCircle className="h-4 w-4 text-blue-600" />
                    <span>WhatsApp support system</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                    <span>Track student progress</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <Button className="w-full" asChild>
                    <Link href="/tutor/setup">
                      Continue as Tutor
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Student Card */}
            <Card className="bg-white hover:shadow-lg transition-shadow duration-300 border-2 hover:border-green-200">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-4 bg-green-100 rounded-full w-fit">
                  <BookOpen className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl text-gray-900">I'm a Student</CardTitle>
                <CardDescription className="text-gray-600">
                  Learn new skills from expert tutors
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Calendar className="h-4 w-4 text-green-600" />
                    <span>View upcoming sessions</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <BookOpen className="h-4 w-4 text-green-600" />
                    <span>Access subscribed courses</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <MessageCircle className="h-4 w-4 text-green-600" />
                    <span>WhatsApp support system</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <Star className="h-4 w-4 text-green-600" />
                    <span>Track learning progress</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <Button className="w-full" variant="outline" asChild>
                    <Link href="/student/setup">
                      Continue as Student
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Info */}
          <Card className="bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Not sure which role to choose?
              </h3>
              <p className="text-gray-600 mb-6">
                You can always switch between roles later. Start with the one that best describes 
                your primary goal on our platform.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button variant="outline" asChild>
                  <Link href="/subjects">
                    Browse Subjects
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/contact">
                    Contact Support
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <Card className="text-center p-4">
              <CardContent className="p-0">
                <div className="text-2xl font-bold text-blue-600">50+</div>
                <div className="text-sm text-gray-600">Active Tutors</div>
              </CardContent>
            </Card>
            <Card className="text-center p-4">
              <CardContent className="p-0">
                <div className="text-2xl font-bold text-green-600">200+</div>
                <div className="text-sm text-gray-600">Students</div>
              </CardContent>
            </Card>
            <Card className="text-center p-4">
              <CardContent className="p-0">
                <div className="text-2xl font-bold text-purple-600">30+</div>
                <div className="text-sm text-gray-600">Subjects</div>
              </CardContent>
            </Card>
            <Card className="text-center p-4">
              <CardContent className="p-0">
                <div className="text-2xl font-bold text-orange-600">95%</div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
