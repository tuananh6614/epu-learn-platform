
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { ArrowUpDown, Award, BookOpen, Trophy } from "lucide-react";

// Mock data for grades
const mockGrades = [
  { id: 1, courseName: "Toán cao cấp", grade: 8.5, credit: 4, status: "Đạt" },
  { id: 2, courseName: "Vật lý đại cương", grade: 7.8, credit: 3, status: "Đạt" },
  { id: 3, courseName: "Mạng máy tính", grade: 9.0, credit: 4, status: "Đạt" },
  { id: 4, courseName: "Cơ sở dữ liệu", grade: 8.2, credit: 3, status: "Đạt" },
  { id: 5, courseName: "Lập trình Java", grade: 8.7, credit: 4, status: "Đạt" },
];

const ProfileGrades = () => {
  const { toast } = useToast();
  const [grades, setGrades] = useState(mockGrades);
  const [isLoading, setIsLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof typeof grades[0] | null;
    direction: 'ascending' | 'descending';
  }>({ key: null, direction: 'ascending' });

  useEffect(() => {
    // Simulate API request
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const calculateGPA = () => {
    if (grades.length === 0) return 0;
    
    const totalPoints = grades.reduce((acc, grade) => acc + (grade.grade * grade.credit), 0);
    const totalCredits = grades.reduce((acc, grade) => acc + grade.credit, 0);
    
    return (totalPoints / totalCredits).toFixed(2);
  };

  const handleSort = (key: keyof typeof grades[0]) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });
    
    const sortedGrades = [...grades].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
      return 0;
    });
    
    setGrades(sortedGrades);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Card className="h-64 animate-pulse bg-muted" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/30 shadow-md border-blue-100 dark:border-blue-900/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy size={18} className="text-yellow-500" />
              Điểm trung bình
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{calculateGPA()}</div>
            <p className="text-sm text-muted-foreground">Trên thang điểm 10</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/30 shadow-md border-green-100 dark:border-green-900/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Award size={18} className="text-emerald-500" />
              Tổng số tín chỉ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {grades.reduce((acc, grade) => acc + grade.credit, 0)}
            </div>
            <p className="text-sm text-muted-foreground">Đã hoàn thành</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/40 dark:to-violet-950/30 shadow-md border-purple-100 dark:border-purple-900/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen size={18} className="text-purple-500" />
              Số môn học
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">{grades.length}</div>
            <p className="text-sm text-muted-foreground">Đã hoàn thành</p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="overflow-hidden shadow-md border-blue-100 dark:border-blue-900/30 transition-all">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-900/10">
          <CardTitle>Bảng điểm chi tiết</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="rounded-md overflow-hidden">
            <Table>
              <TableHeader className="bg-muted/40">
                <TableRow>
                  <TableHead>STT</TableHead>
                  <TableHead className="cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleSort('courseName')}>
                    <div className="flex items-center">
                      Tên môn học
                      <ArrowUpDown size={16} className="ml-1" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleSort('grade')}>
                    <div className="flex items-center">
                      Điểm
                      <ArrowUpDown size={16} className="ml-1" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleSort('credit')}>
                    <div className="flex items-center">
                      Số tín chỉ
                      <ArrowUpDown size={16} className="ml-1" />
                    </div>
                  </TableHead>
                  <TableHead className="cursor-pointer hover:text-blue-600 transition-colors" onClick={() => handleSort('status')}>
                    <div className="flex items-center">
                      Trạng thái
                      <ArrowUpDown size={16} className="ml-1" />
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {grades.map((grade, index) => (
                  <TableRow 
                    key={grade.id} 
                    className={`
                      hover:bg-blue-50/50 dark:hover:bg-blue-950/10 
                      transition-colors
                      ${index % 2 === 0 ? 'bg-transparent' : 'bg-muted/20'}
                    `}
                  >
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-medium">{grade.courseName}</TableCell>
                    <TableCell>
                      <div className={`font-semibold ${
                        grade.grade >= 8.5 ? 'text-green-600 dark:text-green-400' : 
                        grade.grade >= 7.0 ? 'text-blue-600 dark:text-blue-400' : 
                        grade.grade >= 5.0 ? 'text-amber-600 dark:text-amber-400' : 
                        'text-red-600 dark:text-red-400'
                      }`}>
                        {grade.grade.toFixed(1)}
                      </div>
                    </TableCell>
                    <TableCell>{grade.credit}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                        {grade.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileGrades;
