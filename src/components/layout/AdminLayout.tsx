
import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BookOpen,
  FileText,
  Users,
  ChevronLeft,
  Home,
  LogOut,
  User,
  BarChart2,
  Menu,
  X,
  Settings,
  LucideIcon,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";

type NavItemProps = {
  icon: LucideIcon;
  label: string;
  to: string;
  isActive: boolean;
  onClick?: () => void;
};

const NavItem = ({ icon: Icon, label, to, isActive, onClick }: NavItemProps) => (
  <Link
    to={to}
    className={`flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
      isActive 
        ? "bg-epu-primary text-white" 
        : "hover:bg-epu-primary/10 text-foreground"
    }`}
    onClick={onClick}
  >
    <Icon size={18} />
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
    return location.pathname.includes(path);
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
    { icon: Home, label: "Tổng quan", to: "/admin" },
    { icon: BookOpen, label: "Khóa học", to: "/admin/courses" },
    { icon: FileText, label: "Tài liệu", to: "/admin/documents" },
    { icon: Users, label: "Người dùng", to: "/admin/users" },
    { icon: BarChart2, label: "Thống kê", to: "/admin/stats" },
    { icon: Settings, label: "Cài đặt", to: "/admin/settings" },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background">
      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-epu-primary text-white font-bold p-1 rounded-md">
            EPU
          </div>
          <span className="font-bold">Admin</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </header>

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 w-64 bg-white md:shadow-sm border-r transition-transform fixed md:sticky top-0 bottom-0 left-0 z-30 md:z-0 overflow-y-auto`}
        style={{ height: isMobile ? "calc(100vh - 64px)" : "100vh", marginTop: isMobile ? "64px" : 0 }}
      >
        <div className="p-4 flex flex-col h-full">
          <div className="flex items-center gap-2 mb-6 md:mb-8 hidden md:flex">
            <div className="bg-epu-primary text-white font-bold p-1 rounded-md">
              EPU
            </div>
            <span className="font-bold">Admin</span>
          </div>
          
          <div className="flex flex-col gap-1">
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
            <Separator />
          </div>
          
          <div className="mt-auto pt-4">
            <Button
              variant="outline"
              className="w-full justify-start text-epu-primary mb-2"
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
            <div className="mt-4 p-3 border rounded-md bg-muted/30">
              <div className="flex items-center gap-2">
                <User size={20} className="text-epu-primary" />
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
          className="fixed inset-0 bg-black/30 z-20"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 min-h-screen">
        <div className="container max-w-7xl mx-auto p-4 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
