"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Video,
  Clock,
  Users,
  Calendar,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Loader2,
  FileText,
  Github,
  Link as LinkIcon,
} from "lucide-react";
import { toast } from "sonner";

interface LiveSessionJoinProps {
  sessionId: string;
  onJoinSuccess?: (sessionData: any) => void;
}

export default function LiveSessionJoin({ sessionId, onJoinSuccess }: LiveSessionJoinProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [sessionData, setSessionData] = useState<any>(null);
  const [showJoinDialog, setShowJoinDialog] = useState(false);

  const fetchSessionDetails = async () => {
    try {
      const response = await fetch(`/api/sessions/join/${sessionId}`);
      const data = await response.json();
      
      if (data.success) {
        setSessionData(data.session);
      } else {
        toast.error(data.error || "Failed to get session details");
      }
    } catch (error) {
      console.error("Error fetching session details:", error);
      toast.error("Failed to load session details");
    }
  };

  const handleJoinSession = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/sessions/join/${sessionId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Successfully joined live session!");
        
        // Open meeting link in new tab
        if (data.session.meetingLink) {
          window.open(data.session.meetingLink, "_blank");
        }
        
        setShowJoinDialog(false);
        
        if (onJoinSuccess) {
          onJoinSuccess(data.session);
        }
      } else {
        toast.error(data.error || "Failed to join session");
      }
    } catch (error) {
      console.error("Error joining session:", error);
      toast.error("Failed to join session. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "live":
        return "bg-red-100 text-red-800 border-red-200";
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "live":
        return <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />;
      case "scheduled":
        return <Clock className="h-3 w-3" />;
      case "completed":
        return <CheckCircle className="h-3 w-3" />;
      case "cancelled":
        return <AlertCircle className="h-3 w-3" />;
      default:
        return <Clock className="h-3 w-3" />;
    }
  };

  const getMaterialIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-4 w-4" />;
      case "github":
        return <Github className="h-4 w-4" />;
      case "link":
        return <LinkIcon className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={showJoinDialog} onOpenChange={setShowJoinDialog}>
      <DialogTrigger asChild>
        <Button 
          onClick={fetchSessionDetails}
          className="w-full"
          size="sm"
        >
          <Video className="h-4 w-4 mr-2" />
          Join Live Session
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Live Session Details
          </DialogTitle>
          <DialogDescription>
            Review session information before joining
          </DialogDescription>
        </DialogHeader>

        {sessionData && (
          <div className="space-y-6">
            {/* Session Info */}
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">{sessionData.title}</h3>
                  <p className="text-gray-600">{sessionData.description}</p>
                </div>
                <Badge className={getStatusColor(sessionData.status)}>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(sessionData.status)}
                    <span className="capitalize">{sessionData.status}</span>
                  </div>
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>{new Date(sessionData.scheduledDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>{sessionData.duration} minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span>{sessionData.currentParticipants}/{sessionData.maxParticipants} participants</span>
                </div>
                <div className="flex items-center gap-2">
                  <Video className="h-4 w-4 text-gray-500" />
                  <span>Zoom Meeting</span>
                </div>
              </div>
            </div>

            {/* Agenda */}
            {sessionData.agenda && sessionData.agenda.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Session Agenda</h4>
                <ul className="space-y-1">
                  {sessionData.agenda.map((item: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Materials */}
            {sessionData.materials && sessionData.materials.length > 0 && (
              <div>
                <h4 className="font-medium mb-2">Session Materials</h4>
                <div className="space-y-2">
                  {sessionData.materials.map((material: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
                      <div className="flex items-center gap-2">
                        {getMaterialIcon(material.type)}
                        <span className="text-sm">{material.name}</span>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <a href={material.url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Open
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tutor Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Session Instructor</h4>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">{sessionData.tutor.name}</p>
                  <p className="text-sm text-gray-600">{sessionData.course.title}</p>
                </div>
              </div>
            </div>

            {/* Meeting Info */}
            {sessionData.status === "live" || sessionData.status === "scheduled" ? (
              <Alert>
                <Video className="h-4 w-4" />
                <AlertDescription>
                  {sessionData.status === "live" ? (
                    <span className="text-green-700">
                      <strong>Session is live!</strong> Click "Join Session" to participate.
                    </span>
                  ) : (
                    <span>
                      Session starts at {new Date(sessionData.scheduledDate).toLocaleTimeString()}. 
                      You can join up to 10 minutes before the scheduled time.
                    </span>
                  )}
                </AlertDescription>
              </Alert>
            ) : null}
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setShowJoinDialog(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleJoinSession}
            disabled={isLoading || !sessionData || (sessionData.status !== "live" && sessionData.status !== "scheduled")}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Joining...
              </>
            ) : (
              <>
                <Video className="h-4 w-4 mr-2" />
                Join Session
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
