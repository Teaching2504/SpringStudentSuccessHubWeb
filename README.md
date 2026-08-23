# OU-SSH: Hệ Thống Quản Lý Kết Quả Học Tập - Rèn Luyện & Xét Duyệt Học Bổng

> **ĐỀ TÀI KHÓA LUẬN TỐT NGHIỆP ĐẠI HỌC**  
> **Sinh viên thực hiện**: NGUYỄN THỊ TUYẾT TRINH (MSSV: 2351010216)  
> **Giảng viên hướng dẫn**: Th.S NGUYỄN TRUNG HẬU  
> **Đơn vị đào tạo**: Trường Đại học Mở Thành phố Hồ Chí Minh (OU)

---

## 📌 Giới thiệu Đề tài
**OU-SSH (Open University Student Success Hub)** là hệ thống phần mềm quản lý toàn diện kết quả học tập (GPA), điểm rèn luyện (ĐRL) và tự động hóa quy trình xét duyệt học bổng khuyến khích học tập (KKHT) cho sinh viên, tích hợp **Dynamic Rule Engine** hỗ trợ cấu hình quy chế linh hoạt và lưu trữ phiên bản quy tắc (Versioning).

---

## 🛠️ Công nghệ Sử dụng
- **Backend**: Java 21 / 25, Spring Boot 3.4.3, Spring Data JPA, Spring Security, JJWT (0.12.6), Apache POI (Excel).
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide Icons, Axios, React Router DOM v6.
- **Database**: MySQL 8.x / Embedded H2 Database (17 bảng thực thể quan hệ).

---

## 👥 4 Vai trò & 11 Use Cases Cốt lõi
1. **Quản trị viên (Admin)**: Quản lý người dùng & phân quyền (UC02), Danh mục đào tạo (UC03), Hồ sơ sinh viên & Nhập Excel (UC04).
2. **Cán bộ Cấp Trường (P.CTSV)**: Quản lý chiến dịch học bổng (UC05), Cấu hình Dynamic Rule Engine & Versioning (UC06), Phê duyệt danh sách khoa & Công bố toàn trường (UC10), Thống kê ngân sách.
3. **Cán bộ Cấp Khoa**: Kích hoạt Rule Engine xét duyệt tự động (UC07), Công bố dự kiến & Xử lý khiếu nại (UC08), Chốt danh sách gửi trường (UC09), Thẩm định minh chứng rèn luyện (UC11).
4. **Sinh viên**: Đăng nhập (UC01), Tra cứu kết quả học tập / học bổng & Gửi kiến nghị (UC08), Nộp minh chứng hoạt động rèn luyện (UC11).

---

## 🚀 Hướng dẫn Cài đặt & Khởi chạy

### 1. Khởi chạy Backend (Spring Boot):
```bash
cd SpringStudentSuccessHubApp
mvn spring-boot:run
```
*Backend chạy tại: `http://localhost:8080` (API: `http://localhost:8080/api`)*

### 2. Khởi chạy Frontend (ReactJS):
```bash
cd frontend
npm install
npm run dev
```
*Frontend chạy tại: `http://localhost:5173`*

---

## 🔑 Tài khoản Mẫu Thử nghiệm:
- **Admin**: `admin` / `admin123`
- **Cán bộ Trường**: `captruong` / `truong123`
- **Cán bộ Khoa**: `cbk_cntt` / `khoa123`
- **Sinh viên**: `2351010216` / `sv123`
