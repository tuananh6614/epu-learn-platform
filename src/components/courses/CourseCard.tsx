
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users } from "lucide-react";

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
  return (
    <Link to={`/courses/${course.id}`}>
      <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-slate-300 group">
        <div className="aspect-video relative overflow-hidden">
          <img
            src={course.thumbnail || "/placeholder.svg"}
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Glassmorphism overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
          
          {course.enrolled && (
            <Badge className="absolute top-2 right-2 bg-epu-primary shadow-md">Đã đăng ký</Badge>
          )}
          {course.specialization && (
            <Badge variant="outline" className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm shadow-sm border-0 font-medium">
              {course.specialization === "CNTT" && "Công nghệ thông tin"}
              {course.specialization === "DTVT" && "Điện tử viễn thông"}
              {course.specialization === "KTDL" && "Kỹ thuật điện lạnh"}
              {course.specialization === "KTDK" && "Kỹ thuật điều khiển"}
              {course.specialization === "ATTT" && "An toàn thông tin"}
            </Badge>
          )}
        </div>
        <CardContent className="pt-5 pb-2">
          <h3 className="font-bold text-lg line-clamp-2 mb-2 group-hover:text-epu-primary transition-colors duration-300">
            {course.title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-3">{course.description}</p>
        </CardContent>
        <CardFooter className="flex justify-between text-sm text-muted-foreground pt-0">
          <div className="flex items-center gap-1">
            <BookOpen size={14} className="text-epu-primary" />
            <span>{course.chapterCount || 0} chương</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={14} className="text-epu-primary" />
            <span>{course.enrollmentCount || 0} học viên</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default CourseCard;
