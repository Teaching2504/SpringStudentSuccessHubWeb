-- ====================================================================
-- TRƯỜNG ĐẠI HỌC MỞ THÀNH PHỐ HỒ CHÍ MINH (OU)
-- HỆ THỐNG QUẢN LÝ HỌC TẬP - RÈN LUYỆN & XÉT HỌC BỔNG (OU-SSH HUB)
-- CƠ SỞ DỮ LIỆU: MÃ KHOA TIẾNG ANH - MÃ NGÀNH TRÍCH TỪ MÃ LỚP (CS, IT, AI,...)
-- SINH VIÊN KHÓA 2023 CÓ ĐỦ 9 HỌC KỲ TỪ HK1 (2023-2024) ĐẾN HK3 (2025-2026)
-- MẬT KHẨU MẶC ĐỊNH SINH VIÊN LÀ CĂN CƯỚC CÔNG DÂN (CCCD 12 SỐ)
-- ====================================================================

CREATE DATABASE IF NOT EXISTS `ousshdb` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `ousshdb`;

SET FOREIGN_KEY_CHECKS = 0;

-- --------------------------------------------------------------------
-- 1. Bảng nguoidung
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS `nguoidung`;
CREATE TABLE `nguoidung` (
    `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
    `tenDangNhap` VARCHAR(50) NOT NULL UNIQUE,
    `matKhau` VARCHAR(255) NOT NULL,
    `hoTen` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL UNIQUE,
    `soDienThoai` VARCHAR(20),
    `vaiTro` VARCHAR(50) NOT NULL, -- ROLE_ADMIN, ROLE_CAN_BO_TRUONG, ROLE_CAN_BO_KHOA, ROLE_SINH_VIEN
    `trangThai` VARCHAR(50) DEFAULT 'HOAT_DONG',
    `ngayTao` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 2. Bảng khoa (MÃ KHOA VIẾT TẮT TIẾNG ANH: IT, BIO, ACC, ECO, SOC, BAS, LAW, FL, BA, BF, CE, SPE)
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS `khoa`;
CREATE TABLE `khoa` (
    `maKhoa` VARCHAR(20) PRIMARY KEY,
    `tenKhoa` VARCHAR(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 3. Bảng nganh (MÃ NGÀNH TRÍCH TỪ MÃ LỚP: CS, IT, AI, SE, IM, BT, FT, AC, AU, EC, PM, SC, SW, SA, PS, DS, LA, BL, EL, JL, KL, CL, BA, MK, TO, HM, IB, LG, FB, TF, IS, CE, CM)
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS `nganh`;
CREATE TABLE `nganh` (
    `maNganh` VARCHAR(20) PRIMARY KEY,
    `tenNganh` VARCHAR(150) NOT NULL,
    `heDaoTao` VARCHAR(50) DEFAULT 'CHUAN',
    `maKhoa` VARCHAR(20) NOT NULL,
    CONSTRAINT `fk_nganh_khoa` FOREIGN KEY (`maKhoa`) REFERENCES `khoa` (`maKhoa`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 4. Bảng lopsinhhoat (DH + 23/24/25 + Mã Ngành + 01/02... hoặc C/CLC)
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS `lopsinhhoat`;
CREATE TABLE `lopsinhhoat` (
    `maLop` VARCHAR(20) PRIMARY KEY,
    `tenLop` VARCHAR(150) NOT NULL,
    `khoaHoc` VARCHAR(50) NOT NULL,
    `maKhoa` VARCHAR(20) NOT NULL,
    `maNganh` VARCHAR(20) NOT NULL,
    CONSTRAINT `fk_lop_khoa` FOREIGN KEY (`maKhoa`) REFERENCES `khoa` (`maKhoa`) ON DELETE CASCADE,
    CONSTRAINT `fk_lop_nganh` FOREIGN KEY (`maNganh`) REFERENCES `nganh` (`maNganh`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 5. Bảng hocky (9 Học kỳ từ HK1 2023-2024 đến HK3 2025-2026)
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS `hocky`;
CREATE TABLE `hocky` (
    `maHocKy` VARCHAR(30) PRIMARY KEY,
    `namHoc` VARCHAR(20) NOT NULL,
    `tenHocKy` VARCHAR(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 6. Bảng sinhvien (CCCD 12 số)
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS `sinhvien`;
CREATE TABLE `sinhvien` (
    `mssv` VARCHAR(20) PRIMARY KEY,
    `cccd` VARCHAR(12) NOT NULL UNIQUE,
    `nguoiDungId` BIGINT UNIQUE NOT NULL,
    `ngaySinh` DATE,
    `gioiTinh` VARCHAR(10),
    `diaChi` VARCHAR(255),
    `trangThaiHoc` VARCHAR(50) DEFAULT 'DANG_HOC',
    `maLop` VARCHAR(20) NOT NULL,
    CONSTRAINT `fk_sinhvien_user` FOREIGN KEY (`nguoiDungId`) REFERENCES `nguoidung` (`id`) ON DELETE CASCADE,
    CONSTRAINT `fk_sinhvien_lop` FOREIGN KEY (`maLop`) REFERENCES `lopsinhhoat` (`maLop`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 7. Bảng nhanvien
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS `nhanvien`;
CREATE TABLE `nhanvien` (
    `maNv` VARCHAR(20) PRIMARY KEY,
    `nguoiDungId` BIGINT UNIQUE NOT NULL,
    `chucVu` VARCHAR(100),
    `donViCongTac` VARCHAR(150),
    CONSTRAINT `fk_nhanvien_user` FOREIGN KEY (`nguoiDungId`) REFERENCES `nguoidung` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 8. Bảng canbokhoa
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS `canbokhoa`;
CREATE TABLE `canbokhoa` (
    `maNv` VARCHAR(20) PRIMARY KEY,
    `maKhoa` VARCHAR(20) NOT NULL,
    `lopPhuTrach` VARCHAR(255),
    `trangThaiCongTac` VARCHAR(50) DEFAULT 'DANG_CONG_TAC',
    CONSTRAINT `fk_canbokhoa_nhanvien` FOREIGN KEY (`maNv`) REFERENCES `nhanvien` (`maNv`) ON DELETE CASCADE,
    CONSTRAINT `fk_canbokhoa_khoa` FOREIGN KEY (`maKhoa`) REFERENCES `khoa` (`maKhoa`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 9. Bảng canbocaptruong
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS `canbocaptruong`;
CREATE TABLE `canbocaptruong` (
    `maNv` VARCHAR(20) PRIMARY KEY,
    `phongBan` VARCHAR(150),
    `capPheDuyet` VARCHAR(100) DEFAULT 'CAP_TRUONG',
    CONSTRAINT `fk_canbotruong_nhanvien` FOREIGN KEY (`maNv`) REFERENCES `nhanvien` (`maNv`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 10. Bảng ketquahoctap
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS `ketquahoctap`;
CREATE TABLE `ketquahoctap` (
    `id` VARCHAR(50) PRIMARY KEY,
    `mssv` VARCHAR(20) NOT NULL,
    `maHocKy` VARCHAR(30) NOT NULL,
    `diemTrungBinh` DECIMAL(4,2) NOT NULL,
    `soTinChi` INT NOT NULL,
    `coHocPhanRot` BOOLEAN DEFAULT FALSE,
    CONSTRAINT `fk_gpa_sinhvien` FOREIGN KEY (`mssv`) REFERENCES `sinhvien` (`mssv`) ON DELETE CASCADE,
    CONSTRAINT `fk_gpa_hocky` FOREIGN KEY (`maHocKy`) REFERENCES `hocky` (`maHocKy`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 11. Bảng ketquarenluyen
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS `ketquarenluyen`;
CREATE TABLE `ketquarenluyen` (
    `id` VARCHAR(50) PRIMARY KEY,
    `mssv` VARCHAR(20) NOT NULL,
    `maHocKy` VARCHAR(30) NOT NULL,
    `diemRenLuyen` DECIMAL(5,2) NOT NULL,
    `xepLoai` VARCHAR(50),
    CONSTRAINT `fk_drl_sinhvien` FOREIGN KEY (`mssv`) REFERENCES `sinhvien` (`mssv`) ON DELETE CASCADE,
    CONSTRAINT `fk_drl_hocky` FOREIGN KEY (`maHocKy`) REFERENCES `hocky` (`maHocKy`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 12. Bảng dotxethocbong
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS `dotxethocbong`;
CREATE TABLE `dotxethocbong` (
    `maDot` VARCHAR(30) PRIMARY KEY,
    `tenDot` VARCHAR(200) NOT NULL,
    `ngayBatDau` DATE,
    `ngayKetThuc` DATE,
    `maHocKy` VARCHAR(30) NOT NULL,
    `trangThai` VARCHAR(50) DEFAULT 'DANG_MO',
    CONSTRAINT `fk_dot_hocky` FOREIGN KEY (`maHocKy`) REFERENCES `hocky` (`maHocKy`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 13. Bảng quytachocbong
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS `quytachocbong`;
CREATE TABLE `quytachocbong` (
    `maQuyTac` VARCHAR(40) PRIMARY KEY,
    `maDot` VARCHAR(30) NOT NULL,
    `diemTbDuoiThieu` DECIMAL(4,2) DEFAULT 2.50,
    `diemRlToiThieu` DECIMAL(5,2) DEFAULT 65.00,
    `soTinChiToiThieu` INT DEFAULT 14,
    `khongNoMon` BOOLEAN DEFAULT TRUE,
    `phienBan` INT DEFAULT 1,
    `ghiChu` VARCHAR(255),
    `mucHocBongXuatSac` DECIMAL(15,2) DEFAULT 10000000.00,
    `mucHocBongGioi` DECIMAL(15,2) DEFAULT 7000000.00,
    `mucHocBongKha` DECIMAL(15,2) DEFAULT 5000000.00,
    CONSTRAINT `fk_quytac_dot` FOREIGN KEY (`maDot`) REFERENCES `dotxethocbong` (`maDot`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 14. Bảng dotxethbkhoa
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS `dotxethbkhoa`;
CREATE TABLE `dotxethbkhoa` (
    `maDotXetHbKhoa` VARCHAR(50) PRIMARY KEY,
    `maDot` VARCHAR(30) NOT NULL,
    `maKhoa` VARCHAR(20) NOT NULL,
    `chiTieu` INT DEFAULT 10,
    `nganSachKhoa` DECIMAL(15,2) DEFAULT 50000000.00,
    `hanPhanHoi` DATE,
    `trangThai` VARCHAR(50) DEFAULT 'CHUA_XET',
    `lyDoTraVe` TEXT,
    CONSTRAINT `fk_dotkhoa_dot` FOREIGN KEY (`maDot`) REFERENCES `dotxethocbong` (`maDot`) ON DELETE CASCADE,
    CONSTRAINT `fk_dotkhoa_khoa` FOREIGN KEY (`maKhoa`) REFERENCES `khoa` (`maKhoa`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 15. Bảng hosohocbong
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS `hosohocbong`;
CREATE TABLE `hosohocbong` (
    `maHoSo` VARCHAR(50) PRIMARY KEY,
    `mssv` VARCHAR(20) NOT NULL,
    `maDotXetHbKhoa` VARCHAR(50) NOT NULL,
    `diemXet` DECIMAL(4,2),
    `thuHang` INT,
    `loaiHocBong` VARCHAR(50),
    `mucHocBong` DECIMAL(15,2) DEFAULT 0.00,
    `trangThai` VARCHAR(50) DEFAULT 'DU_KIEN',
    CONSTRAINT `fk_hoso_sinhvien` FOREIGN KEY (`mssv`) REFERENCES `sinhvien` (`mssv`) ON DELETE CASCADE,
    CONSTRAINT `fk_hoso_dotkhoa` FOREIGN KEY (`maDotXetHbKhoa`) REFERENCES `dotxethbkhoa` (`maDotXetHbKhoa`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 16. Bảng minhchungrenluyen
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS `minhchungrenluyen`;
CREATE TABLE `minhchungrenluyen` (
    `maMinhChung` VARCHAR(50) PRIMARY KEY,
    `tenHoatDong` VARCHAR(200) NOT NULL,
    `diemDeXuat` DECIMAL(5,2),
    `fileUrl` VARCHAR(500),
    `moTa` TEXT,
    `trangThai` VARCHAR(50) DEFAULT 'CHO_DUYET',
    `maHoSo` VARCHAR(50),
    `mssv` VARCHAR(20) NOT NULL,
    `maHocKy` VARCHAR(30) NOT NULL,
    `maNvPheDuyet` VARCHAR(20),
    `lyDoPhanHoi` TEXT,
    `ngayTao` DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_minhchung_sinhvien` FOREIGN KEY (`mssv`) REFERENCES `sinhvien` (`mssv`) ON DELETE CASCADE,
    CONSTRAINT `fk_minhchung_hocky` FOREIGN KEY (`maHocKy`) REFERENCES `hocky` (`maHocKy`) ON DELETE CASCADE,
    CONSTRAINT `fk_minhchung_nv` FOREIGN KEY (`maNvPheDuyet`) REFERENCES `nhanvien` (`maNv`) ON DELETE SET NULL,
    CONSTRAINT `fk_minhchung_hoso` FOREIGN KEY (`maHoSo`) REFERENCES `hosohocbong` (`maHoSo`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 17. Bảng kiennghi
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS `kiennghi`;
CREATE TABLE `kiennghi` (
    `maKienNghi` VARCHAR(50) PRIMARY KEY,
    `noiDung` TEXT NOT NULL,
    `tepMinhChung` VARCHAR(500),
    `trangThai` VARCHAR(50) DEFAULT 'CHO_XU_LY',
    `maDotXetHbKhoa` VARCHAR(50) NOT NULL,
    `maHoSo` VARCHAR(50),
    `maNvXuLy` VARCHAR(20),
    `phanHoi` TEXT,
    `ngayGui` DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_kiennghi_dotkhoa` FOREIGN KEY (`maDotXetHbKhoa`) REFERENCES `dotxethbkhoa` (`maDotXetHbKhoa`) ON DELETE CASCADE,
    CONSTRAINT `fk_kiennghi_hoso` FOREIGN KEY (`maHoSo`) REFERENCES `hosohocbong` (`maHoSo`) ON DELETE SET NULL,
    CONSTRAINT `fk_kiennghi_nv` FOREIGN KEY (`maNvXuLy`) REFERENCES `nhanvien` (`maNv`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- ====================================================================
-- SEED DATA CHI TIẾT
-- ====================================================================

-- 1. Danh mục 12 Khoa (Mã viết tắt tiếng Anh)
INSERT INTO `khoa` (`maKhoa`, `tenKhoa`) VALUES
('IT', 'Khoa Công nghệ Thông tin (Information Technology)'),
('BIO', 'Khoa Công nghệ Sinh học (Biotechnology)'),
('ACC', 'Khoa Kế toán - Kiểm toán (Accounting & Auditing)'),
('ECO', 'Khoa Kinh tế và Quản lý Công (Economics & Public Management)'),
('SOC', 'Khoa Khoa học Xã hội (Social Sciences)'),
('BAS', 'Khoa Khoa học Cơ bản (Basic Sciences)'),
('LAW', 'Khoa Luật (Law)'),
('FL', 'Khoa Ngoại ngữ (Foreign Languages)'),
('BA', 'Khoa Quản trị Kinh doanh (Business Administration)'),
('BF', 'Khoa Tài chính - Ngân hàng (Banking & Finance)'),
('CE', 'Khoa Xây dựng (Civil Engineering)'),
('SPE', 'Khoa Đào tạo Đặc biệt (Special Training / CLC)');

-- 2. Danh mục Ngành đào tạo (Mã ngành chính xác từ từ viết tắt trong Mã lớp)
INSERT INTO `nganh` (`maNganh`, `tenNganh`, `heDaoTao`, `maKhoa`) VALUES
-- Khoa IT (Công nghệ Thông tin)
('AI', 'Trí tuệ Nhân tạo', 'CHUAN', 'IT'),
('CS', 'Khoa học Máy tính', 'CHUAN', 'IT'),
('IT', 'Công nghệ Thông tin', 'CHUAN', 'IT'),
('IM', 'Hệ thống Thông tin Quản lý', 'CHUAN', 'IT'),
('SE', 'Kỹ thuật Phần mềm', 'CHUAN', 'IT'),

-- Khoa BIO (Công nghệ Sinh học)
('BT', 'Công nghệ Sinh học', 'CHUAN', 'BIO'),
('FT', 'Công nghệ Thực phẩm', 'CHUAN', 'BIO'),

-- Khoa ACC (Kế toán - Kiểm toán)
('AC', 'Kế toán', 'CHUAN', 'ACC'),
('AU', 'Kiểm toán', 'CHUAN', 'ACC'),

-- Khoa ECO (Kinh tế & Quản lý Công)
('EC', 'Kinh tế', 'CHUAN', 'ECO'),
('PM', 'Quản lý Công', 'CHUAN', 'ECO'),

-- Khoa SOC (Khoa học Xã hội)
('SC', 'Xã hội học', 'CHUAN', 'SOC'),
('SW', 'Công tác Xã hội', 'CHUAN', 'SOC'),
('SA', 'Đông Nam Á học', 'CHUAN', 'SOC'),
('PS', 'Tâm lý học', 'CHUAN', 'SOC'),

-- Khoa BAS (Khoa học Cơ bản)
('DS', 'Khoa học Dữ liệu', 'CHUAN', 'BAS'),

-- Khoa LAW (Luật)
('LA', 'Luật', 'CHUAN', 'LAW'),
('BL', 'Luật Kinh tế', 'CHUAN', 'LAW'),

-- Khoa FL (Ngoại ngữ)
('EL', 'Ngôn ngữ Anh', 'CHUAN', 'FL'),
('JL', 'Ngôn ngữ Nhật', 'CHUAN', 'FL'),
('KL', 'Ngôn ngữ Hàn Quốc', 'CHUAN', 'FL'),
('CL', 'Ngôn ngữ Trung Quốc', 'CHUAN', 'FL'),

-- Khoa BA (Quản trị Kinh doanh)
('BA', 'Quản trị Kinh doanh', 'CHUAN', 'BA'),
('MK', 'Marketing', 'CHUAN', 'BA'),
('TO', 'Du lịch', 'CHUAN', 'BA'),
('HM', 'Quản trị Khách sạn', 'CHUAN', 'BA'),
('IB', 'Kinh doanh Quốc tế', 'CHUAN', 'BA'),
('LG', 'Logistics và Quản lý Chuỗi Cung ứng', 'CHUAN', 'BA'),

-- Khoa BF (Tài chính - Ngân hàng)
('FB', 'Tài chính - Ngân hàng', 'CHUAN', 'BF'),
('TF', 'Công nghệ Tài chính', 'CHUAN', 'BF'),
('IS', 'Bảo hiểm', 'CHUAN', 'BF'),

-- Khoa CE (Xây dựng)
('CE', 'Công nghệ Kỹ thuật Công trình Xây dựng', 'CHUAN', 'CE'),
('CM', 'Quản lý Xây dựng', 'CHUAN', 'CE'),

-- Khoa SPE (Đào tạo Đặc biệt / CLC - Mã ngành hậu tố C)
('BAC', 'Quản trị Kinh doanh (Chương trình Tiên tiến)', 'CHAT_LUONG_CAO', 'SPE'),
('FBC', 'Tài chính - Ngân hàng (Chương trình Tiên tiến)', 'CHAT_LUONG_CAO', 'SPE'),
('ACC', 'Kế toán (Chương trình Tiên tiến)', 'CHAT_LUONG_CAO', 'SPE'),
('AUC', 'Kiểm toán (Chương trình Tiên tiến)', 'CHAT_LUONG_CAO', 'SPE'),
('LAC', 'Luật Kinh tế (Chương trình Tiên tiến)', 'CHAT_LUONG_CAO', 'SPE'),
('BTC', 'Công nghệ Sinh học (Chương trình Tiên tiến)', 'CHAT_LUONG_CAO', 'SPE'),
('CSC', 'Khoa học Máy tính (Chương trình Tiên tiến)', 'CHAT_LUONG_CAO', 'SPE'),
('ITC', 'Công nghệ Thông tin (Chương trình Tiên tiến)', 'CHAT_LUONG_CAO', 'SPE'),
('CEC', 'CNKT Công trình Xây dựng (Chương trình Tiên tiến)', 'CHAT_LUONG_CAO', 'SPE'),
('ELC', 'Ngôn ngữ Anh (Chương trình Tiên tiến)', 'CHAT_LUONG_CAO', 'SPE'),
('CLC', 'Ngôn ngữ Trung Quốc (Chương trình Tiên tiến)', 'CHAT_LUONG_CAO', 'SPE'),
('JKC', 'Ngôn ngữ Nhật (Chương trình Tiên tiến)', 'CHAT_LUONG_CAO', 'SPE'),
('ECC', 'Kinh tế (Chương trình Tiên tiến)', 'CHAT_LUONG_CAO', 'SPE');

-- 3. Danh mục Lớp sinh hoạt (Theo đúng chuẩn DH + Khóa + Mã Ngành + STT)
INSERT INTO `lopsinhhoat` (`maLop`, `tenLop`, `khoaHoc`, `maKhoa`, `maNganh`) VALUES
-- Khoa IT
('DH24AI01', 'ĐH Trí tuệ Nhân tạo 2024 - Lớp 01', 'K24 (2024-2028)', 'IT', 'AI'),
('DH25AI01', 'ĐH Trí tuệ Nhân tạo 2025 - Lớp 01', 'K25 (2025-2029)', 'IT', 'AI'),
('DH23CS01', 'ĐH Khoa học Máy tính 2023 - Lớp 01', 'K23 (2023-2027)', 'IT', 'CS'),
('DH23CS02', 'ĐH Khoa học Máy tính 2023 - Lớp 02', 'K23 (2023-2027)', 'IT', 'CS'),
('DH24CS01', 'ĐH Khoa học Máy tính 2024 - Lớp 01', 'K24 (2024-2028)', 'IT', 'CS'),
('DH25CS01', 'ĐH Khoa học Máy tính 2025 - Lớp 01', 'K25 (2025-2029)', 'IT', 'CS'),
('DH25CS02', 'ĐH Khoa học Máy tính 2025 - Lớp 02', 'K25 (2025-2029)', 'IT', 'CS'),
('DH23IT01', 'ĐH Công nghệ Thông tin 2023 - Lớp 01', 'K23 (2023-2027)', 'IT', 'IT'),
('DH23IT02', 'ĐH Công nghệ Thông tin 2023 - Lớp 02', 'K23 (2023-2027)', 'IT', 'IT'),
('DH23IT03', 'ĐH Công nghệ Thông tin 2023 - Lớp 03', 'K23 (2023-2027)', 'IT', 'IT'),
('DH24IT01', 'ĐH Công nghệ Thông tin 2024 - Lớp 01', 'K24 (2024-2028)', 'IT', 'IT'),
('DH24IT02', 'ĐH Công nghệ Thông tin 2024 - Lớp 02', 'K24 (2024-2028)', 'IT', 'IT'),
('DH24IT03', 'ĐH Công nghệ Thông tin 2024 - Lớp 03', 'K24 (2024-2028)', 'IT', 'IT'),
('DH24IT04', 'ĐH Công nghệ Thông tin 2024 - Lớp 04', 'K24 (2024-2028)', 'IT', 'IT'),
('DH25IT01', 'ĐH Công nghệ Thông tin 2025 - Lớp 01', 'K25 (2025-2029)', 'IT', 'IT'),
('DH25IT02', 'ĐH Công nghệ Thông tin 2025 - Lớp 02', 'K25 (2025-2029)', 'IT', 'IT'),
('DH25IT03', 'ĐH Công nghệ Thông tin 2025 - Lớp 03', 'K25 (2025-2029)', 'IT', 'IT'),
('DH23IM01', 'ĐH Hệ thống TT Quản lý 2023 - Lớp 01', 'K23 (2023-2027)', 'IT', 'IM'),
('DH23IM02', 'ĐH Hệ thống TT Quản lý 2023 - Lớp 02', 'K23 (2023-2027)', 'IT', 'IM'),
('DH24IM01', 'ĐH Hệ thống TT Quản lý 2024 - Lớp 01', 'K24 (2024-2028)', 'IT', 'IM'),
('DH24IM02', 'ĐH Hệ thống TT Quản lý 2024 - Lớp 02', 'K24 (2024-2028)', 'IT', 'IM'),
('DH25IM01', 'ĐH Hệ thống TT Quản lý 2025 - Lớp 01', 'K25 (2025-2029)', 'IT', 'IM'),
('DH25IM02', 'ĐH Hệ thống TT Quản lý 2025 - Lớp 02', 'K25 (2025-2029)', 'IT', 'IM'),
('DH25SE01', 'ĐH Kỹ thuật Phần mềm 2025 - Lớp 01', 'K25 (2025-2029)', 'IT', 'SE'),

-- Khoa BIO
('DH23BT01', 'ĐH Công nghệ Sinh học 2023 - Lớp 01', 'K23 (2023-2027)', 'BIO', 'BT'),
('DH23BT02', 'ĐH Công nghệ Sinh học 2023 - Lớp 02', 'K23 (2023-2027)', 'BIO', 'BT'),
('DH24BT01', 'ĐH Công nghệ Sinh học 2024 - Lớp 01', 'K24 (2024-2028)', 'BIO', 'BT'),
('DH24BT02', 'ĐH Công nghệ Sinh học 2024 - Lớp 02', 'K24 (2024-2028)', 'BIO', 'BT'),
('DH25BT01', 'ĐH Công nghệ Sinh học 2025 - Lớp 01', 'K25 (2025-2029)', 'BIO', 'BT'),
('DH23FT01', 'ĐH Công nghệ Thực phẩm 2023 - Lớp 01', 'K23 (2023-2027)', 'BIO', 'FT'),
('DH23FT02', 'ĐH Công nghệ Thực phẩm 2023 - Lớp 02', 'K23 (2023-2027)', 'BIO', 'FT'),
('DH24FT01', 'ĐH Công nghệ Thực phẩm 2024 - Lớp 01', 'K24 (2024-2028)', 'BIO', 'FT'),
('DH24FT02', 'ĐH Công nghệ Thực phẩm 2024 - Lớp 02', 'K24 (2024-2028)', 'BIO', 'FT'),
('DH25FT01', 'ĐH Công nghệ Thực phẩm 2025 - Lớp 01', 'K25 (2025-2029)', 'BIO', 'FT'),

-- Khoa ACC
('DH23AC01', 'ĐH Kế toán 2023 - Lớp 01', 'K23 (2023-2027)', 'ACC', 'AC'),
('DH23AC02', 'ĐH Kế toán 2023 - Lớp 02', 'K23 (2023-2027)', 'ACC', 'AC'),
('DH24AC01', 'ĐH Kế toán 2024 - Lớp 01', 'K24 (2024-2028)', 'ACC', 'AC'),
('DH24AC02', 'ĐH Kế toán 2024 - Lớp 02', 'K24 (2024-2028)', 'ACC', 'AC'),
('DH24AC03', 'ĐH Kế toán 2024 - Lớp 03', 'K24 (2024-2028)', 'ACC', 'AC'),
('DH25AC01', 'ĐH Kế toán 2025 - Lớp 01', 'K25 (2025-2029)', 'ACC', 'AC'),
('DH25AC02', 'ĐH Kế toán 2025 - Lớp 02', 'K25 (2025-2029)', 'ACC', 'AC'),
('DH25AC03', 'ĐH Kế toán 2025 - Lớp 03', 'K25 (2025-2029)', 'ACC', 'AC'),
('DH25AC04', 'ĐH Kế toán 2025 - Lớp 04', 'K25 (2025-2029)', 'ACC', 'AC'),
('DH25AC05', 'ĐH Kế toán 2025 - Lớp 05', 'K25 (2025-2029)', 'ACC', 'AC'),
('DH23AU01', 'ĐH Kiểm toán 2023 - Lớp 01', 'K23 (2023-2027)', 'ACC', 'AU'),
('DH24AU01', 'ĐH Kiểm toán 2024 - Lớp 01', 'K24 (2024-2028)', 'ACC', 'AU'),
('DH24AU02', 'ĐH Kiểm toán 2024 - Lớp 02', 'K24 (2024-2028)', 'ACC', 'AU'),
('DH25AU01', 'ĐH Kiểm toán 2025 - Lớp 01', 'K25 (2025-2029)', 'ACC', 'AU'),
('DH25AU02', 'ĐH Kiểm toán 2025 - Lớp 02', 'K25 (2025-2029)', 'ACC', 'AU'),

-- Khoa ECO
('DH23EC01', 'ĐH Kinh tế 2023 - Lớp 01', 'K23 (2023-2027)', 'ECO', 'EC'),
('DH23EC02', 'ĐH Kinh tế 2023 - Lớp 02', 'K23 (2023-2027)', 'ECO', 'EC'),
('DH23EC03', 'ĐH Kinh tế 2023 - Lớp 03', 'K23 (2023-2027)', 'ECO', 'EC'),
('DH24EC01', 'ĐH Kinh tế 2024 - Lớp 01', 'K24 (2024-2028)', 'ECO', 'EC'),
('DH24EC02', 'ĐH Kinh tế 2024 - Lớp 02', 'K24 (2024-2028)', 'ECO', 'EC'),
('DH25EC01', 'ĐH Kinh tế 2025 - Lớp 01', 'K25 (2025-2029)', 'ECO', 'EC'),
('DH25EC02', 'ĐH Kinh tế 2025 - Lớp 02', 'K25 (2025-2029)', 'ECO', 'EC'),
('DH23PM01', 'ĐH Quản lý Công 2023 - Lớp 01', 'K23 (2023-2027)', 'ECO', 'PM'),
('DH24PM01', 'ĐH Quản lý Công 2024 - Lớp 01', 'K24 (2024-2028)', 'ECO', 'PM'),
('DH25PM01', 'ĐH Quản lý Công 2025 - Lớp 01', 'K25 (2025-2029)', 'ECO', 'PM'),

-- Khoa SOC
('DH23SC01', 'ĐH Xã hội học 2023 - Lớp 01', 'K23 (2023-2027)', 'SOC', 'SC'),
('DH23SC02', 'ĐH Xã hội học 2023 - Lớp 02', 'K23 (2023-2027)', 'SOC', 'SC'),
('DH24SC01', 'ĐH Xã hội học 2024 - Lớp 01', 'K24 (2024-2028)', 'SOC', 'SC'),
('DH24SC02', 'ĐH Xã hội học 2024 - Lớp 02', 'K24 (2024-2028)', 'SOC', 'SC'),
('DH25SC01', 'ĐH Xã hội học 2025 - Lớp 01', 'K25 (2025-2029)', 'SOC', 'SC'),
('DH25SC02', 'ĐH Xã hội học 2025 - Lớp 02', 'K25 (2025-2029)', 'SOC', 'SC'),
('DH23SW01', 'ĐH Công tác Xã hội 2023 - Lớp 01', 'K23 (2023-2027)', 'SOC', 'SW'),
('DH23SW02', 'ĐH Công tác Xã hội 2023 - Lớp 02', 'K23 (2023-2027)', 'SOC', 'SW'),
('DH24SW01', 'ĐH Công tác Xã hội 2024 - Lớp 01', 'K24 (2024-2028)', 'SOC', 'SW'),
('DH25SW01', 'ĐH Công tác Xã hội 2025 - Lớp 01', 'K25 (2025-2029)', 'SOC', 'SW'),
('DH23SA01', 'ĐH Đông Nam Á học 2023 - Lớp 01', 'K23 (2023-2027)', 'SOC', 'SA'),
('DH23SA02', 'ĐH Đông Nam Á học 2023 - Lớp 02', 'K23 (2023-2027)', 'SOC', 'SA'),
('DH24SA01', 'ĐH Đông Nam Á học 2024 - Lớp 01', 'K24 (2024-2028)', 'SOC', 'SA'),
('DH24SA02', 'ĐH Đông Nam Á học 2024 - Lớp 02', 'K24 (2024-2028)', 'SOC', 'SA'),
('DH25SA01', 'ĐH Đông Nam Á học 2025 - Lớp 01', 'K25 (2025-2029)', 'SOC', 'SA'),
('DH25SA02', 'ĐH Đông Nam Á học 2025 - Lớp 02', 'K25 (2025-2029)', 'SOC', 'SA'),
('DH23PS01', 'ĐH Tâm lý học 2023 - Lớp 01', 'K23 (2023-2027)', 'SOC', 'PS'),
('DH24PS01', 'ĐH Tâm lý học 2024 - Lớp 01', 'K24 (2024-2028)', 'SOC', 'PS'),
('DH24PS02', 'ĐH Tâm lý học 2024 - Lớp 02', 'K24 (2024-2028)', 'SOC', 'PS'),
('DH25PS01', 'ĐH Tâm lý học 2025 - Lớp 01', 'K25 (2025-2029)', 'SOC', 'PS'),
('DH25PS02', 'ĐH Tâm lý học 2025 - Lớp 02', 'K25 (2025-2029)', 'SOC', 'PS'),

-- Khoa BAS
('DH23DS01', 'ĐH Khoa học Dữ liệu 2023 - Lớp 01', 'K23 (2023-2027)', 'BAS', 'DS'),
('DH24DS01', 'ĐH Khoa học Dữ liệu 2024 - Lớp 01', 'K24 (2024-2028)', 'BAS', 'DS'),
('DH25DS01', 'ĐH Khoa học Dữ liệu 2025 - Lớp 01', 'K25 (2025-2029)', 'BAS', 'DS'),

-- Khoa LAW
('DH23LA01', 'ĐH Luật 2023 - Lớp 01', 'K23 (2023-2027)', 'LAW', 'LA'),
('DH23LA02', 'ĐH Luật 2023 - Lớp 02', 'K23 (2023-2027)', 'LAW', 'LA'),
('DH24LA01', 'ĐH Luật 2024 - Lớp 01', 'K24 (2024-2028)', 'LAW', 'LA'),
('DH24LA02', 'ĐH Luật 2024 - Lớp 02', 'K24 (2024-2028)', 'LAW', 'LA'),
('DH25LA01', 'ĐH Luật 2025 - Lớp 01', 'K25 (2025-2029)', 'LAW', 'LA'),
('DH25LA02', 'ĐH Luật 2025 - Lớp 02', 'K25 (2025-2029)', 'LAW', 'LA'),
('DH23BL01', 'ĐH Luật Kinh tế 2023 - Lớp 01', 'K23 (2023-2027)', 'LAW', 'BL'),
('DH23BL02', 'ĐH Luật Kinh tế 2023 - Lớp 02', 'K23 (2023-2027)', 'LAW', 'BL'),
('DH23BL03', 'ĐH Luật Kinh tế 2023 - Lớp 03', 'K23 (2023-2027)', 'LAW', 'BL'),
('DH24BL01', 'ĐH Luật Kinh tế 2024 - Lớp 01', 'K24 (2024-2028)', 'LAW', 'BL'),
('DH24BL02', 'ĐH Luật Kinh tế 2024 - Lớp 02', 'K24 (2024-2028)', 'LAW', 'BL'),
('DH25BL01', 'ĐH Luật Kinh tế 2025 - Lớp 01', 'K25 (2025-2029)', 'LAW', 'BL'),
('DH25BL02', 'ĐH Luật Kinh tế 2025 - Lớp 02', 'K25 (2025-2029)', 'LAW', 'BL'),

-- Khoa FL
('DH23EL01', 'ĐH Ngôn ngữ Anh 2023 - Lớp 01', 'K23 (2023-2027)', 'FL', 'EL'),
('DH23EL02', 'ĐH Ngôn ngữ Anh 2023 - Lớp 02', 'K23 (2023-2027)', 'FL', 'EL'),
('DH23EL03', 'ĐH Ngôn ngữ Anh 2023 - Lớp 03', 'K23 (2023-2027)', 'FL', 'EL'),
('DH23EL04', 'ĐH Ngôn ngữ Anh 2023 - Lớp 04', 'K23 (2023-2027)', 'FL', 'EL'),
('DH23EL05', 'ĐH Ngôn ngữ Anh 2023 - Lớp 05', 'K23 (2023-2027)', 'FL', 'EL'),
('DH24EL01', 'ĐH Ngôn ngữ Anh 2024 - Lớp 01', 'K24 (2024-2028)', 'FL', 'EL'),
('DH24EL02', 'ĐH Ngôn ngữ Anh 2024 - Lớp 02', 'K24 (2024-2028)', 'FL', 'EL'),
('DH24EL03', 'ĐH Ngôn ngữ Anh 2024 - Lớp 03', 'K24 (2024-2028)', 'FL', 'EL'),
('DH24EL04', 'ĐH Ngôn ngữ Anh 2024 - Lớp 04', 'K24 (2024-2028)', 'FL', 'EL'),
('DH24EL05', 'ĐH Ngôn ngữ Anh 2024 - Lớp 05', 'K24 (2024-2028)', 'FL', 'EL'),
('DH25EL01', 'ĐH Ngôn ngữ Anh 2025 - Lớp 01', 'K25 (2025-2029)', 'FL', 'EL'),
('DH25EL02', 'ĐH Ngôn ngữ Anh 2025 - Lớp 02', 'K25 (2025-2029)', 'FL', 'EL'),
('DH25EL03', 'ĐH Ngôn ngữ Anh 2025 - Lớp 03', 'K25 (2025-2029)', 'FL', 'EL'),
('DH25EL04', 'ĐH Ngôn ngữ Anh 2025 - Lớp 04', 'K25 (2025-2029)', 'FL', 'EL'),
('DH25EL05', 'ĐH Ngôn ngữ Anh 2025 - Lớp 05', 'K25 (2025-2029)', 'FL', 'EL'),
('DH23JL01', 'ĐH Ngôn ngữ Nhật 2023 - Lớp 01', 'K23 (2023-2027)', 'FL', 'JL'),
('DH23JL02', 'ĐH Ngôn ngữ Nhật 2023 - Lớp 02', 'K23 (2023-2027)', 'FL', 'JL'),
('DH23JL03', 'ĐH Ngôn ngữ Nhật 2023 - Lớp 03', 'K23 (2023-2027)', 'FL', 'JL'),
('DH24JL01', 'ĐH Ngôn ngữ Nhật 2024 - Lớp 01', 'K24 (2024-2028)', 'FL', 'JL'),
('DH24JL02', 'ĐH Ngôn ngữ Nhật 2024 - Lớp 02', 'K24 (2024-2028)', 'FL', 'JL'),
('DH24JL03', 'ĐH Ngôn ngữ Nhật 2024 - Lớp 03', 'K24 (2024-2028)', 'FL', 'JL'),
('DH25JL01', 'ĐH Ngôn ngữ Nhật 2025 - Lớp 01', 'K25 (2025-2029)', 'FL', 'JL'),
('DH25JL02', 'ĐH Ngôn ngữ Nhật 2025 - Lớp 02', 'K25 (2025-2029)', 'FL', 'JL'),
('DH25JL03', 'ĐH Ngôn ngữ Nhật 2025 - Lớp 03', 'K25 (2025-2029)', 'FL', 'JL'),
('DH23KL01', 'ĐH Ngôn ngữ Hàn Quốc 2023 - Lớp 01', 'K23 (2023-2027)', 'FL', 'KL'),
('DH23KL02', 'ĐH Ngôn ngữ Hàn Quốc 2023 - Lớp 02', 'K23 (2023-2027)', 'FL', 'KL'),
('DH24KL01', 'ĐH Ngôn ngữ Hàn Quốc 2024 - Lớp 01', 'K24 (2024-2028)', 'FL', 'KL'),
('DH24KL02', 'ĐH Ngôn ngữ Hàn Quốc 2024 - Lớp 02', 'K24 (2024-2028)', 'FL', 'KL'),
('DH24KL03', 'ĐH Ngôn ngữ Hàn Quốc 2024 - Lớp 03', 'K24 (2024-2028)', 'FL', 'KL'),
('DH25KL01', 'ĐH Ngôn ngữ Hàn Quốc 2025 - Lớp 01', 'K25 (2025-2029)', 'FL', 'KL'),
('DH25KL02', 'ĐH Ngôn ngữ Hàn Quốc 2025 - Lớp 02', 'K25 (2025-2029)', 'FL', 'KL'),
('DH23CL01', 'ĐH Ngôn ngữ Trung Quốc 2023 - Lớp 01', 'K23 (2023-2027)', 'FL', 'CL'),
('DH23CL02', 'ĐH Ngôn ngữ Trung Quốc 2023 - Lớp 02', 'K23 (2023-2027)', 'FL', 'CL'),
('DH24CL01', 'ĐH Ngôn ngữ Trung Quốc 2024 - Lớp 01', 'K24 (2024-2028)', 'FL', 'CL'),
('DH24CL02', 'ĐH Ngôn ngữ Trung Quốc 2024 - Lớp 02', 'K24 (2024-2028)', 'FL', 'CL'),
('DH24CL03', 'ĐH Ngôn ngữ Trung Quốc 2024 - Lớp 03', 'K24 (2024-2028)', 'FL', 'CL'),
('DH25CL01', 'ĐH Ngôn ngữ Trung Quốc 2025 - Lớp 01', 'K25 (2025-2029)', 'FL', 'CL'),
('DH25CL02', 'ĐH Ngôn ngữ Trung Quốc 2025 - Lớp 02', 'K25 (2025-2029)', 'FL', 'CL'),

-- Khoa BA
('DH23BA01', 'ĐH Quản trị Kinh doanh 2023 - Lớp 01', 'K23 (2023-2027)', 'BA', 'BA'),
('DH23BA02', 'ĐH Quản trị Kinh doanh 2023 - Lớp 02', 'K23 (2023-2027)', 'BA', 'BA'),
('DH23BA03', 'ĐH Quản trị Kinh doanh 2023 - Lớp 03', 'K23 (2023-2027)', 'BA', 'BA'),
('DH24BA01', 'ĐH Quản trị Kinh doanh 2024 - Lớp 01', 'K24 (2024-2028)', 'BA', 'BA'),
('DH24BA02', 'ĐH Quản trị Kinh doanh 2024 - Lớp 02', 'K24 (2024-2028)', 'BA', 'BA'),
('DH24BA03', 'ĐH Quản trị Kinh doanh 2024 - Lớp 03', 'K24 (2024-2028)', 'BA', 'BA'),
('DH24BA04', 'ĐH Quản trị Kinh doanh 2024 - Lớp 04', 'K24 (2024-2028)', 'BA', 'BA'),
('DH25BA01', 'ĐH Quản trị Kinh doanh 2025 - Lớp 01', 'K25 (2025-2029)', 'BA', 'BA'),
('DH25BA02', 'ĐH Quản trị Kinh doanh 2025 - Lớp 02', 'K25 (2025-2029)', 'BA', 'BA'),
('DH25BA03', 'ĐH Quản trị Kinh doanh 2025 - Lớp 03', 'K25 (2025-2029)', 'BA', 'BA'),
('DH25BA04', 'ĐH Quản trị Kinh doanh 2025 - Lớp 04', 'K25 (2025-2029)', 'BA', 'BA'),
('DH23MK01', 'ĐH Marketing 2023 - Lớp 01', 'K23 (2023-2027)', 'BA', 'MK'),
('DH23MK02', 'ĐH Marketing 2023 - Lớp 02', 'K23 (2023-2027)', 'BA', 'MK'),
('DH24MK01', 'ĐH Marketing 2024 - Lớp 01', 'K24 (2024-2028)', 'BA', 'MK'),
('DH24MK02', 'ĐH Marketing 2024 - Lớp 02', 'K24 (2024-2028)', 'BA', 'MK'),
('DH25MK01', 'ĐH Marketing 2025 - Lớp 01', 'K25 (2025-2029)', 'BA', 'MK'),
('DH23TO01', 'ĐH Du lịch 2023 - Lớp 01', 'K23 (2023-2027)', 'BA', 'TO'),
('DH24TO01', 'ĐH Du lịch 2024 - Lớp 01', 'K24 (2024-2028)', 'BA', 'TO'),
('DH25TO01', 'ĐH Du lịch 2025 - Lớp 01', 'K25 (2025-2029)', 'BA', 'TO'),
('DH25TO02', 'ĐH Du lịch 2025 - Lớp 02', 'K25 (2025-2029)', 'BA', 'TO'),
('DH23HM01', 'ĐH Quản trị Khách sạn 2023 - Lớp 01', 'K23 (2023-2027)', 'BA', 'HM'),
('DH23HM02', 'ĐH Quản trị Khách sạn 2023 - Lớp 02', 'K23 (2023-2027)', 'BA', 'HM'),
('DH24HM01', 'ĐH Quản trị Khách sạn 2024 - Lớp 01', 'K24 (2024-2028)', 'BA', 'HM'),
('DH24HM02', 'ĐH Quản trị Khách sạn 2024 - Lớp 02', 'K24 (2024-2028)', 'BA', 'HM'),
('DH25HM01', 'ĐH Quản trị Khách sạn 2025 - Lớp 01', 'K25 (2025-2029)', 'BA', 'HM'),
('DH25HM02', 'ĐH Quản trị Khách sạn 2025 - Lớp 02', 'K25 (2025-2029)', 'BA', 'HM'),
('DH23IB01', 'ĐH Kinh doanh Quốc tế 2023 - Lớp 01', 'K23 (2023-2027)', 'BA', 'IB'),
('DH23IB02', 'ĐH Kinh doanh Quốc tế 2023 - Lớp 02', 'K23 (2023-2027)', 'BA', 'IB'),
('DH24IB01', 'ĐH Kinh doanh Quốc tế 2024 - Lớp 01', 'K24 (2024-2028)', 'BA', 'IB'),
('DH24IB02', 'ĐH Kinh doanh Quốc tế 2024 - Lớp 02', 'K24 (2024-2028)', 'BA', 'IB'),
('DH25IB01', 'ĐH Kinh doanh Quốc tế 2025 - Lớp 01', 'K25 (2025-2029)', 'BA', 'IB'),
('DH25IB02', 'ĐH Kinh doanh Quốc tế 2025 - Lớp 02', 'K25 (2025-2029)', 'BA', 'IB'),
('DH23LG01', 'ĐH Logistics & Chuỗi cung ứng 2023 - Lớp 01', 'K23 (2023-2027)', 'BA', 'LG'),
('DH23LG02', 'ĐH Logistics & Chuỗi cung ứng 2023 - Lớp 02', 'K23 (2023-2027)', 'BA', 'LG'),
('DH24LG01', 'ĐH Logistics & Chuỗi cung ứng 2024 - Lớp 01', 'K24 (2024-2028)', 'BA', 'LG'),
('DH24LG02', 'ĐH Logistics & Chuỗi cung ứng 2024 - Lớp 02', 'K24 (2024-2028)', 'BA', 'LG'),
('DH25LG01', 'ĐH Logistics & Chuỗi cung ứng 2025 - Lớp 01', 'K25 (2025-2029)', 'BA', 'LG'),
('DH25LG02', 'ĐH Logistics & Chuỗi cung ứng 2025 - Lớp 02', 'K25 (2025-2029)', 'BA', 'LG'),

-- Khoa BF
('DH23FB01', 'ĐH Tài chính - Ngân hàng 2023 - Lớp 01', 'K23 (2023-2027)', 'BF', 'FB'),
('DH23FB02', 'ĐH Tài chính - Ngân hàng 2023 - Lớp 02', 'K23 (2023-2027)', 'BF', 'FB'),
('DH23FB03', 'ĐH Tài chính - Ngân hàng 2023 - Lớp 03', 'K23 (2023-2027)', 'BF', 'FB'),
('DH24FB01', 'ĐH Tài chính - Ngân hàng 2024 - Lớp 01', 'K24 (2024-2028)', 'BF', 'FB'),
('DH24FB02', 'ĐH Tài chính - Ngân hàng 2024 - Lớp 02', 'K24 (2024-2028)', 'BF', 'FB'),
('DH24FB03', 'ĐH Tài chính - Ngân hàng 2024 - Lớp 03', 'K24 (2024-2028)', 'BF', 'FB'),
('DH25FB01', 'ĐH Tài chính - Ngân hàng 2025 - Lớp 01', 'K25 (2025-2029)', 'BF', 'FB'),
('DH25FB02', 'ĐH Tài chính - Ngân hàng 2025 - Lớp 02', 'K25 (2025-2029)', 'BF', 'FB'),
('DH25FB03', 'ĐH Tài chính - Ngân hàng 2025 - Lớp 03', 'K25 (2025-2029)', 'BF', 'FB'),
('DH24TF01', 'ĐH Công nghệ Tài chính 2024 - Lớp 01', 'K24 (2024-2028)', 'BF', 'TF'),
('DH25TF01', 'ĐH Công nghệ Tài chính 2025 - Lớp 01', 'K25 (2025-2029)', 'BF', 'TF'),
('DH24IS01', 'ĐH Bảo hiểm 2024 - Lớp 01', 'K24 (2024-2028)', 'BF', 'IS'),
('DH25IS01', 'ĐH Bảo hiểm 2025 - Lớp 01', 'K25 (2025-2029)', 'BF', 'IS'),

-- Khoa CE
('DH23CE01', 'ĐH CNKT Công trình Xây dựng 2023 - Lớp 01', 'K23 (2023-2027)', 'CE', 'CE'),
('DH23CE02', 'ĐH CNKT Công trình Xây dựng 2023 - Lớp 02', 'K23 (2023-2027)', 'CE', 'CE'),
('DH24CE01', 'ĐH CNKT Công trình Xây dựng 2024 - Lớp 01', 'K24 (2024-2028)', 'CE', 'CE'),
('DH25CE01', 'ĐH CNKT Công trình Xây dựng 2025 - Lớp 01', 'K25 (2025-2029)', 'CE', 'CE'),
('DH23CM01', 'ĐH Quản lý Xây dựng 2023 - Lớp 01', 'K23 (2023-2027)', 'CE', 'CM'),
('DH24CM01', 'ĐH Quản lý Xây dựng 2024 - Lớp 01', 'K24 (2024-2028)', 'CE', 'CM'),
('DH25CM01', 'ĐH Quản lý Xây dựng 2025 - Lớp 01', 'K25 (2025-2029)', 'CE', 'CM'),

-- Khoa SPE (CLC / Tiên tiến)
('DH23BA01C', 'ĐH Quản trị Kinh doanh CLC 2023 - Lớp 01', 'K23 (2023-2027)', 'SPE', 'BAC'),
('DH24BA01C', 'ĐH Quản trị Kinh doanh CLC 2024 - Lớp 01', 'K24 (2024-2028)', 'SPE', 'BAC'),
('DH25BA01C', 'ĐH Quản trị Kinh doanh CLC 2025 - Lớp 01', 'K25 (2025-2029)', 'SPE', 'BAC'),
('DH25BA02C', 'ĐH Quản trị Kinh doanh CLC 2025 - Lớp 02', 'K25 (2025-2029)', 'SPE', 'BAC'),
('DH23FB01C', 'ĐH Tài chính - Ngân hàng CLC 2023 - Lớp 01', 'K23 (2023-2027)', 'SPE', 'FBC'),
('DH24FB01C', 'ĐH Tài chính - Ngân hàng CLC 2024 - Lớp 01', 'K24 (2024-2028)', 'SPE', 'FBC'),
('DH24FB02C', 'ĐH Tài chính - Ngân hàng CLC 2024 - Lớp 02', 'K24 (2024-2028)', 'SPE', 'FBC'),
('DH25FB01C', 'ĐH Tài chính - Ngân hàng CLC 2025 - Lớp 01', 'K25 (2025-2029)', 'SPE', 'FBC'),
('DH23AC01C', 'ĐH Kế toán CLC 2023 - Lớp 01', 'K23 (2023-2027)', 'SPE', 'ACC'),
('DH23AC02C', 'ĐH Kế toán CLC 2023 - Lớp 02', 'K23 (2023-2027)', 'SPE', 'ACC'),
('DH24AC01C', 'ĐH Kế toán CLC 2024 - Lớp 01', 'K24 (2024-2028)', 'SPE', 'ACC'),
('DH25AC01C', 'ĐH Kế toán CLC 2025 - Lớp 01', 'K25 (2025-2029)', 'SPE', 'ACC'),
('DH23AU01C', 'ĐH Kiểm toán CLC 2023 - Lớp 01', 'K23 (2023-2027)', 'SPE', 'AUC'),
('DH24AU01C', 'ĐH Kiểm toán CLC 2024 - Lớp 01', 'K24 (2024-2028)', 'SPE', 'AUC'),
('DH25AU01C', 'ĐH Kiểm toán CLC 2025 - Lớp 01', 'K25 (2025-2029)', 'SPE', 'AUC'),
('DH23LA01C', 'ĐH Luật Kinh tế CLC 2023 - Lớp 01', 'K23 (2023-2027)', 'SPE', 'LAC'),
('DH23LA02C', 'ĐH Luật Kinh tế CLC 2023 - Lớp 02', 'K23 (2023-2027)', 'SPE', 'LAC'),
('DH24LA01C', 'ĐH Luật Kinh tế CLC 2024 - Lớp 01', 'K24 (2024-2028)', 'SPE', 'LAC'),
('DH25LA01C', 'ĐH Luật Kinh tế CLC 2025 - Lớp 01', 'K25 (2025-2029)', 'SPE', 'LAC'),
('DH25LA02C', 'ĐH Luật Kinh tế CLC 2025 - Lớp 02', 'K25 (2025-2029)', 'SPE', 'LAC'),
('DH23BT01C', 'ĐH Công nghệ Sinh học CLC 2023 - Lớp 01', 'K23 (2023-2027)', 'SPE', 'BTC'),
('DH24BT01C', 'ĐH Công nghệ Sinh học CLC 2024 - Lớp 01', 'K24 (2024-2028)', 'SPE', 'BTC'),
('DH25BT01C', 'ĐH Công nghệ Sinh học CLC 2025 - Lớp 01', 'K25 (2025-2029)', 'SPE', 'BTC'),
('DH23CS01C', 'ĐH Khoa học Máy tính CLC 2023 - Lớp 01', 'K23 (2023-2027)', 'SPE', 'CSC'),
('DH23CS02C', 'ĐH Khoa học Máy tính CLC 2023 - Lớp 02', 'K23 (2023-2027)', 'SPE', 'CSC'),
('DH24CS01C', 'ĐH Khoa học Máy tính CLC 2024 - Lớp 01', 'K24 (2024-2028)', 'SPE', 'CSC'),
('DH25CS01C', 'ĐH Khoa học Máy tính CLC 2025 - Lớp 01', 'K25 (2025-2029)', 'SPE', 'CSC'),
('DH25CS02C', 'ĐH Khoa học Máy tính CLC 2025 - Lớp 02', 'K25 (2025-2029)', 'SPE', 'CSC'),
('DH23IT01C', 'ĐH Công nghệ Thông tin CLC 2023 - Lớp 01', 'K23 (2023-2027)', 'SPE', 'ITC'),
('DH23IT02C', 'ĐH Công nghệ Thông tin CLC 2023 - Lớp 02', 'K23 (2023-2027)', 'SPE', 'ITC'),
('DH24IT01C', 'ĐH Công nghệ Thông tin CLC 2024 - Lớp 01', 'K24 (2024-2028)', 'SPE', 'ITC'),
('DH25IT01C', 'ĐH Công nghệ Thông tin CLC 2025 - Lớp 01', 'K25 (2025-2029)', 'SPE', 'ITC'),
('DH23CE01C', 'ĐH CNKT Công trình Xây dựng CLC 2023 - Lớp 01', 'K23 (2023-2027)', 'SPE', 'CEC'),
('DH24CE01C', 'ĐH CNKT Công trình Xây dựng CLC 2024 - Lớp 01', 'K24 (2024-2028)', 'SPE', 'CEC'),
('DH25CE01C', 'ĐH CNKT Công trình Xây dựng CLC 2025 - Lớp 01', 'K25 (2025-2029)', 'SPE', 'CEC'),
('DH23EL01C', 'ĐH Ngôn ngữ Anh CLC 2023 - Lớp 01', 'K23 (2023-2027)', 'SPE', 'ELC'),
('DH23EL02C', 'ĐH Ngôn ngữ Anh CLC 2023 - Lớp 02', 'K23 (2023-2027)', 'SPE', 'ELC'),
('DH24EL01C', 'ĐH Ngôn ngữ Anh CLC 2024 - Lớp 01', 'K24 (2024-2028)', 'SPE', 'ELC'),
('DH25EL01C', 'ĐH Ngôn ngữ Anh CLC 2025 - Lớp 01', 'K25 (2025-2029)', 'SPE', 'ELC'),
('DH25EL02C', 'ĐH Ngôn ngữ Anh CLC 2025 - Lớp 02', 'K25 (2025-2029)', 'SPE', 'ELC'),
('DH35CL01C', 'ĐH Ngôn ngữ Trung Quốc CLC 2023 - Lớp 01', 'K23 (2023-2027)', 'SPE', 'CLC'),
('DH24CL01C', 'ĐH Ngôn ngữ Trung Quốc CLC 2024 - Lớp 01', 'K24 (2024-2028)', 'SPE', 'CLC'),
('DH25CL01C', 'ĐH Ngôn ngữ Trung Quốc CLC 2025 - Lớp 01', 'K25 (2025-2029)', 'SPE', 'CLC'),
('DH23JK01C', 'ĐH Ngôn ngữ Nhật CLC 2023 - Lớp 01', 'K23 (2023-2027)', 'SPE', 'JKC'),
('DH24JK01C', 'ĐH Ngôn ngữ Nhật CLC 2024 - Lớp 01', 'K24 (2024-2028)', 'SPE', 'JKC'),
('DH25JK01C', 'ĐH Ngôn ngữ Nhật CLC 2025 - Lớp 01', 'K25 (2025-2029)', 'SPE', 'JKC'),
('DH23EC01C', 'ĐH Kinh tế CLC 2023 - Lớp 01', 'K23 (2023-2027)', 'SPE', 'ECC'),
('DH23EC02C', 'ĐH Kinh tế CLC 2023 - Lớp 02', 'K23 (2023-2027)', 'SPE', 'ECC'),
('DH24EC01C', 'ĐH Kinh tế CLC 2024 - Lớp 01', 'K24 (2024-2028)', 'SPE', 'ECC'),
('DH25EC01C', 'ĐH Kinh tế CLC 2025 - Lớp 01', 'K25 (2025-2029)', 'SPE', 'ECC');

-- 4. Danh mục 9 Học kỳ từ HK1 (2023-2024) đến HK3 (2025-2026)
INSERT INTO `hocky` (`maHocKy`, `namHoc`, `tenHocKy`) VALUES
('HK1_2023_2024', '2023-2024', 'Học kỳ 1 (2023-2024)'),
('HK2_2023_2024', '2023-2024', 'Học kỳ 2 (2023-2024)'),
('HK3_2023_2024', '2023-2024', 'Học kỳ 3 (2023-2024)'),
('HK1_2024_2025', '2024-2025', 'Học kỳ 1 (2024-2025)'),
('HK2_2024_2025', '2024-2025', 'Học kỳ 2 (2024-2025)'),
('HK3_2024_2025', '2024-2025', 'Học kỳ 3 (2024-2025)'),
('HK1_2025_2026', '2025-2026', 'Học kỳ 1 (2025-2026)'),
('HK2_2025_2026', '2025-2026', 'Học kỳ 2 (2025-2026)'),
('HK3_2025_2026', '2025-2026', 'Học kỳ 3 (2025-2026)');

-- 5. Người dùng (Admin, Cán bộ Trường, Cán bộ Khoa, Sinh viên)
INSERT INTO `nguoidung` (`id`, `tenDangNhap`, `matKhau`, `hoTen`, `email`, `soDienThoai`, `vaiTro`, `trangThai`, `ngayTao`) VALUES
-- Quản trị viên
(1, 'admin', '$2a$10$7Z8Kq58pYI4r3c5yBvP1ge2i.6B5kK8W3g2y1H4l7r9s0j3m4n5u6', 'Quản trị viên Hệ thống', 'admin@ou.edu.vn', '0909123456', 'ROLE_ADMIN', 'HOAT_DONG', NOW()),

-- Cán bộ cấp trường (P.CTSV)
(2, 'captruong_hau', '$2a$10$7Z8Kq58pYI4r3c5yBvP1ge2i.6B5kK8W3g2y1H4l7r9s0j3m4n5u6', 'Th.S Nguyễn Trung Hậu', 'hau.nt@ou.edu.vn', '0918123456', 'ROLE_CAN_BO_TRUONG', 'HOAT_DONG', NOW()),

-- Cán bộ quản lý Khoa IT và Khoa SPE
(3, 'cbk_cntt', '$2a$10$7Z8Kq58pYI4r3c5yBvP1ge2i.6B5kK8W3g2y1H4l7r9s0j3m4n5u6', 'Cán bộ QL Khoa CNTT', 'qlkhoa.cntt@ou.edu.vn', '0987654321', 'ROLE_CAN_BO_KHOA', 'HOAT_DONG', NOW()),
(4, 'cbk_spe', '$2a$10$7Z8Kq58pYI4r3c5yBvP1ge2i.6B5kK8W3g2y1H4l7r9s0j3m4n5u6', 'Cán bộ QL Khoa Đào tạo Đặc biệt', 'qlkhoa.clc@ou.edu.vn', '0987654322', 'ROLE_CAN_BO_KHOA', 'HOAT_DONG', NOW()),

-- Sinh viên Khóa 2023 (Mật khẩu mặc định là CCCD 12 số)
(10, '2351010216', '$2a$10$nKqf4HhTfX30.q1zT0Zk8.eJmD1r3L7O9Q5o8V6X3Y8m0p1a2b3c4', 'Nguyễn Thị Tuyết Trinh', '2351010216trinh@ou.edu.vn', '0934112233', 'ROLE_SINH_VIEN', 'HOAT_DONG', NOW()),
(11, '2351010001', '$2a$10$nKqf4HhTfX30.q1zT0Zk8.eJmD1r3L7O9Q5o8V6X3Y8m0p1a2b3c4', 'Trần Bảo An', '2351010001an@ou.edu.vn', '0934112234', 'ROLE_SINH_VIEN', 'HOAT_DONG', NOW()),
(12, '2351010002', '$2a$10$nKqf4HhTfX30.q1zT0Zk8.eJmD1r3L7O9Q5o8V6X3Y8m0p1a2b3c4', 'Lê Khánh Bình', '2351010002binh@ou.edu.vn', '0934112235', 'ROLE_SINH_VIEN', 'HOAT_DONG', NOW()),
(13, '2351010003', '$2a$10$nKqf4HhTfX30.q1zT0Zk8.eJmD1r3L7O9Q5o8V6X3Y8m0p1a2b3c4', 'Phạm Quốc Cường', '2351010003cuong@ou.edu.vn', '0934112236', 'ROLE_SINH_VIEN', 'HOAT_DONG', NOW()),
(14, '2351010004', '$2a$10$nKqf4HhTfX30.q1zT0Zk8.eJmD1r3L7O9Q5o8V6X3Y8m0p1a2b3c4', 'Hoàng Mỹ Linh', '2351010004linh@ou.edu.vn', '0934112237', 'ROLE_SINH_VIEN', 'HOAT_DONG', NOW()),
(15, '2351020001', '$2a$10$nKqf4HhTfX30.q1zT0Zk8.eJmD1r3L7O9Q5o8V6X3Y8m0p1a2b3c4', 'Vũ Nam Hùng', '2351020001hung@ou.edu.vn', '0934112238', 'ROLE_SINH_VIEN', 'HOAT_DONG', NOW()),
(16, '2351030001', '$2a$10$nKqf4HhTfX30.q1zT0Zk8.eJmD1r3L7O9Q5o8V6X3Y8m0p1a2b3c4', 'Đoàn Kim Oanh', '2351030001oanh@ou.edu.vn', '0934112239', 'ROLE_SINH_VIEN', 'HOAT_DONG', NOW()),
(17, '2351040001', '$2a$10$nKqf4HhTfX30.q1zT0Zk8.eJmD1r3L7O9Q5o8V6X3Y8m0p1a2b3c4', 'Ngô Thanh Phong', '2351040001phong@ou.edu.vn', '0934112240', 'ROLE_SINH_VIEN', 'HOAT_DONG', NOW()),
(18, '2351050001', '$2a$10$nKqf4HhTfX30.q1zT0Zk8.eJmD1r3L7O9Q5o8V6X3Y8m0p1a2b3c4', 'Bùi Đức Trí', '2351050001tri@ou.edu.vn', '0934112241', 'ROLE_SINH_VIEN', 'HOAT_DONG', NOW()),
(19, '2351060001', '$2a$10$nKqf4HhTfX30.q1zT0Zk8.eJmD1r3L7O9Q5o8V6X3Y8m0p1a2b3c4', 'Đặng Thảo Vy', '2351060001vy@ou.edu.vn', '0934112242', 'ROLE_SINH_VIEN', 'HOAT_DONG', NOW()),
(20, '2351070001', '$2a$10$nKqf4HhTfX30.q1zT0Zk8.eJmD1r3L7O9Q5o8V6X3Y8m0p1a2b3c4', 'Phan Văn Đức', '2351070001duc@ou.edu.vn', '0934112243', 'ROLE_SINH_VIEN', 'HOAT_DONG', NOW());

-- 6. Nhân viên
INSERT INTO `nhanvien` (`maNv`, `nguoiDungId`, `chucVu`, `donViCongTac`) VALUES
('NV_TRUONG_01', 2, 'Trưởng phòng CTSV', 'Phòng Công tác Sinh viên'),
('NV_KHOA_IT', 3, 'Trợ lý Giáo vụ & CTSV', 'Khoa Công nghệ Thông tin'),
('NV_KHOA_SPE', 4, 'Trợ lý Giáo vụ & CTSV', 'Khoa Đào tạo Đặc biệt');

INSERT INTO `canbocaptruong` (`maNv`, `phongBan`, `capPheDuyet`) VALUES
('NV_TRUONG_01', 'Phòng Công tác Sinh viên', 'Cấp Trường');

INSERT INTO `canbokhoa` (`maNv`, `maKhoa`, `lopPhuTrach`, `trangThaiCongTac`) VALUES
('NV_KHOA_IT', 'IT', 'DH23CS01, DH23CS02, DH23IT01', 'Đang công tác'),
('NV_KHOA_SPE', 'SPE', 'DH23CS01C, DH23BA01C, DH23AC01C', 'Đang công tác');

-- 7. Sinh viên: Lưu kèm CCCD 12 số
INSERT INTO `sinhvien` (`mssv`, `cccd`, `nguoiDungId`, `ngaySinh`, `gioiTinh`, `diaChi`, `trangThaiHoc`, `maLop`) VALUES
('2351010216', '079305012345', 10, '2005-05-15', 'Nữ', '97 Võ Văn Tần, Phường Võ Thị Sáu, Quận 3, TP.HCM', 'DANG_HOC', 'DH23CS02'),
('2351010001', '079205001111', 11, '2005-01-20', 'Nam', '371 Nguyễn Kiệm, Phường 3, Quận Gò Vấp, TP.HCM', 'DANG_HOC', 'DH23CS01'),
('2351010002', '079305002222', 12, '2005-03-12', 'Nữ', 'Quận 1, TP. Hồ Chí Minh', 'DANG_HOC', 'DH23CS01C'),
('2351010003', '079205003333', 13, '2005-07-25', 'Nam', 'Quận Bình Thạnh, TP. Hồ Chí Minh', 'DANG_HOC', 'DH23IT01'),
('2351010004', '079305004444', 14, '2005-09-18', 'Nữ', 'TP. Thủ Đức, TP. Hồ Chí Minh', 'DANG_HOC', 'DH23IM01'),
('2351020001', '079205005555', 15, '2005-06-30', 'Nam', 'Quận 5, TP. Hồ Chí Minh', 'DANG_HOC', 'DH23BA01C'),
('2351030001', '079305006666', 16, '2005-12-10', 'Nữ', 'Quận 10, TP. Hồ Chí Minh', 'DANG_HOC', 'DH23AC01C'),
('2351040001', '079205007777', 17, '2005-04-14', 'Nam', 'Quận Tân Bình, TP. Hồ Chí Minh', 'DANG_HOC', 'DH23EL01C'),
('2351050001', '079205008888', 18, '2005-08-22', 'Nam', 'Quận Phú Nhuận, TP. Hồ Chí Minh', 'DANG_HOC', 'DH23LA01C'),
('2351060001', '079305009999', 19, '2005-10-10', 'Nữ', 'Quận 3, TP. Hồ Chí Minh', 'DANG_HOC', 'DH23BT01C'),
('2351070001', '079205010000', 20, '2005-11-12', 'Nam', 'Quận Gò Vấp, TP. Hồ Chí Minh', 'DANG_HOC', 'DH23CE01C');

-- 8. Kết quả Học tập (ĐẦY ĐỦ 9 HỌC KỲ TỪ HK1 2023-2024 ĐẾN HK3 2025-2026 CHO SV KHÓA 2023)
INSERT INTO `ketquahoctap` (`id`, `mssv`, `maHocKy`, `diemTrungBinh`, `soTinChi`, `coHocPhanRot`) VALUES
-- Tuyết Trinh (2351010216)
('GPA_2351010216_HK1_2324', '2351010216', 'HK1_2023_2024', 3.60, 10, 0),
('GPA_2351010216_HK2_2324', '2351010216', 'HK2_2023_2024', 3.17, 9, 0),
('GPA_2351010216_HK3_2324', '2351010216', 'HK3_2023_2024', 3.80, 8, 0),
('GPA_2351010216_HK1_2425', '2351010216', 'HK1_2024_2025', 2.83, 20, 0),
('GPA_2351010216_HK2_2425', '2351010216', 'HK2_2024_2025', 3.13, 20, 0),
('GPA_2351010216_HK3_2425', '2351010216', 'HK3_2024_2025', 3.29, 14, 0),
('GPA_2351010216_HK1_2526', '2351010216', 'HK1_2025_2026', 3.95, 18, 0),
('GPA_2351010216_HK2_2526', '2351010216', 'HK2_2025_2026', 3.00, 10, 0),
('GPA_2351010216_HK3_2526', '2351010216', 'HK3_2025_2026', 4.00, 9, 0),

-- Bảo An (2351010001)
('GPA_2351010001_HK1_2324', '2351010001', 'HK1_2023_2024', 3.65, 17, 0),
('GPA_2351010001_HK2_2324', '2351010001', 'HK2_2023_2024', 3.70, 18, 0),
('GPA_2351010001_HK3_2324', '2351010001', 'HK3_2023_2024', 3.60, 6, 0),
('GPA_2351010001_HK1_2425', '2351010001', 'HK1_2024_2025', 3.72, 19, 0),
('GPA_2351010001_HK2_2425', '2351010001', 'HK2_2024_2025', 3.78, 18, 0),
('GPA_2351010001_HK3_2425', '2351010001', 'HK3_2024_2025', 3.65, 6, 0),
('GPA_2351010001_HK1_2526', '2351010001', 'HK1_2025_2026', 3.75, 17, 0),
('GPA_2351010001_HK2_2526', '2351010001', 'HK2_2025_2026', 3.80, 16, 0),
('GPA_2351010001_HK3_2526', '2351010001', 'HK3_2025_2026', 3.70, 8, 0),

-- Khánh Bình (2351010002)
('GPA_2351010002_HK1_2324', '2351010002', 'HK1_2023_2024', 3.40, 16, 0),
('GPA_2351010002_HK2_2324', '2351010002', 'HK2_2023_2024', 3.50, 17, 0),
('GPA_2351010002_HK3_2324', '2351010002', 'HK3_2023_2024', 3.50, 6, 0),
('GPA_2351010002_HK1_2425', '2351010002', 'HK1_2024_2025', 3.55, 18, 0),
('GPA_2351010002_HK2_2425', '2351010002', 'HK2_2024_2025', 3.60, 17, 0),
('GPA_2351010002_HK3_2425', '2351010002', 'HK3_2024_2025', 3.45, 6, 0),
('GPA_2351010002_HK1_2526', '2351010002', 'HK1_2025_2026', 3.55, 16, 0),
('GPA_2351010002_HK2_2526', '2351010002', 'HK2_2025_2026', 3.62, 16, 0),
('GPA_2351010002_HK3_2526', '2351010002', 'HK3_2025_2026', 3.58, 8, 0),

-- Nam Hùng (2351020001)
('GPA_2351020001_HK1_2324', '2351020001', 'HK1_2023_2024', 3.78, 18, 0),
('GPA_2351020001_HK2_2324', '2351020001', 'HK2_2023_2024', 3.82, 19, 0),
('GPA_2351020001_HK3_2324', '2351020001', 'HK3_2023_2024', 3.70, 6, 0),
('GPA_2351020001_HK1_2425', '2351020001', 'HK1_2024_2025', 3.85, 18, 0),
('GPA_2351020001_HK2_2425', '2351020001', 'HK2_2024_2025', 3.88, 18, 0),
('GPA_2351020001_HK3_2425', '2351020001', 'HK3_2024_2025', 3.75, 6, 0),
('GPA_2351020001_HK1_2526', '2351020001', 'HK1_2025_2026', 3.82, 18, 0),
('GPA_2351020001_HK2_2526', '2351020001', 'HK2_2025_2026', 3.86, 17, 0),
('GPA_2351020001_HK3_2526', '2351020001', 'HK3_2025_2026', 3.80, 8, 0),

-- Các SV khác
('GPA_2351030001_HK1_2526', '2351030001', 'HK1_2025_2026', 3.65, 17, 0),
('GPA_2351040001_HK1_2526', '2351040001', 'HK1_2025_2026', 3.70, 16, 0),
('GPA_2351050001_HK1_2526', '2351050001', 'HK1_2025_2026', 3.40, 15, 0),
('GPA_2351060001_HK1_2526', '2351060001', 'HK1_2025_2026', 3.60, 16, 0),
('GPA_2351070001_HK1_2526', '2351070001', 'HK1_2025_2026', 3.50, 16, 0);

-- 9. Kết quả Rèn luyện (ĐẦY ĐỦ 9 HỌC KỲ CHO SV KHÓA 2023)
INSERT INTO `ketquarenluyen` (`id`, `mssv`, `maHocKy`, `diemRenLuyen`, `xepLoai`) VALUES
-- Tuyết Trinh (2351010216)
('DRL_2351010216_HK1_2324', '2351010216', 'HK1_2023_2024', 100.00, 'Xuat sac'),
('DRL_2351010216_HK2_2324', '2351010216', 'HK2_2023_2024', 100.00, 'Xuat sac'),
('DRL_2351010216_HK3_2324', '2351010216', 'HK3_2023_2024', 100.00, 'Xuat sac'),
('DRL_2351010216_HK1_2425', '2351010216', 'HK1_2024_2025', 100.00, 'Xuat sac'),
('DRL_2351010216_HK2_2425', '2351010216', 'HK2_2024_2025', 100.00, 'Xuat sac'),
('DRL_2351010216_HK3_2425', '2351010216', 'HK3_2024_2025', 100.00, 'Xuat sac'),
('DRL_2351010216_HK1_2526', '2351010216', 'HK1_2025_2026', 100.00, 'Xuat sac'),
('DRL_2351010216_HK2_2526', '2351010216', 'HK2_2025_2026', 100.00, 'Xuat sac'),
('DRL_2351010216_HK3_2526', '2351010216', 'HK3_2025_2026', 100.00, 'Xuat sac'),

-- Bảo An (2351010001)
('DRL_2351010001_HK1_2324', '2351010001', 'HK1_2023_2024', 86.00, 'Tot'),
('DRL_2351010001_HK2_2324', '2351010001', 'HK2_2023_2024', 88.00, 'Tot'),
('DRL_2351010001_HK3_2324', '2351010001', 'HK3_2023_2024', 85.00, 'Tot'),
('DRL_2351010001_HK1_2425', '2351010001', 'HK1_2024_2025', 87.00, 'Tot'),
('DRL_2351010001_HK2_2425', '2351010001', 'HK2_2024_2025', 90.00, 'Xuat sac'),
('DRL_2351010001_HK3_2425', '2351010001', 'HK3_2024_2025', 85.00, 'Tot'),
('DRL_2351010001_HK1_2526', '2351010001', 'HK1_2025_2026', 89.00, 'Tot'),
('DRL_2351010001_HK2_2526', '2351010001', 'HK2_2025_2026', 91.00, 'Xuat sac'),
('DRL_2351010001_HK3_2526', '2351010001', 'HK3_2025_2026', 88.00, 'Tot'),

-- Các SV khác
('DRL_2351010002_HK1_2526', '2351010002', 'HK1_2025_2026', 86.00, 'Tot'),
('DRL_2351010003_HK1_2526', '2351010003', 'HK1_2025_2026', 82.00, 'Tot'),
('DRL_2351010004_HK1_2526', '2351010004', 'HK1_2025_2026', 78.00, 'Kha'),
('DRL_2351020001_HK1_2526', '2351020001', 'HK1_2025_2026', 92.00, 'Xuat sac'),
('DRL_2351030001_HK1_2526', '2351030001', 'HK1_2025_2026', 88.00, 'Tot'),
('DRL_2351040001_HK1_2526', '2351040001', 'HK1_2025_2026', 90.00, 'Xuat sac'),
('DRL_2351050001_HK1_2526', '2351050001', 'HK1_2025_2026', 84.00, 'Tot'),
('DRL_2351060001_HK1_2526', '2351060001', 'HK1_2025_2026', 85.00, 'Tot'),
('DRL_2351070001_HK1_2526', '2351070001', 'HK1_2025_2026', 80.00, 'Tot');

-- 10. Đợt xét Học bổng Cấp trường
INSERT INTO `dotxethocbong` (`maDot`, `tenDot`, `ngayBatDau`, `ngayKetThuc`, `maHocKy`, `trangThai`) VALUES
('HB_HK1_2025', 'Học bổng Khuyến khích Học tập - HK1 (2025-2026)', '2025-09-01', '2025-10-30', 'HK1_2025_2026', 'DANG_MO'),
('HB_HK2_2024', 'Học bổng Khuyến khích Học tập - HK2 (2024-2025)', '2025-03-01', '2025-04-30', 'HK2_2024_2025', 'DA_KET_THUC'),
('HB_HK1_2024', 'Học bổng Khuyến khích Học tập - HK1 (2024-2025)', '2024-09-01', '2024-10-30', 'HK1_2024_2025', 'DA_KET_THUC');

-- 11. Dynamic Rule Engine
INSERT INTO `quytachocbong` (`maQuyTac`, `maDot`, `diemTbDuoiThieu`, `diemRlToiThieu`, `soTinChiToiThieu`, `khongNoMon`, `phienBan`, `ghiChu`, `mucHocBongXuatSac`, `mucHocBongGioi`, `mucHocBongKha`) VALUES
('QT_HB_HK1_2025_V1', 'HB_HK1_2025', 2.50, 65.00, 14, 1, 1, 'Quy chế xét học bổng KKHT năm học 2025-2026 chuẩn', 10000000.00, 7000000.00, 5000000.00),
('QT_HB_HK2_2024_V1', 'HB_HK2_2024', 2.50, 65.00, 14, 1, 1, 'Quy chế xét học bổng KKHT HK2 (2024-2025)', 10000000.00, 7000000.00, 5000000.00);

-- 12. Phân bổ Đợt xét theo Khoa
INSERT INTO `dotxethbkhoa` (`maDotXetHbKhoa`, `maDot`, `maKhoa`, `chiTieu`, `nganSachKhoa`, `hanPhanHoi`, `trangThai`, `lyDoTraVe`) VALUES
('HB_HK1_2025_IT', 'HB_HK1_2025', 'IT', 5, 45000000.00, '2025-10-25', 'CHUA_XET', NULL),
('HB_HK1_2025_BA', 'HB_HK1_2025', 'BA', 4, 35000000.00, '2025-10-25', 'CHUA_XET', NULL),
('HB_HK1_2025_ACC', 'HB_HK1_2025', 'ACC', 3, 25000000.00, '2025-10-25', 'CHUA_XET', NULL),
('HB_HK1_2025_BF', 'HB_HK1_2025', 'BF', 3, 25000000.00, '2025-10-25', 'CHUA_XET', NULL),
('HB_HK1_2025_ECO', 'HB_HK1_2025', 'ECO', 2, 20000000.00, '2025-10-25', 'CHUA_XET', NULL),
('HB_HK1_2025_LAW', 'HB_HK1_2025', 'LAW', 3, 25000000.00, '2025-10-25', 'CHUA_XET', NULL),
('HB_HK1_2025_FL', 'HB_HK1_2025', 'FL', 3, 25000000.00, '2025-10-25', 'CHUA_XET', NULL),
('HB_HK1_2025_BIO', 'HB_HK1_2025', 'BIO', 2, 15000000.00, '2025-10-25', 'CHUA_XET', NULL),
('HB_HK1_2025_CE', 'HB_HK1_2025', 'CE', 2, 15000000.00, '2025-10-25', 'CHUA_XET', NULL),
('HB_HK1_2025_SOC', 'HB_HK1_2025', 'SOC', 2, 15000000.00, '2025-10-25', 'CHUA_XET', NULL),
('HB_HK1_2025_BAS', 'HB_HK1_2025', 'BAS', 2, 15000000.00, '2025-10-25', 'CHUA_XET', NULL),
('HB_HK1_2025_SPE', 'HB_HK1_2025', 'SPE', 6, 50000000.00, '2025-10-25', 'CHUA_XET', NULL);

-- 13. Minh chứng Rèn luyện Mẫu
INSERT INTO `minhchungrenluyen` (`maMinhChung`, `tenHoatDong`, `diemDeXuat`, `fileUrl`, `moTa`, `trangThai`, `maHoSo`, `mssv`, `maHocKy`, `maNvPheDuyet`, `lyDoPhanHoi`, `ngayTao`) VALUES
('MC_2025_001', 'Tham gia Nghiên cứu Khoa học Sinh viên Cấp Trường 2025', 6.00, 'https://drive.google.com/minhchung_nckh_2351010216.pdf', 'Đề tài Dynamic Rule Engine trong OU-SSH Hub', 'CHO_DUYET', NULL, '2351010216', 'HK1_2025_2026', NULL, NULL, NOW()),
('MC_2025_002', 'Chiến dịch Mùa hè Xanh Trường ĐH Mở TP.HCM 2025', 4.00, 'https://drive.google.com/minhchung_mhx_2351010001.pdf', 'Giấy chứng nhận tham gia chiến dịch MHX 2025', 'DA_DUYET', NULL, '2351010001', 'HK1_2025_2026', 'NV_KHOA_IT', 'Minh chứng hợp lệ, cộng 4 điểm', NOW());
