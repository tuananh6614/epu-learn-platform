import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
  }).format(amount);
}

// Mock data for demonstration purposes
export const mockCourses = [
  {
    id: 1,
    title: "Lập trình Web với HTML, CSS và JavaScript",
    description: "Khóa học cơ bản về lập trình web, giúp bạn xây dựng các trang web đơn giản với HTML, CSS và JavaScript.",
    thumbnail: "https://placehold.co/600x400/3498db/FFFFFF/png?text=Web+Development",
    chapterCount: 5,
    lessonCount: 25,
    enrollmentCount: 120,
    specialization: "CNTT"
  },
  {
    id: 2,
    title: "Học lập trình PHP & MySQL từ cơ bản đến nâng cao",
    description: "Khóa học giúp bạn hiểu và ứng dụng PHP & MySQL để xây dựng các ứng dụng web động với cơ sở dữ liệu.",
    thumbnail: "https://placehold.co/600x400/9b59b6/FFFFFF/png?text=PHP+MySQL",
    chapterCount: 8,
    lessonCount: 42,
    enrollmentCount: 85,
    specialization: "CNTT"
  },
  {
    id: 3,
    title: "Phân tích và thiết kế hệ thống thông tin",
    description: "Học cách phân tích yêu cầu và thiết kế hệ thống thông tin hiệu quả với các phương pháp chuẩn công nghiệp.",
    thumbnail: "https://placehold.co/600x400/e74c3c/FFFFFF/png?text=System+Design",
    chapterCount: 6,
    lessonCount: 30,
    enrollmentCount: 65,
    specialization: "ATTT"
  },
  {
    id: 4,
    title: "An toàn và bảo mật thông tin",
    description: "Tìm hiểu các phương pháp và kỹ thuật bảo vệ hệ thống thông tin khỏi các mối đe dọa an ninh mạng.",
    thumbnail: "https://placehold.co/600x400/2ecc71/FFFFFF/png?text=Security",
    chapterCount: 7,
    lessonCount: 35,
    enrollmentCount: 95,
    specialization: "ATTT"
  },
  {
    id: 5,
    title: "Kỹ thuật lập trình với Python",
    description: "Làm quen với ngôn ngữ lập trình Python và ứng dụng trong phân tích dữ liệu, machine learning và web development.",
    thumbnail: "https://placehold.co/600x400/f39c12/FFFFFF/png?text=Python",
    chapterCount: 9,
    lessonCount: 45,
    enrollmentCount: 150,
    specialization: "CNTT"
  },
  {
    id: 6,
    title: "Cơ sở dữ liệu nâng cao",
    description: "Học các kỹ thuật tối ưu hóa cơ sở dữ liệu, indexing, transaction và các mô hình CSDL hiện đại như NoSQL.",
    thumbnail: "https://placehold.co/600x400/1abc9c/FFFFFF/png?text=Advanced+DB",
    chapterCount: 6,
    lessonCount: 28,
    enrollmentCount: 70,
    specialization: "DTVT"
  }
];

export const mockDocuments = [
  {
    id: 1,
    title: "Giáo trình Lập trình Web",
    description: "Tài liệu tổng hợp kiến thức cơ bản và nâng cao về lập trình web với HTML, CSS, JavaScript và các framework hiện đại.",
    preview_url: "preview_url_1",
    price: 150000,
    category_name: "Lập trình",
    file_path: "path/to/file1.pdf"
  },
  {
    id: 2,
    title: "Giáo trình Mạng máy tính",
    description: "Tài liệu học tập về mạng máy tính, các giao thức mạng và bảo mật mạng cho sinh viên CNTT.",
    preview_url: "preview_url_2",
    price: 120000,
    category_name: "Mạng máy tính",
    file_path: "path/to/file2.pdf"
  },
  {
    id: 3,
    title: "Cấu trúc dữ liệu và giải thuật",
    description: "Tài liệu tổng hợp về các cấu trúc dữ liệu và giải thuật cơ bản, các bài tập và hướng dẫn giải.",
    preview_url: "preview_url_3",
    price: 100000,
    category_name: "Thuật toán",
    file_path: "path/to/file3.pdf"
  },
  {
    id: 4,
    title: "Hệ quản trị cơ sở dữ liệu",
    description: "Tài liệu hướng dẫn sử dụng và tối ưu hóa các hệ quản trị CSDL phổ biến như MySQL, PostgreSQL.",
    preview_url: "preview_url_4",
    price: 180000,
    category_name: "Cơ sở dữ liệu",
    file_path: "path/to/file4.pdf"
  },
  {
    id: 5,
    title: "Đề cương ôn tập Kỹ thuật lập trình",
    description: "Tổng hợp đề cương ôn tập môn Kỹ thuật lập trình cho sinh viên năm nhất CNTT.",
    preview_url: "preview_url_5",
    price: 50000,
    category_name: "Học liệu",
    file_path: "path/to/file5.pdf"
  },
  {
    id: 6,
    title: "Bài tập Toán rời rạc có lời giải",
    description: "Tài liệu tổng hợp các bài tập Toán rời rạc kèm theo hướng dẫn giải chi tiết.",
    preview_url: "preview_url_6",
    price: 80000,
    category_name: "Toán học",
    file_path: "path/to/file6.pdf"
  },
  {
    id: 7,
    title: "Giáo trình Trí tuệ nhân tạo cơ bản",
    description: "Tài liệu học tập về các thuật toán và kỹ thuật trong lĩnh vực trí tuệ nhân tạo.",
    preview_url: "preview_url_7",
    price: 200000,
    category_name: "AI & ML",
    file_path: "path/to/file7.pdf"
  },
  {
    id: 8,
    title: "Hướng dẫn thiết kế và phát triển phần mềm",
    description: "Tài liệu hướng dẫn quy trình thiết kế và phát triển phần mềm theo chuẩn công nghiệp.",
    preview_url: "preview_url_8",
    price: 150000,
    category_name: "Phát triển phần mềm",
    file_path: "path/to/file8.pdf"
  }
];

