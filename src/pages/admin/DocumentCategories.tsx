
import { useState, useEffect } from "react";
import axios from "axios";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { DocumentCategory } from "@/types/documentCategory";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";

const DocumentCategories = () => {
  const { toast } = useToast();
  const [categories, setCategories] = useState<DocumentCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<DocumentCategory | null>(null);
  const [formData, setFormData] = useState({
    category_name: "",
    description: ""
  });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/documents/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể tải danh sách danh mục tài liệu"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category_name.trim()) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Tên danh mục không được để trống"
      });
      return;
    }
    
    try {
      await axios.post("/api/documents/categories", formData);
      toast({
        title: "Thành công",
        description: "Đã thêm danh mục mới"
      });
      fetchCategories();
      setFormData({ category_name: "", description: "" });
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Error adding category:", error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể thêm danh mục mới"
      });
    }
  };

  const handleEditCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentCategory || !formData.category_name.trim()) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Tên danh mục không được để trống"
      });
      return;
    }
    
    try {
      await axios.put(`/api/documents/categories/${currentCategory.category_id}`, formData);
      toast({
        title: "Thành công",
        description: "Đã cập nhật danh mục"
      });
      fetchCategories();
      setCurrentCategory(null);
      setFormData({ category_name: "", description: "" });
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating category:", error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể cập nhật danh mục"
      });
    }
  };

  const handleDeleteCategory = async (category: DocumentCategory) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa danh mục "${category.category_name}"?`)) {
      return;
    }
    
    try {
      await axios.delete(`/api/documents/categories/${category.category_id}`);
      toast({
        title: "Thành công",
        description: "Đã xóa danh mục"
      });
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể xóa danh mục"
      });
    }
  };

  const openEditDialog = (category: DocumentCategory) => {
    setCurrentCategory(category);
    setFormData({
      category_name: category.category_name,
      description: category.description || ""
    });
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Danh mục tài liệu</h1>
          <p className="text-muted-foreground">
            Quản lý các danh mục phân loại tài liệu trong hệ thống
          </p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Thêm danh mục
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm danh mục tài liệu mới</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddCategory} className="space-y-4 mt-2">
              <div className="space-y-2">
                <Label htmlFor="category_name">Tên danh mục</Label>
                <Input
                  id="category_name"
                  name="category_name"
                  value={formData.category_name}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: Giáo trình"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Mô tả về danh mục này"
                  rows={3}
                />
              </div>
              <div className="flex justify-end">
                <Button type="submit">Lưu danh mục</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Danh sách danh mục</CardTitle>
          <CardDescription>
            Hiển thị tất cả danh mục tài liệu trong hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">Đang tải dữ liệu...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Tên danh mục</TableHead>
                  <TableHead>Mô tả</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <TableRow key={category.category_id}>
                      <TableCell>{category.category_id}</TableCell>
                      <TableCell className="font-medium">{category.category_name}</TableCell>
                      <TableCell>{category.description || "-"}</TableCell>
                      <TableCell>
                        {category.created_at ? new Date(category.created_at).toLocaleDateString('vi-VN') : "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(category)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive"
                            onClick={() => handleDeleteCategory(category)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      Chưa có danh mục nào được tạo
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa danh mục</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditCategory} className="space-y-4 mt-2">
            <div className="space-y-2">
              <Label htmlFor="edit_category_name">Tên danh mục</Label>
              <Input
                id="edit_category_name"
                name="category_name"
                value={formData.category_name}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit_description">Mô tả</Label>
              <Textarea
                id="edit_description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit">Cập nhật</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DocumentCategories;
