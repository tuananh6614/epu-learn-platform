
import React, { useState, useEffect, createContext, useContext } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (fullName: string, email: string, password: string) => Promise<boolean>;
  loading: boolean;
};

type User = {
  email: string;
  role: "admin" | "user";
  fullName: string;
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
    { email: "admin@epu.edu.vn", password: "admin123", role: "admin", fullName: "Admin EPU" },
    { email: "user@epu.edu.vn", password: "user123", role: "user", fullName: "Học Viên Demo" },
  ];
  
  useEffect(() => {
    const storedUser = localStorage.getItem("epu_user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        
        // Auto-redirect based on role when app loads
        if (parsedUser.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/courses");
        }
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
        role: user.role as "admin" | "user",
        fullName: user.fullName,
      };
      setUser(userData);
      localStorage.setItem("epu_user", JSON.stringify(userData));
      
      toast({
        title: "Đăng nhập thành công",
        description: `Chào mừng ${user.fullName} quay trở lại EPU Learn`,
      });
      
      // Redirect based on user role
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/courses");
      }
      
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
    const newUser = {
      email,
      role: "user" as const,
      fullName,
    };
    
    setUser(newUser);
    localStorage.setItem("epu_user", JSON.stringify(newUser));
    
    toast({
      title: "Đăng ký thành công",
      description: `Chào mừng ${fullName} đến với EPU Learn`,
    });
    
    // Redirect new users to the courses page
    navigate("/courses");
    
    return true;
  };
  
  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default useAuth;
