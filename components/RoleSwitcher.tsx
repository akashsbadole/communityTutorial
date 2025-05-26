"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
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
  Users,
  GraduationCap,
  ArrowRightLeft,
  Shield,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react";
import { toast } from "sonner";

interface RoleSwitcherProps {
  currentRole?: string;
  onRoleChange?: (newRole: string) => void;
}

export default function RoleSwitcher({ currentRole, onRoleChange }: RoleSwitcherProps) {
  const { user } = useUser();
  const router = useRouter();
  const [userRole, setUserRole] = useState<string>(currentRole || "");
  const [isLoading, setIsLoading] = useState(false);
  const [roleInfo, setRoleInfo] = useState<any>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [targetRole, setTargetRole] = useState<string>("");

  useEffect(() => {
    if (!currentRole) {
      fetchUserRole();
    }
  }, [currentRole]);

  const fetchUserRole = async () => {
    try {
      const response = await fetch("/api/user/role");
      const data = await response.json();
      
      if (data.success) {
        setUserRole(data.role);
        setRoleInfo(data);
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  const checkRoleChangeEligibility = async (newRole: string) => {
    try {
      const response = await fetch("/api/user/role", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ targetRole: newRole }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error checking role eligibility:", error);
      return { success: false, error: "Failed to check eligibility" };
    }
  };

  const handleRoleChange = async (newRole: string) => {
    // Check eligibility first
    const eligibility = await checkRoleChangeEligibility(newRole);
    
    if (!eligibility.isAllowed) {
      toast.error(eligibility.reason || "Role change not allowed");
      return;
    }

    setTargetRole(newRole);
    setShowConfirmDialog(true);
  };

  const confirmRoleChange = async () => {
    setIsLoading(true);
    setShowConfirmDialog(false);

    try {
      const response = await fetch("/api/user/role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newRole: targetRole }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        setUserRole(targetRole);
        
        // Call parent callback if provided
        if (onRoleChange) {
          onRoleChange(targetRole);
        }

        // Redirect to appropriate dashboard
        setTimeout(() => {
          if (targetRole === "tutor") {
            router.push("/tutor/dashboard");
          } else {
            router.push("/student/dashboard");
          }
        }, 1500);
      } else {
        toast.error(data.error || "Failed to change role");
      }
    } catch (error) {
      console.error("Error changing role:", error);
      toast.error("Failed to change role. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "tutor":
        return <GraduationCap className="h-5 w-5" />;
      case "student":
        return <Users className="h-5 w-5" />;
      default:
        return <Shield className="h-5 w-5" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "tutor":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "student":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (!user || !userRole) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowRightLeft className="h-5 w-5" />
          Role Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Role */}
        <div>
          <p className="text-sm font-medium text-gray-600 mb-2">Current Role</p>
          <Badge className={`${getRoleColor(userRole)} px-3 py-1`}>
            {getRoleIcon(userRole)}
            <span className="ml-2 capitalize">{userRole}</span>
          </Badge>
        </div>

        {/* Role Information */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            {userRole === "tutor" ? (
              <>
                As a <strong>tutor</strong>, you can create courses, manage students, and earn from teaching. 
                Tutors cannot switch back to student role to maintain platform integrity.
              </>
            ) : (
              <>
                As a <strong>student</strong>, you can enroll in courses and learn from expert tutors. 
                You can upgrade to become a tutor anytime to start teaching.
              </>
            )}
          </AlertDescription>
        </Alert>

        {/* Role Change Options */}
        <div className="space-y-3">
          {userRole === "student" && (
            <div>
              <p className="text-sm font-medium text-gray-600 mb-2">Become a Tutor</p>
              <Button
                onClick={() => handleRoleChange("tutor")}
                disabled={isLoading}
                className="w-full"
                variant="outline"
              >
                <GraduationCap className="h-4 w-4 mr-2" />
                Switch to Tutor Role
              </Button>
              <p className="text-xs text-gray-500 mt-1">
                Start teaching and earning by creating your own courses
              </p>
            </div>
          )}

          {userRole === "tutor" && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Tutors cannot become students.</strong> This policy ensures teaching integrity 
                and prevents conflicts of interest. You can continue accessing all platform features 
                as a tutor.
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Role Change Confirmation Dialog */}
        <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Role Change</DialogTitle>
              <DialogDescription>
                Are you sure you want to change your role from{" "}
                <strong className="capitalize">{userRole}</strong> to{" "}
                <strong className="capitalize">{targetRole}</strong>?
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              {targetRole === "tutor" && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Becoming a tutor will:</strong>
                    <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                      <li>Allow you to create and manage courses</li>
                      <li>Enable you to earn from teaching</li>
                      <li>Give you access to tutor dashboard and tools</li>
                      <li>Prevent you from switching back to student role</li>
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowConfirmDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmRoleChange}
                disabled={isLoading}
              >
                {isLoading ? "Changing Role..." : "Confirm Change"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
