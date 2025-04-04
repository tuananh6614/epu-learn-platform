import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

const CoursesManagement = () => {
  const [courses, setCourses] = useState([
    { id: 1, name: "Nhập môn lập trình", description: "Khóa học cơ bản về lập trình" },
    { id: 2, name: "Cấu trúc dữ liệu và giải thuật", description: "Khóa học nâng cao về cấu trúc dữ liệu" },
    { id: 3, name: "Lập trình web với React", description: "Khóa học chuyên sâu về React" },
  ]);
  const { toast } = useToast();

  const handleAddCourse = () => {
    // Logic to add a new course
    toast({
      title: "Thêm khóa học",
      description: "Chức năng thêm khóa học đang được phát triển.",
    });
  };

  const handleEditCourse = (id: number) => {
    // Logic to edit a course
    toast({
      title: "Chỉnh sửa khóa học",
      description: `Chức năng chỉnh sửa khóa học ${id} đang được phát triển.`,
    });
  };

  const handleDeleteCourse = (id: number) => {
    // Logic to delete a course
    setCourses(courses.filter((course) => course.id !== id));
    toast({
      title: "Xóa khóa học",
      description: `Đã xóa khóa học ${id} thành công.`,
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <CardHeader className="pl-0">
          <CardTitle className="text-2xl font-bold">Quản lý khóa học</CardTitle>
        </CardHeader>
        <Button onClick={handleAddCourse}>Thêm khóa học</Button>
      </div>
      <Separator />
      <div className="grid gap-4 mt-4">
        {courses.map((course) => (
          <Card key={course.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                {course.name}
                <div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleEditCourse(course.id)}
                  >
                    Sửa
                  </Button>{" "}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteCourse(course.id)}
                  >
                    Xóa
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{course.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CoursesManagement;
