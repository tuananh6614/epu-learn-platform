
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { ChevronLeft, BookOpen, ListChecks } from "lucide-react";
import { mockCourses } from "@/lib/utils";
import LessonContentViewer from "@/components/courses/LessonContentViewer";
import { ChapterType, ContentItemType } from "@/components/courses/CourseContent";

const LessonPage = () => {
  const { courseId, contentId } = useParams<{ courseId: string, contentId: string }>();
  const numericCourseId = Number(courseId);
  const numericContentId = Number(contentId);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [currentContent, setCurrentContent] = useState<ContentItemType | null>(null);
  const [nextContentId, setNextContentId] = useState<number | null>(null);
  const [prevContentId, setPrevContentId] = useState<number | null>(null);
  const [courseChapters, setCourseChapters] = useState<ChapterType[]>([]);
  const [currentProgress, setCurrentProgress] = useState(0);
  
  const course = mockCourses.find(c => c.id === numericCourseId);
  
  // Mock course chapters data - in a real app, this would come from an API
  useEffect(() => {
    // This is simplified just for the example
    const mockChapters: ChapterType[] = [
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
                imageUrl: "/lovable-uploads/7e7b9c28-3bdf-4ddb-a68a-179dac93a112.png"
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
                imageUrl: "/lovable-uploads/7e7b9c28-3bdf-4ddb-a68a-179dac93a112.png"
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
                imageUrl: "/lovable-uploads/7e7b9c28-3bdf-4ddb-a68a-179dac93a112.png"
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
            contentItems: [
              {
                id: 3001,
                title: "Video bài giảng",
                type: "video",
                duration: "30:00",
                videoUrl: "https://example.com/video4",
                imageUrl: "/lovable-uploads/7e7b9c28-3bdf-4ddb-a68a-179dac93a112.png"
              },
              {
                id: 3002,
                title: "Tài liệu bổ sung",
                type: "text",
                duration: "15 phút"
              },
              {
                id: 3003,
                title: "Bài kiểm tra cuối chương",
                type: "quiz",
                duration: "20 phút"
              }
            ]
          }
        ]
      }
    ];
    
    setCourseChapters(mockChapters);
    
    // Find the current content
    let foundContent: ContentItemType | null = null;
    let foundPrev: number | null = null;
    let foundNext: number | null = null;
    
    // Create a flat list of all content items
    const allContentItems: {content: ContentItemType, chapterId: number, lessonId: number}[] = [];
    
    mockChapters.forEach(chapter => {
      chapter.lessons.forEach(lesson => {
        lesson.contentItems.forEach(content => {
          allContentItems.push({
            content,
            chapterId: chapter.id,
            lessonId: lesson.id
          });
        });
      });
    });
    
    // Find the current content and its neighbors
    const currentIndex = allContentItems.findIndex(item => item.content.id === numericContentId);
    
    if (currentIndex !== -1) {
      foundContent = allContentItems[currentIndex].content;
      
      if (currentIndex > 0) {
        foundPrev = allContentItems[currentIndex - 1].content.id;
      }
      
      if (currentIndex < allContentItems.length - 1) {
        foundNext = allContentItems[currentIndex + 1].content.id;
      }
    }
    
    setCurrentContent(foundContent);
    setPrevContentId(foundPrev);
    setNextContentId(foundNext);
    
    // Calculate progress
    const totalItems = allContentItems.length;
    const completedItems = allContentItems.filter(item => item.content.completed).length;
    setCurrentProgress(Math.round((completedItems / totalItems) * 100));
    
    setLoading(false);
  }, [numericContentId, courseId]);
  
  const handleContentComplete = () => {
    // Mark content as completed
    if (currentContent) {
      const updatedChapters = courseChapters.map(chapter => ({
        ...chapter,
        lessons: chapter.lessons.map(lesson => ({
          ...lesson,
          contentItems: lesson.contentItems.map(item => 
            item.id === numericContentId 
              ? { ...item, completed: true } 
              : item
          )
        }))
      }));
      
      setCourseChapters(updatedChapters);
      
      // Recalculate progress
      const allContentItems: {content: ContentItemType}[] = [];
      updatedChapters.forEach(chapter => {
        chapter.lessons.forEach(lesson => {
          lesson.contentItems.forEach(content => {
            allContentItems.push({ content });
          });
        });
      });
      
      const totalItems = allContentItems.length;
      const completedItems = allContentItems.filter(item => item.content.completed).length;
      setCurrentProgress(Math.round((completedItems / totalItems) * 100));
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
          <div className="h-80 bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
        </div>
      </div>
    );
  }
  
  if (!course || !currentContent) {
    return (
      <div className="container px-4 md:px-6 py-10 text-center">
        <h2 className="text-2xl font-bold mb-4">Không tìm thấy nội dung</h2>
        <p className="mb-6">Nội dung bạn đang tìm kiếm không tồn tại.</p>
        <Button onClick={handleBackToCourse}>
          Quay lại khóa học
        </Button>
      </div>
    );
  }
  
  return (
    <div className="container px-4 md:px-6 py-10">
      <div className="flex justify-between items-center mb-6">
        <Button 
          variant="outline" 
          onClick={handleBackToCourse}
          className="gap-2"
        >
          <ChevronLeft size={16} /> Quay lại khóa học
        </Button>
        
        <div className="flex gap-4">
          <Link to={`/courses/${courseId}`}>
            <Button variant="outline" className="gap-2">
              <BookOpen size={16} /> Nội dung khóa học
            </Button>
          </Link>
          
          <Link to={`/courses/${courseId}/exam`}>
            <Button variant="outline" className="gap-2">
              <ListChecks size={16} /> Bài kiểm tra tổng quát
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <Card className="p-6">
            <LessonContentViewer 
              contentItem={currentContent}
              nextContentId={nextContentId}
              prevContentId={prevContentId}
              onComplete={handleContentComplete}
              courseId={numericCourseId}
            />
          </Card>
        </div>
        
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <Card className="p-6 mb-6">
              <h3 className="font-bold text-lg mb-4">Tiến độ khóa học</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Hoàn thành</span>
                  <span className="font-medium">{currentProgress}%</span>
                </div>
                <Progress value={currentProgress} className="h-2" />
              </div>
            </Card>
            
            <Card className="p-4">
              <h3 className="font-medium mb-3">Nội dung khóa học</h3>
              <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
                {courseChapters.map((chapter) => (
                  <div key={chapter.id} className="space-y-2">
                    <div className="font-medium text-sm">{chapter.title}</div>
                    <ul className="space-y-1 ml-4">
                      {chapter.lessons.flatMap(lesson => 
                        lesson.contentItems.map(item => (
                          <li key={item.id}>
                            <Link 
                              to={`/courses/${courseId}/learn/${item.id}`}
                              className={`text-xs flex items-center gap-1 py-1 px-2 rounded-sm ${
                                item.id === numericContentId 
                                  ? 'bg-epu-primary/10 font-medium text-epu-primary'
                                  : item.completed
                                  ? 'text-green-600 dark:text-green-400'
                                  : 'text-muted-foreground'
                              }`}
                            >
                              {item.completed && item.id !== numericContentId && (
                                <div className="w-3 h-3 rounded-full bg-green-600 dark:bg-green-400"></div>
                              )}
                              <span className="truncate">{item.title}</span>
                            </Link>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPage;
