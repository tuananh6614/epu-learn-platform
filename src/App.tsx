
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "next-themes";

// Layouts
import MainLayout from "@/components/layout/MainLayout";
import AdminLayout from "@/components/layout/AdminLayout";

// Pages
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";

// Auth Pages
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";

// User Pages
import CoursesPage from "@/pages/courses/CoursesPage";
import DocumentsPage from "@/pages/documents/DocumentsPage";
import ProfilePage from "@/pages/profile/ProfilePage";

// Admin Pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import UsersManagement from "@/pages/admin/UsersManagement";
import DocumentsManagement from "@/pages/admin/DocumentsManagement";
import PublishCourse from "@/pages/admin/PublishCourse";
import FinanceManagement from "@/pages/admin/FinanceManagement";

import { AuthGuard } from "@/components/auth/AuthGuard";

// Create a new QueryClient instance
const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                {/* Main Layout Routes */}
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<Index />} />
                  <Route path="courses" element={<CoursesPage />} />
                  <Route path="documents" element={<DocumentsPage />} />
                  <Route path="profile" element={
                    <AuthGuard requiredRole="user">
                      <ProfilePage />
                    </AuthGuard>
                  } />
                </Route>
                
                {/* Auth Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Admin Routes */}
                <Route path="/admin" element={
                  <AuthGuard requiredRole="admin">
                    <AdminLayout />
                  </AuthGuard>
                }>
                  <Route index element={<AdminDashboard />} />
                  <Route path="users" element={<UsersManagement />} />
                  <Route path="documents" element={<DocumentsManagement />} />
                  <Route path="publish/courses" element={<PublishCourse />} />
                  <Route path="finance" element={<FinanceManagement />} />
                  <Route path="settings" element={<AdminDashboard />} />
                </Route>
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>
);

export default App;
