
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
        className="rounded-full bg-white/10 dark:bg-black/40 backdrop-blur-sm transition-all duration-700 ease-in-out border border-slate-200 dark:border-admin-border hover:bg-white/20 dark:hover:bg-black/50 shadow-md"
      >
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all duration-700 ease-in-out dark:-rotate-90 dark:scale-0 text-amber-500" />
        <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all duration-700 ease-in-out dark:rotate-0 dark:scale-100 text-admin-accent" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    </motion.div>
  );
}
