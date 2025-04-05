import { useState, useRef } from "react";
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
import { FileText, Search, Plus, Edit, Trash2, BarChart2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Particles } from "@/components/ui/Particles";

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
  const [documents, setDocuments] = useState(mockDocuments);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    id: null,
    title: "",
    price: 0,
    specialization: "",
    description: "",
  });
  const { toast } = useToast();
  const uploadFormRef = useRef<HTMLFormElement>(null);
  
  // Filter documents based on search term
  const filteredDocuments = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle upload form
  const toggleUploadForm = () => {
    setIsUploading(!isUploading);
  };

  // Handle edit document
  const handleEditClick = (document) => {
    setSelectedDocument(document);
    setEditForm({
      id: document.id,
      title: document.title,
      price: document.price,
      specialization: document.specialization,
      description: "Mô tả chi tiết về tài liệu", // Assuming there's a description field
    });
    setIsEditDialogOpen(true);
  };

  // Handle edit form submission
  const handleEditSubmit = (e) => {
    e.preventDefault();
    
    setDocuments(documents.map(doc => 
      doc.id === editForm.id 
        ? { ...doc, title: editForm.title, price: editForm.price, specialization: editForm.specialization }
        : doc
    ));
    
    setIsEditDialogOpen(false);
    toast({
      title: "Cập nhật thành công",
      description: "Thông tin tài liệu đã được cập nhật",
    });
  };

  // Handle delete document
  const handleDeleteClick = (document) => {
    setSelectedDocument(document);
    setIsDeleteDialogOpen(true);
  };

  // Confirm delete document
  const confirmDelete = () => {
    setDocuments(documents.filter(doc => doc.id !== selectedDocument.id));
    setIsDeleteDialogOpen(false);
    
    toast({
      title: "Xóa thành công",
      description: "Tài liệu đã được xóa khỏi hệ thống",
      variant: "default",
    });
  };

  // Handle new document submission
  const handleNewDocumentSubmit = (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const fileInput = e.target.querySelector('input[type="file"]');
    let fileType = "";
    
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      const fileName = fileInput.files[0].name;
      fileType = fileName.split('.').pop().toUpperCase();
    }
    
    const newDocument = {
      id: documents.length + 1,
      title: String(formData.get("title")),
      type: fileType || "PDF",
      size: "0 MB",
      price: parseInt(String(formData.get("price")), 10) || 0,
      downloads: 0,
      date: new Date().toISOString().split('T')[0],
      specialization: String(formData.get("specialization"))
    };
    
    setDocuments([...documents, newDocument]);
    setIsUploading(false);
    
    toast({
      title: "Thêm tài liệu thành công",
      description: "Tài liệu mới đã được thêm vào hệ thống",
    });
    
    // Reset form
    if (uploadFormRef.current) {
      uploadFormRef.current.reset();
    }
  };

  // Get file icon based on file type
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'PDF':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'PPTX':
        return <FileText className="h-5 w-5 text-orange-500" />;
      case 'ZIP':
        return <FileText className="h-5 w-5 text-blue-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Quản lý tài liệu</h1>
          <p className="text-muted-foreground">
            Quản lý và theo dõi tài liệu học tập
          </p>
        </div>
        <Button 
          onClick={toggleUploadForm} 
          className="md:w-auto w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
        >
          <Plus className="mr-2 h-4 w-4" />
          {isUploading ? "Đóng form" : "Thêm tài liệu mới"}
        </Button>
      </div>

      {/* Upload Form */}
      {isUploading && (
        <Card className="border border-blue-300/30 dark:border-blue-500/20 shadow-md overflow-hidden backdrop-blur-sm bg-white/5 dark:bg-blue-950/20">
          <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b border-blue-300/30 dark:border-blue-500/20">
            <CardTitle className="text-blue-600 dark:text-blue-300">Đăng tải tài liệu mới</CardTitle>
            <CardDescription>Điền thông tin để đăng tải tài liệu cho học viên</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form id="uploadForm" ref={uploadFormRef} className="space-y-4" onSubmit={handleNewDocumentSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-blue-600 dark:text-blue-300">Tiêu đề</Label>
                  <Input id="title" name="title" placeholder="Nhập tiêu đề tài liệu" 
                    className="border-blue-300/50 dark:border-blue-500/30 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 bg-white/10 dark:bg-blue-950/30"
                    required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialization" className="text-blue-600 dark:text-blue-300">Chuyên ngành</Label>
                  <select 
                    id="specialization"
                    name="specialization"
                    className="flex h-10 w-full rounded-md border border-blue-300/50 dark:border-blue-500/30 bg-white/10 dark:bg-blue-950/30 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="">-- Chọn chuyên ngành --</option>
                    <option value="CNTT">Công nghệ thông tin</option>
                    <option value="ATTT">An toàn thông tin</option>
                    <option value="DTVT">Điện tử viễn thông</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-blue-600 dark:text-blue-300">Giá (VND)</Label>
                  <Input id="price" name="price" type="number" placeholder="Ví dụ: 150000" 
                    className="border-blue-300/50 dark:border-blue-500/30 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 bg-white/10 dark:bg-blue-950/30"
                    required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file" className="text-blue-600 dark:text-blue-300">Tệp tin</Label>
                  <Input id="file" name="file" type="file" 
                    className="border-blue-300/50 dark:border-blue-500/30 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 bg-white/10 dark:bg-blue-950/30"
                    required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-blue-600 dark:text-blue-300">Mô tả</Label>
                <Textarea id="description" name="description" placeholder="Mô tả nội dung tài liệu" rows={4} 
                  className="border-blue-300/50 dark:border-blue-500/30 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 bg-white/10 dark:bg-blue-950/30" />
              </div>
              <Button 
                type="submit" 
                className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
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
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-blue-400 dark:text-blue-300" />
          <Input
            placeholder="Tìm kiếm tài liệu..."
            className="pl-8 border-blue-300/50 dark:border-blue-500/30 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 bg-white/10 dark:bg-blue-950/30"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Documents Table */}
      <Card className="border border-blue-300/30 dark:border-blue-500/20 shadow-md overflow-hidden backdrop-blur-sm bg-white/5 dark:bg-blue-950/20">
        <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b border-blue-300/30 dark:border-blue-500/20">
          <CardTitle className="flex items-center text-blue-600 dark:text-blue-300">
            <FileText className="mr-2 h-5 w-5 text-blue-500/80 dark:text-blue-400/90" />
            Danh sách tài liệu
          </CardTitle>
          <CardDescription>
            Tổng cộng {filteredDocuments.length} tài liệu
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 hover:from-blue-500/15 hover:to-purple-500/15">
                  <TableHead className="font-semibold text-blue-700 dark:text-blue-300">Tiêu đề</TableHead>
                  <TableHead className="font-semibold text-blue-700 dark:text-blue-300">Dạng</TableHead>
                  <TableHead className="font-semibold text-blue-700 dark:text-blue-300">Kích thước</TableHead>
                  <TableHead className="font-semibold text-blue-700 dark:text-blue-300">Chuyên ngành</TableHead>
                  <TableHead className="font-semibold text-blue-700 dark:text-blue-300">Giá (VND)</TableHead>
                  <TableHead className="font-semibold text-blue-700 dark:text-blue-300">Lượt tải</TableHead>
                  <TableHead className="font-semibold text-blue-700 dark:text-blue-300">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((doc) => (
                  <TableRow key={doc.id} className="border-b border-blue-200/30 dark:border-blue-500/20 hover:bg-blue-500/5 dark:hover:bg-blue-700/10 transition-colors duration-150">
                    <TableCell className="font-medium flex items-center py-3">
                      {getFileIcon(doc.type)}
                      <span className="ml-2">{doc.title}</span>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full bg-blue-100/80 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200">
                        {doc.type}
                      </span>
                    </TableCell>
                    <TableCell>{doc.size}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full bg-purple-100/80 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200">
                        {doc.specialization}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">{new Intl.NumberFormat('vi-VN').format(doc.price)}</TableCell>
                    <TableCell className="font-medium">{doc.downloads}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          title="Chỉnh sửa" 
                          className="border-blue-300/50 dark:border-blue-500/30 hover:bg-blue-500/10 dark:hover:bg-blue-700/20 text-blue-600 dark:text-blue-300"
                          onClick={() => handleEditClick(doc)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          title="Xóa" 
                          className="border-red-300/50 dark:border-red-500/30 hover:bg-red-500/10 dark:hover:bg-red-700/20 text-red-600 dark:text-red-300"
                          onClick={() => handleDeleteClick(doc)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Document Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px] border border-blue-300/30 dark:border-blue-500/20 shadow-lg bg-white/95 dark:bg-admin-darker/95 backdrop-blur-lg">
          <DialogHeader className="border-b border-blue-200/30 dark:border-blue-500/20 pb-4">
            <DialogTitle className="text-blue-600 dark:text-blue-300">Chỉnh sửa tài liệu</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin cho tài liệu. Nhấn lưu khi hoàn tất.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title" className="text-blue-600 dark:text-blue-300">Tiêu đề</Label>
                <Input
                  id="edit-title"
                  value={editForm.title}
                  onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                  className="border-blue-300/50 dark:border-blue-500/30 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 bg-white/10 dark:bg-blue-950/30"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-specialization" className="text-blue-600 dark:text-blue-300">Chuyên ngành</Label>
                <select 
                  id="edit-specialization"
                  value={editForm.specialization}
                  onChange={(e) => setEditForm({...editForm, specialization: e.target.value})}
                  className="flex h-10 w-full rounded-md border border-blue-300/50 dark:border-blue-500/30 bg-white/10 dark:bg-blue-950/30 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="CNTT">Công nghệ thông tin</option>
                  <option value="ATTT">An toàn thông tin</option>
                  <option value="DTVT">Điện tử viễn thông</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-price" className="text-blue-600 dark:text-blue-300">Giá (VND)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={editForm.price}
                  onChange={(e) => setEditForm({...editForm, price: parseInt(e.target.value)})}
                  className="border-blue-300/50 dark:border-blue-500/30 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 bg-white/10 dark:bg-blue-950/30"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description" className="text-blue-600 dark:text-blue-300">Mô tả</Label>
                <Textarea
                  id="edit-description"
                  value={editForm.description}
                  onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                  rows={4}
                  className="border-blue-300/50 dark:border-blue-500/30 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 bg-white/10 dark:bg-blue-950/30"
                />
              </div>
            </div>
            <DialogFooter className="border-t border-blue-200/30 dark:border-blue-500/20 pt-4">
              <Button type="button" variant="outline" 
                className="border-blue-300/50 dark:border-blue-500/30 hover:bg-blue-500/10 dark:hover:bg-blue-700/20 text-blue-600 dark:text-blue-300"
                onClick={() => setIsEditDialogOpen(false)}>
                Hủy
              </Button>
              <Button type="submit" 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-300">
                Lưu thay đổi
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px] border border-red-300/30 dark:border-red-500/20 shadow-lg bg-white/95 dark:bg-admin-darker/95 backdrop-blur-lg">
          <DialogHeader className="border-b border-red-200/30 dark:border-red-500/20 pb-4">
            <DialogTitle className="text-red-600 dark:text-red-300">Xác nhận xóa tài liệu</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa tài liệu này? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          {selectedDocument && (
            <div className="py-4 border-b border-red-200/30 dark:border-red-500/20">
              <p className="font-medium mb-1">{selectedDocument.title}</p>
              <p className="text-sm text-muted-foreground">Chuyên ngành: {selectedDocument.specialization}</p>
            </div>
          )}
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" 
              className="border-blue-300/50 dark:border-blue-500/30 hover:bg-blue-500/10 dark:hover:bg-blue-700/20 text-blue-600 dark:text-blue-300"
              onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button 
              type="button" 
              variant="destructive"
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
              onClick={confirmDelete}
            >
              Xóa tài liệu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Downloads Stats */}
      <Card className="border border-blue-300/30 dark:border-blue-500/20 shadow-md overflow-hidden backdrop-blur-sm bg-white/5 dark:bg-blue-950/20">
        <CardHeader className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-b border-blue-300/30 dark:border-blue-500/20">
          <CardTitle className="flex items-center text-blue-600 dark:text-blue-300">
            <BarChart2 className="mr-2 h-5 w-5 text-blue-500/80 dark:text-blue-400/90" />
            Thống kê lượt tải
          </CardTitle>
          <CardDescription>Phân tích lượt tài tài liệu theo thời gian</CardDescription>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center bg-gradient-to-b from-transparent to-blue-500/5 dark:to-blue-900/10">
          <div className="text-center text-muted-foreground">
            <FileText className="h-16 w-16 mx-auto mb-4 text-blue-500/20 dark:text-blue-400/10" />
            <p className="text-blue-600/80 dark:text-blue-300/80">Biểu đồ thống kê sẽ được hiển thị ở đây</p>
          </div>
        </CardContent>
      </Card>
      
      {/* Background Particles */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <Particles />
      </div>
    </div>
  );
};

export default DocumentsManagement;
