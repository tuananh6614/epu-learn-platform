
import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
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
        className="rounded-full backdrop-blur-sm transition-all duration-700 ease-in-out 
                   border border-blue-200/50 dark:border-blue-500/30
                   bg-white/20 dark:bg-blue-900/30 
                   hover:bg-white/30 dark:hover:bg-blue-800/40 
                   shadow-md hover:shadow-lg"
      >
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-700 ease-in-out dark:-rotate-90 dark:scale-0 text-amber-500" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-700 ease-in-out dark:rotate-0 dark:scale-100 text-blue-300" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </motion.div>
  );
}
