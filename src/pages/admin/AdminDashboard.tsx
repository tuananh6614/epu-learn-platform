
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
  DollarSign,
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { mockUsers } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AdminDashboard = () => {
  // Mock statistics - in a real app, these would come from the API
  const statistics = {
    totalUsers: mockUsers.length,
    activeUsers: Math.floor(mockUsers.length * 0.7),
    coursesPublished: 12,
    documentsPublished: 28,
    documentsDownloaded: 348,
    revenue: 8420000,
    pendingReviews: 5,
  };

  // Mock recent transactions - would come from API
  const recentTransactions = [
    {
      id: 1,
      user: "Nguyễn Văn A",
      amount: 150000,
      item: "Tài liệu CNTT cơ bản",
      date: "04/04/2025",
      status: "completed"
    },
    {
      id: 2,
      user: "Trần Thị B",
      amount: 350000,
      item: "Khóa học Lập trình Web",
      date: "03/04/2025",
      status: "completed"
    },
    {
      id: 3,
      user: "Lê Văn C",
      amount: 200000,
      item: "Tài liệu An toàn mạng",
      date: "03/04/2025",
      status: "processing"
    },
    {
      id: 4,
      user: "Phạm Thị D",
      amount: 450000,
      item: "Khóa học AI cơ bản",
      date: "02/04/2025",
      status: "completed"
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-admin-primary to-admin-accent bg-clip-text text-transparent dark:from-admin-primary dark:to-admin-accent">Thống kê hệ thống</h1>
        <p className="text-muted-foreground">
          Xem nhanh các số liệu quan trọng và hoạt động gần đây
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="admin-stat-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
            <Users className="h-4 w-4 text-admin-primary dark:text-admin-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {statistics.activeUsers} người dùng hoạt động
            </p>
          </CardContent>
        </Card>
        
        <Card className="admin-stat-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Khóa học đã đăng</CardTitle>
            <BookOpen className="h-4 w-4 text-admin-secondary dark:text-admin-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.coursesPublished}</div>
            <p className="text-xs text-muted-foreground">
              {statistics.pendingReviews} đang chờ duyệt
            </p>
          </CardContent>
        </Card>
        
        <Card className="admin-stat-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Tài liệu đã đăng</CardTitle>
            <FileText className="h-4 w-4 text-admin-accent dark:text-admin-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.documentsPublished}</div>
            <p className="text-xs text-muted-foreground">
              {statistics.documentsDownloaded} lượt tải
            </p>
          </CardContent>
        </Card>
        
        <Card className="admin-stat-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Doanh thu (VND)</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('vi-VN').format(statistics.revenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="inline h-3 w-3 mr-1 text-green-500" />
              Tăng 8% so với tháng trước
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="admin-card">
        <CardHeader className="bg-gradient-to-r from-admin-primary/10 to-admin-accent/10 dark:from-admin-primary/20 dark:to-admin-accent/20 rounded-t-lg">
          <CardTitle>Giao dịch gần đây</CardTitle>
          <CardDescription>
            Các giao dịch được thực hiện trong 48 giờ qua
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-admin-primary/5 dark:bg-admin-primary/10">
                <TableHead>Người dùng</TableHead>
                <TableHead>Nội dung</TableHead>
                <TableHead>Ngày</TableHead>
                <TableHead>Số tiền (VND)</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTransactions.map((transaction) => (
                <TableRow key={transaction.id} className="border-b border-admin-border/10 dark:border-admin-border/20">
                  <TableCell className="font-medium">{transaction.user}</TableCell>
                  <TableCell>{transaction.item}</TableCell>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('vi-VN').format(transaction.amount)}
                  </TableCell>
                  <TableCell>
                    {transaction.status === "completed" ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        <CheckCircle className="w-3 h-3 mr-1" /> Hoàn tất
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                        <Clock className="w-3 h-3 mr-1" /> Đang xử lý
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* System Alerts */}
      <Card className="admin-card">
        <CardHeader className="bg-gradient-to-r from-admin-primary/10 to-admin-accent/10 dark:from-admin-primary/20 dark:to-admin-accent/20 rounded-t-lg">
          <CardTitle>Thông báo hệ thống</CardTitle>
          <CardDescription>
            Các vấn đề cần xử lý
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-3 rounded-md bg-amber-50 border border-amber-200 dark:bg-amber-900/20 dark:border-amber-800/30">
              <h4 className="text-sm font-medium text-amber-800 dark:text-amber-400 mb-1 flex items-center">
                <AlertTriangle size={14} className="mr-1" />
                Cần duyệt tài liệu mới
              </h4>
              <p className="text-xs text-amber-700 dark:text-amber-300/80">
                Có 3 tài liệu mới đang chờ duyệt từ giảng viên
              </p>
            </div>
            <div className="p-3 rounded-md bg-blue-50 border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/30">
              <h4 className="text-sm font-medium text-blue-800 dark:text-blue-400 mb-1">
                Báo cáo tài chính tháng
              </h4>
              <p className="text-xs text-blue-700 dark:text-blue-300/80">
                Báo cáo tài chính tháng 4/2025 sẽ được tạo vào 30/04/2025
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
