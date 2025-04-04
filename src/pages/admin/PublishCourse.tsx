
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, PlusCircle, ImagePlus, X } from "lucide-react";

const PublishCourse = () => {
  const [chapters, setChapters] = useState([{ title: "", lessons: [{ title: "", description: "" }] }]);
  
  // Add new chapter
  const addChapter = () => {
    setChapters([...chapters, { title: "", lessons: [{ title: "", description: "" }] }]);
  };
  
  // Remove chapter
  const removeChapter = (chapterIndex: number) => {
    setChapters(chapters.filter((_, index) => index !== chapterIndex));
  };
  
  // Add lesson to chapter
  const addLesson = (chapterIndex: number) => {
    const updatedChapters = [...chapters];
    updatedChapters[chapterIndex].lessons.push({ title: "", description: "" });
    setChapters(updatedChapters);
  };
  
  // Remove lesson
  const removeLesson = (chapterIndex: number, lessonIndex: number) => {
    const updatedChapters = [...chapters];
    updatedChapters[chapterIndex].lessons = updatedChapters[chapterIndex].lessons.filter(
      (_, index) => index !== lessonIndex
    );
    setChapters(updatedChapters);
  };
  
  // Update chapter title
  const updateChapterTitle = (chapterIndex: number, title: string) => {
    const updatedChapters = [...chapters];
    updatedChapters[chapterIndex].title = title;
    setChapters(updatedChapters);
  };
  
  // Update lesson
  const updateLesson = (chapterIndex: number, lessonIndex: number, field: 'title' | 'description', value: string) => {
    const updatedChapters = [...chapters];
    updatedChapters[chapterIndex].lessons[lessonIndex][field] = value;
    setChapters(updatedChapters);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Đăng khóa học mới</h1>
        <p className="text-muted-foreground">
          Tạo và quản lý nội dung khóa học
        </p>
      </div>
      
      {/* Basic Course Information */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin cơ bản</CardTitle>
          <CardDescription>Nhập thông tin chung về khóa học</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề khóa học</Label>
                <Input id="title" placeholder="Ví dụ: Lập trình Web cơ bản" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialization">Chuyên ngành</Label>
                <select 
                  id="specialization"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">-- Chọn chuyên ngành --</option>
                  <option value="CNTT">Công nghệ thông tin</option>
                  <option value="ATTT">An toàn thông tin</option>
                  <option value="DTVT">Điện tử viễn thông</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="thumbnail">Ảnh bìa</Label>
              <div className="border-2 border-dashed rounded-lg p-4 text-center hover:bg-muted/30 transition-colors cursor-pointer">
                <ImagePlus className="mx-auto h-10 w-10 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Kéo thả tệp hoặc nhấn để chọn
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG hoặc GIF (Tối đa 2MB)
                </p>
                <Input id="thumbnail" type="file" className="hidden" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả khóa học</Label>
              <Textarea 
                id="description" 
                placeholder="Mô tả chi tiết về khóa học" 
                rows={4}
              />
            </div>
          </form>
        </CardContent>
      </Card>
      
      {/* Course Structure */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Cấu trúc khóa học</span>
            <Button variant="outline" onClick={addChapter}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Thêm chương mới
            </Button>
          </CardTitle>
          <CardDescription>Tạo các chương và bài học cho khóa học</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {chapters.map((chapter, chapterIndex) => (
              <div
                key={chapterIndex}
                className="border rounded-md p-4 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-2 flex-1 mr-4">
                    <Label htmlFor={`chapter-${chapterIndex}`} className="flex items-center">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Chương {chapterIndex + 1}
                    </Label>
                    <Input
                      id={`chapter-${chapterIndex}`}
                      value={chapter.title}
                      onChange={(e) => updateChapterTitle(chapterIndex, e.target.value)}
                      placeholder="Tên chương"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeChapter(chapterIndex)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                {/* Lessons */}
                <div className="space-y-3 pl-6 border-l-2 border-l-muted">
                  {chapter.lessons.map((lesson, lessonIndex) => (
                    <div
                      key={`${chapterIndex}-${lessonIndex}`}
                      className="border rounded-md p-3 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Bài học {lessonIndex + 1}</Label>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeLesson(chapterIndex, lessonIndex)}
                          className="h-6 w-6 text-red-500 hover:text-red-700"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <Input
                        value={lesson.title}
                        onChange={(e) =>
                          updateLesson(chapterIndex, lessonIndex, "title", e.target.value)
                        }
                        placeholder="Tên bài học"
                        className="text-sm"
                      />
                      <Textarea
                        value={lesson.description}
                        onChange={(e) =>
                          updateLesson(
                            chapterIndex,
                            lessonIndex,
                            "description",
                            e.target.value
                          )
                        }
                        placeholder="Mô tả nội dung bài học"
                        rows={2}
                        className="text-sm"
                      />
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => addLesson(chapterIndex)}
                  >
                    <PlusCircle className="mr-2 h-3 w-3" />
                    Thêm bài học
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Submission Buttons */}
      <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
        <Button variant="outline">Lưu nháp</Button>
        <Button>Đăng khóa học</Button>
      </div>
    </div>
  );
};

export default PublishCourse;
