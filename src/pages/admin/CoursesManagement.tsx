
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, MoreHorizontal, Search, Edit, Trash2, ChevronDown, FileText } from "lucide-react";
import { mockCourses } from "@/lib/utils";

const CoursesManagement = () => {
  const { toast } = useToast();
  const [courses, setCourses] = useState([...mockCourses]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<any>(null);

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNew = () => {
    setIsEditing(false);
    setCurrentCourse({
      id: courses.length + 1,
      title: "",
      description: "",
      thumbnail: "",
      chapterCount: 0,
      lessonCount: 0,
      enrollmentCount: 0,
    });
    setDialogOpen(true);
  };

  const handleEdit = (course: any) => {
    setIsEditing(true);
    setCurrentCourse({ ...course });
    setDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    // In a real app, this would be an API call
    setCourses(courses.filter((c) => c.id !== id));
    toast({
      title: "Xóa thành công",
      description: "Khóa học đã được xóa khỏi hệ thống",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would be an API call
    if (isEditing) {
      setCourses(
        courses.map((c) => (c.id === currentCourse.id ? currentCourse : c))
      );
      toast({
        title: "Cập nhật thành công",
        description: "Thông tin khóa học đã được cập nhật",
      });
    } else {
      setCourses([...courses, currentCourse]);
      toast({
        title: "Thêm mới thành công",
        description: "Khóa học mới đã được thêm vào hệ thống",
      });
    }
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý Khóa học</h1>
          <p className="text-muted-foreground">
            Thêm, chỉnh sửa và quản lý các khóa học
          </p>
        </div>
        <Button
          className="bg-epu-primary hover:bg-epu-primary/90"
          onClick={handleAddNew}
        >
          <Plus size={16} className="mr-2" />
          Thêm khóa học mới
        </Button>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Tìm kiếm khóa học..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex gap-2">
              <ChevronDown size={16} />
              Lọc
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Tất cả khóa học</DropdownMenuItem>
            <DropdownMenuItem>Khóa học mới nhất</DropdownMenuItem>
            <DropdownMenuItem>Khóa học phổ biến nhất</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Đang hoạt động</DropdownMenuItem>
            <DropdownMenuItem>Đã lưu trữ</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Courses Table */}
      <div className="border rounded-md">
        <Table>
          <TableCaption>Danh sách tất cả khóa học</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Tên khóa học</TableHead>
              <TableHead className="hidden md:table-cell">Mô tả</TableHead>
              <TableHead className="hidden md:table-cell">Số chương</TableHead>
              <TableHead className="text-center">Người đăng ký</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-muted rounded overflow-hidden flex-shrink-0">
                        {course.thumbnail ? (
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-epu-primary/10">
                            <BookOpen size={14} className="text-epu-primary" />
                          </div>
                        )}
                      </div>
                      <span className="font-medium">{course.title}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell max-w-xs">
                    <p className="truncate">{course.description}</p>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {course.chapterCount}
                  </TableCell>
                  <TableCell className="text-center">
                    {course.enrollmentCount}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal size={16} />
                          <span className="sr-only">Mở menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(course)}>
                          <Edit size={14} className="mr-2" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText size={14} className="mr-2" />
                          Quản lý nội dung
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(course.id)}
                          className="text-red-600"
                        >
                          <Trash2 size={14} className="mr-2" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <p className="text-muted-foreground">
                    Không tìm thấy khóa học nào
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Course Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Chỉnh sửa khóa học" : "Thêm khóa học mới"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Cập nhật thông tin khóa học"
                : "Điền thông tin khóa học mới"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Tên khóa học</Label>
                <Input
                  id="title"
                  value={currentCourse?.title || ""}
                  onChange={(e) =>
                    setCurrentCourse({ ...currentCourse, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  value={currentCourse?.description || ""}
                  onChange={(e) =>
                    setCurrentCourse({
                      ...currentCourse,
                      description: e.target.value,
                    })
                  }
                  rows={4}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="thumbnail">Hình ảnh (URL)</Label>
                <Input
                  id="thumbnail"
                  value={currentCourse?.thumbnail || ""}
                  onChange={(e) =>
                    setCurrentCourse({
                      ...currentCourse,
                      thumbnail: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Hủy
              </Button>
              <Button type="submit" className="bg-epu-primary hover:bg-epu-primary/90">
                {isEditing ? "Cập nhật" : "Thêm mới"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CoursesManagement;
