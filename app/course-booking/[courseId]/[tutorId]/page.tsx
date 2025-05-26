"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Star,
  Users,
  Clock,
  DollarSign,
  Globe,
  Calendar,
  MessageCircle,
  Mail,
  Phone,
  Shield,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import PaymentSelector from "@/components/payment/PaymentSelector";

// Mock data - in real app, this would come from API
const mockCourseData = {
  "wordpress-dev": {
    title: "WordPress Development",
    description:
      "Complete WordPress development from basics to advanced themes and plugins",
    languages: ["English", "Hindi", "Spanish"],
    tutors: {
      tutor_001: {
        id: "tutor_001",
        name: "John Smith",
        email: "john.smith@traininghub.com",
        phone: "+1-555-0101",
        whatsapp: "+1-555-0101",
        rating: 4.8,
        totalStudents: 150,
        completedCourses: 45,
        experience: "5+ years",
        bio: "Expert WordPress developer with extensive experience in theme and plugin development. Specialized in e-commerce solutions and performance optimization.",
        price: "$299",
        duration: "8 weeks",
        languages: ["English", "Hindi"],
        availability: [
          { day: "Monday", time: "19:00", duration: "2 hours" },
          { day: "Wednesday", time: "19:00", duration: "2 hours" },
          { day: "Friday", time: "20:00", duration: "2 hours" },
        ],
        specializations: [
          "WordPress Themes",
          "Plugin Development",
          "E-commerce",
          "Performance Optimization",
        ],
        avatar: "/api/placeholder/128/128",
      },
    },
  },
};

