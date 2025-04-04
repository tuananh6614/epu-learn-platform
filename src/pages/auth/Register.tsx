import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import Particles from "@/components/ui/Particles";

const Register = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If user is already logged in, redirect them based on role
    if (user) {
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/courses");
      }
    }
  }, [user, navigate]);

  const handleSuccess = () => {
    // The redirection is now handled in the register function of useAuth
    // No need to handle redirection here
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-epu-primary/90 via-epu-primary to-epu-dark py-12 px-4 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-epu-secondary/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-epu-accent/20 rounded-full blur-3xl"></div>
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
            <div className="bg-white text-epu-primary font-bold p-3 rounded-xl shadow-lg text-3xl transform rotate-3 hover:rotate-0 transition-transform duration-300">
              EPU
            </div>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-bold text-white"
          >
            Đăng ký tài khoản EPU Learn
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-white/80 mt-3"
          >
            Tạo tài khoản để bắt đầu hành trình học tập của bạn
          </motion.p>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl p-2">
            <AuthForm type="register" onSuccess={handleSuccess} />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;
