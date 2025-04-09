
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
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

  // Get specialization name (if available)
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

  // Handle the course click
  const handleCardClick = () => {
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
      <Card className="h-full overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 group bg-white dark:bg-slate-900/80 backdrop-blur-sm transition-all duration-300 shadow-md hover:shadow-2xl hover:border-blue-500/50 dark:hover:border-blue-400/50">
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
            <Badge className="absolute top-3 right-3 bg-blue-500 text-white shadow-lg z-10 transition-all duration-300 group-hover:scale-110 animate-pulse">
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
                    >
                      {course.specialization}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs font-medium">{getSpecializationName(course.specialization)}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
          
          {/* Enhanced course title with better styling and effects */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/95 via-black/80 to-transparent">
            <motion.h3 
              className="font-bold text-xl md:text-2xl line-clamp-2 text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.3)] tracking-wide group-hover:text-blue-400 dark:group-hover:text-blue-300 transition-colors duration-300"
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
            <BookOpen size={16} className="text-blue-500 dark:text-blue-400" />
            <span className="font-medium">{course.chapterCount || 0} chương</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users size={16} className="text-blue-500 dark:text-blue-400" />
            <span className="font-medium">{course.enrollmentCount || 0} học viên</span>
          </div>
        </CardFooter>
        
        {/* Enroll button when not already enrolled */}
        {!course.enrolled && onEnroll && (
          <div 
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-400 overflow-hidden flex items-center justify-center text-white font-medium shadow-lg h-0"
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
