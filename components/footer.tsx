import Link from "next/link"
import { 
  BookOpen, 
  Code, 
  ShoppingCart, 
  Mail, 
  Phone, 
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  HelpCircle,
  Shield,
  FileText,
  Menu
} from "lucide-react"

const footerSections = [
  {
    title: "Courses",
    links: [
      { name: "WordPress Course", href: "/course/wordpress", icon: BookOpen },
      { name: "Shopify Course", href: "/course/shopify", icon: ShoppingCart },
      { name: "Web Development", href: "/course/webdev", icon: Code },
      { name: "All Courses", href: "/", icon: BookOpen },
    ]
  },
  {
    title: "Support",
    links: [
      { name: "Help Center", href: "/help", icon: HelpCircle },
      { name: "Contact Us", href: "/contact", icon: Mail },
      { name: "FAQ", href: "/faq", icon: HelpCircle },
      { name: "Site Menu", href: "/menu", icon: Menu },
    ]
  },
  {
    title: "Legal",
    links: [
      { name: "Privacy Policy", href: "/privacy", icon: Shield },
      { name: "Terms of Service", href: "/terms", icon: FileText },
    ]
  },
  {
    title: "Company",
    links: [
      { name: "About Us", href: "/about", icon: null },
      { name: "Our Mission", href: "/about#mission", icon: null },
      { name: "Instructors", href: "/about#team", icon: null },
      { name: "Careers", href: "/about#careers", icon: null },
    ]
  }
]

const socialLinks = [
  { name: "Facebook", href: "#", icon: Facebook },
  { name: "Twitter", href: "#", icon: Twitter },
  { name: "Instagram", href: "#", icon: Instagram },
  { name: "LinkedIn", href: "#", icon: Linkedin },
  { name: "YouTube", href: "#", icon: Youtube },
]

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="text-2xl font-bold text-blue-400 mb-4 block">
              TrainingHub
            </Link>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Empowering developers and entrepreneurs with comprehensive online courses in 
              WordPress, Shopify, and Web Development. Learn from industry experts and 
              build your dream career.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-300">
                <Mail className="h-4 w-4 text-blue-400" />
                <span>info@seoauditcheck.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Phone className="h-4 w-4 text-blue-400" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <MapPin className="h-4 w-4 text-blue-400" />
                <span>123 Learning Street, Education City</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections.map((section, index) => (
            <div key={index} className="lg:col-span-1">
              <h3 className="text-lg font-semibold text-white mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => {
                  const IconComponent = link.icon
                  return (
                    <li key={linkIndex}>
                      <Link 
                        href={link.href}
                        className="text-gray-300 hover:text-blue-400 transition-colors flex items-center gap-2"
                      >
                        {IconComponent && <IconComponent className="h-4 w-4" />}
                        {link.name}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Social Links & Newsletter */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <span className="text-gray-300 mr-2">Follow us:</span>
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon
                return (
                  <Link
                    key={index}
                    href={social.href}
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                    aria-label={social.name}
                  >
                    <IconComponent className="h-5 w-5" />
                  </Link>
                )
              })}
            </div>

            {/* Newsletter Signup */}
            <div className="flex items-center gap-3">
              <span className="text-gray-300">Stay updated:</span>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                />
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-400 text-sm">
              © {new Date().getFullYear()} TrainingHub. All rights reserved.
            </div>
            
            <div className="flex items-center gap-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-blue-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-blue-400 transition-colors">
                Terms of Service
              </Link>
              <Link href="/contact" className="text-gray-400 hover:text-blue-400 transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
