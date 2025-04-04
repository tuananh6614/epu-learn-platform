
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";

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

// Admin Pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import UsersManagement from "@/pages/admin/UsersManagement";

import { AuthGuard } from "@/components/auth/AuthGuard";

// Create a new QueryClient instance
const queryClient = new QueryClient();

const App = () => (
  <React.StrictMode>
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
                <Route path="stats" element={<AdminDashboard />} />
                <Route path="database" element={<AdminDashboard />} />
                <Route path="system" element={<AdminDashboard />} />
                <Route path="security" element={<AdminDashboard />} />
                <Route path="settings" element={<AdminDashboard />} />
              </Route>
              
              {/* Catch-all route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

export default App;
