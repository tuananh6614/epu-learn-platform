
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  BookOpen,
  FileText,
  TrendingUp,
  Check,
  Clock,
  PieChart,
} from "lucide-react";
import { mockCourses, mockDocuments, mockUsers } from "@/lib/utils";

const AdminDashboard = () => {
  // Mock statistics - in a real app, these would come from the API
  const statistics = {
    totalUsers: mockUsers.length,
    totalCourses: mockCourses.length,
    totalDocuments: mockDocuments.length,
    averageCompletionRate: 67,
    pendingApprovals: 3,
    totalRevenue: 15000000, // In VND
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tổng quan</h1>
        <p className="text-muted-foreground">
          Quản lý và giám sát hoạt động của hệ thống
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
              Tổng số người dùng đã đăng ký
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Khóa học</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalCourses}</div>
            <p className="text-xs text-muted-foreground">Tổng số khóa học</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Tài liệu</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalDocuments}</div>
            <p className="text-xs text-muted-foreground">
              Tổng số tài liệu hiện có
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Tỉ lệ hoàn thành</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.averageCompletionRate}%</div>
            <p className="text-xs text-muted-foreground">
              Tỉ lệ hoàn thành khóa học
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Chờ duyệt</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.pendingApprovals}</div>
            <p className="text-xs text-muted-foreground">Yêu cầu chờ phê duyệt</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Doanh thu</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
                maximumFractionDigits: 0,
              }).format(statistics.totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground">Tổng doanh thu</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent activity */}
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
                  <p className="text-sm font-medium">Người dùng mới đăng ký</p>
                  <p className="text-xs text-muted-foreground">
                    Hoàng Văn E - 2 giờ trước
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-epu-secondary/10 flex items-center justify-center">
                  <BookOpen size={14} className="text-epu-secondary" />
                </div>
                <div>
                  <p className="text-sm font-medium">Khóa học mới được thêm</p>
                  <p className="text-xs text-muted-foreground">
                    Kỹ thuật lập trình với Python - 5 giờ trước
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-epu-accent/10 flex items-center justify-center">
                  <FileText size={14} className="text-epu-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium">Tài liệu mới được mua</p>
                  <p className="text-xs text-muted-foreground">
                    Giáo trình Mạng máy tính - 8 giờ trước
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Check size={14} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Khóa học hoàn thành</p>
                  <p className="text-xs text-muted-foreground">
                    Trần Thị B - Lập trình Web - 12 giờ trước
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Cần chú ý</CardTitle>
            <CardDescription>
              Các vấn đề cần sự chú ý của quản trị viên
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 border rounded-md border-red-200 bg-red-50">
                <h4 className="text-sm font-medium text-red-800 mb-1">
                  Cập nhật nội dung khóa học
                </h4>
                <p className="text-xs text-red-700">
                  Khóa học "An toàn và bảo mật thông tin" cần cập nhật nội dung mới
                </p>
              </div>
              <div className="p-3 border rounded-md border-amber-200 bg-amber-50">
                <h4 className="text-sm font-medium text-amber-800 mb-1">
                  Phê duyệt tài liệu mới
                </h4>
                <p className="text-xs text-amber-700">
                  3 tài liệu mới đang chờ được phê duyệt để đăng lên hệ thống
                </p>
              </div>
              <div className="p-3 border rounded-md border-blue-200 bg-blue-50">
                <h4 className="text-sm font-medium text-blue-800 mb-1">
                  Cập nhật giao diện hệ thống
                </h4>
                <p className="text-xs text-blue-700">
                  Dự kiến cập nhật giao diện mới vào ngày 15/04/2025
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
