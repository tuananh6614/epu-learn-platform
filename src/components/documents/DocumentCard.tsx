
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
    <Card className="h-full overflow-hidden hover:shadow-xl transition-all duration-300 group border border-slate-200 hover:border-slate-300">
      <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center border-b group-hover:bg-gradient-to-br group-hover:from-slate-100 group-hover:to-white transition-colors duration-300">
        <FileText size={60} className="text-epu-primary opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between">
          <h3 className="font-bold line-clamp-2 group-hover:text-epu-primary transition-colors duration-300">{document.title}</h3>
          <Badge className="ml-2 bg-epu-accent text-white whitespace-nowrap shadow-sm">
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
            className="bg-epu-primary hover:bg-epu-primary/90 shadow-md hover:shadow-lg transition-all duration-300"
            onClick={handleClick}
          >
            <Download size={16} className="mr-2" />
            Tải xuống
          </Button>
        ) : (
          <Button
            size="sm"
            variant="outline"
            className="border-epu-primary text-epu-primary hover:bg-epu-primary/10 shadow-sm hover:shadow-md transition-all duration-300"
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
