import React, { useState, useEffect, createContext, useContext } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

type User = {
  id: number;
  email: string;
  role: "admin" | "user";
  fullName: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (fullName: string, email: string, password: string) => Promise<boolean>;
  updateUserInfo: (updates: { fullName?: string; newPassword?: string }) => void;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
    // Kiểm tra user trong localStorage khi component mount
    const storedUser = localStorage.getItem("epu_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Invalid user data in localStorage");
        localStorage.removeItem("epu_user");
      }
    }
    setLoading(false);
  }, []);

  const register = async (fullName: string, email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name: fullName,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Đăng ký thất bại",
          description: data.message || "Có lỗi xảy ra khi đăng ký",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Đăng ký thành công",
        description: "Vui lòng đăng nhập để tiếp tục",
      });

      navigate("/login");
      return true;
    } catch (error) {
      console.error("Register error:", error);
      toast({
        title: "Lỗi",
        description: "Không thể kết nối đến server",
        variant: "destructive",
      });
      return false;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Đăng nhập thất bại",
          description: data.message || "Email hoặc mật khẩu không đúng",
          variant: "destructive",
        });
        return false;
      }

      // Lưu token và thông tin user
      localStorage.setItem("epu_token", data.token);
      localStorage.setItem("epu_user", JSON.stringify(data.user));
      setUser(data.user);

      toast({
        title: "Đăng nhập thành công",
        description: `Chào mừng ${data.user.fullName}`,
      });

      // Chuyển hướng dựa vào role
      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/courses");
      }

      return true;
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Lỗi",
        description: "Không thể kết nối đến server",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("epu_token");
    localStorage.removeItem("epu_user");
    setUser(null);
    navigate("/login");
  };

  const updateUserInfo = async (updates: { fullName?: string; newPassword?: string }) => {
    if (!user) return;

    try {
      const token = localStorage.getItem("epu_token");
      const response = await fetch('http://localhost:5000/api/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      if (updates.fullName) {
        const updatedUser = {
          ...user,
          fullName: updates.fullName,
        };
        setUser(updatedUser);
        localStorage.setItem("epu_user", JSON.stringify(updatedUser));
      }

      toast({
        title: "Cập nhật thành công",
        description: "Thông tin của bạn đã được cập nhật",
      });
    } catch (error) {
      console.error("Update profile error:", error);
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật thông tin",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, updateUserInfo, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default useAuth;
