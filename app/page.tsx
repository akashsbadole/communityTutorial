import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Code, ShoppingCart, Clock, Users } from "lucide-react";
import { getAllCourses } from "@/lib/db";
import { StickyEnrollmentForm } from "@/components/sticky-enrollment-form";

const getIconForCourse = (slug: string) => {
  switch (slug) {
    case "wordpress":
      return BookOpen;
    case "shopify":
      return ShoppingCart;
    case "webdev":
      return Code;
    default:
      return BookOpen;
  }
};

export default async function HomePage() {
  const courses = await getAllCourses();
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Development Notice */}
        {process.env.NODE_ENV === "development" && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-yellow-800">
                <strong>Development Mode:</strong> Application running with mock
                data (database connection unavailable)
              </span>
            </div>
          </div>
        )}

        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Master Your Skills with Expert Training
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of students learning WordPress, Shopify, and Web
            Development through our comprehensive online courses taught by
            industry experts.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {courses.map((course: any) => {
            const IconComponent = getIconForCourse(course.slug);
            return (
              <Card
                key={course.slug}
                className="hover:shadow-lg transition-shadow duration-300 bg-white"
              >
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <IconComponent className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl">{course.name}</CardTitle>
                  </div>
                  <CardDescription className="text-gray-600">
                    {course.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Duration:</span>
                      <span className="font-medium">{course.duration}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Level:</span>
                      <span className="font-medium">{course.level}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Price:</span>
                      <Badge
                        variant="secondary"
                        className="font-bold text-green-700"
                      >
                        {course.price}
                      </Badge>
                    </div>
                  </div>
                  <Button asChild className="w-full">
                    <Link href={`/course/${course.slug}`}>
                      View Course Details
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Start Learning?
            </h2>
            <p className="text-gray-600 mb-6">
              Choose a course above and begin your journey to becoming a skilled
              developer. All courses include hands-on projects, expert
              mentorship, and lifetime access.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
              <span>✓ Expert Instructors</span>
              <span>✓ Hands-on Projects</span>
              <span>✓ Lifetime Access</span>
              <span>✓ Certificate of Completion</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Enrollment Form */}
      <StickyEnrollmentForm courses={courses} />
    </div>
  );
}
