import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Clock, 
  Users, 
  DollarSign, 
  Calendar,
  Star,
  MessageCircle,
  Phone,
  Mail
} from "lucide-react"
import fs from "fs"
import path from "path"
import Link from "next/link"

// Load training subjects from JSON
async function getTrainingSubjects() {
  try {
    const subjectsPath = path.join(process.cwd(), "data", "training-subjects.json")
    if (fs.existsSync(subjectsPath)) {
      const subjectsData = fs.readFileSync(subjectsPath, "utf8")
      const data = JSON.parse(subjectsData)
      return data.subjects.filter((subject: any) => subject.status === "active")
    }
  } catch (error) {
    console.error("Error reading training subjects:", error)
  }
  return []
}

function getLevelColor(level: string) {
  if (level.includes("Beginner")) return "bg-green-100 text-green-800"
  if (level.includes("Intermediate")) return "bg-yellow-100 text-yellow-800"
  if (level.includes("Advanced")) return "bg-red-100 text-red-800"
  return "bg-gray-100 text-gray-800"
}

function getCategoryColor(category: string) {
  switch (category) {
    case "Web Development":
      return "bg-blue-100 text-blue-800"
    case "E-commerce":
      return "bg-purple-100 text-purple-800"
    case "Data Science":
      return "bg-orange-100 text-orange-800"
    case "Mobile Development":
      return "bg-pink-100 text-pink-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export default async function SubjectsPage() {
  const subjects = await getTrainingSubjects()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Training Subjects</h1>
            <p className="text-lg text-gray-600 mb-8">
              Learn from expert tutors in our community-driven training platform
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {subjects.length} active subjects
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4" />
                Expert tutors
              </span>
            </div>
          </div>

          {/* Subjects Grid */}
          {subjects.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No subjects available yet
                </h3>
                <p className="text-gray-600">
                  Training subjects will appear here when tutors add them to the platform.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {subjects.map((subject: any) => (
                <Card key={subject.id} className="bg-white hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{subject.title}</CardTitle>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge className={getCategoryColor(subject.category)}>
                            {subject.category}
                          </Badge>
                          <Badge className={getLevelColor(subject.level)}>
                            {subject.level}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="text-gray-600 leading-relaxed">
                      {subject.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Course Details */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="font-semibold text-green-600">{subject.price}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span>{subject.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-purple-600" />
                        <span>{subject.currentStudents}/{subject.maxStudents} students</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-orange-600" />
                        <span>{subject.schedule.sessions.length}x/week</span>
                      </div>
                    </div>

                    {/* Tutor Info */}
                    <div className="border-t pt-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Tutor: {subject.tutorName}</h4>
                      <div className="flex flex-wrap gap-2 text-sm text-gray-600">
                        <a 
                          href={`mailto:${subject.tutorEmail}`}
                          className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                        >
                          <Mail className="h-3 w-3" />
                          Email
                        </a>
                        <a 
                          href={`tel:${subject.tutorPhone}`}
                          className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                        >
                          <Phone className="h-3 w-3" />
                          Call
                        </a>
                        <a 
                          href={`https://wa.me/${subject.tutorWhatsApp.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 hover:text-green-600 transition-colors"
                        >
                          <MessageCircle className="h-3 w-3" />
                          WhatsApp
                        </a>
                      </div>
                    </div>

                    {/* Schedule */}
                    <div className="border-t pt-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Schedule ({subject.schedule.timezone})</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        {subject.schedule.sessions.map((session: any, index: number) => (
                          <div key={index} className="flex justify-between">
                            <span>{session.day}</span>
                            <span>{session.time} ({session.duration})</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="border-t pt-4">
                      <div className="flex flex-wrap gap-1">
                        {subject.tags.map((tag: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="border-t pt-4 space-y-2">
                      <Button className="w-full" asChild>
                        <Link href={`/subjects/${subject.id}`}>
                          View Details & Enroll
                        </Link>
                      </Button>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <a href={`mailto:${subject.tutorEmail}?subject=Inquiry about ${subject.title}`}>
                            Contact Tutor
                          </a>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <a 
                            href={`https://wa.me/${subject.tutorWhatsApp.replace(/[^0-9]/g, '')}?text=Hi, I'm interested in ${subject.title}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            WhatsApp
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Call to Action for Tutors */}
          <Card className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Are you a tutor?
              </h2>
              <p className="text-gray-600 mb-6">
                Join our community and share your expertise with students worldwide. 
                Add your training subjects and start teaching today!
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild>
                  <Link href="/tutor/register">
                    Become a Tutor
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/contact">
                    Learn More
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
