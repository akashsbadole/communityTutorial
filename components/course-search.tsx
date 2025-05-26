"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Clock,
  DollarSign,
  Users,
  Star,
  Globe,
  BookOpen,
} from "lucide-react";
import Link from "next/link";

// Mock course data - in real app, this would come from API
const mockCourses = [
  {
    id: "wordpress-dev",
    title: "WordPress Development",
    category: "Web Development",
    description:
      "Complete WordPress development from basics to advanced themes and plugins",
    languages: ["English", "Hindi", "Spanish"],
    tutors: [
      {
        id: "tutor_001",
        name: "John Smith",
        rating: 4.8,
        students: 150,
        price: "$299",
        duration: "8 weeks",
        avatar: "/api/placeholder/64/64",
      },
      {
        id: "tutor_002",
        name: "Priya Sharma",
        rating: 4.9,
        students: 120,
        price: "$279",
        duration: "8 weeks",
        avatar: "/api/placeholder/64/64",
      },
    ],
  },
  {
    id: "react-dev",
    title: "React Development",
    category: "Web Development",
    description:
      "Master React.js with hooks, context, and modern development practices",
    languages: ["English", "Hindi", "French"],
    tutors: [
      {
        id: "tutor_003",
        name: "Mike Chen",
        rating: 4.7,
        students: 200,
        price: "$399",
        duration: "12 weeks",
        avatar: "/api/placeholder/64/64",
      },
    ],
  },
  {
    id: "shopify-dev",
    title: "Shopify Development",
    category: "E-commerce",
    description:
      "Build and customize professional Shopify stores with Liquid templates",
    languages: ["English", "German"],
    tutors: [
      {
        id: "tutor_004",
        name: "Sarah Johnson",
        rating: 4.6,
        students: 85,
        price: "$249",
        duration: "6 weeks",
        avatar: "/api/placeholder/64/64",
      },
    ],
  },
];

interface CourseSearchProps {
  onCourseSelect?: (course: any) => void;
}

export function CourseSearch({ onCourseSelect }: CourseSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredCourses, setFilteredCourses] = useState(mockCourses);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const filtered = mockCourses.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        !selectedCategory ||
        selectedCategory === "all" ||
        course.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    setFilteredCourses(filtered);
  }, [searchTerm, selectedCategory]);

  const categories = [...new Set(mockCourses.map((course) => course.category))];

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Search Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Find Your Perfect Course
        </h2>
        <p className="text-gray-600">
          Search from our wide range of courses and connect with expert tutors
        </p>
      </div>

      {/* Search Controls */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search for courses (e.g., WordPress, React, Shopify...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-3 text-lg"
            />
          </div>
          <Select
            value={selectedCategory || undefined}
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Search Results */}
      <div className="space-y-6">
        {filteredCourses.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No courses found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search terms or category filter
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredCourses.map((course) => (
            <Card
              key={course.id}
              className="bg-white hover:shadow-lg transition-shadow duration-300"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl text-gray-900">
                      {course.title}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {course.description}
                    </CardDescription>
                    <div className="flex items-center gap-2 mt-3">
                      <Badge variant="outline">{course.category}</Badge>
                      <div className="flex items-center gap-1">
                        <Globe className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {course.languages.join(", ")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900">
                    Available Tutors ({course.tutors.length})
                  </h4>
                  <div className="grid gap-4">
                    {course.tutors.map((tutor) => (
                      <div
                        key={tutor.id}
                        className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <Users className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                              <h5 className="font-semibold text-gray-900">
                                {tutor.name}
                              </h5>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 fill-current text-yellow-500" />
                                  <span>{tutor.rating}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  <span>{tutor.students} students</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-600">
                              {tutor.price}
                            </div>
                            <div className="text-sm text-gray-600">
                              {tutor.duration}
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 flex justify-end">
                          <Button asChild>
                            <Link
                              href={`/course-booking/${course.id}/${tutor.id}`}
                            >
                              Select This Tutor
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Call to Action */}
      {filteredCourses.length > 0 && (
        <div className="text-center mt-12">
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Ready to Start Learning?
              </h3>
              <p className="text-gray-600 mb-6">
                Choose a tutor above to view their profile, select your
                preferred language, and schedule your first demo class.
              </p>
              <div className="flex justify-center gap-4">
                <Button variant="outline" asChild>
                  <Link href="/help">Need Help Choosing?</Link>
                </Button>
                <Button asChild>
                  <Link href="/contact">Contact Support</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
