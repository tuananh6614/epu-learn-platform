
import React from "react";
import { motion } from "framer-motion";

export const GlowingOrbs = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Large orb */}
      <motion.div 
        className="absolute top-[20%] right-[15%] w-64 h-64 rounded-full bg-gradient-to-r from-blue-400/20 to-purple-500/20 blur-3xl"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.5, 0.7, 0.5],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Medium orb */}
      <motion.div 
        className="absolute top-[50%] left-[10%] w-48 h-48 rounded-full bg-gradient-to-r from-teal-400/20 to-blue-500/20 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
      
      {/* Small orb */}
      <motion.div 
        className="absolute bottom-[30%] right-[25%] w-32 h-32 rounded-full bg-gradient-to-r from-purple-400/20 to-pink-500/20 blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      />
    </div>
  );
};

export default GlowingOrbs;
