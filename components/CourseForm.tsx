"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"

interface CourseFormProps {
  courseSlug: string
  courseTitle: string
}

export default function CourseForm({ courseSlug, courseTitle }: CourseFormProps) {
  const [studentName, setStudentName] = useState("")
  const [studentEmail, setStudentEmail] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Client-side validation
    if (!studentName.trim() || !studentEmail.trim()) {
      setSubmitStatus("error")
      setErrorMessage("Name and email are required.")
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentEmail)) {
      setSubmitStatus("error")
      setErrorMessage("Please enter a valid email address.")
      return
    }

    setIsSubmitting(true)
    setSubmitStatus("idle")
    setErrorMessage("")

    try {
      const response = await fetch("/api/enroll", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentName: studentName.trim(),
          studentEmail: studentEmail.trim(),
          message: message.trim(),
          courseSlug,
        }),
      })

      if (response.ok) {
        setSubmitStatus("success")
        setStudentName("")
        setStudentEmail("")
        setMessage("")
      } else {
        const errorData = await response.json()
        setSubmitStatus("error")
        setErrorMessage(errorData.error || "Submission failed. Please try again.")
      }
    } catch (error) {
      setSubmitStatus("error")
      setErrorMessage("Network error. Please check your connection and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitStatus === "success") {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <strong>Enrollment submitted successfully!</strong>
          <br />
          Thank you for enrolling in {courseTitle}. You'll receive a confirmation email shortly with next steps.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {submitStatus === "error" && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="studentName">Full Name *</Label>
        <Input
          id="studentName"
          type="text"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          placeholder="Enter your full name"
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="studentEmail">Email Address *</Label>
        <Input
          id="studentEmail"
          type="email"
          value={studentEmail}
          onChange={(e) => setStudentEmail(e.target.value)}
          placeholder="Enter your email address"
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message (Optional)</Label>
        <Textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us about your goals or any questions you have..."
          rows={4}
          disabled={isSubmitting}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          `Enroll in ${courseTitle}`
        )}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        By enrolling, you agree to our terms of service and privacy policy.
      </p>
    </form>
  )
}
