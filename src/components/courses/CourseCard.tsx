
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, ChevronRight, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

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

  // Styling based on specialization
  const getSpecializationStyle = (code: string) => {
    const styles: Record<string, { bg: string, border: string, text: string }> = {
      "CNTT": {
        bg: "bg-blue-100/80 dark:bg-blue-900/30",
        border: "border-blue-300 dark:border-blue-700",
        text: "text-blue-800 dark:text-blue-300"
      },
      "DTVT": {
        bg: "bg-purple-100/80 dark:bg-purple-900/30",
        border: "border-purple-300 dark:border-purple-700",
        text: "text-purple-800 dark:text-purple-300"
      },
      "KTDL": {
        bg: "bg-cyan-100/80 dark:bg-cyan-900/30",
        border: "border-cyan-300 dark:border-cyan-700",
        text: "text-cyan-800 dark:text-cyan-300"
      },
      "KTDK": {
        bg: "bg-emerald-100/80 dark:bg-emerald-900/30",
        border: "border-emerald-300 dark:border-emerald-700",
        text: "text-emerald-800 dark:text-emerald-300"
      },
      "ATTT": {
        bg: "bg-red-100/80 dark:bg-red-900/30",
        border: "border-red-300 dark:border-red-700",
        text: "text-red-800 dark:text-red-300"
      }
    };
    return styles[code] || { bg: "bg-gray-100/80 dark:bg-gray-800/80", border: "border-gray-300 dark:border-gray-700", text: "text-gray-800 dark:text-gray-300" };
  };

  const style = course.specialization ? getSpecializationStyle(course.specialization) : { bg: "", border: "", text: "" };

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ 
          y: -8, 
          transition: { duration: 0.2, ease: "easeOut" },
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="h-full"
      >
        <Link to={`/courses/${course.id}`} className="block h-full">
          <Card className="h-full overflow-hidden relative group border border-transparent hover:border-epu-primary dark:hover:border-epu-accent transition-all duration-300 rounded-xl bg-white dark:bg-slate-900 shadow-md hover:shadow-xl">
            {/* Course thumbnail with gradient overlay */}
            <div className="relative h-44 overflow-hidden">
              <motion.div
                animate={isHovered ? { scale: 1.05, filter: "brightness(1.1)" } : { scale: 1, filter: "brightness(1)" }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="h-full w-full"
              >
                <img
                  src={course.thumbnail || "/placeholder.svg"}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              
              {/* Title overlay - shows on hover */}
              <motion.div 
                className="absolute inset-0 flex items-center justify-center p-4 z-10"
                initial={{ opacity: 0 }}
                animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.2 }}
                style={{ 
                  background: "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 100%)" 
                }}
              >
                <h3 className="text-xl font-bold text-white text-center drop-shadow-lg">
                  {course.title}
                </h3>
              </motion.div>
              
              {/* Gradient overlay - always visible */}
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/70 to-transparent opacity-80"></div>
              
              {/* Course status badges */}
              {course.enrolled && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge className="absolute top-2 right-2 bg-gradient-to-r from-green-500 to-teal-500 border-0 shadow-md text-white font-medium px-2 py-0.5">
                      Đã đăng ký
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>Bạn đã đăng ký khóa học này</p>
                  </TooltipContent>
                </Tooltip>
              )}
              
              {/* Specialization badge */}
              {course.specialization && (
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Badge 
                      variant="outline" 
                      className={`absolute bottom-2 left-2 backdrop-blur-sm border ${style.border} ${style.bg} ${style.text} text-xs font-medium px-2 py-0.5 hover:scale-105 transition-transform duration-300`}
                    >
                      {course.specialization}
                    </Badge>
                  </HoverCardTrigger>
                  <HoverCardContent side="right" className="w-60 p-3">
                    <h4 className="text-sm font-semibold">
                      {getSpecializationName(course.specialization)}
                    </h4>
                  </HoverCardContent>
                </HoverCard>
              )}
            </div>

            <CardContent className="p-3 pt-2.5 relative flex flex-col h-24">
              <h3 className="font-bold text-base line-clamp-2 group-hover:text-epu-primary dark:group-hover:text-epu-accent transition-colors duration-300">
                {course.title}
              </h3>
              
              {/* Stats pills */}
              <div className="flex flex-wrap gap-1.5 mt-auto">
                <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-2xs font-medium px-1.5 py-0.5 rounded-full flex items-center gap-1">
                  <BookOpen size={10} />
                  <span>{course.chapterCount || 0}</span>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-2xs font-medium px-1.5 py-0.5 rounded-full flex items-center gap-1">
                  <Users size={10} />
                  <span>{course.enrollmentCount || 0}</span>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 text-2xs font-medium px-1.5 py-0.5 rounded-full flex items-center gap-1">
                  <Clock size={10} />
                  <span>8h</span>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="p-0">
              <motion.div 
                className="w-full py-1.5 bg-gradient-to-r from-epu-primary to-epu-accent text-white rounded-b-lg font-medium flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-xs"
                initial={{ y: 10, opacity: 0 }}
                animate={isHovered ? { y: 0, opacity: 1 } : { y: 10, opacity: 0 }}
                transition={{ duration: 0.2, delay: 0.05 }}
              >
                Xem chi tiết <ChevronRight size={14} />
              </motion.div>
            </CardFooter>
            
            {/* Border glow effect on hover */}
            <motion.div
              className="absolute inset-0 rounded-xl pointer-events-none"
              initial={{ opacity: 0 }}
              animate={isHovered ? { 
                opacity: 1, 
                boxShadow: "0 0 0 1px rgba(26, 54, 93, 0.5), 0 0 10px 3px rgba(26, 54, 93, 0.25)"
              } : { 
                opacity: 0,
                boxShadow: "none"
              }}
              transition={{ duration: 0.3 }}
            />
          </Card>
        </Link>
      </motion.div>
    </TooltipProvider>
  );
};

export default CourseCard;
