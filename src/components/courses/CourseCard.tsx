
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
        bg: "bg-blue-100 dark:bg-blue-900/30",
        border: "border-blue-300 dark:border-blue-700",
        text: "text-blue-800 dark:text-blue-300"
      },
      "DTVT": {
        bg: "bg-purple-100 dark:bg-purple-900/30",
        border: "border-purple-300 dark:border-purple-700",
        text: "text-purple-800 dark:text-purple-300"
      },
      "KTDL": {
        bg: "bg-cyan-100 dark:bg-cyan-900/30",
        border: "border-cyan-300 dark:border-cyan-700",
        text: "text-cyan-800 dark:text-cyan-300"
      },
      "KTDK": {
        bg: "bg-emerald-100 dark:bg-emerald-900/30",
        border: "border-emerald-300 dark:border-emerald-700",
        text: "text-emerald-800 dark:text-emerald-300"
      },
      "ATTT": {
        bg: "bg-red-100 dark:bg-red-900/30",
        border: "border-red-300 dark:border-red-700",
        text: "text-red-800 dark:text-red-300"
      }
    };
    return styles[code] || { bg: "bg-gray-100 dark:bg-gray-800", border: "border-gray-300 dark:border-gray-700", text: "text-gray-800 dark:text-gray-300" };
  };

  const style = course.specialization ? getSpecializationStyle(course.specialization) : { bg: "", border: "", text: "" };

  return (
    <TooltipProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ 
          y: -12, 
          transition: { duration: 0.3, ease: "easeOut" },
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        className="aspect-[3/4] h-full"
      >
        <Link to={`/courses/${course.id}`} className="block h-full">
          <Card className="h-full overflow-hidden relative group border-2 border-transparent hover:border-epu-primary dark:hover:border-epu-accent transition-all duration-500 rounded-xl bg-white dark:bg-slate-900 shadow-lg hover:shadow-2xl hover:shadow-epu-primary/10 dark:hover:shadow-epu-accent/20">
            <div className="aspect-video relative overflow-hidden">
              <motion.div
                animate={isHovered ? { scale: 1.08, filter: "brightness(1.1)" } : { scale: 1, filter: "brightness(1)" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="h-full w-full"
              >
                <img
                  src={course.thumbnail || "/placeholder.svg"}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500"></div>
              
              {/* Course status badges */}
              <div className="absolute top-0 right-0 p-3 flex flex-col gap-2 items-end">
                {course.enrolled && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge className="bg-gradient-to-r from-green-500 to-teal-500 border-0 shadow-md text-white font-medium px-2.5 py-1">
                        Đã đăng ký
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p>Bạn đã đăng ký khóa học này</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
              
              {/* Specialization badge */}
              {course.specialization && (
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <Badge 
                      variant="outline" 
                      className={`absolute bottom-3 left-3 backdrop-blur-md shadow-sm border-2 ${style.border} ${style.bg} ${style.text} font-medium px-2.5 py-1 hover:scale-105 transition-transform duration-300`}
                    >
                      {getSpecializationName(course.specialization)}
                    </Badge>
                  </HoverCardTrigger>
                  <HoverCardContent side="right" className="w-80 p-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold">Chuyên ngành: {getSpecializationName(course.specialization)}</h4>
                      <p className="text-xs text-muted-foreground">
                        Khóa học này thuộc chuyên ngành {getSpecializationName(course.specialization)}.
                        Xem thêm các khóa học cùng chuyên ngành.
                      </p>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              )}

              {/* Course title overlay - appears on hover */}
              <motion.div 
                className="absolute inset-0 flex items-center justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                initial={{ opacity: 0 }}
                animate={isHovered ? { opacity: 1 } : { opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-xl font-bold text-white text-center line-clamp-3 drop-shadow-lg">
                  {course.title}
                </h3>
              </motion.div>
            </div>

            <CardContent className="pt-6 pb-2 relative">
              <h3 className="font-bold text-lg line-clamp-2 mb-3 group-hover:text-epu-primary dark:group-hover:text-epu-accent transition-colors duration-500">
                {course.title}
              </h3>
              <p className="text-muted-foreground text-sm line-clamp-3 mb-3 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-500">
                {course.description}
              </p>
              
              {/* Stats pills */}
              <div className="flex flex-wrap gap-2 mt-auto">
                <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1.5">
                  <BookOpen size={12} />
                  <span>{course.chapterCount || 0} chương</span>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1.5">
                  <Users size={12} />
                  <span>{course.enrollmentCount || 0} học viên</span>
                </div>
                <div className="bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1.5">
                  <Clock size={12} />
                  <span>8 giờ học</span>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="pt-0 pb-4 px-6">
              <motion.div 
                className="w-full mt-2 bg-gradient-to-r from-epu-primary to-epu-accent text-white py-2 rounded-lg font-medium flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                initial={{ y: 20, opacity: 0 }}
                animate={isHovered ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                Xem chi tiết <ChevronRight size={16} />
              </motion.div>
            </CardFooter>
            
            {/* Border glow effect on hover */}
            <motion.div
              className="absolute inset-0 rounded-xl pointer-events-none"
              initial={{ opacity: 0 }}
              animate={isHovered ? { 
                opacity: 1, 
                boxShadow: "0 0 0 2px rgba(26, 54, 93, 0.5), 0 0 15px 5px rgba(26, 54, 93, 0.25)"
              } : { 
                opacity: 0,
                boxShadow: "none"
              }}
              transition={{ duration: 0.5 }}
            />
          </Card>
        </Link>
      </motion.div>
    </TooltipProvider>
  );
};

export default CourseCard;
