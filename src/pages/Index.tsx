
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, FileText, ChevronRight, Sparkles, Search, BookOpenCheck, ArrowRight } from "lucide-react";
import CourseCard from "@/components/courses/CourseCard";
import DocumentCard from "@/components/documents/DocumentCard";
import { mockCourses, mockDocuments } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { motion } from "framer-motion";
import { FloatingParticles } from "@/components/ui/FloatingParticles";
import AnimatedWaves from "@/components/ui/AnimatedWaves";
import GlowingOrbs from "@/components/ui/GlowingOrbs";

const HomePage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const featuredCourses = mockCourses.slice(0, 3);
  const featuredDocuments = mockDocuments.slice(0, 4);
  
  const handlePurchaseDocument = (documentId: number) => {
    if (!user) {
      toast({
        title: "Cần đăng nhập",
        description: "Vui lòng đăng nhập để mua tài liệu",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    toast({
      title: "Chức năng đang phát triển",
      description: "Tính năng mua tài liệu sẽ sớm được cập nhật",
    });
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1] 
      }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.05,
      boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.1)",
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10
      }
    },
    tap: { 
      scale: 0.98,
      boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.05)" 
    }
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[80vh] md:min-h-[70vh] flex items-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-epu-primary via-blue-700 to-epu-accent bg-size-200 animate-gradient-shift"></div>
        
        {/* Animated elements */}
        <GlowingOrbs />
        <FloatingParticles />
        <AnimatedWaves />
        
        <div className="container px-4 md:px-6 flex flex-col items-center text-center relative z-10 py-12 md:py-16">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-3xl mx-auto"
          >
            <motion.div 
              variants={itemVariants}
              className="inline-block bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4"
            >
              <span className="text-white/90 font-medium tracking-wide text-sm">
                Nền tảng học tập hàng đầu
              </span>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-4xl md:text-5xl font-bold leading-tight tracking-tight text-white drop-shadow-md mb-3 mx-auto"
            >
              EPU Learn
              <span className="block text-xl sm:text-2xl md:text-3xl mt-2 font-light opacity-95">
                Nền tảng học tập trực tuyến của Đại học Điện Lực
              </span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-base sm:text-lg text-white/90 drop-shadow-sm mb-6 max-w-xl mx-auto leading-relaxed"
            >
              Khám phá kho tàng kiến thức với các khóa học chất lượng cao và tài liệu học tập phong phú
            </motion.p>
            
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Button 
                  variant="hero-primary" 
                  size="hero" 
                  className="group btn-glow"
                  onClick={() => navigate("/courses")}
                >
                  <BookOpenCheck className="mr-2 h-5 w-5" />
                  Khám phá khóa học
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
              
              <motion.div
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Button 
                  variant="hero-secondary" 
                  size="hero" 
                  className="group"
                  onClick={() => navigate("/documents")}
                >
                  <Search className="mr-2 h-5 w-5" />
                  Tìm tài liệu học tập
                  <span className="w-0 overflow-hidden group-hover:w-4 transition-all duration-300"></span>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <CardContent className="flex flex-col items-center p-8">
                  <div className="mb-4 w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <BookOpen className="h-8 w-8 text-epu-primary dark:text-blue-400" />
                  </div>
                  <div className="text-5xl font-bold text-epu-primary dark:text-blue-400 mb-2">300+</div>
                  <p className="text-muted-foreground text-lg">Khóa học đa dạng</p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <CardContent className="flex flex-col items-center p-8">
                  <div className="mb-4 w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-purple-600 dark:text-purple-400">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <div className="text-5xl font-bold text-purple-600 dark:text-purple-400 mb-2">5,000+</div>
                  <p className="text-muted-foreground text-lg">Học viên tích cực</p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <CardContent className="flex flex-col items-center p-8">
                  <div className="mb-4 w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                    <FileText className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="text-5xl font-bold text-amber-600 dark:text-amber-400 mb-2">1,000+</div>
                  <p className="text-muted-foreground text-lg">Tài liệu học tập</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Content */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-950">
        <div className="container px-4 md:px-6">
          <Tabs defaultValue="courses" className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
              <motion.div 
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="p-2 rounded-full bg-epu-accent/10 dark:bg-epu-accent/20">
                  <Sparkles className="text-epu-accent h-6 w-6" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">Khám phá nội dung</h2>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <TabsList className="shadow-md p-1 rounded-xl">
                  <TabsTrigger value="courses" className="flex items-center gap-2 px-6 py-3 rounded-lg">
                    <BookOpen size={18} />
                    Khóa học
                  </TabsTrigger>
                  <TabsTrigger value="documents" className="flex items-center gap-2 px-6 py-3 rounded-lg">
                    <FileText size={18} />
                    Tài liệu
                  </TabsTrigger>
                </TabsList>
              </motion.div>
            </div>

            <TabsContent value="courses" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredCourses.map((course, index) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <CourseCard course={course} />
                  </motion.div>
                ))}
              </div>
              <motion.div 
                className="mt-16 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Button 
                    className="modern-btn-primary rounded-xl text-base px-8 py-6 h-auto"
                    onClick={() => navigate("/courses")}
                  >
                    Xem tất cả khóa học
                    <ChevronRight size={18} className="ml-1" />
                  </Button>
                </motion.div>
              </motion.div>
            </TabsContent>

            <TabsContent value="documents" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredDocuments.map((document, index) => (
                  <motion.div
                    key={document.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <DocumentCard 
                      document={document} 
                      onPurchase={() => handlePurchaseDocument(document.id)} 
                    />
                  </motion.div>
                ))}
              </div>
              <motion.div 
                className="mt-16 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Button 
                    className="modern-btn-secondary rounded-xl text-base px-8 py-6 h-auto"
                    onClick={() => navigate("/documents")}
                  >
                    Xem tất cả tài liệu
                    <ChevronRight size={18} className="ml-1" />
                  </Button>
                </motion.div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Lợi ích khi sử dụng EPU Learn
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <Card className="border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 h-full">
                <CardContent className="p-8">
                  <div className="w-14 h-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6">
                    <BookOpen className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-4">Học liệu chất lượng</h3>
                  <p className="text-muted-foreground">
                    Tiếp cận các khóa học và tài liệu được phát triển bởi đội ngũ giảng viên giàu kinh nghiệm
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <Card className="border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 h-full">
                <CardContent className="p-8">
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-amber-600 dark:text-amber-400">
                      <path d="M7 10v12"></path>
                      <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-4">Học mọi lúc mọi nơi</h3>
                  <p className="text-muted-foreground">
                    Truy cập nền tảng học tập linh hoạt từ máy tính, điện thoại hoặc máy tính bảng
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ y: -10, transition: { duration: 0.3 } }}
            >
              <Card className="border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300 h-full">
                <CardContent className="p-8">
                  <div className="w-14 h-14 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-purple-600 dark:text-purple-400">
                      <circle cx="12" cy="8" r="5"></circle>
                      <path d="M20 21a8 8 0 1 0-16 0"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-4">Hỗ trợ tận tâm</h3>
                  <p className="text-muted-foreground">
                    Đội ngũ hỗ trợ kỹ thuật và giải đáp thắc mắc học tập trong suốt quá trình học
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-950">
        <div className="container px-4 md:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Bắt đầu hành trình học tập của bạn ngay hôm nay</h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
              Đăng ký tài khoản miễn phí để truy cập vào kho tàng kiến thức đa dạng của EPU Learn
            </p>
            <motion.div
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-epu-primary to-epu-accent text-white shadow-lg hover:shadow-xl text-lg px-10 py-7 h-auto rounded-xl"
                onClick={() => navigate(user ? "/courses" : "/register")}
              >
                {user ? "Khám phá khóa học" : "Đăng ký miễn phí"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
