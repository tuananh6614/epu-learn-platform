
import React, { useState, useEffect, createContext, useContext } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

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
  role: "admin" | "user"; // Added the role property back
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
  
  // Mock users for demo
  const mockUsers = [
    { email: "admin@epu.edu.vn", password: "admin123", fullName: "Admin EPU", role: "admin" as const },
    { email: "user@epu.edu.vn", password: "user123", fullName: "Học Viên Demo", role: "user" as const },
  ];
  
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
    // In a real app, this would be an API call
    const user = mockUsers.find(
      (u) => u.email === email && u.password === password
    );
    
    if (user) {
      const userData = {
        email: user.email,
        fullName: user.fullName,
        role: user.role
      };
      setUser(userData);
      localStorage.setItem("epu_user", JSON.stringify(userData));
      
      toast({
        title: "Đăng nhập thành công",
        description: `Chào mừng ${user.fullName} quay trở lại EPU Learn`,
      });
      
      // Redirect to courses page
      navigate("/courses");
      
      return true;
    } else {
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
    // Check if email already exists
    if (mockUsers.some((u) => u.email === email)) {
      toast({
        title: "Đăng ký thất bại",
        description: "Email đã được sử dụng",
        variant: "destructive",
      });
      return false;
    }
    
    // In a real app, this would be an API call to register the user
    // Changed: Don't set the user or store in localStorage here
    // Let the user login manually after registration
    
    toast({
      title: "Đăng ký thành công",
      description: `Tài khoản đã được tạo. Vui lòng đăng nhập để tiếp tục.`,
    });
    
    // Redirect to login page instead of courses
    navigate("/login");
    
    return true;
  };

  const updateUserInfo = (updates: { fullName?: string; newPassword?: string }) => {
    // In a real app, this would make an API call to update user info
    if (user) {
      // Update fullName if provided
      if (updates.fullName) {
        const updatedUser = {
          ...user,
          fullName: updates.fullName,
        };
        
        setUser(updatedUser);
        localStorage.setItem("epu_user", JSON.stringify(updatedUser));
      }
      
      // In a real app, would update password on backend
      if (updates.newPassword) {
        // This is just a mock update, in a real app this would make an API call
        console.log("Password would be updated to:", updates.newPassword);
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
