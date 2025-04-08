
import * as React from "react";
import { Moon, Sun, Stars } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Button 
        variant="outline" 
        size="icon" 
        onClick={toggleTheme}
        className="relative rounded-full backdrop-blur-sm transition-all duration-500 ease-in-out 
                 border border-blue-200/50 dark:border-blue-500/30
                 bg-white/20 dark:bg-blue-900/20 
                 hover:bg-white/30 dark:hover:bg-blue-800/30 
                 shadow-md hover:shadow-lg"
      >
        <AnimatePresence mode="wait">
          {!isDark ? (
            <motion.div 
              key="sun"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="relative">
                <Sun className="h-[1.2rem] w-[1.2rem] text-amber-500" />
                <motion.div 
                  className="absolute top-0 left-0 h-full w-full"
                  animate={{ 
                    rotate: [0, 360],
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 10,
                    ease: "linear"
                  }}
                >
                  {[...Array(8)].map((_, i) => (
                    <motion.div 
                      key={i}
                      className="absolute bg-amber-400/70 h-1 w-1 rounded-full"
                      style={{
                        left: '50%',
                        top: '50%',
                        transformOrigin: '0 0',
                        transform: `rotate(${i * 45}deg) translateX(${i % 2 === 0 ? 7 : 9}px)`
                      }}
                    />
                  ))}
                </motion.div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="moon"
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="relative">
                <Moon className="h-[1.2rem] w-[1.2rem] text-blue-400" />
                <motion.div 
                  animate={{ 
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 3,
                    ease: "easeInOut"
                  }}
                >
                  {[...Array(3)].map((_, i) => (
                    <motion.div 
                      key={i}
                      className="absolute bg-blue-300 h-0.5 w-0.5 rounded-full"
                      style={{
                        left: `${6 + i * 4}px`,
                        top: `${i * 3 + 2}px`
                      }}
                      animate={{ 
                        opacity: [0.5, 1, 0.5],
                        scale: [1, 1.2, 1] 
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 2 + i,
                        delay: i * 0.5,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <span className="sr-only">Toggle theme</span>
      </Button>
    </motion.div>
  );
}
