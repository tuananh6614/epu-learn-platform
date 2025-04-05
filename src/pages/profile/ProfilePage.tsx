
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Settings, BookOpen, FileText, Eye, EyeOff, Mail, GraduationCap, BarChart } from "lucide-react";
import ProfileCourses from "@/pages/profile/ProfileCourses";
import ProfileDocuments from "@/pages/profile/ProfileDocuments";
import ProfileGrades from "@/pages/profile/ProfileGrades";

const ProfilePage = () => {
  const { user, updateUserInfo } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Xác định thông tin cần cập nhật
      const updates: {
        fullName?: string;
        currentPassword?: string;
        newPassword?: string;
      } = {};
      
      // Chỉ gửi fullName nếu có thay đổi
      if (formData.fullName && formData.fullName !== user?.fullName) {
        updates.fullName = formData.fullName;
      }
      
      // Chỉ gửi mật khẩu nếu có nhập mật khẩu mới
      if (formData.newPassword) {
        updates.currentPassword = formData.currentPassword;
        updates.newPassword = formData.newPassword;
      }
      
      // Kiểm tra nếu không có thông tin cần cập nhật
      if (Object.keys(updates).length === 0) {
        toast({
          title: "Không có thay đổi",
          description: "Không có thông tin nào được thay đổi",
        });
        setIsEditing(false);
        setIsSubmitting(false);
        return;
      }
      
      const success = await updateUserInfo(updates);
      
      if (success) {
        // Reset trường mật khẩu
        setFormData(prev => ({
          ...prev,
          currentPassword: "",
          newPassword: ""
        }));
        
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi cập nhật thông tin",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = (field: 'current' | 'new') => {
    if (field === 'current') {
      setShowPassword(!showPassword);
    } else {
      setShowNewPassword(!showNewPassword);
    }
  };

  return (
    <div className="container py-10 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Trang cá nhân</h1>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="profile" className="flex items-center gap-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/30 dark:data-[state=active]:text-blue-400">
            <User size={16} />
            <span className="hidden sm:inline">Thông tin cá nhân</span>
            <span className="sm:hidden">Cá nhân</span>
          </TabsTrigger>
          <TabsTrigger value="courses" className="flex items-center gap-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/30 dark:data-[state=active]:text-blue-400">
            <BookOpen size={16} />
            <span className="hidden sm:inline">Khoá học đã mua</span>
            <span className="sm:hidden">Khoá học</span>
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/30 dark:data-[state=active]:text-blue-400">
            <FileText size={16} />
            <span className="hidden sm:inline">Tài liệu đã mua</span>
            <span className="sm:hidden">Tài liệu</span>
          </TabsTrigger>
          <TabsTrigger value="grades" className="flex items-center gap-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/30 dark:data-[state=active]:text-blue-400">
            <GraduationCap size={16} />
            <span className="hidden sm:inline">Bảng điểm</span>
            <span className="sm:hidden">Điểm</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card className="overflow-hidden border-blue-100 dark:border-blue-900/30 shadow hover:shadow-md transition-all">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10">
              <CardTitle className="flex items-center gap-2">
                <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                Thông tin cá nhân
              </CardTitle>
              <CardDescription>
                Xem và cập nhật thông tin cá nhân của bạn
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4 pt-6">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-inner">
                    <User size={40} className="text-white" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-medium">Họ và tên</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    className={!isEditing ? "bg-muted focus:ring-blue-500" : "focus:ring-blue-500"}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                    Email <Mail size={14} className="text-muted-foreground" />
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    readOnly={true}
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground italic">
                    Email dùng để đăng nhập và không thể thay đổi được
                  </p>
                </div>
                
                {isEditing && (
                  <>
                    <div className="pt-2 border-t border-dashed border-muted-foreground/30">
                      <p className="text-sm font-medium text-muted-foreground mb-4">Thay đổi mật khẩu (để trống nếu không muốn thay đổi)</p>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword" className="text-sm font-medium">Mật khẩu hiện tại</Label>
                          <div className="relative">
                            <Input
                              id="currentPassword"
                              name="currentPassword"
                              type={showPassword ? "text" : "password"}
                              value={formData.currentPassword}
                              onChange={handleChange}
                              className="pr-10 focus:ring-blue-500"
                              placeholder="Nhập mật khẩu hiện tại"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 text-muted-foreground hover:text-foreground"
                              onClick={() => togglePasswordVisibility('current')}
                            >
                              {showPassword ? (
                                <EyeOff size={18} />
                              ) : (
                                <Eye size={18} />
                              )}
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="newPassword" className="text-sm font-medium">Mật khẩu mới</Label>
                          <div className="relative">
                            <Input
                              id="newPassword"
                              name="newPassword"
                              type={showNewPassword ? "text" : "password"}
                              value={formData.newPassword}
                              onChange={handleChange}
                              className="pr-10 focus:ring-blue-500"
                              placeholder="Nhập mật khẩu mới"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 text-muted-foreground hover:text-foreground"
                              onClick={() => togglePasswordVisibility('new')}
                            >
                              {showNewPassword ? (
                                <EyeOff size={18} />
                              ) : (
                                <Eye size={18} />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
              
              <CardFooter className="flex justify-between bg-slate-50/50 dark:bg-slate-900/20 p-6 border-t border-blue-100/50 dark:border-blue-900/10">
                {isEditing ? (
                  <>
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          fullName: user?.fullName || "",
                          email: user?.email || "",
                          currentPassword: "",
                          newPassword: "",
                        });
                      }}
                      disabled={isSubmitting}
                      className="border-blue-200 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-900/20"
                    >
                      Huỷ
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
                    </Button>
                  </>
                ) : (
                  <Button 
                    type="button"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm hover:shadow-md transition-all"
                    onClick={() => setIsEditing(true)}
                  >
                    <Settings size={16} className="mr-2" />
                    Chỉnh sửa thông tin
                  </Button>
                )}
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="courses">
          <ProfileCourses />
        </TabsContent>
        
        <TabsContent value="documents">
          <ProfileDocuments />
        </TabsContent>
        
        <TabsContent value="grades">
          <ProfileGrades />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
