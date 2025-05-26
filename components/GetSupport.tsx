"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  HelpCircle,
  MessageCircle,
  Mail,
  Phone,
  Send,
  Loader2,
  CheckCircle,
  Clock,
  AlertTriangle,
  Zap,
  CreditCard,
  BookOpen,
  Settings,
} from "lucide-react";
import { toast } from "sonner";

interface GetSupportProps {
  onTicketCreated?: (ticketData: any) => void;
}

export default function GetSupport({ onTicketCreated }: GetSupportProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showSupportDialog, setShowSupportDialog] = useState(false);
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState("normal");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");

  const supportCategories = [
    {
      value: "technical",
      label: "Technical Issues",
      icon: <Settings className="h-4 w-4" />,
      description: "Login problems, video playback, platform bugs",
    },
    {
      value: "billing",
      label: "Billing & Payments",
      icon: <CreditCard className="h-4 w-4" />,
      description: "Payment issues, refunds, subscription questions",
    },
    {
      value: "course",
      label: "Course Content",
      icon: <BookOpen className="h-4 w-4" />,
      description: "Course materials, assignments, progress tracking",
    },
    {
      value: "general",
      label: "General Support",
      icon: <HelpCircle className="h-4 w-4" />,
      description: "Other questions and general assistance",
    },
  ];

  const priorityLevels = [
    {
      value: "low",
      label: "Low",
      icon: <Clock className="h-4 w-4" />,
      description: "General questions, non-urgent issues",
      responseTime: "Within 48 hours",
      color: "text-gray-600",
    },
    {
      value: "normal",
      label: "Normal",
      icon: <MessageCircle className="h-4 w-4" />,
      description: "Standard support requests",
      responseTime: "Within 24 hours",
      color: "text-blue-600",
    },
    {
      value: "high",
      label: "High",
      icon: <AlertTriangle className="h-4 w-4" />,
      description: "Important issues affecting your learning",
      responseTime: "Within 4 hours",
      color: "text-orange-600",
    },
    {
      value: "urgent",
      label: "Urgent",
      icon: <Zap className="h-4 w-4" />,
      description: "Critical issues requiring immediate attention",
      responseTime: "Within 1 hour",
      color: "text-red-600",
    },
  ];

  const handleCreateTicket = async () => {
    if (!category || !subject.trim() || !description.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      const ticketData = {
        category,
        priority,
        subject: subject.trim(),
        description: description.trim(),
      };

      const response = await fetch("/api/support/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ticketData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Support ticket created! Ticket #${data.ticket.ticketNumber}`);
        setShowSupportDialog(false);
        
        // Reset form
        setCategory("");
        setPriority("normal");
        setSubject("");
        setDescription("");
        
        if (onTicketCreated) {
          onTicketCreated(data.ticket);
        }
      } else {
        toast.error(data.error || "Failed to create support ticket");
      }
    } catch (error) {
      console.error("Error creating support ticket:", error);
      toast.error("Failed to create support ticket. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedCategory = supportCategories.find(cat => cat.value === category);
  const selectedPriority = priorityLevels.find(pri => pri.value === priority);

  return (
    <Dialog open={showSupportDialog} onOpenChange={setShowSupportDialog}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <HelpCircle className="h-4 w-4 mr-2" />
          Get Support
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Create Support Ticket
          </DialogTitle>
          <DialogDescription>
            Describe your issue and we'll help you resolve it quickly
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Help Options */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Need Quick Help?</h4>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="justify-start" asChild>
                <a href="https://wa.me/+15551234567?text=Hi, I need help with TrainingHub" target="_blank">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp Support
                </a>
              </Button>
              <Button variant="outline" size="sm" className="justify-start" asChild>
                <a href="mailto:support@traininghub.com">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Support
                </a>
              </Button>
            </div>
          </div>

          {/* Category Selection */}
          <div>
            <Label className="text-base font-medium">What do you need help with?</Label>
            <div className="grid grid-cols-1 gap-3 mt-3">
              {supportCategories.map((cat) => (
                <div
                  key={cat.value}
                  className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                    category === cat.value
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setCategory(cat.value)}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{cat.icon}</div>
                    <div>
                      <p className="font-medium">{cat.label}</p>
                      <p className="text-sm text-gray-600">{cat.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Priority Selection */}
          <div>
            <Label className="text-base font-medium">Priority Level</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select priority level" />
              </SelectTrigger>
              <SelectContent>
                {priorityLevels.map((pri) => (
                  <SelectItem key={pri.value} value={pri.value}>
                    <div className="flex items-center gap-2">
                      <span className={pri.color}>{pri.icon}</span>
                      <div>
                        <p className="font-medium">{pri.label}</p>
                        <p className="text-xs text-gray-600">{pri.responseTime}</p>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedPriority && (
              <p className="text-sm text-gray-600 mt-1">
                {selectedPriority.description} • {selectedPriority.responseTime}
              </p>
            )}
          </div>

          {/* Subject */}
          <div>
            <Label htmlFor="subject">Subject *</Label>
            <Input
              id="subject"
              placeholder="Brief description of your issue..."
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mt-2"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Detailed Description *</Label>
            <Textarea
              id="description"
              placeholder="Please provide as much detail as possible about your issue. Include any error messages, steps you've tried, and when the problem started..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2 min-h-[120px]"
            />
            <p className="text-xs text-gray-500 mt-1">
              The more details you provide, the faster we can help resolve your issue
            </p>
          </div>

          {/* Response Time Info */}
          {selectedCategory && selectedPriority && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Expected Response Time:</strong> {selectedPriority.responseTime}
                <br />
                <strong>Category:</strong> {selectedCategory.label}
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setShowSupportDialog(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateTicket}
            disabled={isLoading || !category || !subject.trim() || !description.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating Ticket...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Create Ticket
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
