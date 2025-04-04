
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
};

const CourseCard = ({ course }: { course: CourseType }) => {
  return (
    <Link to={`/courses/${course.id}`}>
      <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300">
        <div className="aspect-video relative overflow-hidden">
          <img
            src={course.thumbnail || "/placeholder.svg"}
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          {course.enrolled && (
            <Badge className="absolute top-2 right-2 bg-epu-primary">Đã đăng ký</Badge>
          )}
        </div>
        <CardContent className="pt-4">
          <h3 className="font-bold text-lg line-clamp-2 mb-2">{course.title}</h3>
          <p className="text-muted-foreground text-sm line-clamp-3">{course.description}</p>
        </CardContent>
        <CardFooter className="flex justify-between text-sm text-muted-foreground pt-0">
          <div className="flex items-center gap-1">
            <BookOpen size={14} />
            <span>{course.chapterCount || 0} chương</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={14} />
            <span>{course.enrollmentCount || 0} học viên</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default CourseCard;
