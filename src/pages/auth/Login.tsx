
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";
import { useAuth } from "@/hooks/useAuth";

const Login = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect URL from location state if it exists
  const from = location.state?.from?.pathname || "/";
  
  useEffect(() => {
    // If user is already logged in, redirect them
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleSuccess = () => {
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 py-12 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-2">
            <div className="bg-epu-primary text-white font-bold p-2 rounded-md text-xl">
              EPU
            </div>
          </div>
          <h2 className="text-2xl font-bold">Đăng nhập vào EPU Learn</h2>
          <p className="text-muted-foreground mt-2">
            Nhập thông tin đăng nhập của bạn để tiếp tục
          </p>
        </div>
        
        <AuthForm type="login" onSuccess={handleSuccess} />
        
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Để demo, vui lòng sử dụng:{" "}
          </p>
          <p className="mt-1">
            <strong>Admin:</strong> admin@epu.edu.vn / admin123
          </p>
          <p className="mt-1">
            <strong>User:</strong> user@epu.edu.vn / user123
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
