"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  AlertTriangle, 
  User, 
  GraduationCap, 
  Settings,
  ArrowRight,
  Lock,
  Eye,
  EyeOff
} from "lucide-react";
import { toast } from "sonner";

interface RoleBasedRedirectProps {
  allowedRoles: string[];
  currentPath: string;
  children?: React.ReactNode;
}

export default function RoleBasedRedirect({ 
  allowedRoles, 
  currentPath, 
  children 
}: RoleBasedRedirectProps) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    if (!user) {
      // Redirect to sign-in
      router.push(`/sign-in?redirect_url=${encodeURIComponent(currentPath)}`);
      return;
    }

    // Get user role from metadata or email
    const role = user.publicMetadata?.role as string || 
                 (user.emailAddresses?.[0]?.emailAddress === "admin@traininghub.com" ? "admin" : "student");
    
    setUserRole(role);

    // Check if user has access to this route
    const hasAccess = allowedRoles.includes(role) || 
                     role === "admin" || // Admin can access everything
                     user.emailAddresses?.[0]?.emailAddress === "admin@traininghub.com";

    if (!hasAccess) {
      setAccessDenied(true);
      
      // Show toast notification
      toast.error(`Access denied. This page is for ${allowedRoles.join(' or ')} only.`);
      
      // Redirect to appropriate dashboard after a delay
      setTimeout(() => {
        const redirectPath = role === "student" ? "/student/dashboard" : 
                            role === "tutor" ? "/tutor/dashboard" : 
                            role === "admin" ? "/admin/dashboard" : "/";
        router.push(redirectPath);
      }, 3000);
    }

    setIsChecking(false);
  }, [user, isLoaded, allowedRoles, currentPath, router]);

  // Loading state
  if (!isLoaded || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-gray-600">Verifying access permissions...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Access denied state
  if (accessDenied) {
    const getRoleIcon = (role: string) => {
      switch (role) {
        case "student":
          return <User className="h-8 w-8 text-blue-600" />;
        case "tutor":
          return <GraduationCap className="h-8 w-8 text-green-600" />;
        case "admin":
          return <Settings className="h-8 w-8 text-purple-600" />;
        default:
          return <User className="h-8 w-8 text-gray-600" />;
      }
    };

    const getRedirectPath = (role: string) => {
      switch (role) {
        case "student":
          return "/student/dashboard";
        case "tutor":
          return "/tutor/dashboard";
        case "admin":
          return "/admin/dashboard";
        default:
          return "/";
      }
    };

    const getRoleColor = (role: string) => {
      switch (role) {
        case "student":
          return "bg-blue-100 text-blue-800 border-blue-200";
        case "tutor":
          return "bg-green-100 text-green-800 border-green-200";
        case "admin":
          return "bg-purple-100 text-purple-800 border-purple-200";
        default:
          return "bg-gray-100 text-gray-800 border-gray-200";
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-red-100 rounded-full">
                <Shield className="h-12 w-12 text-red-600" />
              </div>
            </div>
            <CardTitle className="text-2xl text-red-600">Access Denied</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>Insufficient Permissions:</strong> You don't have permission to access this page.
                This page is restricted to <strong>{allowedRoles.join(' or ')}</strong> only.
              </AlertDescription>
            </Alert>

            {/* User Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Your Account Information
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{user?.fullName || "Not provided"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{user?.emailAddresses?.[0]?.emailAddress}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Current Role:</span>
                  <Badge className={getRoleColor(userRole || "")}>
                    <div className="flex items-center gap-1">
                      {getRoleIcon(userRole || "")}
                      <span className="capitalize">{userRole}</span>
                    </div>
                  </Badge>
                </div>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold mb-2 flex items-center gap-2 text-blue-800">
                <Lock className="h-4 w-4" />
                Security Notice
              </h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• <strong>Role-Based Access Control:</strong> Each user role has specific permissions</li>
                <li>• <strong>Students</strong> can only access student resources and dashboards</li>
                <li>• <strong>Tutors</strong> can only access tutor resources and dashboards</li>
                <li>• <strong>Admins</strong> have access to all system resources</li>
                <li>• <strong>Cross-role access</strong> is strictly prohibited for security</li>
              </ul>
            </div>

            {/* Redirect Options */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={() => router.push(getRedirectPath(userRole || ""))}
                className="flex-1"
              >
                {getRoleIcon(userRole || "")}
                <span className="ml-2">Go to My Dashboard</span>
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                onClick={() => router.push("/")}
                className="flex-1"
              >
                Return to Home
              </Button>
            </div>

            {/* Auto-redirect notice */}
            <div className="text-center text-sm text-gray-500">
              You will be automatically redirected to your dashboard in a few seconds...
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Access granted - render children
  return <>{children}</>;
}

// Helper component for protecting specific routes
export function ProtectRoute({ 
  allowedRoles, 
  children 
}: { 
  allowedRoles: string[]; 
  children: React.ReactNode; 
}) {
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
  
  return (
    <RoleBasedRedirect allowedRoles={allowedRoles} currentPath={currentPath}>
      {children}
    </RoleBasedRedirect>
  );
}

// Specific role protection components
export function StudentOnly({ children }: { children: React.ReactNode }) {
  return <ProtectRoute allowedRoles={["student"]}>{children}</ProtectRoute>;
}

export function TutorOnly({ children }: { children: React.ReactNode }) {
  return <ProtectRoute allowedRoles={["tutor"]}>{children}</ProtectRoute>;
}

export function AdminOnly({ children }: { children: React.ReactNode }) {
  return <ProtectRoute allowedRoles={["admin"]}>{children}</ProtectRoute>;
}
