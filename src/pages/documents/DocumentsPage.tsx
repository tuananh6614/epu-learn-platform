import { useState, useEffect } from "react";
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
import { Search, FileText } from "lucide-react";
import DocumentCard, { DocumentType } from "@/components/documents/DocumentCard";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const DocumentsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setIsLoading(true);
        
        // In a real app, this would be an API call to fetch documents
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/documents/documents`);
        
        if (!response.ok) {
          throw new Error('Không thể tải dữ liệu tài liệu');
        }
        
        const data = await response.json();
        setDocuments(data);
        
        // Extract unique categories from documents, with proper type handling
        const uniqueCategories: string[] = Array.from(
          new Set(data.map((doc: DocumentType) => doc.category_name))
        ).filter((category): category is string => 
          typeof category === 'string' && category !== null && category !== undefined
        );
        
        setCategories(uniqueCategories);
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching documents:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải dữ liệu tài liệu",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, [toast]);

  // Apply sorting
  const sortedDocuments = [...documents].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
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

  const handlePurchaseDocument = async (document: DocumentType) => {
    if (!user) {
      toast({
        title: "Yêu cầu đăng nhập",
        description: "Vui lòng đăng nhập để mua tài liệu",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/documents/documents/${document.id}/purchase`, 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Lỗi khi mua tài liệu');
      }
      
      toast({
        title: "Mua tài liệu thành công",
        description: `Bạn đã mua thành công "${document.title}"`,
      });
      
      // Redirect to profile documents page
      navigate("/profile/documents");
    } catch (error) {
      console.error("Purchase error:", error);
      toast({
        title: "Lỗi khi mua tài liệu",
        description: error instanceof Error ? error.message : "Đã xảy ra lỗi không xác định",
        variant: "destructive",
      });
    }
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
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="h-64 animate-pulse bg-muted rounded-2xl" />
          ))}
        </div>
      ) : filteredDocuments.length > 0 ? (
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
          <FileText size={64} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Không có tài liệu nào</h3>
          <p className="text-muted-foreground">
            Hiện chưa có tài liệu nào trong hệ thống hoặc không tìm thấy tài liệu phù hợp
          </p>
          {searchTerm || selectedCategory ? (
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {searchTerm && (
                <Button 
                  variant="outline" 
                  onClick={() => setSearchTerm("")}
                >
                  Xóa tìm kiếm
                </Button>
              )}
              {selectedCategory && (
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedCategory("")}
                >
                  Xóa bộ lọc
                </Button>
              )}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default DocumentsPage;
