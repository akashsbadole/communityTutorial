import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Mail, Calendar, FileText } from "lucide-react"

const sections = [
  {
    title: "Information We Collect",
    content: [
      "Personal Information: When you register for our courses, we collect your name, email address, and payment information.",
      "Usage Data: We automatically collect information about how you use our platform, including pages visited, time spent, and course progress.",
      "Device Information: We may collect information about your device, including IP address, browser type, and operating system.",
      "Cookies: We use cookies and similar technologies to enhance your experience and analyze platform usage."
    ]
  },
  {
    title: "How We Use Your Information",
    content: [
      "Provide and improve our educational services and platform functionality",
      "Process payments and manage your course enrollments",
      "Send you course updates, announcements, and educational content",
      "Respond to your questions, comments, and support requests",
      "Analyze platform usage to improve user experience",
      "Comply with legal obligations and protect our rights"
    ]
  },
  {
    title: "Information Sharing",
    content: [
      "We do not sell, trade, or rent your personal information to third parties.",
      "We may share information with trusted service providers who help us operate our platform (payment processors, email services, hosting providers).",
      "We may disclose information when required by law or to protect our rights and safety.",
      "In the event of a business transfer, your information may be transferred to the new owner."
    ]
  },
  {
    title: "Data Security",
    content: [
      "We implement industry-standard security measures to protect your personal information.",
      "All payment information is processed through secure, PCI-compliant payment processors.",
      "We use SSL encryption to protect data transmission between your device and our servers.",
      "Access to personal information is restricted to authorized personnel only.",
      "We regularly review and update our security practices."
    ]
  },
  {
    title: "Your Rights",
    content: [
      "Access: You can request access to the personal information we hold about you.",
      "Correction: You can request correction of inaccurate or incomplete information.",
      "Deletion: You can request deletion of your personal information, subject to legal requirements.",
      "Portability: You can request a copy of your data in a portable format.",
      "Opt-out: You can unsubscribe from marketing communications at any time."
    ]
  },
  {
    title: "Cookies and Tracking",
    content: [
      "Essential Cookies: Required for platform functionality and security.",
      "Analytics Cookies: Help us understand how users interact with our platform.",
      "Marketing Cookies: Used to deliver relevant advertisements and track campaign effectiveness.",
      "You can control cookie preferences through your browser settings.",
      "Disabling certain cookies may affect platform functionality."
    ]
  }
]

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-lg text-gray-600 mb-4">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
            </p>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Last updated: January 15, 2024
              </div>
              <div className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                Version 2.0
              </div>
            </div>
          </div>

          {/* Introduction */}
          <Card className="bg-white mb-8">
            <CardHeader>
              <CardTitle>Introduction</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p className="text-gray-600 leading-relaxed">
                TrainingHub ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy 
                explains how we collect, use, disclose, and safeguard your information when you visit our website 
                and use our educational services. Please read this privacy policy carefully. If you do not agree 
                with the terms of this privacy policy, please do not access the site.
              </p>
            </CardContent>
          </Card>

          {/* Policy Sections */}
          <div className="space-y-6">
            {sections.map((section, index) => (
              <Card key={index} className="bg-white">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">{section.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-600 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Data Retention */}
          <Card className="bg-white mt-6">
            <CardHeader>
              <CardTitle>Data Retention</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed mb-4">
                We retain your personal information for as long as necessary to provide our services and fulfill 
                the purposes outlined in this privacy policy. We will retain and use your information to the 
                extent necessary to comply with our legal obligations, resolve disputes, and enforce our policies.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• Account information: Retained while your account is active</li>
                <li>• Course progress: Retained for the lifetime of your account</li>
                <li>• Payment information: Retained as required by law and payment processors</li>
                <li>• Support communications: Retained for 3 years for quality assurance</li>
              </ul>
            </CardContent>
          </Card>

          {/* International Transfers */}
          <Card className="bg-white mt-6">
            <CardHeader>
              <CardTitle>International Data Transfers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                Your information may be transferred to and processed in countries other than your own. We ensure 
                that such transfers comply with applicable data protection laws and that appropriate safeguards 
                are in place to protect your personal information.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 mt-8">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Questions About This Policy?
              </h2>
              <p className="text-gray-600 mb-6">
                If you have any questions about this Privacy Policy or our data practices, please contact us.
              </p>
              <div className="space-y-2 text-gray-600 mb-6">
                <p>Email: privacy@traininghub.com</p>
                <p>Address: 123 Learning Street, Education City, EC 12345</p>
              </div>
              <Button asChild>
                <a href="/contact">
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Us
                </a>
              </Button>
            </CardContent>
          </Card>

          {/* Changes to Policy */}
          <Card className="bg-white mt-6">
            <CardHeader>
              <CardTitle>Changes to This Privacy Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
                the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review 
                this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when 
                they are posted on this page.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
