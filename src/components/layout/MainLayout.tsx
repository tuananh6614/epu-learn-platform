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
          <div className="absolute top-2
