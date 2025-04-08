
import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  // Spring animation configuration for a more natural feeling
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
        className={`relative rounded-full p-2 transition-all duration-500 ease-in-out
                   border ${isDark ? 'border-blue-500/30' : 'border-blue-200/50'}
                   ${isDark ? 'bg-blue-900/20' : 'bg-white/20'} 
                   ${isDark ? 'hover:bg-blue-800/30' : 'hover:bg-white/30'} 
                   backdrop-blur-sm shadow-md hover:shadow-lg`}
        aria-label="Toggle theme"
      >
        <motion.div
          animate={{
            rotate: isDark ? 360 : 0,
          }}
          transition={{
            duration: 0.7,
            ease: "easeInOut"
          }}
          className="relative w-6 h-6 flex items-center justify-center"
        >
          {/* Sun (visible in light mode) */}
          <motion.div
            animate={{
              scale: isDark ? 0 : 1,
              opacity: isDark ? 0 : 1,
              rotate: isDark ? -90 : 0
            }}
            transition={spring}
            className="absolute"
          >
            <Sun className="h-6 w-6 text-amber-500" />
          </motion.div>

          {/* Moon (visible in dark mode) */}
          <motion.div
            animate={{
              scale: isDark ? 1 : 0,
              opacity: isDark ? 1 : 0,
              rotate: isDark ? 0 : 90
            }}
            transition={spring}
            className="absolute"
          >
            <Moon className="h-6 w-6 text-blue-400" />
          </motion.div>
        </motion.div>
      </motion.button>
    </motion.div>
  );
}
