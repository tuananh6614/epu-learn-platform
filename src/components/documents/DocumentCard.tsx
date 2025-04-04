
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, ShoppingCart } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export type DocumentType = {
  id: number;
  title: string;
  description: string;
  preview_url: string;
  price: number;
  category_name: string;
  file_path: string;
  purchased?: boolean;
};

type DocumentCardProps = {
  document: DocumentType;
  onPurchase?: (document: DocumentType) => void;
};

const DocumentCard = ({ document, onPurchase }: DocumentCardProps) => {
  const handleClick = (e: React.MouseEvent) => {
    if (!document.purchased) {
      e.preventDefault();
      if (onPurchase) {
        onPurchase(document);
      }
    }
  };

  return (
    <Card className="h-full overflow-hidden hover:shadow-md transition-all duration-300">
      <div className="p-4 bg-slate-50 flex items-center justify-center border-b">
        <FileText size={60} className="text-epu-primary opacity-70" />
      </div>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between">
          <h3 className="font-bold line-clamp-2">{document.title}</h3>
          <Badge className="ml-2 bg-epu-accent/20 text-epu-accent whitespace-nowrap">
            {document.category_name}
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm mt-2 line-clamp-3">
          {document.description}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-0">
        <div className="font-semibold text-epu-primary">
          {formatCurrency(document.price)}
        </div>
        {document.purchased ? (
          <Button
            size="sm"
            className="bg-epu-primary hover:bg-epu-primary/90"
            onClick={handleClick}
          >
            <Download size={16} className="mr-2" />
            Tải xuống
          </Button>
        ) : (
          <Button
            size="sm"
            variant="outline"
            className="border-epu-primary text-epu-primary hover:bg-epu-primary/10"
            onClick={handleClick}
          >
            <ShoppingCart size={16} className="mr-2" />
            Mua
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default DocumentCard;
