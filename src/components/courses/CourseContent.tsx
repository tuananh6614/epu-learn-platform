
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp, CheckCircle, Lock, Play, FileText, HelpCircle, Book } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

export type ContentItemType = {
  id: number;
  title: string;
  type: "video" | "text" | "quiz" | "assignment";
  duration: string;
  completed?: boolean;
  locked?: boolean;
  videoUrl?: string;
  imageUrl?: string;
};

export type LessonType = {
  id: number;
  title: string;
  description?: string;
  duration: string;
  completed?: boolean;
  locked?: boolean;
  contentItems: ContentItemType[];
};

export type ChapterType = {
  id: number;
  title: string;
  description?: string;
  completed?: boolean;
  lessons: LessonType[];
};

interface CourseContentProps {
  chapters: ChapterType[];
  currentProgress: number;
  onContentItemClick: (chapterId: number, lessonId: number, contentItem: ContentItemType) => void;
  courseId: number;
}

const CourseContent = ({ chapters, currentProgress, onContentItemClick, courseId }: CourseContentProps) => {
  const [openChapters, setOpenChapters] = useState<number[]>([1]); // First chapter open by default
  const [openLessons, setOpenLessons] = useState<number[]>([]);
  const navigate = useNavigate();
  
  const toggleChapter = (chapterId: number) => {
    setOpenChapters(prev => 
      prev.includes(chapterId) 
        ? prev.filter(id => id !== chapterId) 
        : [...prev, chapterId]
    );
  };
  
  const toggleLesson = (lessonId: number) => {
    setOpenLessons(prev => 
      prev.includes(lessonId) 
        ? prev.filter(id => id !== lessonId) 
        : [...prev, lessonId]
    );
  };
  
  const getContentTypeIcon = (type: string, completed: boolean = false, locked: boolean = false) => {
    if (locked) return <Lock size={16} className="text-muted-foreground" />;
    if (completed) return <CheckCircle size={16} className="text-green-500" />;
    
    switch (type) {
      case 'video':
        return <Play size={16} className="text-epu-primary" />;
      case 'text':
        return <FileText size={16} className="text-epu-secondary" />;
      case 'quiz':
        return <HelpCircle size={16} className="text-orange-500" />;
      case 'assignment':
        return <Book size={16} className="text-blue-500" />;
      default:
        return <FileText size={16} />;
    }
  };

  const handleContentClick = (chapterId: number, lessonId: number, contentItem: ContentItemType) => {
    if (contentItem.locked) {
      onContentItemClick(chapterId, lessonId, contentItem);
      return;
    }
    
    // Redirect to the appropriate page based on content type
    if (contentItem.type === "quiz") {
      navigate(`/courses/${courseId}/quiz/${contentItem.id}`);
    } else {
      navigate(`/courses/${courseId}/learn/${contentItem.id}`);
    }
  };

  return (
    <div className="space-y-8">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-medium">Tiến độ khóa học</h3>
          <span className="text-sm font-medium">{currentProgress}%</span>
        </div>
        <Progress value={currentProgress} className="h-2" />
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Nội dung khóa học</h3>
        <Button 
          onClick={() => navigate(`/courses/${courseId}/exam`)}
          variant="outline"
        >
          Bài kiểm tra tổng quát
        </Button>
      </div>
      
      <div className="space-y-4">
        {chapters.map((chapter) => (
          <Collapsible 
            key={chapter.id} 
            open={openChapters.includes(chapter.id)}
            className="border rounded-md overflow-hidden"
          >
            <CollapsibleTrigger 
              className={`flex items-center justify-between w-full p-4 text-left 
                ${chapter.completed ? "bg-green-50 dark:bg-green-900/10" : "bg-slate-50 dark:bg-slate-800/50"}`}
              onClick={() => toggleChapter(chapter.id)}
            >
              <div className="flex items-center gap-2">
                {chapter.completed ? (
                  <CheckCircle size={18} className="text-green-500" />
                ) : (
                  <span className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center text-xs">
                    {chapter.id}
                  </span>
                )}
                <div>
                  <h3 className="font-medium">{chapter.title}</h3>
                  {chapter.description && (
                    <p className="text-sm text-muted-foreground">{chapter.description}</p>
                  )}
                </div>
              </div>
              {openChapters.includes(chapter.id) ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="bg-white dark:bg-slate-900">
              <div className="divide-y dark:divide-slate-800">
                {chapter.lessons.map((lesson) => (
                  <div key={lesson.id} className="px-4">
                    <Collapsible 
                      open={openLessons.includes(lesson.id)}
                    >
                      <CollapsibleTrigger 
                        className={`flex items-center justify-between w-full py-3 text-left 
                          ${lesson.completed ? "text-green-600 dark:text-green-400" : ""}
                          ${lesson.locked ? "text-muted-foreground" : ""}`}
                        onClick={() => toggleLesson(lesson.id)}
                      >
                        <div className="flex items-center gap-2">
                          {lesson.completed ? (
                            <CheckCircle size={16} className="text-green-500" />
                          ) : lesson.locked ? (
                            <Lock size={16} className="text-muted-foreground" />
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600"></div>
                          )}
                          <span className={lesson.locked ? "text-muted-foreground" : ""}>
                            {lesson.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          {openLessons.includes(lesson.id) ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          )}
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pl-6 pb-3 space-y-2">
                        {lesson.contentItems.map((item) => (
                          <Button 
                            key={item.id}
                            variant="ghost" 
                            className={`w-full justify-start py-2 h-auto text-left ${
                              item.completed ? "text-green-600 dark:text-green-400" : ""
                            } ${item.locked ? "text-muted-foreground cursor-not-allowed" : ""}
                            `}
                            disabled={item.locked}
                            onClick={() => handleContentClick(chapter.id, lesson.id, item)}
                          >
                            <div className="flex items-center gap-3 w-full">
                              <div className="w-6 h-6 flex items-center justify-center">
                                {getContentTypeIcon(item.type, item.completed, item.locked)}
                              </div>
                              <div className="flex-1 flex flex-col">
                                <span className={item.locked ? "text-muted-foreground" : ""}>
                                  {item.title}
                                </span>
                              </div>
                              {item.completed && (
                                <span className="text-xs py-0.5 px-2 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                  Hoàn thành
                                </span>
                              )}
                              {item.locked && (
                                <span className="text-xs py-0.5 px-2 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400">
                                  Bị khóa
                                </span>
                              )}
                            </div>
                          </Button>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
};

export default CourseContent;
