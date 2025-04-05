
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Settings, BookOpen, FileText, Eye, EyeOff, Mail } from "lucide-react";
import ProfileCourses from "@/pages/profile/ProfileCourses";
import ProfileDocuments from "@/pages/profile/ProfileDocuments";

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
    
    // Basic validation
    if (isEditing && !formData.fullName.trim()) {
      toast({
        title: "Lỗi",
        description: "Họ và tên không được để trống",
        variant: "destructive",
      });
      return;
    }

    // If password is being changed, require current password
    if (formData.newPassword && !formData.currentPassword) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập mật khẩu hiện tại",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Only send updates if there are actual changes
      const updates: {fullName?: string; newPassword?: string} = {};
      
      if (formData.fullName !== user?.fullName) {
        updates.fullName = formData.fullName;
      }
      
      if (formData.newPassword) {
        updates.newPassword = formData.newPassword;
      }
      
      // Only call API if there are changes
      if (Object.keys(updates).length > 0) {
        await updateUserInfo(updates);
        
        // Reset password fields
        setFormData(prev => ({
          ...prev,
          currentPassword: "",
          newPassword: ""
        }));
        
        toast({
          title: "Thành công",
          description: "Thông tin cá nhân đã được cập nhật",
        });
      } else {
        toast({
          title: "Thông báo",
          description: "Không có thông tin nào được thay đổi",
        });
      }
      
      setIsEditing(false);
    } catch (error) {
      console.error("Profile update error:", error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật thông tin",
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
      <h1 className="text-3xl font-bold mb-6">Trang cá nhân</h1>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User size={16} />
            <span className="hidden sm:inline">Thông tin cá nhân</span>
            <span className="sm:hidden">Cá nhân</span>
          </TabsTrigger>
          <TabsTrigger value="courses" className="flex items-center gap-2">
            <BookOpen size={16} />
            <span className="hidden sm:inline">Khoá học đã mua</span>
            <span className="sm:hidden">Khoá học</span>
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText size={16} />
            <span className="hidden sm:inline">Tài liệu đã mua</span>
            <span className="sm:hidden">Tài liệu</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cá nhân</CardTitle>
              <CardDescription>
                Xem và cập nhật thông tin cá nhân của bạn
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-24 h-24 rounded-full bg-epu-primary/10 flex items-center justify-center">
                    <User size={40} className="text-epu-primary" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fullName">Họ và tên</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    className={!isEditing ? "bg-muted" : ""}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    Email <Mail size={16} className="text-muted-foreground" />
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    readOnly={true}
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    Email dùng để đăng nhập và không thể thay đổi được
                  </p>
                </div>
                
                {isEditing && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          type={showPassword ? "text" : "password"}
                          value={formData.currentPassword}
                          onChange={handleChange}
                          className="pr-10"
                          placeholder="Nhập mật khẩu hiện tại"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0"
                          onClick={() => togglePasswordVisibility('current')}
                        >
                          {showPassword ? (
                            <EyeOff size={18} className="text-muted-foreground" />
                          ) : (
                            <Eye size={18} className="text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Mật khẩu mới</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          value={formData.newPassword}
                          onChange={handleChange}
                          className="pr-10"
                          placeholder="Nhập mật khẩu mới"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0"
                          onClick={() => togglePasswordVisibility('new')}
                        >
                          {showNewPassword ? (
                            <EyeOff size={18} className="text-muted-foreground" />
                          ) : (
                            <Eye size={18} className="text-muted-foreground" />
                          )}
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Để trống nếu bạn không muốn đổi mật khẩu
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
              
              <CardFooter className="flex justify-between">
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
                    >
                      Huỷ
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-epu-primary hover:bg-epu-primary/90"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Đang lưu...
                        </div>
                      ) : "Lưu thay đổi"}
                    </Button>
                  </>
                ) : (
                  <Button 
                    type="button"
                    className="bg-epu-primary hover:bg-epu-primary/90"
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
      </Tabs>
    </div>
  );
};

export default ProfilePage;
