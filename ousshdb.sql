-- ====================================================================
-- TRƯỜNG ĐẠI HỌC MỞ THÀNH PHỐ HỒ CHÍ MINH
-- HỆ THỐNG QUẢN LÝ HỌC TẬP - RÈN LUYỆN & HỌC BỔNG (OU-SSH HUB)
-- CƠ SỞ DỮ LIỆU: 11 KHOA CHUẨN & 1 KHOA CLC - MẬT KHẨU MẶC ĐỊNH LÀ CCCD 12 SỐ
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
    `vaiTro` VARCHAR(50) NOT NULL,
    `trangThai` VARCHAR(50) DEFAULT 'HOAT_DONG',
    `ngayTao` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 2. Bảng khoa (11 Khoa Chuẩn & 1 Khoa Đào tạo Đặc biệt / CLC)
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS `khoa`;
CREATE TABLE `khoa` (
    `maKhoa` VARCHAR(20) PRIMARY KEY,
    `tenKhoa` VARCHAR(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 3. Bảng nganh
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
-- 4. Bảng lopsinhhoat
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
-- 5. Bảng hocky
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS `hocky`;
CREATE TABLE `hocky` (
    `maHocKy` VARCHAR(30) PRIMARY KEY,
    `namHoc` VARCHAR(20) NOT NULL,
    `tenHocKy` VARCHAR(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------------------
-- 6. Bảng sinhvien (Đã thêm cột cccd 12 số)
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
-- DỮ LIỆU SEED DATA ĐẦY ĐỦ
-- Mật khẩu BCrypt:
--   - Cán bộ/Admin: Admin@123456 ($2a$10$7Z8Kq58pYI4r3c5yBvP1ge2i.6B5kK8W3g2y1H4l7r9s0j3m4n5u6)
--   - Sinh viên: Mật khẩu chính là số CCCD (12 chữ số) băm BCrypt tương ứng
-- ====================================================================

-- 1. Danh mục 11 Khoa Chuẩn & 1 Khoa CLC
INSERT INTO `khoa` (`maKhoa`, `tenKhoa`) VALUES
('CNTT', 'Khoa Công nghệ Thông tin'),
('QTKD', 'Khoa Quản trị Kinh doanh'),
('KTKT', 'Khoa Kế toán - Kiểm toán'),
('TCNH', 'Khoa Tài chính - Ngân hàng'),
('KTQLC', 'Khoa Kinh tế và Quản lý Công'),
('LUAT', 'Khoa Luật'),
('NN', 'Khoa Ngoại ngữ'),
('CNSH', 'Khoa Công nghệ Sinh học'),
('XD', 'Khoa Xây dựng'),
('XHH', 'Khoa Xã hội học - Công tác xã hội - Đông Nam Á học'),
('DTTX', 'Khoa Đào tạo Trực tuyến'),
('KDB', 'Khoa Đào tạo Đặc biệt (Chất lượng cao)');

-- 2. Danh mục Ngành đào tạo
INSERT INTO `nganh` (`maNganh`, `tenNganh`, `heDaoTao`, `maKhoa`) VALUES
-- Khoa Chuẩn
('KHMT', 'Khoa học Máy tính (Chuẩn)', 'CHUAN', 'CNTT'),
('KTPM', 'Kỹ thuật Phần mềm (Chuẩn)', 'CHUAN', 'CNTT'),
('HTTT', 'Hệ thống Thông tin (Chuẩn)', 'CHUAN', 'CNTT'),
('QTKD_N', 'Quản trị Kinh doanh (Chuẩn)', 'CHUAN', 'QTKD'),
('MKT', 'Marketing (Chuẩn)', 'CHUAN', 'QTKD'),
('KDQT', 'Kinh doanh Quốc tế (Chuẩn)', 'CHUAN', 'QTKD'),
('KT', 'Kế toán (Chuẩn)', 'CHUAN', 'KTKT'),
('KT_KT', 'Kiểm toán (Chuẩn)', 'CHUAN', 'KTKT'),
('TCNH_N', 'Tài chính - Ngân hàng (Chuẩn)', 'CHUAN', 'TCNH'),
('KTQT', 'Kinh tế Quốc tế (Chuẩn)', 'CHUAN', 'KTQLC'),
('QLC', 'Quản lý Công (Chuẩn)', 'CHUAN', 'KTQLC'),
('LUAT_H', 'Luật Học (Chuẩn)', 'CHUAN', 'LUAT'),
('LUAT_KT', 'Luật Kinh tế (Chuẩn)', 'CHUAN', 'LUAT'),
('NNA', 'Ngôn ngữ Anh (Chuẩn)', 'CHUAN', 'NN'),
('NNT', 'Ngôn ngữ Trung Quốc (Chuẩn)', 'CHUAN', 'NN'),
('NNN', 'Ngôn ngữ Nhật (Chuẩn)', 'CHUAN', 'NN'),
('CNSH_N', 'Công nghệ Sinh học (Chuẩn)', 'CHUAN', 'CNSH'),
('CNTP', 'Công nghệ Thực phẩm (Chuẩn)', 'CHUAN', 'CNSH'),
('KTXD', 'Kỹ thuật Xây dựng (Chuẩn)', 'CHUAN', 'XD'),
('QLXD', 'Quản lý Xây dựng (Chuẩn)', 'CHUAN', 'XD'),
('CTXH', 'Công tác Xã hội (Chuẩn)', 'CHUAN', 'XHH'),
('XHH_N', 'Xã hội học (Chuẩn)', 'CHUAN', 'XHH'),
('CNTT_TX', 'Công nghệ Thông tin (Trực tuyến)', 'CHUAN', 'DTTX'),
('QTKD_TX', 'Quản trị Kinh doanh (Trực tuyến)', 'CHUAN', 'DTTX'),

-- Khoa Đào tạo Đặc biệt (Chất lượng cao)
('KHMT_CLC', 'Khoa học Máy tính (Chất lượng cao)', 'CHAT_LUONG_CAO', 'KDB'),
('QTKD_CLC', 'Quản trị Kinh doanh (Chất lượng cao)', 'CHAT_LUONG_CAO', 'KDB'),
('TCNH_CLC', 'Tài chính - Ngân hàng (Chất lượng cao)', 'CHAT_LUONG_CAO', 'KDB'),
('KT_CLC', 'Kế toán (Chất lượng cao)', 'CHAT_LUONG_CAO', 'KDB'),
('LUAT_CLC', 'Luật Kinh tế (Chất lượng cao)', 'CHAT_LUONG_CAO', 'KDB'),
('NNA_CLC', 'Ngôn ngữ Anh (Chất lượng cao)', 'CHAT_LUONG_CAO', 'KDB'),
('CNSH_CLC', 'Công nghệ Sinh học (Chất lượng cao)', 'CHAT_LUONG_CAO', 'KDB'),
('KTXD_CLC', 'Kỹ thuật Xây dựng (Chất lượng cao)', 'CHAT_LUONG_CAO', 'KDB');

-- 3. Danh mục Lớp sinh hoạt
INSERT INTO `lopsinhhoat` (`maLop`, `tenLop`, `khoaHoc`, `maKhoa`, `maNganh`) VALUES
-- Khoa Chuẩn
('DH23CS01', 'Đại học Khoa học Máy tính 2023 - Chuẩn Lớp 01', 'K23 (2023-2027)', 'CNTT', 'KHMT'),
('DH23SE01', 'Đại học Kỹ thuật Phần mềm 2023 - Chuẩn Lớp 01', 'K23 (2023-2027)', 'CNTT', 'KTPM'),
('DH23IS01', 'Đại học Hệ thống Thông tin 2023 - Chuẩn Lớp 01', 'K23 (2023-2027)', 'CNTT', 'HTTT'),
('DH23BA01', 'Đại học Quản trị Kinh doanh 2023 - Chuẩn Lớp 01', 'K23 (2023-2027)', 'QTKD', 'QTKD_N'),
('DH23MK01', 'Đại học Marketing 2023 - Chuẩn Lớp 01', 'K23 (2023-2027)', 'QTKD', 'MKT'),
('DH23AC01', 'Đại học Kế toán 2023 - Chuẩn Lớp 01', 'K23 (2023-2027)', 'KTKT', 'KT'),
('DH23AU01', 'Đại học Kiểm toán 2023 - Chuẩn Lớp 01', 'K23 (2023-2027)', 'KTKT', 'KT_KT'),
('DH23BF01', 'Đại học Tài chính Ngân hàng 2023 - Chuẩn Lớp 01', 'K23 (2023-2027)', 'TCNH', 'TCNH_N'),
('DH23EC01', 'Đại học Kinh tế Quốc tế 2023 - Chuẩn Lớp 01', 'K23 (2023-2027)', 'KTQLC', 'KTQT'),
('DH23LA01', 'Đại học Luật Kinh tế 2023 - Chuẩn Lớp 01', 'K23 (2023-2027)', 'LUAT', 'LUAT_KT'),
('DH23EL01', 'Đại học Ngôn ngữ Anh 2023 - Chuẩn Lớp 01', 'K23 (2023-2027)', 'NN', 'NNA'),
('DH23CL01', 'Đại học Ngôn ngữ Trung Quốc 2023 - Chuẩn Lớp 01', 'K23 (2023-2027)', 'NN', 'NNT'),
('DH23BT01', 'Đại học Công nghệ Sinh học 2023 - Chuẩn Lớp 01', 'K23 (2023-2027)', 'CNSH', 'CNSH_N'),
('DH23CE01', 'Đại học Kỹ thuật Xây dựng 2023 - Chuẩn Lớp 01', 'K23 (2023-2027)', 'XD', 'KTXD'),
('DH23SW01', 'Đại học Công tác Xã hội 2023 - Chuẩn Lớp 01', 'K23 (2023-2027)', 'XHH', 'CTXH'),
('DH23OL01', 'Đại học CNTT Trực tuyến 2023 - Lớp 01', 'K23 (2023-2027)', 'DTTX', 'CNTT_TX'),

-- Khoa Đào tạo Đặc biệt (Chất lượng cao)
('DH23CS01CLC', 'Đại học Khoa học Máy tính CLC 2023 - Lớp 01', 'K23 (2023-2027)', 'KDB', 'KHMT_CLC'),
('DH23BA01CLC', 'Đại học Quản trị Kinh doanh CLC 2023 - Lớp 01', 'K23 (2023-2027)', 'KDB', 'QTKD_CLC'),
('DH23BF01CLC', 'Đại học Tài chính Ngân hàng CLC 2023 - Lớp 01', 'K23 (2023-2027)', 'KDB', 'TCNH_CLC'),
('DH23AC01CLC', 'Đại học Kế toán CLC 2023 - Lớp 01', 'K23 (2023-2027)', 'KDB', 'KT_CLC'),
('DH23LA01CLC', 'Đại học Luật Kinh tế CLC 2023 - Lớp 01', 'K23 (2023-2027)', 'KDB', 'LUAT_CLC'),
('DH23EL01CLC', 'Đại học Ngôn ngữ Anh CLC 2023 - Lớp 01', 'K23 (2023-2027)', 'KDB', 'NNA_CLC'),
('DH23BT01CLC', 'Đại học Công nghệ Sinh học CLC 2023 - Lớp 01', 'K23 (2023-2027)', 'KDB', 'CNSH_CLC'),
('DH23CE01CLC', 'Đại học Kỹ thuật Xây dựng CLC 2023 - Lớp 01', 'K23 (2023-2027)', 'KDB', 'KTXD_CLC');

-- 4. Danh mục Học kỳ
INSERT INTO `hocky` (`maHocKy`, `namHoc`, `tenHocKy`) VALUES
('HK1_2025_2026', '2025-2026', 'Học kỳ 1 (2025-2026)'),
('HK2_2024_2025', '2024-2025', 'Học kỳ 2 (2024-2025)');

-- 5. Người dùng: Mật khẩu SV băm từ CCCD 12 số
INSERT INTO `nguoidung` (`id`, `tenDangNhap`, `matKhau`, `hoTen`, `email`, `soDienThoai`, `vaiTro`, `trangThai`, `ngayTao`) VALUES
-- Admin / Cán bộ
(1, 'admin', '$2a$10$7Z8Kq58pYI4r3c5yBvP1ge2i.6B5kK8W3g2y1H4l7r9s0j3m4n5u6', 'Quản trị viên Hệ thống', 'admin@ou.edu.vn', '0909123456', 'ROLE_ADMIN', 'HOAT_DONG', NOW()),
(2, 'captruong_hau', '$2a$10$7Z8Kq58pYI4r3c5yBvP1ge2i.6B5kK8W3g2y1H4l7r9s0j3m4n5u6', 'Th.S Nguyễn Trung Hậu', 'hau.nt@ou.edu.vn', '0918123456', 'ROLE_CAN_BO_TRUONG', 'HOAT_DONG', NOW()),
(3, 'cbk_cntt', '$2a$10$7Z8Kq58pYI4r3c5yBvP1ge2i.6B5kK8W3g2y1H4l7r9s0j3m4n5u6', 'Cán bộ QL Khoa CNTT', 'qlkhoa.cntt@ou.edu.vn', '0987654321', 'ROLE_CAN_BO_KHOA', 'HOAT_DONG', NOW()),
(4, 'cbk_kdb', '$2a$10$7Z8Kq58pYI4r3c5yBvP1ge2i.6B5kK8W3g2y1H4l7r9s0j3m4n5u6', 'Cán bộ QL Khoa CLC', 'qlkhoa.clc@ou.edu.vn', '0987654322', 'ROLE_CAN_BO_KHOA', 'HOAT_DONG', NOW()),

-- Sinh viên (Mật khẩu = CCCD 12 số)
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
('NV_KHOA_CNTT', 3, 'Trợ lý Giáo vụ & CTSV', 'Khoa Công nghệ Thông tin'),
('NV_KHOA_KDB', 4, 'Trợ lý Giáo vụ & CTSV', 'Khoa Đào tạo Đặc biệt (Chất lượng cao)');

INSERT INTO `canbocaptruong` (`maNv`, `phongBan`, `capPheDuyet`) VALUES
('NV_TRUONG_01', 'Phòng Công tác Sinh viên', 'Cấp Trường');

INSERT INTO `canbokhoa` (`maNv`, `maKhoa`, `lopPhuTrach`, `trangThaiCongTac`) VALUES
('NV_KHOA_CNTT', 'CNTT', 'DH23CS01, DH23SE01, DH23IS01', 'Đang công tác'),
('NV_KHOA_KDB', 'KDB', 'DH23CS01CLC, DH23BA01CLC, DH23BF01CLC, DH23AC01CLC', 'Đang công tác');

-- 7. Sinh viên: Lưu kèm CCCD 12 số
INSERT INTO `sinhvien` (`mssv`, `cccd`, `nguoiDungId`, `ngaySinh`, `gioiTinh`, `diaChi`, `trangThaiHoc`, `maLop`) VALUES
('2351010216', '079305012345', 10, '2005-05-15', 'Nữ', '97 Võ Văn Tần, Phường Võ Thị Sáu, Quận 3, TP.HCM', 'DANG_HOC', 'DH23CS01'),
('2351010001', '079205001111', 11, '2005-01-20', 'Nam', '371 Nguyễn Kiệm, Phường 3, Quận Gò Vấp, TP.HCM', 'DANG_HOC', 'DH23CS01'),
('2351010002', '079305002222', 12, '2005-03-12', 'Nữ', 'Quận 1, TP. Hồ Chí Minh', 'DANG_HOC', 'DH23CS01CLC'),
('2351010003', '079205003333', 13, '2005-07-25', 'Nam', 'Quận Bình Thạnh, TP. Hồ Chí Minh', 'DANG_HOC', 'DH23SE01'),
('2351010004', '079305004444', 14, '2005-09-18', 'Nữ', 'TP. Thủ Đức, TP. Hồ Chí Minh', 'DANG_HOC', 'DH23IS01'),
('2351020001', '079205005555', 15, '2005-06-30', 'Nam', 'Quận 5, TP. Hồ Chí Minh', 'DANG_HOC', 'DH23BA01CLC'),
('2351030001', '079305006666', 16, '2005-12-10', 'Nữ', 'Quận 10, TP. Hồ Chí Minh', 'DANG_HOC', 'DH23AC01CLC'),
('2351040001', '079205007777', 17, '2005-04-14', 'Nam', 'Quận Tân Bình, TP. Hồ Chí Minh', 'DANG_HOC', 'DH23EL01CLC'),
('2351050001', '079205008888', 18, '2005-08-22', 'Nam', 'Quận Phú Nhuận, TP. Hồ Chí Minh', 'DANG_HOC', 'DH23LA01CLC'),
('2351060001', '079305009999', 19, '2005-10-10', 'Nữ', 'Quận 3, TP. Hồ Chí Minh', 'DANG_HOC', 'DH23BT01CLC'),
('2351070001', '079205010000', 20, '2005-11-12', 'Nam', 'Quận Gò Vấp, TP. Hồ Chí Minh', 'DANG_HOC', 'DH23CE01CLC');

-- 8. Kết quả Học tập
INSERT INTO `ketquahoctap` (`id`, `mssv`, `maHocKy`, `diemTrungBinh`, `soTinChi`, `coHocPhanRot`) VALUES
('GPA_2351010216_HK1_2025_2026', '2351010216', 'HK1_2025_2026', 3.92, 18, 0),
('GPA_2351010001_HK1_2025_2026', '2351010001', 'HK1_2025_2026', 3.75, 17, 0),
('GPA_2351010002_HK1_2025_2026', '2351010002', 'HK1_2025_2026', 3.55, 16, 0),
('GPA_2351010003_HK1_2025_2026', '2351010003', 'HK1_2025_2026', 3.30, 16, 0),
('GPA_2351010004_HK1_2025_2026', '2351010004', 'HK1_2025_2026', 2.80, 14, 0),
('GPA_2351020001_HK1_2025_2026', '2351020001', 'HK1_2025_2026', 3.82, 18, 0),
('GPA_2351030001_HK1_2025_2026', '2351030001', 'HK1_2025_2026', 3.65, 17, 0),
('GPA_2351040001_HK1_2025_2026', '2351040001', 'HK1_2025_2026', 3.70, 16, 0),
('GPA_2351050001_HK1_2025_2026', '2351050001', 'HK1_2025_2026', 3.40, 15, 0),
('GPA_2351060001_HK1_2025_2026', '2351060001', 'HK1_2025_2026', 3.60, 16, 0),
('GPA_2351070001_HK1_2025_2026', '2351070001', 'HK1_2025_2026', 3.50, 16, 0);

-- 9. Kết quả Rèn luyện
INSERT INTO `ketquarenluyen` (`id`, `mssv`, `maHocKy`, `diemRenLuyen`, `xepLoai`) VALUES
('DRL_2351010216_HK1_2025_2026', '2351010216', 'HK1_2025_2026', 96.00, 'Xuat sac'),
('DRL_2351010001_HK1_2025_2026', '2351010001', 'HK1_2025_2026', 89.00, 'Tot'),
('DRL_2351010002_HK1_2025_2026', '2351010002', 'HK1_2025_2026', 86.00, 'Tot'),
('DRL_2351010003_HK1_2025_2026', '2351010003', 'HK1_2025_2026', 82.00, 'Tot'),
('DRL_2351010004_HK1_2025_2026', '2351010004', 'HK1_2025_2026', 78.00, 'Kha'),
('DRL_2351020001_HK1_2025_2026', '2351020001', 'HK1_2025_2026', 92.00, 'Xuat sac'),
('DRL_2351030001_HK1_2025_2026', '2351030001', 'HK1_2025_2026', 88.00, 'Tot'),
('DRL_2351040001_HK1_2025_2026', '2351040001', 'HK1_2025_2026', 90.00, 'Xuat sac'),
('DRL_2351050001_HK1_2025_2026', '2351050001', 'HK1_2025_2026', 84.00, 'Tot'),
('DRL_2351060001_HK1_2025_2026', '2351060001', 'HK1_2025_2026', 85.00, 'Tot'),
('DRL_2351070001_HK1_2025_2026', '2351070001', 'HK1_2025_2026', 80.00, 'Tot');

-- 10. Đợt xét Học bổng Cấp trường
INSERT INTO `dotxethocbong` (`maDot`, `tenDot`, `ngayBatDau`, `ngayKetThuc`, `maHocKy`, `trangThai`) VALUES
('HB_HK1_2025', 'Học bổng Khuyến khích Học tập - HK1 (2025-2026)', '2025-09-01', '2025-10-30', 'HK1_2025_2026', 'DANG_MO');

-- 11. Dynamic Rule Engine
INSERT INTO `quytachocbong` (`maQuyTac`, `maDot`, `diemTbDuoiThieu`, `diemRlToiThieu`, `soTinChiToiThieu`, `khongNoMon`, `phienBan`, `ghiChu`, `mucHocBongXuatSac`, `mucHocBongGioi`, `mucHocBongKha`) VALUES
('QT_HB_HK1_2025_V1', 'HB_HK1_2025', 2.50, 65.00, 14, 1, 1, 'Quy chế xét học bổng KKHT năm học 2025-2026 chuẩn', 10000000.00, 7000000.00, 5000000.00);

-- 12. Phân bổ Đợt xét theo Khoa
INSERT INTO `dotxethbkhoa` (`maDotXetHbKhoa`, `maDot`, `maKhoa`, `chiTieu`, `nganSachKhoa`, `hanPhanHoi`, `trangThai`, `lyDoTraVe`) VALUES
('HB_HK1_2025_CNTT', 'HB_HK1_2025', 'CNTT', 5, 45000000.00, '2025-10-25', 'CHUA_XET', NULL),
('HB_HK1_2025_QTKD', 'HB_HK1_2025', 'QTKD', 4, 35000000.00, '2025-10-25', 'CHUA_XET', NULL),
('HB_HK1_2025_KTKT', 'HB_HK1_2025', 'KTKT', 3, 25000000.00, '2025-10-25', 'CHUA_XET', NULL),
('HB_HK1_2025_TCNH', 'HB_HK1_2025', 'TCNH', 3, 25000000.00, '2025-10-25', 'CHUA_XET', NULL),
('HB_HK1_2025_KTQLC', 'HB_HK1_2025', 'KTQLC', 2, 20000000.00, '2025-10-25', 'CHUA_XET', NULL),
('HB_HK1_2025_LUAT', 'HB_HK1_2025', 'LUAT', 3, 25000000.00, '2025-10-25', 'CHUA_XET', NULL),
('HB_HK1_2025_NN', 'HB_HK1_2025', 'NN', 3, 25000000.00, '2025-10-25', 'CHUA_XET', NULL),
('HB_HK1_2025_CNSH', 'HB_HK1_2025', 'CNSH', 2, 15000000.00, '2025-10-25', 'CHUA_XET', NULL),
('HB_HK1_2025_XD', 'HB_HK1_2025', 'XD', 2, 15000000.00, '2025-10-25', 'CHUA_XET', NULL),
('HB_HK1_2025_XHH', 'HB_HK1_2025', 'XHH', 2, 15000000.00, '2025-10-25', 'CHUA_XET', NULL),
('HB_HK1_2025_DTTX', 'HB_HK1_2025', 'DTTX', 2, 15000000.00, '2025-10-25', 'CHUA_XET', NULL),
('HB_HK1_2025_KDB', 'HB_HK1_2025', 'KDB', 6, 50000000.00, '2025-10-25', 'CHUA_XET', NULL);

-- 13. Minh chứng Rèn luyện Mẫu
INSERT INTO `minhchungrenluyen` (`maMinhChung`, `tenHoatDong`, `diemDeXuat`, `fileUrl`, `moTa`, `trangThai`, `maHoSo`, `mssv`, `maHocKy`, `maNvPheDuyet`, `lyDoPhanHoi`, `ngayTao`) VALUES
('MC_2025_001', 'Giải Nhất Nghiên cứu Khoa học Sinh viên Cấp Trường 2025', 6.00, 'https://drive.google.com/minhchung_nckh_2351010216.pdf', 'Đề tài Dynamic Rule Engine trong OU-SSH Hub', 'CHO_DUYET', NULL, '2351010216', 'HK1_2025_2026', NULL, NULL, NOW()),
('MC_2025_002', 'Chiến dịch Mùa hè Xanh Trường ĐH Mở TP.HCM 2025', 4.00, 'https://drive.google.com/minhchung_mhx_2351010001.pdf', 'Giấy chứng nhận tham gia chiến dịch MHX 2025', 'DA_DUYET', NULL, '2351010001', 'HK1_2025_2026', 'NV_KHOA_CNTT', 'Minh chứng hợp lệ, cộng 4 điểm', NOW());