"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  User,
  Phone,
  Mail,
  MessageCircle,
  BookOpen,
  Clock,
  DollarSign,
  Users,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const categories = [
  "Web Development",
  "E-commerce",
  "Data Science",
  "Mobile Development",
  "DevOps",
  "UI/UX Design",
  "Digital Marketing",
  "Cybersecurity",
];

const levels = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Beginner to Intermediate",
  "Intermediate to Advanced",
  "Beginner to Advanced",
];

const timezones = [
  "EST",
  "PST",
  "CST",
  "MST",
  "GMT",
  "CET",
  "IST",
  "JST",
  "AEST",
];

export default function TutorSetupPage() {
  const { user } = useUser();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [tutorProfile, setTutorProfile] = useState({
    // Personal Info
    fullName: user?.fullName || "",
    email: user?.emailAddresses[0]?.emailAddress || "",
    phone: "",
    whatsapp: "",
    bio: "",
    experience: "",

    // Subject Info
    subjectTitle: "",
    subjectDescription: "",
    category: "",
    level: "",
    price: "",
    duration: "",
    maxStudents: "20",

    // Schedule
    timezone: "",
    sessions: [{ day: "", time: "", duration: "2 hours" }],

    // Additional
    tags: "",
    syllabus: "",
    requirements: "",

    // Agreements
    agreeTerms: false,
    agreeContact: false,
  });

  const handleInputChange = (field: string, value: any) => {
    setTutorProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addSession = () => {
    setTutorProfile((prev) => ({
      ...prev,
      sessions: [...prev.sessions, { day: "", time: "", duration: "2 hours" }],
    }));
  };

  const updateSession = (index: number, field: string, value: string) => {
    setTutorProfile((prev) => ({
      ...prev,
      sessions: prev.sessions.map((session, i) =>
        i === index ? { ...session, [field]: value } : session
      ),
    }));
  };

  const removeSession = (index: number) => {
    if (tutorProfile.sessions.length > 1) {
      setTutorProfile((prev) => ({
        ...prev,
        sessions: prev.sessions.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSubmit = async () => {
    if (!tutorProfile.agreeTerms || !tutorProfile.agreeContact) {
      toast.error("Please agree to the terms and conditions");
      return;
    }

    setIsSubmitting(true);

    try {
      // Here you would typically:
      // 1. Update user metadata in Clerk
      // 2. Save tutor profile to database
      // 3. Generate JSON file for the subject

      // For now, we'll simulate the process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Update user role in Clerk (this would be done via API)
      // await user?.update({ publicMetadata: { role: "tutor" } })

      toast.success(
        "Tutor profile created successfully! Welcome to TrainingHub."
      );
      router.push("/tutor/dashboard");
    } catch (error) {
      console.error("Setup error:", error);
      toast.error("Failed to create tutor profile. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Become a Tutor
            </h1>
            <p className="text-gray-600">
              Set up your tutor profile and start teaching
            </p>

            {/* Progress Steps */}
            <div className="flex justify-center mt-6">
              <div className="flex items-center space-x-4">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                        step <= currentStep
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {step < currentStep ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        step
                      )}
                    </div>
                    {step < 4 && (
                      <div
                        className={`w-12 h-1 mx-2 ${
                          step < currentStep ? "bg-blue-600" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 text-sm text-gray-500">
              Step {currentStep} of 4:{" "}
              {currentStep === 1
                ? "Personal Information"
                : currentStep === 2
                ? "Subject Details"
                : currentStep === 3
                ? "Schedule & Pricing"
                : "Review & Submit"}
            </div>
          </div>

          <Card className="bg-white">
            <CardContent className="p-8">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <User className="h-6 w-6 text-blue-600" />
                    <h2 className="text-xl font-semibold">
                      Personal Information
                    </h2>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={tutorProfile.fullName}
                        onChange={(e) =>
                          handleInputChange("fullName", e.target.value)
                        }
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={tutorProfile.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        placeholder="Enter your email"
                        disabled
                        className="bg-gray-100 cursor-not-allowed"
                        required
                      />
                      <p className="text-xs text-gray-500">
                        Email is automatically set from your account and cannot
                        be changed here.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        value={tutorProfile.phone}
                        onChange={(e) =>
                          handleInputChange("phone", e.target.value)
                        }
                        placeholder="+1-555-0123"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="whatsapp">WhatsApp Number *</Label>
                      <Input
                        id="whatsapp"
                        value={tutorProfile.whatsapp}
                        onChange={(e) =>
                          handleInputChange("whatsapp", e.target.value)
                        }
                        placeholder="+1-555-0123"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Professional Bio *</Label>
                    <Textarea
                      id="bio"
                      value={tutorProfile.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      placeholder="Tell students about your background and expertise..."
                      rows={4}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">Teaching Experience</Label>
                    <Textarea
                      id="experience"
                      value={tutorProfile.experience}
                      onChange={(e) =>
                        handleInputChange("experience", e.target.value)
                      }
                      placeholder="Describe your teaching experience and qualifications..."
                      rows={3}
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Subject Details */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                    <h2 className="text-xl font-semibold">Subject Details</h2>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="subjectTitle">Subject Title *</Label>
                      <Input
                        id="subjectTitle"
                        value={tutorProfile.subjectTitle}
                        onChange={(e) =>
                          handleInputChange("subjectTitle", e.target.value)
                        }
                        placeholder="e.g., Advanced React Development"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subjectDescription">
                        Subject Description *
                      </Label>
                      <Textarea
                        id="subjectDescription"
                        value={tutorProfile.subjectDescription}
                        onChange={(e) =>
                          handleInputChange(
                            "subjectDescription",
                            e.target.value
                          )
                        }
                        placeholder="Describe what students will learn in this subject..."
                        rows={4}
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="category">Category *</Label>
                        <Select
                          value={tutorProfile.category || undefined}
                          onValueChange={(value) =>
                            handleInputChange("category", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat} value={cat}>
                                {cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="level">Level *</Label>
                        <Select
                          value={tutorProfile.level}
                          onValueChange={(value) =>
                            handleInputChange("level", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            {levels.map((level) => (
                              <SelectItem key={level} value={level}>
                                {level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Schedule & Pricing */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Clock className="h-6 w-6 text-blue-600" />
                    <h2 className="text-xl font-semibold">
                      Schedule & Pricing
                    </h2>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price *</Label>
                      <Input
                        id="price"
                        value={tutorProfile.price}
                        onChange={(e) =>
                          handleInputChange("price", e.target.value)
                        }
                        placeholder="$299"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration *</Label>
                      <Input
                        id="duration"
                        value={tutorProfile.duration}
                        onChange={(e) =>
                          handleInputChange("duration", e.target.value)
                        }
                        placeholder="8 weeks"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="maxStudents">Max Students</Label>
                      <Input
                        id="maxStudents"
                        type="number"
                        value={tutorProfile.maxStudents}
                        onChange={(e) =>
                          handleInputChange("maxStudents", e.target.value)
                        }
                        placeholder="20"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone *</Label>
                    <Select
                      value={tutorProfile.timezone}
                      onValueChange={(value) =>
                        handleInputChange("timezone", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        {timezones.map((tz) => (
                          <SelectItem key={tz} value={tz}>
                            {tz}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Step 4: Review & Submit */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <CheckCircle className="h-6 w-6 text-blue-600" />
                    <h2 className="text-xl font-semibold">Review & Submit</h2>
                  </div>

                  <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                    <h3 className="font-semibold">Profile Summary</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <strong>Name:</strong> {tutorProfile.fullName}
                      </div>
                      <div>
                        <strong>Email:</strong> {tutorProfile.email}
                      </div>
                      <div>
                        <strong>Subject:</strong> {tutorProfile.subjectTitle}
                      </div>
                      <div>
                        <strong>Category:</strong> {tutorProfile.category}
                      </div>
                      <div>
                        <strong>Price:</strong> {tutorProfile.price}
                      </div>
                      <div>
                        <strong>Duration:</strong> {tutorProfile.duration}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="agreeTerms"
                        checked={tutorProfile.agreeTerms}
                        onCheckedChange={(checked) =>
                          handleInputChange("agreeTerms", checked)
                        }
                      />
                      <Label htmlFor="agreeTerms" className="text-sm">
                        I agree to the Terms of Service and Privacy Policy
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="agreeContact"
                        checked={tutorProfile.agreeContact}
                        onCheckedChange={(checked) =>
                          handleInputChange("agreeContact", checked)
                        }
                      />
                      <Label htmlFor="agreeContact" className="text-sm">
                        I agree to be contacted by students and TrainingHub
                        staff
                      </Label>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t">
                <Button
                  variant="outline"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  Previous
                </Button>

                {currentStep < 4 ? (
                  <Button onClick={nextStep}>Next</Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={
                      isSubmitting ||
                      !tutorProfile.agreeTerms ||
                      !tutorProfile.agreeContact
                    }
                  >
                    {isSubmitting ? "Creating Profile..." : "Complete Setup"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
