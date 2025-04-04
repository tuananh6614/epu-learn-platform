
import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { Menu, X, User, LogOut, BookOpen, FileText, Home, ChevronDown } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const MainLayout = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Đã đăng xuất",
      description: "Hẹn gặp lại bạn tại EPU Learn",
    });
  };

  const navItems = [
    { name: "Trang chủ", path: "/", icon: Home },
    { name: "Khóa học", path: "/courses", icon: BookOpen },
    { name: "Tài liệu", path: "/documents", icon: FileText },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          isScrolled ? "bg-background/95 backdrop-blur-sm shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-epu-primary text-white font-bold p-1 rounded-md">
                EPU
              </div>
              <span className="font-bold text-lg md:text-xl">Learn</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-1 text-sm hover:text-epu-primary transition-colors ${
                  isActive(item.path) ? "text-epu-primary font-medium" : "text-foreground"
                }`}
              >
                <item.icon size={16} />
                {item.name}
              </Link>
            ))}

            {user?.role === "admin" && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-1">
                    Quản trị <ChevronDown size={14} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => navigate("/admin")}>
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/admin/users")}>
                    Quản lý người dùng
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>

          {/* Authentication Section */}
          <div className="flex items-center gap-2">
            {user ? (
              <div className="hidden md:flex items-center gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <User size={16} />
                      {user.fullName}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Tài khoản của bạn</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      Thông tin cá nhân
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      Khóa học của tôi
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      Tài liệu đã mua
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                      <LogOut size={16} className="mr-2" />
                      Đăng xuất
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="hidden md:flex gap-2">
                <Button
                  variant="outline"
                  className="text-epu-primary"
                  onClick={() => navigate("/login")}
                >
                  Đăng nhập
                </Button>
                <Button
                  className="bg-epu-primary hover:bg-epu-primary/90"
                  onClick={() => navigate("/register")}
                >
                  Đăng ký
                </Button>
              </div>
            )}

            {/* Mobile Navigation Trigger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="md:hidden flex"
                >
                  <Menu size={18} />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80%] sm:w-[300px]">
                <div className="flex flex-col gap-6 p-2">
                  <div className="flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2">
                      <div className="bg-epu-primary text-white font-bold p-1 rounded-md">
                        EPU
                      </div>
                      <span className="font-bold text-lg">Learn</span>
                    </Link>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <X size={18} />
                      </Button>
                    </SheetTrigger>
                  </div>

                  <nav className="flex flex-col gap-2">
                    {navItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-2 p-2 rounded-md hover:bg-muted ${
                          isActive(item.path) ? "bg-muted text-epu-primary font-medium" : ""
                        }`}
                      >
                        <item.icon size={18} />
                        {item.name}
                      </Link>
                    ))}

                    {user?.role === "admin" && (
                      <>
                        <div className="text-sm font-medium text-muted-foreground py-2">
                          Quản trị viên
                        </div>
                        <Link
                          to="/admin"
                          className="flex items-center gap-2 p-2 rounded-md hover:bg-muted"
                        >
                          Dashboard
                        </Link>
                        <Link
                          to="/admin/users"
                          className="flex items-center gap-2 p-2 rounded-md hover:bg-muted"
                        >
                          Quản lý người dùng
                        </Link>
                      </>
                    )}
                  </nav>

                  <div className="mt-auto flex flex-col gap-2">
                    {user ? (
                      <>
                        <div className="flex items-center gap-2 p-2">
                          <User size={18} className="text-epu-primary" />
                          <div>
                            <p className="font-medium">{user.fullName}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => navigate("/profile")}
                        >
                          Thông tin cá nhân
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => navigate("/profile")}
                        >
                          Khóa học của tôi
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => navigate("/profile")}
                        >
                          Tài liệu đã mua
                        </Button>
                        <Button
                          variant="destructive"
                          className="w-full"
                          onClick={handleLogout}
                        >
                          <LogOut size={16} className="mr-2" />
                          Đăng xuất
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => navigate("/login")}
                        >
                          Đăng nhập
                        </Button>
                        <Button
                          className="w-full bg-epu-primary hover:bg-epu-primary/90"
                          onClick={() => navigate("/register")}
                        >
                          Đăng ký
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-epu-dark text-white py-8">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-white text-epu-primary font-bold p-1 rounded-md">
                  EPU
                </div>
                <span className="font-bold text-lg">Learn</span>
              </div>
              <p className="text-sm text-gray-300">
                Nền tảng học tập trực tuyến hàng đầu của Trường Đại học Điện Lực
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Liên kết nhanh</h3>
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Liên hệ</h3>
              <p className="text-sm text-gray-300">
                Trường Đại học Điện Lực <br />
                235 Hoàng Quốc Việt, Cổ Nhuế, Bắc Từ Liêm, Hà Nội
              </p>
              <p className="text-sm text-gray-300 mt-2">
                Email: info@epu.edu.vn <br />
                Điện thoại: 024.38362672
              </p>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-gray-700 text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} EPU Learn. Đã đăng ký bản quyền.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
