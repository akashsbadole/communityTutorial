import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Search, 
  BookOpen, 
  CreditCard, 
  Users, 
  Settings, 
  HelpCircle,
  Mail,
  Phone,
  MessageCircle
} from "lucide-react"

const helpCategories = [
  {
    title: "Getting Started",
    icon: BookOpen,
    description: "Learn the basics of our platform",
    articles: [
      "How to create an account",
      "Choosing the right course",
      "Understanding course structure",
      "Setting up your learning environment"
    ]
  },
  {
    title: "Course Management",
    icon: Settings,
    description: "Manage your enrolled courses",
    articles: [
      "Accessing course materials",
      "Tracking your progress",
      "Downloading resources",
      "Completing assignments"
    ]
  },
  {
    title: "Payment & Billing",
    icon: CreditCard,
    description: "Payment and subscription help",
    articles: [
      "Payment methods accepted",
      "Refund policy",
      "Billing issues",
      "Subscription management"
    ]
  },
  {
    title: "Technical Support",
    icon: Settings,
    description: "Technical issues and troubleshooting",
    articles: [
      "Video playback issues",
      "Login problems",
      "Browser compatibility",
      "Mobile app support"
    ]
  }
]

const quickActions = [
  {
    title: "Contact Support",
    description: "Get help from our support team",
    icon: Mail,
    href: "/contact",
    color: "bg-blue-100 text-blue-600"
  },
  {
    title: "Live Chat",
    description: "Chat with us in real-time",
    icon: MessageCircle,
    href: "#",
    color: "bg-green-100 text-green-600"
  },
  {
    title: "FAQ",
    description: "Find quick answers",
    icon: HelpCircle,
    href: "/faq",
    color: "bg-purple-100 text-purple-600"
  }
]

export default function HelpCenterPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
            <p className="text-lg text-gray-600 mb-8">
              Find answers to your questions and get the help you need
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input 
                placeholder="Search for help articles..." 
                className="pl-10 py-3 text-lg"
              />
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {quickActions.map((action, index) => {
              const IconComponent = action.icon
              return (
                <Link key={index} href={action.href}>
                  <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <div className={`inline-flex p-3 rounded-full ${action.color} mb-4`}>
                        <IconComponent className="h-6 w-6" />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                      <p className="text-gray-600 text-sm">{action.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>

          {/* Help Categories */}
          <div className="grid md:grid-cols-2 gap-8">
            {helpCategories.map((category, index) => {
              const IconComponent = category.icon
              return (
                <Card key={index} className="bg-white">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <IconComponent className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{category.title}</CardTitle>
                        <CardDescription>{category.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {category.articles.map((article, articleIndex) => (
                        <li key={articleIndex}>
                          <Link 
                            href="#" 
                            className="text-gray-700 hover:text-blue-600 transition-colors flex items-center gap-2"
                          >
                            <HelpCircle className="h-4 w-4 text-gray-400" />
                            {article}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <Button variant="outline" className="w-full mt-4">
                      View All Articles
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Contact Section */}
          <Card className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Still need help?
              </h2>
              <p className="text-gray-600 mb-6">
                Our support team is here to help you succeed. Get in touch with us.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild>
                  <Link href="/contact">
                    <Mail className="h-4 w-4 mr-2" />
                    Contact Support
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/faq">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    View FAQ
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
