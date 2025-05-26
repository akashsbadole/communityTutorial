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
  MessageCircle,
  Mail,
  Phone,
  Send,
  Loader2,
  CheckCircle,
  Clock,
  User,
} from "lucide-react";
import { toast } from "sonner";

interface MessageTutorProps {
  tutorId: string;
  tutorName: string;
  tutorEmail?: string;
  tutorPhone?: string;
  tutorWhatsApp?: string;
  courseId?: number;
  courseName?: string;
  onMessageSent?: (messageData: any) => void;
}

export default function MessageTutor({
  tutorId,
  tutorName,
  tutorEmail,
  tutorPhone,
  tutorWhatsApp,
  courseId,
  courseName,
  onMessageSent,
}: MessageTutorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [messageType, setMessageType] = useState("platform");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    if (messageType === "email" && !subject.trim()) {
      toast.error("Please enter a subject for email messages");
      return;
    }

    setIsLoading(true);

    try {
      const messageData = {
        tutorId,
        subject: subject || `Message from Student - ${courseName || "General"}`,
        message: message.trim(),
        messageType,
        courseId,
      };

      const response = await fetch("/api/messages/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageData),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Message sent successfully!");
        setShowMessageDialog(false);
        
        // Reset form
        setSubject("");
        setMessage("");
        setMessageType("platform");
        
        if (onMessageSent) {
          onMessageSent(data.messageData);
        }
      } else {
        toast.error(data.error || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4" />;
      case "whatsapp":
        return <MessageCircle className="h-4 w-4" />;
      case "platform":
        return <User className="h-4 w-4" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
    }
  };

  const getMessageTypeDescription = (type: string) => {
    switch (type) {
      case "email":
        return `Send email to ${tutorEmail || "tutor's email"}`;
      case "whatsapp":
        return `Send WhatsApp message to ${tutorWhatsApp || "tutor's WhatsApp"}`;
      case "platform":
        return "Send message through platform messaging system";
      default:
        return "Send message";
    }
  };

  return (
    <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <MessageCircle className="h-4 w-4 mr-2" />
          Message Tutor
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Message {tutorName}
          </DialogTitle>
          <DialogDescription>
            {courseName ? `Send a message about ${courseName}` : "Send a message to your tutor"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Tutor Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">{tutorName}</h3>
                {courseName && (
                  <p className="text-sm text-gray-600">{courseName}</p>
                )}
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    Usually responds within 2-4 hours
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Message Type Selection */}
          <div>
            <Label className="text-base font-medium">How would you like to send this message?</Label>
            <RadioGroup value={messageType} onValueChange={setMessageType} className="mt-3">
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <RadioGroupItem value="platform" id="platform" />
                  <Label htmlFor="platform" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-2">
                      {getMessageTypeIcon("platform")}
                      <div>
                        <p className="font-medium">Platform Message</p>
                        <p className="text-sm text-gray-600">
                          {getMessageTypeDescription("platform")}
                        </p>
                      </div>
                    </div>
                  </Label>
                </div>

                {tutorEmail && (
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <RadioGroupItem value="email" id="email" />
                    <Label htmlFor="email" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        {getMessageTypeIcon("email")}
                        <div>
                          <p className="font-medium">Email</p>
                          <p className="text-sm text-gray-600">
                            {getMessageTypeDescription("email")}
                          </p>
                        </div>
                      </div>
                    </Label>
                  </div>
                )}

                {tutorWhatsApp && (
                  <div className="flex items-center space-x-3 p-3 border rounded-lg">
                    <RadioGroupItem value="whatsapp" id="whatsapp" />
                    <Label htmlFor="whatsapp" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        {getMessageTypeIcon("whatsapp")}
                        <div>
                          <p className="font-medium">WhatsApp</p>
                          <p className="text-sm text-gray-600">
                            {getMessageTypeDescription("whatsapp")}
                          </p>
                        </div>
                      </div>
                    </Label>
                  </div>
                )}
              </div>
            </RadioGroup>
          </div>

          {/* Subject (for email) */}
          {messageType === "email" && (
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Enter email subject..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-2"
              />
            </div>
          )}

          {/* Message Content */}
          <div>
            <Label htmlFor="message">Your Message</Label>
            <Textarea
              id="message"
              placeholder="Type your message here..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-2 min-h-[120px]"
            />
            <p className="text-xs text-gray-500 mt-1">
              Be specific about your question or concern for faster assistance
            </p>
          </div>

          {/* Response Time Info */}
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription>
              <strong>Response Time:</strong> Tutors typically respond within 2-4 hours during business hours. 
              For urgent matters, consider using WhatsApp if available.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setShowMessageDialog(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !message.trim()}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
