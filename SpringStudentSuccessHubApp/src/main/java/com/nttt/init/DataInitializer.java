package com.nttt.init;

import com.nttt.pojo.*;
import com.nttt.repositories.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final NguoiDungRepository nguoiDungRepository;
    private final KhoaRepository khoaRepository;
    private final NganhRepository nganhRepository;
    private final LopSinhHoatRepository lopSinhHoatRepository;
    private final HocKyRepository hocKyRepository;
    private final SinhVienRepository sinhVienRepository;
    private final NhanVienRepository nhanVienRepository;
    private final CanBoKhoaRepository canBoKhoaRepository;
    private final CanBoCapTruongRepository canBoCapTruongRepository;
    private final MonHocRepository monHocRepository;
    private final ChuongTrinhDaoTaoRepository chuongTrinhDaoTaoRepository;
    private final DiemHocPhanRepository diemHocPhanRepository;
    private final KetQuaHocTapRepository ketQuaHocTapRepository;
    private final KetQuaRenLuyenRepository ketQuaRenLuyenRepository;
    private final DotXetHocBongRepository dotXetHocBongRepository;
    private final QuyTacHocBongRepository quyTacHocBongRepository;
    private final DotXetHbKhoaRepository dotXetHbKhoaRepository;
    private final HoSoHocBongRepository hoSoHocBongRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            NguoiDungRepository nguoiDungRepository,
            KhoaRepository khoaRepository,
            NganhRepository nganhRepository,
            LopSinhHoatRepository lopSinhHoatRepository,
            HocKyRepository hocKyRepository,
            SinhVienRepository sinhVienRepository,
            NhanVienRepository nhanVienRepository,
            CanBoKhoaRepository canBoKhoaRepository,
            CanBoCapTruongRepository canBoCapTruongRepository,
            MonHocRepository monHocRepository,
            ChuongTrinhDaoTaoRepository chuongTrinhDaoTaoRepository,
            DiemHocPhanRepository diemHocPhanRepository,
            KetQuaHocTapRepository ketQuaHocTapRepository,
            KetQuaRenLuyenRepository ketQuaRenLuyenRepository,
            DotXetHocBongRepository dotXetHocBongRepository,
            QuyTacHocBongRepository quyTacHocBongRepository,
            DotXetHbKhoaRepository dotXetHbKhoaRepository,
            HoSoHocBongRepository hoSoHocBongRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.nguoiDungRepository = nguoiDungRepository;
        this.khoaRepository = khoaRepository;
        this.nganhRepository = nganhRepository;
        this.lopSinhHoatRepository = lopSinhHoatRepository;
        this.hocKyRepository = hocKyRepository;
        this.sinhVienRepository = sinhVienRepository;
        this.nhanVienRepository = nhanVienRepository;
        this.canBoKhoaRepository = canBoKhoaRepository;
        this.canBoCapTruongRepository = canBoCapTruongRepository;
        this.monHocRepository = monHocRepository;
        this.chuongTrinhDaoTaoRepository = chuongTrinhDaoTaoRepository;
        this.diemHocPhanRepository = diemHocPhanRepository;
        this.ketQuaHocTapRepository = ketQuaHocTapRepository;
        this.ketQuaRenLuyenRepository = ketQuaRenLuyenRepository;
        this.dotXetHocBongRepository = dotXetHocBongRepository;
        this.quyTacHocBongRepository = quyTacHocBongRepository;
        this.dotXetHbKhoaRepository = dotXetHbKhoaRepository;
        this.hoSoHocBongRepository = hoSoHocBongRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (nguoiDungRepository.count() > 0) {
            return; // Đã có dữ liệu
        }

        // 1. Khởi tạo 12 Khoa Đào tạo chuẩn
        Khoa it = khoaRepository.save(new Khoa("IT", "Khoa Công nghệ Thông tin (Information Technology)"));
        Khoa bio = khoaRepository.save(new Khoa("BIO", "Khoa Công nghệ Sinh học (Biotechnology)"));
        Khoa acc = khoaRepository.save(new Khoa("ACC", "Khoa Kế toán - Kiểm toán (Accounting & Auditing)"));
        Khoa eco = khoaRepository.save(new Khoa("ECO", "Khoa Kinh tế & Quản lý công (Economics & Public Management)"));
        Khoa soc = khoaRepository.save(new Khoa("SOC", "Khoa Khoa học Xã hội (Social Sciences)"));
        Khoa bas = khoaRepository.save(new Khoa("BAS", "Khoa Khoa học Cơ bản (Basic Sciences)"));
        Khoa law = khoaRepository.save(new Khoa("LAW", "Khoa Luật (Law)"));
        Khoa fl = khoaRepository.save(new Khoa("FL", "Khoa Ngoại ngữ (Foreign Languages)"));
        Khoa ba = khoaRepository.save(new Khoa("BA", "Khoa Quản trị Kinh doanh (Business Administration)"));
        Khoa bf = khoaRepository.save(new Khoa("BF", "Khoa Tài chính - Ngân hàng (Banking & Finance)"));
        Khoa ce = khoaRepository.save(new Khoa("CE", "Khoa Xây dựng (Civil Engineering)"));
        Khoa spe = khoaRepository.save(new Khoa("SPE", "Khoa Đào tạo Đặc biệt (Special Training / CLC)"));

        // 2. Ngành Đào tạo Chuẩn Khoa CNTT & các Khoa
        Nganh cs = nganhRepository.save(new Nganh("CS", "Khoa học Máy tính (Computer Science)", "CHUAN", it));
        Nganh itMajor = nganhRepository.save(new Nganh("IT", "Công nghệ Thông tin (Information Technology)", "CHUAN", it));
        Nganh im = nganhRepository.save(new Nganh("IM", "Hệ thống Thông tin Quản lý (Management Info Systems)", "CHUAN", it));
        Nganh ai = nganhRepository.save(new Nganh("AI", "Trí tuệ Nhân tạo (Artificial Intelligence)", "CHUAN", it));
        Nganh se = nganhRepository.save(new Nganh("SE", "Kỹ thuật Phần mềm (Software Engineering)", "CHUAN", it));

        Nganh bt = nganhRepository.save(new Nganh("BT", "Công nghệ Sinh học (Biotechnology)", "CHUAN", bio));
        Nganh ft = nganhRepository.save(new Nganh("FT", "Công nghệ Thực phẩm (Food Technology)", "CHUAN", bio));
        Nganh acMajor = nganhRepository.save(new Nganh("AC", "Kế toán (Accounting)", "CHUAN", acc));
        Nganh au = nganhRepository.save(new Nganh("AU", "Kiểm toán (Auditing)", "CHUAN", acc));
        Nganh ec = nganhRepository.save(new Nganh("EC", "Kinh tế (Economics)", "CHUAN", eco));
        Nganh pm = nganhRepository.save(new Nganh("PM", "Quản lý Công (Public Management)", "CHUAN", eco));
        Nganh sc = nganhRepository.save(new Nganh("SC", "Xã hội học (Sociology)", "CHUAN", soc));
        Nganh sw = nganhRepository.save(new Nganh("SW", "Công tác Xã hội (Social Work)", "CHUAN", soc));
        Nganh sa = nganhRepository.save(new Nganh("SA", "Đông Nam Á học (Southeast Asian Studies)", "CHUAN", soc));
        Nganh ps = nganhRepository.save(new Nganh("PS", "Tâm lý học (Psychology)", "CHUAN", soc));
        Nganh ds = nganhRepository.save(new Nganh("DS", "Khoa học Dữ liệu (Data Science)", "CHUAN", bas));
        Nganh la = nganhRepository.save(new Nganh("LA", "Luật (Law)", "CHUAN", law));
        Nganh bl = nganhRepository.save(new Nganh("BL", "Luật Kinh tế (Economic Law)", "CHUAN", law));
        Nganh el = nganhRepository.save(new Nganh("EL", "Ngôn ngữ Anh (English Language)", "CHUAN", fl));
        Nganh jl = nganhRepository.save(new Nganh("JL", "Ngôn ngữ Nhật (Japanese Language)", "CHUAN", fl));
        Nganh kl = nganhRepository.save(new Nganh("KL", "Ngôn ngữ Hàn Quốc (Korean Language)", "CHUAN", fl));
        Nganh cl = nganhRepository.save(new Nganh("CL", "Ngôn ngữ Trung Quốc (Chinese Language)", "CHUAN", fl));
        Nganh baMajor = nganhRepository.save(new Nganh("BA", "Quản trị Kinh doanh (Business Administration)", "CHUAN", ba));
        Nganh mk = nganhRepository.save(new Nganh("MK", "Marketing", "CHUAN", ba));
        Nganh to = nganhRepository.save(new Nganh("TO", "Du lịch (Tourism)", "CHUAN", ba));
        Nganh hm = nganhRepository.save(new Nganh("HM", "Quản trị Khách sạn (Hospitality Management)", "CHUAN", ba));
        Nganh ib = nganhRepository.save(new Nganh("IB", "Kinh doanh Quốc tế (International Business)", "CHUAN", ba));
        Nganh lg = nganhRepository.save(new Nganh("LG", "Logistics & Chuỗi cung ứng (Supply Chain)", "CHUAN", ba));
        Nganh fbMajor = nganhRepository.save(new Nganh("FB", "Tài chính - Ngân hàng (Finance & Banking)", "CHUAN", bf));
        Nganh tf = nganhRepository.save(new Nganh("TF", "Công nghệ Tài chính (Fintech)", "CHUAN", bf));
        Nganh isMajor = nganhRepository.save(new Nganh("IS", "Bảo hiểm (Insurance)", "CHUAN", bf));
        Nganh ceMajor = nganhRepository.save(new Nganh("CE", "Kỹ thuật Xây dựng (Civil Engineering)", "CHUAN", ce));
        Nganh cm = nganhRepository.save(new Nganh("CM", "Quản lý Xây dựng (Construction Management)", "CHUAN", ce));

        // 13 Ngành Chất lượng cao / Đặc biệt
        Nganh csc = nganhRepository.save(new Nganh("CSC", "Khoa học Máy tính (Chất lượng cao)", "CHAT_LUONG_CAO", spe));
        Nganh itc = nganhRepository.save(new Nganh("ITC", "Công nghệ Thông tin (Chất lượng cao)", "CHAT_LUONG_CAO", spe));
        Nganh bac = nganhRepository.save(new Nganh("BAC", "Quản trị Kinh doanh (Chất lượng cao)", "CHAT_LUONG_CAO", spe));
        Nganh fbc = nganhRepository.save(new Nganh("FBC", "Tài chính - Ngân hàng (Chất lượng cao)", "CHAT_LUONG_CAO", spe));
        Nganh accc = nganhRepository.save(new Nganh("ACC_C", "Kế toán (Chất lượng cao)", "CHAT_LUONG_CAO", spe));
        Nganh auc = nganhRepository.save(new Nganh("AUC", "Kiểm toán (Chất lượng cao)", "CHAT_LUONG_CAO", spe));
        Nganh lac = nganhRepository.save(new Nganh("LAC", "Luật Kinh tế (Chất lượng cao)", "CHAT_LUONG_CAO", spe));
        Nganh btc = nganhRepository.save(new Nganh("BTC", "Công nghệ Sinh học (Chất lượng cao)", "CHAT_LUONG_CAO", spe));
        Nganh cec = nganhRepository.save(new Nganh("CEC", "Kỹ thuật Xây dựng (Chất lượng cao)", "CHAT_LUONG_CAO", spe));
        Nganh elc = nganhRepository.save(new Nganh("ELC", "Ngôn ngữ Anh (Chất lượng cao)", "CHAT_LUONG_CAO", spe));
        Nganh clc = nganhRepository.save(new Nganh("CLC", "Ngôn ngữ Trung Quốc (Chất lượng cao)", "CHAT_LUONG_CAO", spe));
        Nganh jkc = nganhRepository.save(new Nganh("JKC", "Ngôn ngữ Nhật (Chất lượng cao)", "CHAT_LUONG_CAO", spe));
        Nganh ecc = nganhRepository.save(new Nganh("ECC", "Kinh tế (Chất lượng cao)", "CHAT_LUONG_CAO", spe));

        // 3. Lớp Sinh hoạt 3 Khóa K23, K24, K25
        // K23 (2023-2027)
        LopSinhHoat lopCs23 = lopSinhHoatRepository.save(new LopSinhHoat("DH23CS01", "Lớp Khoa học Máy tính 2023 - 01", "K23 (2023-2027)", it, cs));
        LopSinhHoat lopIt23 = lopSinhHoatRepository.save(new LopSinhHoat("DH23IT01", "Lớp Công nghệ Thông tin 2023 - 01", "K23 (2023-2027)", it, itMajor));
        LopSinhHoat lopIm23 = lopSinhHoatRepository.save(new LopSinhHoat("DH23IM01", "Lớp Hệ thống Thông tin Quản lý 2023 - 01", "K23 (2023-2027)", it, im));
        LopSinhHoat lopCsClc23 = lopSinhHoatRepository.save(new LopSinhHoat("DH23CS01C", "Lớp KHMT CLC 2023 - 01", "K23 (2023-2027)", spe, csc));

        // K24 (2024-2028)
        LopSinhHoat lopAi24 = lopSinhHoatRepository.save(new LopSinhHoat("DH24AI01", "Lớp Trí tuệ Nhân tạo 2024 - 01", "K24 (2024-2028)", it, ai));
        LopSinhHoat lopCs24 = lopSinhHoatRepository.save(new LopSinhHoat("DH24CS01", "Lớp Khoa học Máy tính 2024 - 01", "K24 (2024-2028)", it, cs));
        LopSinhHoat lopIt24 = lopSinhHoatRepository.save(new LopSinhHoat("DH24IT01", "Lớp Công nghệ Thông tin 2024 - 01", "K24 (2024-2028)", it, itMajor));
        LopSinhHoat lopIt24_2 = lopSinhHoatRepository.save(new LopSinhHoat("DH24IT02", "Lớp Công nghệ Thông tin 2024 - 02", "K24 (2024-2028)", it, itMajor));
        LopSinhHoat lopIm24 = lopSinhHoatRepository.save(new LopSinhHoat("DH24IM01", "Lớp Hệ thống Thông tin Quản lý 2024 - 01", "K24 (2024-2028)", it, im));
        LopSinhHoat lopCsClc24 = lopSinhHoatRepository.save(new LopSinhHoat("DH24CS01C", "Lớp KHMT CLC 2024 - 01", "K24 (2024-2028)", spe, csc));

        // K25 (2025-2029)
        LopSinhHoat lopAi25 = lopSinhHoatRepository.save(new LopSinhHoat("DH25AI01", "Lớp Trí tuệ Nhân tạo 2025 - 01", "K25 (2025-2029)", it, ai));
        LopSinhHoat lopCs25 = lopSinhHoatRepository.save(new LopSinhHoat("DH25CS01", "Lớp Khoa học Máy tính 2025 - 01", "K25 (2025-2029)", it, cs));
        LopSinhHoat lopIt25 = lopSinhHoatRepository.save(new LopSinhHoat("DH25IT01", "Lớp Công nghệ Thông tin 2025 - 01", "K25 (2025-2029)", it, itMajor));
        LopSinhHoat lopIm25 = lopSinhHoatRepository.save(new LopSinhHoat("DH25IM01", "Lớp Hệ thống Thông tin Quản lý 2025 - 01", "K25 (2025-2029)", it, im));
        LopSinhHoat lopSe25 = lopSinhHoatRepository.save(new LopSinhHoat("DH25SE01", "Lớp Kỹ thuật Phần mềm 2025 - 01", "K25 (2025-2029)", it, se));
        LopSinhHoat lopCsClc25 = lopSinhHoatRepository.save(new LopSinhHoat("DH25CS01C", "Lớp KHMT CLC 2025 - 01", "K25 (2025-2029)", spe, csc));

        // 4. Danh sách Học kỳ (9 học kỳ)
        List<HocKy> hocKyList = new ArrayList<>();
        hocKyList.add(hocKyRepository.save(new HocKy("HK1_2023_2024", "2023-2024", "Học kỳ 1 (2023-2024)")));
        hocKyList.add(hocKyRepository.save(new HocKy("HK2_2023_2024", "2023-2024", "Học kỳ 2 (2023-2024)")));
        hocKyList.add(hocKyRepository.save(new HocKy("HK3_2023_2024", "2023-2024", "Học kỳ 3 (2023-2024)")));
        hocKyList.add(hocKyRepository.save(new HocKy("HK1_2024_2025", "2024-2025", "Học kỳ 1 (2024-2025)")));
        hocKyList.add(hocKyRepository.save(new HocKy("HK2_2024_2025", "2024-2025", "Học kỳ 2 (2024-2025)")));
        hocKyList.add(hocKyRepository.save(new HocKy("HK3_2024_2025", "2024-2025", "Học kỳ 3 (2024-2025)")));
        HocKy hk1_2526 = hocKyRepository.save(new HocKy("HK1_2025_2026", "2025-2026", "Học kỳ 1 (2025-2026)"));
        hocKyList.add(hk1_2526);
        hocKyList.add(hocKyRepository.save(new HocKy("HK2_2025_2026", "2025-2026", "Học kỳ 2 (2025-2026)")));
        hocKyList.add(hocKyRepository.save(new HocKy("HK3_2025_2026", "2025-2026", "Học kỳ 3 (2025-2026)")));

        // 5. TOÀN BỘ DANH MỤC MÔN HỌC CHUẨN (Theo QĐ 561/QĐ-ĐHM ngày 12/03/2024 - CTĐT Khoa CNTT)
        BigDecimal donGiaChuan = new BigDecimal("650000"); // 650.000đ / 1 tín chỉ
        BigDecimal donGiaClc = new BigDecimal("1450000");  // 1.450.000đ / 1 tín chỉ CLC

        // Học kỳ 1 & Đại cương
        MonHoc mMATH1315 = monHocRepository.save(new MonHoc("MATH1315", "Xác suất và Thống kê", 3, 45, 15, donGiaChuan, bas));
        MonHoc mGENG1311 = monHocRepository.save(new MonHoc("GENG1311", "Tiếng Anh Nâng cao 1", 3, 45, 0, donGiaChuan, fl));
        MonHoc mGENG1312 = monHocRepository.save(new MonHoc("GENG1312", "Tiếng Anh Nâng cao 2", 3, 45, 0, donGiaChuan, fl));
        MonHoc mITEC1401 = monHocRepository.save(new MonHoc("ITEC1401", "Nhập môn Tin học", 3, 30, 30, donGiaChuan, it));
        MonHoc mITEC1505 = monHocRepository.save(new MonHoc("ITEC1505", "Cơ sở Lập trình C/C++", 4, 45, 30, donGiaChuan, it));

        // Học kỳ 2
        MonHoc mMATH1314 = monHocRepository.save(new MonHoc("MATH1314", "Giải tích", 3, 45, 15, donGiaChuan, bas));
        MonHoc mGENG1313 = monHocRepository.save(new MonHoc("GENG1313", "Tiếng Anh Nâng cao 3", 3, 45, 0, donGiaChuan, fl));
        MonHoc mGENG1314 = monHocRepository.save(new MonHoc("GENG1314", "Tiếng Anh Nâng cao 4", 3, 45, 0, donGiaChuan, fl));
        MonHoc mITEC1504 = monHocRepository.save(new MonHoc("ITEC1504", "Kỹ thuật Lập trình", 4, 45, 30, donGiaChuan, it));
        MonHoc mITEC1310 = monHocRepository.save(new MonHoc("ITEC1310", "Hệ điều hành và Kiến trúc Máy tính", 3, 35, 10, donGiaChuan, it));

        // Học kỳ 3
        MonHoc mMATH1313 = monHocRepository.save(new MonHoc("MATH1313", "Đại số Tuyến tính", 3, 45, 15, donGiaChuan, bas));
        MonHoc mGENG1315 = monHocRepository.save(new MonHoc("GENG1315", "Tiếng Anh Nâng cao 5", 3, 45, 0, donGiaChuan, fl));
        MonHoc mITEC1427 = monHocRepository.save(new MonHoc("ITEC1427", "Cấu trúc Dữ liệu và Thuật giải 1", 4, 45, 30, donGiaChuan, it));
        MonHoc mITEC1404 = monHocRepository.save(new MonHoc("ITEC1404", "Ứng dụng Web", 3, 30, 30, donGiaChuan, it));
        MonHoc mITEC2502 = monHocRepository.save(new MonHoc("ITEC2502", "Cơ sở Dữ liệu Quan hệ", 4, 45, 30, donGiaChuan, it));

        // Học kỳ 4
        MonHoc mPOLI1304 = monHocRepository.save(new MonHoc("POLI1304", "Triết học Mác - Lênin", 3, 45, 0, donGiaChuan, soc));
        MonHoc mITEC1328 = monHocRepository.save(new MonHoc("ITEC1328", "Cấu trúc Dữ liệu và Thuật giải 2", 3, 30, 30, donGiaChuan, it));
        MonHoc mITEC2503 = monHocRepository.save(new MonHoc("ITEC2503", "Mạng Máy tính", 4, 45, 30, donGiaChuan, it));
        MonHoc mMATH2402 = monHocRepository.save(new MonHoc("MATH2402", "Toán Rời rạc", 4, 60, 0, donGiaChuan, bas));

        // Học kỳ 5
        MonHoc mPOLI1205 = monHocRepository.save(new MonHoc("POLI1205", "Kinh tế Chính trị Mác - Lênin", 2, 30, 0, donGiaChuan, soc));
        MonHoc mPOLI1206 = monHocRepository.save(new MonHoc("POLI1206", "Chủ nghĩa Xã hội Khoa học", 2, 30, 0, donGiaChuan, soc));
        MonHoc mITEC2504 = monHocRepository.save(new MonHoc("ITEC2504", "Lập trình Hướng đối tượng (Java)", 4, 45, 30, donGiaChuan, it));
        MonHoc mITEC3401 = monHocRepository.save(new MonHoc("ITEC3401", "Phân tích Thiết kế Hệ thống", 4, 60, 0, donGiaChuan, it));
        MonHoc mITEC3201 = monHocRepository.save(new MonHoc("ITEC3201", "Kỹ năng Nghề nghiệp", 2, 30, 0, donGiaChuan, it));

        // Học kỳ 6 & Chuyên ngành
        MonHoc mPOLI1207 = monHocRepository.save(new MonHoc("POLI1207", "Lịch sử Đảng Cộng sản Việt Nam", 2, 30, 0, donGiaChuan, soc));
        MonHoc mPOLI1208 = monHocRepository.save(new MonHoc("POLI1208", "Tư tưởng Hồ Chí Minh", 2, 30, 0, donGiaChuan, soc));
        MonHoc mITEC1311 = monHocRepository.save(new MonHoc("ITEC1311", "Mẫu Thiết kế Hướng đối tượng", 3, 30, 30, donGiaChuan, it));
        MonHoc mITEC3413 = monHocRepository.save(new MonHoc("ITEC3413", "Trí tuệ Nhân tạo", 3, 30, 30, donGiaChuan, it));
        MonHoc mITEC4402 = monHocRepository.save(new MonHoc("ITEC4402", "Quản trị Hệ Cơ sở Dữ liệu", 3, 30, 30, donGiaChuan, it));
        MonHoc mITEC4409 = monHocRepository.save(new MonHoc("ITEC4409", "Công nghệ Phần mềm", 3, 30, 30, donGiaChuan, it));
        MonHoc mITEC3421 = monHocRepository.save(new MonHoc("ITEC3421", "Các Công nghệ Lập trình Hiện đại", 3, 30, 30, donGiaChuan, it));
        MonHoc mITEC2314 = monHocRepository.save(new MonHoc("ITEC2314", "Máy học (Machine Learning)", 3, 30, 30, donGiaChuan, it));
        MonHoc mITEC4415 = monHocRepository.save(new MonHoc("ITEC4415", "Kiểm thử Phần mềm", 3, 30, 30, donGiaChuan, it));
        MonHoc mITEC2302 = monHocRepository.save(new MonHoc("ITEC2302", "Phát triển Hệ thống Web", 3, 30, 30, donGiaChuan, it));
        MonHoc mGLAW1315 = monHocRepository.save(new MonHoc("GLAW1315", "Pháp luật Đại cương", 3, 45, 0, donGiaChuan, law));
        MonHoc mITEC4401 = monHocRepository.save(new MonHoc("ITEC4401", "Đồ án Ngành", 4, 0, 120, donGiaChuan, it));
        MonHoc mITEC4899 = monHocRepository.save(new MonHoc("ITEC4899", "Thực tập Tốt nghiệp", 4, 0, 120, donGiaChuan, it));
        MonHoc mITEC4699 = monHocRepository.save(new MonHoc("ITEC4699", "Khóa luận Tốt nghiệp", 6, 0, 180, donGiaChuan, it));

        // Môn học CLC
        MonHoc mCSC101 = monHocRepository.save(new MonHoc("CSC101", "Advanced Programming (CLC)", 4, 45, 30, donGiaClc, spe));
        MonHoc mCSC201 = monHocRepository.save(new MonHoc("CSC201", "Data Structures & Algorithms (CLC)", 4, 45, 30, donGiaClc, spe));
        MonHoc mCSC301 = monHocRepository.save(new MonHoc("CSC301", "Web Application Development (CLC)", 3, 30, 30, donGiaClc, spe));
        MonHoc mCSC401 = monHocRepository.save(new MonHoc("CSC401", "Database Systems (CLC)", 4, 45, 30, donGiaClc, spe));
        MonHoc mCSC501 = monHocRepository.save(new MonHoc("CSC501", "Artificial Intelligence (CLC)", 3, 30, 30, donGiaClc, spe));

        // 6. Lưu Khung Chương trình Đào tạo (ChuongTrinhDaoTao) chuẩn 11 học kỳ
        saveCurriculum(cs, mMATH1315, 1, "BAT_BUOC", "CHUAN");
        saveCurriculum(cs, mGENG1311, 1, "BAT_BUOC", "CHUAN");
        saveCurriculum(cs, mGENG1312, 1, "BAT_BUOC", "CHUAN");
        saveCurriculum(cs, mITEC1401, 1, "BAT_BUOC", "CHUAN");
        saveCurriculum(cs, mITEC1505, 1, "BAT_BUOC", "CHUAN");

        saveCurriculum(cs, mMATH1314, 2, "BAT_BUOC", "CHUAN");
        saveCurriculum(cs, mGENG1313, 2, "BAT_BUOC", "CHUAN");
        saveCurriculum(cs, mGENG1314, 2, "BAT_BUOC", "CHUAN");
        saveCurriculum(cs, mITEC1504, 2, "BAT_BUOC", "CHUAN");
        saveCurriculum(cs, mITEC1310, 2, "BAT_BUOC", "CHUAN");

        saveCurriculum(cs, mMATH1313, 3, "BAT_BUOC", "CHUAN");
        saveCurriculum(cs, mGENG1315, 3, "BAT_BUOC", "CHUAN");
        saveCurriculum(cs, mITEC1427, 3, "BAT_BUOC", "CHUAN");
        saveCurriculum(cs, mITEC1404, 3, "BAT_BUOC", "CHUAN");
        saveCurriculum(cs, mITEC2502, 3, "BAT_BUOC", "CHUAN");

        saveCurriculum(cs, mPOLI1304, 4, "BAT_BUOC", "CHUAN");
        saveCurriculum(cs, mITEC1328, 4, "BAT_BUOC", "CHUAN");
        saveCurriculum(cs, mITEC2503, 4, "BAT_BUOC", "CHUAN");
        saveCurriculum(cs, mMATH2402, 4, "BAT_BUOC", "CHUAN");

        saveCurriculum(cs, mPOLI1205, 5, "BAT_BUOC", "CHUAN");
        saveCurriculum(cs, mPOLI1206, 5, "BAT_BUOC", "CHUAN");
        saveCurriculum(cs, mITEC2504, 5, "BAT_BUOC", "CHUAN");
        saveCurriculum(cs, mITEC3401, 5, "BAT_BUOC", "CHUAN");
        saveCurriculum(cs, mITEC3201, 5, "BAT_BUOC", "CHUAN");
        saveCurriculum(cs, mITEC4402, 5, "BAT_BUOC", "CHUAN");

        saveCurriculum(cs, mPOLI1207, 6, "BAT_BUOC", "CHUAN");
        saveCurriculum(cs, mPOLI1208, 6, "BAT_BUOC", "CHUAN");
        saveCurriculum(cs, mITEC1311, 6, "BAT_BUOC", "CHUAN");
        saveCurriculum(cs, mITEC3413, 6, "BAT_BUOC", "CHUAN");

        saveCurriculum(cs, mITEC4409, 7, "TU_CHON", "CHUAN");
        saveCurriculum(cs, mITEC3421, 7, "TU_CHON", "CHUAN");
        saveCurriculum(cs, mITEC2314, 8, "BAT_BUOC", "CHUAN");
        saveCurriculum(cs, mITEC4415, 8, "TU_CHON", "CHUAN");
        saveCurriculum(cs, mITEC2302, 8, "TU_CHON", "CHUAN");
        saveCurriculum(cs, mGLAW1315, 9, "BAT_BUOC", "CHUAN");
        saveCurriculum(cs, mITEC4401, 9, "BAT_BUOC", "CHUAN");
        saveCurriculum(cs, mITEC4899, 10, "BAT_BUOC", "CHUAN");
        saveCurriculum(cs, mITEC4699, 11, "BAT_BUOC", "CHUAN");

        // CTĐT Ngành CNTT, KTPM & CLC
        saveCurriculum(itMajor, mITEC1401, 1, "BAT_BUOC", "CHUAN");
        saveCurriculum(itMajor, mITEC1505, 1, "BAT_BUOC", "CHUAN");
        saveCurriculum(itMajor, mMATH1315, 1, "BAT_BUOC", "CHUAN");
        saveCurriculum(itMajor, mITEC1427, 2, "BAT_BUOC", "CHUAN");
        saveCurriculum(itMajor, mITEC2502, 2, "BAT_BUOC", "CHUAN");
        saveCurriculum(itMajor, mITEC2503, 3, "BAT_BUOC", "CHUAN");
        saveCurriculum(itMajor, mITEC2504, 3, "BAT_BUOC", "CHUAN");

        saveCurriculum(se, mITEC1505, 1, "BAT_BUOC", "CHUAN");
        saveCurriculum(se, mITEC1504, 1, "BAT_BUOC", "CHUAN");
        saveCurriculum(se, mITEC1427, 2, "BAT_BUOC", "CHUAN");
        saveCurriculum(se, mITEC4409, 2, "BAT_BUOC", "CHUAN");

        saveCurriculum(csc, mCSC101, 1, "BAT_BUOC", "CHAT_LUONG_CAO");
        saveCurriculum(csc, mCSC201, 2, "BAT_BUOC", "CHAT_LUONG_CAO");
        saveCurriculum(csc, mCSC301, 3, "BAT_BUOC", "CHAT_LUONG_CAO");
        saveCurriculum(csc, mCSC401, 4, "BAT_BUOC", "CHAT_LUONG_CAO");
        saveCurriculum(csc, mCSC501, 5, "BAT_BUOC", "CHAT_LUONG_CAO");

        // 7. Cán bộ Quản trị & Cán bộ Cấp Trường
        NguoiDung uAdmin = nguoiDungRepository.save(NguoiDung.builder()
                .tenDangNhap("admin")
                .matKhau(passwordEncoder.encode("admin123"))
                .matKhauHienThi("admin123")
                .hoTen("Quản trị viên Hệ thống")
                .email("admin@ou.edu.vn")
                .soDienThoai("0909123456")
                .vaiTro("ROLE_ADMIN")
                .trangThai("HOAT_DONG")
                .build());

        NguoiDung uTruong = nguoiDungRepository.save(NguoiDung.builder()
                .tenDangNhap("captruong")
                .matKhau(passwordEncoder.encode("truong123"))
                .matKhauHienThi("truong123")
                .hoTen("ThS. Phạm Minh Tuấn")
                .email("tuan.pm@ou.edu.vn")
                .soDienThoai("0918123456")
                .vaiTro("ROLE_CAN_BO_TRUONG")
                .trangThai("HOAT_DONG")
                .build());

        NhanVien nvTruong = nhanVienRepository.save(NhanVien.builder()
                .maNv("NV_TRUONG_01")
                .nguoiDung(uTruong)
                .chucVu("Trưởng phòng Công tác Sinh viên")
                .donViCongTac("Phòng Công tác Sinh viên")
                .build());

        canBoCapTruongRepository.save(CanBoCapTruong.builder()
                .maNv(nvTruong.getMaNv())
                .nhanVien(nvTruong)
                .phongBan("Phòng Công tác Sinh viên")
                .capPheDuyet("Cấp Trường")
                .build());

        // 8. Cán bộ Cấp Khoa ĐẦY ĐỦ 12 KHOA
        createCanBoKhoa("cbk_it", "ThS. Lê Hoàng Nam", "cbk.it@ou.edu.vn", "0987654301", it, "NV_KHOA_IT", "Trợ lý Giáo vụ & CTSV Khoa CNTT", "DH23CS01, DH23IT01, DH24CS01, DH24IT01, DH24IT02, DH25CS01, DH25IT01, DH25SE01");
        createCanBoKhoa("cbk_bio", "ThS. Nguyễn Thị Thu Trang", "cbk.bio@ou.edu.vn", "0987654302", bio, "NV_KHOA_BIO", "Trợ lý Giáo vụ & CTSV Khoa CNSH", "DH23BT01, DH23BT02, DH23FT01");
        createCanBoKhoa("cbk_acc", "ThS. Trần Văn Hưng", "cbk.acc@ou.edu.vn", "0987654303", acc, "NV_KHOA_ACC", "Trợ lý Giáo vụ & CTSV Khoa KT-KT", "DH23AC01, DH23AC02, DH23AU01");
        createCanBoKhoa("cbk_eco", "ThS. Phạm Ngọc Mai", "cbk.eco@ou.edu.vn", "0987654304", eco, "NV_KHOA_ECO", "Trợ lý Giáo vụ & CTSV Khoa KT&QLC", "DH23EC01, DH23EC02, DH23PM01");
        createCanBoKhoa("cbk_soc", "ThS. Đỗ Minh Quân", "cbk.soc@ou.edu.vn", "0987654305", soc, "NV_KHOA_SOC", "Trợ lý Giáo vụ & CTSV Khoa KHXH", "DH23SC01, DH23SW01, DH23SA01, DH23PS01");
        createCanBoKhoa("cbk_bas", "ThS. Huỳnh Quốc Bảo", "cbk.bas@ou.edu.vn", "0987654306", bas, "NV_KHOA_BAS", "Trợ lý Giáo vụ & CTSV Khoa KHCB", "DH23DS01, DH24DS01");
        createCanBoKhoa("cbk_law", "ThS. Vũ Thị Bích Ngọc", "cbk.law@ou.edu.vn", "0987654307", law, "NV_KHOA_LAW", "Trợ lý Giáo vụ & CTSV Khoa Luật", "DH23LA01, DH23BL01");
        createCanBoKhoa("cbk_fl", "ThS. Bùi Đình Trọng", "cbk.fl@ou.edu.vn", "0987654308", fl, "NV_KHOA_FL", "Trợ lý Giáo vụ & CTSV Khoa Ngoại ngữ", "DH23EL01, DH23JL01, DH23KL01, DH23CL01");
        createCanBoKhoa("cbk_ba", "ThS. Phan Thanh Tùng", "cbk.ba@ou.edu.vn", "0987654309", ba, "NV_KHOA_BA", "Trợ lý Giáo vụ & CTSV Khoa QTKD", "DH23BA01, DH23MK01, DH23TO01, DH23HM01, DH23IB01, DH23LG01");
        createCanBoKhoa("cbk_bf", "ThS. Trương Hoài Phương", "cbk.bf@ou.edu.vn", "0987654310", bf, "NV_KHOA_BF", "Trợ lý Giáo vụ & CTSV Khoa TC-NH", "DH23FB01, DH23FB02, DH23TF01, DH23IS01");
        createCanBoKhoa("cbk_ce", "ThS. Nguyễn Đức Long", "cbk.ce@ou.edu.vn", "0987654311", ce, "NV_KHOA_CE", "Trợ lý Giáo vụ & CTSV Khoa Xây dựng", "DH23CE01, DH23CE02, DH23CM01");
        createCanBoKhoa("cbk_spe", "ThS. Hoàng Diễm My", "cbk.spe@ou.edu.vn", "0987654312", spe, "NV_KHOA_SPE", "Trợ lý Giáo vụ & CTSV Khoa Đào tạo Đặc biệt", "DH23CS01C, DH24CS01C, DH25CS01C, DH23BA01C, DH23AC01C");

        // 9.1. Sinh viên KHÓA 2023 (K23: 2023-2027)
        SinhVien svTrinh = createStudentWithFullHistory("2351010216", "092305006276", "Nguyễn Thị Tuyết Trinh", "2351010216trinh@ou.edu.vn", "0934112233", "Nữ", lopCs23, hocKyList,
                new double[]{3.85, 3.90, 3.80, 3.92, 3.94, 4.00, 3.95, 3.91, 3.94},
                new double[]{92, 94, 90, 95, 95, 91, 96, 95, 94});

        SinhVien svAn = createStudentWithFullHistory("2351010001", "079205001111", "Trần Bảo An", "2351010001an@ou.edu.vn", "0934112234", "Nam", lopCs23, hocKyList,
                new double[]{3.65, 3.70, 3.60, 3.72, 3.70, 3.65, 3.75, 3.80, 3.70},
                new double[]{86, 88, 85, 87, 88, 85, 89, 91, 88});

        SinhVien svBinh = createStudentWithFullHistory("2351010002", "079305002222", "Lê Khánh Bình", "2351010002binh@ou.edu.vn", "0934112235", "Nữ", lopIt23, hocKyList,
                new double[]{3.50, 3.60, 3.55, 3.65, 3.68, 3.55, 3.60, 3.75, 3.65},
                new double[]{85, 86, 84, 88, 87, 85, 86, 89, 86});

        SinhVien svCuong = createStudentWithFullHistory("2351010003", "079205003333", "Phạm Quốc Cường", "2351010003cuong@ou.edu.vn", "0934112236", "Nam", lopIt23, hocKyList,
                new double[]{3.40, 3.45, 3.50, 3.55, 3.52, 3.45, 3.50, 3.60, 3.50},
                new double[]{80, 82, 85, 84, 83, 80, 82, 85, 82});

        SinhVien svHung = createStudentWithFullHistory("2351020001", "079205005555", "Vũ Nam Hùng", "2351020001hung@ou.edu.vn", "0934112238", "Nam", lopCsClc23, hocKyList,
                new double[]{3.30, 3.35, 3.40, 3.45, 3.42, 3.35, 3.40, 3.50, 3.40},
                new double[]{78, 80, 82, 80, 81, 78, 80, 82, 80});

        // 9.2. Sinh viên KHÓA 2024 (K24: 2024-2028)
        SinhVien svNam = createStudentWithFullHistory("2451010001", "079206001111", "Hoàng Nhật Nam", "2451010001nam@ou.edu.vn", "0934223344", "Nam", lopCs24, hocKyList,
                new double[]{0, 0, 0, 3.82, 3.86, 3.75, 3.90, 3.88, 3.85},
                new double[]{0, 0, 0, 91, 93, 88, 94, 92, 90});

        SinhVien svDang = createStudentWithFullHistory("2451010002", "079206002222", "Trương Minh Đăng", "2451010002dang@ou.edu.vn", "0934223345", "Nam", lopIt24, hocKyList,
                new double[]{0, 0, 0, 3.68, 3.72, 3.65, 3.76, 3.70, 3.74},
                new double[]{0, 0, 0, 87, 89, 85, 88, 86, 88});

        SinhVien svLinh = createStudentWithFullHistory("2451010003", "079306003333", "Hoàng Mỹ Linh", "2451010003linh@ou.edu.vn", "0934223346", "Nữ", lopIt24_2, hocKyList,
                new double[]{0, 0, 0, 3.75, 3.80, 3.70, 3.85, 3.90, 3.88},
                new double[]{0, 0, 0, 88, 90, 86, 92, 91, 93});

        SinhVien svYen = createStudentWithFullHistory("2451010004", "079306004444", "Lê Hải Yến", "2451010004yen@ou.edu.vn", "0934223347", "Nữ", lopCsClc24, hocKyList,
                new double[]{0, 0, 0, 3.70, 3.75, 3.72, 3.78, 3.80, 3.76},
                new double[]{0, 0, 0, 89, 90, 87, 91, 92, 90});

        // 9.3. Sinh viên KHÓA 2025 (K25: 2025-2029)
        SinhVien svGiaHung = createStudentWithFullHistory("2551010001", "079207001111", "Trần Gia Hưng", "2551010001hung@ou.edu.vn", "0934334455", "Nam", lopCs25, hocKyList,
                new double[]{0, 0, 0, 0, 0, 0, 3.88, 3.85, 3.80},
                new double[]{0, 0, 0, 0, 0, 0, 93, 90, 88});

        SinhVien svQuyen = createStudentWithFullHistory("2551010002", "079307002222", "Võ Thục Quyên", "2551010002quyen@ou.edu.vn", "0934334456", "Nữ", lopIt25, hocKyList,
                new double[]{0, 0, 0, 0, 0, 0, 3.65, 3.70, 3.68},
                new double[]{0, 0, 0, 0, 0, 0, 86, 88, 85});

        SinhVien svLong = createStudentWithFullHistory("2551010003", "079207003333", "Đỗ Hoàng Long", "2551010003long@ou.edu.vn", "0934334457", "Nam", lopSe25, hocKyList,
                new double[]{0, 0, 0, 0, 0, 0, 3.52, 3.55, 3.50},
                new double[]{0, 0, 0, 0, 0, 0, 84, 85, 82});

        SinhVien svAnh = createStudentWithFullHistory("2551010004", "079307004444", "Phạm Ngọc Ánh", "2551010004anh@ou.edu.vn", "0934334458", "Nữ", lopCsClc25, hocKyList,
                new double[]{0, 0, 0, 0, 0, 0, 3.75, 3.80, 3.72},
                new double[]{0, 0, 0, 0, 0, 0, 90, 92, 88});

        // 10. Seed Bảng điểm chi tiết từng Môn học (DiemHocPhan) theo chuẩn CTĐT cho HK1 2025-2026
        // K23 - HK5: POLI1205, POLI1206, ITEC2504, ITEC3401, ITEC3201, ITEC4402 (Tổng 18 TC)
        createSemesterGradesForStudent(svTrinh, hk1_2526, List.of(
                new Object[]{mPOLI1205, 10.0, 9.5, 9.5, 9.6, 4.0, "A+"},
                new Object[]{mPOLI1206, 9.5, 9.5, 9.0, 9.2, 4.0, "A+"},
                new Object[]{mITEC2504, 10.0, 9.5, 10.0, 9.9, 4.0, "A+"},
                new Object[]{mITEC3401, 10.0, 9.0, 9.5, 9.4, 4.0, "A+"},
                new Object[]{mITEC3201, 9.5, 10.0, 9.5, 9.7, 4.0, "A+"},
                new Object[]{mITEC4402, 9.5, 9.5, 9.0, 9.2, 4.0, "A+"}
        ));

        createSemesterGradesForStudent(svAn, hk1_2526, List.of(
                new Object[]{mPOLI1205, 9.0, 8.5, 8.5, 8.6, 3.5, "B+"},
                new Object[]{mPOLI1206, 8.5, 9.0, 8.5, 8.7, 3.5, "B+"},
                new Object[]{mITEC2504, 9.0, 8.5, 9.0, 8.9, 3.5, "B+"},
                new Object[]{mITEC3401, 9.0, 9.0, 8.0, 8.4, 3.5, "B+"},
                new Object[]{mITEC3201, 9.5, 9.0, 8.5, 8.8, 3.5, "B+"},
                new Object[]{mITEC4402, 8.5, 8.5, 8.5, 8.5, 3.5, "B+"}
        ));

        createSemesterGradesForStudent(svBinh, hk1_2526, List.of(
                new Object[]{mPOLI1205, 9.0, 8.5, 8.5, 8.6, 3.5, "B+"},
                new Object[]{mPOLI1206, 8.5, 9.0, 8.5, 8.7, 3.5, "B+"},
                new Object[]{mITEC2504, 9.0, 8.5, 9.0, 8.9, 3.5, "B+"},
                new Object[]{mITEC3401, 9.0, 9.0, 8.5, 8.7, 3.5, "B+"},
                new Object[]{mITEC3201, 9.0, 8.5, 8.5, 8.6, 3.5, "B+"},
                new Object[]{mITEC4402, 8.5, 9.0, 8.5, 8.7, 3.5, "B+"}
        ));

        createSemesterGradesForStudent(svCuong, hk1_2526, List.of(
                new Object[]{mPOLI1205, 8.5, 8.0, 8.5, 8.4, 3.5, "B+"},
                new Object[]{mPOLI1206, 8.0, 8.5, 8.0, 8.2, 3.5, "B+"},
                new Object[]{mITEC2504, 8.5, 8.0, 8.5, 8.4, 3.5, "B+"},
                new Object[]{mITEC3401, 8.0, 8.5, 8.0, 8.2, 3.5, "B+"},
                new Object[]{mITEC3201, 8.5, 8.0, 8.5, 8.4, 3.5, "B+"},
                new Object[]{mITEC4402, 8.0, 8.0, 8.5, 8.3, 3.5, "B+"}
        ));

        createSemesterGradesForStudent(svHung, hk1_2526, List.of(
                new Object[]{mCSC101, 9.0, 8.5, 8.0, 8.3, 3.5, "B+"},
                new Object[]{mCSC201, 8.5, 8.0, 8.5, 8.4, 3.5, "B+"},
                new Object[]{mCSC301, 9.0, 8.5, 8.5, 8.6, 3.5, "B+"},
                new Object[]{mCSC401, 9.5, 9.0, 8.5, 8.8, 3.5, "B+"},
                new Object[]{mCSC501, 8.5, 8.0, 8.0, 8.1, 3.0, "B"}
        ));

        // K24 - HK3: MATH1313, GENG1315, ITEC1427, ITEC1404, ITEC2502, GLAW1315 (Tổng 20 TC)
        createSemesterGradesForStudent(svNam, hk1_2526, List.of(
                new Object[]{mMATH1313, 10.0, 9.5, 9.0, 9.3, 4.0, "A+"},
                new Object[]{mGENG1315, 9.5, 9.0, 9.0, 9.1, 4.0, "A+"},
                new Object[]{mITEC1427, 9.5, 9.5, 9.0, 9.2, 4.0, "A+"},
                new Object[]{mITEC1404, 9.5, 9.0, 9.5, 9.4, 4.0, "A+"},
                new Object[]{mITEC2502, 9.0, 8.5, 9.0, 8.9, 3.5, "B+"},
                new Object[]{mGLAW1315, 9.5, 9.5, 9.0, 9.2, 4.0, "A+"}
        ));

        createSemesterGradesForStudent(svDang, hk1_2526, List.of(
                new Object[]{mMATH1313, 9.0, 8.5, 8.5, 8.6, 3.5, "B+"},
                new Object[]{mGENG1315, 8.5, 9.0, 8.5, 8.7, 3.5, "B+"},
                new Object[]{mITEC1427, 9.0, 8.5, 9.0, 8.9, 3.5, "B+"},
                new Object[]{mITEC1404, 9.0, 9.0, 8.5, 8.7, 3.5, "B+"},
                new Object[]{mITEC2502, 8.5, 8.5, 8.5, 8.5, 3.5, "B+"},
                new Object[]{mGLAW1315, 9.0, 8.5, 8.5, 8.6, 3.5, "B+"}
        ));

        createSemesterGradesForStudent(svLinh, hk1_2526, List.of(
                new Object[]{mMATH1313, 9.5, 9.0, 9.0, 9.1, 4.0, "A+"},
                new Object[]{mGENG1315, 9.0, 9.0, 8.5, 8.7, 3.5, "B+"},
                new Object[]{mITEC1427, 9.5, 9.5, 9.0, 9.2, 4.0, "A+"},
                new Object[]{mITEC1404, 9.0, 9.0, 9.0, 9.0, 4.0, "A"},
                new Object[]{mITEC2502, 9.5, 9.0, 9.5, 9.4, 4.0, "A+"},
                new Object[]{mGLAW1315, 9.0, 9.5, 9.0, 9.2, 4.0, "A+"}
        ));

        createSemesterGradesForStudent(svYen, hk1_2526, List.of(
                new Object[]{mCSC101, 9.0, 8.5, 8.5, 8.6, 3.5, "B+"},
                new Object[]{mCSC201, 9.5, 9.0, 9.0, 9.1, 4.0, "A+"},
                new Object[]{mCSC301, 9.0, 9.0, 8.5, 8.7, 3.5, "B+"},
                new Object[]{mGENG1315, 9.5, 9.5, 9.0, 9.2, 4.0, "A+"},
                new Object[]{mMATH1313, 9.0, 8.5, 9.0, 8.9, 3.5, "B+"}
        ));

        // K25 - HK1: MATH1315, GENG1311, GENG1312, ITEC1401, ITEC1505 (Tổng 16 TC)
        createSemesterGradesForStudent(svGiaHung, hk1_2526, List.of(
                new Object[]{mMATH1315, 10.0, 9.5, 9.0, 9.3, 4.0, "A+"},
                new Object[]{mGENG1311, 9.5, 9.0, 9.0, 9.1, 4.0, "A+"},
                new Object[]{mGENG1312, 9.0, 9.5, 9.0, 9.2, 4.0, "A+"},
                new Object[]{mITEC1401, 9.5, 9.0, 9.5, 9.4, 4.0, "A+"},
                new Object[]{mITEC1505, 9.5, 9.5, 9.0, 9.2, 4.0, "A+"}
        ));

        createSemesterGradesForStudent(svQuyen, hk1_2526, List.of(
                new Object[]{mMATH1315, 9.0, 8.5, 8.5, 8.6, 3.5, "B+"},
                new Object[]{mGENG1311, 8.5, 9.0, 8.5, 8.7, 3.5, "B+"},
                new Object[]{mGENG1312, 9.0, 8.0, 8.5, 8.4, 3.5, "B+"},
                new Object[]{mITEC1401, 9.0, 9.0, 8.0, 8.4, 3.5, "B+"},
                new Object[]{mITEC1505, 9.5, 9.0, 8.5, 8.8, 3.5, "B+"}
        ));

        createSemesterGradesForStudent(svLong, hk1_2526, List.of(
                new Object[]{mMATH1315, 8.5, 8.0, 8.5, 8.4, 3.5, "B+"},
                new Object[]{mGENG1311, 8.0, 8.5, 8.0, 8.2, 3.5, "B+"},
                new Object[]{mGENG1312, 8.5, 8.0, 8.5, 8.4, 3.5, "B+"},
                new Object[]{mITEC1401, 8.0, 8.5, 8.0, 8.2, 3.5, "B+"},
                new Object[]{mITEC1505, 8.5, 8.0, 8.5, 8.4, 3.5, "B+"}
        ));

        createSemesterGradesForStudent(svAnh, hk1_2526, List.of(
                new Object[]{mCSC101, 9.5, 9.0, 9.0, 9.1, 4.0, "A+"},
                new Object[]{mMATH1315, 9.0, 9.0, 8.5, 8.7, 3.5, "B+"},
                new Object[]{mGENG1311, 9.5, 9.5, 9.0, 9.2, 4.0, "A+"},
                new Object[]{mGENG1312, 9.0, 9.0, 9.0, 9.0, 4.0, "A"},
                new Object[]{mITEC1401, 9.5, 9.0, 9.5, 9.4, 4.0, "A+"}
        ));

        // 11. Đợt xét Học bổng Cấp trường (3 Đợt mẫu)
        DotXetHocBong dot1 = dotXetHocBongRepository.save(DotXetHocBong.builder()
                .maDot("HB_HK1_2024")
                .tenDot("Học bổng Khuyến khích Học tập - HK1 (2024-2025)")
                .hocKy(hocKyList.get(3))
                .ngayBatDau(LocalDate.of(2024, 9, 1))
                .ngayKetThuc(LocalDate.of(2024, 10, 30))
                .trangThai("DA_KET_THUC")
                .build());

        DotXetHocBong dot2 = dotXetHocBongRepository.save(DotXetHocBong.builder()
                .maDot("HB_HK2_2024")
                .tenDot("Học bổng Khuyến khích Học tập - HK2 (2024-2025)")
                .hocKy(hocKyList.get(4))
                .ngayBatDau(LocalDate.of(2025, 3, 1))
                .ngayKetThuc(LocalDate.of(2025, 4, 30))
                .trangThai("DA_KET_THUC")
                .build());

        DotXetHocBong dot3 = dotXetHocBongRepository.save(DotXetHocBong.builder()
                .maDot("HB_HK1_2025")
                .tenDot("Học bổng Khuyến khích Học tập - HK1 (2025-2026)")
                .hocKy(hk1_2526)
                .ngayBatDau(LocalDate.of(2025, 9, 1))
                .ngayKetThuc(LocalDate.of(2025, 10, 30))
                .trangThai("DANG_MO")
                .build());

        // Đợt xét Khoa cho Đợt 3 (Chuẩn 8% theo nhóm ngành & khóa học)
        saveDotKhoa(dot3, it, "HB_HK1_2025_IT", 9, BigDecimal.valueOf(105300000));
        saveDotKhoa(dot3, bio, "HB_HK1_2025_BIO", 6, BigDecimal.valueOf(70200000));
        saveDotKhoa(dot3, acc, "HB_HK1_2025_ACC", 6, BigDecimal.valueOf(70200000));
        saveDotKhoa(dot3, eco, "HB_HK1_2025_ECO", 4, BigDecimal.valueOf(46800000));
        saveDotKhoa(dot3, soc, "HB_HK1_2025_SOC", 8, BigDecimal.valueOf(93600000));
        saveDotKhoa(dot3, bas, "HB_HK1_2025_BAS", 3, BigDecimal.valueOf(35100000));
        saveDotKhoa(dot3, law, "HB_HK1_2025_LAW", 6, BigDecimal.valueOf(70200000));
        saveDotKhoa(dot3, fl, "HB_HK1_2025_FL", 12, BigDecimal.valueOf(140400000));
        saveDotKhoa(dot3, ba, "HB_HK1_2025_BA", 6, BigDecimal.valueOf(70200000));
        saveDotKhoa(dot3, bf, "HB_HK1_2025_BF", 5, BigDecimal.valueOf(58500000));
        saveDotKhoa(dot3, ce, "HB_HK1_2025_CE", 4, BigDecimal.valueOf(46800000));
        saveDotKhoa(dot3, spe, "HB_HK1_2025_SPE", 13, BigDecimal.valueOf(200000000));

        // 12. Dynamic Rule Engine
        quyTacHocBongRepository.save(QuyTacHocBong.builder()
                .maQuyTac("QT_HB_HK1_2025")
                .dotXetHocBong(dot3)
                .diemTbDuoiThieu(BigDecimal.valueOf(2.50))
                .diemRlToiThieu(BigDecimal.valueOf(65.0))
                .soTinChiToiThieu(14)
                .khongNoMon(true)
                .phienBan(1)
                .mucHocBongXuatSac(BigDecimal.valueOf(11700000))
                .mucHocBongGioi(BigDecimal.valueOf(8190000))
                .mucHocBongKha(BigDecimal.valueOf(5850000))
                .ghiChu("Quy chế Học bổng Khuyến khích Học tập OU - Áp dụng Quỹ 8% học phí theo Ngành")
                .build());
    }

    private void saveCurriculum(Nganh nganh, MonHoc monHoc, int hocKyGoiY, String loaiHocPhan, String heDaoTao) {
        chuongTrinhDaoTaoRepository.save(ChuongTrinhDaoTao.builder()
                .nganh(nganh)
                .monHoc(monHoc)
                .hocKyGoiY(hocKyGoiY)
                .loaiHocPhan(loaiHocPhan)
                .heDaoTao(heDaoTao)
                .build());
    }

    private void createCanBoKhoa(String username, String hoTen, String email, String sdt, Khoa khoa, String maNv, String chucVu, String lopPhuTrach) {
        NguoiDung u = nguoiDungRepository.save(NguoiDung.builder()
                .tenDangNhap(username)
                .matKhau(passwordEncoder.encode("khoa123"))
                .matKhauHienThi("khoa123")
                .hoTen(hoTen)
                .email(email)
                .soDienThoai(sdt)
                .vaiTro("ROLE_CAN_BO_KHOA")
                .trangThai("HOAT_DONG")
                .build());

        NhanVien nv = nhanVienRepository.save(NhanVien.builder()
                .maNv(maNv)
                .nguoiDung(u)
                .chucVu(chucVu)
                .donViCongTac(khoa.getTenKhoa())
                .build());

        canBoKhoaRepository.save(CanBoKhoa.builder()
                .maNv(nv.getMaNv())
                .nhanVien(nv)
                .khoa(khoa)
                .lopPhuTrach(lopPhuTrach)
                .trangThaiCongTac("Đang công tác")
                .build());
    }

    private void saveDotKhoa(DotXetHocBong dot, Khoa khoa, String maDotKhoa, int chiTieu, BigDecimal nganSach) {
        dotXetHbKhoaRepository.save(DotXetHbKhoa.builder()
                .maDotXetHbKhoa(maDotKhoa)
                .dotXetHocBong(dot)
                .khoa(khoa)
                .chiTieu(chiTieu)
                .nganSachKhoa(nganSach)
                .hanPhanHoi(LocalDate.now().plusDays(15))
                .trangThai("CHUA_XET")
                .build());
    }

    private SinhVien createStudentWithFullHistory(
            String mssv, String cccd, String hoTen, String email, String sdt, String gioiTinh,
            LopSinhHoat lop, List<HocKy> hocKyList,
            double[] gpaArr, double[] drlArr
    ) {
        NguoiDung user = nguoiDungRepository.save(NguoiDung.builder()
                .tenDangNhap(mssv)
                .matKhau(passwordEncoder.encode(cccd))
                .matKhauHienThi(cccd)
                .hoTen(hoTen)
                .email(email)
                .soDienThoai(sdt)
                .vaiTro("ROLE_SINH_VIEN")
                .trangThai("HOAT_DONG")
                .build());

        SinhVien sv = sinhVienRepository.save(SinhVien.builder()
                .mssv(mssv)
                .cccd(cccd)
                .nguoiDung(user)
                .ngaySinh(LocalDate.of(2005, 5, 15))
                .gioiTinh(gioiTinh)
                .diaChi("97 Võ Văn Tần, Phường Võ Thị Sáu, Quận 3, TP.HCM")
                .trangThaiHoc("DANG_HOC")
                .lopSinhHoat(lop)
                .build());

        for (int i = 0; i < hocKyList.size() && i < gpaArr.length; i++) {
            HocKy hk = hocKyList.get(i);
            BigDecimal gpa = BigDecimal.valueOf(gpaArr[i]);
            BigDecimal drl = BigDecimal.valueOf(drlArr[i]);
            String xepLoai = drl.compareTo(BigDecimal.valueOf(90)) >= 0 ? "Xuat sac" :
                    drl.compareTo(BigDecimal.valueOf(80)) >= 0 ? "Tot" : "Kha";

            ketQuaHocTapRepository.save(KetQuaHocTap.builder()
                    .id("GPA_" + mssv + "_" + hk.getMaHocKy())
                    .sinhVien(sv)
                    .hocKy(hk)
                    .diemTrungBinh(gpa)
                    .soTinChi(18)
                    .coHocPhanRot(false)
                    .build());

            ketQuaRenLuyenRepository.save(KetQuaRenLuyen.builder()
                    .id("DRL_" + mssv + "_" + hk.getMaHocKy())
                    .sinhVien(sv)
                    .hocKy(hk)
                    .diemRenLuyen(drl)
                    .xepLoai(xepLoai)
                    .build());
        }

        return sv;
    }

    private void createSemesterGradesForStudent(SinhVien sv, HocKy hk, List<Object[]> subjectsGrades) {
        for (Object[] row : subjectsGrades) {
            MonHoc mon = (MonHoc) row[0];
            double cc = (Double) row[1];
            double gk = (Double) row[2];
            double ck = (Double) row[3];
            double tk10 = (Double) row[4];
            double he4 = (Double) row[5];
            String chu = (String) row[6];

            BigDecimal hocPhiMon = mon.getDonGiaTinChi() != null ?
                    mon.getDonGiaTinChi().multiply(BigDecimal.valueOf(mon.getSoTinChi())) :
                    new BigDecimal("1950000");

            diemHocPhanRepository.save(DiemHocPhan.builder()
                    .id("DHP_" + sv.getMssv() + "_" + mon.getMaMon() + "_" + hk.getMaHocKy())
                    .sinhVien(sv)
                    .monHoc(mon)
                    .hocKy(hk)
                    .diemChuyenCan(BigDecimal.valueOf(cc))
                    .diemGiuaKy(BigDecimal.valueOf(gk))
                    .diemCuoiKy(BigDecimal.valueOf(ck))
                    .diemTongKet10(BigDecimal.valueOf(tk10))
                    .diemHe4(BigDecimal.valueOf(he4))
                    .diemChu(chu)
                    .soTinChi(mon.getSoTinChi())
                    .hocPhiMon(hocPhiMon)
                    .dat(tk10 >= 5.0)
                    .build());
        }
    }
}
