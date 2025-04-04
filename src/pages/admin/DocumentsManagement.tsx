
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
import { FileText, Search, Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

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
            <form id="uploadForm" ref={uploadFormRef} className="space-y-4" onSubmit={handleNewDocumentSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Tiêu đề</Label>
                  <Input id="title" name="title" placeholder="Nhập tiêu đề tài liệu" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="specialization">Chuyên ngành</Label>
                  <select 
                    id="specialization"
                    name="specialization"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="">-- Chọn chuyên ngành --</option>
                    <option value="CNTT">Công nghệ thông tin</option>
                    <option value="ATTT">An toàn thông tin</option>
                    <option value="DTVT">Điện tử viễn thông</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Giá (VND)</Label>
                  <Input id="price" name="price" type="number" placeholder="Ví dụ: 150000" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="file">Tệp tin</Label>
                  <Input id="file" name="file" type="file" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea id="description" name="description" placeholder="Mô tả nội dung tài liệu" rows={4} />
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
                      <Button 
                        variant="outline" 
                        size="icon" 
                        title="Chỉnh sửa" 
                        className="border-amber-200 hover:bg-amber-50"
                        onClick={() => handleEditClick(doc)}
                      >
                        <Edit className="h-4 w-4 text-amber-600" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        title="Xóa" 
                        className="text-red-500 hover:text-red-700 border-red-200 hover:bg-red-50"
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
        </CardContent>
      </Card>

      {/* Edit Document Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa tài liệu</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin cho tài liệu. Nhấn lưu khi hoàn tất.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Tiêu đề</Label>
                <Input
                  id="edit-title"
                  value={editForm.title}
                  onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-specialization">Chuyên ngành</Label>
                <select 
                  id="edit-specialization"
                  value={editForm.specialization}
                  onChange={(e) => setEditForm({...editForm, specialization: e.target.value})}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="CNTT">Công nghệ thông tin</option>
                  <option value="ATTT">An toàn thông tin</option>
                  <option value="DTVT">Điện tử viễn thông</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-price">Giá (VND)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={editForm.price}
                  onChange={(e) => setEditForm({...editForm, price: parseInt(e.target.value)})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Mô tả</Label>
                <Textarea
                  id="edit-description"
                  value={editForm.description}
                  onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Hủy
              </Button>
              <Button type="submit" className="bg-amber-600 hover:bg-amber-700">
                Lưu thay đổi
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa tài liệu</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa tài liệu này? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          {selectedDocument && (
            <div className="py-4">
              <p className="font-medium">{selectedDocument.title}</p>
              <p className="text-sm text-muted-foreground">Chuyên ngành: {selectedDocument.specialization}</p>
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button 
              type="button" 
              variant="destructive"
              onClick={confirmDelete}
            >
              Xóa tài liệu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Downloads Stats */}
      <Card className="border-amber-200">
        <CardHeader className="bg-amber-50">
          <CardTitle>Thống kê lượt tải</CardTitle>
          <CardDescription>Phân tích lượt tài tài liệu theo thời gian</CardDescription>
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
