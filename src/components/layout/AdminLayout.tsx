
import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  BarChart2,
  FileText,
  PlusCircle,
  LogOut,
  User,
  Menu,
  X,
  DollarSign,
  Settings,
  ChevronLeft,
  Shield
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import { ThemeToggle } from "@/components/ui/theme-toggle";

type NavItemProps = {
  icon: React.ElementType;
  label: string;
  to: string;
  isActive: boolean;
  onClick?: () => void;
};

const NavItem = ({ icon: Icon, label, to, isActive, onClick }: NavItemProps) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
      isActive 
        ? "bg-primary/10 text-primary font-medium" 
        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10"
    }`}
    onClick={onClick}
  >
    <Icon size={18} className={isActive ? "text-primary" : "text-gray-500 dark:text-gray-400"} />
    <span>{label}</span>
  </Link>
);

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isMobile = useIsMobile();
  
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + "/");
  };
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };
  
  const closeSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };
  
  const navItems = [
    { icon: BarChart2, label: "Thống kê", to: "/admin" },
    { icon: PlusCircle, label: "Đăng khóa học", to: "/admin/publish/courses" },
    { icon: FileText, label: "Quản lý tài liệu", to: "/admin/documents" },
    { icon: User, label: "Quản lý người dùng", to: "/admin/users" },
    { icon: DollarSign, label: "Quản lý tài chính", to: "/admin/finance" },
    { icon: Settings, label: "Cài đặt", to: "/admin/settings" },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-slate-900">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-800 border-b dark:border-slate-700">
        <div className="flex items-center gap-2">
          <div className="bg-primary text-white font-bold p-1.5 rounded-md">
            EPU
          </div>
          <span className="font-bold">Quản trị viên</span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 w-56 bg-white dark:bg-slate-800 border-r dark:border-slate-700 fixed md:sticky top-0 bottom-0 left-0 z-30 md:z-0 overflow-y-auto transition-transform`}
        style={{ height: isMobile ? "calc(100vh - 64px)" : "100vh", marginTop: isMobile ? "64px" : 0 }}
      >
        <div className="p-4 flex flex-col h-full">
          {/* Admin Logo */}
          <div className="flex items-center gap-2 mb-6 md:mb-8 hidden md:flex">
            <div className="p-2 bg-primary text-white rounded-md">
              <Shield size={18} />
            </div>
            <div>
              <div className="font-bold text-primary">EPU Admin</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Hệ thống quản trị</div>
            </div>
          </div>
          
          <div className="flex flex-col gap-1 mt-2">
            {navItems.map(item => (
              <NavItem 
                key={item.to}
                icon={item.icon}
                label={item.label}
                to={item.to}
                isActive={isActive(item.to)}
                onClick={closeSidebar}
              />
            ))}
          </div>

          <div className="mt-4">
            <Separator className="bg-gray-200 dark:bg-slate-700" />
          </div>
          
          <div className="mt-auto pt-4">
            <Button
              variant="outline"
              className="w-full justify-start text-gray-700 dark:text-gray-300 border-gray-200 dark:border-slate-700 mb-2"
              onClick={() => {
                navigate("/");
                closeSidebar();
              }}
            >
              <ChevronLeft size={16} className="mr-2" />
              Quay lại trang chính
            </Button>
            <Button
              variant="destructive"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut size={16} className="mr-2" />
              Đăng xuất
            </Button>
          </div>

          {user && (
            <div className="mt-4 p-3 rounded-md bg-gray-50 dark:bg-slate-700/50 border border-gray-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <User size={20} className="text-gray-500 dark:text-gray-400" />
                <div>
                  <p className="text-sm font-medium">{user.fullName}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Backdrop for mobile */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/30 dark:bg-black/50 z-20 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 min-h-screen bg-gray-50 dark:bg-slate-900">
        {/* Admin header for desktop */}
        <div className="hidden md:block bg-white dark:bg-slate-800 border-b dark:border-slate-700">
          <div className="container max-w-7xl mx-auto flex justify-between items-center py-3 px-6">
            <h1 className="text-xl font-bold">Hệ thống Quản trị EPU</h1>
            <div className="flex items-center gap-4">
              {user && (
                <span className="text-sm mr-4">
                  Xin chào, {user.fullName}
                </span>
              )}
              <ThemeToggle />
              <Button 
                variant="outline" 
                size="sm" 
                className="text-gray-700 dark:text-gray-300"
                onClick={handleLogout}
              >
                <LogOut size={16} className="mr-2" />
                Đăng xuất
              </Button>
            </div>
          </div>
        </div>
        
        <div className="container max-w-7xl mx-auto p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
