import { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BookOpen, PlusCircle, ImagePlus, X, Video, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type MediaItem = {
  type: "image" | "video";
  url: string;
  title: string;
};

type LessonPage = {
  title: string;
  content: string;
  media: MediaItem[];
};

type Lesson = {
  title: string;
  description: string;
  pages: LessonPage[];
};

type Chapter = {
  title: string;
  lessons: Lesson[];
};

interface Course {
  course_id: number;
  title: string;
  description: string | null;
  thumbnail: string | null;
  major_id: number | null;
  major_name: string | null;
}

const PublishCourse = () => {
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const courseId = searchParams.get("courseId");
  
  const [course, setCourse] = useState<Course | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([
    { 
      title: "", 
      lessons: [{ 
        title: "", 
        description: "", 
        pages: [{ 
          title: "Trang 1", 
          content: "", 
          media: [] 
        }] 
      }] 
    }
  ]);

  const [selectedMedia, setSelectedMedia] = useState<{
    chapterIndex: number;
    lessonIndex: number;
    pageIndex: number;
    type: "image" | "video";
  } | null>(null);
  
  const [majors, setMajors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (courseId) {
      fetchCourseDetails(parseInt(courseId));
    } else {
      toast({
        variant: "destructive",
        title: "Thiếu thông tin",
        description: "Không tìm thấy ID khóa học"
      });
      navigate("/admin/courses");
      return;
    }
    
    fetchMajors();
  }, [courseId, navigate]);

  const fetchCourseDetails = async (id: number) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("epu_token");
      
      if (!token) {
        toast({
          variant: "destructive",
          title: "Lỗi xác thực",
          description: "Vui lòng đăng nhập lại"
        });
        return;
      }
      
      const response = await axios.get(`http://localhost:5000/api/courses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setCourse(response.data);
      
      if (response.data.chapters && response.data.chapters.length > 0) {
        const formattedChapters = response.data.chapters.map((chapter: any) => {
          return {
            title: chapter.title,
            lessons: chapter.lessons.map((lesson: any) => {
              return {
                title: lesson.title,
                description: lesson.description || "",
                pages: lesson.pages && lesson.pages.length > 0 
                  ? lesson.pages.map((page: any) => ({
                      title: `Trang ${page.page_number}`,
                      content: page.content || "",
                      media: [] // Assuming media is stored somewhere else or needs to be loaded separately
                    }))
                  : [{ title: "Trang 1", content: "", media: [] }]
              };
            })
          };
        });
        
        setChapters(formattedChapters);
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching course details:", error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể tải thông tin khóa học"
      });
      setLoading(false);
    }
  };
  
  const fetchMajors = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/majors');
      setMajors(response.data || []);
    } catch (error) {
      console.error("Error fetching majors:", error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể tải danh sách chuyên ngành"
      });
      setMajors([]);
    }
  };

  const addChapter = () => {
    setChapters([...chapters, { 
      title: "", 
      lessons: [{ 
        title: "", 
        description: "", 
        pages: [{ 
          title: "Trang 1", 
          content: "", 
          media: [] 
        }] 
      }] 
    }]);
  };
  
  const removeChapter = (chapterIndex: number) => {
    setChapters(chapters.filter((_, index) => index !== chapterIndex));
  };
  
  const addLesson = (chapterIndex: number) => {
    const updatedChapters = [...chapters];
    updatedChapters[chapterIndex].lessons.push({ 
      title: "", 
      description: "", 
      pages: [{ 
        title: "Trang 1", 
        content: "", 
        media: [] 
      }] 
    });
    setChapters(updatedChapters);
  };
  
  const removeLesson = (chapterIndex: number, lessonIndex: number) => {
    const updatedChapters = [...chapters];
    updatedChapters[chapterIndex].lessons = updatedChapters[chapterIndex].lessons.filter(
      (_, index) => index !== lessonIndex
    );
    setChapters(updatedChapters);
  };
  
  const updateChapterTitle = (chapterIndex: number, title: string) => {
    const updatedChapters = [...chapters];
    updatedChapters[chapterIndex].title = title;
    setChapters(updatedChapters);
  };
  
  const updateLesson = (chapterIndex: number, lessonIndex: number, field: 'title' | 'description', value: string) => {
    const updatedChapters = [...chapters];
    updatedChapters[chapterIndex].lessons[lessonIndex][field] = value;
    setChapters(updatedChapters);
  };

  const addPage = (chapterIndex: number, lessonIndex: number) => {
    const updatedChapters = [...chapters];
    const pageNumber = updatedChapters[chapterIndex].lessons[lessonIndex].pages.length + 1;
    updatedChapters[chapterIndex].lessons[lessonIndex].pages.push({
      title: `Trang ${pageNumber}`,
      content: "",
      media: []
    });
    setChapters(updatedChapters);
  };

  const removePage = (chapterIndex: number, lessonIndex: number, pageIndex: number) => {
    const updatedChapters = [...chapters];
    if (updatedChapters[chapterIndex].lessons[lessonIndex].pages.length > 1) {
      updatedChapters[chapterIndex].lessons[lessonIndex].pages = 
        updatedChapters[chapterIndex].lessons[lessonIndex].pages.filter(
          (_, index) => index !== pageIndex
        );
      setChapters(updatedChapters);
    } else {
      toast({
        variant: "destructive",
        title: "Không thể xóa",
        description: "Bài học phải có ít nhất một trang"
      });
    }
  };

  const updatePageContent = (chapterIndex: number, lessonIndex: number, pageIndex: number, field: 'title' | 'content', value: string) => {
    const updatedChapters = [...chapters];
    updatedChapters[chapterIndex].lessons[lessonIndex].pages[pageIndex][field] = value;
    setChapters(updatedChapters);
  };

  const addMedia = (chapterIndex: number, lessonIndex: number, pageIndex: number, media: MediaItem) => {
    const updatedChapters = [...chapters];
    updatedChapters[chapterIndex].lessons[lessonIndex].pages[pageIndex].media.push(media);
    setChapters(updatedChapters);
    setSelectedMedia(null);
    
    toast({
      title: "Đã thêm media",
      description: `${media.type === 'image' ? 'Hình ảnh' : 'Video'} đã được thêm vào trang`,
    });
  };

  const removeMedia = (chapterIndex: number, lessonIndex: number, pageIndex: number, mediaIndex: number) => {
    const updatedChapters = [...chapters];
    updatedChapters[chapterIndex].lessons[lessonIndex].pages[pageIndex].media = 
      updatedChapters[chapterIndex].lessons[lessonIndex].pages[pageIndex].media.filter(
        (_, index) => index !== mediaIndex
      );
    setChapters(updatedChapters);
  };

  const handleMediaSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!selectedMedia) return;
    
    const formData = new FormData(e.currentTarget);
    const title = formData.get("mediaTitle") as string;
    const url = formData.get("mediaUrl") as string;
    
    if (!title || !url) {
      toast({
        variant: "destructive",
        title: "Thiếu thông tin",
        description: "Vui lòng nhập đầy đủ thông tin",
      });
      return;
    }
    
    const { chapterIndex, lessonIndex, pageIndex, type } = selectedMedia;
    
    addMedia(chapterIndex, lessonIndex, pageIndex, {
      type,
      title,
      url,
    });
  };

  const submitChapter = async (chapterIndex: number) => {
    if (!courseId) {
      toast({
        variant: "destructive",
        title: "Thiếu thông tin",
        description: "Không tìm thấy ID khóa học",
      });
      return;
    }
    
    const chapter = chapters[chapterIndex];
    
    if (!chapter.title.trim()) {
      toast({
        variant: "destructive",
        title: "Thiếu thông tin",
        description: `Chương ${chapterIndex + 1} chưa có tiêu đề`,
      });
      return;
    }
    
    try {
      const token = localStorage.getItem("epu_token");
      
      if (!token) {
        toast({
          variant: "destructive",
          title: "Lỗi xác thực",
          description: "Vui lòng đăng nhập lại",
        });
        return;
      }
      
      const chapterResponse = await axios.post(
        "http://localhost:5000/api/courses/chapter",
        {
          course_id: parseInt(courseId),
          title: chapter.title,
          description: chapter.title
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      const chapterId = chapterResponse.data.chapter_id;
      
      for (let lessonIndex = 0; lessonIndex < chapter.lessons.length; lessonIndex++) {
        const lesson = chapter.lessons[lessonIndex];
        
        if (!lesson.title.trim()) {
          toast({
            variant: "destructive",
            title: "Thiếu thông tin",
            description: `Bài học ${lessonIndex + 1} trong chương ${chapterIndex + 1} chưa có tiêu đề`,
          });
          continue;
        }
        
        const lessonResponse = await axios.post(
          "http://localhost:5000/api/courses/lesson",
          {
            chapter_id: chapterId,
            title: lesson.title,
            content: lesson.description
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        const lessonId = lessonResponse.data.lesson_id;
        
        for (let pageIndex = 0; pageIndex < lesson.pages.length; pageIndex++) {
          const page = lesson.pages[pageIndex];
          
          await axios.post(
            "http://localhost:5000/api/courses/page",
            {
              lesson_id: lessonId,
              page_number: pageIndex + 1,
              content: page.content
            },
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
        }
      }
      
      toast({
        title: "Thành công",
        description: `Đã lưu chương "${chapter.title}" thành công`,
      });
      
    } catch (error) {
      console.error("Error submitting chapter:", error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể lưu chương học",
      });
    }
  };

  const handleSubmitCourse = async () => {
    if (!courseId) {
      toast({
        variant: "destructive",
        title: "Thiếu thông tin",
        description: "Không tìm thấy ID khóa học",
      });
      navigate("/admin/courses");
      return;
    }
    
    let isValid = true;
    let errorMessage = "";
    
    if (chapters.length === 0) {
      isValid = false;
      errorMessage = "Khóa học phải có ít nhất một chương";
    }
    
    chapters.forEach((chapter, idx) => {
      if (!chapter.title.trim()) {
        isValid = false;
        errorMessage = `Chương ${idx + 1} chưa có tiêu đề`;
      }
      
      if (chapter.lessons.length === 0) {
        isValid = false;
        errorMessage = `Chương ${idx + 1} phải có ít nhất một bài học`;
      }
      
      chapter.lessons.forEach((lesson, lessonIdx) => {
        if (!lesson.title.trim()) {
          isValid = false;
          errorMessage = `Bài học ${lessonIdx + 1} trong chương ${idx + 1} chưa có tiêu đề`;
        }
        
        lesson.pages.forEach((page, pageIdx) => {
          if (!page.content.trim()) {
            isValid = false;
            errorMessage = `Trang ${pageIdx + 1} trong bài học ${lessonIdx + 1}, chương ${idx + 1} chưa có nội dung`;
          }
        });
      });
    });
    
    if (!isValid) {
      toast({
        variant: "destructive",
        title: "Lỗi xác thực",
        description: errorMessage,
      });
      return;
    }
    
    try {
      const token = localStorage.getItem("epu_token");
      
      if (!token) {
        toast({
          variant: "destructive",
          title: "Lỗi xác thực",
          description: "Vui lòng đăng nhập lại",
        });
        return;
      }
      
      for (let i = 0; i < chapters.length; i++) {
        await submitChapter(i);
      }
      
      toast({
        title: "Đã đăng khóa học",
        description: "Khóa học của bạn đã được đăng thành công",
      });
      
      navigate("/admin/courses");
      
    } catch (error) {
      console.error("Error submitting course:", error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể đăng khóa học",
      });
    }
  };
  
  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Đang tải...</h1>
          <p className="text-muted-foreground">
            Vui lòng đợi trong giây lát
          </p>
        </div>
        
        <div className="space-y-6">
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
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {course ? `Chỉnh sửa khóa học: ${course.title}` : "Đăng khóa học mới"}
        </h1>
        <p className="text-muted-foreground">
          Tạo và quản lý nội dung khóa học
        </p>
      </div>
      
      {course && (
        <Card>
          <CardHeader>
            <CardTitle>Thông tin cơ bản</CardTitle>
            <CardDescription>Thông tin chung về khóa học</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tiêu đề khóa học</Label>
                <div className="font-medium p-2 bg-muted rounded-md">{course.title}</div>
              </div>
              <div className="space-y-2">
                <Label>Chuyên ngành</Label>
                <div className="font-medium p-2 bg-muted rounded-md">{course.major_name || "Chưa phân loại"}</div>
              </div>
            </div>
            
            <div className="space-y-2 mt-4">
              <Label>Mô tả</Label>
              <div className="font-medium p-2 bg-muted rounded-md min-h-20">
                {course.description || "Không có mô tả"}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
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
                
                <div className="space-y-3 pl-6 border-l-2 border-l-muted">
                  {chapter.lessons.map((lesson, lessonIndex) => (
                    <div
                      key={`${chapterIndex}-${lessonIndex}`}
                      className="border rounded-md p-3 space-y-3"
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
                      
                      <Tabs defaultValue={`page-0`} className="w-full">
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-xs font-medium text-muted-foreground">Trang bài học</Label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addPage(chapterIndex, lessonIndex)}
                            className="h-7 text-xs"
                          >
                            <PlusCircle className="mr-1 h-3 w-3" />
                            Thêm trang
                          </Button>
                        </div>
                        
                        <TabsList className="w-full flex overflow-x-auto mb-2">
                          {lesson.pages.map((page, pageIndex) => (
                            <TabsTrigger
                              key={`page-${pageIndex}`}
                              value={`page-${pageIndex}`}
                              className="flex-1 min-w-[80px] whitespace-nowrap"
                            >
                              {page.title}
                            </TabsTrigger>
                          ))}
                        </TabsList>
                        
                        {lesson.pages.map((page, pageIndex) => (
                          <TabsContent key={`page-content-${pageIndex}`} value={`page-${pageIndex}`} className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex-1 mr-2">
                                <Input
                                  value={page.title}
                                  onChange={(e) => 
                                    updatePageContent(chapterIndex, lessonIndex, pageIndex, "title", e.target.value)
                                  }
                                  placeholder="Tiêu đề trang"
                                  className="text-sm"
                                />
                              </div>
                              {lesson.pages.length > 1 && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removePage(chapterIndex, lessonIndex, pageIndex)}
                                  className="h-7 w-7 text-red-500 hover:text-red-700"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                            
                            <Textarea
                              value={page.content}
                              onChange={(e) =>
                                updatePageContent(
                                  chapterIndex,
                                  lessonIndex,
                                  pageIndex,
                                  "content",
                                  e.target.value
                                )
                              }
                              placeholder="Nội dung trang bài học"
                              rows={4}
                              className="text-sm"
                            />
                            
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <Label className="text-xs font-medium text-muted-foreground">
                                  Media ({page.media.length})
                                </Label>
                                <div className="flex gap-1">
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="h-7 text-xs"
                                        onClick={() => setSelectedMedia({
                                          chapterIndex,
                                          lessonIndex,
                                          pageIndex,
                                          type: "image"
                                        })}
                                      >
                                        <Image className="mr-1 h-3 w-3" />
                                        Hình ảnh
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Thêm hình ảnh</DialogTitle>
                                      </DialogHeader>
                                      <form onSubmit={handleMediaSubmit} className="space-y-4 mt-2">
                                        <div className="space-y-2">
                                          <Label htmlFor="mediaTitle">Tiêu đề</Label>
                                          <Input id="mediaTitle" name="mediaTitle" placeholder="Tiêu đề hình ảnh" />
                                        </div>
                                        <div className="space-y-2">
                                          <Label htmlFor="mediaUrl">URL hình ảnh</Label>
                                          <Input id="mediaUrl" name="mediaUrl" placeholder="https://example.com/image.png" />
                                        </div>
                                        <div className="flex justify-end">
                                          <Button type="submit">Thêm</Button>
                                        </div>
                                      </form>
                                    </DialogContent>
                                  </Dialog>
                                  
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button 
                                        variant="outline" 
                                        size="sm" 
                                        className="h-7 text-xs"
                                        onClick={() => setSelectedMedia({
                                          chapterIndex,
                                          lessonIndex,
                                          pageIndex,
                                          type: "video"
                                        })}
                                      >
                                        <Video className="mr-1 h-3 w-3" />
                                        Video
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader>
                                        <DialogTitle>Thêm video</DialogTitle>
                                      </DialogHeader>
                                      <form onSubmit={handleMediaSubmit} className="space-y-4 mt-2">
                                        <div className="space-y-2">
                                          <Label htmlFor="mediaTitle">Tiêu đề</Label>
                                          <Input id="mediaTitle" name="mediaTitle" placeholder="Tiêu đề video" />
                                        </div>
                                        <div className="space-y-2">
                                          <Label htmlFor="mediaUrl">URL video (YouTube, Vimeo, v.v.)</Label>
                                          <Input id="mediaUrl" name="mediaUrl" placeholder="https://youtube.com/watch?v=..." />
                                        </div>
                                        <div className="flex justify-end">
                                          <Button type="submit">Thêm</Button>
                                        </div>
                                      </form>
                                    </DialogContent>
                                  </Dialog>
                                </div>
                              </div>

                              {page.media.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                                  {page.media.map((media, mediaIndex) => (
                                    <div key={mediaIndex} className="flex items-start p-2 border rounded-md bg-muted/30">
                                      <div className="flex-1">
                                        <div className="flex items-center gap-1 text-xs font-medium">
                                          {media.type === "image" ? (
                                            <Image className="h-3 w-3" />
                                          ) : (
                                            <Video className="h-3 w-3" />
                                          )}
                                          {media.title}
                                        </div>
                                        <p className="text-xs text-muted-foreground truncate">{media.url}</p>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeMedia(chapterIndex, lessonIndex, pageIndex, mediaIndex)}
                                        className="h-5 w-5 text-red-500 hover:bg-red-100"
                                      >
                                        <X className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </TabsContent>
                        ))}
                      </Tabs>
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
      
      <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
        <Button variant="outline" onClick={() => navigate("/admin/courses")}>Hủy</Button>
        <Button onClick={handleSubmitCourse}>Đăng khóa học</Button>
      </div>
    </div>
  );
};

export default PublishCourse;
