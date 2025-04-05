
import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";

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

const colors = [
  "rgba(59, 130, 246, 0.6)", // blue-500
  "rgba(139, 92, 246, 0.6)",  // purple-500
  "rgba(16, 185, 129, 0.6)",  // emerald-500
  "rgba(245, 158, 11, 0.6)",  // amber-500
  "rgba(239, 68, 68, 0.6)",   // red-500
];

export const Particles = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  const generateParticles = useCallback(() => {
    const particlesCount = window.innerWidth < 768 ? 20 : 40;
    const newParticles: Particle[] = [];

    for (let i = 0; i < particlesCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100, // position as percentage of container
        y: Math.random() * 100,
        size: Math.random() * 4 + 1, // 1-5px
        opacity: Math.random() * 0.3 + 0.1, // 0.1-0.4
        duration: Math.random() * 20 + 10, // 10-30s
        delay: Math.random() * 5, // 0-5s delay
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    setParticles(newParticles);
  }, []);

  useEffect(() => {
    generateParticles();
    
    // Re-generate particles when window is resized
    const handleResize = () => {
      generateParticles();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [generateParticles]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
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
            backgroundColor: particle.color,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
          }}
          animate={{
            x: [
              0,
              Math.random() * 50 - 25,
              Math.random() * 30 - 15,
              Math.random() * 40 - 20,
              0,
            ],
            y: [
              0, 
              Math.random() * 40 - 20,
              Math.random() * 30 - 15,
              Math.random() * 50 - 25,
              0,
            ],
            scale: [1, Math.random() * 0.3 + 0.8, 1]
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

export default Particles;
