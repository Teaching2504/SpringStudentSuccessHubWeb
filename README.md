# OU-SSH Hub: He Thong Quan Ly Ket Qua Hoc Tap & Ren Luyen Ho Tro Xet Hoc Bong Sinh Vien

Trường Đại học Mở Thành phố Hồ Chí Minh  
Khoa Công nghệ Thông tin  
Đồ án Ngành Công nghệ Thông tin

- **Sinh viên thực hiện**: Nguyễn Thị Tuyết Trinh
- **Mã số sinh viên**: 2351010216
- **Lớp**: DH23CS01 (Khóa 2023 - 2027)
- **Giảng viên hướng dẫn**: ThS. Nguyễn Trung Hậu

---

## 1. Giới thiệu tổng quan

Hệ thống **OU-SSH Hub (Student Success Hub)** được xây dựng nhằm tin học hóa và tự động hóa công tác quản lý học vụ tại Trường Đại học Mở TP.HCM, tập trung vào hai mảng trọng tâm:
1. **Quản lý kết quả học tập và rèn luyện**: Theo dõi điểm trung bình học kỳ (GPA), điểm rèn luyện (ĐRL), cảnh báo học vụ, lưu trữ và thẩm định minh chứng hoạt động phong trào trực tuyến.
2. **Tự động hóa quy trình xét học bổng Khuyến khích học tập (HB KKHT)**: Áp dụng công cụ xếp hạng (Rule Engine) phân bổ theo quỹ 8% học phí, xếp hạng sinh viên từ trên xuống, tiếp nhận và xử lý khiếu nại trước khi phê duyệt danh sách chính thức.

Hệ thống được thiết kế theo mô hình phân luồng người dùng:
- **Cổng Quản trị (Thymeleaf Spring MVC)**: Dành cho Ban Giám hiệu, Phòng Công tác Sinh viên (Cấp Trường), Ban Chủ nhiệm và Trợ lý Quản lý Sinh viên (Cấp Khoa) cùng Quản trị viên hệ thống. Địa chỉ truy cập: `http://localhost:8080/login`.
- **Cổng Sinh viên (React Single Page Application)**: Dành cho sinh viên tra cứu chương trình đào tạo, bảng điểm chi tiết từng học kỳ, nộp minh chứng rèn luyện, theo dõi kết quả xét học bổng và gửi đơn kiến nghị/khiếu nại trực tuyến. Địa chỉ truy cập: `http://localhost:8000/login`.

---

## 2. Quy chế và Logic Xét Học bổng Khuyến khích Học tập

Hệ thống hiện thực hóa các quy định hiện hành về Học bổng Khuyến khích Học tập của Trường Đại học Mở TP.HCM:

### 2.1. Điều kiện tham gia xét học bổng
- Sinh viên theo học hệ chính quy, có đăng ký và tích lũy đủ số tín chỉ tối thiểu theo quy định trong học kỳ xét (thông thường từ 14 tín chỉ trở lên).
- Không có học phần nào bị điểm F / rớt môn trong học kỳ (`coHocPhanRot = false`).
- Điểm trung bình học kỳ (GPA) đạt từ 2.50 trở lên và Điểm rèn luyện (ĐRL) đạt từ 65 điểm trở lên.

### 2.2. Tiêu chuẩn xếp loại và định mức học bổng
Mức học bổng được tính theo tỷ lệ phần trăm mức học phí thực tế của sinh viên trong học kỳ:

| Xếp loại học bổng | Điểm GPA (Hệ 4) | Điểm Rèn luyện | Tỷ lệ chi trả (% Học phí) |
| :--- | :--- | :--- | :--- |
| Xuất sắc | GPA >= 3.60 | ĐRL >= 90 (Xuất sắc) | 100% học phí |
| Giỏi | GPA >= 3.20 | ĐRL >= 80 (Tốt) | 70% học phí |
| Khá | GPA >= 2.50 | ĐRL >= 65 (Khá) | 50% học phí |

*Quy tắc kết hợp*: Loại học bổng lấy theo mức của điểm thấp hơn giữa Điểm học tập và Điểm rèn luyện. Ví dụ, sinh viên có GPA 3.65 (đủ mức Xuất sắc) nhưng ĐRL 82 (mức Giỏi) thì xếp loại học bổng là Giỏi.

