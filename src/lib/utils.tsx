
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const mockUsers = [
  { 
    id: 1,
    email: "admin@epu.edu.vn", 
    password: "admin123", 
    role: "admin", 
    fullName: "Admin EPU",
    created_at: "2025-03-01" 
  },
  { 
    id: 2,
    email: "user@epu.edu.vn", 
    password: "user123", 
    role: "user", 
    fullName: "Học Viên Demo",
    created_at: "2025-04-01"  
  },
];

export const mockCourses = [
  {
    id: 1,
    title: "Cơ sở dữ liệu nâng cao",
    description: "Học về các khái niệm nâng cao trong cơ sở dữ liệu, bao gồm tối ưu hóa truy vấn, indexing và thiết kế CSDL cho hệ thống lớn.",
    image: "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?auto=format&w=500",
    price: 599000,
    instructor: "TS. Nguyễn Văn A",
    duration: "8 tuần",
    level: "Trung cấp",
    category: "CSDL",
    enrollmentCount: 245,
    rating: 4.8
  },
  {
    id: 2,
    title: "Lập trình Web với React",
    description: "Khóa học giúp bạn thành thạo React, xây dựng single-page applications hiện đại và hiệu năng cao với công nghệ JavaScript phổ biến nhất hiện nay.",
    image: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?auto=format&w=500",
    price: 799000,
    instructor: "ThS. Lê Văn B",
    duration: "10 tuần",
    level: "Nâng cao",
    category: "Lập trình Web",
    enrollmentCount: 412,
    rating: 4.9
  },
  {
    id: 3,
    title: "Nhập môn AI và Machine Learning",
    description: "Tìm hiểu về các thuật toán AI cơ bản, machine learning và cách ứng dụng chúng để giải quyết các bài toán thực tế.",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&w=500",
    price: 899000,
    instructor: "PGS.TS. Phạm Thị C",
    duration: "12 tuần",
    level: "Cơ bản",
    category: "AI/ML",
    enrollmentCount: 378,
    rating: 4.7
  },
  {
    id: 4,
    title: "Thiết kế mạch điện tử",
    description: "Học cách thiết kế và phân tích mạch điện tử cơ bản và nâng cao, từ lý thuyết đến thực hành.",
    image: "https://images.unsplash.com/photo-1516110833967-0b5716ca1387?auto=format&w=500",
    price: 699000,
    instructor: "TS. Hoàng Đức D",
    duration: "9 tuần",
    level: "Trung cấp",
    category: "Điện tử",
    enrollmentCount: 156,
    rating: 4.6
  },
];

export const mockDocuments = [
  {
    id: 1,
    title: "Giáo trình Mạng máy tính",
    description: "Giáo trình đầy đủ về các khái niệm cơ bản và nâng cao trong mạng máy tính",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&w=500",
    price: 120000,
    format: "PDF",
    pages: 324,
    author: "TS. Nguyễn Văn A",
    category: "Mạng",
    publishedAt: "01/03/2025",
    downloadCount: 189
  },
  {
    id: 2,
    title: "Tài liệu Machine Learning cho người mới bắt đầu",
    description: "Hướng dẫn toàn diện về machine learning dành cho người mới, với các ví dụ thực tế và code mẫu",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&w=500",
    price: 150000,
    format: "PDF + Code",
    pages: 250,
    author: "ThS. Lê Văn B",
    category: "AI/ML",
    publishedAt: "15/03/2025",
    downloadCount: 272
  },
  {
    id: 3,
    title: "Tóm tắt khóa học Lập trình Python",
    description: "Tài liệu tóm tắt các kiến thức quan trọng trong khóa học lập trình Python từ cơ bản đến nâng cao",
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&w=500",
    price: 99000,
    format: "PDF + Examples",
    pages: 180,
    author: "PGS.TS. Phạm Thị C",
    category: "Lập trình",
    publishedAt: "05/04/2025",
    downloadCount: 345
  }
];
