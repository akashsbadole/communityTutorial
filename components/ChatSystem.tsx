"use client";

import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  Send,
  User,
  Clock,
  CheckCircle,
  Shield,
  AlertTriangle,
  Loader2,
  X,
} from "lucide-react";
import { toast } from "sonner";

interface ChatRoom {
  id: string;
  studentId: string;
  studentName: string;
  tutorId: string;
  tutorName: string;
  courseId?: number;
  courseName?: string;
  isActive: boolean;
  privacyConsentStudent: boolean;
  privacyConsentTutor: boolean;
  lastMessage?: {
    id: string;
    senderId: string;
    senderName: string;
    message: string;
    createdAt: string;
  };
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  message: string;
  messageType: string;
  isRead: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ChatSystemProps {
  tutorId?: string;
  studentId?: string;
  courseId?: number;
  courseName?: string;
  onChatStarted?: (roomId: string) => void;
}

export default function ChatSystem({
  tutorId,
  studentId,
  courseId,
  courseName,
  onChatStarted,
}: ChatSystemProps) {
  const { user } = useUser();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showChatDialog, setShowChatDialog] = useState(false);
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      fetchChatRooms();
    }
  }, [user]);

  useEffect(() => {
    if (selectedRoom) {
      fetchMessages(selectedRoom.id);
    }
  }, [selectedRoom]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchChatRooms = async () => {
    try {
      const response = await fetch("/api/chat/rooms");
      const data = await response.json();
      
      if (data.success) {
        setChatRooms(data.chatRooms);
      } else {
        toast.error(data.error || "Failed to load chat rooms");
      }
    } catch (error) {
      console.error("Error fetching chat rooms:", error);
      toast.error("Failed to load chat rooms");
    }
  };

  const fetchMessages = async (roomId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/chat/messages?roomId=${roomId}`);
      const data = await response.json();
      
      if (data.success) {
        setMessages(data.messages);
        // Mark messages as read
        await markRoomAsRead(roomId);
      } else {
        toast.error(data.error || "Failed to load messages");
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setIsLoading(false);
    }
  };

  const markRoomAsRead = async (roomId: string) => {
    try {
      await fetch("/api/chat/messages", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "mark_room_read",
          roomId,
        }),
      });
    } catch (error) {
      console.error("Error marking room as read:", error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedRoom || isSending) return;

    setIsSending(true);
    try {
      const response = await fetch("/api/chat/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomId: selectedRoom.id,
          message: newMessage.trim(),
          messageType: "text",
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setMessages(prev => [...prev, data.messageData]);
        setNewMessage("");
        toast.success("Message sent successfully");
      } else {
        toast.error(data.error || "Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const startNewChat = async () => {
    if (!privacyConsent) {
      toast.error("Please agree to privacy policy to start chat");
      return;
    }

    if (!tutorId || !studentId) {
      toast.error("Tutor and student information required");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/chat/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tutorId,
          studentId,
          courseId,
          privacyConsent,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success("Chat room created successfully");
        setShowChatDialog(false);
        await fetchChatRooms();
        
        if (onChatStarted) {
          onChatStarted(data.chatRoom.id);
        }
      } else {
        toast.error(data.error || "Failed to create chat room");
      }
    } catch (error) {
      console.error("Error creating chat room:", error);
      toast.error("Failed to create chat room");
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  const canStartChat = () => {
    // Check if both tutor and student have given privacy consent
    return tutorId && studentId && user;
  };

  return (
    <div className="space-y-4">
      {/* Chat Rooms List */}
      {chatRooms.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Your Conversations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {chatRooms.map((room) => (
                <div
                  key={room.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedRoom?.id === room.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedRoom(room)}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">
                        {user?.publicMetadata?.role === "student" ? room.tutorName : room.studentName}
                      </h4>
                      {room.courseName && (
                        <p className="text-sm text-gray-600">{room.courseName}</p>
                      )}
                      {room.lastMessage && (
                        <p className="text-sm text-gray-500 truncate max-w-xs">
                          {room.lastMessage.message}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      {room.unreadCount > 0 && (
                        <Badge variant="default" className="mb-1">
                          {room.unreadCount}
                        </Badge>
                      )}
                      {room.lastMessage && (
                        <p className="text-xs text-gray-500">
                          {formatTime(room.lastMessage.createdAt)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Start New Chat Button */}
      {canStartChat() && (
        <Dialog open={showChatDialog} onOpenChange={setShowChatDialog}>
          <DialogTrigger asChild>
            <Button className="w-full">
              <MessageCircle className="h-4 w-4 mr-2" />
              Start Chat
            </Button>
          </DialogTrigger>
          
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Start Private Chat
              </DialogTitle>
              <DialogDescription>
                {courseName ? `Start a private chat about ${courseName}` : "Start a private chat"}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <strong>Privacy Policy Agreement Required</strong>
                  <br />
                  By starting this chat, you agree to our privacy policy and consent to direct communication.
                  Your contact information will be shared with the other party only after both parties agree.
                </AlertDescription>
              </Alert>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="privacy-consent"
                  checked={privacyConsent}
                  onChange={(e) => setPrivacyConsent(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="privacy-consent" className="text-sm">
                  I agree to the privacy policy and consent to direct communication
                </label>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowChatDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={startNewChat}
                disabled={!privacyConsent || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Start Chat
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Chat Interface */}
      {selectedRoom && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {user?.publicMetadata?.role === "student" ? selectedRoom.tutorName : selectedRoom.studentName}
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedRoom(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            {selectedRoom.courseName && (
              <p className="text-sm text-gray-600">{selectedRoom.courseName}</p>
            )}
            <Badge variant="outline" className="w-fit">
              🔒 This is dummy chat data for demonstration
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Messages */}
              <ScrollArea className="h-96 w-full border rounded-lg p-4">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.senderId === user?.id ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.senderId === user?.id
                              ? "bg-blue-500 text-white"
                              : "bg-gray-100 text-gray-900"
                          }`}
                        >
                          <p className="text-sm">{message.message}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs opacity-75">
                              {formatTime(message.createdAt)}
                            </span>
                            {message.senderId === user?.id && (
                              <CheckCircle className="h-3 w-3 opacity-75" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </ScrollArea>

              {/* Message Input */}
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  disabled={isSending}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || isSending}
                >
                  {isSending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Chat Rooms Message */}
      {chatRooms.length === 0 && !canStartChat() && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            No chat rooms available. Chat functionality requires privacy consent from both tutor and student.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
