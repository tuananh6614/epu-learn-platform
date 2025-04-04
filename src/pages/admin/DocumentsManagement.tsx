
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, MoreHorizontal, Search, Edit, Trash2, ChevronDown, Upload, Download } from "lucide-react";
import { mockDocuments, formatCurrency } from "@/lib/utils";

const DocumentsManagement = () => {
  const { toast } = useToast();
  const [documents, setDocuments] = useState([...mockDocuments]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<any>(null);
  
  // Get unique categories from the documents
  const categories = Array.from(
    new Set(documents.map((doc) => doc.category_name))
  );

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.category_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNew = () => {
    setIsEditing(false);
    setCurrentDocument({
      id: documents.length + 1,
      title: "",
      description: "",
      preview_url: "",
      file_path: "",
      price: 0,
      category_name: categories[0] || "Không phân loại",
    });
    setDialogOpen(true);
  };

  const handleEdit = (document: any) => {
    setIsEditing(true);
    setCurrentDocument({ ...document });
    setDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    // In a real app, this would be an API call
    setDocuments(documents.filter((d) => d.id !== id));
    toast({
      title: "Xóa thành công",
      description: "Tài liệu đã được xóa khỏi hệ thống",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would be an API call
    if (isEditing) {
      setDocuments(
        documents.map((d) => (d.id === currentDocument.id ? currentDocument : d))
      );
      toast({
        title: "Cập nhật thành công",
        description: "Thông tin tài liệu đã được cập nhật",
      });
    } else {
      setDocuments([...documents, currentDocument]);
      toast({
        title: "Thêm mới thành công",
        description: "Tài liệu mới đã được thêm vào hệ thống",
      });
    }
    setDialogOpen(false);
  };

  const handleUploadClick = () => {
    toast({
      title: "Chức năng đang phát triển",
      description: "Tính năng tải tệp lên sẽ sớm được cập nhật",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản lý Tài liệu</h1>
          <p className="text-muted-foreground">
            Thêm, chỉnh sửa và quản lý các tài liệu học tập
          </p>
        </div>
        <Button
          className="bg-epu-primary hover:bg-epu-primary/90"
          onClick={handleAddNew}
        >
          <Plus size={16} className="mr-2" />
          Thêm tài liệu mới
        </Button>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Tìm kiếm tài liệu..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto flex gap-2">
              <ChevronDown size={16} />
              Lọc theo danh mục
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Tất cả tài liệu</DropdownMenuItem>
            <DropdownMenuSeparator />
            {categories.map((category) => (
              <DropdownMenuItem key={category}>{category}</DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Documents Table */}
      <div className="border rounded-md">
        <Table>
          <TableCaption>Danh sách tất cả tài liệu</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Tên tài liệu</TableHead>
              <TableHead className="hidden md:table-cell">Danh mục</TableHead>
              <TableHead className="text-center">Giá</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDocuments.length > 0 ? (
              filteredDocuments.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">{doc.id}</TableCell>
                  <TableCell>
                    <div className="max-w-sm">
                      <div className="font-medium">{doc.title}</div>
                      <div className="text-xs text-muted-foreground truncate">
                        {doc.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="outline">{doc.category_name}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {formatCurrency(doc.price)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal size={16} />
                          <span className="sr-only">Mở menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(doc)}>
                          <Edit size={14} className="mr-2" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleUploadClick}>
                          <Upload size={14} className="mr-2" />
                          Tải tệp mới
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleUploadClick}>
                          <Download size={14} className="mr-2" />
                          Tải xuống
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(doc.id)}
                          className="text-red-600"
                        >
                          <Trash2 size={14} className="mr-2" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <p className="text-muted-foreground">
                    Không tìm thấy tài liệu nào
                  </p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Document Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Chỉnh sửa tài liệu" : "Thêm tài liệu mới"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Cập nhật thông tin tài liệu"
                : "Điền thông tin tài liệu mới"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Tên tài liệu</Label>
                <Input
                  id="title"
                  value={currentDocument?.title || ""}
                  onChange={(e) =>
                    setCurrentDocument({ ...currentDocument, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  value={currentDocument?.description || ""}
                  onChange={(e) =>
                    setCurrentDocument({
                      ...currentDocument,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Danh mục</Label>
                <Select
                  value={currentDocument?.category_name}
                  onValueChange={(value) =>
                    setCurrentDocument({
                      ...currentDocument,
                      category_name: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Giá (VNĐ)</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="1000"
                  value={currentDocument?.price || 0}
                  onChange={(e) =>
                    setCurrentDocument({
                      ...currentDocument,
                      price: parseInt(e.target.value),
                    })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="file">Tệp tài liệu</Label>
                <div className="flex">
                  <Input
                    id="file_path"
                    value={currentDocument?.file_path || ""}
                    onChange={(e) =>
                      setCurrentDocument({
                        ...currentDocument,
                        file_path: e.target.value,
                      })
                    }
                    className="rounded-r-none"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    className="rounded-l-none"
                    onClick={handleUploadClick}
                  >
                    <Upload size={14} className="mr-2" />
                    Chọn tệp
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Chọn tệp PDF, DOC hoặc DOCX. Kích thước tối đa 10MB.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Hủy
              </Button>
              <Button type="submit" className="bg-epu-primary hover:bg-epu-primary/90">
                {isEditing ? "Cập nhật" : "Thêm mới"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentsManagement;
