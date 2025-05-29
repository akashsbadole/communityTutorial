import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  Users, 
  DollarSign, 
  Calendar,
  Star,
  MessageCircle,
  Phone,
  Mail,
  ArrowLeft,
  BookOpen,
  Award
} from "lucide-react";
import Link from "next/link";

// Mock data for subjects - in production, this would come from a database
const subjects = {
  'wordpress-dev': {
    id: 'wordpress-dev',
    title: 'WordPress Development Mastery',
    description: 'Complete WordPress development course covering themes, plugins, and custom solutions.',
    category: 'Web Development',
    level: 'Intermediate to Advanced',
    price: '$299/month',
    duration: '12 weeks',
    currentStudents: 45,
    maxStudents: 60,
    tutorName: 'Sarah Johnson',
    tutorEmail: 'sarah@traininghub.com',
    tutorPhone: '+1-555-0123',
    tutorWhatsApp: '+1-555-0123',
    tutorBio: 'Senior WordPress developer with 8+ years of experience building custom themes and plugins for enterprise clients.',
    schedule: {
      timezone: 'EST',
      sessions: [
        { day: 'Monday', time: '7:00 PM', duration: '2 hours' },
        { day: 'Wednesday', time: '7:00 PM', duration: '2 hours' },
        { day: 'Saturday', time: '10:00 AM', duration: '3 hours' }
      ]
    },
    curriculum: [
      'WordPress Fundamentals',
      'Theme Development',
      'Plugin Development',
      'Custom Post Types',
      'Advanced Custom Fields',
      'WooCommerce Integration',
      'Performance Optimization',
      'Security Best Practices'
    ],
    prerequisites: [
      'Basic HTML/CSS knowledge',
      'PHP fundamentals',
      'Understanding of web development concepts'
    ],
    tags: ['WordPress', 'PHP', 'Web Development', 'CMS', 'E-commerce'],
    rating: 4.8,
    reviews: 127
  }
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function SubjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const subject = subjects[slug as keyof typeof subjects];

  if (!subject) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/subjects">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Subjects
            </Link>
          </Button>

          {/* Header */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="bg-blue-100 text-blue-800">
                  {subject.category}
                </Badge>
                <Badge className="bg-yellow-100 text-yellow-800">
                  {subject.level}
                </Badge>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{subject.rating}</span>
                  <span className="text-sm text-gray-500">({subject.reviews} reviews)</span>
                </div>
              </div>
              <CardTitle className="text-3xl mb-4">{subject.title}</CardTitle>
              <CardDescription className="text-lg">
                {subject.description}
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Course Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Course Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-6">
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
                      <span>{subject.schedule.sessions.length}x per week</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Curriculum */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Curriculum
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {subject.curriculum.map((item, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm">
                          {index + 1}
                        </div>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Prerequisites */}
              <Card>
                <CardHeader>
                  <CardTitle>Prerequisites</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {subject.prerequisites.map((prereq, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span>{prereq}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Enrollment Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Enroll Now</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full" size="lg">
                    Enroll in Course
                  </Button>
                  <p className="text-sm text-gray-600 text-center">
                    30-day money-back guarantee
                  </p>
                </CardContent>
              </Card>

              {/* Schedule */}
              <Card>
                <CardHeader>
                  <CardTitle>Schedule ({subject.schedule.timezone})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {subject.schedule.sessions.map((session, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">{session.day}</span>
                        <div className="text-right">
                          <div className="text-sm">{session.time}</div>
                          <div className="text-xs text-gray-500">{session.duration}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Tutor Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Tutor</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-lg">{subject.tutorName}</h4>
                    <p className="text-gray-600 text-sm mt-1">{subject.tutorBio}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <a href={`mailto:${subject.tutorEmail}?subject=Inquiry about ${subject.title}`}>
                        <Mail className="h-4 w-4 mr-2" />
                        Email Tutor
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <a href={`tel:${subject.tutorPhone}`}>
                        <Phone className="h-4 w-4 mr-2" />
                        Call Tutor
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <a 
                        href={`https://wa.me/${subject.tutorWhatsApp.replace(/[^0-9]/g, '')}?text=Hi, I'm interested in ${subject.title}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        WhatsApp
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
