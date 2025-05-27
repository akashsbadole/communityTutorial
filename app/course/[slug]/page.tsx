import { notFound } from "next/navigation";
import CourseForm from "@/components/CourseForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Award, CheckCircle, BookOpen } from "lucide-react";
import { getCourseBySlug } from "@/lib/db";

interface CoursePageProps {
  params: Promise<{ slug: string }>;
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  if (!course) {
    return notFound();
  }

  // Parse the syllabus JSON
  let syllabusData;
  try {
    // Handle both string and object syllabus data
    if (typeof course.syllabus === "string") {
      syllabusData = JSON.parse(course.syllabus);
    } else if (
      typeof course.syllabus === "object" &&
      course.syllabus !== null
    ) {
      syllabusData = course.syllabus;
    } else {
      syllabusData = { modules: [] };
    }
  } catch (error) {
    console.error("Error parsing syllabus:", error);
    syllabusData = { modules: [] };
  }

  // Course metadata for display
  const courseMetadata = {
    wordpress: {
      duration: "8 weeks",
      students: "2,500+",
      level: "Beginner to Advanced",
      features: [
        "Hands-on projects with real WordPress sites",
        "Access to premium themes and plugins",
        "One-on-one mentorship sessions",
        "Lifetime access to course materials",
      ],
    },
    shopify: {
      duration: "6 weeks",
      students: "1,800+",
      level: "Intermediate",
      features: [
        "Build 3 complete Shopify stores",
        "Learn advanced Liquid techniques",
        "App development fundamentals",
        "Store optimization strategies",
      ],
    },
    webdev: {
      duration: "12 weeks",
      students: "5,200+",
      level: "Beginner to Advanced",
      features: [
        "Build 5+ real-world projects",
        "Learn modern frameworks and tools",
        "Career guidance and job placement support",
        "Code review and feedback sessions",
      ],
    },
  };

  const metadata = courseMetadata[slug as keyof typeof courseMetadata] || {
    duration: course.duration || "TBD",
    students: "New",
    level: course.level || "All Levels",
    features: [
      "Comprehensive curriculum",
      "Expert instruction",
      "Hands-on projects",
      "Certificate of completion",
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Development Notice */}
        {process.env.NODE_ENV === "development" && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-yellow-800">
                <strong>Development Mode:</strong> Using mock data (database
                connection unavailable)
              </span>
            </div>
          </div>
        )}
        {/* Course Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {course.name}
              </h1>
              <p className="text-xl text-gray-600 mb-6">{course.description}</p>

              <div className="flex flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium">
                    {metadata.duration}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium">
                    {metadata.students} students
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-600" />
                  <span className="text-sm font-medium">{metadata.level}</span>
                </div>
              </div>

              <div className="text-3xl font-bold text-blue-600 mb-4">
                {course.price}
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900">
                  What you'll get:
                </h3>
                {metadata.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Enroll Now</CardTitle>
                  <CardDescription>
                    Start your learning journey today and join thousands of
                    successful students.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CourseForm courseSlug={slug} courseTitle={course.name} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Course Syllabus */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <BookOpen className="h-6 w-6" />
              Course Syllabus
            </CardTitle>
            <CardDescription>
              Comprehensive curriculum designed to take you from beginner to
              expert
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {syllabusData.modules?.map((module: any, moduleIndex: number) => (
                <div
                  key={moduleIndex}
                  className="border rounded-lg p-6 bg-gray-50"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <Badge variant="outline" className="mt-1">
                      Module {moduleIndex + 1}
                    </Badge>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {module.title}
                      </h3>
                      <div className="space-y-2">
                        {module.subtopics?.map(
                          (subtopic: string, subtopicIndex: number) => (
                            <div
                              key={subtopicIndex}
                              className="flex items-start gap-2"
                            >
                              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                              <span className="text-sm text-gray-700">
                                {subtopic}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
