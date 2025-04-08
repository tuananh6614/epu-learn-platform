import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider, useTheme } from "next-themes";
import { FloatingParticles } from "@/components/ui/FloatingParticles";
import HomePage from "@/pages/HomePage";
import CourseDetailPage from "@/pages/courses/CourseDetailPage";
import LessonPage from "@/pages/courses/LessonPage";
import QuizPage from "@/pages/courses/QuizPage";
import CourseExamPage from "@/pages/courses/CourseExamPage";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Stars } from "lucide-react";

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
import DocumentCategories from "@/pages/admin/DocumentCategories";
import PublishCourse from "@/pages/admin/PublishCourse";
import FinanceManagement from "@/pages/admin/FinanceManagement";

import { AuthGuard } from "@/components/auth/AuthGuard";

// Theme elements component
const ThemeElements = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  
  return (
    <div className="fixed z-10 w-full pointer-events-none">
      <AnimatePresence mode="wait">
        {!isDark ? (
          <motion.div
            key="sun-element"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute top-6 right-16 md:right-20 lg:right-36"
          >
            <div className="relative">
              <motion.div
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 60,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                <Sun 
                  size={40} 
                  className="text-amber-500 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" 
                />
              </motion.div>
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute bg-amber-400 h-1.5 rounded-full"
                  style={{
                    width: (i % 3 === 0) ? '14px' : '10px',
                    left: '50%',
                    top: '50%',
                    transformOrigin: '0 0',
                    transform: `rotate(${i * 30}deg) translateX(28px)`
                  }}
                  animate={{
                    opacity: [0.4, 0.8, 0.4],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 3 + i % 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.2
                  }}
                />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="moon-element"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute top-6 right-16 md:right-20 lg:right-36"
          >
            <div className="relative">
              <Moon 
                size={35} 
                className="text-blue-300 drop-shadow-[0_0_8px_rgba(147,197,253,0.5)]" 
              />
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute bg-blue-200 rounded-full"
                  style={{
                    width: Math.random() * 2 + 1 + 'px',
                    height: Math.random() * 2 + 1 + 'px',
                    left: Math.random() * 100 - 20 + 'px',
                    top: Math.random() * 100 - 40 + 'px',
                  }}
                  animate={{
                    opacity: [0.2, 0.8, 0.2],
                    scale: [1, 1.3, 1],
                  }}
                  transition={{
                    duration: 2 + Math.random() * 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.3
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Create a new QueryClient instance
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <TooltipProvider>
          <FloatingParticles />
          <ThemeElements />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                {/* Main Layout Routes */}
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<HomePage />} />
                  <Route path="courses" element={<CoursesPage />} />
                  <Route path="courses/:courseId" element={<CourseDetailPage />} />
                  <Route path="courses/:courseId/learn/:contentId" element={<LessonPage />} />
                  <Route path="courses/:courseId/quiz/:quizId" element={<QuizPage />} />
                  <Route path="courses/:courseId/exam" element={<CourseExamPage />} />
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
                  <Route path="documents/categories" element={<DocumentCategories />} />
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
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
