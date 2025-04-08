
import * as React from "react";
import { Moon, Sun, Stars } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  // Spring animation configuration 
  const spring = {
    type: "spring",
    stiffness: 300,
    damping: 30
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={spring}
    >
      <motion.button 
        onClick={toggleTheme}
        className={`relative overflow-hidden rounded-full p-3 transition-all duration-500 ease-in-out
                   border ${isDark ? 'border-blue-500/30' : 'border-amber-200/50'}
                   ${isDark ? 'bg-indigo-900/30' : 'bg-amber-50/30'} 
                   ${isDark ? 'hover:bg-indigo-800/40' : 'hover:bg-amber-100/40'} 
                   backdrop-blur-sm shadow-md hover:shadow-lg`}
        aria-label="Toggle theme"
      >
        {/* Background gradient for light/dark mode */}
        <div className={`absolute inset-0 transition-opacity duration-700 ${isDark ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-purple-900"></div>
          {/* Stars (only visible in dark mode) */}
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white"
              initial={false}
              animate={{
                opacity: isDark ? [0, 1, 0.8] : 0,
                scale: isDark ? [0, 1, 0.8] : 0,
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
                delay: i * 0.2,
              }}
              style={{
                width: Math.random() * 2 + 1 + "px",
                height: Math.random() * 2 + 1 + "px",
                left: Math.random() * 100 + "%",
                top: Math.random() * 100 + "%",
              }}
            />
          ))}
        </div>
        <div className={`absolute inset-0 transition-opacity duration-700 ${isDark ? 'opacity-0' : 'opacity-100'}`}>
          <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-blue-50"></div>
          {/* Light rays (only visible in light mode) */}
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-amber-300/60"
              initial={false}
              animate={{
                opacity: isDark ? 0 : [0.4, 0.8, 0.4],
                scale: isDark ? 0 : [0.8, 1, 0.8],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
                delay: i * 0.2,
              }}
              style={{
                height: "2px",
                width: "30px",
                left: "50%",
                top: "50%",
                transformOrigin: "0 0",
                transform: `rotate(${i * 45}deg) translate(-50%, -50%)`,
              }}
            />
          ))}
        </div>

        <div className="relative w-10 h-10 flex items-center justify-center">
          {/* Sun container with rotation */}
          <motion.div
            animate={{
              rotate: isDark ? 180 : 0,
            }}
            transition={{
              duration: 0.7,
              ease: "easeInOut"
            }}
            className="w-full h-full"
          >
            {/* Sun (visible in light mode) */}
            <motion.div
              animate={{
                scale: isDark ? 0 : 1,
                opacity: isDark ? 0 : 1,
                y: isDark ? -20 : 0
              }}
              transition={{
                ...spring,
                delay: isDark ? 0 : 0.2
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Sun className="h-7 w-7 text-amber-500 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
            </motion.div>

            {/* Moon (visible in dark mode) */}
            <motion.div
              animate={{
                scale: isDark ? 1 : 0,
                opacity: isDark ? 1 : 0,
                y: isDark ? 0 : 20
              }}
              transition={{
                ...spring,
                delay: isDark ? 0.2 : 0
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Moon className="h-7 w-7 text-blue-200 drop-shadow-[0_0_8px_rgba(191,219,254,0.5)]" />
            </motion.div>
          </motion.div>
        </div>
      </motion.button>
    </motion.div>
  );
}
