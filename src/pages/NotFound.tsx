
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BookOpen } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30">
      <div className="text-center space-y-6 max-w-md px-4">
        <div className="flex justify-center mb-4">
          <div className="w-24 h-24 bg-epu-primary/10 rounded-full flex items-center justify-center">
            <BookOpen className="h-12 w-12 text-epu-primary" />
          </div>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-epu-primary">404</h1>
        <h2 className="text-2xl md:text-3xl font-bold">Không tìm thấy trang</h2>
        <p className="text-muted-foreground">
          Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
        </p>
        <div className="pt-4">
          <Button 
            className="bg-epu-primary hover:bg-epu-primary/90"
            onClick={() => navigate("/")}
          >
            Quay về trang chủ
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
