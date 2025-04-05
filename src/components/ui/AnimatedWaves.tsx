
import React from "react";
import { motion } from "framer-motion";

export const AnimatedWaves = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute w-full h-full">
        {/* Wave 1 */}
        <motion.div
          className="absolute left-0 right-0 bottom-0 h-20 md:h-40 opacity-20 bg-blue-200 dark:bg-blue-800 rounded-t-[100%]"
          initial={{ y: 100, opacity: 0 }}
          animate={{ 
            y: [30, 0, 30],
            opacity: 0.2,
          }}
          transition={{
            y: {
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            },
            opacity: { duration: 2 }
          }}
        />
        
        {/* Wave 2 */}
        <motion.div
          className="absolute left-0 right-0 bottom-0 h-16 md:h-32 opacity-15 bg-blue-300 dark:bg-blue-700 rounded-t-[100%]"
          initial={{ y: 100, opacity: 0 }}
          animate={{ 
            y: [20, -10, 20], 
            opacity: 0.15,
          }}
          transition={{
            y: {
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            },
            opacity: { duration: 2 }
          }}
        />
        
        {/* Wave 3 */}
        <motion.div
          className="absolute left-0 right-0 bottom-0 h-12 md:h-24 opacity-10 bg-blue-400 dark:bg-blue-600 rounded-t-[100%]"
          initial={{ y: 100, opacity: 0 }}
          animate={{ 
            y: [10, -20, 10], 
            opacity: 0.1,
          }}
          transition={{
            y: {
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            },
            opacity: { duration: 2 }
          }}
        />
      </div>
    </div>
  );
};

export default AnimatedWaves;
