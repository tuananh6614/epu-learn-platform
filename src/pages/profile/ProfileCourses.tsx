
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import CourseCard from "@/components/courses/CourseCard";
import { mockCourses } from "@/lib/utils";
import { ArrowUpRight, BookOpenCheck } from "lucide-react";

const ProfileCourses = () => {
  const { toast } = useToast();
  // In a real app, this would be fetched from an API
  const [purchasedCourses, setPurchasedCourses] = useState(mockCourses.slice(0, 3)); // Using mock data
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API request
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleCourseClick = (courseId: number) => {
    toast({
      title: "Đang chuyển hướng",
      description: `Đang mở khoá học #${courseId}`,
    });
    // In a real app, this would navigate to the course
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

  return (
    <div>
      {purchasedCourses.length > 0 ? (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Khoá học đã đăng ký</h2>
          
          <div className="grid grid-cols-1 gap-6">
            {purchasedCourses.map((course) => (
              <div 
                key={course.id} 
                className="relative border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                onClick={() => handleCourseClick(course.id)}
              >
                <div className="absolute top-2 right-2 z-10 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                  <BookOpenCheck size={14} className="mr-1" />
                  Đã mua
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 w-full h-full cursor-pointer">
                  <div className="md:col-span-1 h-40 md:h-full">
                    <div
                      className="w-full h-full bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${course.image})`,
                      }}
                    />
                  </div>
                  <div className="md:col-span-3 p-4">
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-epu-primary group-focus:text-epu-primary">
                      {course.title}
                    </h3>
                    <p className="text-muted-foreground line-clamp-2 mb-4">{course.description}</p>
                    <div className="flex justify-between items-end">
                      <div className="text-sm text-muted-foreground">
                        <span>Tiến độ: 30%</span>
                        <div className="w-32 h-2 bg-gray-200 rounded-full mt-1">
                          <div className="w-[30%] h-2 bg-epu-primary rounded-full"></div>
                        </div>
                      </div>
                      <div className="flex items-center text-epu-primary font-medium">
                        Tiếp tục học
                        <ArrowUpRight size={16} className="ml-1" />
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
          <p className="text-muted-foreground">
            Hãy khám phá các khoá học chất lượng trong danh sách khoá học
          </p>
        </div>
      )}
    </div>
  );
};

export default ProfileCourses;
