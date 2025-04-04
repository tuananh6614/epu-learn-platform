# EduLearn Backend

Backend API cho hệ thống học trực tuyến EduLearn, được xây dựng bằng Node.js, Express và MySQL.

## Cài đặt

### Yêu cầu

- Node.js (v14 trở lên)
- MySQL (qua XAMPP hoặc cài đặt riêng)

### Các bước cài đặt

1. Cài đặt các dependencies:

```bash
npm install
```

2. Tạo file .env dựa trên mẫu:

```
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=edulearn
JWT_SECRET=edulearn_secret_key
JWT_EXPIRES_IN=24h
```

3. Tạo cơ sở dữ liệu:
   - Khởi động MySQL từ XAMPP
   - Import file `database.sql` vào MySQL để tạo cấu trúc bảng

4. Chạy ứng dụng ở chế độ development:

```bash
npm run dev
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Đăng ký người dùng mới
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Lấy thông tin người dùng hiện tại
- `POST /api/auth/change-password` - Đổi mật khẩu

### Users

- `GET /api/users` - Lấy danh sách người dùng (chỉ admin)
- `GET /api/users/:id` - Lấy thông tin người dùng theo ID (chỉ admin)
- `PUT /api/users/:id` - Cập nhật thông tin người dùng (chỉ admin)
- `DELETE /api/users/:id` - Xóa người dùng (chỉ admin)
- `PUT /api/users/profile/update` - Cập nhật thông tin cá nhân

### Courses

- `GET /api/courses` - Lấy danh sách khóa học
- `GET /api/courses/:id` - Lấy thông tin khóa học theo ID
- `GET /api/courses/teacher/courses` - Lấy danh sách khóa học của giáo viên
- `POST /api/courses` - Tạo khóa học mới (giáo viên, admin)
- `PUT /api/courses/:id` - Cập nhật khóa học (giáo viên, admin)
- `DELETE /api/courses/:id` - Xóa khóa học (giáo viên, admin)
- `GET /api/courses/:id/students` - Lấy danh sách học viên đã đăng ký khóa học
- `GET /api/courses/student/enrolled` - Lấy danh sách khóa học đã đăng ký

### Lessons

- `GET /api/lessons/course/:courseId` - Lấy danh sách bài học theo khóa học
- `GET /api/lessons/:id` - Lấy chi tiết bài học
- `POST /api/lessons/course/:courseId` - Thêm bài học mới (giáo viên, admin)
- `PUT /api/lessons/:id` - Cập nhật bài học (giáo viên, admin)
- `DELETE /api/lessons/:id` - Xóa bài học (giáo viên, admin)

### Enrollments

- `POST /api/enrollments` - Đăng ký khóa học
- `DELETE /api/enrollments/:courseId` - Hủy đăng ký khóa học
- `GET /api/enrollments` - Lấy danh sách khóa học đã đăng ký
- `GET /api/enrollments/check/:courseId` - Kiểm tra đã đăng ký khóa học chưa

## Tài khoản mặc định

1. **Admin**
   - Email: admin@edulearn.com
   - Password: admin123

2. **Giáo viên**
   - Email: teacher@edulearn.com
   - Password: teacher123

3. **Học viên**
   - Email: student@edulearn.com
   - Password: student123 