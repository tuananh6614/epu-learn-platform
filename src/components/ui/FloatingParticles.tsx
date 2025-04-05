
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
    const particlesCount = window.innerWidth < 768 ? 25 : 40;
    const newParticles: Particle[] = [];
    
    // Enhanced color palette
    const lightModeColors = ["#4299E1", "#ED8936", "#805AD5", "#38B2AC", "#E53E3E", "#DD6B20"];
    const darkModeColors = ["#4299E1", "#F6AD55", "#9F7AEA", "#4FD1C5", "#FC8181", "#F6E05E"];
    
    const colors = theme === "dark" ? darkModeColors : lightModeColors;

    for (let i = 0; i < particlesCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 6 + 2,
        opacity: Math.random() * 0.5 + 0.1,
        duration: Math.random() * 20 + 10,
        delay: Math.random() * 5,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    setParticles(newParticles);
  }, [theme]);

  useEffect(() => {
    generateParticles();
    
    const handleResize = () => {
      generateParticles();
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
              Math.random() * 100 - 50,
              Math.random() * 60 - 30,
              Math.random() * 80 - 40,
              0,
            ],
            y: [
              0, 
              Math.random() * 80 - 40,
              Math.random() * 60 - 30,
              Math.random() * 100 - 50,
              0,
            ],
            scale: [1, 1.2, 1.1, 1.3, 1],
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
