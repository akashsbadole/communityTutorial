"use client"

import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { 
  User, 
  BookOpen, 
  Target,
  Clock,
  CheckCircle,
  GraduationCap,
  MessageCircle
} from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const learningGoals = [
  "Career Change",
  "Skill Enhancement", 
  "Personal Interest",
  "Academic Requirements",
  "Business Development",
  "Freelancing",
  "Startup Project"
]

const experienceLevels = [
  "Complete Beginner",
  "Some Experience",
  "Intermediate",
  "Advanced"
]

const timeCommitments = [
  "1-2 hours/week",
  "3-5 hours/week", 
  "6-10 hours/week",
  "10+ hours/week"
]

const interests = [
  "Web Development",
  "E-commerce",
  "Data Science", 
  "Mobile Development",
  "DevOps",
  "UI/UX Design",
  "Digital Marketing",
  "Cybersecurity",
  "AI/Machine Learning",
  "Blockchain"
]

export default function StudentSetupPage() {
  const { user } = useUser()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  
  const [studentProfile, setStudentProfile] = useState({
    // Personal Info
    fullName: user?.fullName || "",
    email: user?.emailAddresses[0]?.emailAddress || "",
    phone: "",
    
    // Learning Profile
    experienceLevel: "",
    learningGoals: [] as string[],
    timeCommitment: "",
    preferredSchedule: "",
    
    // Interests
    selectedInterests: [] as string[],
    specificGoals: "",
    
    // Background
    currentRole: "",
    background: "",
    
    // Preferences
    communicationPreference: "email",
    timezone: "",
    
    // Agreements
    agreeTerms: false,
    agreeContact: false,
    agreeMarketing: false
  })

  const handleInputChange = (field: string, value: any) => {
    setStudentProfile(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const toggleArrayItem = (field: string, item: string) => {
    setStudentProfile(prev => ({
      ...prev,
      [field]: prev[field as keyof typeof prev].includes(item)
        ? (prev[field as keyof typeof prev] as string[]).filter(i => i !== item)
        : [...(prev[field as keyof typeof prev] as string[]), item]
    }))
  }

  const handleSubmit = async () => {
    if (!studentProfile.agreeTerms) {
      toast.error("Please agree to the terms and conditions")
      return
    }

    setIsSubmitting(true)

    try {
      // Here you would typically:
      // 1. Update user metadata in Clerk
      // 2. Save student profile to database
      // 3. Set up personalized recommendations
      
      // For now, we'll simulate the process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success("Student profile created successfully! Welcome to TrainingHub.")
      router.push("/student/dashboard")
      
    } catch (error) {
      console.error("Setup error:", error)
      toast.error("Failed to create student profile. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome, Student!</h1>
            <p className="text-gray-600">Set up your learning profile to get personalized recommendations</p>
            
            {/* Progress Steps */}
            <div className="flex justify-center mt-6">
              <div className="flex items-center space-x-4">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step <= currentStep 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {step < currentStep ? <CheckCircle className="h-4 w-4" /> : step}
                    </div>
                    {step < 3 && (
                      <div className={`w-12 h-1 mx-2 ${
                        step < currentStep ? 'bg-green-600' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-4 text-sm text-gray-500">
              Step {currentStep} of 3: {
                currentStep === 1 ? "Personal Information" :
                currentStep === 2 ? "Learning Preferences" :
                "Review & Complete"
              }
            </div>
          </div>

          <Card className="bg-white">
            <CardContent className="p-8">
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <User className="h-6 w-6 text-green-600" />
                    <h2 className="text-xl font-semibold">Personal Information</h2>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name *</Label>
                      <Input
                        id="fullName"
                        value={studentProfile.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={studentProfile.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={studentProfile.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="+1-555-0123"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="currentRole">Current Role/Occupation</Label>
                      <Input
                        id="currentRole"
                        value={studentProfile.currentRole}
                        onChange={(e) => handleInputChange("currentRole", e.target.value)}
                        placeholder="e.g., Software Developer, Student, etc."
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="background">Background & Experience</Label>
                    <Textarea
                      id="background"
                      value={studentProfile.background}
                      onChange={(e) => handleInputChange("background", e.target.value)}
                      placeholder="Tell us about your background and what you hope to achieve..."
                      rows={4}
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="experienceLevel">Overall Experience Level *</Label>
                      <Select value={studentProfile.experienceLevel} onValueChange={(value) => handleInputChange("experienceLevel", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your level" />
                        </SelectTrigger>
                        <SelectContent>
                          {experienceLevels.map((level) => (
                            <SelectItem key={level} value={level}>{level}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="timeCommitment">Time Commitment *</Label>
                      <Select value={studentProfile.timeCommitment} onValueChange={(value) => handleInputChange("timeCommitment", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="How much time can you dedicate?" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeCommitments.map((time) => (
                            <SelectItem key={time} value={time}>{time}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Learning Preferences */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Target className="h-6 w-6 text-green-600" />
                    <h2 className="text-xl font-semibold">Learning Preferences</h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <Label>Learning Goals (select all that apply)</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {learningGoals.map((goal) => (
                          <div key={goal} className="flex items-center space-x-2">
                            <Checkbox
                              id={goal}
                              checked={studentProfile.learningGoals.includes(goal)}
                              onCheckedChange={() => toggleArrayItem("learningGoals", goal)}
                            />
                            <Label htmlFor={goal} className="text-sm">{goal}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Label>Areas of Interest (select all that apply)</Label>
                      <div className="flex flex-wrap gap-2">
                        {interests.map((interest) => (
                          <Badge
                            key={interest}
                            variant={studentProfile.selectedInterests.includes(interest) ? "default" : "outline"}
                            className="cursor-pointer"
                            onClick={() => toggleArrayItem("selectedInterests", interest)}
                          >
                            {interest}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="specificGoals">Specific Learning Goals</Label>
                      <Textarea
                        id="specificGoals"
                        value={studentProfile.specificGoals}
                        onChange={(e) => handleInputChange("specificGoals", e.target.value)}
                        placeholder="What specific skills or knowledge do you want to gain?"
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="preferredSchedule">Preferred Schedule</Label>
                      <Input
                        id="preferredSchedule"
                        value={studentProfile.preferredSchedule}
                        onChange={(e) => handleInputChange("preferredSchedule", e.target.value)}
                        placeholder="e.g., Weekday evenings, Weekend mornings"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Review & Complete */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <h2 className="text-xl font-semibold">Review & Complete</h2>
                  </div>
                  
                  <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                    <h3 className="font-semibold">Profile Summary</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div><strong>Name:</strong> {studentProfile.fullName}</div>
                      <div><strong>Email:</strong> {studentProfile.email}</div>
                      <div><strong>Experience:</strong> {studentProfile.experienceLevel}</div>
                      <div><strong>Time Commitment:</strong> {studentProfile.timeCommitment}</div>
                      <div><strong>Goals:</strong> {studentProfile.learningGoals.join(", ")}</div>
                      <div><strong>Interests:</strong> {studentProfile.selectedInterests.join(", ")}</div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="agreeTerms"
                        checked={studentProfile.agreeTerms}
                        onCheckedChange={(checked) => handleInputChange("agreeTerms", checked)}
                      />
                      <Label htmlFor="agreeTerms" className="text-sm">
                        I agree to the Terms of Service and Privacy Policy *
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="agreeContact"
                        checked={studentProfile.agreeContact}
                        onCheckedChange={(checked) => handleInputChange("agreeContact", checked)}
                      />
                      <Label htmlFor="agreeContact" className="text-sm">
                        I agree to be contacted by tutors and TrainingHub staff
                      </Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="agreeMarketing"
                        checked={studentProfile.agreeMarketing}
                        onCheckedChange={(checked) => handleInputChange("agreeMarketing", checked)}
                      />
                      <Label htmlFor="agreeMarketing" className="text-sm">
                        I would like to receive course recommendations and updates
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
                
                {currentStep < 3 ? (
                  <Button onClick={nextStep}>
                    Next
                  </Button>
                ) : (
                  <Button 
                    onClick={handleSubmit}
                    disabled={isSubmitting || !studentProfile.agreeTerms}
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
  )
}
