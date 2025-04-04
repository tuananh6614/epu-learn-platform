
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
}

const Particles = () => {
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
        opacity: Math.random() * 0.6 + 0.2, // 0.2-0.8
        duration: Math.random() * 20 + 10, // 10-30s
        delay: Math.random() * 5, // 0-5s delay
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
          className="absolute rounded-full bg-white"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
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
