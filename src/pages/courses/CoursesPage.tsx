
import { useState } from "react";
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
import { motion } from "framer-motion";

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
  
  const courses = [...mockCourses] as CourseType[]; // Cast to CourseType to ensure compatibility
  
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
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="container px-4 md:px-6 py-10">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
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
      
      {/* Filter section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex flex-col gap-4 mb-8 bg-white p-5 rounded-xl shadow-md"
      >
        {/* Search and Sort controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Input
              placeholder="Tìm kiếm khóa học..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full shadow-sm focus:shadow-md transition-shadow"
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-5 w-5"
                onClick={() => setSearchTerm("")}
              >
                <X size={14} />
              </Button>
            )}
          </div>
          <div className="w-full sm:w-48">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="shadow-sm">
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
        
        {/* Specialization filter */}
        <div className="flex flex-wrap gap-2">
          {specializations.map((spec) => (
            <Badge
              key={spec.id}
              variant={selectedSpecialization === spec.id ? "default" : "outline"}
              className="cursor-pointer hover:bg-epu-secondary hover:text-white transition-colors px-3 py-1 shadow-sm"
              onClick={() => setSelectedSpecialization(spec.id)}
            >
              {spec.name}
            </Badge>
          ))}
          
          {isFilterActive && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-7"
              onClick={resetFilters}
            >
              <X size={14} className="mr-1" /> Xóa bộ lọc
            </Button>
          )}
        </div>
      </motion.div>
      
      {/* Course Grid */}
      {filteredCourses.length > 0 ? (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredCourses.map((course) => (
            <motion.div key={course.id} variants={item}>
              <CourseCard course={course} />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center py-12 bg-white rounded-xl shadow-md"
        >
          <h3 className="text-lg font-medium mb-2">Không tìm thấy khóa học</h3>
          <p className="text-muted-foreground">
            Không có khóa học nào phù hợp với tìm kiếm của bạn
          </p>
          <Button 
            variant="outline" 
            className="mt-4 shadow-sm hover:shadow-md transition-shadow"
            onClick={resetFilters}
          >
            Xóa tìm kiếm
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default CoursesPage;