### 2.3. Quy tắc phân bổ Quỹ 8% và cơ chế xếp hạng
- **Quỹ học bổng**: Được trích bằng 8% tổng học phí thực tế thu được của nhóm sinh viên (theo Khoa / Ngành / Khóa).
- **Thứ tự ưu tiên xếp hạng**: Điểm GPA cao hơn -> Điểm Rèn luyện cao hơn -> Số tín chỉ tích lũy nhiều hơn -> MSSV.
- **Quy tắc không để tồn dư ngân sách**: Hệ thống phân bổ học bổng lần lượt từ trên xuống theo thứ hạng. Nếu số tiền còn lại trong quỹ lớn hơn 0 nhưng không đủ một suất trọn vẹn, hệ thống vẫn tiếp tục xét trao thêm 1 suất học bổng nữa cho sinh viên đủ điều kiện kế tiếp nhằm tối ưu hóa ngân sách hỗ trợ sinh viên.
- **Xử lý khiếu nại**: Sinh viên có quyền gửi đơn rà soát kết quả trong thời hạn công bố dự kiến. Sau khi Cán bộ Khoa thẩm định và phê duyệt điều chỉnh, hệ thống cập nhật lại kết quả trước khi Phòng CTSV duyệt chính thức.

---

## 3. Kiến trúc Công nghệ

### 3.1. Backend (Spring Boot)
- **Ngôn ngữ**: Java 21 LTS.
- **Framework**: Spring Boot 3.4.3 (Spring MVC, Spring Data JPA, Spring Security).
- **Xác thực & Bảo mật**: JWT (JSON Web Token) cho REST API và Form Login / HttpSession cho Cổng Quản trị Thymeleaf; mật khẩu mã hóa chuẩn BCrypt.
- **Lưu trữ tệp & media**: Tích hợp Cloudinary SDK để lưu trữ ảnh đại diện, ảnh giấy chứng nhận minh chứng rèn luyện và tệp đính kèm khiếu nại.
- **Xử lý dữ liệu bảng tính**: Apache POI phục vụ xuất/nhập danh sách sinh viên và kết quả học bổng.

### 3.2. Frontend (React)
- **Công nghệ nền tảng**: React 18, Vite 6, Tailwind CSS.
- **Thư viện giao diện**: Lucide React Icons, React Router DOM v6, Axios Interceptors (tự động đính kèm Bearer token và xử lý lỗi mạng).
- **Bảng điểm đa học kỳ**: Hỗ trợ bộ lọc Dropdown, nút điều hướng mũi tên (Kỳ trước / Kỳ sau) và thanh tab chuyển học kỳ 1 chạm.

### 3.3. Cơ sở dữ liệu (MySQL)
- Hệ quản trị CSDL: MySQL 8.x / MySQL 9.x.
- Tên cơ sở dữ liệu: `ousshdb`.
- Cấu trúc gồm 20 bảng quan hệ chuẩn hóa: Người dùng, Nhân viên, Sinh viên, Khoa, Ngành, Lớp sinh hoạt, Môn học, CTĐT, Điểm học phần, Kết quả học tập, Kết quả rèn luyện, Minh chứng rèn luyện, Đợt xét học bổng, Hồ sơ học bổng, Kiến nghị khiếu nại...

---

## 4. Phân quyền và Chức năng theo Vai trò

### 4.1. Quản trị viên (Admin)
- Quản lý danh sách người dùng, cấp phát tài khoản, đổi mật khẩu và khóa/mở khóa tài khoản.
- Quản lý danh mục đào tạo (Khoa, Ngành, Học kỳ, Lớp sinh hoạt, Môn học theo QĐ 561/QĐ-ĐHM).
- Quản lý thông tin hồ sơ sinh viên, nhập dữ liệu hàng loạt từ Excel.

### 4.2. Cán bộ Cấp Trường (Phòng Công tác Sinh viên)
- Khởi tạo và quản lý các đợt xét học bổng KKHT theo từng học kỳ.
- Thiết lập định mức, phân bổ ngân sách quỹ học bổng cho các Khoa.
- Tiếp nhận danh sách đề xuất từ các Khoa, phê duyệt hoặc yêu cầu điều chỉnh, công bố quyết định khen thưởng chính thức toàn trường.

### 4.3. Cán bộ Cấp Khoa
- Kích hoạt Rule Engine tự động lọc và xếp hạng học bổng sinh viên trong Khoa.
- Công bố danh sách dự kiến, tiếp nhận đơn khiếu nại của sinh viên và gửi phản hồi giải trình.
- Thẩm định và duyệt minh chứng hoạt động rèn luyện (cộng điểm ĐRL trực tiếp).
- Trình danh sách học bổng hoàn chỉnh lên Cấp Trường.

### 4.4. Sinh viên
- Tra cứu bảng điểm học phần chi tiết của các học kỳ, điểm GPA và điểm ĐRL.
- Theo dõi kết quả xét học bổng, số tiền được nhận và trạng thái hồ sơ.
- Gửi đơn kiến nghị/khiếu nại trực tuyến khi có thắc mắc về điểm hoặc kết quả xét.
- Tải lên minh chứng tham gia hoạt động phong trào/tình nguyện (ảnh/PDF qua Cloudinary).

---

## 5. Hướng dẫn Cài đặt và Chạy Hệ thống

