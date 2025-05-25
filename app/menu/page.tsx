import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  BookOpen, 
  Code, 
  ShoppingCart, 
  HelpCircle, 
  Mail, 
  Shield, 
  FileText,
  Home,
  Users,
  Settings
} from "lucide-react"

const menuItems = [
  {
    title: "Main Pages",
    items: [
      { name: "Home", href: "/", icon: Home, description: "Return to homepage" },
      { name: "All Courses", href: "/", icon: BookOpen, description: "Browse all available courses" },
      { name: "About Us", href: "/about", icon: Users, description: "Learn about our mission and team" },
    ]
  },
  {
    title: "Courses",
    items: [
      { name: "WordPress Course", href: "/course/wordpress", icon: BookOpen, description: "Master WordPress development" },
      { name: "Shopify Course", href: "/course/shopify", icon: ShoppingCart, description: "Build Shopify stores" },
      { name: "Web Development", href: "/course/webdev", icon: Code, description: "Full-stack web development" },
    ]
  },
  {
    title: "Support & Help",
    items: [
      { name: "Help Center", href: "/help", icon: HelpCircle, description: "Find answers to common questions" },
      { name: "Contact Us", href: "/contact", icon: Mail, description: "Get in touch with our team" },
      { name: "FAQ", href: "/faq", icon: HelpCircle, description: "Frequently asked questions" },
    ]
  },
  {
    title: "Legal & Policies",
    items: [
      { name: "Privacy Policy", href: "/privacy", icon: Shield, description: "How we protect your data" },
      { name: "Terms of Service", href: "/terms", icon: FileText, description: "Terms and conditions" },
    ]
  }
]

export default function MenuPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Site Menu</h1>
            <p className="text-lg text-gray-600">
              Navigate through all sections of our training platform
            </p>
          </div>

          <div className="grid gap-8">
            {menuItems.map((section, index) => (
              <Card key={index} className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">{section.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {section.items.map((item, itemIndex) => {
                      const IconComponent = item.icon
                      return (
                        <Link key={itemIndex} href={item.href}>
                          <div className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group">
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                                <IconComponent className="h-5 w-5 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                  {item.name}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button asChild>
              <Link href="/">
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
