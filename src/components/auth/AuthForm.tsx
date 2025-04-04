
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff } from "lucide-react";

type AuthFormProps = {
  type: "login" | "register";
  onSuccess?: () => void;
};

type FormData = {
  email: string;
  password: string;
  fullName?: string;
};

export const AuthForm = ({ type, onSuccess }: AuthFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    fullName: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  // Mock data for demonstration
  const mockUsers = [
    { email: "admin@epu.edu.vn", password: "admin123", role: "admin", fullName: "Admin" },
    { email: "user@epu.edu.vn", password: "user123", role: "user", fullName: "User Demo" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic input validation
    if (!formData.email || !formData.password) {
      toast({
        title: "Thông báo",
        description: "Vui lòng điền đầy đủ thông tin",
        variant: "destructive",
      });
      return;
    }

    // In real app, this would be API calls
    if (type === "login") {
      const user = mockUsers.find(
        (u) => u.email === formData.email && u.password === formData.password
      );
      
      if (user) {
        localStorage.setItem("epu_user", JSON.stringify({
          email: user.email,
          role: user.role,
          fullName: user.fullName
        }));
        
        toast({
          title: "Đăng nhập thành công",
          description: "Chào mừng bạn quay trở lại EPU Learn",
        });
        
        if (onSuccess) onSuccess();
      } else {
        toast({
          title: "Đăng nhập thất bại",
          description: "Email hoặc mật khẩu không chính xác",
          variant: "destructive",
        });
      }
    } else {
      // Register logic - in real app would create user in database
      if (!formData.fullName) {
        toast({
          title: "Thông báo",
          description: "Vui lòng nhập họ và tên đầy đủ",
          variant: "destructive",
        });
        return;
      }
      
      // Check if email already exists
      if (mockUsers.some(u => u.email === formData.email)) {
        toast({
          title: "Đăng ký thất bại",
          description: "Email đã được sử dụng",
          variant: "destructive",
        });
        return;
      }
      
      localStorage.setItem("epu_user", JSON.stringify({
        email: formData.email,
        role: "user",
        fullName: formData.fullName
      }));
      
      toast({
        title: "Đăng ký thành công",
        description: "Chào mừng bạn đến với EPU Learn",
      });
      
      if (onSuccess) onSuccess();
    }
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>
          {type === "login" ? "Đăng nhập" : "Đăng ký"}
        </CardTitle>
        <CardDescription>
          {type === "login"
            ? "Đăng nhập để truy cập vào hệ thống EPU Learn"
            : "Đăng ký tài khoản mới để bắt đầu học tập"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {type === "register" && (
            <div className="space-y-2">
              <Label htmlFor="fullName">Họ và Tên</Label>
              <Input
                id="fullName"
                name="fullName"
                placeholder="Nhập họ và tên"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                onClick={toggleShowPassword}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-4">
          <Button type="submit" className="w-full bg-epu-primary hover:bg-epu-primary/90">
            {type === "login" ? "Đăng nhập" : "Đăng ký"}
          </Button>
          {type === "login" ? (
            <p className="text-sm text-muted-foreground">
              Chưa có tài khoản?{" "}
              <a href="/register" className="text-epu-accent font-medium hover:underline">
                Đăng ký ngay
              </a>
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Đã có tài khoản?{" "}
              <a href="/login" className="text-epu-accent font-medium hover:underline">
                Đăng nhập
              </a>
            </p>
          )}
        </CardFooter>
      </form>
    </Card>
  );
};

export default AuthForm;
