
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Menu, X, User, LogOut, BookOpen, FileText, Home, ChevronDown, Sparkles, GraduationCap, Phone, Mail, MapPin, Code, Users, Info, Heart, Star, Award, Globe, Briefcase } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

            <motion.div variants={itemVariants}>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 hover:bg-primary/10 dark:hover:bg-primary/20">
                    <Info size={18} className="text-primary" />
                    Giới thiệu
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[650px] max-h-[80vh] overflow-y-auto dark:bg-slate-900 dark:border-slate-800">
                  <DialogHeader>
                    <DialogTitle className="text-2xl flex items-center gap-2">
                      <Sparkles className="text-primary" size={20} />
                      <span className="text-gradient-to-r from-epu-primary to-epu-accent">Giới thiệu EPU Learn</span>
                    </DialogTitle>
                    <DialogDescription className="text-base">
                      Nền tảng học tập trực tuyến của Trường Đại học Điện Lực
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div className="bg-primary/5 dark:bg-primary/10 p-4 rounded-lg">
                      <h3 className="font-medium text-lg flex items-center gap-2">
                        <BookOpen size={16} className="text-primary" />
                        Giới thiệu chung
                      </h3>
                      <p className="mt-2 text-muted-foreground dark:text-gray-300">
                        EPU Learn là nền tảng học tập trực tuyến được xây dựng và phát triển bởi Trường Đại học Điện Lực, 
                        nhằm cung cấp cho sinh viên và học viên một môi trường học tập hiệu quả, linh hoạt và thuận tiện.
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <h3 className="font-medium flex items-center gap-2">
                          <GraduationCap size={16} className="text-blue-500" />
                          Khóa học đa dạng
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground dark:text-gray-300">
                          Hơn 200+ khóa học từ nhiều lĩnh vực khác nhau, đáp ứng nhu cầu học tập của mọi đối tượng.
                        </p>
                      </div>
                      
                      <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                        <h3 className="font-medium flex items-center gap-2">
                          <FileText size={16} className="text-green-500" />
                          Tài liệu chất lượng
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground dark:text-gray-300">
                          Thư viện tài liệu phong phú, được biên soạn bởi các giảng viên có nhiều năm kinh nghiệm.
                        </p>
                      </div>
                      
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                        <h3 className="font-medium flex items-center gap-2">
                          <Users size={16} className="text-purple-500" />
                          Cộng đồng hỗ trợ
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground dark:text-gray-300">
                          Tham gia cộng đồng học tập sôi động, kết nối với giảng viên và bạn học từ khắp mọi nơi.
                        </p>
                      </div>
                      
                      <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                        <h3 className="font-medium flex items-center gap-2">
                          <Code size={16} className="text-orange-500" />
                          Công nghệ hiện đại
                        </h3>
                        <p className="mt-2 text-sm text-muted-foreground dark:text-gray-300">
                          Ứng dụng công nghệ tiên tiến vào quá trình giảng dạy và học tập, tạo ra trải nghiệm học tập tốt nhất.
                        </p>
                      </div>
                    </div>
                    
                    {/* Đội ngũ phát triển */}
                    <div className="bg-gradient-to-r from-indigo-500/10 to-pink-500/10 dark:from-indigo-500/20 dark:to-pink-500/20 p-4 rounded-lg">
                      <h3 className="font-medium text-lg flex items-center gap-2 mb-3">
                        <Users size={16} className="text-indigo-500" />
                        Đội ngũ phát triển
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg">
                          <Avatar className="border-2 border-primary">
                            <AvatarImage src="/placeholder.svg" />
                            <AvatarFallback className="bg-primary/10 text-primary">NVA</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">Nguyễn Văn A</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Briefcase size={12} /> Trưởng nhóm phát triển
                            </p>
                            <p className="text-xs text-primary mt-0.5">MSSV: 2020601001</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg">
                          <Avatar className="border-2 border-primary">
                            <AvatarImage src="/placeholder.svg" />
                            <AvatarFallback className="bg-primary/10 text-primary">TTB</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">Trần Thị B</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Code size={12} /> Lập trình viên Frontend
                            </p>
                            <p className="text-xs text-primary mt-0.5">MSSV: 2020601002</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg">
                          <Avatar className="border-2 border-primary">
                            <AvatarImage src="/placeholder.svg" />
                            <AvatarFallback className="bg-primary/10 text-primary">LVC</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">Lê Văn C</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Code size={12} /> Lập trình viên Backend
                            </p>
                            <p className="text-xs text-primary mt-0.5">MSSV: 2020601003</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg">
                          <Avatar className="border-2 border-primary">
                            <AvatarImage src="/placeholder.svg" />
                            <AvatarFallback className="bg-primary/10 text-primary">PTD</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">Phạm Thị D</p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Heart size={12} /> Thiết kế UI/UX
                            </p>
                            <p className="text-xs text-primary mt-0.5">MSSV: 2020601004</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Thông tin giáo viên hướng dẫn */}
                    <div className="bg-gradient-to-r from-blue-500/10 to-teal-500/10 dark:from-blue-500/20 dark:to-teal-500/20 p-4 rounded-lg">
                      <h3 className="font-medium text-lg flex items-center gap-2 mb-3">
                        <Award size={16} className="text-blue-500" />
                        Giáo viên hướng dẫn
                      </h3>
                      
                      <div className="flex items-center gap-4 p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg">
                        <Avatar className="w-16 h-16 border-2 border-blue-500">
                          <AvatarImage src="/placeholder.svg" />
                          <AvatarFallback className="bg-blue-500/10 text-blue-500 text-lg">GV</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-lg">TS. Nguyễn Văn Giáo</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                            <Star size={14} className="text-yellow-500" /> Giảng viên Khoa Công nghệ thông tin
                          </p>
                          <div className="flex items-center gap-4 mt-2">
                            <p className="text-xs flex items-center gap-1">
                              <Mail size={12} className="text-blue-500" /> nguyenvangiao@epu.edu.vn
                            </p>
                            <p className="text-xs flex items-center gap-1">
                              <Phone size={12} className="text-green-500" /> 0123.456.789
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Thông tin liên hệ */}
                    <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 p-4 rounded-lg">
                      <h3 className="font-medium text-center">Tầm nhìn của chúng tôi</h3>
                      <p className="mt-2 text-center text-muted-foreground dark:text-gray-300">
                        "Trở thành nền tảng học tập trực tuyến hàng đầu tại Việt Nam, góp phần đào tạo nguồn nhân lực chất lượng cao cho xã hội"
                      </p>
                    </div>
                    
                    {/* Thông tin liên hệ */}
                    <div className="p-4 rounded-lg border border-primary/20">
                      <h3 className="font-medium text-lg flex items-center gap-2 mb-3">
                        <Phone size={16} className="text-primary" />
                        Thông tin liên hệ
                      </h3>
                      
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <MapPin size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium">Trường Đại học Điện Lực</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              235 Hoàng Quốc Việt, Cổ Nhuế, Bắc Từ Liêm, Hà Nội
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Mail size={18} className="text-blue-500 flex-shrink-0" />
                          <div>
                            <p className="font-medium">Email</p>
                            <p className="text-sm text-muted-foreground">
                              info@epu.edu.vn | support@epu.edu.vn
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Phone size={18} className="text-green-500 flex-shrink-0" />
                          <div>
                            <p className="font-medium">Điện thoại</p>
                            <p className="text-sm text-muted-foreground">
                              Văn phòng: 024.38362672 | Hỗ trợ kỹ thuật: 0987.654.321
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Globe size={18} className="text-purple-500 flex-shrink-0" />
                          <div>
                            <p className="font-medium">Website</p>
                            <p className="text-sm text-muted-foreground">
                              <a href="https://epu.edu.vn" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                epu.edu.vn
                              </a>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-center mt-4">
                      <Button 
                        onClick={() => navigate("/courses")}
                        className="bg-gradient-to-r from-epu-primary to-epu-accent hover:opacity-90 transition-opacity"
                      >
                        <BookOpen size={16} />
                        Khám phá khóa học
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </motion.div>

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

                    <Dialog>
                      <DialogTrigger asChild>
                        <button className="flex items-center gap-2 p-3 rounded-md hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors duration-200 text-start w-full">
                          <Info size={18} className="text-primary" />
                          Giới thiệu
                        </button>
                      </DialogTrigger>
                      <DialogContent className="max-h-[80vh] overflow-y-auto dark:bg-slate-900 dark:border-slate-800">
                        <DialogHeader>
                          <DialogTitle className="text-xl flex items-center gap-2">
                            <Sparkles className="text-primary" size={18} />
                            <span>Giới thiệu EPU Learn</span>
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-3 mt-3">
                          <p className="text-sm text-muted-foreground dark:text-gray-300">
                            EPU Learn là nền tảng học tập trực tuyến được phát triển bởi Trường Đại học Điện Lực.
                          </p>
                          
                          {/* Đội ngũ phát triển */}
                          <div className="mt-3 space-y-2">
                            <h3 className="text-sm font-medium flex items-center gap-1">
                              <Users size={14} className="text-primary" />
                              Đội ngũ phát triển
                            </h3>
                            <div className="grid grid-cols-1 gap-2">
                              <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                                <Avatar className="h-8 w-8 border border-primary">
                                  <AvatarFallback className="text-xs">NVA</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-xs font-medium">Nguyễn Văn A</p>
                                  <p className="text-xs text-muted-foreground">Trưởng nhóm</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                                <Avatar className="h-8 w-8 border border-primary">
                                  <AvatarFallback className="text-xs">TTB</AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-xs font-medium">Trần Thị B</p>
                                  <p className="text-xs text-muted-foreground">Frontend</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          {/* Giáo viên hướng dẫn */}
                          <div className="mt-3 space-y-2">
                            <h3 className="text-sm font-medium flex items-center gap-1">
                              <Award size={14} className="text-primary" />
                              Giáo viên hướng dẫn
                            </h3>
                            <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
                              <Avatar className="h-10 w-10 border border-primary">
                                <AvatarFallback>GV</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-xs font-medium">TS. Nguyễn Văn Giáo</p>
                                <p className="text-xs text-muted-foreground">Khoa CNTT</p>
                              </div>
                            </div>
                          </div>
                          
                          {/* Thông tin liên hệ */}
                          <div className="mt-3 space-y-2">
                            <h3 className="text-sm font-medium flex items-center gap-1">
                              <Phone size={14} className="text-primary" />
                              Liên hệ
                            </h3>
                            <div className="space-y-1">
                              <div className="flex items-start gap-2">
                                <MapPin size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
                                <p className="text-xs">235 Hoàng Quốc Việt, Cổ Nhuế, Bắc Từ Liêm, Hà Nội</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Mail size={14} className="text-blue-500" />
                                <p className="text-xs">info@epu.edu.vn</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Phone size={14} className="text-green-500" />
                                <p className="text-xs">024.38362672</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="pt-3">
                            <Button 
                              onClick={() => navigate("/courses")}
                              className="w-full bg-gradient-to-r from-epu-primary to-epu-accent hover:opacity-90 transition-opacity"
                            >
                              Khám phá khóa học
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

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
          <div className="absolute top-20 right-20 w-4 h-4 rounded-full bg-purple-500 opacity-20"></div>
          <div className="absolute bottom-10 right-10 w-2 h-2 rounded-full bg-yellow-500 opacity-30"></div>
        </div>
        
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-r from-epu-primary to-epu-accent text-white font-bold p-2 rounded-md">
                  <Sparkles size={16} className="inline-block mr-1" />
                  EPU
                </div>
                <span className="font-bold text-xl">Learn</span>
              </div>
              <p className="text-gray-300 text-sm">
                Nền tảng học tập trực tuyến của Trường Đại học Điện Lực, cung cấp các khóa học chất lượng cao với chi phí hợp lý.
              </p>
              <div className="flex items-center gap-3">
                <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19.7 3H4.3A1.3 1.3 0 003 4.3v15.4A1.3 1.3 0 004.3 21h15.4a1.3 1.3 0 001.3-1.3V4.3A1.3 1.3 0 0019.7 3zM8.339 18.338H5.667v-8.59h2.672v8.59zM7.004 8.574a1.548 1.548 0 11-.002-3.096 1.548 1.548 0 01.002 3.096zm11.335 9.764H15.67v-4.177c0-.996-.017-2.278-1.387-2.278-1.389 0-1.601 1.086-1.601 2.206v4.249h-2.667v-8.59h2.559v1.174h.036c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.779 3.203 4.092v4.711z" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Khám phá</h3>
              <ul className="space-y-2">
                <li><a href="/courses" className="text-gray-300 hover:text-white transition-colors text-sm">Tất cả khóa học</a></li>
                <li><a href="/documents" className="text-gray-300 hover:text-white transition-colors text-sm">Tài liệu học tập</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Blog giáo dục</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Đội ngũ giảng viên</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Câu hỏi thường gặp</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Danh mục</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Công nghệ thông tin</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Kỹ thuật điện</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Tự động hóa</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Kinh tế năng lượng</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors text-sm">Ngoại ngữ</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Liên hệ</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <MapPin size={16} className="text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-gray-300 text-sm">235 Hoàng Quốc Việt, Cổ Nhuế, Bắc Từ Liêm, Hà Nội</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail size={16} className="text-primary flex-shrink-0" />
                  <a href="mailto:info@epu.edu.vn" className="text-gray-300 hover:text-white transition-colors text-sm">info@epu.edu.vn</a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone size={16} className="text-primary flex-shrink-0" />
                  <a href="tel:02438362672" className="text-gray-300 hover:text-white transition-colors text-sm">024.38362672</a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-xs md:text-sm">© 2025 EPU Learn. Đại học Điện Lực. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-xs">Điều khoản sử dụng</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-xs">Chính sách bảo mật</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-xs">Trung tâm trợ giúp</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
