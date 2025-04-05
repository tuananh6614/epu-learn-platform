
import React, { useState } from "react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Book, 
  Video, 
  FileText, 
  CheckCircle, 
  Circle, 
  Clock, 
  LockClosed,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";

// Types for our course structure
export type ContentItemType = {
  id: number;
  title: string;
  type: 'video' | 'text' | 'quiz' | 'assignment';
  duration?: string;
  completed?: boolean;
  locked?: boolean;
  videoUrl?: string;
  imageUrl?: string;
};

export type LessonType = {
  id: number;
  title: string;
  description?: string;
  duration?: string;
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

export type CourseContentProps = {
  chapters: ChapterType[];
  onContentItemClick: (chapterId: number, lessonId: number, contentItem: ContentItemType) => void;
  currentProgress?: number; // 0-100
};

const CourseContent: React.FC<CourseContentProps> = ({ 
  chapters, 
  onContentItemClick,
  currentProgress = 0
}) => {
  const [expandedLesson, setExpandedLesson] = useState<number | null>(null);
  const [openedChapter, setOpenedChapter] = useState<string | null>("chapter-0");

  // Calculate total durations and completion stats
  const totalLessons = chapters.reduce((acc, chapter) => 
    acc + chapter.lessons.length, 0);
  
  const completedLessons = chapters.reduce((acc, chapter) => 
    acc + chapter.lessons.filter(lesson => lesson.completed).length, 0);

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video size={16} className="text-blue-500" />;
      case 'text':
        return <FileText size={16} className="text-green-500" />;
      case 'quiz':
        return <Book size={16} className="text-amber-500" />;
      case 'assignment':
        return <FileText size={16} className="text-purple-500" />;
      default:
        return <FileText size={16} />;
    }
  };

  const handleLessonClick = (lessonId: number) => {
    setExpandedLesson(expandedLesson === lessonId ? null : lessonId);
  };

  const lessonContentAnimation = {
    initial: { opacity: 0, height: 0 },
    animate: { opacity: 1, height: "auto" },
    exit: { opacity: 0, height: 0 }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-md">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <h3 className="text-xl font-bold mb-2">Nội dung khóa học</h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">
            {completedLessons}/{totalLessons} bài học đã hoàn thành
          </span>
          <span className="text-sm font-medium text-epu-primary dark:text-epu-accent">
            {currentProgress}% hoàn thành
          </span>
        </div>
        <Progress value={currentProgress} className="h-2" />
      </div>

      <Accordion
        type="single"
        collapsible
        value={openedChapter}
        onValueChange={setOpenedChapter}
        className="w-full"
      >
        {chapters.map((chapter, chapterIndex) => (
          <AccordionItem 
            key={`chapter-${chapter.id}`} 
            value={`chapter-${chapterIndex}`}
            className="border-b border-slate-200 dark:border-slate-700"
          >
            <AccordionTrigger className="px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <div className="flex items-center text-left">
                <div className="w-6 h-6 rounded-full bg-epu-primary/10 dark:bg-epu-accent/20 flex items-center justify-center mr-3">
                  {chapter.completed ? (
                    <CheckCircle size={16} className="text-green-500" />
                  ) : (
                    <span className="text-sm font-medium">{chapterIndex + 1}</span>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-base">{chapter.title}</h4>
                  {chapter.description && (
                    <p className="text-sm text-muted-foreground">{chapter.description}</p>
                  )}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-0">
              <div className="space-y-1 pl-8 pr-4">
                {chapter.lessons.map((lesson, lessonIndex) => (
                  <div key={`lesson-${lesson.id}`} className="border-l-2 border-slate-200 dark:border-slate-700 pl-4 mb-3">
                    <div 
                      className={`flex items-start justify-between p-3 rounded-lg cursor-pointer ${
                        expandedLesson === lesson.id 
                          ? 'bg-slate-100 dark:bg-slate-800' 
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                      }`}
                      onClick={() => handleLessonClick(lesson.id)}
                    >
                      <div className="flex items-start">
                        <div className="mt-0.5 mr-3">
                          {lesson.completed ? (
                            <CheckCircle size={16} className="text-green-500" />
                          ) : lesson.locked ? (
                            <LockClosed size={16} className="text-amber-500" />
                          ) : (
                            <Circle size={16} className="text-slate-400" />
                          )}
                        </div>
                        <div>
                          <h5 className="font-medium text-sm">{lessonIndex + 1}. {lesson.title}</h5>
                          {lesson.description && (
                            <p className="text-xs text-muted-foreground mt-1">{lesson.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {lesson.duration && (
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock size={12} className="mr-1" />
                            <span>{lesson.duration}</span>
                          </div>
                        )}
                        <ChevronRight size={16} className={`text-muted-foreground transition-transform ${
                          expandedLesson === lesson.id ? 'rotate-90' : ''
                        }`} />
                      </div>
                    </div>
                    
                    <AnimatePresence>
                      {expandedLesson === lesson.id && (
                        <motion.div
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          variants={lessonContentAnimation}
                          transition={{ duration: 0.3 }}
                          className="pl-6 pr-2 pb-2 overflow-hidden"
                        >
                          <div className="space-y-2 pt-2">
                            {lesson.contentItems.map((item) => (
                              <motion.div
                                key={`content-${item.id}`}
                                whileHover={{ x: 5 }}
                                className={`flex items-center justify-between p-2 rounded-md ${
                                  item.locked 
                                    ? 'bg-slate-50 dark:bg-slate-800/30 opacity-70' 
                                    : 'bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer'
                                }`}
                                onClick={() => !item.locked && onContentItemClick(chapter.id, lesson.id, item)}
                              >
                                <div className="flex items-center">
                                  <div className="mr-2">
                                    {getContentIcon(item.type)}
                                  </div>
                                  <span className="text-sm">{item.title}</span>
                                  
                                  {item.type === 'video' && item.imageUrl && (
                                    <div className="w-8 h-8 ml-2 rounded overflow-hidden shadow-sm">
                                      <img 
                                        src={item.imageUrl} 
                                        alt={item.title} 
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  )}
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <Badge variant={item.completed ? "default" : "outline"} className={
                                    item.type === 'video' ? 'bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/20' :
                                    item.type === 'text' ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20' :
                                    item.type === 'quiz' ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20' :
                                    'bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 border-purple-500/20'
                                  }>
                                    {item.type === 'video' ? 'Video' : 
                                     item.type === 'text' ? 'Bài đọc' : 
                                     item.type === 'quiz' ? 'Quiz' : 'Bài tập'}
                                  </Badge>
                                  
                                  {item.duration && (
                                    <span className="text-xs text-muted-foreground">{item.duration}</span>
                                  )}
                                  
                                  {item.locked && (
                                    <LockClosed size={14} className="text-amber-500" />
                                  )}
                                  
                                  {item.completed && (
                                    <CheckCircle size={14} className="text-green-500" />
                                  )}
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default CourseContent;
