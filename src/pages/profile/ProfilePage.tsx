
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Settings, BookOpen, FileText } from "lucide-react";
import ProfileCourses from "@/pages/profile/ProfileCourses";
import ProfileDocuments from "@/pages/profile/ProfileDocuments";

const ProfilePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would be an API call to update user data
    toast({
      title: "Thông tin đã được cập nhật",
      description: "Thông tin cá nhân của bạn đã được cập nhật thành công",
    });
    setIsEditing(false);
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
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    readOnly={!isEditing}
                    className={!isEditing ? "bg-muted" : ""}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Vai trò</Label>
                  <Input
                    id="role"
                    value={user?.role === "admin" ? "Quản trị viên" : "Người dùng"}
                    readOnly
                    className="bg-muted"
                  />
                </div>
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
                        });
                      }}
                    >
                      Huỷ
                    </Button>
                    <Button type="submit" className="bg-epu-primary hover:bg-epu-primary/90">
                      Lưu thay đổi
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
