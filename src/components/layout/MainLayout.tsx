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
import { Menu, X, User, LogOut, BookOpen, FileText, Home, ChevronDown, Sparkles, GraduationCap, Phone, Mail, MapPin } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";

const MainLayout = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-700 ${
          isScrolled 
            ? "bg-background/80 backdrop-blur-lg shadow-lg dark:shadow-slate-800/30 dark:bg-black/90" 
            : "bg-transparent"
        }`}
      >
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div 
              whileHover={{ rotate: 5, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-epu-primary to-epu-accent text-white font-bold p-2 rounded-md shadow-md group-hover:shadow-lg transition-all duration-300"
            >
              <Sparkles size={16} className="inline-block mr-1" />
              EPU
            </motion.div>
            <span className="font-bold text-lg md:text-xl relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:bottom-0 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 group-hover:after:scale-x-100 group-hover:after:origin-bottom-left">
              Learn
            </span>
          </Link>

          <motion.nav 
            className="hidden md:flex items-center gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {navItems.map((item) => (
              <motion.div key={item.path} variants={itemVariants}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm transition-all duration-300 hover:bg-primary/10 dark:hover:bg-primary/20 ${
                    isActive(item.path) 
                      ? "text-primary font-medium bg-primary/5 dark:bg-primary/15" 
                      : "text-foreground"
                  }`}
                >
                  <item.icon size={18} className="text-primary" />
                  {item.name}
                </Link>
              </motion.div>
            ))}

            {user?.role === "admin" && (
              <motion.div variants={itemVariants}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-1 dark:text-white">
                      <GraduationCap size={18} className="text-primary" />
                      Quản trị <ChevronDown size={14} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="dark:bg-slate-900 dark:border-slate-800 w-56">
                    <DropdownMenuItem onClick={() => navigate("/admin")} className="dark:hover:bg-slate-800 dark:focus:bg-slate-800">
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/admin/users")} className="dark:hover:bg-slate-800 dark:focus:bg-slate-800">
                      Quản lý người dùng
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
            )}
          </motion.nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            
            {user ? (
              <div className="hidden md:flex items-center gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2 dark:border-slate-700 dark:bg-slate-900 dark:text-white">
                      <User size={16} className="text-primary" />
                      {user.fullName}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="dark:bg-slate-900 dark:border-slate-800 w-56">
                    <DropdownMenuLabel className="dark:text-white">Tài khoản của bạn</DropdownMenuLabel>
                    <DropdownMenuSeparator className="dark:bg-slate-700" />
                    <DropdownMenuItem onClick={() => navigate("/profile")} className="dark:hover:bg-slate-800 dark:focus:bg-slate-800">
                      Thông tin cá nhân
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/profile")} className="dark:hover:bg-slate-800 dark:focus:bg-slate-800">
                      Khóa học của tôi
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/profile")} className="dark:hover:bg-slate-800 dark:focus:bg-slate-800">
                      Tài liệu đã mua
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="dark:bg-slate-700" />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-500 dark:text-red-400 dark:hover:bg-slate-800 dark:focus:bg-slate-800">
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
                  className="border-primary text-primary hover:bg-primary/10 dark:border-primary dark:text-primary"
                  onClick={() => navigate("/login")}
                >
                  Đăng nhập
                </Button>
                <Button
                  className="bg-gradient-to-r from-epu-primary to-epu-accent hover:opacity-90 transition-opacity"
                  onClick={() => navigate("/register")}
                >
                  Đăng ký
                </Button>
              </div>
            )}

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="md:hidden flex dark:border-slate-700 dark:bg-slate-900"
                >
                  <Menu size={18} />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80%] sm:w-[300px] dark:bg-black dark:border-slate-800">
                <div className="flex flex-col gap-6 p-2 h-full">
                  <div className="flex justify-between items-center">
                    <Link to="/" className="flex items-center gap-2 group">
                      <div className="bg-gradient-to-r from-epu-primary to-epu-accent text-white font-bold p-2 rounded-md">
                        <Sparkles size={16} className="inline-block mr-1" />
                        EPU
                      </div>
                      <span className="font-bold text-lg">Learn</span>
                    </Link>
                    <div className="flex items-center gap-2">
                      <ThemeToggle />
                      <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="dark:hover:bg-white/10">
                          <X size={18} />
                        </Button>
                      </SheetTrigger>
                    </div>
                  </div>

                  <nav className="flex flex-col gap-2">
                    {navItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-2 p-3 rounded-md hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors duration-200 ${
                          isActive(item.path) ? "bg-primary/5 dark:bg-primary/15 text-primary font-medium" : ""
                        }`}
                      >
                        <item.icon size={18} className="text-primary" />
                        {item.name}
                      </Link>
                    ))}

                    {user?.role === "admin" && (
                      <>
                        <div className="text-sm font-medium text-muted-foreground py-2 mt-2 border-t dark:border-slate-800">
                          Quản trị viên
                        </div>
                        <Link
                          to="/admin"
                          className="flex items-center gap-2 p-3 rounded-md hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors duration-200"
                        >
                          <GraduationCap size={18} className="text-primary" />
                          Dashboard
                        </Link>
                        <Link
                          to="/admin/users"
                          className="flex items-center gap-2 p-3 rounded-md hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors duration-200"
                        >
                          <User size={18} className="text-primary" />
                          Quản lý người dùng
                        </Link>
                      </>
                    )}
                  </nav>

                  <div className="mt-auto flex flex-col gap-2">
                    {user ? (
                      <>
                        <div className="flex items-center gap-2 p-3 border-t dark:border-slate-800">
                          <div className="bg-primary/10 dark:bg-primary/20 p-2 rounded-full">
                            <User size={18} className="text-primary" />
                          </div>
                          <div>
                            <p className="font-medium dark:text-white">{user.fullName}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          className="w-full justify-start dark:border-slate-700 dark:text-white"
                          onClick={() => navigate("/profile")}
                        >
                          Thông tin cá nhân
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start dark:border-slate-700 dark:text-white"
                          onClick={() => navigate("/profile")}
                        >
                          Khóa học của tôi
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full justify-start dark:border-slate-700 dark:text-white"
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
                          className="w-full dark:border-slate-700 dark:text-white"
                          onClick={() => navigate("/login")}
                        >
                          Đăng nhập
                        </Button>
                        <Button
                          className="w-full bg-gradient-to-r from-epu-primary to-epu-accent hover:opacity-90 transition-opacity"
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

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-[#2A3142] text-white py-10 dark:bg-[#1A1F2C] border-t dark:border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-3 h-3 rounded-full bg-blue-500 opacity-30"></div>
          <div className="absolute top-40 left-20 w-2 h-2 rounded-full bg-green-500 opacity-30"></div>
          <div className="absolute top-20 right-40 w-2 h-2 rounded-full bg-red-500 opacity-30"></div>
          <div className="absolute bottom-20 right-20 w-3 h-3 rounded-full bg-yellow-500 opacity-30"></div>
          <div className="absolute bottom-40 left-1/3 w-2 h-2 rounded-full bg-purple-500 opacity-30"></div>
          <div className="absolute top-1/4 right-1/4 w-3 h-3 rounded-full bg-orange-500 opacity-30"></div>
        </div>
        
        <div className="container px-4 md:px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-gradient-to-r from-epu-primary to-epu-accent p-2 rounded-md text-white">
                  <Sparkles size={16} className="inline-block mr-1" />
                  EPU
                </div>
                <span className="font-bold text-lg">Learn</span>
              </div>
              <p className="text-sm text-gray-300 max-w-xs">
                Nền tảng học tập trực tuyến hàng đầu của Trường Đại học Điện Lực
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Liên kết nhanh</h3>
              <ul className="space-y-3">
                <li>
                  <Link to="/" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                    <Home size={16} />
                    Trang chủ
                  </Link>
                </li>
                <li>
                  <Link to="/courses" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                    <BookOpen size={16} />
                    Khóa học
                  </Link>
                </li>
                <li>
                  <Link to="/documents" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
                    <FileText size={16} />
                    Tài liệu
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Liên hệ</h3>
              <div className="space-y-3">
                <p className="text-sm text-gray-300 font-medium">
                  Trường Đại học Điện Lực
                </p>
                <p className="text-sm text-gray-300 flex items-start gap-2">
                  <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                  <span>235 Hoàng Quốc Việt, Cổ Nhuế, Bắc Từ Liêm, Hà Nội</span>
                </p>
                <p className="text-sm text-gray-300 flex items-center gap-2">
                  <Mail size={16} />
                  <span>Email: info@epu.edu.vn</span>
                </p>
                <p className="text-sm text-gray-300 flex items-center gap-2">
                  <Phone size={16} />
                  <span>Điện thoại: 024.38362672</span>
                </p>
              </div>
            </div>
          </div>
          
          <Separator className="my-6 bg-gray-700" />
          
          <div className="text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} EPU Learn. Đã đăng ký bản quyền.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
