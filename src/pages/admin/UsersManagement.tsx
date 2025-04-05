
import { useState, useEffect } from "react";
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
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  MoreHorizontal, 
  Search, 
  Edit, 
  Trash2, 
  ChevronDown, 
  User as UserIcon, 
  Shield, 
  BookOpen, 
  FileText,
  Loader2
} from "lucide-react";

interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
  created_at: string;
}

const UsersManagement = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState<Partial<User> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("all");
  
  useEffect(() => {
    // This would be replaced with an actual API call
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // In a real app, this would fetch from the backend
        setUsers([]);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải danh sách người dùng",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [toast]);

  const filteredUsers = users.filter(
    (user) => {
      const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      
      return matchesSearch && matchesRole;
    }
  );

  const handleAddNew = () => {
    setIsEditing(false);
    setCurrentUser({
      fullName: "",
      email: "",
      role: "user",
    });
    setDialogOpen(true);
  };

  const handleEdit = (user: User) => {
    setIsEditing(true);
    setCurrentUser({ ...user });
    setDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    // In a real app, this would be an API call
    setUsers(users.filter((u) => u.id !== id));
    toast({
      title: "Xóa thành công",
      description: "Người dùng đã được xóa khỏi hệ thống",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) return;
    
    // In a real app, this would be an API call
    if (isEditing && currentUser.id) {
      setUsers(
        users.map((u) => (u.id === currentUser.id ? { ...currentUser as User } : u))
      );
      toast({
        title: "Cập nhật thành công",
        description: "Thông tin người dùng đã được cập nhật",
      });
    } else {
      const newUser = {
        ...currentUser,
        id: users.length ? Math.max(...users.map(u => u.id)) + 1 : 1,
        created_at: new Date().toISOString().split('T')[0]
      } as User;
      
      setUsers([...users, newUser]);
      toast({
        title: "Thêm mới thành công",
        description: "Người dùng mới đã được thêm vào hệ thống",
      });
    }
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Quản lý Người dùng</h1>
          <p className="text-muted-foreground">
            Thêm, chỉnh sửa và quản lý người dùng trong hệ thống
          </p>
        </div>
        <Button
          className="bg-primary hover:bg-primary/90 text-white"
          onClick={handleAddNew}
        >
          <Plus size={16} className="mr-2" />
          Thêm người dùng mới
        </Button>
      </div>

      <div className="rounded-lg border bg-card shadow-sm">
        <div className="p-4">
          {/* Search and filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              />
              <Input
                placeholder="Tìm kiếm người dùng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto flex gap-2">
                  <ChevronDown size={16} />
                  Lọc theo vai trò
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setRoleFilter("all")}>
                  Tất cả người dùng
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRoleFilter("admin")}>
                  Quản trị viên
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setRoleFilter("user")}>
                  Người dùng thường
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Users Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px]">ID</TableHead>
                  <TableHead>Tên đầy đủ</TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="text-center">Vai trò</TableHead>
                  <TableHead className="hidden md:table-cell">Ngày tạo</TableHead>
                  <TableHead className="text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      <div className="flex justify-center items-center">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <p>Đang tải dữ liệu...</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                            user.role === "admin" ? "bg-amber-500" : "bg-primary"
                          }`}>
                            {user.role === "admin" ? (
                              <Shield size={14} />
                            ) : (
                              <UserIcon size={14} />
                            )}
                          </div>
                          <span>{user.fullName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={user.role === "admin" ? "default" : "outline"}
                          className={user.role === "admin" 
                            ? "bg-amber-500 hover:bg-amber-600" 
                            : ""}
                        >
                          {user.role === "admin" ? "Quản trị viên" : "Người dùng"}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{user.created_at}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal size={16} />
                              <span className="sr-only">Mở menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleEdit(user)}>
                              <Edit size={14} className="mr-2 text-blue-500" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <BookOpen size={14} className="mr-2 text-blue-500" />
                              Xem khóa học đã đăng ký
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileText size={14} className="mr-2 text-blue-500" />
                              Xem tài liệu đã mua
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDelete(user.id)}
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
                    <TableCell colSpan={6} className="text-center py-10">
                      <p className="text-muted-foreground">
                        {searchTerm 
                          ? "Không tìm thấy người dùng nào phù hợp" 
                          : "Chưa có người dùng nào trong hệ thống"}
                      </p>
                      {!searchTerm && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mt-4"
                          onClick={handleAddNew}
                        >
                          <Plus size={16} className="mr-1" />
                          Thêm người dùng mới
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableCaption>Danh sách tất cả người dùng</TableCaption>
            </Table>
          </div>
        </div>
      </div>

      {/* Add/Edit User Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Chỉnh sửa thông tin người dùng" : "Thêm người dùng mới"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Cập nhật thông tin người dùng"
                : "Điền thông tin người dùng mới"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="fullName">Họ và tên</Label>
                <Input
                  id="fullName"
                  value={currentUser?.fullName || ""}
                  onChange={(e) =>
                    setCurrentUser({ ...currentUser, fullName: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={currentUser?.email || ""}
                  onChange={(e) =>
                    setCurrentUser({ ...currentUser, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">Vai trò</Label>
                <Select
                  value={currentUser?.role}
                  onValueChange={(value) =>
                    setCurrentUser({
                      ...currentUser,
                      role: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn vai trò" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Người dùng</SelectItem>
                    <SelectItem value="admin">Quản trị viên</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {!isEditing && (
                <div className="grid gap-2">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    required={!isEditing}
                  />
                  <p className="text-xs text-muted-foreground">
                    Mật khẩu phải có ít nhất 8 ký tự.
                  </p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                Hủy
              </Button>
              <Button type="submit">
                {isEditing ? "Cập nhật" : "Thêm mới"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersManagement;