export const mockUsers = [
  {
    id: 1,
    fullName: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    role: "user",
    created_at: "2023-05-15"
  },
  {
    id: 2,
    fullName: "Trần Thị B",
    email: "tranthib@example.com",
    role: "user",
    created_at: "2023-06-20"
  },
  {
    id: 3,
    fullName: "Lê Văn C",
    email: "levanc@example.com",
    role: "user",
    created_at: "2023-07-10"
  },
  {
    id: 4,
    fullName: "Phạm Thị D",
    email: "phamthid@example.com",
    role: "admin",
    created_at: "2023-04-05"
  },
  {
    id: 5,
    fullName: "Hoàng Văn E",
    email: "hoangvane@example.com",
    role: "user",
    created_at: "2023-08-15"
  }
];

export const mockChapters = [
  {
    id: 1,
    course_id: 1,
    title: "Giới thiệu về HTML",
    description: "Chương này giới thiệu các khái niệm cơ bản về HTML và cấu trúc của một trang web.",
    chapter_order: 1,
    lessons: [
      { id: 1, title: "Cấu trúc cơ bản của HTML", lesson_order: 1 },
      { id: 2, title: "Các thẻ HTML phổ biến", lesson_order: 2 },
      { id: 3, title: "Thuộc tính và giá trị", lesson_order: 3 },
      { id: 4, title: "Forms và Input", lesson_order: 4 },
    ]
  },
  {
    id: 2,
    course_id: 1,
    title: "CSS cơ bản",
    description: "Chương này giới thiệu về CSS và cách áp dụng style cho trang web.",
    chapter_order: 2,
    lessons: [
      { id: 5, title: "Giới thiệu về CSS", lesson_order: 1 },
      { id: 6, title: "Selectors và Properties", lesson_order: 2 },
      { id: 7, title: "Box Model", lesson_order: 3 },
      { id: 8, title: "Flexbox và Grid", lesson_order: 4 },
    ]
  },
  {
    id: 3,
    course_id: 1,
    title: "JavaScript cơ bản",
    description: "Chương này giới thiệu về JavaScript và cách tạo tính năng tương tác cho web.",
    chapter_order: 3,
    lessons: [
      { id: 9, title: "Giới thiệu về JavaScript", lesson_order: 1 },
      { id: 10, title: "Biến và Kiểu dữ liệu", lesson_order: 2 },
      { id: 11, title: "Functions và Events", lesson_order: 3 },
      { id: 12, title: "DOM Manipulation", lesson_order: 4 },
    ]
  }
];

export const mockExams = [
  {
    id: 1,
    course_id: 1,
    chapter_id: 1,
    title: "Kiểm tra HTML cơ bản",
    time_limit: 30,
    total_questions: 10,
    passing_score: 7,
    questions: [
      {
        id: 1,
        question_text: "Thẻ nào được sử dụng để tạo tiêu đề lớn nhất trong HTML?",
        option_a: "<h1>",
        option_b: "<heading>",
        option_c: "<h6>",
        option_d: "<head>",
        correct_answer: "A"
      },
      {
        id: 2,
        question_text: "Thẻ nào dùng để tạo danh sách có thứ tự?",
        option_a: "<dl>",
        option_b: "<ul>",
        option_c: "<ol>",
        option_d: "<list>",
        correct_answer: "C"
      }
    ]
  },
  {
    id: 2,
    course_id: 1,
    chapter_id: 2,
    title: "Kiểm tra CSS cơ bản",
    time_limit: 30,
    total_questions: 10,
    passing_score: 6,
    questions: [
      {
        id: 3,
        question_text: "Thuộc tính CSS nào dùng để thay đổi màu chữ?",
        option_a: "text-color",
        option_b: "font-color",
        option_c: "color",
        option_d: "text-style",
        correct_answer: "C"
      },
      {
        id: 4,
        question_text: "Selector nào chọn tất cả các thẻ p là con trực tiếp của div?",
        option_a: "div p",
        option_b: "div > p",
        option_c: "div + p",
        option_d: "div ~ p",
        correct_answer: "B"
      }
    ]
  }
];
