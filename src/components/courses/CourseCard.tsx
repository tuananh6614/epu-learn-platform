
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

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
    const map = {
      "CNTT": "Công nghệ thông tin",
      "DTVT": "Điện tử viễn thông",
      "KTDL": "Kỹ thuật điện lạnh",
      "KTDK": "Kỹ thuật điều khiển",
      "ATTT": "An toàn thông tin"
    };
    return map[code] || code;
  };

  return (
    <motion.div
      whileHover={{ y: -8, transition: { duration: 0.3, ease: "easeOut" } }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link to={`/courses/${course.id}`}>
        <Card className="h-full overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-700 hover:border-epu-primary dark:hover:border-epu-accent group bg-white dark:bg-slate-900">
          <div className="aspect-video relative overflow-hidden">
            <motion.img
              src={course.thumbnail || "/placeholder.svg"}
              alt={course.title}
              className="w-full h-full object-cover"
              animate={isHovered ? { scale: 1.05 } : { scale: 1 }}
              transition={{ duration: 0.4 }}
            />
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-70"></div>
            
            {course.enrolled && (
              <Badge className="absolute top-2 right-2 bg-epu-primary shadow-md">Đã đăng ký</Badge>
            )}
            {course.specialization && (
              <Badge variant="outline" className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm shadow-sm border-0 font-medium">
                {getSpecializationName(course.specialization)}
              </Badge>
            )}
          </div>
          <CardContent className="pt-5 pb-2">
            <h3 className="font-bold text-lg line-clamp-2 mb-2 group-hover:text-epu-primary dark:group-hover:text-epu-accent transition-colors duration-300">
              {course.title}
            </h3>
            <p className="text-muted-foreground text-sm line-clamp-3">{course.description}</p>
          </CardContent>
          <CardFooter className="flex justify-between text-sm text-muted-foreground pt-0">
            <div className="flex items-center gap-1">
              <BookOpen size={14} className="text-epu-primary dark:text-epu-accent" />
              <span>{course.chapterCount || 0} chương</span>
            </div>
            <div className="flex items-center gap-1">
              <Users size={14} className="text-epu-primary dark:text-epu-accent" />
              <span>{course.enrollmentCount || 0} học viên</span>
            </div>
          </CardFooter>
          
          {/* "View details" button appears on hover */}
          <motion.div 
            className="absolute bottom-0 left-0 right-0 h-0 bg-gradient-to-r from-epu-primary to-epu-accent overflow-hidden flex items-center justify-center text-white font-medium"
            animate={isHovered ? { height: 40, opacity: 1 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
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
