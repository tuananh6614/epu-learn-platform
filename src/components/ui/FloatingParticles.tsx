
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
    const particlesCount = window.innerWidth < 768 ? 100 : 150; // Increased particle count
    const newParticles: Particle[] = [];
    
    // Enhanced vibrant color palette with better visibility in dark mode
    const lightModeColors = [
      "#4299E1", "#38B2AC", "#ED8936", "#805AD5", "#E53E3E", 
      "#DD6B20", "#3182CE", "#2C7A7B", "#D69E2E", "#6B46C1",
      "#F56565", "#48BB78", "#ECC94B", "#9F7AEA", "#F687B3"
    ];
    
    const darkModeColors = [
      "#63B3ED", "#4FD1C5", "#F6AD55", "#9F7AEA", "#FC8181", 
      "#FBD38D", "#90CDF4", "#81E6D9", "#FEB2B2", "#D6BCFA",
      "#B794F4", "#68D391", "#F6E05E", "#76E4F7", "#FBB6CE"
    ];
    
    const colors = theme === "dark" ? darkModeColors : lightModeColors;

    for (let i = 0; i < particlesCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 10 + 2, // Larger size range
        opacity: Math.random() * 0.7 + 0.2, // More visible particles
        duration: Math.random() * 25 + 15, // Smooth movement
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
            filter: "blur(0.5px)", // Slight blur for a glow effect
          }}
          animate={{
            x: [
              0,
              Math.random() * 120 - 60,
              Math.random() * 80 - 40,
              Math.random() * 100 - 50,
              0,
            ],
            y: [
              0, 
              Math.random() * 100 - 50,
              Math.random() * 80 - 40,
              Math.random() * 120 - 60,
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
