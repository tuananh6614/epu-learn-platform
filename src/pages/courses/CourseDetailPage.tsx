
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { BookOpen, Users, Clock, Calendar, ChevronLeft, Play, ShoppingCart, CheckCircle } from "lucide-react";
import { mockCourses } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import CourseContent, { ChapterType, ContentItemType } from "@/components/courses/CourseContent";

const CourseDetailPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const numericCourseId = Number(courseId);
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(30); // Mock progress - would come from API
  
  // Find course from mock data
  const course = mockCourses.find(c => c.id === numericCourseId);
  
  // Mock course chapters data
  const [courseChapters, setCourseChapters] = useState<ChapterType[]>([
    {
      id: 1,
      title: "Giới thiệu khóa học",
      description: "Tổng quan về nội dung và mục tiêu của khóa học",
      completed: true,
      lessons: [
        {
          id: 101,
          title: "Giới thiệu về khóa học",
          description: "Tổng quan về mục tiêu và nội dung của khóa học",
          duration: "10 phút",
          completed: true,
          contentItems: [
            {
              id: 1001,
              title: "Video giới thiệu khóa học",
              type: "video",
              duration: "5:30",
              completed: true,
              videoUrl: "https://example.com/video1",
              imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"
            },
            {
              id: 1002,
              title: "Tài liệu khóa học",
              type: "text",
              duration: "5 phút",
              completed: true
            }
          ]
        }
      ]
    },
    {
      id: 2,
      title: "Kiến thức nền tảng",
      description: "Các kiến thức cơ bản cần thiết cho khóa học",
      completed: false,
      lessons: [
        {
          id: 201,
          title: "Bài 1: Các khái niệm cơ bản",
          duration: "25 phút",
          completed: true,
          contentItems: [
            {
              id: 2001,
              title: "Video bài giảng",
              type: "video",
              duration: "15:45",
              completed: true,
              videoUrl: "https://example.com/video2",
              imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6"
            },
            {
              id: 2002,
              title: "Slide bài giảng",
              type: "text",
              duration: "10 phút",
              completed: true
            },
            {
              id: 2003,
              title: "Bài tập cuối bài",
              type: "assignment",
              duration: "20 phút",
              completed: false
            }
          ]
        },
        {
          id: 202,
          title: "Bài 2: Ứng dụng thực tế",
          duration: "35 phút",
          completed: false,
          contentItems: [
            {
              id: 2004,
              title: "Video bài giảng",
              type: "video",
              duration: "20:30",
              completed: false,
              videoUrl: "https://example.com/video3",
              imageUrl: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7"
            },
            {
              id: 2005,
              title: "Bài quiz kiểm tra",
              type: "quiz",
              duration: "15 phút",
              completed: false
            }
          ]
        }
      ]
    },
    {
      id: 3,
      title: "Kiến thức nâng cao",
      description: "Các kiến thức chuyên sâu của khóa học",
      completed: false,
      lessons: [
        {
          id: 301,
          title: "Bài 1: Chủ đề nâng cao",
          duration: "45 phút",
          locked: true,
          contentItems: [
            {
              id: 3001,
              title: "Video bài giảng",
              type: "video",
              duration: "30:00",
              locked: true,
              videoUrl: "https://example.com/video4",
              imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
            },
            {
              id: 3002,
              title: "Tài liệu bổ sung",
              type: "text",
              duration: "15 phút",
              locked: true
            }
          ]
        }
      ]
    }
  ]);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
      // Mock check if user is enrolled
      setIsEnrolled(user ? Math.random() > 0.5 : false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [user]);

  const handleContentItemClick = (chapterId: number, lessonId: number, contentItem: ContentItemType) => {
    if (contentItem.locked) {
      toast({
        title: "Nội dung bị khóa",
        description: "Bạn cần hoàn thành các bài học trước để mở khóa nội dung này.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Đang mở nội dung",
      description: `Đang mở ${contentItem.title}`,
    });
    
    // Here you would navigate to the specific content viewer
    // For now, let's just mark it as completed
    const updatedChapters = courseChapters.map(chapter => {
      if (chapter.id === chapterId) {
        return {
          ...chapter,
          lessons: chapter.lessons.map(lesson => {
            if (lesson.id === lessonId) {
              return {
                ...lesson,
                contentItems: lesson.contentItems.map(item => {
                  if (item.id === contentItem.id) {
                    return { ...item, completed: true };
                  }
                  return item;
                })
              };
            }
            return lesson;
          })
        };
      }
      return chapter;
    });
    
    setCourseChapters(updatedChapters);
    
    // Update progress (in a real app, this would be handled by the backend)
    const totalItems = courseChapters.reduce((total, chapter) => 
      total + chapter.lessons.reduce((lessonTotal, lesson) => 
        lessonTotal + lesson.contentItems.length, 0), 0);
        
    const completedItems = updatedChapters.reduce((total, chapter) => 
      total + chapter.lessons.reduce((lessonTotal, lesson) => 
        lessonTotal + lesson.contentItems.filter(item => item.completed).length, 0), 0);
    
    setCurrentProgress(Math.round((completedItems / totalItems) * 100));
  };

  const handleEnroll = () => {
    if (!user) {
      toast({
        title: "Yêu cầu đăng nhập",
        description: "Vui lòng đăng nhập để đăng ký khóa học",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Đăng ký thành công",
      description: "Bạn đã đăng ký khóa học thành công!"
    });
    
    setIsEnrolled(true);
  };

  if (loading) {
    return (
      <div className="container px-4 md:px-6 py-10">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-64 bg-slate-200 dark:bg-slate-700 rounded"></div>
          <div className="h-80 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
          <div className="h-40 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container px-4 md:px-6 py-10 text-center">
        <h2 className="text-2xl font-bold mb-4">Không tìm thấy khóa học</h2>
        <p className="mb-6">Khóa học bạn đang tìm kiếm không tồn tại.</p>
        <Button asChild>
          <Link to="/courses">Quay lại danh sách khóa học</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container px-4 md:px-6 py-10">
      <Link to="/courses" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
        <ChevronLeft size={16} className="mr-1" /> Quay lại danh sách khóa học
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {course.specialization && (
                <Badge className="bg-epu-primary text-white">{
                  course.specialization === "CNTT" ? "Công nghệ thông tin" :
                  course.specialization === "DTVT" ? "Điện tử viễn thông" :
                  course.specialization === "KTDL" ? "Kỹ thuật điện lạnh" :
                  course.specialization === "KTDK" ? "Kỹ thuật điều khiển" :
                  course.specialization === "ATTT" ? "An toàn thông tin" :
                  course.specialization
                }</Badge>
              )}
              <Badge variant="outline">Cập nhật: 04/2025</Badge>
              <Badge variant="outline" className="flex items-center">
                <Users size={14} className="mr-1" />
                {course.enrollmentCount || 0} học viên
              </Badge>
            </div>
            
            <div className="rounded-xl overflow-hidden mb-8 shadow-md relative group">
              <img
                src={course.thumbnail || "/placeholder.svg"}
                alt={course.title}
                className="w-full aspect-video object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <motion.div 
                  className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center cursor-pointer border border-white/30"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play size={36} className="text-white ml-1" />
                </motion.div>
              </div>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
              <TabsList className="w-full grid grid-cols-2 md:w-auto md:inline-flex bg-slate-100 dark:bg-slate-800 p-1">
                <TabsTrigger className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700" value="overview">Tổng quan</TabsTrigger>
                <TabsTrigger className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700" value="content">Nội dung khóa học</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="pt-6">
                <div className="prose dark:prose-invert max-w-none">
                  <h2 className="text-2xl font-bold mb-4">Giới thiệu khóa học</h2>
                  <p className="mb-4">{course.description}</p>
                  <p className="mb-4">
                    Khóa học này cung cấp cho bạn những kiến thức và kỹ năng cần thiết để làm chủ {course.title}. 
                    Thông qua các bài giảng video chất lượng cao, các bài tập thực hành và các dự án thực tế, 
                    bạn sẽ có được kinh nghiệm quý báu để phát triển sự nghiệp của mình.
                  </p>
                  
                  <h3 className="text-xl font-bold mt-8 mb-4">Bạn sẽ học được gì?</h3>
                  <ul className="space-y-2 list-disc pl-6">
                    <li>Hiểu rõ các khái niệm cơ bản và nâng cao về chủ đề</li>
                    <li>Áp dụng kiến thức vào các bài tập và dự án thực tế</li>
                    <li>Xây dựng một nền tảng kiến thức vững chắc để tiếp tục học tập</li>
                    <li>Đạt được các kỹ năng cần thiết cho công việc tương lai</li>
                    <li>Nhận chứng chỉ hoàn thành khóa học có giá trị</li>
                  </ul>

                  <h3 className="text-xl font-bold mt-8 mb-4">Đối tượng phù hợp</h3>
                  <ul className="space-y-2 list-disc pl-6">
                    <li>Sinh viên ngành {course.specialization === "CNTT" ? "Công nghệ thông tin" : "Điện - Điện tử"} muốn nâng cao kiến thức</li>
                    <li>Người đi làm muốn cập nhật kiến thức mới</li>
                    <li>Người mới bắt đầu quan tâm đến lĩnh vực này</li>
                  </ul>
                  
                  <h3 className="text-xl font-bold mt-8 mb-4">Yêu cầu tiên quyết</h3>
                  <ul className="space-y-2 list-disc pl-6">
                    <li>Kiến thức cơ bản về máy tính</li>
                    <li>Không yêu cầu kinh nghiệm trước đó</li>
                    <li>Mong muốn học hỏi và thực hành</li>
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="content" className="pt-6">
                <CourseContent 
                  chapters={courseChapters}
                  onContentItemClick={handleContentItemClick}
                  currentProgress={currentProgress}
                />
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>

        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="sticky top-20 shadow-lg border border-slate-200 dark:border-slate-700">
              <CardContent className="p-0">
                {isEnrolled ? (
                  <div className="p-6 bg-gradient-to-br from-epu-primary to-epu-accent text-white rounded-t-lg">
                    <div className="flex items-center mb-4">
                      <CheckCircle size={24} className="mr-2" />
                      <h3 className="text-xl font-bold">Đã đăng ký khóa học</h3>
                    </div>
                    <p>Tiếp tục học tập để hoàn thành khóa học của bạn!</p>
                  </div>
                ) : (
                  <div className="p-6 bg-gradient-to-br from-slate-700 to-slate-900 text-white rounded-t-lg">
                    <h3 className="text-xl font-bold mb-2">Đăng ký khóa học</h3>
                    <p>Nâng cao kỹ năng của bạn với khóa học này!</p>
                  </div>
                )}
                
                <div className="p-6">
                  <div className="mb-6">
                    <div className="text-3xl font-bold text-epu-primary dark:text-epu-accent">Miễn phí</div>
                    <div className="text-sm text-muted-foreground">Đăng ký tham gia ngay</div>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center">
                      <BookOpen size={16} className="text-epu-primary dark:text-epu-accent mr-2" />
                      <span>{courseChapters.length} chương học</span>
                    </div>
                    <div className="flex items-center">
                      <BookOpen size={16} className="text-epu-primary dark:text-epu-accent mr-2" />
                      <span>{courseChapters.reduce((total, chapter) => total + chapter.lessons.length, 0)} bài học</span>
                    </div>
                    <div className="flex items-center">
                      <Clock size={16} className="text-epu-primary dark:text-epu-accent mr-2" />
                      <span>Thời lượng: 8 giờ học</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar size={16} className="text-epu-primary dark:text-epu-accent mr-2" />
                      <span>Truy cập không giới hạn</span>
                    </div>
                  </div>
                  
                  {isEnrolled ? (
                    <Button className="w-full mb-4 bg-epu-primary hover:bg-epu-primary/90">
                      <Play size={16} className="mr-2" />
                      Tiếp tục học
                    </Button>
                  ) : (
                    <Button onClick={handleEnroll} className="w-full mb-4 bg-epu-primary hover:bg-epu-primary/90 group">
                      <ShoppingCart size={16} className="mr-2 group-hover:animate-bounce" />
                      Đăng ký ngay
                    </Button>
                  )}
                  
                  <p className="text-xs text-center text-muted-foreground">
                    Được phát triển bởi Trường Đại học Điện lực
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
