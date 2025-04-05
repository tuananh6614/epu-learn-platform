
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Info, Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const ProfileDocuments = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [purchasedDocuments, setPurchasedDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPurchasedDocuments = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Không tìm thấy token đăng nhập');
        }
        
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/documents/user/documents`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Không thể tải danh sách tài liệu đã mua');
        }
        
        const data = await response.json();
        setPurchasedDocuments(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching purchased documents:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải danh sách tài liệu đã mua",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };

    fetchPurchasedDocuments();
  }, [toast, user]);

  const handleDownload = async (documentId) => {
    try {
      toast({
        title: "Đang tải xuống",
        description: `Tài liệu đang được tải xuống`,
      });
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Không tìm thấy token đăng nhập');
      }
      
      // Using fetch with download 
      window.open(
        `${import.meta.env.VITE_API_URL}/api/documents/documents/${documentId}/download?token=${token}`, 
        '_blank'
      );
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Lỗi khi tải xuống",
        description: error instanceof Error ? error.message : "Đã xảy ra lỗi không xác định",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div>
      {purchasedDocuments && purchasedDocuments.length > 0 ? (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Tài liệu đã mua</h2>
          
          <div className="grid grid-cols-1 gap-4">
            {purchasedDocuments.map((document) => (
              <div 
                key={document.id} 
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
                      <FileText size={20} className="text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{document.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {document.category_name} • {(document.price / 1000).toFixed(1)}k VND
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center"
                    onClick={() => handleDownload(document.id)}
                  >
                    <Download size={16} className="mr-1" />
                    Tải xuống
                  </Button>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  <span>Ngày mua: {new Date(document.purchase_date).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-card rounded-xl p-8 border shadow-sm">
          <FileText size={64} className="mx-auto text-muted-foreground mb-4 opacity-30" />
          <h3 className="text-lg font-medium mb-2">Bạn chưa mua tài liệu nào</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Hãy khám phá các tài liệu chất lượng trong danh sách tài liệu để nâng cao kiến thức của bạn
          </p>
          <div className="mt-6">
            <Button 
              variant="outline" 
              size="sm"
              className="flex items-center gap-2 mx-auto"
              onClick={() => window.location.href = '/documents'}
            >
              <Info size={16} />
              Xem danh sách tài liệu
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDocuments;
