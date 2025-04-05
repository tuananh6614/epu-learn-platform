
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { ChevronLeft, ChevronRight, Play, FileText, HelpCircle, CheckCircle, Lock } from "lucide-react";
import { ContentItemType } from "./CourseContent";

interface LessonContentViewerProps {
  contentItem: ContentItemType;
  nextContentId?: number;
  prevContentId?: number;
  onComplete: () => void;
  courseId: number;
}

const LessonContentViewer = ({ 
  contentItem, 
  nextContentId, 
  prevContentId, 
  onComplete,
  courseId
}: LessonContentViewerProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [completed, setCompleted] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Reset state when content changes
    setCompleted(contentItem.completed || false);
    setVideoProgress(0);
    setShowContent(false);
    
    // Simulate loading content
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [contentItem]);

  const handleComplete = () => {
    if (!completed) {
      setCompleted(true);
      onComplete();
      
      toast({
        title: "Hoàn thành!",
        description: "Bạn đã hoàn thành nội dung này",
      });
    }
  };

  const handleNext = () => {
    if (nextContentId) {
      navigate(`/courses/${courseId}/learn/${nextContentId}`);
    } else {
      navigate(`/courses/${courseId}`);
      toast({
        title: "Hoàn thành bài học",
        description: "Bạn đã hoàn thành tất cả nội dung của bài học này",
      });
    }
  };

  const handlePrev = () => {
    if (prevContentId) {
      navigate(`/courses/${courseId}/learn/${prevContentId}`);
    }
  };

  const handleVideoProgress = () => {
    // Simulate video progress
    if (videoProgress < 100 && contentItem.type === "video") {
      const interval = setInterval(() => {
        setVideoProgress(prev => {
          const newProgress = prev + 1;
          if (newProgress >= 100) {
            clearInterval(interval);
            handleComplete();
            return 100;
          }
          return newProgress;
        });
      }, 200); // Speed up for demo
      
      return () => clearInterval(interval);
    }
  };

  useEffect(() => {
    if (showContent && contentItem.type === "video") {
      const cleanup = handleVideoProgress();
      return cleanup;
    }
  }, [showContent, contentItem.type]);

  // Render content based on type
  const renderContent = () => {
    if (!showContent) {
      return (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-epu-primary"></div>
        </div>
      );
    }

    switch (contentItem.type) {
      case "video":
        return (
          <div className="space-y-4">
            <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
              {contentItem.imageUrl ? (
                <img 
                  src={contentItem.imageUrl} 
                  alt={contentItem.title} 
                  className="w-full h-full object-cover opacity-50"
                />
              ) : (
                <div className="w-full h-full bg-slate-800"></div>
              )}
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Play size={30} className="text-white ml-1" />
                </div>
              </div>
              
              {videoProgress > 0 && videoProgress < 100 && (
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <Progress value={videoProgress} className="h-1" />
                </div>
              )}
            </div>
            
            <div className="prose dark:prose-invert max-w-none">
              <h2>{contentItem.title}</h2>
              <p>
                Video bài giảng này sẽ giúp bạn hiểu rõ về {contentItem.title.toLowerCase()}. 
                Hãy xem hết video để tiếp tục với nội dung tiếp theo.
              </p>
            </div>
          </div>
        );
        
      case "text":
        return (
          <div className="prose dark:prose-invert max-w-none">
            <h2>{contentItem.title}</h2>
            <p>
              Tài liệu này giải thích chi tiết về {contentItem.title.toLowerCase()}.
              Dưới đây là nội dung bài học:
            </p>
            <h3>Giới thiệu</h3>
            <p>
              Đây là phần nội dung giới thiệu về chủ đề {contentItem.title.toLowerCase()}.
              Chúng ta sẽ tìm hiểu về các khái niệm cơ bản, cách thức hoạt động và các ứng dụng thực tế.
            </p>
            <h3>Nội dung chính</h3>
            <p>
              Phần này sẽ đi sâu vào các khía cạnh kỹ thuật của {contentItem.title.toLowerCase()},
              bao gồm các nguyên lý, công thức và quy trình thực hiện.
            </p>
            <h3>Ví dụ thực tế</h3>
            <p>
              Sau đây là một số ví dụ thực tế về cách áp dụng kiến thức này vào công việc:
            </p>
            <ul>
              <li>Ví dụ 1: Ứng dụng trong phát triển phần mềm</li>
              <li>Ví dụ 2: Ứng dụng trong phân tích dữ liệu</li>
              <li>Ví dụ 3: Ứng dụng trong tối ưu hóa hệ thống</li>
            </ul>
          </div>
        );
        
      case "quiz":
        return (
          <Link to={`/courses/${courseId}/quiz/${contentItem.id}`}>
            <Card className="p-6 hover:border-epu-primary transition-colors duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                    <HelpCircle size={24} className="text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{contentItem.title}</h3>
                    <p className="text-sm text-muted-foreground">Làm bài kiểm tra để đánh giá kiến thức</p>
                  </div>
                </div>
                <Button variant="outline" className="gap-2">
                  Bắt đầu làm bài <ChevronRight size={16} />
                </Button>
              </div>
            </Card>
          </Link>
        );
        
      case "assignment":
        return (
          <div className="space-y-4">
            <Card className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                  <FileText size={24} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-lg">{contentItem.title}</h3>
                    <p className="text-sm text-muted-foreground">Hoàn thành bài tập này để tiếp tục</p>
                  </div>
                  
                  <div className="prose dark:prose-invert max-w-none">
                    <h4>Mô tả bài tập</h4>
                    <p>
                      Trong bài tập này, bạn cần áp dụng kiến thức đã học để giải quyết một số bài toán thực tế.
                      Hãy làm theo các hướng dẫn dưới đây và nộp kết quả của bạn.
                    </p>
                    
                    <h4>Yêu cầu</h4>
                    <ol>
                      <li>Phân tích vấn đề được cung cấp</li>
                      <li>Đề xuất giải pháp phù hợp</li>
                      <li>Triển khai giải pháp và trình bày kết quả</li>
                    </ol>
                    
                    <h4>Tiêu chí đánh giá</h4>
                    <ul>
                      <li>Độ chính xác của giải pháp</li>
                      <li>Tính hiệu quả và tối ưu</li>
                      <li>Khả năng trình bày và giải thích</li>
                    </ul>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button onClick={handleComplete}>
                      {completed ? "Đã hoàn thành" : "Đánh dấu đã hoàn thành"}
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        );
        
      default:
        return (
          <div className="text-center py-8">
            <p>Không hỗ trợ loại nội dung này</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <Button 
          variant="outline" 
          onClick={handlePrev}
          disabled={!prevContentId}
          className="gap-2"
        >
          <ChevronLeft size={16} /> Trước
        </Button>
        
        <div className="flex items-center gap-2">
          {contentItem.type === "video" && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {videoProgress < 100 ? "Đang xem..." : "Đã xem"}
              </span>
              <Progress value={videoProgress} className="w-24 h-2" />
            </div>
          )}
          
          {completed ? (
            <span className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
              <CheckCircle size={16} /> Đã hoàn thành
            </span>
          ) : contentItem.type !== "video" && contentItem.type !== "quiz" ? (
            <Button size="sm" onClick={handleComplete}>
              Đánh dấu hoàn thành
            </Button>
          ) : null}
        </div>
        
        <Button 
          variant="outline" 
          onClick={handleNext}
          className="gap-2"
        >
          Tiếp <ChevronRight size={16} />
        </Button>
      </div>
      
      <div className="min-h-[400px]">
        {renderContent()}
      </div>
    </div>
  );
};

export default LessonContentViewer;
