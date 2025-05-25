"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle,
  BookOpen,
  CreditCard,
  Settings,
  Users,
  Mail
} from "lucide-react"

const faqCategories = [
  {
    title: "General Questions",
    icon: HelpCircle,
    faqs: [
      {
        question: "What is TrainingHub?",
        answer: "TrainingHub is an online learning platform that offers comprehensive courses in WordPress, Shopify, and Web Development. Our courses are designed by industry experts to help you master these technologies and advance your career."
      },
      {
        question: "Who can take these courses?",
        answer: "Our courses are designed for learners of all levels, from complete beginners to advanced developers. Each course clearly indicates its difficulty level and prerequisites."
      },
      {
        question: "How long do I have access to the courses?",
        answer: "Once you enroll in a course, you have lifetime access to all course materials, including future updates and additional content."
      },
      {
        question: "Do I get a certificate upon completion?",
        answer: "Yes! Upon successful completion of any course, you'll receive a certificate of completion that you can add to your portfolio or LinkedIn profile."
      }
    ]
  },
  {
    title: "Course Information",
    icon: BookOpen,
    faqs: [
      {
        question: "What's included in each course?",
        answer: "Each course includes video lessons, hands-on projects, downloadable resources, code examples, and access to our community forum. You'll also get direct support from instructors."
      },
      {
        question: "Can I download the course materials?",
        answer: "Yes, most course materials including PDFs, code files, and resources are available for download so you can access them offline."
      },
      {
        question: "Are the courses updated regularly?",
        answer: "Absolutely! We regularly update our courses to reflect the latest industry trends, best practices, and technology updates."
      },
      {
        question: "What if I get stuck during a course?",
        answer: "We provide multiple support channels including instructor Q&A, community forums, and direct email support to help you when you're stuck."
      }
    ]
  },
  {
    title: "Payment & Billing",
    icon: CreditCard,
    faqs: [
      {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for course payments."
      },
      {
        question: "Is there a refund policy?",
        answer: "Yes, we offer a 30-day money-back guarantee. If you're not satisfied with a course within 30 days of purchase, we'll provide a full refund."
      },
      {
        question: "Can I pay in installments?",
        answer: "Currently, we require full payment upfront. However, we occasionally offer payment plans for our premium courses. Contact us for more information."
      },
      {
        question: "Do you offer student discounts?",
        answer: "Yes! We offer special discounts for students, educators, and non-profit organizations. Contact us with proof of eligibility for discount codes."
      }
    ]
  },
  {
    title: "Technical Support",
    icon: Settings,
    faqs: [
      {
        question: "What are the system requirements?",
        answer: "Our courses work on any modern web browser (Chrome, Firefox, Safari, Edge). For coding courses, you'll need a computer capable of running development tools."
      },
      {
        question: "Can I access courses on mobile devices?",
        answer: "Yes! Our platform is fully responsive and works great on tablets and smartphones. We also have mobile apps for iOS and Android."
      },
      {
        question: "What if I'm having video playback issues?",
        answer: "Try refreshing the page, clearing your browser cache, or switching to a different browser. If issues persist, contact our technical support team."
      },
      {
        question: "How do I reset my password?",
        answer: "Click the 'Forgot Password' link on the login page, enter your email address, and we'll send you instructions to reset your password."
      }
    ]
  }
]

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const filteredFAQs = faqCategories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Find quick answers to common questions about our courses and platform
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input 
                placeholder="Search FAQ..." 
                className="pl-10 py-3 text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* FAQ Categories */}
          <div className="space-y-8">
            {filteredFAQs.map((category, categoryIndex) => {
              const IconComponent = category.icon
              return (
                <Card key={categoryIndex} className="bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <IconComponent className="h-6 w-6 text-blue-600" />
                      </div>
                      {category.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {category.faqs.map((faq, faqIndex) => {
                      const itemId = `${categoryIndex}-${faqIndex}`
                      const isOpen = openItems.includes(itemId)
                      
                      return (
                        <Collapsible key={faqIndex}>
                          <CollapsibleTrigger
                            onClick={() => toggleItem(itemId)}
                            className="flex items-center justify-between w-full p-4 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <span className="font-medium text-gray-900 pr-4">
                              {faq.question}
                            </span>
                            {isOpen ? (
                              <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                            )}
                          </CollapsibleTrigger>
                          <CollapsibleContent className="px-4 pb-4 pt-2">
                            <p className="text-gray-600 leading-relaxed">
                              {faq.answer}
                            </p>
                          </CollapsibleContent>
                        </Collapsible>
                      )
                    })}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* No Results */}
          {searchTerm && filteredFAQs.length === 0 && (
            <Card className="bg-white text-center py-12">
              <CardContent>
                <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No results found
                </h3>
                <p className="text-gray-600 mb-6">
                  We couldn't find any FAQ matching your search. Try different keywords or contact us directly.
                </p>
                <Button asChild>
                  <a href="/contact">
                    <Mail className="h-4 w-4 mr-2" />
                    Contact Support
                  </a>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Contact Section */}
          <Card className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Still have questions?
              </h2>
              <p className="text-gray-600 mb-6">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild>
                  <a href="/contact">
                    <Mail className="h-4 w-4 mr-2" />
                    Contact Us
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/help">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Help Center
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
