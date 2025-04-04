import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

type AuthGuardProps = {
  children: React.ReactNode;
  requiredRole?: "admin" | "user" | null;
};

type User = {
  email: string;
  role: "admin" | "user";
  fullName: string;
} | null;

export const AuthGuard = ({ children, requiredRole = null }: AuthGuardProps) => {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  
  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem("epu_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Invalid user data in localStorage");
        localStorage.removeItem("epu_user");
      }
    }
    setLoading(false);
  }, []);
  
  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-epu-primary mb-4"></div>
          <div className="h-4 w-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }
  
  // If no user is logged in and a role is required, redirect to login
  if (!user && requiredRole) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If admin role is required but user is not admin, redirect to home
  if (requiredRole === "admin" && user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }
  
  // If user role required (any authenticated user is fine)
  if (requiredRole === "user" && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Otherwise, render children
  return <>{children}</>;
};

export default AuthGuard;
