
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
  FileText 
} from "lucide-react";
import { mockUsers } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

const UsersManagement = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState([...mockUsers]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const filteredUsers = users.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddNew = () => {
    setIsEditing(false);
    setCurrentUser({
      id: users.length + 1,
      fullName: "",
      email: "",
      role: "user",
      created_at: new Date().toISOString().split('T')[0],
    });
    setDialogOpen(true);
  };

  const handleEdit = (user: any) => {
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
    
    // In a real app, this would be an API call
    if (isEditing) {
      setUsers(
        users.map((u) => (u.id === currentUser.id ? currentUser : u))
      );
      toast({
        title: "Cập nhật thành công",
        description: "Thông tin người dùng đã được cập nhật",
      });
    } else {
      setUsers([...users, currentUser]);
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
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500 bg-clip-text text-transparent">Quản lý Người dùng</h1>
          <p className="text-muted-foreground">
            Thêm, chỉnh sửa và quản lý người dùng trong hệ thống
          </p>
        </div>
        <Button
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-md hover:shadow-lg transition-all"
          onClick={handleAddNew}
        >
          <Plus size={16} className="mr-2" />
          Thêm người dùng mới
        </Button>
      </div>

      <div className="rounded-lg overflow-hidden border-0 dark:bg-[#0f172a]/90 bg-card backdrop-blur-sm">
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
                className="pl-9 border-blue-200 dark:border-blue-900/30 dark:bg-[#131c31] placeholder-muted-foreground/70"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto flex gap-2 border-blue-200 dark:border-blue-900/30 dark:bg-[#131c31] hover:bg-blue-100 dark:hover:bg-blue-900/20">
                  <ChevronDown size={16} />
                  Lọc theo vai trò
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="dark:bg-[#131c31] backdrop-blur-md">
                <DropdownMenuItem>Tất cả người dùng</DropdownMenuItem>
                <DropdownMenuItem>Quản trị viên</DropdownMenuItem>
                <DropdownMenuItem>Người dùng thường</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Users Table */}
          <div className="rounded-md overflow-hidden border dark:border-blue-900/20 border-blue-200">
            <Table>
              <TableHeader>
                <TableRow className="dark:bg-[#121c34] bg-blue-50 hover:dark:bg-[#121c34]">
                  <TableHead className="text-gray-700 dark:text-white font-medium">ID</TableHead>
                  <TableHead className="text-gray-700 dark:text-white font-medium">Tên đầy đủ</TableHead>
                  <TableHead className="hidden md:table-cell text-gray-700 dark:text-white font-medium">Email</TableHead>
                  <TableHead className="text-center text-gray-700 dark:text-white font-medium">Vai trò</TableHead>
                  <TableHead className="hidden md:table-cell text-gray-700 dark:text-white font-medium">Ngày tạo</TableHead>
                  <TableHead className="text-right text-gray-700 dark:text-white font-medium">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} className="dark:bg-[#0f172a] dark:hover:bg-[#1a2744] hover:bg-blue-50 dark:border-blue-900/10">
                      <TableCell className="font-medium dark:text-gray-300">{user.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 flex items-center justify-center text-white">
                            {user.role === "admin" ? (
                              <Shield size={14} className="text-white" />
                            ) : (
                              <UserIcon size={14} className="text-white" />
                            )}
                          </div>
                          <span className="dark:text-white">{user.fullName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell dark:text-gray-300">{user.email}</TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={user.role === "admin" ? "default" : "outline"}
                          className={user.role === "admin" 
                            ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600" 
                            : "border-blue-200 dark:border-blue-400/30 text-blue-700 dark:text-blue-300 dark:bg-blue-900/20"}
                        >
                          {user.role === "admin" ? "Quản trị viên" : "Người dùng"}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell dark:text-gray-300">{user.created_at}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="hover:bg-blue-100 dark:hover:bg-blue-900/20">
                              <MoreHorizontal size={16} className="dark:text-gray-300" />
                              <span className="sr-only">Mở menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="dark:bg-[#131c31] backdrop-blur-md">
                            <DropdownMenuItem onClick={() => handleEdit(user)} className="dark:hover:bg-blue-800/40 cursor-pointer">
                              <Edit size={14} className="mr-2 text-blue-500" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem className="dark:hover:bg-blue-800/40 cursor-pointer">
                              <BookOpen size={14} className="mr-2 text-blue-500" />
                              Xem khóa học đã đăng ký
                            </DropdownMenuItem>
                            <DropdownMenuItem className="dark:hover:bg-blue-800/40 cursor-pointer">
                              <FileText size={14} className="mr-2 text-blue-500" />
                              Xem tài liệu đã mua
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="dark:bg-gray-700" />
                            <DropdownMenuItem
                              onClick={() => handleDelete(user.id)}
                              className="text-red-600 dark:text-red-400 dark:hover:bg-red-900/20 cursor-pointer"
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
                    <TableCell colSpan={6} className="text-center py-8 dark:text-gray-400">
                      <p className="text-muted-foreground">
                        Không tìm thấy người dùng nào
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TableCaption className="dark:text-gray-400">Danh sách tất cả người dùng</TableCaption>
            </Table>
          </div>
        </div>
      </div>

      {/* Add/Edit User Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px] dark:bg-[#131c31] backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="text-xl bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500 bg-clip-text text-transparent">
              {isEditing ? "Chỉnh sửa thông tin người dùng" : "Thêm người dùng mới"}
            </DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              {isEditing
                ? "Cập nhật thông tin người dùng"
                : "Điền thông tin người dùng mới"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="fullName" className="dark:text-gray-200">Họ và tên</Label>
                <Input
                  id="fullName"
                  value={currentUser?.fullName || ""}
                  onChange={(e) =>
                    setCurrentUser({ ...currentUser, fullName: e.target.value })
                  }
                  required
                  className="dark:bg-[#0f172a]/80 dark:border-blue-900/30"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email" className="dark:text-gray-200">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={currentUser?.email || ""}
                  onChange={(e) =>
                    setCurrentUser({ ...currentUser, email: e.target.value })
                  }
                  required
                  className="dark:bg-[#0f172a]/80 dark:border-blue-900/30"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role" className="dark:text-gray-200">Vai trò</Label>
                <Select
                  value={currentUser?.role}
                  onValueChange={(value) =>
                    setCurrentUser({
                      ...currentUser,
                      role: value,
                    })
                  }
                >
                  <SelectTrigger className="dark:bg-[#0f172a]/80 dark:border-blue-900/30">
                    <SelectValue placeholder="Chọn vai trò" />
                  </SelectTrigger>
                  <SelectContent className="dark:bg-[#131c31] backdrop-blur-md">
                    <SelectItem value="user">Người dùng</SelectItem>
                    <SelectItem value="admin">Quản trị viên</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {!isEditing && (
                <div className="grid gap-2">
                  <Label htmlFor="password" className="dark:text-gray-200">Mật khẩu</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    required={!isEditing}
                    className="dark:bg-[#0f172a]/80 dark:border-blue-900/30"
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
                className="border-blue-200 dark:border-blue-900/30 dark:bg-[#0f172a]/40 hover:bg-blue-100 dark:hover:bg-blue-900/20"
              >
                Hủy
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white">
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
