
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ChevronLeft } from "lucide-react";
import { mockCourses } from "@/lib/utils";
import QuizContent from "@/components/courses/QuizContent";

const QuizPage = () => {
  const { courseId, quizId } = useParams<{ courseId: string, quizId: string }>();
  const numericCourseId = Number(courseId);
  const numericQuizId = Number(quizId);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  
  const course = mockCourses.find(c => c.id === numericCourseId);
  
  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 800);
  }, [quizId]);
  
  const handleQuizComplete = (score: number) => {
    console.log(`Quiz ${quizId} completed with score ${score}%`);
    
    // In a real app, you would save the quiz results
    if (score >= 60) {
      toast({
        title: "Bài kiểm tra hoàn thành",
        description: `Bạn đã hoàn thành bài kiểm tra với số điểm ${score}%!`
      });
    } else {
      toast({
        title: "Bài kiểm tra chưa đạt",
        description: `Bạn đã hoàn thành bài kiểm tra nhưng chưa đạt đủ điểm (${score}%).`,
        variant: "destructive"
      });
    }
  };
  
  const handleBackToLesson = () => {
    navigate(`/courses/${courseId}/learn/${quizId}`);
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
        <Button onClick={() => navigate(`/courses`)}>
          Quay lại danh sách khóa học
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container px-4 md:px-6 py-10">
      <Button 
        variant="outline" 
        onClick={handleBackToLesson}
        className="mb-6 gap-2"
      >
        <ChevronLeft size={16} /> Quay lại bài học
      </Button>
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Bài kiểm tra: {course.title}</h1>
        
        <Card className="p-6">
          <QuizContent 
            onComplete={handleQuizComplete} 
            courseId={numericCourseId}
          />
        </Card>
      </div>
    </div>
  );
};

export default QuizPage;
