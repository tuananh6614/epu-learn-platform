
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { BookOpen, Trophy, Lock, ChevronLeft, AlertCircle, CheckCircle } from "lucide-react";
import { mockCourses } from "@/lib/utils";
import QuizContent from "@/components/courses/QuizContent";

const CourseExamPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const numericCourseId = Number(courseId);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [canTakeExam, setCanTakeExam] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  const [courseChapterStatus, setCourseChapterStatus] = useState<{id: number, title: string, completed: boolean}[]>([]);
  
  const course = mockCourses.find(c => c.id === numericCourseId);
  
  useEffect(() => {
    // Simulate checking if all chapter quizzes are completed
    setTimeout(() => {
      const mockChapterStatus = [
        { id: 1, title: "Giới thiệu khóa học", completed: true },
        { id: 2, title: "Kiến thức nền tảng", completed: Math.random() > 0.3 },
        { id: 3, title: "Kiến thức nâng cao", completed: Math.random() > 0.7 }
      ];
      
      setCourseChapterStatus(mockChapterStatus);
      setCanTakeExam(mockChapterStatus.every(chapter => chapter.completed));
      setLoading(false);
    }, 1000);
  }, [courseId]);
  
  const handleStartExam = () => {
    if (!canTakeExam) {
      toast({
        title: "Không thể làm bài kiểm tra",
        description: "Bạn cần hoàn thành tất cả bài kiểm tra của các chương trước khi làm bài kiểm tra tổng quát.",
        variant: "destructive"
      });
      return;
    }
    
    setExamStarted(true);
  };
  
  const handleExamComplete = (score: number) => {
    // In a real app, you'd save this score to the user's profile
    console.log(`User completed final exam with score: ${score}%`);
    
    // Optionally award a certificate if the score is high enough
    if (score >= 80) {
      toast({
        title: "Chúc mừng!",
        description: "Bạn đã đạt đủ điểm để nhận chứng chỉ khóa học này!"
      });
    }
  };
  
  const handleBackToCourse = () => {
    navigate(`/courses/${courseId}`);
  };
  
  if (loading) {
    return (
      <div className="container px-4 md:px-6 py-10">
        <div className="animate-pulse space-y-8">
          <div className="h-8 w-64 bg-slate-200 dark:bg-slate-700 rounded"></div>
          <div className="h-60 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
        </div>
      </div>
    );
  }
  
  if (!course) {
    return (
      <div className="container px-4 md:px-6 py-10 text-center">
        <h2 className="text-2xl font-bold mb-4">Không tìm thấy khóa học</h2>
        <Button asChild onClick={handleBackToCourse}>
          <span>Quay lại trang chủ</span>
        </Button>
      </div>
    );
  }
  
  if (examStarted) {
    return (
      <div className="container px-4 md:px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="outline" 
            onClick={() => setExamStarted(false)}
            className="mb-6 gap-2"
          >
            <ChevronLeft size={16} /> Quay lại
          </Button>
          
          <h1 className="text-2xl md:text-3xl font-bold mb-6">Bài kiểm tra tổng quát: {course.title}</h1>
          
          <QuizContent 
            isFinalExam 
            onComplete={handleExamComplete} 
            courseId={numericCourseId}
          />
        </div>
      </div>
    );
  }
  
  return (
    <div className="container px-4 md:px-6 py-10">
      <Button 
        variant="outline" 
        onClick={handleBackToCourse}
        className="mb-6 gap-2"
      >
        <ChevronLeft size={16} /> Quay lại khóa học
      </Button>
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Bài kiểm tra tổng quát</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Đây là bài kiểm tra cuối cùng của khóa học. Hoàn thành bài kiểm tra này để nhận chứng chỉ hoàn thành khóa học.
          </p>
        </div>
        
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-epu-primary/10 shrink-0">
                <Trophy size={32} className="text-epu-primary" />
              </div>
              
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2">Bài kiểm tra tổng quát: {course.title}</h2>
                <p className="text-muted-foreground mb-4">Bài kiểm tra này đánh giá toàn bộ kiến thức trong khóa học.</p>
                
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <BookOpen size={16} className="text-epu-primary" />
                    <span>10 câu hỏi</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle size={16} className="text-green-600" />
                    <span>Yêu cầu đạt 60% trở lên</span>
                  </div>
                </div>
              </div>
              
              <Button 
                disabled={!canTakeExam} 
                onClick={handleStartExam}
                size="lg"
                className={`shrink-0 px-8 ${!canTakeExam ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {canTakeExam ? 'Bắt đầu làm bài' : 'Chưa đủ điều kiện'}
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          <h2 className="text-xl font-bold mb-4">Tiến độ các bài kiểm tra</h2>
          
          <p className="mb-4 text-muted-foreground">
            Để làm bài kiểm tra tổng quát, bạn cần hoàn thành tất cả bài kiểm tra của từng chương trong khóa học.
          </p>
          
          <div className="space-y-3">
            {courseChapterStatus.map((chapter) => (
              <div 
                key={chapter.id}
                className={`p-4 border rounded-md flex items-center justify-between ${
                  chapter.completed 
                    ? 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-900/10' 
                    : 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-900/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  {chapter.completed ? (
                    <CheckCircle size={20} className="text-green-600 dark:text-green-400" />
                  ) : (
                    <AlertCircle size={20} className="text-red-600 dark:text-red-400" />
                  )}
                  <span className="font-medium">{chapter.title}</span>
                </div>
                
                <div>
                  {chapter.completed ? (
                    <span className="text-sm text-green-600 dark:text-green-400">Đã hoàn thành</span>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/courses/${courseId}`)}
                    >
                      Hoàn thành ngay
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <Card className={`mt-6 border ${canTakeExam ? 'border-green-300' : 'border-gray-300'}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {canTakeExam ? (
                    <CheckCircle size={24} className="text-green-600" />
                  ) : (
                    <Lock size={24} className="text-muted-foreground" />
                  )}
                  
                  <div>
                    <h3 className="font-bold">Trạng thái bài kiểm tra tổng quát</h3>
                    <p className="text-sm text-muted-foreground">
                      {canTakeExam 
                        ? 'Bạn đã đủ điều kiện để làm bài kiểm tra tổng quát!' 
                        : 'Hoàn thành tất cả bài kiểm tra của các chương để mở khóa.'
                      }
                    </p>
                  </div>
                </div>
                
                <div className="w-20">
                  <div className="text-center mb-1 text-xs font-medium">
                    {courseChapterStatus.filter(c => c.completed).length}/{courseChapterStatus.length}
                  </div>
                  <Progress 
                    value={(courseChapterStatus.filter(c => c.completed).length / courseChapterStatus.length) * 100}
                    className="h-2"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseExamPage;
