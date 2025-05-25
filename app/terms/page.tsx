import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Mail, Calendar, Scale } from "lucide-react"

const sections = [
  {
    title: "Acceptance of Terms",
    content: [
      "By accessing and using TrainingHub, you accept and agree to be bound by the terms and provision of this agreement.",
      "If you do not agree to abide by the above, please do not use this service.",
      "These terms apply to all visitors, users, and others who access or use the service.",
      "We reserve the right to update these terms at any time without prior notice."
    ]
  },
  {
    title: "Use License",
    content: [
      "Permission is granted to temporarily access the materials on TrainingHub for personal, non-commercial transitory viewing only.",
      "This is the grant of a license, not a transfer of title, and under this license you may not:",
      "• Modify or copy the materials",
      "• Use the materials for any commercial purpose or for any public display",
      "• Attempt to reverse engineer any software contained on the website",
      "• Remove any copyright or other proprietary notations from the materials"
    ]
  },
  {
    title: "Course Access and Enrollment",
    content: [
      "Course access is granted upon successful payment and enrollment confirmation.",
      "You are responsible for maintaining the confidentiality of your account credentials.",
      "Course materials are for your personal use only and may not be shared or redistributed.",
      "We reserve the right to suspend or terminate access for violation of these terms.",
      "Lifetime access means access for the life of the platform, subject to these terms."
    ]
  },
  {
    title: "Payment and Refunds",
    content: [
      "All course fees must be paid in full before access is granted.",
      "We offer a 30-day money-back guarantee from the date of purchase.",
      "Refund requests must be submitted through our official support channels.",
      "Processing fees and transaction costs may be deducted from refunds.",
      "Refunds are processed within 5-10 business days after approval."
    ]
  },
  {
    title: "Intellectual Property",
    content: [
      "All course content, including videos, text, images, and code, is protected by copyright.",
      "You may not reproduce, distribute, or create derivative works from our content.",
      "Student projects and assignments remain the intellectual property of the student.",
      "We respect the intellectual property rights of others and expect users to do the same.",
      "Any violation of intellectual property rights may result in account termination."
    ]
  },
  {
    title: "User Conduct",
    content: [
      "You agree to use the platform in a manner consistent with all applicable laws and regulations.",
      "Prohibited activities include but are not limited to:",
      "• Harassment or abuse of other users or instructors",
      "• Posting spam, offensive, or inappropriate content",
      "• Attempting to hack, disrupt, or damage the platform",
      "• Creating multiple accounts to circumvent restrictions",
      "• Sharing account credentials with others"
    ]
  },
  {
    title: "Disclaimers",
    content: [
      "The materials on TrainingHub are provided on an 'as is' basis.",
      "We make no warranties, expressed or implied, and hereby disclaim all other warranties.",
      "We do not warrant that the service will be uninterrupted, timely, secure, or error-free.",
      "We do not guarantee specific outcomes or career advancement from course completion.",
      "Your use of the service is at your sole risk."
    ]
  }
]

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Scale className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
            <p className="text-lg text-gray-600 mb-4">
              Please read these terms carefully before using our platform and services.
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
                Welcome to TrainingHub. These Terms of Service ("Terms") govern your use of our website and 
                educational services. By accessing or using our platform, you agree to be bound by these Terms. 
                If you disagree with any part of these terms, then you may not access the service.
              </p>
            </CardContent>
          </Card>

          {/* Terms Sections */}
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

          {/* Limitation of Liability */}
          <Card className="bg-white mt-6">
            <CardHeader>
              <CardTitle>Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed mb-4">
                In no event shall TrainingHub or its suppliers be liable for any damages (including, without 
                limitation, damages for loss of data or profit, or due to business interruption) arising out 
                of the use or inability to use the materials on TrainingHub's website, even if TrainingHub or 
                a TrainingHub authorized representative has been notified orally or in writing of the possibility 
                of such damage.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Because some jurisdictions do not allow limitations on implied warranties, or limitations of 
                liability for consequential or incidental damages, these limitations may not apply to you.
              </p>
            </CardContent>
          </Card>

          {/* Governing Law */}
          <Card className="bg-white mt-6">
            <CardHeader>
              <CardTitle>Governing Law</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                These terms and conditions are governed by and construed in accordance with the laws of the 
                jurisdiction in which TrainingHub operates, and you irrevocably submit to the exclusive 
                jurisdiction of the courts in that state or location.
              </p>
            </CardContent>
          </Card>

          {/* Termination */}
          <Card className="bg-white mt-6">
            <CardHeader>
              <CardTitle>Termination</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-gray-600">
                <p>We may terminate or suspend your account and access to the service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>
                <p>Upon termination, your right to use the service will cease immediately. If you wish to terminate your account, you may simply discontinue using the service.</p>
                <p>All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of liability.</p>
              </div>
            </CardContent>
          </Card>

          {/* Changes to Terms */}
          <Card className="bg-white mt-6">
            <CardHeader>
              <CardTitle>Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
                If a revision is material, we will try to provide at least 30 days notice prior to any new 
                terms taking effect. What constitutes a material change will be determined at our sole discretion. 
                By continuing to access or use our service after those revisions become effective, you agree to 
                be bound by the revised terms.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 mt-8">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Questions About These Terms?
              </h2>
              <p className="text-gray-600 mb-6">
                If you have any questions about these Terms of Service, please contact us.
              </p>
              <div className="space-y-2 text-gray-600 mb-6">
                <p>Email: legal@traininghub.com</p>
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

          {/* Acknowledgment */}
          <Card className="bg-white mt-6">
            <CardHeader>
              <CardTitle>Acknowledgment</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 leading-relaxed">
                By using our service, you acknowledge that you have read these Terms of Service and agree to 
                be bound by them. These Terms constitute the entire agreement between you and TrainingHub 
                regarding the use of the service.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
