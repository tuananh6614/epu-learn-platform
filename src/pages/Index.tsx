
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, FileText, ChevronRight } from "lucide-react";
import CourseCard from "@/components/courses/CourseCard";
import DocumentCard from "@/components/documents/DocumentCard";
import { mockCourses, mockDocuments } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";

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

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-epu-primary to-epu-accent text-white py-16 md:py-24">
        <div className="container px-4 md:px-6 flex flex-col items-center text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 max-w-3xl animate-fade-in">
            EPU Learn - Nền tảng học tập trực tuyến của Đại học Điện Lực
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl">
            Khám phá kho tàng kiến thức với các khóa học chất lượng cao và tài liệu học tập phong phú
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              className="bg-white text-epu-primary hover:bg-white/90"
              onClick={() => navigate("/courses")}
            >
              Khám phá khóa học
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white/20"
              onClick={() => navigate("/documents")}
            >
              Tìm tài liệu học tập
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-none shadow-md">
              <CardContent className="flex flex-col items-center p-6">
                <div className="text-4xl font-bold text-epu-primary mb-2">300+</div>
                <p className="text-muted-foreground">Khóa học đa dạng</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-md">
              <CardContent className="flex flex-col items-center p-6">
                <div className="text-4xl font-bold text-epu-primary mb-2">5,000+</div>
                <p className="text-muted-foreground">Học viên tích cực</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-md">
              <CardContent className="flex flex-col items-center p-6">
                <div className="text-4xl font-bold text-epu-primary mb-2">1,000+</div>
                <p className="text-muted-foreground">Tài liệu học tập</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Content */}
      <section className="py-16 bg-muted/30">
        <div className="container px-4 md:px-6">
          <Tabs defaultValue="courses" className="space-y-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold">Khám phá nội dung</h2>
              <TabsList>
                <TabsTrigger value="courses" className="flex items-center gap-1">
                  <BookOpen size={16} />
                  Khóa học
                </TabsTrigger>
                <TabsTrigger value="documents" className="flex items-center gap-1">
                  <FileText size={16} />
                  Tài liệu
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="courses" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
              <div className="mt-8 text-center">
                <Button 
                  className="bg-epu-primary hover:bg-epu-primary/90"
                  onClick={() => navigate("/courses")}
                >
                  Xem tất cả khóa học
                  <ChevronRight size={16} className="ml-1" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="documents" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredDocuments.map((document) => (
                  <DocumentCard 
                    key={document.id} 
                    document={document} 
                    onPurchase={() => handlePurchaseDocument(document.id)} 
                  />
                ))}
              </div>
              <div className="mt-8 text-center">
                <Button 
                  className="bg-epu-primary hover:bg-epu-primary/90"
                  onClick={() => navigate("/documents")}
                >
                  Xem tất cả tài liệu
                  <ChevronRight size={16} className="ml-1" />
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Lợi ích khi sử dụng EPU Learn</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-epu-primary/10 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-epu-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">Học liệu chất lượng</h3>
                <p className="text-muted-foreground">
                  Tiếp cận các khóa học và tài liệu được phát triển bởi đội ngũ giảng viên giàu kinh nghiệm
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-epu-secondary/10 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-epu-secondary">
                    <path d="M7 10v12"></path>
                    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2">Học mọi lúc mọi nơi</h3>
                <p className="text-muted-foreground">
                  Truy cập nền tảng học tập linh hoạt từ máy tính, điện thoại hoặc máy tính bảng
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-epu-accent/10 flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-epu-accent">
                    <circle cx="12" cy="8" r="5"></circle>
                    <path d="M20 21a8 8 0 1 0-16 0"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2">Hỗ trợ tận tâm</h3>
                <p className="text-muted-foreground">
                  Đội ngũ hỗ trợ kỹ thuật và giải đáp thắc mắc học tập trong suốt quá trình học
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-epu-light">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Bắt đầu hành trình học tập của bạn ngay hôm nay</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Đăng ký tài khoản miễn phí để truy cập vào kho tàng kiến thức đa dạng của EPU Learn
          </p>
          <Button 
            size="lg" 
            className="bg-epu-primary hover:bg-epu-primary/90"
            onClick={() => navigate(user ? "/courses" : "/register")}
          >
            {user ? "Khám phá khóa học" : "Đăng ký miễn phí"}
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
