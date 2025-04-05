
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DollarSign,
  Download,
  FilterIcon,
  Search,
  TrendingUp,
  TrendingDown,
  Calendar,
  FileText
} from "lucide-react";

// Mock transaction data
const mockTransactions = [
  {
    id: "T-1003",
    date: "2025-04-04",
    customer: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    amount: 450000,
    type: "Khóa học",
    item: "Khóa học Lập trình Web",
    status: "completed"
  },
  {
    id: "T-1002",
    date: "2025-04-03",
    customer: "Trần Thị B",
    email: "tranthib@example.com",
    amount: 150000,
    type: "Tài liệu",
    item: "Giáo trình Mạng máy tính",
    status: "completed"
  },
  {
    id: "T-1001",
    date: "2025-04-02",
    customer: "Lê Văn C",
    email: "levanc@example.com",
    amount: 350000,
    type: "Khóa học",
    item: "Khóa học Python cơ bản",
    status: "completed"
  },
  {
    id: "T-1000",
    date: "2025-04-01",
    customer: "Phạm Thị D",
    email: "phamthid@example.com",
    amount: 120000,
    type: "Tài liệu",
    item: "Tài liệu An toàn mạng",
    status: "completed"
  },
  {
    id: "T-999",
    date: "2025-03-31",
    customer: "Hoàng Văn E",
    email: "hoangvane@example.com",
    amount: 550000,
    type: "Khóa học",
    item: "Khóa học Security+",
    status: "refunded"
  }
];

// Monthly revenue data
const monthlyRevenue = [
  { month: "1/2025", amount: 5200000 },
  { month: "2/2025", amount: 7800000 },
  { month: "3/2025", amount: 8150000 },
  { month: "4/2025", amount: 1070000 } // Current month (partial)
];

const FinanceManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  // Calculate total revenue
  const totalRevenue = mockTransactions
    .filter(t => t.status !== "refunded")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  
  // Current month revenue
  const currentMonthRevenue = monthlyRevenue[monthlyRevenue.length - 1].amount;
  
  // Previous month revenue
  const previousMonthRevenue = monthlyRevenue[monthlyRevenue.length - 2].amount;
  
  // Calculate growth percentage
  const growthPercentage = ((currentMonthRevenue / previousMonthRevenue) - 1) * 100;
  
  // Filter transactions based on search and date range
  const filteredTransactions = mockTransactions.filter(transaction => {
    const matchesSearch = transaction.customer.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         transaction.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const transactionDate = new Date(transaction.date);
    const matchesStartDate = startDate ? transactionDate >= new Date(startDate) : true;
    const matchesEndDate = endDate ? transactionDate <= new Date(endDate) : true;
    
    return matchesSearch && matchesStartDate && matchesEndDate;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-admin-primary to-admin-accent bg-clip-text text-transparent dark:from-admin-primary dark:to-admin-accent">Quản lý tài chính</h1>
        <p className="text-muted-foreground">
          Theo dõi doanh thu và giao dịch
        </p>
      </div>
      
      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="admin-stat-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Tổng doanh thu</CardTitle>
            <DollarSign className="h-4 w-4 text-admin-primary dark:text-admin-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('vi-VN').format(totalRevenue)} VND
            </div>
            <p className="text-xs text-muted-foreground">
              Tổng doanh thu từ tất cả giao dịch
            </p>
          </CardContent>
        </Card>
        
        <Card className="admin-stat-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Tháng này</CardTitle>
            <Calendar className="h-4 w-4 text-admin-secondary dark:text-admin-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('vi-VN').format(currentMonthRevenue)} VND
            </div>
            <p className="text-xs flex items-center text-muted-foreground">
              {growthPercentage > 0 ? (
                <>
                  <TrendingUp className="inline h-3 w-3 mr-1 text-green-500" />
                  <span className="text-green-500">+{growthPercentage.toFixed(1)}%</span> so với tháng trước
                </>
              ) : (
                <>
                  <TrendingDown className="inline h-3 w-3 mr-1 text-red-500" />
                  <span className="text-red-500">{growthPercentage.toFixed(1)}%</span> so với tháng trước
                </>
              )}
            </p>
          </CardContent>
        </Card>
        
        <Card className="admin-stat-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Khóa học</CardTitle>
            <FileText className="h-4 w-4 text-admin-accent dark:text-admin-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('vi-VN').format(
                mockTransactions
                  .filter(t => t.type === "Khóa học" && t.status !== "refunded")
                  .reduce((sum, t) => sum + t.amount, 0)
              )} VND
            </div>
            <p className="text-xs text-muted-foreground">
              Doanh thu từ bán khóa học
            </p>
          </CardContent>
        </Card>
        
        <Card className="admin-stat-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Tài liệu</CardTitle>
            <FileText className="h-4 w-4 text-green-500 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Intl.NumberFormat('vi-VN').format(
                mockTransactions
                  .filter(t => t.type === "Tài liệu" && t.status !== "refunded")
                  .reduce((sum, t) => sum + t.amount, 0)
              )} VND
            </div>
            <p className="text-xs text-muted-foreground">
              Doanh thu từ bán tài liệu
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Chart */}
      <Card className="admin-card">
        <CardHeader className="bg-gradient-to-r from-admin-primary/10 to-admin-accent/10 dark:from-admin-primary/20 dark:to-admin-accent/20 rounded-t-lg">
          <CardTitle>Phân tích doanh thu</CardTitle>
          <CardDescription>Doanh thu theo tháng (VND)</CardDescription>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <TrendingUp className="h-16 w-16 mx-auto mb-4 opacity-20" />
            <p>Biểu đồ phân tích doanh thu sẽ được hiển thị ở đây</p>
          </div>
        </CardContent>
      </Card>
      
      {/* Transaction Table */}
      <Card className="admin-card">
        <CardHeader className="bg-gradient-to-r from-admin-primary/10 to-admin-accent/10 dark:from-admin-primary/20 dark:to-admin-accent/20 rounded-t-lg">
          <CardTitle>Lịch sử giao dịch</CardTitle>
          <CardDescription>
            Quản lý và tìm kiếm các giao dịch
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 mb-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tên, email, mã giao dịch..."
                className="pl-8 border-admin-border/30 dark:border-admin-border/50 focus:border-admin-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 md:w-auto">
              <div className="flex-1 md:w-auto">
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border-admin-border/30 dark:border-admin-border/50 focus:border-admin-primary"
                />
              </div>
              <div className="flex-1 md:w-auto">
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full border-admin-border/30 dark:border-admin-border/50 focus:border-admin-primary"
                />
              </div>
              <Button variant="outline" className="flex-none border-admin-border/30 dark:border-admin-border/50 text-admin-primary hover:bg-admin-primary/10 hover:text-admin-primary">
                <FilterIcon className="h-4 w-4 mr-2" />
                Lọc
              </Button>
              <Button variant="outline" className="flex-none border-admin-border/30 dark:border-admin-border/50 text-admin-primary hover:bg-admin-primary/10 hover:text-admin-primary">
                <Download className="h-4 w-4 mr-2" />
                Xuất Excel
              </Button>
            </div>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow className="bg-admin-primary/5 dark:bg-admin-primary/10">
                <TableHead>Mã</TableHead>
                <TableHead>Ngày</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Sản phẩm</TableHead>
                <TableHead>Số tiền (VND)</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id} className="border-b border-admin-border/10 dark:border-admin-border/20">
                  <TableCell className="font-medium">{transaction.id}</TableCell>
                  <TableCell>{new Date(transaction.date).toLocaleDateString("vi-VN")}</TableCell>
                  <TableCell>
                    <div>
                      <div>{transaction.customer}</div>
                      <div className="text-xs text-muted-foreground">{transaction.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div>{transaction.item}</div>
                      <div className="text-xs text-muted-foreground">{transaction.type}</div>
                    </div>
                  </TableCell>
                  <TableCell>{new Intl.NumberFormat('vi-VN').format(transaction.amount)}</TableCell>
                  <TableCell>
                    {transaction.status === "completed" ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        Hoàn tất
                      </span>
                    ) : transaction.status === "refunded" ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                        Hoàn tiền
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                        Đang xử lý
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinanceManagement;
