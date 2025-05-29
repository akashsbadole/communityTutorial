import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, BookOpen, Award, Globe, Target, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-6">
              About TrainingHub
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We're on a mission to democratize education by connecting passionate tutors 
              with eager learners worldwide. Our platform bridges the gap between knowledge 
              and opportunity.
            </p>
          </div>

          {/* Mission & Vision */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card>
              <CardHeader>
                <Target className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  To provide accessible, high-quality education through personalized 
                  tutoring experiences that empower learners to achieve their goals 
                  and unlock their full potential.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Heart className="h-8 w-8 text-red-600 mb-2" />
                <CardTitle>Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  A world where quality education is accessible to everyone, regardless 
                  of location or background, fostering a global community of lifelong 
                  learners and passionate educators.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Key Features */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              What Makes Us Different
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <Users className="h-8 w-8 text-green-600 mb-2" />
                  <CardTitle>Expert Tutors</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Carefully vetted tutors with proven expertise in their fields, 
                    committed to student success.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <BookOpen className="h-8 w-8 text-purple-600 mb-2" />
                  <CardTitle>Comprehensive Curriculum</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    From programming to web development, our courses cover the 
                    latest technologies and industry best practices.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Award className="h-8 w-8 text-yellow-600 mb-2" />
                  <CardTitle>Certification & Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Earn recognized certificates and get ongoing support through 
                    our placement assistance program.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-lg p-8 mb-16">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Our Impact
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">1000+</div>
                <div className="text-gray-600">Students Taught</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
                <div className="text-gray-600">Expert Tutors</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-2">20+</div>
                <div className="text-gray-600">Courses Available</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-600 mb-2">95%</div>
                <div className="text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Technologies */}
          <div className="text-center mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Technologies We Teach
            </h2>
            <div className="flex flex-wrap justify-center gap-3">
              {[
                'JavaScript', 'Python', 'React', 'Node.js', 'TypeScript',
                'Java', 'C++', 'Go', 'Rust', 'PHP', 'WordPress', 'Shopify'
              ].map((tech) => (
                <Badge key={tech} variant="secondary" className="px-3 py-1">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <Card>
            <CardHeader>
              <Globe className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Get in Touch</CardTitle>
              <CardDescription>
                Have questions? We'd love to hear from you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-gray-600">
                <p><strong>Email:</strong> info@traininghub.com</p>
                <p><strong>Phone:</strong> +1 (555) 123-4567</p>
                <p><strong>Address:</strong> 123 Learning Street, Education City, EC 12345</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
