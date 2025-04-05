
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type CourseType = {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  chapterCount?: number;
  lessonCount?: number;
  enrollmentCount?: number;
  enrolled?: boolean;
  specialization?: string;
};

const CourseCard = ({ course }: { course: CourseType }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showHoverCard, setShowHoverCard] = useState(false);
  
  // Auto-dismiss hover card after 3 seconds with burst animation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showHoverCard) {
      timer = setTimeout(() => {
        setShowHoverCard(false);
      }, 3000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showHoverCard]);

  // Map specialization codes to full names
  const getSpecializationName = (code: string) => {
    const map: Record<string, string> = {
      "CNTT": "Công nghệ thông tin",
      "DTVT": "Điện tử viễn thông",
      "KTDL": "Kỹ thuật điện lạnh",
      "KTDK": "Kỹ thuật điều khiển",
      "ATTT": "An toàn thông tin"
    };
    return map[code] || code;
  };

  // Animation variants for hover card burst effect
  const burstVariants = {
    visible: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.2 }
    },
    exit: {
      scale: 1.2,
      opacity: 0,
      transition: { 
        duration: 0.3,
        scale: { duration: 0.3, ease: [0.1, 1.3, 0.9, 1] } // elastic bounce effect
      }
    }
  };

  return (
    <motion.div
      whileHover={{ 
        y: -5, 
        transition: { duration: 0.2, ease: "easeOut" } 
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="h-full"
    >
      <Link to={`/courses/${course.id}`} className="h-full block">
        <Card className="h-full overflow-hidden border border-slate-200 dark:border-slate-700 group bg-white dark:bg-slate-900 transition-all duration-200 shadow-sm hover:shadow-xl hover:border-epu-primary/50 dark:hover:border-epu-accent/50">
          <div className="aspect-video relative overflow-hidden">
            <motion.div 
              className="w-full h-full"
              animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <img
                src={course.thumbnail || "/placeholder.svg"}
                alt={course.title}
                className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-110"
              />
            </motion.div>
            
            {/* Gradient overlay with better visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-90"></div>
            
            {course.enrolled && (
              <Badge className="absolute top-2 right-2 bg-epu-primary text-white shadow-md z-10 transition-all duration-300 group-hover:scale-105 animate-none">
                Đã đăng ký
              </Badge>
            )}
            
            {/* Fixed position for specialization badge to avoid overlay with view details */}
            {course.specialization && (
              <div className="absolute top-2 left-2 z-20">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge 
                        variant="outline" 
                        className="bg-white/90 backdrop-blur-sm shadow-sm border-0 font-medium transition-all duration-300 group-hover:bg-white/95 animate-none hover:cursor-help"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowHoverCard(true);
                        }}
                      >
                        {course.specialization}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">{getSpecializationName(course.specialization)}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {/* Animated hover card with burst effect */}
                <AnimatePresence>
                  {showHoverCard && (
                    <motion.div 
                      className="absolute top-8 left-0 z-30 bg-white dark:bg-slate-800 rounded-md p-2 shadow-lg border border-slate-200 dark:border-slate-700 text-sm min-w-44"
                      initial={{ opacity: 0, scale: 0.9, y: -5 }}
                      animate="visible"
                      exit="exit"
                      variants={burstVariants}
                    >
                      <p>Chuyên ngành: {getSpecializationName(course.specialization)}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
            
            {/* Course title overlay for better visibility */}
            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
              <h3 className="font-bold text-base line-clamp-2 text-white group-hover:text-epu-accent dark:group-hover:text-epu-accent transition-colors duration-300">
                {course.title}
              </h3>
            </div>
          </div>
          
          <CardContent className="pt-3 pb-0">
            <p className="text-muted-foreground text-sm line-clamp-2">{course.description}</p>
          </CardContent>
          
          <CardFooter className="flex justify-between text-sm text-muted-foreground pt-2 pb-3">
            <div className="flex items-center gap-1">
              <BookOpen size={14} className="text-epu-primary dark:text-epu-accent" />
              <span>{course.chapterCount || 0} chương</span>
            </div>
            <div className="flex items-center gap-1">
              <Users size={14} className="text-epu-primary dark:text-epu-accent" />
              <span>{course.enrollmentCount || 0} học viên</span>
            </div>
          </CardFooter>
          
          {/* "View details" button with improved positioning to avoid overlap */}
          <motion.div 
            className="absolute bottom-0 left-0 right-0 h-0 bg-gradient-to-r from-epu-primary to-epu-accent overflow-hidden flex items-center justify-center text-white font-medium shadow-md"
            animate={isHovered ? { height: 36, opacity: 1 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <span className="flex items-center">
              Xem chi tiết <ChevronRight size={16} className="ml-1" />
            </span>
          </motion.div>
        </Card>
      </Link>
    </motion.div>
  );
};

export default CourseCard;
