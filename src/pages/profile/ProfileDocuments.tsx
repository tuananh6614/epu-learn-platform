
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Info } from "lucide-react";

const ProfileDocuments = () => {
  const { toast } = useToast();
  const [purchasedDocuments, setPurchasedDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This would be replaced with an actual API call in a real app
    const fetchPurchasedDocuments = async () => {
      try {
        setIsLoading(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real app, this would be an API call to fetch the user's purchased documents
        setPurchasedDocuments([]);
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
  }, [toast]);

  const handleDownload = (documentId: number) => {
    toast({
      title: "Đang tải xuống",
      description: `Tài liệu #${documentId} đang được tải xuống`,
    });
    // In a real app, this would trigger a download
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <Card key={i} className="h-32 animate-pulse bg-muted" />
        ))}
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
                    <div className="w-10 h-10 rounded-md bg-epu-primary/10 flex items-center justify-center">
                      <FileText size={20} className="text-epu-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{document.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {document.category_name} • {document.price / 1000}k VND
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
        <div className="text-center py-12 bg-white/5 dark:bg-slate-800/10 rounded-xl p-8 backdrop-blur-sm border border-slate-200/20 dark:border-slate-700/20 shadow-sm">
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
