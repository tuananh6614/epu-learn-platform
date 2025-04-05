
import { useState, useEffect, useRef } from "react";
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
import { FileText, Search, Plus, Edit, Trash2, UploadCloud, Book, Download, Database } from "lucide-react";
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
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

// Document type definition
type Document = {
  id: number;
  title: string;
  description: string;
  file_type: string;
  file_size: string;
  price: number;
  downloads: number;
  created_at: string;
  specialization: string;
  file_path: string;
};

const DocumentsManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploaded, setIsUploaded] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    id: 0,
    title: "",
    price: 0,
    specialization: "",
    description: "",
  });
  const { toast } = useToast();
  const uploadFormRef = useRef<HTMLFormElement>(null);
  
  useEffect(() => {
    // This would be replaced with an actual API call in a real app
    const fetchDocuments = async () => {
      try {
        setIsLoading(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // In a real app, this would be an API call to fetch documents from the database
        setDocuments([]); // Start with an empty array - in a real app, this would be populated from an API
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching documents:", error);
        toast({
          title: "Lỗi khi tải dữ liệu",
          description: "Không thể tải danh sách tài liệu từ cơ sở dữ liệu",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, [toast]);

  // Filter documents based on search term
  const filteredDocuments = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle upload form
  const toggleUploadForm = () => {
    setIsUploading(!isUploading);
    // Reset upload state when closing the form
    if (isUploading) {
      setUploadProgress(0);
      setIsUploaded(false);
      if (uploadFormRef.current) {
        uploadFormRef.current.reset();
      }
    }
  };

  // Handle edit document
  const handleEditClick = (document: Document) => {
    setSelectedDocument(document);
    setEditForm({
      id: document.id,
      title: document.title,
      price: document.price,
      specialization: document.specialization,
      description: document.description || "",
    });
    setIsEditDialogOpen(true);
  };

  // Handle edit form submission
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // In a real app, this would be an API call to update the document in the database
      // For now, we'll just update the documents array
      const updatedDocuments = documents.map(doc => 
        doc.id === editForm.id 
          ? { 
              ...doc, 
              title: editForm.title, 
              price: editForm.price, 
              specialization: editForm.specialization,
              description: editForm.description 
            }
          : doc
      );
      
      setDocuments(updatedDocuments);
      setIsEditDialogOpen(false);
      toast({
        title: "Cập nhật thành công",
        description: "Thông tin tài liệu đã được cập nhật trong cơ sở dữ liệu",
      });
    } catch (error) {
      console.error("Error updating document:", error);
      toast({
        title: "Lỗi khi cập nhật",
        description: "Không thể cập nhật thông tin tài liệu trong cơ sở dữ liệu",
        variant: "destructive",
      });
    }
  };

  // Handle delete document
  const handleDeleteClick = (document: Document) => {
    setSelectedDocument(document);
    setIsDeleteDialogOpen(true);
  };

  // Confirm delete document
  const confirmDelete = async () => {
    if (!selectedDocument) return;
    
    try {
      // In a real app, this would be an API call to delete the document from the database
      // For now, we'll just filter the documents array
      setDocuments(documents.filter(doc => doc.id !== selectedDocument.id));
      setIsDeleteDialogOpen(false);
      
      toast({
        title: "Xóa thành công",
        description: "Tài liệu đã được xóa khỏi cơ sở dữ liệu",
        variant: "default",
      });
    } catch (error) {
      console.error("Error deleting document:", error);
      toast({
        title: "Lỗi khi xóa",
        description: "Không thể xóa tài liệu khỏi cơ sở dữ liệu",
        variant: "destructive",
      });
    }
  };

  // Handle new document submission
  const handleNewDocumentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Start upload progress animation
      setUploadProgress(0);
      const formData = new FormData(e.target as HTMLFormElement);
      const fileInput = (e.target as HTMLFormElement).querySelector('input[type="file"]') as HTMLInputElement;
      
      if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
        toast({
          title: "Lỗi",
          description: "Vui lòng chọn tệp tài liệu",
          variant: "destructive",
        });
        return;
      }
      
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 5;
        });
      }, 200);
      
      // In a real app, this would be an API call to upload the document to the server
      // and store the document information in the database
      await new Promise(resolve => setTimeout(resolve, 4000)); // Simulate upload delay
      
      clearInterval(interval);
      setUploadProgress(100);
      setIsUploaded(true);
      
      // Get file info
      const file = fileInput.files[0];
      const fileName = file.name;
      const fileType = fileName.split('.').pop()?.toUpperCase() || 'PDF';
      const fileSize = (file.size / (1024 * 1024)).toFixed(2); // Convert to MB
      
      // Create new document object
      const newDocument: Document = {
        id: documents.length > 0 ? Math.max(...documents.map(doc => doc.id)) + 1 : 1,
        title: String(formData.get("title")),
        description: String(formData.get("description")),
        file_type: fileType,
        file_size: `${fileSize} MB`,
        price: parseInt(String(formData.get("price")), 10) || 0,
        downloads: 0,
        created_at: new Date().toISOString(),
        specialization: String(formData.get("specialization")),
        file_path: `/uploads/${fileName}` // In a real app, this would be the path to the uploaded file
      };
      
      // Add new document to the list
      setDocuments([newDocument, ...documents]);
      
      toast({
        title: "Thêm tài liệu thành công",
        description: "Tài liệu mới đã được thêm vào cơ sở dữ liệu",
      });
      
      // Reset form after successful upload
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        setIsUploaded(false);
        if (uploadFormRef.current) {
          uploadFormRef.current.reset();
        }
      }, 1500);
    } catch (error) {
      console.error("Error adding document:", error);
      toast({
        title: "Lỗi khi thêm tài liệu",
        description: "Không thể thêm tài liệu vào cơ sở dữ liệu",
        variant: "destructive",
      });
      setUploadProgress(0);
      setIsUploaded(false);
    }
  };

  // Handle document download
  const handleDownload = (document: Document) => {
    toast({
      title: "Đang tải xuống",
      description: `Tài liệu "${document.title}" đang được tải xuống`,
    });
    
    // In a real app, this would trigger a download and update the download count in the database
    // For now, we'll just update the documents array
    const updatedDocuments = documents.map(doc => 
      doc.id === document.id 
        ? { ...doc, downloads: doc.downloads + 1 }
        : doc
    );
    
    setDocuments(updatedDocuments);
  };

  // Get file icon based on file type
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'PDF':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'PPTX':
      case 'PPT':
        return <FileText className="h-5 w-5 text-orange-500" />;
      case 'ZIP':
      case 'RAR':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'DOC':
      case 'DOCX':
        return <FileText className="h-5 w-5 text-blue-600" />;
      case 'XLS':
      case 'XLSX':
        return <FileText className="h-5 w-5 text-green-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Quản lý tài liệu</h1>
          <p className="text-muted-foreground">
            Quản lý và theo dõi tài liệu học tập trong cơ sở dữ liệu
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
            <CardTitle className="text-blue-600 dark:text-blue-300 flex items-center">
              <UploadCloud className="mr-2 h-5 w-5 text-blue-500" />
              Đăng tải tài liệu mới
            </CardTitle>
            <CardDescription>Điền thông tin và đăng tải tài liệu vào cơ sở dữ liệu</CardDescription>
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
                    <option value="MMT">Mạng máy tính</option>
                    <option value="HTTT">Hệ thống thông tin</option>
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
                  <Input id="file" name="file" type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.zip,.rar,.xls,.xlsx"
                    className="border-blue-300/50 dark:border-blue-500/30 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 bg-white/10 dark:bg-blue-950/30"
                    required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="text-blue-600 dark:text-blue-300">Mô tả</Label>
                <Textarea id="description" name="description" placeholder="Mô tả nội dung tài liệu" rows={4} 
                  className="border-blue-300/50 dark:border-blue-500/30 focus-visible:ring-blue-500 dark:focus-visible:ring-blue-400 bg-white/10 dark:bg-blue-950/30" />
              </div>
              
              {/* Upload progress */}
              {uploadProgress > 0 && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-600 dark:text-blue-300">Đang tải lên...</span>
                    <span className="text-blue-600 dark:text-blue-300">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-2 bg-blue-100 dark:bg-blue-900/30" />
                  
                  {isUploaded && (
                    <p className="text-sm text-green-600 dark:text-green-400 flex items-center">
                      <FileText className="h-4 w-4 mr-1" />
                      Tải lên thành công! Đang xử lý...
                    </p>
                  )}
                </div>
              )}
              
              <Button 
                type="submit" 
                className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                disabled={uploadProgress > 0}
              >
                {uploadProgress > 0 ? (
                  <span className="flex items-center">
                    <span className="animate-spin mr-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                      </svg>
                    </span>
                    Đang xử lý...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <UploadCloud className="mr-2 h-4 w-4" />
                    Đăng tài liệu
                  </span>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Database Connection Status */}
      <Card className="border border-blue-300/30 dark:border-blue-500/20 shadow-md overflow-hidden backdrop-blur-sm bg-white/5 dark:bg-blue-950/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Database className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium">Trạng thái kết nối CSDL:</span>
              <span className="text-sm text-green-600 dark:text-green-400 flex items-center">
                <span className="relative flex h-2 w-2 mr-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Đã kết nối
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              Tổng số tài liệu: {documents.length}
            </div>
          </div>
        </CardContent>
      </Card>

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
            <Book className="mr-2 h-5 w-5 text-blue-500/80 dark:text-blue-400/90" />
            Danh sách tài liệu
          </CardTitle>
          <CardDescription>
            {isLoading ? "Đang tải..." : `Hiển thị ${filteredDocuments.length} tài liệu`}
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
                  <TableHead className="font-semibold text-blue-700 dark:text-blue-300">Ngày tạo</TableHead>
                  <TableHead className="font-semibold text-blue-700 dark:text-blue-300">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  // Loading skeletons
                  Array(5).fill(0).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-20" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredDocuments.length > 0 ? (
                  filteredDocuments.map((doc) => (
                    <TableRow key={doc.id} className="border-b border-blue-200/30 dark:border-blue-500/20 hover:bg-blue-500/5 dark:hover:bg-blue-700/10 transition-colors duration-150">
                      <TableCell className="font-medium flex items-center py-3">
                        {getFileIcon(doc.file_type)}
                        <span className="ml-2">{doc.title}</span>
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full bg-blue-100/80 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200">
                          {doc.file_type}
                        </span>
                      </TableCell>
                      <TableCell>{doc.file_size}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-medium rounded-full bg-purple-100/80 dark:bg-purple-900/40 text-purple-800 dark:text-purple-200">
                          {doc.specialization}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">{new Intl.NumberFormat('vi-VN').format(doc.price)}</TableCell>
                      <TableCell className="font-medium">{doc.downloads}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{formatDate(doc.created_at)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            title="Tải xuống" 
                            className="border-green-300/50 dark:border-green-500/30 hover:bg-green-500/10 dark:hover:bg-green-700/20 text-green-600 dark:text-green-300"
                            onClick={() => handleDownload(doc)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
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
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <FileText size={48} className="mb-2 opacity-30" />
                        <p>Không có tài liệu nào{searchTerm ? " phù hợp với tìm kiếm" : ""}</p>
                        {searchTerm && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSearchTerm("")}
                            className="mt-4"
                          >
                            Xóa tìm kiếm
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Document Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px] border border-blue-300/30 dark:border-blue-500/20 shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-lg">
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
                  <option value="MMT">Mạng máy tính</option>
                  <option value="HTTT">Hệ thống thông tin</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-price" className="text-blue-600 dark:text-blue-300">Giá (VND)</Label>
                <Input
                  id="edit-price"
                  type="number"
                  value={editForm.price}
                  onChange={(e) => setEditForm({...editForm, price: parseInt(e.target.value) || 0})}
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
        <DialogContent className="sm:max-w-[425px] border border-red-300/30 dark:border-red-500/20 shadow-lg bg-white/95 dark:bg-slate-800/95 backdrop-blur-lg">
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
              <p className="text-sm text-muted-foreground">Giá: {new Intl.NumberFormat('vi-VN').format(selectedDocument.price)} VND</p>
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
      
      {/* Background Particles */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <Particles />
      </div>
    </div>
  );
};

export default DocumentsManagement;
