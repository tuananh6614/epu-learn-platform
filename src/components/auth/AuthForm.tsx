
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, LogIn, UserPlus, User, Mail } from "lucide-react";
import { motion } from "framer-motion";

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
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);

    // Basic input validation
    if (!formData.email || !formData.password) {
      toast({
        title: "Thông báo",
        description: "Vui lòng điền đầy đủ thông tin",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Simulate network delay
    setTimeout(() => {
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
          setIsLoading(false);
          return;
        }
        
        // Check if email already exists
        if (mockUsers.some(u => u.email === formData.email)) {
          toast({
            title: "Đăng ký thất bại",
            description: "Email đã được sử dụng",
            variant: "destructive",
          });
          setIsLoading(false);
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
      setIsLoading(false);
    }, 1000);
  };

  const toggleShowPassword = () => setShowPassword(!showPassword);

  // Animation variants
  const inputVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({ 
      opacity: 1, 
      y: 0,
      transition: { 
        delay: i * 0.1 + 0.1,
        duration: 0.4
      }
    })
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white/5 backdrop-blur-sm border-white/10 shadow-xl">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="text-2xl font-bold text-white flex items-center justify-center gap-2">
          {type === "login" ? (
            <>
              <LogIn className="h-6 w-6 text-epu-secondary" />
              <span>Đăng nhập</span>
            </>
          ) : (
            <>
              <UserPlus className="h-6 w-6 text-epu-secondary" />
              <span>Đăng ký</span>
            </>
          )}
        </CardTitle>
        <CardDescription className="text-white/70">
          {type === "login"
            ? "Đăng nhập để truy cập vào hệ thống EPU Learn"
            : "Đăng ký tài khoản mới để bắt đầu học tập"}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {type === "register" && (
            <motion.div 
              className="space-y-2"
              custom={0}
              initial="hidden"
              animate="visible"
              variants={inputVariants}
            >
              <Label htmlFor="fullName" className="text-white">Họ và Tên</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
                <Input
                  id="fullName"
                  name="fullName"
                  placeholder="Nhập họ và tên"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="bg-white/10 border-white/10 pl-10 text-white placeholder:text-white/50 focus:border-epu-secondary"
                />
              </div>
            </motion.div>
          )}
          
          <motion.div 
            className="space-y-2"
            custom={type === "register" ? 1 : 0}
            initial="hidden"
            animate="visible"
            variants={inputVariants}
          >
            <Label htmlFor="email" className="text-white">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                className="bg-white/10 border-white/10 pl-10 text-white placeholder:text-white/50 focus:border-epu-secondary"
              />
            </div>
          </motion.div>
          
          <motion.div 
            className="space-y-2"
            custom={type === "register" ? 2 : 1}
            initial="hidden"
            animate="visible"
            variants={inputVariants}
          >
            <Label htmlFor="password" className="text-white">Mật khẩu</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="bg-white/10 border-white/10 pl-10 pr-10 text-white placeholder:text-white/50 focus:border-epu-secondary"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                onClick={toggleShowPassword}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </motion.div>
        </CardContent>
        <CardFooter className="flex flex-col items-center gap-4 pt-2">
          <motion.div
            className="w-full"
            custom={type === "register" ? 3 : 2}
            initial="hidden"
            animate="visible"
            variants={inputVariants}
          >
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-epu-secondary to-epu-accent hover:opacity-90 transition-opacity text-white font-bold"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang xử lý...
                </div>
              ) : (
                type === "login" ? "Đăng nhập" : "Đăng ký"
              )}
            </Button>
          </motion.div>
          
          <motion.div
            custom={type === "register" ? 4 : 3}
            initial="hidden"
            animate="visible"
            variants={inputVariants}
          >
            {type === "login" ? (
              <p className="text-sm text-white/70">
                Chưa có tài khoản?{" "}
                <a 
                  href="/register" 
                  className="text-epu-secondary hover:text-epu-accent font-medium hover:underline transition-colors"
                >
                  Đăng ký ngay
                </a>
              </p>
            ) : (
              <p className="text-sm text-white/70">
                Đã có tài khoản?{" "}
                <a 
                  href="/login" 
                  className="text-epu-secondary hover:text-epu-accent font-medium hover:underline transition-colors"
                >
                  Đăng nhập
                </a>
              </p>
            )}
          </motion.div>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AuthForm;
