
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, ShoppingCart, ExternalLink } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

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
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (!document.purchased) {
      e.preventDefault();
      if (onPurchase) {
        onPurchase(document);
      }
    }
  };

  return (
    <motion.div
      whileHover={{ y: -10 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="h-full overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-epu-primary dark:hover:border-epu-primary shadow-sm hover:shadow-xl transition-all duration-300 group bg-white dark:bg-slate-900">
        <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center border-b group-hover:bg-gradient-to-br group-hover:from-epu-primary/5 group-hover:to-epu-primary/10 dark:group-hover:from-epu-primary/20 dark:group-hover:to-epu-primary/30 transition-colors duration-500 relative overflow-hidden">
          <motion.div
            animate={isHovered ? { rotate: 5, scale: 1.1 } : { rotate: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative z-10"
          >
            <FileText size={60} className="text-epu-primary dark:text-epu-accent opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.div>
          
          {/* Background decoration */}
          <div className="absolute -bottom-5 -right-5 w-24 h-24 bg-gradient-to-br from-epu-primary/20 to-epu-accent/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        </div>
        <CardContent className="pt-4">
          <div className="flex items-start justify-between">
            <HoverCard>
              <HoverCardTrigger asChild>
                <h3 className="font-bold line-clamp-2 group-hover:text-epu-primary dark:group-hover:text-epu-accent transition-colors duration-300 cursor-pointer">{document.title}</h3>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 bg-white dark:bg-slate-800 p-4 shadow-xl border border-slate-200 dark:border-slate-700">
                <div className="flex flex-col gap-2">
                  <h4 className="font-bold text-epu-primary dark:text-epu-accent">{document.title}</h4>
                  <p className="text-sm">{document.description}</p>
                  <div className="flex justify-between items-center mt-2">
                    <Badge>{document.category_name}</Badge>
                    <span className="text-sm text-epu-primary dark:text-epu-accent font-semibold">{formatCurrency(document.price)}</span>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
            <Badge className="ml-2 bg-epu-accent text-white whitespace-nowrap shadow-sm">
              {document.category_name}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm mt-2 line-clamp-3">
            {document.description}
          </p>
        </CardContent>
        <CardFooter className="flex justify-between items-center pt-0">
          <div className="font-semibold text-epu-primary dark:text-epu-accent">
            {formatCurrency(document.price)}
          </div>
          {document.purchased ? (
            <Button
              size="sm"
              className="bg-epu-primary hover:bg-epu-primary/90 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group relative"
              onClick={handleClick}
            >
              <span className="flex items-center relative z-10">
                <Download size={16} className="mr-2" />
                Tải xuống
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-epu-primary via-epu-accent to-epu-primary bg-[length:200%] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="border-epu-primary text-epu-primary dark:border-epu-accent dark:text-epu-accent hover:bg-epu-primary/10 dark:hover:bg-epu-accent/10 shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden"
              onClick={handleClick}
            >
              <span className="flex items-center relative z-10">
                <ShoppingCart size={16} className="mr-2 group-hover:animate-bounce" />
                Mua
              </span>
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default DocumentCard;
