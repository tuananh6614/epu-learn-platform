
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  Activity,
  Server,
  Database,
  Shield,
  Check,
  Clock,
  PieChart,
  AlertTriangle,
} from "lucide-react";
import { mockUsers } from "@/lib/utils";

const AdminDashboard = () => {
  // Mock statistics - in a real app, these would come from the API
  const statistics = {
    totalUsers: mockUsers.length,
    activeUsers: Math.floor(mockUsers.length * 0.7),
    systemUsage: 43,
    databaseSize: 284,
    securityAlerts: 2,
    pendingApprovals: 3,
    serverUptime: 99.98,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tổng quan hệ thống</h1>
        <p className="text-muted-foreground">
          Theo dõi và quản lý hoạt động của hệ thống
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Người dùng</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {statistics.activeUsers} người dùng đang hoạt động
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Hoạt động hệ thống</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.systemUsage}%</div>
            <p className="text-xs text-muted-foreground">Mức sử dụng CPU</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Cơ sở dữ liệu</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.databaseSize} MB</div>
            <p className="text-xs text-muted-foreground">Dung lượng đã sử dụng</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Bảo mật</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.securityAlerts}</div>
            <p className="text-xs text-muted-foreground">
              Cảnh báo bảo mật cần xử lý
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Xét duyệt</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.pendingApprovals}</div>
            <p className="text-xs text-muted-foreground">Yêu cầu chờ phê duyệt</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Máy chủ</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.serverUptime}%</div>
            <p className="text-xs text-muted-foreground">Thời gian hoạt động</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent activity and alerts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Hoạt động gần đây</CardTitle>
            <CardDescription>
              Các hoạt động diễn ra trong 24 giờ qua
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-epu-primary/10 flex items-center justify-center">
                  <Users size={14} className="text-epu-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Đăng nhập quản trị viên mới</p>
                  <p className="text-xs text-muted-foreground">
                    Nguyễn Văn A - 1 giờ trước
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-epu-secondary/10 flex items-center justify-center">
                  <Database size={14} className="text-epu-secondary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Sao lưu cơ sở dữ liệu</p>
                  <p className="text-xs text-muted-foreground">
                    Hoàn tất - 3 giờ trước
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-epu-accent/10 flex items-center justify-center">
                  <Shield size={14} className="text-epu-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium">Cập nhật chính sách bảo mật</p>
                  <p className="text-xs text-muted-foreground">
                    Admin - 7 giờ trước
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Check size={14} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Xét duyệt yêu cầu người dùng</p>
                  <p className="text-xs text-muted-foreground">
                    Admin - 12 giờ trước
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Cảnh báo hệ thống</CardTitle>
            <CardDescription>
              Các vấn đề cần sự chú ý của quản trị viên
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 border rounded-md border-red-200 bg-red-50">
                <h4 className="text-sm font-medium text-red-800 mb-1 flex items-center">
                  <AlertTriangle size={14} className="mr-1" />
                  Cảnh báo bảo mật cao
                </h4>
                <p className="text-xs text-red-700">
                  Phát hiện nỗ lực đăng nhập không thành công nhiều lần từ IP: 192.168.1.45
                </p>
              </div>
              <div className="p-3 border rounded-md border-amber-200 bg-amber-50">
                <h4 className="text-sm font-medium text-amber-800 mb-1">
                  Cần cập nhật hệ thống
                </h4>
                <p className="text-xs text-amber-700">
                  Có bản cập nhật bảo mật mới cho máy chủ cần được cài đặt
                </p>
              </div>
              <div className="p-3 border rounded-md border-blue-200 bg-blue-50">
                <h4 className="text-sm font-medium text-blue-800 mb-1">
                  Bảo trì theo lịch
                </h4>
                <p className="text-xs text-blue-700">
                  Bảo trì hệ thống dự kiến vào 00:00 ngày 15/04/2025
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
