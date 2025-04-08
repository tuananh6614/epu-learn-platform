
import React from 'react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Search, Moon, Sun, Star, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div className="relative min-h-[90vh] overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <AnimatePresence mode="wait">
          {!isDark ? (
            <motion.div
              key="sun-bg-elements"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              {[...Array(15)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute bg-amber-400/30 rounded-full"
                  style={{
                    width: Math.random() * 6 + 2 + 'px',
                    height: Math.random() * 6 + 2 + 'px',
                    left: Math.random() * 100 + '%',
                    top: Math.random() * 100 + '%',
                    zIndex: 1
                  }}
                  animate={{
                    opacity: [0.2, 0.5, 0.2],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.2
                  }}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="moon-bg-elements"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              {[...Array(25)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute bg-blue-300/40 rounded-full"
                  style={{
                    width: Math.random() * 3 + 1 + 'px',
                    height: Math.random() * 3 + 1 + 'px',
                    left: Math.random() * 100 + '%',
                    top: Math.random() * 100 + '%',
                    zIndex: 1
                  }}
                  animate={{
                    opacity: [0.1, 0.5, 0.1],
                    scale: [1, 1.3, 1],
                  }}
                  transition={{
                    duration: 2 + Math.random() * 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.3
                  }}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hero section */}
      <div className="container mx-auto pt-20 pb-32 px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="text-primary/80 font-medium mb-4"
          >
            Nền tảng học tập hàng đầu
          </motion.p>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-epu-primary to-epu-accent">
              EPU Learn
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-xl md:text-2xl font-medium mb-4 text-foreground/80"
          >
            Nền tảng học tập trực tuyến của Đại học Điện Lực
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-muted-foreground text-lg mb-10"
          >
            Khám phá kho tàng kiến thức với các khóa học chất lượng cao<br />
            và tài liệu học tập phong phú
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/courses">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-epu-primary to-epu-accent hover:opacity-90 transition-opacity"
              >
                <BookOpen className="mr-2 h-5 w-5" /> Khám phá khóa học
              </Button>
            </Link>
            
            <Link to="/documents">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-primary/20 hover:border-primary/50 transition-colors"
              >
                <Search className="mr-2 h-5 w-5" /> Tìm tài liệu học tập
              </Button>
            </Link>
          </motion.div>
          
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border/50 hover:border-primary/30 transition-colors"
            >
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center mb-4 mx-auto">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-medium mb-2">Khóa học đa dạng</h3>
              <p className="text-muted-foreground">
                Hơn 200+ khóa học từ nhiều lĩnh vực khác nhau cho sinh viên EPU
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border/50 hover:border-primary/30 transition-colors"
            >
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center mb-4 mx-auto">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-medium mb-2">Tài liệu chất lượng</h3>
              <p className="text-muted-foreground">
                Thư viện tài liệu phong phú được biên soạn bởi giảng viên có kinh nghiệm
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="bg-card/50 backdrop-blur-sm p-6 rounded-xl border border-border/50 hover:border-primary/30 transition-colors"
            >
              <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-pink-500 to-purple-400 flex items-center justify-center mb-4 mx-auto">
                <Star className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-medium mb-2">Học tập linh hoạt</h3>
              <p className="text-muted-foreground">
                Truy cập mọi lúc mọi nơi với nền tảng học tập hiện đại, thân thiện
              </p>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Wave effect at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="absolute bottom-0">
          <path 
            fill={isDark ? "#1A1F2C" : "#f3f4f6"} 
            fillOpacity="1" 
            d="M0,96L48,112C96,128,192,160,288,154.7C384,149,480,107,576,85.3C672,64,768,64,864,85.3C960,107,1056,149,1152,154.7C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </div>
  );
};

export default HomePage;
