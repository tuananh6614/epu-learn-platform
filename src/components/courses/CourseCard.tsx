
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

interface CourseCardProps {
  course: CourseType;
  onClick?: () => void;
  onEnroll?: () => void;
}

const CourseCard = ({ course, onClick, onEnroll }: CourseCardProps) => {
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

  // Handle the course click
  const handleCardClick = (e: React.MouseEvent) => {
    if (onClick) {
      onClick();
    }
  };

  // Handle enroll button click (preventing event propagation)
  const handleEnrollClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEnroll) {
      onEnroll();
    }
  };

  return (
    <motion.div
      whileHover={{ 
        y: -8, 
        scale: 1.02,
        transition: { duration: 0.3, ease: "easeOut" } 
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="h-full"
      onClick={handleCardClick}
    >
      <Card className="h-full overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 group bg-white dark:bg-slate-900/80 backdrop-blur-sm transition-all duration-300 shadow-md hover:shadow-2xl hover:border-epu-primary/50 dark:hover:border-epu-accent/50">
        <div className="aspect-video relative overflow-hidden rounded-t-2xl">
          <motion.div 
            className="w-full h-full"
            animate={isHovered ? { scale: 1.08 } : { scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <img
              src={course.thumbnail || "/placeholder.svg"}
              alt={course.title}
              className="w-full h-full object-cover transition-all duration-300 group-hover:brightness-110 group-hover:contrast-110"
            />
          </motion.div>
          
          {/* Enhanced gradient overlay for better title visibility */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent"
            animate={isHovered ? { opacity: 0.9 } : { opacity: 0.7 }}
            transition={{ duration: 0.3 }}
          ></motion.div>
          
          {course.enrolled && (
            <Badge className="absolute top-3 right-3 bg-epu-primary text-white shadow-lg z-10 transition-all duration-300 group-hover:scale-110 animate-pulse">
              Đã đăng ký
            </Badge>
          )}
          
          {/* Better positioned specialization badge */}
          {course.specialization && (
            <div className="absolute top-3 left-3 z-20">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge 
                      variant="outline" 
                      className="bg-white/90 backdrop-blur-md shadow-md border-0 font-semibold px-3 py-1.5 transition-all duration-300 group-hover:bg-white/95 group-hover:scale-105 animate-none hover:cursor-help"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowHoverCard(true);
                      }}
                    >
                      {course.specialization}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs font-medium">{getSpecializationName(course.specialization)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {/* Animated hover card with burst effect */}
              <AnimatePresence>
                {showHoverCard && (
                  <motion.div 
                    className="absolute top-10 left-0 z-30 bg-white dark:bg-slate-800 rounded-xl p-3 shadow-xl border border-slate-200 dark:border-slate-700 text-sm min-w-44 backdrop-blur-md"
                    initial={{ opacity: 0, scale: 0.9, y: -5 }}
                    animate="visible"
                    exit="exit"
                    variants={burstVariants}
                  >
                    <p className="font-medium">Chuyên ngành: {getSpecializationName(course.specialization)}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
          
          {/* Enhanced course title with better styling and effects */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/95 via-black/80 to-transparent">
            <motion.h3 
              className="font-bold text-xl md:text-2xl line-clamp-2 text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.3)] tracking-wide group-hover:text-epu-accent dark:group-hover:text-epu-accent transition-colors duration-300"
              animate={isHovered ? { y: -3, textShadow: "0 0 8px rgba(255,255,255,0.5)" } : { y: 0, textShadow: "0 0 0px rgba(255,255,255,0)" }}
              transition={{ duration: 0.3 }}
            >
              {course.title}
            </motion.h3>
          </div>
        </div>
        
        <CardContent className="pt-4 pb-2">
          <motion.p 
            className="text-muted-foreground text-sm line-clamp-2 backdrop-blur-sm"
            animate={isHovered ? { opacity: 1 } : { opacity: 0.9 }}
          >
            {course.description}
          </motion.p>
        </CardContent>
        
        <CardFooter className="flex justify-between text-sm text-muted-foreground pt-2 pb-4 px-6 bg-slate-50/50 dark:bg-slate-800/50 backdrop-blur-sm">
          <div className="flex items-center gap-1.5">
            <BookOpen size={16} className="text-epu-primary dark:text-epu-accent" />
            <span className="font-medium">{course.chapterCount || 0} chương</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users size={16} className="text-epu-primary dark:text-epu-accent" />
            <span className="font-medium">{course.enrollmentCount || 0} học viên</span>
          </div>
        </CardFooter>
        
        {/* Enroll button when not already enrolled */}
        {!course.enrolled && onEnroll && (
          <div 
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-epu-primary via-blue-600 to-epu-accent overflow-hidden flex items-center justify-center text-white font-medium shadow-lg h-0"
            style={{ 
              height: isHovered ? '40px' : '0',
              opacity: isHovered ? 1 : 0,
              transition: 'height 0.3s ease-in-out, opacity 0.3s ease-in-out'
            }}
            onClick={handleEnrollClick}
          >
            <span className="flex items-center">
              Đăng ký ngay <ChevronRight size={18} className="ml-1" />
            </span>
          </div>
        )}
        
        {/* View details button when already enrolled */}
        {course.enrolled && (
          <motion.div 
            className="absolute bottom-0 left-0 right-0 h-0 bg-gradient-to-r from-green-500 via-green-600 to-teal-500 overflow-hidden flex items-center justify-center text-white font-medium shadow-lg"
            animate={isHovered ? { height: 40, opacity: 1 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <motion.span 
              className="flex items-center"
              animate={isHovered ? { x: 0, opacity: 1 } : { x: -10, opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              Xem chi tiết <ChevronRight size={18} className="ml-1" />
            </motion.span>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
};

export default CourseCard;
