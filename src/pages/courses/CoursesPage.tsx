
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, X, Sparkles } from "lucide-react";
import CourseCard from "@/components/courses/CourseCard";
import { CourseType } from "@/components/courses/CourseCard";
import { mockCourses } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

// List of specializations/programs
const specializations = [
  { id: "all", name: "Tất cả chuyên ngành" },
  { id: "CNTT", name: "Công nghệ thông tin" },
  { id: "DTVT", name: "Điện tử viễn thông" },
  { id: "KTDL", name: "Kỹ thuật điện lạnh" },
  { id: "KTDK", name: "Kỹ thuật điều khiển" },
  { id: "ATTT", name: "An toàn thông tin" },
];

const CoursesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedSpecialization, setSelectedSpecialization] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  
  const courses = [...mockCourses] as CourseType[]; // Cast to CourseType to ensure compatibility
  
  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Apply sorting
  const sortedCourses = courses.sort((a, b) => {
    if (sortBy === "newest") {
      return b.id - a.id;
    }
    if (sortBy === "popular") {
      return (b.enrollmentCount || 0) - (a.enrollmentCount || 0);
    }
    if (sortBy === "title-asc") {
      return a.title.localeCompare(b.title);
    }
    if (sortBy === "title-desc") {
      return b.title.localeCompare(a.title);
    }
    return 0;
  });
  
  // Apply filtering (search term + specialization)
  const filteredCourses = sortedCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialization = selectedSpecialization === "all" || 
                                 course.specialization === selectedSpecialization;
    
    return matchesSearch && matchesSpecialization;
  });

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm("");
    setSortBy("newest");
    setSelectedSpecialization("all");
  };

  // Check if any filter is active
  const isFilterActive = searchTerm !== "" || sortBy !== "newest" || selectedSpecialization !== "all";

  // Animation variants for staggered list
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <div className="container px-4 md:px-6 py-10">
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col mb-8"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="text-epu-secondary h-8 w-8" />
          <h1 className="text-3xl md:text-4xl font-bold mb-1">Khóa học</h1>
        </div>
        <p className="text-muted-foreground">
          Khám phá các khóa học chất lượng để nâng cao kiến thức và kỹ năng của bạn
        </p>
      </motion.div>
      
      {/* Filter section - improved animations */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
        className="flex flex-col gap-4 mb-8 bg-white dark:bg-slate-900/60 p-5 rounded-xl shadow-md dark:shadow-slate-900/10 backdrop-blur-sm border border-slate-100 dark:border-slate-800"
      >
        {/* Search and Sort controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Input
              placeholder="Tìm kiếm khóa học..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full shadow-sm focus:shadow-md focus:border-epu-primary/50 dark:focus:border-epu-accent/50 transition-all"
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5 hover:bg-slate-100 dark:hover:bg-slate-800"
                onClick={() => setSearchTerm("")}
              >
                <X size={14} />
              </Button>
            )}
          </div>
          <div className="w-full sm:w-48">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="shadow-sm focus:ring-epu-primary/30 dark:focus:ring-epu-accent/30">
                <SelectValue placeholder="Sắp xếp theo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Mới nhất</SelectItem>
                <SelectItem value="popular">Phổ biến nhất</SelectItem>
                <SelectItem value="title-asc">Tên A-Z</SelectItem>
                <SelectItem value="title-desc">Tên Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Specialization filter - improved animation and visual feedback */}
        <motion.div 
          className="flex flex-wrap gap-2"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {specializations.map((spec) => (
            <motion.div key={spec.id} variants={item}>
              <Badge
                variant={selectedSpecialization === spec.id ? "default" : "outline"}
                className={`cursor-pointer transition-all duration-300 px-3 py-1 shadow-sm ${
                  selectedSpecialization === spec.id 
                    ? "bg-epu-primary hover:bg-epu-primary/90 dark:bg-epu-accent dark:hover:bg-epu-accent/90" 
                    : "hover:bg-epu-primary/10 hover:border-epu-primary/50 dark:hover:bg-epu-accent/10 dark:hover:border-epu-accent/50"
                }`}
                onClick={() => setSelectedSpecialization(spec.id)}
              >
                {spec.name}
              </Badge>
            </motion.div>
          ))}
          
          {isFilterActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs h-7 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                onClick={resetFilters}
              >
                <X size={14} className="mr-1" /> Xóa bộ lọc
              </Button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
      
      {/* Course Grid with smoother transitions */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {Array(6).fill(0).map((_, index) => (
              <div 
                key={`skeleton-${index}`} 
                className="bg-slate-100 dark:bg-slate-800/60 rounded-xl h-64 animate-pulse"
              ></div>
            ))}
          </motion.div>
        ) : filteredCourses.length > 0 ? (
          <motion.div 
            key="results"
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredCourses.map((course) => (
              <motion.div key={course.id} variants={item} layout>
                <CourseCard course={course} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center py-12 bg-white dark:bg-slate-900/60 rounded-xl shadow-md backdrop-blur-sm border border-slate-100 dark:border-slate-800"
          >
            <h3 className="text-lg font-medium mb-2">Không tìm thấy khóa học</h3>
            <p className="text-muted-foreground">
              Không có khóa học nào phù hợp với tìm kiếm của bạn
            </p>
            <Button 
              variant="outline" 
              className="mt-4 shadow-sm hover:shadow-md transition-shadow border-epu-primary/50 text-epu-primary hover:bg-epu-primary/10 dark:border-epu-accent/50 dark:text-epu-accent dark:hover:bg-epu-accent/10"
              onClick={resetFilters}
            >
              Xóa tìm kiếm
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CoursesPage;
