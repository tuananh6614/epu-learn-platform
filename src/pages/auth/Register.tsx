
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";
import { useAuth } from "@/hooks/useAuth";

const Register = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If user is already logged in, redirect them to home
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSuccess = () => {
    navigate("/");
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
          <h2 className="text-2xl font-bold">Đăng ký tài khoản EPU Learn</h2>
          <p className="text-muted-foreground mt-2">
            Tạo tài khoản để bắt đầu hành trình học tập của bạn
          </p>
        </div>
        
        <AuthForm type="register" onSuccess={handleSuccess} />
      </div>
    </div>
  );
};

export default Register;
