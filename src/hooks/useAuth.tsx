
import React, { useState, useEffect, createContext, useContext } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/api";

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (fullName: string, email: string, password: string) => Promise<boolean>;
  updateUserInfo: (updates: { fullName?: string; newPassword?: string }) => void;
  loading: boolean;
};

type User = {
  email: string;
  fullName: string;
  role: "admin" | "user";
  userId?: number;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    const storedUser = localStorage.getItem("epu_user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        // Redirect to courses page when app loads if user is logged in
        navigate("/courses");
      } catch (error) {
        localStorage.removeItem("epu_user");
      }
    }
    setLoading(false);
  }, []);
  
  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      
      const userData = {
        email: response.user.email,
        fullName: response.user.full_name,
        role: response.user.role,
        userId: response.user.user_id
      };
      
      setUser(userData);
      localStorage.setItem("epu_user", JSON.stringify(userData));
      
      toast({
        title: "Đăng nhập thành công",
        description: `Chào mừng ${userData.fullName} quay trở lại EPU Learn`,
      });
      
      // Redirect to courses page
      navigate("/courses");
      
      return true;
    } catch (error) {
      toast({
        title: "Đăng nhập thất bại",
        description: "Email hoặc mật khẩu không chính xác",
        variant: "destructive",
      });
      
      return false;
    }
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem("epu_user");
    navigate("/");
  };
  
  const register = async (fullName: string, email: string, password: string) => {
    try {
      const response = await authService.register(fullName, email, password);
      
      const userData = {
        email: response.email,
        fullName: response.full_name,
        role: response.role,
        userId: response.user_id
      };
      
      setUser(userData);
      localStorage.setItem("epu_user", JSON.stringify(userData));
      
      toast({
        title: "Đăng ký thành công",
        description: `Chào mừng ${fullName} đến với EPU Learn`,
      });
      
      // Redirect new users to the courses page
      navigate("/courses");
      
      return true;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Đã xảy ra lỗi khi đăng ký";
      
      toast({
        title: "Đăng ký thất bại",
        description: errorMessage,
        variant: "destructive",
      });
      
      return false;
    }
  };

  const updateUserInfo = async (updates: { fullName?: string; newPassword?: string }) => {
    // Trong thực tế, đây sẽ gọi API để cập nhật thông tin người dùng
    if (user) {
      try {
        // Giả định gọi API cập nhật ở đây
        
        // Cập nhật thông tin local
        if (updates.fullName) {
          const updatedUser = {
            ...user,
            fullName: updates.fullName,
          };
          
          setUser(updatedUser);
          localStorage.setItem("epu_user", JSON.stringify(updatedUser));
          
          toast({
            title: "Cập nhật thành công",
            description: "Thông tin người dùng đã được cập nhật",
          });
        }
      } catch (error) {
        toast({
          title: "Cập nhật thất bại",
          description: "Đã xảy ra lỗi khi cập nhật thông tin người dùng",
          variant: "destructive",
        });
      }
    }
  };
  
  return (
    <AuthContext.Provider value={{ user, login, logout, register, updateUserInfo, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default useAuth;
