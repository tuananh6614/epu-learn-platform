
import { useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import Particles from "@/components/ui/Particles";
import { Home } from "lucide-react";

const Login = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get the redirect URL from location state if it exists
  const from = location.state?.from?.pathname || "/";
  
  useEffect(() => {
    // If user is already logged in, redirect them based on role
    if (user) {
      if (user.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/courses", { replace: true });
      }
    }
  }, [user, navigate]);

  const handleSuccess = () => {
    // The redirection is now handled in the login function of useAuth
    // No need to handle redirection here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-epu-primary/90 via-epu-primary to-epu-dark py-12 px-4 overflow-hidden">
      {/* Home navigation button */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="absolute top-6 left-6 z-20"
      >
        <Link to="/" className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-white hover:bg-white/20 transition-all duration-300">
          <Home size={18} />
          <span>Trang chủ</span>
        </Link>
      </motion.div>
      
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-epu-secondary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-epu-accent/20 rounded-full blur-3xl"></div>
        <Particles />
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md space-y-8 relative z-10"
      >
        <div className="text-center">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20, 
              delay: 0.2 
            }}
            className="flex justify-center mb-6"
          >
            <div className="bg-white text-epu-primary font-bold p-3 rounded-xl shadow-lg text-3xl transform -rotate-3 hover:rotate-0 transition-transform duration-300">
              EPU
            </div>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-bold text-white"
          >
            Đăng nhập vào EPU Learn
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-white/80 mt-3"
          >
            Nhập thông tin đăng nhập của bạn để tiếp tục
          </motion.p>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl p-2">
            <AuthForm type="login" onSuccess={handleSuccess} />
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-sm text-white/70 bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10"
        >
          <p>
            Để demo, vui lòng sử dụng:
          </p>
          <p className="mt-1 font-medium text-white">
            <strong>Admin:</strong> admin@epu.edu.vn / admin123
          </p>
          <p className="mt-1 font-medium text-white">
            <strong>User:</strong> user@epu.edu.vn / user123
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;