export default function CourseBookingPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoaded } = useUser();

  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("");
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [bookingStep, setBookingStep] = useState<
    "form" | "payment" | "success"
  >("form");

  const courseId = params.courseId as string;
  const tutorId = params.tutorId as string;

  // Function to mask contact information
  const maskContactInfo = (info: string, type: "email" | "phone") => {
    if (type === "email") {
      const [username, domain] = info.split("@");
      return `${username.substring(0, 2)}***@${domain}`;
    } else {
      return `${info.substring(0, 3)}****${info.substring(info.length - 2)}`;
    }
  };

  // Check if contact info should be visible
  const shouldShowContactInfo = isBooked && agreePrivacy;

  const courseData = mockCourseData[courseId as keyof typeof mockCourseData];
  const tutorData =
    courseData?.tutors[tutorId as keyof typeof courseData.tutors];

  if (!courseData || !tutorData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">
              Course or Tutor Not Found
            </h2>
            <Button asChild>
              <Link href="/search">Back to Search</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleBooking = async () => {
    if (!user) {
      toast.error("Please sign in to book a course");
      router.push("/sign-in");
      return;
    }

    if (
      !selectedLanguage ||
      !selectedTimeSlot ||
      !agreePrivacy ||
      !agreeTerms
    ) {
      toast.error("Please complete all required fields and agree to the terms");
      return;
    }

    // Move to payment step
    setBookingStep("payment");
  };

  const handlePaymentSuccess = async (paymentData: any) => {
    setIsBooking(true);

    try {
      // Prepare booking data with payment information
      const bookingData = {
        tutorId: tutorId,
        courseId: courseId,
        selectedLanguage,
        selectedTimeSlot,
        totalAmount: parseFloat(tutorData.price.replace("$", "")),
        privacyConsent: agreePrivacy,
        termsConsent: agreeTerms,
        notes: `Course: ${courseData.title}, Language: ${selectedLanguage}, Schedule: ${selectedTimeSlot}`,
        paymentData: {
          paymentId: paymentData.paymentId,
          method: paymentData.method,
          amount: paymentData.amount,
          currency: paymentData.currency,
          status: paymentData.status,
          transactionId: paymentData.transactionId,
        },
        userInfo: {
          email: user.emailAddresses[0]?.emailAddress,
          fullName: user.fullName,
          phone: user.phoneNumbers[0]?.phoneNumber,
          whatsapp: user.phoneNumbers[0]?.phoneNumber,
        },
      };

      // Call API to create booking
      const response = await fetch("/api/course-booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          toast.error("Please sign in to book a course");
          router.push("/sign-in");
          return;
        }
        throw new Error(result.error || "Failed to book course");
      }

      toast.success(
        "Payment successful! Course booked and demo class scheduled."
      );

      // Set booked state to show contact information
      setIsBooked(true);
      setBookingStep("success");

      // Redirect to student dashboard after a delay to show contact info
      setTimeout(() => {
        router.push("/student/dashboard");
      }, 3000);
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to book course. Please try again."
      );
    } finally {
      setIsBooking(false);
    }
  };

  const handlePaymentError = (error: string) => {
    toast.error(`Payment failed: ${error}`);
    setBookingStep("form");
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Sign In Required
            </h2>
            <p className="text-gray-600 mb-6">
              Please sign in to book a course and connect with tutors.
            </p>
            <div className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/sign-up">Create Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button variant="outline" className="mb-6" asChild>
            <Link href="/search">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Search
            </Link>
          </Button>

          {/* Course Header */}
          <Card className="bg-white mb-8">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl text-gray-900">
                    {courseData.title}
                  </CardTitle>
                  <CardDescription className="mt-2 text-lg">
                    {courseData.description}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="text-lg px-3 py-1">
                  {tutorData.price}
                </Badge>
              </div>
            </CardHeader>
          </Card>

          {/* Payment Step */}
          {bookingStep === "payment" && (
            <div className="max-w-2xl mx-auto">
              <div className="mb-6">
                <Button
                  variant="outline"
                  onClick={() => setBookingStep("form")}
                  className="mb-4"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Course Details
                </Button>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Complete Your Payment
                </h2>
                <p className="text-gray-600">
                  Secure payment for {courseData.title} with {tutorData.name}
                </p>
              </div>

              <PaymentSelector
                amount={parseFloat(tutorData.price.replace("$", ""))}
                currency="USD"
                courseTitle={courseData.title}
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentError={handlePaymentError}
              />
            </div>
          )}

          {/* Course Booking Form */}
          {bookingStep === "form" && (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* Tutor Profile */}
                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Your Tutor
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users className="h-10 w-10 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {tutorData.name}
                        </h3>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-current text-yellow-500" />
                            <span>{tutorData.rating} rating</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{tutorData.totalStudents} students</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>{tutorData.completedCourses} completed</span>
                          </div>
                        </div>
                        <p className="text-gray-600 mt-3">{tutorData.bio}</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Specializations
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {tutorData.specializations.map((spec, index) => (
                            <Badge key={index} variant="outline">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Experience
                        </h4>
                        <p className="text-gray-600">
                          {tutorData.experience} in {courseData.title}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t">
                      <h4 className="font-semibold text-gray-900 mb-3">
                        Contact Information
                      </h4>

                      {shouldShowContactInfo ? (
                        // Show actual contact information after booking and privacy consent
                        <div className="space-y-3">
                          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                            <p className="text-sm text-green-700 font-medium">
                              ✅ Contact information is now available! You can
                              reach your tutor directly.
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm">
                            <a
                              href={`mailto:${tutorData.email}`}
                              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-2 rounded-lg"
                            >
                              <Mail className="h-4 w-4" />
                              <span>{tutorData.email}</span>
                            </a>
                            <a
                              href={`tel:${tutorData.phone}`}
                              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-2 rounded-lg"
                            >
                              <Phone className="h-4 w-4" />
                              <span>{tutorData.phone}</span>
                            </a>
                            <a
                              href={`https://wa.me/${tutorData.whatsapp.replace(
                                /[^0-9]/g,
                                ""
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-green-600 hover:text-green-800 bg-green-50 px-3 py-2 rounded-lg"
                            >
                              <MessageCircle className="h-4 w-4" />
                              <span>{tutorData.whatsapp}</span>
                            </a>
                          </div>
                        </div>
                      ) : (
                        // Show masked contact information before booking
                        <div className="space-y-3">
                          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                            <p className="text-sm text-yellow-700">
                              🔒 Contact information will be available after
                              booking and agreeing to privacy policy.
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-2 text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                              <Mail className="h-4 w-4" />
                              <span>
                                {maskContactInfo(tutorData.email, "email")}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                              <Phone className="h-4 w-4" />
                              <span>
                                {maskContactInfo(tutorData.phone, "phone")}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
                              <MessageCircle className="h-4 w-4" />
                              <span>
                                {maskContactInfo(tutorData.whatsapp, "phone")}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Language Selection */}
                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      Select Language
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Select
                      value={selectedLanguage || undefined}
                      onValueChange={setSelectedLanguage}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Choose your preferred language" />
                      </SelectTrigger>
                      <SelectContent>
                        {tutorData.languages.map((language) => (
                          <SelectItem key={language} value={language}>
                            {language}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>

                {/* Time Slot Selection */}
                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Select Time Slot
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {tutorData.availability.map((slot, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={`slot-${index}`}
                            checked={
                              selectedTimeSlot === `${slot.day}-${slot.time}`
                            }
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedTimeSlot(`${slot.day}-${slot.time}`);
                              } else {
                                setSelectedTimeSlot("");
                              }
                            }}
                          />
                          <Label
                            htmlFor={`slot-${index}`}
                            className="flex-1 cursor-pointer"
                          >
                            <div className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
                              <div>
                                <span className="font-medium">{slot.day}</span>
                                <span className="text-gray-600 ml-2">
                                  {slot.time}
                                </span>
                              </div>
                              <span className="text-sm text-gray-500">
                                {slot.duration}
                              </span>
                            </div>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Course Summary */}
                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle>Course Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Course:</span>
                      <span className="font-medium">{courseData.title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tutor:</span>
                      <span className="font-medium">{tutorData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-medium">{tutorData.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-bold text-green-600 text-lg">
                        {tutorData.price}
                      </span>
                    </div>
                    {selectedLanguage && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Language:</span>
                        <span className="font-medium">{selectedLanguage}</span>
                      </div>
                    )}
                    {selectedTimeSlot && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Schedule:</span>
                        <span className="font-medium">
                          {selectedTimeSlot.replace("-", " at ")}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Privacy & Terms */}
                <Card className="bg-white">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Privacy & Terms
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="font-semibold text-yellow-800 mb-2">
                        Important Notice
                      </h4>
                      <p className="text-sm text-yellow-700">
                        You will be able to communicate directly with your
                        tutor. Please review our privacy policy and terms before
                        proceeding.
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="agreePrivacy"
                          checked={agreePrivacy}
                          onCheckedChange={setAgreePrivacy}
                        />
                        <Label
                          htmlFor="agreePrivacy"
                          className="text-sm leading-relaxed"
                        >
                          I have read and agree to the{" "}
                          <Link
                            href="/privacy"
                            className="text-blue-600 hover:underline"
                          >
                            Privacy Policy
                          </Link>{" "}
                          regarding tutor-student communication and data
                          sharing.
                        </Label>
                      </div>

                      <div className="flex items-start space-x-2">
                        <Checkbox
                          id="agreeTerms"
                          checked={agreeTerms}
                          onCheckedChange={setAgreeTerms}
                        />
                        <Label
                          htmlFor="agreeTerms"
                          className="text-sm leading-relaxed"
                        >
                          I agree to the{" "}
                          <Link
                            href="/terms"
                            className="text-blue-600 hover:underline"
                          >
                            Terms of Service
                          </Link>{" "}
                          and understand the course booking and cancellation
                          policies.
                        </Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Success Message */}
                {isBooked && (
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="pt-6">
                      <div className="text-center space-y-3">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                        <h3 className="font-semibold text-green-800">
                          Course Booked Successfully!
                        </h3>
                        <p className="text-sm text-green-700">
                          Your demo class has been scheduled. Contact
                          information is now available above.
                        </p>
                        <p className="text-xs text-green-600">
                          Redirecting to dashboard in a few seconds...
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Book Course Button */}
                {!isBooked && (
                  <Button
                    className="w-full py-3 text-lg"
                    onClick={handleBooking}
                    disabled={
                      isBooking ||
                      !selectedLanguage ||
                      !selectedTimeSlot ||
                      !agreePrivacy ||
                      !agreeTerms
                    }
                  >
                    {isBooking
                      ? "Booking Course..."
                      : "Book Course & Schedule Demo"}
                  </Button>
                )}

                <p className="text-xs text-gray-500 text-center">
                  A demo class will be scheduled after booking. Full payment is
                  required to access the complete course.
                </p>
              </div>
            </div>
          )}

          {/* Success Step */}
          {bookingStep === "success" && (
            <div className="max-w-2xl mx-auto text-center">
              <Card className="bg-green-50 border-green-200">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-green-800">
                      Payment Successful!
                    </h3>
                    <p className="text-green-700">
                      Your course has been booked and payment confirmed. Demo
                      class has been scheduled.
                    </p>
                    <p className="text-sm text-green-600">
                      Redirecting to your dashboard...
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
