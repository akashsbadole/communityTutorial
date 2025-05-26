"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FileText,
  Upload,
  Link as LinkIcon,
  Type,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
  Star,
} from "lucide-react";
import { toast } from "sonner";

interface Assignment {
  id: string;
  title: string;
  description: string;
  instructions: string;
  dueDate: string;
  maxPoints: number;
  submissionType: string;
  allowedFileTypes?: string[];
  maxFileSize?: number;
  course: {
    id: number;
    title: string;
  };
  tutor: {
    id: string;
    name: string;
  };
  submission?: {
    id: string;
    status: string;
    submittedAt: string;
    fileName?: string;
    fileSize?: number;
    grade?: number;
    feedback?: string;
    gradedAt?: string;
  };
}

interface AssignmentSubmissionProps {
  assignment: Assignment;
  onSubmissionSuccess?: (submissionData: any) => void;
}

export default function AssignmentSubmission({ assignment, onSubmissionSuccess }: AssignmentSubmissionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showSubmissionDialog, setShowSubmissionDialog] = useState(false);
  const [submissionType, setSubmissionType] = useState(assignment.submissionType || "file");
  const [submissionText, setSubmissionText] = useState("");
  const [submissionUrl, setSubmissionUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (assignment.allowedFileTypes && assignment.allowedFileTypes.length > 0) {
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
        if (!assignment.allowedFileTypes.includes(fileExtension)) {
          toast.error(`File type not allowed. Allowed types: ${assignment.allowedFileTypes.join(', ')}`);
          return;
        }
      }

      // Validate file size
      if (assignment.maxFileSize && file.size > assignment.maxFileSize) {
        const maxSizeMB = (assignment.maxFileSize / (1024 * 1024)).toFixed(1);
        toast.error(`File too large. Maximum size: ${maxSizeMB}MB`);
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleSubmission = async () => {
    setIsLoading(true);

    try {
      // Validate submission based on type
      if (submissionType === "text" && !submissionText.trim()) {
        toast.error("Please enter your submission text");
        setIsLoading(false);
        return;
      }

      if (submissionType === "url" && !submissionUrl.trim()) {
        toast.error("Please enter a valid URL");
        setIsLoading(false);
        return;
      }

      if (submissionType === "file" && !selectedFile) {
        toast.error("Please select a file to upload");
        setIsLoading(false);
        return;
      }

      // Prepare submission data
      const submissionData = {
        assignmentId: assignment.id,
        submissionType,
        submissionText: submissionType === "text" ? submissionText : null,
        submissionUrl: submissionType === "url" ? submissionUrl : null,
        fileName: submissionType === "file" ? selectedFile?.name : null,
        fileSize: submissionType === "file" ? selectedFile?.size : null,
        fileType: submissionType === "file" ? selectedFile?.type : null,
      };

      const response = await fetch("/api/assignments/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Assignment submitted successfully!");
        setShowSubmissionDialog(false);
        
        // Reset form
        setSubmissionText("");
        setSubmissionUrl("");
        setSelectedFile(null);
        
        if (onSubmissionSuccess) {
          onSubmissionSuccess(data.submission);
        }
      } else {
        toast.error(data.error || "Failed to submit assignment");
      }
    } catch (error) {
      console.error("Error submitting assignment:", error);
      toast.error("Failed to submit assignment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "graded":
        return "bg-green-100 text-green-800 border-green-200";
      case "returned":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const isOverdue = new Date() > new Date(assignment.dueDate);
  const daysUntilDue = Math.ceil((new Date(assignment.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{assignment.title}</CardTitle>
            <p className="text-sm text-gray-600 mt-1">{assignment.course.title}</p>
          </div>
          <div className="text-right">
            <Badge variant="outline" className="mb-2">
              {assignment.maxPoints} points
            </Badge>
            {assignment.submission && (
              <Badge className={getStatusColor(assignment.submission.status)}>
                {assignment.submission.status}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-gray-700">{assignment.description}</p>

        {/* Due Date Info */}
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-gray-500" />
            <span>
              {isOverdue ? (
                <span className="text-red-600 font-medium">Overdue</span>
              ) : daysUntilDue === 0 ? (
                <span className="text-orange-600 font-medium">Due today</span>
              ) : daysUntilDue === 1 ? (
                <span className="text-orange-600 font-medium">Due tomorrow</span>
              ) : (
                <span>{daysUntilDue} days remaining</span>
              )}
            </span>
          </div>
        </div>

        {/* Submission Status */}
        {assignment.submission ? (
          <div className="bg-gray-50 p-4 rounded-lg space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Your Submission</h4>
              <Badge className={getStatusColor(assignment.submission.status)}>
                <CheckCircle className="h-3 w-3 mr-1" />
                {assignment.submission.status}
              </Badge>
            </div>
            
            <div className="text-sm text-gray-600">
              <p>Submitted: {new Date(assignment.submission.submittedAt).toLocaleString()}</p>
              {assignment.submission.fileName && (
                <p>File: {assignment.submission.fileName}</p>
              )}
            </div>

            {assignment.submission.grade !== null && assignment.submission.grade !== undefined && (
              <div className="border-t pt-3">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="font-medium">
                    Grade: {assignment.submission.grade}/{assignment.maxPoints}
                  </span>
                </div>
                {assignment.submission.feedback && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Feedback:</p>
                    <p className="text-sm text-gray-600">{assignment.submission.feedback}</p>
                  </div>
                )}
                {assignment.submission.gradedAt && (
                  <p className="text-xs text-gray-500 mt-2">
                    Graded: {new Date(assignment.submission.gradedAt).toLocaleString()}
                  </p>
                )}
              </div>
            )}
          </div>
        ) : (
          <Alert className={isOverdue ? "border-red-200 bg-red-50" : ""}>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {isOverdue ? (
                <span className="text-red-700">
                  This assignment is overdue. Please submit as soon as possible.
                </span>
              ) : (
                <span>
                  Assignment not submitted yet. Click "Submit Assignment" to get started.
                </span>
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Submit Button */}
        {!assignment.submission && (
          <Dialog open={showSubmissionDialog} onOpenChange={setShowSubmissionDialog}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                Submit Assignment
              </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Submit Assignment</DialogTitle>
                <DialogDescription>
                  {assignment.title} - {assignment.course.title}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Instructions */}
                <div>
                  <h4 className="font-medium mb-2">Instructions</h4>
                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                    {assignment.instructions}
                  </p>
                </div>

                {/* Submission Type */}
                <div>
                  <Label className="text-base font-medium">Submission Type</Label>
                  <RadioGroup value={submissionType} onValueChange={setSubmissionType} className="mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="file" id="file" />
                      <Label htmlFor="file" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        File Upload
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="text" id="text" />
                      <Label htmlFor="text" className="flex items-center gap-2">
                        <Type className="h-4 w-4" />
                        Text Submission
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="url" id="url" />
                      <Label htmlFor="url" className="flex items-center gap-2">
                        <LinkIcon className="h-4 w-4" />
                        URL/Link
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Submission Content */}
                {submissionType === "file" && (
                  <div>
                    <Label htmlFor="file-upload">Upload File</Label>
                    <Input
                      id="file-upload"
                      type="file"
                      onChange={handleFileSelect}
                      className="mt-2"
                      accept={assignment.allowedFileTypes?.join(',')}
                    />
                    {assignment.allowedFileTypes && (
                      <p className="text-xs text-gray-500 mt-1">
                        Allowed types: {assignment.allowedFileTypes.join(', ')}
                      </p>
                    )}
                    {assignment.maxFileSize && (
                      <p className="text-xs text-gray-500">
                        Max size: {(assignment.maxFileSize / (1024 * 1024)).toFixed(1)}MB
                      </p>
                    )}
                    {selectedFile && (
                      <p className="text-sm text-green-600 mt-2">
                        Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)}KB)
                      </p>
                    )}
                  </div>
                )}

                {submissionType === "text" && (
                  <div>
                    <Label htmlFor="submission-text">Your Submission</Label>
                    <Textarea
                      id="submission-text"
                      placeholder="Enter your assignment submission here..."
                      value={submissionText}
                      onChange={(e) => setSubmissionText(e.target.value)}
                      className="mt-2 min-h-[200px]"
                    />
                  </div>
                )}

                {submissionType === "url" && (
                  <div>
                    <Label htmlFor="submission-url">Submission URL</Label>
                    <Input
                      id="submission-url"
                      type="url"
                      placeholder="https://..."
                      value={submissionUrl}
                      onChange={(e) => setSubmissionUrl(e.target.value)}
                      className="mt-2"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter the URL to your project, repository, or online submission
                    </p>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowSubmissionDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmission}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Submit Assignment
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
}
