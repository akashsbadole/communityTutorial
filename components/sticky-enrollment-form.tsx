"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, GraduationCap, ChevronUp, ChevronDown } from "lucide-react";
import { toast } from "sonner";

interface Course {
  id: number;
  name: string;
  slug: string;
  price: string;
  duration: string;
  level: string;
}

interface StickyEnrollmentFormProps {
  courses: Course[];
}

export function StickyEnrollmentForm({ courses }: StickyEnrollmentFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    studentName: "",
    studentEmail: "",
    courseSlug: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.studentName ||
      !formData.studentEmail ||
      !formData.courseSlug
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/enroll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(
          "Enrollment submitted successfully! Check your email for confirmation."
        );
        setFormData({
          studentName: "",
          studentEmail: "",
          courseSlug: "",
          message: "",
        });
        setIsOpen(false);
      } else {
        toast.error(result.error || "Failed to submit enrollment");
      }
    } catch (error) {
      toast.error("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCourse = courses.find(
    (course) => course.slug === formData.courseSlug
  );

  return (
    <div className="fixed right-[-30px] top-1/2 transform -translate-y-1/2 z-50">
      <Card
        className={`w-80 transition-all duration-300 shadow-lg ${
          isOpen ? "translate-x-0" : "translate-x-72"
        }`}
      >
        {/* Toggle Button */}
        <div
          className={`absolute left-0 top-1/2 transform -translate-y-1/2 ${
            isOpen ? "-translate-x-12" : "-translate-x-12"
          } cursor-pointer`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="bg-blue-600 text-white p-3 rounded-l-lg shadow-lg hover:bg-blue-700 transition-colors">
            <div className="flex flex-col items-center gap-1">
              <GraduationCap className="h-5 w-5" />
              {isOpen ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronUp className="h-4 w-4" />
              )}
            </div>
          </div>
        </div>

        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Quick Enrollment</CardTitle>
              <CardDescription>Join a course today!</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sticky-course">Select Course *</Label>
              <Select
                value={formData.courseSlug}
                onValueChange={(value) =>
                  setFormData({ ...formData, courseSlug: value })
                }
              >
                <SelectTrigger id="sticky-course">
                  <SelectValue placeholder="Choose a course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.slug} value={course.slug}>
                      <div className="flex flex-col">
                        <span className="font-medium">{course.name}</span>
                        <span className="text-sm text-gray-500">
                          {course.price} • {course.duration}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedCourse && (
                <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                  <strong>{selectedCourse.name}</strong>
                  <br />
                  Price: {selectedCourse.price} | Duration:{" "}
                  {selectedCourse.duration}
                  <br />
                  Level: {selectedCourse.level}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sticky-name">Full Name *</Label>
              <Input
                id="sticky-name"
                type="text"
                placeholder="Enter your full name"
                value={formData.studentName}
                onChange={(e) =>
                  setFormData({ ...formData, studentName: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sticky-email">Email Address *</Label>
              <Input
                id="sticky-email"
                type="email"
                placeholder="Enter your email"
                value={formData.studentEmail}
                onChange={(e) =>
                  setFormData({ ...formData, studentEmail: e.target.value })
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sticky-message">Message (Optional)</Label>
              <Textarea
                id="sticky-message"
                placeholder="Any questions or special requirements?"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                rows={3}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Enroll Now"}
            </Button>

            <p className="text-xs text-gray-500 text-center">
              You'll receive a confirmation email with next steps
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
