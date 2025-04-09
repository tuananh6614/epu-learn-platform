
import { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Search, BookOpen, Filter } from "lucide-react";
import CourseCard from "@/components/courses/CourseCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

interface Course {
  course_id: number;
  title: string;
  description: string | null;
  thumbnail: string | null;
  major_id: number | null;
  major_name: string | null;
  created_at: string;
}

interface Major {
  major_id: number;
  major_name: string;
}

export default function CoursesPage() {
  const { toast } = useToast();
  const [courses, setCourses] = useState<Course[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMajor, setSelectedMajor] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    fetchCourses();
    fetchMajors();
  }, []);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("http://localhost:5000/api/courses");
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể tải danh sách khóa học"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMajors = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/majors");
      setMajors(response.data);
    } catch (error) {
      console.error("Error fetching majors:", error);
    }
  };

  const handleEnrollCourse = async (courseId: number) => {
    if (!user) {
      toast({
        title: "Chưa đăng nhập",
        description: "Vui lòng đăng nhập để đăng ký khóa học",
        variant: "destructive"
      });
      navigate("/login");
      return;
    }

    try {
      const token = localStorage.getItem("epu_token");
      
      if (!token) {
        toast({
          title: "Lỗi xác thực",
          description: "Vui lòng đăng nhập lại để tiếp tục",
          variant: "destructive"
        });
        return;
      }
      
      await axios.post(
        "http://localhost:5000/api/courses/enroll",
        {
          user_id: user.id,
          course_id: courseId
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      toast({
        title: "Đăng ký thành công",
        description: "Bạn đã đăng ký khóa học thành công"
      });
      
      // Navigate to course detail
      navigate(`/courses/${courseId}`);
    } catch (error: any) {
      console.error("Error enrolling course:", error);
      const errorMessage = error.response?.data?.message || "Không thể đăng ký khóa học";
      
      toast({
        title: "Lỗi",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const handleCourseClick = (courseId: number) => {
    navigate(`/courses/${courseId}`);
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = !searchQuery || 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (course.description && course.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
    const matchesMajor = !selectedMajor || 
      (course.major_id && course.major_id.toString() === selectedMajor);
      
    return matchesSearch && matchesMajor;
  });

  // Convert DB course objects to CourseType objects for the CourseCard component
  const mapCourseToCardProps = (course: Course) => {
    return {
      id: course.course_id,
      title: course.title || "",
      description: course.description || "",
      thumbnail: course.thumbnail || "/placeholder.svg",
      specialization: course.major_name || undefined,
      // We don't have these fields in the DB response, so use defaults
      chapterCount: 0,
      lessonCount: 0,
      enrollmentCount: 0,
      enrolled: false
    };
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            Khám phá các khóa học
          </h1>
          <p className="mt-4 text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            Trau dồi kiến thức với các khóa học chất lượng từ các chuyên gia hàng đầu.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              type="search"
              placeholder="Tìm kiếm khóa học..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-[200px]">
            <Select value={selectedMajor} onValueChange={setSelectedMajor}>
              <SelectTrigger>
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Chuyên ngành" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {majors.map((major) => (
                  <SelectItem key={major.major_id} value={major.major_id.toString()}>
                    {major.major_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Separator />
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(null).map((_, index) => (
              <div key={index} className="border rounded-xl overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-4 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <div className="pt-2">
                    <Skeleton className="h-9 w-full rounded-md" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.course_id}
                course={mapCourseToCardProps(course)}
                onClick={() => handleCourseClick(course.course_id)}
                onEnroll={() => handleEnrollCourse(course.course_id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h2 className="mt-4 text-lg font-semibold">Không tìm thấy khóa học</h2>
            <p className="mt-2 text-gray-500">
              Không có khóa học nào phù hợp với tiêu chí tìm kiếm của bạn.
            </p>
            <Button onClick={() => { setSearchQuery(""); setSelectedMajor(""); }} className="mt-4">
              Xóa bộ lọc
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
