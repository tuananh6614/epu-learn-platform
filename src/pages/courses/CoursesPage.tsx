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
import { Search, X } from "lucide-react";
import CourseCard from "@/components/courses/CourseCard";
import { CourseType } from "@/components/courses/CourseCard";
import { mockCourses } from "@/lib/utils";

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

  return (
    <div className="container px-4 md:px-6 py-10">
      <div className="flex flex-col mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Khóa học</h1>
        <p className="text-muted-foreground">
          Khám phá các khóa học chất lượng để nâng cao kiến thức và kỹ năng của bạn
        </p>
      </div>
      
      {/* Filter section */}
      <div className="flex flex-col gap-4 mb-8">
        {/* Search and Sort controls */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Input
              placeholder="Tìm kiếm khóa học..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-full"
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
              <SelectTrigger>
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
              className="cursor-pointer hover:bg-secondary/80 transition-colors"
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
      </div>
      
      {/* Course Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">Không tìm thấy khóa học</h3>
          <p className="text-muted-foreground">
            Không có khóa học nào phù hợp với tìm kiếm của bạn
          </p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={resetFilters}
          >
            Xóa tìm kiếm
          </Button>
        </div>
      )}
    </div>
  );
};

export default CoursesPage;
