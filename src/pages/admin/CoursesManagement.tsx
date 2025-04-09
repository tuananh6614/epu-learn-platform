import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Plus, Pencil, Trash, ChevronRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";

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

const CoursesManagement = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [majors, setMajors] = useState<Major[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    major_id: "",
    thumbnail: ""
  });
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses();
    fetchMajors();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/courses");
      setCourses(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError("Không thể tải danh sách khóa học");
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể tải danh sách khóa học"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMajors = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/majors");
      setMajors(response.data);
    } catch (err) {
      console.error("Error fetching majors:", err);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể tải danh sách chuyên ngành"
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleMajorChange = (value: string) => {
    setFormData({
      ...formData,
      major_id: value
    });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      major_id: "",
      thumbnail: ""
    });
  };

  const handleAddCourse = async () => {
    try {
      if (!formData.title) {
        toast({
          variant: "destructive",
          title: "Thiếu thông tin",
          description: "Vui lòng nhập tiêu đề khóa học"
        });
        return;
      }

      const token = localStorage.getItem("epu_token");
      if (!token) {
        toast({
          variant: "destructive",
          title: "Chưa đăng nhập",
          description: "Vui lòng đăng nhập để thực hiện chức năng này"
        });
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/courses",
        {
          title: formData.title,
          description: formData.description,
          thumbnail: formData.thumbnail || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
          major_id: formData.major_id ? parseInt(formData.major_id) : null
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast({
        title: "Thành công",
        description: "Thêm khóa học mới thành công"
      });

      fetchCourses();
      setShowAddDialog(false);
      resetForm();

      if (response.data && response.data.course_id) {
        navigate(`/admin/publish/courses?courseId=${response.data.course_id}`);
      } else {
        toast({
          variant: "destructive",
          title: "Lỗi",
          description: "Không nhận được ID khóa học mới"
        });
      }
    } catch (err) {
      console.error("Error adding course:", err);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể thêm khóa học mới"
      });
    }
  };

  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course);
    setFormData({
      title: course.title,
      description: course.description || "",
      major_id: course.major_id ? course.major_id.toString() : "",
      thumbnail: course.thumbnail || ""
    });
    setShowEditDialog(true);
  };

  const handleUpdateCourse = async () => {
    try {
      if (!selectedCourse || !formData.title) {
        toast({
          variant: "destructive",
          title: "Thiếu thông tin",
          description: "Vui lòng nhập tiêu đề khóa học"
        });
        return;
      }

      const token = localStorage.getItem("epu_token");
      if (!token) {
        toast({
          variant: "destructive",
          title: "Chưa đăng nhập",
          description: "Vui lòng đăng nhập để thực hiện chức năng này"
        });
        return;
      }

      await axios.put(
        `http://localhost:5000/api/courses/${selectedCourse.course_id}`,
        {
          title: formData.title,
          description: formData.description,
          thumbnail: formData.thumbnail || "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
          major_id: formData.major_id ? parseInt(formData.major_id) : null
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      toast({
        title: "Thành công",
        description: "Cập nhật khóa học thành công"
      });

      fetchCourses();
      setShowEditDialog(false);
      setSelectedCourse(null);
      resetForm();
    } catch (err) {
      console.error("Error updating course:", err);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể cập nhật khóa học"
      });
    }
  };

  const handleDeleteCourse = async (courseId: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa khóa học này?")) {
      return;
    }

    try {
      const token = localStorage.getItem("epu_token");
      if (!token) {
        toast({
          variant: "destructive",
          title: "Chưa đăng nhập",
          description: "Vui lòng đăng nhập để thực hiện chức năng này"
        });
        return;
      }

      await axios.delete(`http://localhost:5000/api/courses/${courseId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      toast({
        title: "Thành công",
        description: "Xóa khóa học thành công"
      });

      fetchCourses();
    } catch (err) {
      console.error("Error deleting course:", err);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể xóa khóa học"
      });
    }
  };

  const handleEditContent = (courseId: number) => {
    if (!courseId) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "ID khóa học không hợp lệ"
      });
      return;
    }
    navigate(`/admin/publish/courses?courseId=${courseId}`);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <CardHeader className="pl-0">
          <CardTitle className="text-2xl font-bold">Quản lý khóa học</CardTitle>
        </CardHeader>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Thêm khóa học
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm khóa học mới</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Tiêu đề khóa học</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Nhập tiêu đề khóa học"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Mô tả khóa học"
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="major">Chuyên ngành</Label>
                <Select value={formData.major_id} onValueChange={handleMajorChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn chuyên ngành" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">-- Không chọn --</SelectItem>
                    {majors.map((major) => (
                      <SelectItem key={major.major_id} value={major.major_id.toString()}>
                        {major.major_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="thumbnail">URL hình ảnh</Label>
                <Input
                  id="thumbnail"
                  name="thumbnail"
                  value={formData.thumbnail}
                  onChange={handleInputChange}
                  placeholder="URL hình ảnh khóa học"
                />
                <p className="text-xs text-muted-foreground">
                  Nếu không nhập URL, hệ thống sẽ sử dụng hình ảnh mặc định
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Hủy
              </Button>
              <Button onClick={handleAddCourse}>Thêm khóa học</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Chỉnh sửa khóa học</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-title">Tiêu đề khóa học</Label>
                <Input
                  id="edit-title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Nhập tiêu đề khóa học"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Mô tả</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Mô tả khóa học"
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-major">Chuyên ngành</Label>
                <Select value={formData.major_id} onValueChange={handleMajorChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn chuyên ngành" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">-- Không chọn --</SelectItem>
                    {majors.map((major) => (
                      <SelectItem key={major.major_id} value={major.major_id.toString()}>
                        {major.major_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-thumbnail">URL hình ảnh</Label>
                <Input
                  id="edit-thumbnail"
                  name="thumbnail"
                  value={formData.thumbnail}
                  onChange={handleInputChange}
                  placeholder="URL hình ảnh khóa học"
                />
                <p className="text-xs text-muted-foreground">
                  Nếu không nhập URL, hệ thống sẽ sử dụng hình ảnh mặc định
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                Hủy
              </Button>
              <Button onClick={handleUpdateCourse}>Cập nhật</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Separator />

      {loading ? (
        <div className="grid gap-4 mt-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-red-500">{error}</p>
          <Button onClick={fetchCourses} className="mt-2">
            Thử lại
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 mt-4">
          {courses.length === 0 ? (
            <div className="text-center py-10">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium">Chưa có khóa học nào</h3>
              <p className="mt-1 text-gray-500">Bắt đầu bằng cách thêm khóa học đầu tiên.</p>
              <Button onClick={() => setShowAddDialog(true)} className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Thêm khóa học
              </Button>
            </div>
          ) : (
            courses.map((course) => (
              <Card key={course.course_id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <BookOpen className="mr-2 h-5 w-5 text-blue-500" />
                      {course.title}
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditContent(course.course_id)}
                      >
                        <ChevronRight className="h-4 w-4" />
                        <span className="ml-1">Nội dung</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditCourse(course)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteCourse(course.course_id)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-2">{course.description || "Không có mô tả"}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="font-medium mr-2">Chuyên ngành:</span>
                    <span>{course.major_name || "Chưa phân loại"}</span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CoursesManagement;
