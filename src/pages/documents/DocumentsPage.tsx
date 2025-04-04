
import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import DocumentCard, { DocumentType } from "@/components/documents/DocumentCard";
import { mockDocuments } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const DocumentsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Extract unique categories
  const categories = Array.from(
    new Set(mockDocuments.map((doc) => doc.category_name))
  );

  // Apply sorting
  const sortedDocuments = [...mockDocuments].sort((a, b) => {
    if (sortBy === "newest") {
      return b.id - a.id;
    }
    if (sortBy === "price-low") {
      return a.price - b.price;
    }
    if (sortBy === "price-high") {
      return b.price - a.price;
    }
    if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  // Apply filtering
  const filteredDocuments = sortedDocuments.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "" || doc.category_name === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handlePurchaseDocument = (document: DocumentType) => {
    if (!user) {
      toast({
        title: "Yêu cầu đăng nhập",
        description: "Vui lòng đăng nhập để mua tài liệu",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    toast({
      title: "Đang chuyển đến trang thanh toán",
      description: `Chuẩn bị thanh toán cho "${document.title}"`,
    });
    
    // In real app, would redirect to payment gateway
    setTimeout(() => {
      toast({
        title: "Chức năng đang phát triển",
        description: "Tính năng thanh toán sẽ sớm được cập nhật",
      });
    }, 2000);
  };

  return (
    <div className="container px-4 md:px-6 py-10">
      <div className="flex flex-col mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Tài liệu học tập</h1>
        <p className="text-muted-foreground">
          Tìm kiếm và mua các tài liệu học tập chất lượng cao
        </p>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col space-y-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Input
              placeholder="Tìm kiếm tài liệu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          </div>
          <div className="w-full sm:w-48">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sắp xếp theo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Mới nhất</SelectItem>
                <SelectItem value="title">Tên A-Z</SelectItem>
                <SelectItem value="price-low">Giá thấp - cao</SelectItem>
                <SelectItem value="price-high">Giá cao - thấp</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          <Badge 
            variant={selectedCategory === "" ? "default" : "outline"}
            className={`cursor-pointer ${selectedCategory === "" ? "bg-epu-primary" : ""}`}
            onClick={() => setSelectedCategory("")}
          >
            Tất cả
          </Badge>
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={`cursor-pointer ${selectedCategory === category ? "bg-epu-primary" : ""}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>
      
      {/* Documents Grid */}
      {filteredDocuments.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredDocuments.map((document) => (
            <DocumentCard 
              key={document.id} 
              document={document}
              onPurchase={() => handlePurchaseDocument(document)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">Không tìm thấy tài liệu</h3>
          <p className="text-muted-foreground">
            Không có tài liệu nào phù hợp với tìm kiếm của bạn
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setSearchTerm("")}
            >
              Xóa tìm kiếm
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setSelectedCategory("")}
            >
              Xóa bộ lọc
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsPage;
