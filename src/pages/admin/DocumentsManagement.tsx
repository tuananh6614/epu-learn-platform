
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Search, Plus, Download, Edit, Trash2 } from "lucide-react";

// Mock documents
const mockDocuments = [
  {
    id: 1,
    title: "Giáo trình Mạng máy tính",
    type: "PDF",
    size: "4.2 MB",
    price: 150000,
    downloads: 126,
    date: "2025-04-01",
    specialization: "CNTT"
  },
  {
    id: 2,
    title: "Tài liệu Bảo mật mạng",
    type: "PDF",
    size: "2.8 MB",
    price: 100000,
    downloads: 95,
    date: "2025-03-28",
    specialization: "ATTT"
  },
  {
    id: 3,
    title: "Slide môn học IoT",
    type: "PPTX",
    size: "6.5 MB",
    price: 120000,
    downloads: 78,
    date: "2025-03-25",
    specialization: "DTVT"
  },
  {
    id: 4,
    title: "Lab hướng dẫn Python",
    type: "ZIP",
    size: "8.2 MB",
    price: 200000,
    downloads: 105,
    date: "2025-03-20",
    specialization: "CNTT"
  },
];

const DocumentsManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  
  // Filter documents based on search term
  const filteredDocuments = mockDocuments.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle upload form
  const toggleUploadForm = () => {
    setIsUploading(!isUploading);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý tài liệu</h1>
          <p className="text-muted-foreground">
            Quản lý và theo dõi tài liệu học tập
          </p>
        </div>
        <Button 
          onClick={toggleUploadForm} 
          className="md:w-auto w-full bg-amber-600 hover:bg-amber-700 text-white"
        >
          <Plus className="mr-2 h-4 w-4" />
          {isUploading ? "Đóng form" : "Thêm tài liệu mới"}
        </Button>
      </div>

      {/* Upload Form */}
      {isUploading && (
        <Card className="border-amber-200">
          <CardHeader className="bg-amber-50">
            <CardTitle>Đăng tải tài liệu mới</CardTitle>
            <CardDescription>Điền thông tin để đăng tải tài liệu cho học viên</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Tiêu đề</Label>
                  <Input id="title" placeholder="Nhập tiêu đề tài liệu" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialization">Chuyên ngành</Label>
                  <select 
                    id="specialization"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">-- Chọn chuyên ngành --</option>
                    <option value="CNTT">Công nghệ thông tin</option>
                    <option value="ATTT">An toàn thông tin</option>
                    <option value="DTVT">Điện tử viễn thông</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Giá (VND)</Label>
                  <Input id="price" type="number" placeholder="Ví dụ: 150000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file">Tệp tin</Label>
                  <Input id="file" type="file" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea id="description" placeholder="Mô tả nội dung tài liệu" rows={4} />
              </div>
              <Button 
                type="submit" 
                className="w-full md:w-auto bg-amber-600 hover:bg-amber-700 text-white"
              >
                Đăng tài liệu
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Search */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm tài liệu..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Documents Table */}
      <Card className="border-amber-200">
        <CardHeader className="bg-amber-50">
          <CardTitle>Danh sách tài liệu</CardTitle>
          <CardDescription>
            Tổng cộng {filteredDocuments.length} tài liệu
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-amber-50">
                <TableHead>Tiêu đề</TableHead>
                <TableHead>Dạng</TableHead>
                <TableHead>Kích thước</TableHead>
                <TableHead>Chuyên ngành</TableHead>
                <TableHead>Giá (VND)</TableHead>
                <TableHead>Lượt tải</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-amber-600" />
                    {doc.title}
                  </TableCell>
                  <TableCell>{doc.type}</TableCell>
                  <TableCell>{doc.size}</TableCell>
                  <TableCell>{doc.specialization}</TableCell>
                  <TableCell>{new Intl.NumberFormat('vi-VN').format(doc.price)}</TableCell>
                  <TableCell>{doc.downloads}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="icon" title="Tải xuống" className="border-amber-200 hover:bg-amber-50">
                        <Download className="h-4 w-4 text-amber-600" />
                      </Button>
                      <Button variant="outline" size="icon" title="Chỉnh sửa" className="border-amber-200 hover:bg-amber-50">
                        <Edit className="h-4 w-4 text-amber-600" />
                      </Button>
                      <Button variant="outline" size="icon" title="Xóa" className="text-red-500 hover:text-red-700 border-red-200 hover:bg-red-50">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Downloads Stats */}
      <Card className="border-amber-200">
        <CardHeader className="bg-amber-50">
          <CardTitle>Thống kê lượt tải</CardTitle>
          <CardDescription>Phân tích lượt tải tài liệu theo thời gian</CardDescription>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <FileText className="h-16 w-16 mx-auto mb-4 opacity-20" />
            <p>Biểu đồ thống kê sẽ được hiển thị ở đây</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DocumentsManagement;