### 5.1. Yêu cầu môi trường
- Java Development Kit (JDK): Phiên bản 21 trở lên.
- Apache Maven: Phiên bản 3.8+.
- Node.js: Phiên bản 18+ và npm.
- MySQL Server: Phiên bản 8.0+.

### 5.2. Cấu hình Cơ sở Dữ liệu
1. Tạo cơ sở dữ liệu MySQL:
   ```sql
   CREATE DATABASE ousshdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
2. Kiểm tra cấu hình kết nối trong tệp `SpringStudentSuccessHubApp/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/ousshdb?useSSL=false&serverTimezone=Asia/Ho_Chi_Minh&allowPublicKeyRetrieval=true&characterEncoding=UTF-8
   spring.datasource.username=root
   spring.datasource.password=root
   ```

### 5.3. Khởi chạy Backend (Spring Boot)
Mở terminal tại thư mục backend:
```bash
cd SpringStudentSuccessHubApp
mvn spring-boot:run
```
- Server backend lắng nghe tại: `http://localhost:8080`
- Cổng Quản trị Thymeleaf: `http://localhost:8080/login`
- REST API Base URL: `http://localhost:8080/api`

### 5.4. Khởi chạy Frontend (React SPA)
Mở terminal tại thư mục frontend:
```bash
cd studentsuccesshubweb
npm install
npm start
```
- Ứng dụng React chạy tại: `http://localhost:8000`

---

## 6. Danh sách Tài khoản Kiểm thử Mẫu

### 6.1. Tài khoản Quản trị và Cán bộ
| Vai trò | Tên đăng nhập | Mật khẩu | Ghi chú |
| :--- | :--- | :--- | :--- |
| Quản trị viên (Admin) | `admin` | `admin123` | Toàn quyền quản trị danh mục & tài khoản |
| Cán bộ Trường (P.CTSV) | `captruong` | `truong123` | ThS. Phạm Minh Tuấn - Trưởng phòng CTSV |
| Cán bộ Khoa CNTT | `cbk_it` | `khoa123` | ThS. Lê Hoàng Nam - Cán bộ phụ trách HB Khoa |
| Cán bộ Khoa CNSH | `cbk_bio` | `khoa123` | ThS. Nguyễn Thị Thu Trang |
| Cán bộ Khoa Kế toán | `cbk_acc` | `khoa123` | ThS. Trần Văn Hưng |
| Cán bộ Khoa Kinh tế | `cbk_eco` | `khoa123` | ThS. Phạm Ngọc Mai |
| Cán bộ Khoa Luật | `cbk_law` | `khoa123` | ThS. Vũ Thị Bích Ngọc |
| Cán bộ Khoa Ngoại ngữ | `cbk_fl` | `khoa123` | ThS. Bùi Đình Trọng |
| Cán bộ Khoa QTKD | `cbk_ba` | `khoa123` | ThS. Phan Thanh Tùng |
| Cán bộ ĐT Đặc biệt (CLC) | `cbk_spe` | `khoa123` | ThS. Hoàng Diễm My |

### 6.2. Tài khoản Sinh viên Mẫu
Mật khẩu mặc định cho tài khoản sinh viên là Số CCCD (hoặc có thể dùng `sv123`):

| Khóa | MSSV | Họ và tên | Lớp sinh hoạt | Số CCCD (Mật khẩu) | Ghi chú |
| :--- | :--- | :--- | :--- | :--- | :--- |
| K23 | `2351010216` | Nguyễn Thị Tuyết Trinh | DH23CS01 | `092305006276` | HK2 GPA 3.65, ĐRL 82 - Có đơn khiếu nại |
| K23 | `2351010001` | Trần Bảo An | DH23CS01 | `079205001111` | HK2 GPA 3.82, ĐRL 95 - Học bổng Xuất sắc |
| K23 | `2351010011` | Lê Hoàng Phúc | DH23IT01 | `079305002222` | HK2 GPA 3.45, ĐRL 88 - Học bổng Giỏi |
| K23 | `2351010012` | Phạm Minh Khôi | DH23IT01 | `079205003333` | HK2 GPA 3.10, ĐRL 78 - Học bổng Khá |
| K23 | `2351020001` | Vũ Nam Hùng | DH23CS01C | `079205005555` | Hệ Chất lượng cao |
| K24 | `2451010001` | Hoàng Nhật Nam | DH24CS01 | `079206001111` | Khóa 2024 - 2028 |
| K24 | `2451010002` | Trương Minh Đăng | DH24IT01 | `079206002222` | Khóa 2024 - 2028 |
| K25 | `2551010001` | Trần Gia Hưng | DH25CS01 | `079207001111` | Khóa 2025 - 2029 |
| K25 | `2551010002` | Võ Thục Quyên | DH25IT01 | `079307002222` | Khóa 2025 - 2029 |

