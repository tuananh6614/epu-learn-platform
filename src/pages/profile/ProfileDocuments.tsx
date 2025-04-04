
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockDocuments } from "@/lib/utils";
import { Download, FileText } from "lucide-react";

const ProfileDocuments = () => {
  const { toast } = useToast();
  // In a real app, this would be fetched from an API
  const [purchasedDocuments, setPurchasedDocuments] = useState(mockDocuments ? mockDocuments.slice(0, 2) : []);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API request
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

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
                        {document.format} • {document.pages} trang
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
                  <span>Ngày mua: {document.publishedAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <FileText size={64} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Bạn chưa mua tài liệu nào</h3>
          <p className="text-muted-foreground">
            Hãy khám phá các tài liệu chất lượng trong danh sách tài liệu
          </p>
        </div>
      )}
    </div>
  );
};

export default ProfileDocuments;
