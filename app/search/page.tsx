import { CourseSearch } from "@/components/course-search"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Search, 
  BookOpen, 
  Users, 
  Star,
  Clock,
  Globe
} from "lucide-react"
import Link from "next/link"

const features = [
  {
    icon: Search,
    title: "Smart Search",
    description: "Find courses by name, category, or skill level"
  },
  {
    icon: Users,
    title: "Expert Tutors",
    description: "Learn from verified industry professionals"
  },
  {
    icon: Globe,
    title: "Multiple Languages",
    description: "Courses available in English, Hindi, Spanish, and more"
  },
  {
    icon: Clock,
    title: "Flexible Timing",
    description: "Choose time slots that fit your schedule"
  },
  {
    icon: Star,
    title: "Rated Tutors",
    description: "All tutors are rated by previous students"
  },
  {
    icon: BookOpen,
    title: "Demo Classes",
    description: "Try before you commit with free demo sessions"
  }
]

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Discover Your Next Skill
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Search through our comprehensive course catalog, connect with expert tutors, 
            and start your learning journey today. Choose your language, schedule, and begin with a demo class.
          </p>
          
          {/* Quick Stats */}
          <div className="flex justify-center gap-8 text-sm text-gray-600 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">50+</div>
              <div>Expert Tutors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">25+</div>
              <div>Courses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">10+</div>
              <div>Languages</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">500+</div>
              <div>Happy Students</div>
            </div>
          </div>
        </div>

        {/* Course Search Component */}
        <div className="mb-16">
          <CourseSearch />
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Our Platform?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon
              return (
                <Card key={index} className="bg-white hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* How It Works Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Search Courses</h3>
              <p className="text-gray-600">Browse our course catalog and find the perfect match for your learning goals</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose Tutor</h3>
              <p className="text-gray-600">Select from verified tutors, view their profiles, ratings, and specializations</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Book & Schedule</h3>
              <p className="text-gray-600">Select your language, preferred time slot, and schedule a demo class</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                4
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Learning</h3>
              <p className="text-gray-600">Attend your demo class and begin your learning journey with expert guidance</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of students who have transformed their careers with our expert-led courses. 
              Start with a free demo class today!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50" asChild>
                <Link href="#search">
                  <Search className="h-5 w-5 mr-2" />
                  Search Courses
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600" asChild>
                <Link href="/contact">
                  Get Help Choosing
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
