
import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
  color: string;
}

export const FloatingParticles = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const { theme } = useTheme();

  const generateParticles = useCallback(() => {
    // Giảm số lượng hạt xuống đáng kể
    const particlesCount = window.innerWidth < 768 ? 30 : 50; // Đã giảm từ 100/150 xuống 30/50
    const newParticles: Particle[] = [];
    
    // Giữ nguyên bảng màu nhưng giảm số lượng hạt
    const lightModeColors = [
      "#4299E1", "#38B2AC", "#ED8936", "#805AD5", "#E53E3E", 
      "#DD6B20", "#3182CE"
    ];
    
    const darkModeColors = [
      "#63B3ED", "#4FD1C5", "#F6AD55", "#9F7AEA", "#FC8181", 
      "#FBD38D", "#90CDF4"
    ];
    
    const colors = theme === "dark" ? darkModeColors : lightModeColors;

    for (let i = 0; i < particlesCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 6 + 2, // Giảm kích thước hạt (từ 10+2 xuống 6+2)
        opacity: Math.random() * 0.5 + 0.1, // Giảm độ mờ để giảm bớt sự chú ý
        duration: Math.random() * 30 + 20, // Tăng thời gian di chuyển để giảm bớt CPU
        delay: Math.random() * 5,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    setParticles(newParticles);
  }, [theme]);

  useEffect(() => {
    generateParticles();
    
    // Giảm tần suất tạo lại các hạt khi thay đổi kích thước
    const handleResize = () => {
      setTimeout(generateParticles, 100); // Thêm thời gian chờ để tránh gọi quá nhiều lần
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [generateParticles]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            background: particle.color,
          }}
          animate={{
            x: [
              0,
              Math.random() * 80 - 40, // Giảm phạm vi di chuyển
              Math.random() * 60 - 30,
              Math.random() * 70 - 35,
              0,
            ],
            y: [
              0, 
              Math.random() * 60 - 30, // Giảm phạm vi di chuyển
              Math.random() * 40 - 20,
              Math.random() * 80 - 40,
              0,
            ],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};
