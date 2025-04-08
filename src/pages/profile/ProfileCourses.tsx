
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { ArrowUpRight, BookOpenCheck, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EnrolledCourse {
  course_id: number;
  title: string;
  description: string | null;
  thumbnail: string | null;
  progress_percent: number;
  current_lesson_id: number | null;
  current_lesson_title: string | null;
  enrolled_date: string;
}

const ProfileCourses = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchEnrolledCourses();
    }
  }, [user]);

  const fetchEnrolledCourses = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const token = localStorage.getItem("epu_token");
      
      if (!token) {
        setError("Không thể xác thực. Vui lòng đăng nhập lại.");
        return;
      }
      
      const response = await axios.get(
        `http://localhost:5000/api/courses/user/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setEnrolledCourses(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching enrolled courses:", err);
      setError("Không thể tải danh sách khóa học đã đăng ký");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCourseClick = (courseId: number, lessonId: number | null) => {
    if (lessonId) {
      navigate(`/courses/${courseId}/learn/${lessonId}`);
    } else {
      navigate(`/courses/${courseId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="h-48 animate-pulse bg-muted" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={fetchEnrolledCourses}>Thử lại</Button>
      </div>
    );
  }

  return (
    <div>
      {enrolledCourses.length > 0 ? (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Khoá học đã đăng ký</h2>
          
          <div className="grid grid-cols-1 gap-6">
            {enrolledCourses.map((course) => (
              <div 
                key={course.course_id} 
                className="relative border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleCourseClick(course.course_id, course.current_lesson_id)}
              >
                <div className="absolute top-2 right-2 z-10 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                  <BookOpenCheck size={14} className="mr-1" />
                  Đã đăng ký
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 w-full h-full">
                  <div className="md:col-span-1 h-40 md:h-full">
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${course.thumbnail || "/placeholder.svg"})`,
                      }}
                    />
                  </div>
                  <div className="md:col-span-3 p-4">
                    <h3 className="font-semibold text-lg mb-2">
                      {course.title}
                    </h3>
                    <p className="text-muted-foreground line-clamp-2 mb-4">
                      {course.description || "Không có mô tả"}
                    </p>
                    <div className="flex justify-between items-end">
                      <div className="text-sm text-muted-foreground">
                        <span>Tiến độ: {course.progress_percent}%</span>
                        <div className="w-32 h-2 bg-gray-200 rounded-full mt-1">
                          <div 
                            className="h-2 bg-epu-primary rounded-full"
                            style={{ width: `${course.progress_percent}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex items-center text-epu-primary font-medium">
                        {course.current_lesson_id ? (
                          <>
                            Tiếp tục học
                            <ArrowUpRight size={16} className="ml-1" />
                          </>
                        ) : (
                          <>
                            Bắt đầu học
                            <ArrowUpRight size={16} className="ml-1" />
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <BookOpenCheck size={64} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Bạn chưa đăng ký khoá học nào</h3>
          <p className="text-muted-foreground mb-6">
            Hãy khám phá các khoá học chất lượng trong danh sách khoá học
          </p>
          <Button onClick={() => navigate("/courses")}>
            <Bookmark className="mr-2 h-4 w-4" />
            Khám phá khoá học
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProfileCourses;
