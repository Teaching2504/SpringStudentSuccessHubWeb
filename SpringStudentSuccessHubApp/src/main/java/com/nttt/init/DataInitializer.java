package com.nttt.init;

import com.nttt.pojo.*;
import com.nttt.repositories.*;
import com.nttt.services.ScholarshipRuleEngineService;
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
    private final KienNghiRepository kienNghiRepository;
    private final MinhChungRenLuyenRepository minhChungRenLuyenRepository;
    private final ScholarshipRuleEngineService scholarshipRuleEngineService;
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
            KienNghiRepository kienNghiRepository,
            MinhChungRenLuyenRepository minhChungRenLuyenRepository,
            ScholarshipRuleEngineService scholarshipRuleEngineService,
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
        this.kienNghiRepository = kienNghiRepository;
        this.minhChungRenLuyenRepository = minhChungRenLuyenRepository;
        this.scholarshipRuleEngineService = scholarshipRuleEngineService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {

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

        LopSinhHoat lopCs23 = lopSinhHoatRepository.save(new LopSinhHoat("DH23CS01", "Lớp Khoa học Máy tính 2023 - 01", "K23 (2023-2027)", it, cs));
        LopSinhHoat lopCs23_2 = lopSinhHoatRepository.save(new LopSinhHoat("DH23CS02", "Lớp Khoa học Máy tính 2023 - 02", "K23 (2023-2027)", it, cs));
        LopSinhHoat lopIt23 = lopSinhHoatRepository.save(new LopSinhHoat("DH23IT01", "Lớp Công nghệ Thông tin 2023 - 01", "K23 (2023-2027)", it, itMajor));
        LopSinhHoat lopIm23 = lopSinhHoatRepository.save(new LopSinhHoat("DH23IM01", "Lớp Hệ thống Thông tin Quản lý 2023 - 01", "K23 (2023-2027)", it, im));
        LopSinhHoat lopCsClc23 = lopSinhHoatRepository.save(new LopSinhHoat("DH23CS01C", "Lớp KHMT CLC 2023 - 01", "K23 (2023-2027)", spe, csc));

        LopSinhHoat lopAi24 = lopSinhHoatRepository.save(new LopSinhHoat("DH24AI01", "Lớp Trí tuệ Nhân tạo 2024 - 01", "K24 (2024-2028)", it, ai));
        LopSinhHoat lopCs24 = lopSinhHoatRepository.save(new LopSinhHoat("DH24CS01", "Lớp Khoa học Máy tính 2024 - 01", "K24 (2024-2028)", it, cs));
        LopSinhHoat lopIt24 = lopSinhHoatRepository.save(new LopSinhHoat("DH24IT01", "Lớp Công nghệ Thông tin 2024 - 01", "K24 (2024-2028)", it, itMajor));
        LopSinhHoat lopIt24_2 = lopSinhHoatRepository.save(new LopSinhHoat("DH24IT02", "Lớp Công nghệ Thông tin 2024 - 02", "K24 (2024-2028)", it, itMajor));
        LopSinhHoat lopIm24 = lopSinhHoatRepository.save(new LopSinhHoat("DH24IM01", "Lớp Hệ thống Thông tin Quản lý 2024 - 01", "K24 (2024-2028)", it, im));
        LopSinhHoat lopCsClc24 = lopSinhHoatRepository.save(new LopSinhHoat("DH24CS01C", "Lớp KHMT CLC 2024 - 01", "K24 (2024-2028)", spe, csc));

        LopSinhHoat lopAi25 = lopSinhHoatRepository.save(new LopSinhHoat("DH25AI01", "Lớp Trí tuệ Nhân tạo 2025 - 01", "K25 (2025-2029)", it, ai));
        LopSinhHoat lopCs25 = lopSinhHoatRepository.save(new LopSinhHoat("DH25CS01", "Lớp Khoa học Máy tính 2025 - 01", "K25 (2025-2029)", it, cs));
        LopSinhHoat lopIt25 = lopSinhHoatRepository.save(new LopSinhHoat("DH25IT01", "Lớp Công nghệ Thông tin 2025 - 01", "K25 (2025-2029)", it, itMajor));
        LopSinhHoat lopIm25 = lopSinhHoatRepository.save(new LopSinhHoat("DH25IM01", "Lớp Hệ thống Thông tin Quản lý 2025 - 01", "K25 (2025-2029)", it, im));
        LopSinhHoat lopSe25 = lopSinhHoatRepository.save(new LopSinhHoat("DH25SE01", "Lớp Kỹ thuật Phần mềm 2025 - 01", "K25 (2025-2029)", it, se));
        LopSinhHoat lopCsClc25 = lopSinhHoatRepository.save(new LopSinhHoat("DH25CS01C", "Lớp KHMT CLC 2025 - 01", "K25 (2025-2029)", spe, csc));

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

        BigDecimal donGiaChuan = new BigDecimal("650000");
        BigDecimal donGiaClc = new BigDecimal("1450000");

        MonHoc mMATH1315 = monHocRepository.save(new MonHoc("MATH1315", "Xác suất và Thống kê", 3, 45, 15, donGiaChuan, bas));
        MonHoc mGENG1311 = monHocRepository.save(new MonHoc("GENG1311", "Tiếng Anh Nâng cao 1", 3, 45, 0, donGiaChuan, fl));
        MonHoc mGENG1312 = monHocRepository.save(new MonHoc("GENG1312", "Tiếng Anh Nâng cao 2", 3, 45, 0, donGiaChuan, fl));
        MonHoc mITEC1401 = monHocRepository.save(new MonHoc("ITEC1401", "Nhập môn Tin học", 3, 30, 30, donGiaChuan, it));
        MonHoc mITEC1505 = monHocRepository.save(new MonHoc("ITEC1505", "Cơ sở Lập trình C/C++", 4, 45, 30, donGiaChuan, it));

        MonHoc mMATH1314 = monHocRepository.save(new MonHoc("MATH1314", "Giải tích", 3, 45, 15, donGiaChuan, bas));
        MonHoc mGENG1313 = monHocRepository.save(new MonHoc("GENG1313", "Tiếng Anh Nâng cao 3", 3, 45, 0, donGiaChuan, fl));
        MonHoc mGENG1314 = monHocRepository.save(new MonHoc("GENG1314", "Tiếng Anh Nâng cao 4", 3, 45, 0, donGiaChuan, fl));
        MonHoc mITEC1504 = monHocRepository.save(new MonHoc("ITEC1504", "Kỹ thuật Lập trình", 4, 45, 30, donGiaChuan, it));
        MonHoc mITEC1310 = monHocRepository.save(new MonHoc("ITEC1310", "Hệ điều hành và Kiến trúc Máy tính", 3, 35, 10, donGiaChuan, it));

        MonHoc mMATH1313 = monHocRepository.save(new MonHoc("MATH1313", "Đại số Tuyến tính", 3, 45, 15, donGiaChuan, bas));
        MonHoc mGENG1315 = monHocRepository.save(new MonHoc("GENG1315", "Tiếng Anh Nâng cao 5", 3, 45, 0, donGiaChuan, fl));
        MonHoc mITEC1427 = monHocRepository.save(new MonHoc("ITEC1427", "Cấu trúc Dữ liệu và Thuật giải 1", 4, 45, 30, donGiaChuan, it));
        MonHoc mITEC1404 = monHocRepository.save(new MonHoc("ITEC1404", "Ứng dụng Web", 3, 30, 30, donGiaChuan, it));
        MonHoc mITEC2502 = monHocRepository.save(new MonHoc("ITEC2502", "Cơ sở Dữ liệu Quan hệ", 4, 45, 30, donGiaChuan, it));

        MonHoc mPOLI1304 = monHocRepository.save(new MonHoc("POLI1304", "Triết học Mác - Lênin", 3, 45, 0, donGiaChuan, soc));
        MonHoc mITEC1328 = monHocRepository.save(new MonHoc("ITEC1328", "Cấu trúc Dữ liệu và Thuật giải 2", 3, 30, 30, donGiaChuan, it));
        MonHoc mITEC2503 = monHocRepository.save(new MonHoc("ITEC2503", "Mạng Máy tính", 4, 45, 30, donGiaChuan, it));
        MonHoc mMATH2402 = monHocRepository.save(new MonHoc("MATH2402", "Toán Rời rạc", 4, 60, 0, donGiaChuan, bas));

        MonHoc mPOLI1205 = monHocRepository.save(new MonHoc("POLI1205", "Kinh tế Chính trị Mác - Lênin", 2, 30, 0, donGiaChuan, soc));
        MonHoc mPOLI1206 = monHocRepository.save(new MonHoc("POLI1206", "Chủ nghĩa Xã hội Khoa học", 2, 30, 0, donGiaChuan, soc));
        MonHoc mITEC2504 = monHocRepository.save(new MonHoc("ITEC2504", "Lập trình Hướng đối tượng (Java)", 4, 45, 30, donGiaChuan, it));
        MonHoc mITEC3401 = monHocRepository.save(new MonHoc("ITEC3401", "Phân tích Thiết kế Hệ thống", 4, 60, 0, donGiaChuan, it));
        MonHoc mITEC3201 = monHocRepository.save(new MonHoc("ITEC3201", "Kỹ năng Nghề nghiệp", 2, 30, 0, donGiaChuan, it));

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

        MonHoc mCSC101 = monHocRepository.save(new MonHoc("CSC101", "Advanced Programming (CLC)", 4, 45, 30, donGiaClc, spe));
        MonHoc mCSC201 = monHocRepository.save(new MonHoc("CSC201", "Data Structures & Algorithms (CLC)", 4, 45, 30, donGiaClc, spe));
        MonHoc mCSC301 = monHocRepository.save(new MonHoc("CSC301", "Web Application Development (CLC)", 3, 30, 30, donGiaClc, spe));
        MonHoc mCSC401 = monHocRepository.save(new MonHoc("CSC401", "Database Systems (CLC)", 4, 45, 30, donGiaClc, spe));
        MonHoc mCSC501 = monHocRepository.save(new MonHoc("CSC501", "Artificial Intelligence (CLC)", 3, 30, 30, donGiaClc, spe));

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

        NguoiDung uAdmin = saveUser("admin", "admin123", "Quản trị viên Hệ thống", "admin@ou.edu.vn", "0909123456", "ROLE_ADMIN");

        NguoiDung uTruong = saveUser("captruong", "truong123", "ThS. Phạm Minh Tuấn", "tuan.pm@ou.edu.vn", "0918123456", "ROLE_CAN_BO_TRUONG");

        NhanVien nvTruong = nhanVienRepository.findById("NV_TRUONG_01").orElseGet(() -> nhanVienRepository.save(NhanVien.builder()
                .maNv("NV_TRUONG_01")
                .nguoiDung(uTruong)
                .chucVu("Trưởng phòng Công tác Sinh viên")
                .donViCongTac("Phòng Công tác Sinh viên")
                .build()));

        canBoCapTruongRepository.findById(nvTruong.getMaNv()).orElseGet(() -> canBoCapTruongRepository.save(CanBoCapTruong.builder()
                .maNv(nvTruong.getMaNv())
                .nhanVien(nvTruong)
                .phongBan("Phòng Công tác Sinh viên")
                .capPheDuyet("Cấp Trường")
                .build()));

        createCanBoKhoa("cbk_it", "ThS. Lê Hoàng Nam", "cbk.it@ou.edu.vn", "0987654301", it, "NV_KHOA_IT", "Trợ lý Giáo vụ & CTSV Khoa CNTT", "DH23CS01, DH23CS02, DH23IT01, DH24CS01, DH24IT01, DH24IT02, DH25CS01, DH25IT01, DH25SE01");
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

        SinhVien svTrinh = createStudentWithFullHistory("2351010216", "092305006276", "Nguyễn Thị Tuyết Trinh", "2351010216trinh@ou.edu.vn", "0934112233", "Nữ", lopCs23, hocKyList,
                new double[]{3.20, 3.45, 3.50, 3.55, 3.65, 3.50, 3.60, 3.70, 0.00},
                new double[]{80, 84, 85, 86, 82, 80, 84, 88, 0.00});

        SinhVien svAn = createStudentWithFullHistory("2351010001", "079205001111", "Trần Bảo An", "2351010001an@ou.edu.vn", "0934112234", "Nam", lopCs23, hocKyList,
                new double[]{3.60, 3.65, 3.60, 3.70, 3.72, 3.65, 3.70, 3.75, 3.68},
                new double[]{90, 92, 88, 92, 92, 90, 92, 94, 91});

        SinhVien svPhuc = createStudentWithFullHistory("2351010011", "079205000011", "Lê Hoàng Phúc", "2351010011phuc@ou.edu.vn", "0934112241", "Nam", lopCs23, hocKyList,
                new double[]{3.25, 3.30, 3.20, 3.35, 3.35, 3.25, 3.30, 3.40, 3.30},
                new double[]{80, 82, 80, 84, 84, 80, 82, 85, 82});

        SinhVien svKhoi = createStudentWithFullHistory("2351010012", "079205000012", "Phạm Minh Khôi", "2351010012khoi@ou.edu.vn", "0934112242", "Nam", lopCs23, hocKyList,
                new double[]{2.75, 2.80, 2.72, 2.85, 2.85, 2.78, 2.80, 2.88, 2.80},
                new double[]{70, 72, 68, 74, 72, 70, 72, 75, 72});

        SinhVien svBao = createStudentWithFullHistory("2351010013", "079205000013", "Đỗ Gia Bảo", "2351010013bao@ou.edu.vn", "0934112243", "Nam", lopCs23, hocKyList,
                new double[]{3.50, 3.55, 3.45, 3.60, 3.52, 3.50, 3.58, 3.62, 3.55},
                new double[]{55, 58, 50, 60, 54, 50, 52, 55, 50});

        SinhVien svTruc = createStudentWithCustomRecord("2351010014", "079305000014", "Huỳnh Thanh Trúc", "2351010014truc@ou.edu.vn", "0934112244", "Nữ", "DANG_HOC", lopCs23, hocKyList,
                new double[]{3.10, 3.15, 3.05, 3.20, 3.10, 3.08, 3.00, 3.15, 3.10},
                new double[]{85, 87, 84, 88, 86, 85, 88, 90, 87},
                new int[]{18, 18, 14, 18, 18, 14, 18, 18, 14},
                new boolean[]{false, false, false, false, false, false, true, false, false});

        SinhVien svTrong = createStudentWithCustomRecord("2351010015", "079205000015", "Võ Đình Trọng", "2351010015trong@ou.edu.vn", "0934112245", "Nam", "DANG_HOC", lopCs23, hocKyList,
                new double[]{3.40, 3.42, 3.35, 3.48, 3.40, 3.38, 3.45, 3.50, 3.42},
                new double[]{88, 90, 86, 91, 88, 87, 90, 92, 89},
                new int[]{18, 18, 14, 18, 18, 14, 10, 18, 14},
                new boolean[]{false, false, false, false, false, false, false, false, false});

        SinhVien svHuy = createStudentWithCustomRecord("2351010016", "079205000016", "Bùi Quang Huy", "2351010016huy@ou.edu.vn", "0934112246", "Nam", "CANH_CAO_HOC_VU", lopCs23, hocKyList,
                new double[]{1.80, 1.70, 1.65, 1.60, 1.50, 1.55, 1.55, 1.60, 1.50},
                new double[]{45, 48, 40, 46, 42, 40, 42, 45, 40},
                new int[]{18, 18, 14, 18, 18, 14, 18, 18, 14},
                new boolean[]{true, true, false, true, true, false, true, true, false});

        SinhVien svMy = createStudentWithFullHistory("2351010021", "079305000021", "Phan Thảo My", "2351010021my@ou.edu.vn", "0934112251", "Nữ", lopCs23_2, hocKyList,
                new double[]{3.70, 3.72, 3.68, 3.75, 3.72, 3.74, 3.76, 3.78, 3.75},
                new double[]{92, 94, 91, 95, 93, 92, 94, 96, 93});

        SinhVien svKhang = createStudentWithFullHistory("2351010022", "079205000022", "Trịnh Đình Khang", "2351010022khang@ou.edu.vn", "0934112252", "Nam", lopCs23_2, hocKyList,
                new double[]{3.55, 3.60, 3.50, 3.65, 3.60, 3.58, 3.62, 3.68, 3.60},
                new double[]{82, 85, 80, 86, 84, 82, 84, 88, 83});

        SinhVien svDang23 = createStudentWithFullHistory("2351010023", "079205000023", "Ngô Hải Đăng", "2351010023dang@ou.edu.vn", "0934112253", "Nam", lopCs23_2, hocKyList,
                new double[]{2.80, 2.85, 2.75, 2.90, 2.82, 2.80, 2.85, 2.90, 2.85},
                new double[]{70, 72, 68, 74, 70, 69, 71, 75, 70});

        SinhVien svVan = createStudentWithFullHistory("2351010024", "079305000024", "Lâm Khánh Vân", "2351010024van@ou.edu.vn", "0934112254", "Nữ", lopCs23_2, hocKyList,
                new double[]{2.60, 2.65, 2.58, 2.70, 2.62, 2.60, 2.65, 2.72, 2.64},
                new double[]{66, 68, 65, 70, 67, 66, 68, 70, 67});

        SinhVien svKiet = createStudentWithFullHistory("2351010025", "079205000025", "Đặng Tuấn Kiệt", "2351010025kiet@ou.edu.vn", "0934112255", "Nam", lopCs23_2, hocKyList,
                new double[]{2.20, 2.18, 2.10, 2.25, 2.15, 2.12, 2.15, 2.20, 2.14},
                new double[]{92, 94, 90, 96, 93, 91, 95, 97, 93});

        SinhVien svMan = createStudentWithCustomRecord("2351010026", "079305000026", "Trương Gia Mẫn", "2351010026man@ou.edu.vn", "0934112256", "Nữ", "BAO_LUU", lopCs23_2, hocKyList,
                new double[]{3.20, 3.25, 3.15, 3.30, 3.20, 3.18, 0.00, 0.00, 0.00},
                new double[]{80, 82, 78, 85, 80, 78, 0.00, 0.00, 0.00},
                new int[]{18, 18, 14, 18, 18, 14, 0, 0, 0},
                new boolean[]{false, false, false, false, false, false, false, false, false});

        SinhVien svTien = createStudentWithCustomRecord("2351010027", "079205000027", "Dương Văn Tiến", "2351010027tien@ou.edu.vn", "0934112257", "Nam", "CANH_CAO_HOC_VU", lopCs23_2, hocKyList,
                new double[]{1.60, 1.50, 1.45, 1.40, 1.30, 1.35, 1.35, 1.40, 1.30},
                new double[]{48, 50, 42, 48, 44, 42, 45, 48, 42},
                new int[]{18, 18, 14, 18, 18, 14, 18, 18, 14},
                new boolean[]{true, true, false, true, true, false, true, true, false});

        SinhVien svBinh = createStudentWithFullHistory("2351010002", "079305002222", "Lê Khánh Bình", "2351010002binh@ou.edu.vn", "0934112235", "Nữ", lopIt23, hocKyList,
                new double[]{3.50, 3.60, 3.55, 3.65, 3.68, 3.55, 3.60, 3.75, 3.65},
                new double[]{85, 86, 84, 88, 87, 85, 86, 89, 86});

        SinhVien svCuong = createStudentWithFullHistory("2351010003", "079205003333", "Phạm Quốc Cường", "2351010003cuong@ou.edu.vn", "0934112236", "Nam", lopIt23, hocKyList,
                new double[]{3.40, 3.45, 3.50, 3.55, 3.52, 3.45, 3.50, 3.60, 3.50},
                new double[]{80, 82, 85, 84, 83, 80, 82, 85, 82});

        SinhVien svHung = createStudentWithFullHistory("2351020001", "079205005555", "Vũ Nam Hùng", "2351020001hung@ou.edu.vn", "0934112238", "Nam", lopCsClc23, hocKyList,
                new double[]{3.30, 3.35, 3.40, 3.45, 3.42, 3.35, 3.40, 3.50, 3.40},
                new double[]{78, 80, 82, 80, 81, 78, 80, 82, 80});

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

        HocKy hk1_2324 = hocKyList.get(0);
        HocKy hk2_2324 = hocKyList.get(1);
        HocKy hk3_2324 = hocKyList.get(2);
        HocKy hk1_2425 = hocKyList.get(3);
        HocKy hk2_2425 = hocKyList.get(4);
        HocKy hk3_2425 = hocKyList.get(5);

        createSemesterGradesForStudent(svTrinh, hk1_2324, List.of(
                new Object[]{mMATH1315, 8.5, 8.5, 9.0, 8.8, 3.5, "B+"},
                new Object[]{mGENG1311, 9.0, 8.5, 9.0, 8.9, 3.5, "B+"},
                new Object[]{mGENG1312, 9.0, 9.0, 9.0, 9.0, 3.5, "B+"},
                new Object[]{mITEC1401, 9.5, 9.0, 9.0, 9.1, 4.0, "A+"},
                new Object[]{mITEC1505, 8.5, 8.5, 9.0, 8.8, 3.5, "B+"}
        ));

        createSemesterGradesForStudent(svTrinh, hk2_2324, List.of(
                new Object[]{mMATH1314, 8.5, 8.0, 8.5, 8.4, 3.5, "B+"},
                new Object[]{mGENG1313, 9.0, 9.0, 9.0, 9.0, 3.5, "B+"},
                new Object[]{mGENG1314, 9.5, 9.0, 9.0, 9.1, 4.0, "A+"},
                new Object[]{mITEC1504, 9.0, 8.5, 9.0, 8.9, 3.5, "B+"},
                new Object[]{mITEC1310, 9.0, 9.0, 9.0, 9.0, 3.5, "B+"}
        ));

        createSemesterGradesForStudent(svTrinh, hk3_2324, List.of(
                new Object[]{mGLAW1315, 9.0, 9.0, 9.0, 9.0, 3.5, "B+"},
                new Object[]{mITEC1404, 9.5, 9.5, 9.0, 9.2, 4.0, "A+"}
        ));

        createSemesterGradesForStudent(svTrinh, hk1_2425, List.of(
                new Object[]{mMATH1313, 8.5, 8.5, 8.5, 8.5, 3.5, "B+"},
                new Object[]{mGENG1315, 9.0, 9.0, 9.0, 9.0, 3.5, "B+"},
                new Object[]{mITEC1427, 9.0, 8.5, 9.0, 8.9, 3.5, "B+"},
                new Object[]{mITEC2502, 9.5, 9.0, 9.0, 9.1, 4.0, "A+"},
                new Object[]{mPOLI1304, 8.5, 8.0, 8.5, 8.4, 3.5, "B+"}
        ));

        createSemesterGradesForStudent(svTrinh, hk2_2425, List.of(
                new Object[]{mITEC1328, 9.0, 9.0, 9.0, 9.0, 3.5, "B+"},
                new Object[]{mITEC2503, 9.5, 9.0, 9.5, 9.4, 4.0, "A+"},
                new Object[]{mMATH2402, 9.0, 8.5, 9.0, 8.9, 3.5, "B+"},
                new Object[]{mPOLI1205, 9.5, 9.0, 9.0, 9.1, 4.0, "A+"},
                new Object[]{mPOLI1206, 9.0, 9.0, 9.0, 9.0, 3.5, "B+"}
        ));

        createSemesterGradesForStudent(svTrinh, hk3_2425, List.of(
                new Object[]{mPOLI1207, 8.5, 8.5, 8.5, 8.5, 3.5, "B+"},
                new Object[]{mPOLI1208, 9.0, 9.0, 9.0, 9.0, 3.5, "B+"}
        ));

        createSemesterGradesForStudent(svTrinh, hk1_2526, List.of(
                new Object[]{mPOLI1205, 8.5, 8.0, 8.5, 8.4, 3.5, "B+"},
                new Object[]{mPOLI1206, 8.0, 8.5, 8.0, 8.2, 3.5, "B+"},
                new Object[]{mITEC2504, 9.0, 8.5, 9.0, 8.9, 3.5, "B+"},
                new Object[]{mITEC3401, 9.0, 9.0, 8.5, 8.7, 3.5, "B+"},
                new Object[]{mITEC3201, 9.5, 9.0, 9.0, 9.1, 4.0, "A+"},
                new Object[]{mITEC4402, 8.5, 8.0, 8.5, 8.4, 3.5, "B+"}
        ));

        createSemesterGradesForStudent(svAn, hk1_2526, List.of(
                new Object[]{mPOLI1205, 9.0, 8.5, 8.5, 8.6, 3.5, "B+"},
                new Object[]{mPOLI1206, 8.5, 9.0, 8.5, 8.7, 3.5, "B+"},
                new Object[]{mITEC2504, 9.0, 8.5, 9.0, 8.9, 3.5, "B+"},
                new Object[]{mITEC3401, 9.0, 9.0, 8.0, 8.4, 3.5, "B+"},
                new Object[]{mITEC3201, 9.5, 9.0, 8.5, 8.8, 3.5, "B+"},
                new Object[]{mITEC4402, 8.5, 8.5, 8.5, 8.5, 3.5, "B+"}
        ));

        createSemesterGradesForStudent(svPhuc, hk1_2526, List.of(
                new Object[]{mPOLI1205, 8.5, 8.0, 8.0, 8.2, 3.5, "B+"},
                new Object[]{mPOLI1206, 8.0, 8.0, 8.0, 8.0, 3.5, "B+"},
                new Object[]{mITEC2504, 8.5, 8.5, 8.5, 8.5, 3.5, "B+"},
                new Object[]{mITEC3401, 8.5, 8.0, 8.5, 8.4, 3.5, "B+"},
                new Object[]{mITEC3201, 9.0, 8.5, 8.5, 8.6, 3.5, "B+"},
                new Object[]{mITEC4402, 8.0, 8.0, 8.5, 8.1, 3.5, "B+"}
        ));

        createSemesterGradesForStudent(svKhoi, hk1_2526, List.of(
                new Object[]{mPOLI1205, 7.0, 7.0, 7.0, 7.0, 3.0, "B"},
                new Object[]{mPOLI1206, 7.0, 6.5, 6.8, 6.8, 2.5, "C+"},
                new Object[]{mITEC2504, 7.5, 7.0, 7.2, 7.2, 3.0, "B"},
                new Object[]{mITEC3401, 6.5, 7.0, 6.5, 6.7, 2.5, "C+"},
                new Object[]{mITEC3201, 8.0, 7.0, 7.5, 7.5, 3.0, "B"},
                new Object[]{mITEC4402, 6.5, 6.5, 6.5, 6.5, 2.5, "C+"}
        ));

        createSemesterGradesForStudent(svBao, hk1_2526, List.of(
                new Object[]{mPOLI1205, 9.0, 9.0, 9.0, 9.0, 3.5, "B+"},
                new Object[]{mPOLI1206, 9.5, 9.0, 9.2, 9.2, 4.0, "A+"},
                new Object[]{mITEC2504, 9.0, 9.0, 9.0, 9.0, 3.5, "B+"},
                new Object[]{mITEC3401, 9.5, 9.5, 9.5, 9.5, 4.0, "A+"},
                new Object[]{mITEC3201, 9.0, 9.0, 9.0, 9.0, 3.5, "B+"},
                new Object[]{mITEC4402, 9.5, 9.0, 9.3, 9.3, 4.0, "A+"}
        ));

        createSemesterGradesForStudent(svTruc, hk1_2526, List.of(
                new Object[]{mPOLI1205, 8.5, 8.5, 8.5, 8.5, 3.5, "B+"},
                new Object[]{mPOLI1206, 8.5, 8.5, 8.5, 8.5, 3.5, "B+"},
                new Object[]{mITEC2504, 4.0, 3.0, 2.0, 2.7, 0.0, "F"},
                new Object[]{mITEC3401, 8.5, 8.5, 8.5, 8.5, 3.5, "B+"},
                new Object[]{mITEC3201, 9.0, 9.0, 9.0, 9.0, 3.5, "B+"},
                new Object[]{mITEC4402, 8.5, 8.5, 8.5, 8.5, 3.5, "B+"}
        ));

        createSemesterGradesForStudent(svTrong, hk1_2526, List.of(
                new Object[]{mPOLI1205, 9.0, 8.5, 9.0, 8.8, 3.5, "B+"},
                new Object[]{mPOLI1206, 8.5, 8.5, 8.8, 8.6, 3.5, "B+"},
                new Object[]{mITEC2504, 9.0, 9.0, 9.0, 9.0, 3.5, "B+"},
                new Object[]{mITEC3201, 9.5, 9.0, 9.2, 9.2, 4.0, "A+"}
        ));

        createSemesterGradesForStudent(svHuy, hk1_2526, List.of(
                new Object[]{mPOLI1205, 6.0, 5.0, 5.5, 5.5, 2.0, "C"},
                new Object[]{mPOLI1206, 5.5, 5.0, 5.0, 5.0, 2.0, "C"},
                new Object[]{mITEC2504, 3.0, 2.0, 2.5, 2.4, 0.0, "F"},
                new Object[]{mITEC3401, 2.0, 3.0, 2.0, 2.2, 0.0, "F"},
                new Object[]{mITEC3201, 6.5, 6.0, 6.0, 6.0, 2.5, "C+"},
                new Object[]{mITEC4402, 5.0, 5.0, 5.0, 5.0, 2.0, "C"}
        ));

        createSemesterGradesForStudent(svMy, hk1_2526, List.of(
                new Object[]{mPOLI1205, 10.0, 9.5, 10.0, 9.8, 4.0, "A+"},
                new Object[]{mPOLI1206, 9.5, 9.5, 9.8, 9.6, 4.0, "A+"},
                new Object[]{mITEC2504, 10.0, 10.0, 10.0, 10.0, 4.0, "A+"},
                new Object[]{mITEC3401, 9.5, 10.0, 9.6, 9.7, 4.0, "A+"},
                new Object[]{mITEC3201, 10.0, 9.5, 10.0, 9.8, 4.0, "A+"},
                new Object[]{mITEC4402, 9.5, 9.5, 9.5, 9.5, 4.0, "A+"}
        ));

        createSemesterGradesForStudent(svKhang, hk1_2526, List.of(
                new Object[]{mPOLI1205, 9.0, 9.0, 9.0, 9.0, 3.5, "B+"},
                new Object[]{mPOLI1206, 9.5, 9.5, 9.5, 9.5, 4.0, "A+"},
                new Object[]{mITEC2504, 9.5, 10.0, 9.5, 9.6, 4.0, "A+"},
                new Object[]{mITEC3401, 9.5, 9.0, 9.5, 9.4, 4.0, "A+"},
                new Object[]{mITEC3201, 9.0, 9.0, 9.0, 9.0, 3.5, "B+"},
                new Object[]{mITEC4402, 9.0, 9.5, 9.2, 9.2, 4.0, "A+"}
        ));

        createSemesterGradesForStudent(svDang23, hk1_2526, List.of(
                new Object[]{mPOLI1205, 8.0, 8.0, 8.0, 8.0, 3.5, "B+"},
                new Object[]{mPOLI1206, 8.0, 7.5, 8.0, 7.8, 3.0, "B"},
                new Object[]{mITEC2504, 8.5, 8.0, 8.2, 8.2, 3.5, "B+"},
                new Object[]{mITEC3401, 8.0, 8.0, 8.0, 8.0, 3.5, "B+"},
                new Object[]{mITEC3201, 8.5, 8.5, 8.5, 8.5, 3.5, "B+"},
                new Object[]{mITEC4402, 8.0, 8.0, 7.8, 7.9, 3.0, "B"}
        ));

        createSemesterGradesForStudent(svVan, hk1_2526, List.of(
                new Object[]{mPOLI1205, 6.5, 6.5, 6.5, 6.5, 2.5, "C+"},
                new Object[]{mPOLI1206, 7.0, 6.5, 6.8, 6.8, 2.5, "C+"},
                new Object[]{mITEC2504, 7.0, 7.0, 7.0, 7.0, 3.0, "B"},
                new Object[]{mITEC3401, 6.5, 6.5, 6.5, 6.5, 2.5, "C+"},
                new Object[]{mITEC3201, 7.0, 7.0, 7.0, 7.0, 3.0, "B"},
                new Object[]{mITEC4402, 6.8, 6.5, 6.5, 6.6, 2.5, "C+"}
        ));

        createSemesterGradesForStudent(svKiet, hk1_2526, List.of(
                new Object[]{mPOLI1205, 5.5, 5.5, 5.5, 5.5, 2.0, "C"},
                new Object[]{mPOLI1206, 5.5, 5.0, 5.2, 5.2, 2.0, "C"},
                new Object[]{mITEC2504, 6.0, 5.5, 5.8, 5.8, 2.0, "C"},
                new Object[]{mITEC3401, 5.5, 5.5, 5.5, 5.5, 2.0, "C"},
                new Object[]{mITEC3201, 6.5, 6.0, 6.2, 6.2, 2.5, "C+"},
                new Object[]{mITEC4402, 6.0, 5.5, 5.5, 5.6, 2.0, "C"}
        ));

        createSemesterGradesForStudent(svTien, hk1_2526, List.of(
                new Object[]{mPOLI1205, 5.5, 5.0, 5.2, 5.2, 2.0, "C"},
                new Object[]{mPOLI1206, 3.0, 2.0, 2.0, 2.2, 0.0, "F"},
                new Object[]{mITEC2504, 2.0, 3.0, 1.5, 2.0, 0.0, "F"},
                new Object[]{mITEC3401, 2.5, 2.0, 2.0, 2.1, 0.0, "F"},
                new Object[]{mITEC3201, 5.5, 5.5, 5.5, 5.5, 2.0, "C"},
                new Object[]{mITEC4402, 5.0, 5.0, 5.0, 5.0, 2.0, "C"}
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

        DotXetHocBong dot1 = dotXetHocBongRepository.save(DotXetHocBong.builder()
                .maDot("HB_HK1_2024")
                .tenDot("Học bổng Khuyến khích Học tập - HK1 (2024-2025)")
                .hocKy(hocKyList.get(3))
                .ngayBatDau(LocalDate.of(2024, 9, 1))
                .ngayKetThuc(LocalDate.of(2024, 10, 30))
                .trangThai("DA_CONG_BO")
                .build());

        DotXetHocBong dot2 = dotXetHocBongRepository.save(DotXetHocBong.builder()
                .maDot("HB_HK2_2024")
                .tenDot("Học bổng Khuyến khích Học tập - HK2 (2024-2025)")
                .hocKy(hocKyList.get(4))
                .ngayBatDau(LocalDate.of(2025, 3, 1))
                .ngayKetThuc(LocalDate.of(2025, 4, 30))
                .trangThai("DA_CONG_BO")
                .build());

        DotXetHocBong dot3 = dotXetHocBongRepository.save(DotXetHocBong.builder()
                .maDot("HB_HK1_2025")
                .tenDot("Học bổng Khuyến khích Học tập - HK1 (2025-2026)")
                .hocKy(hk1_2526)
                .ngayBatDau(LocalDate.of(2025, 9, 1))
                .ngayKetThuc(LocalDate.of(2025, 10, 30))
                .trangThai("DANG_MO")
                .build());

        DotXetHbKhoa dotKhoa1_it = saveDotKhoa(dot1, it, "HB_HK1_2024_IT", 9, BigDecimal.valueOf(105300000), "DA_PHE_DUYET");
        DotXetHbKhoa dotKhoa2_it = saveDotKhoa(dot2, it, "HB_HK2_2024_IT", 9, BigDecimal.valueOf(105300000), "DA_PHE_DUYET");

        HoSoHocBong hsAn = hoSoHocBongRepository.save(HoSoHocBong.builder()
                .maHoSo("HS_HB_HK2_2024_IT_2351010001")
                .sinhVien(svAn)
                .dotXetHbKhoa(dotKhoa2_it)
                .diemXet(BigDecimal.valueOf(3.72))
                .thuHang(1)
                .loaiHocBong("XUAT_SAC")
                .mucHocBong(BigDecimal.valueOf(11700000))
                .trangThai("CHINH_THUC")
                .build());

        HoSoHocBong hsPhuc = hoSoHocBongRepository.save(HoSoHocBong.builder()
                .maHoSo("HS_HB_HK2_2024_IT_2351010011")
                .sinhVien(svPhuc)
                .dotXetHbKhoa(dotKhoa2_it)
                .diemXet(BigDecimal.valueOf(3.35))
                .thuHang(2)
                .loaiHocBong("GIOI")
                .mucHocBong(BigDecimal.valueOf(8190000))
                .trangThai("CHINH_THUC")
                .build());

        HoSoHocBong hsTrinh = hoSoHocBongRepository.save(HoSoHocBong.builder()
                .maHoSo("HS_HB_HK2_2024_IT_2351010216")
                .sinhVien(svTrinh)
                .dotXetHbKhoa(dotKhoa2_it)
                .diemXet(BigDecimal.valueOf(3.65))
                .thuHang(3)
                .loaiHocBong("GIOI")
                .mucHocBong(BigDecimal.valueOf(8190000))
                .trangThai("CHINH_THUC")
                .build());

        HoSoHocBong hsKhoi = hoSoHocBongRepository.save(HoSoHocBong.builder()
                .maHoSo("HS_HB_HK2_2024_IT_2351010012")
                .sinhVien(svKhoi)
                .dotXetHbKhoa(dotKhoa2_it)
                .diemXet(BigDecimal.valueOf(2.85))
                .thuHang(4)
                .loaiHocBong("KHA")
                .mucHocBong(BigDecimal.valueOf(5850000))
                .trangThai("CHINH_THUC")
                .build());

        HoSoHocBong hsDang = hoSoHocBongRepository.save(HoSoHocBong.builder()
                .maHoSo("HS_HB_HK2_2024_IT_2351010023")
                .sinhVien(svDang23)
                .dotXetHbKhoa(dotKhoa2_it)
                .diemXet(BigDecimal.valueOf(2.90))
                .thuHang(5)
                .loaiHocBong("KHA")
                .mucHocBong(BigDecimal.valueOf(5850000))
                .trangThai("CHINH_THUC")
                .build());

        HoSoHocBong hsVan = hoSoHocBongRepository.save(HoSoHocBong.builder()
                .maHoSo("HS_HB_HK2_2024_IT_2351010024")
                .sinhVien(svVan)
                .dotXetHbKhoa(dotKhoa2_it)
                .diemXet(BigDecimal.valueOf(2.68))
                .thuHang(6)
                .loaiHocBong("KHA")
                .mucHocBong(BigDecimal.valueOf(5850000))
                .trangThai("CHINH_THUC")
                .build());

        kienNghiRepository.save(new KienNghi(
                "KN_2351010216_01",
                "Kính gửi Ban Chủ nhiệm Khoa CNTT và Phòng CTSV: Trong đợt xét học bổng Học kỳ 2 (2024-2025), điểm trung bình học tập GPA của em đạt 3.65 (đủ điều kiện mức Xuất sắc). Tuy nhiên điểm rèn luyện của em mới được ghi nhận 82 điểm (loại Tốt) do chưa cập nhật hoạt động 'Chiến dịch Xuân tình nguyện' (+10 điểm ĐRL), nên kết quả xét học bổng của em bị xếp loại Giỏi (70% học phí). Kính mong quý Thầy Cô rà soát và cập nhật lại điểm rèn luyện lên 92 điểm để cả điểm học tập và điểm rèn luyện của em đều đạt loại Xuất sắc (100% học phí) ạ. Em xin chân thành cảm ơn!",
                "",
                "CHO_XU_LY",
                dotKhoa2_it,
                hsTrinh,
                null,
                null,
                LocalDate.now().minusDays(2)
        ));

        HocKy hk3_2526 = hocKyList.get(8);
        minhChungRenLuyenRepository.save(new MinhChungRenLuyen(
                "MC_2351010216_HK3_01",
                "Hiến tóc cho bệnh nhân ung thư - Mạng lưới Ung thư vú Việt Nam (BCNV)",
                BigDecimal.valueOf(10.0),
                "",
                "Tham gia hiến 25cm tóc tự nhiên hỗ trợ chế tác tóc giả cho bệnh nhân ung thư theo chương trình Thư viện Tóc của BCNV. Minh chứng gồm giấy chứng nhận tiếp nhận tóc hiến.",
                "CHO_DUYET",
                null,
                svTrinh,
                hk3_2526,
                null,
                null,
                LocalDate.now()
        ));

        saveDotKhoa(dot3, it, "HB_HK1_2025_IT", 4, BigDecimal.valueOf(28080000), "CHUA_XET");
        saveDotKhoa(dot3, bio, "HB_HK1_2025_BIO", 0, BigDecimal.ZERO, "CHUA_XET");
        saveDotKhoa(dot3, acc, "HB_HK1_2025_ACC", 0, BigDecimal.ZERO, "CHUA_XET");
        saveDotKhoa(dot3, eco, "HB_HK1_2025_ECO", 0, BigDecimal.ZERO, "CHUA_XET");
        saveDotKhoa(dot3, soc, "HB_HK1_2025_SOC", 0, BigDecimal.ZERO, "CHUA_XET");
        saveDotKhoa(dot3, bas, "HB_HK1_2025_BAS", 0, BigDecimal.ZERO, "CHUA_XET");
        saveDotKhoa(dot3, law, "HB_HK1_2025_LAW", 0, BigDecimal.ZERO, "CHUA_XET");
        saveDotKhoa(dot3, fl, "HB_HK1_2025_FL", 0, BigDecimal.ZERO, "CHUA_XET");
        saveDotKhoa(dot3, ba, "HB_HK1_2025_BA", 0, BigDecimal.ZERO, "CHUA_XET");
        saveDotKhoa(dot3, bf, "HB_HK1_2025_BF", 0, BigDecimal.ZERO, "CHUA_XET");
        saveDotKhoa(dot3, ce, "HB_HK1_2025_CE", 0, BigDecimal.ZERO, "CHUA_XET");
        saveDotKhoa(dot3, spe, "HB_HK1_2025_SPE", 0, BigDecimal.ZERO, "CHUA_XET");

        quyTacHocBongRepository.save(QuyTacHocBong.builder()
                .maQuyTac("QT_HB_HK1_2024")
                .dotXetHocBong(dot1)
                .diemTbDuoiThieu(BigDecimal.valueOf(2.50))
                .diemRlToiThieu(BigDecimal.valueOf(65.0))
                .soTinChiToiThieu(14)
                .khongNoMon(true)
                .phienBan(1)
                .mucHocBongXuatSac(BigDecimal.valueOf(100))
                .mucHocBongGioi(BigDecimal.valueOf(70))
                .mucHocBongKha(BigDecimal.valueOf(50))
                .ghiChu("Quy chế Học bổng Khuyến khích Học tập OU - HK1 (2024-2025)")
                .build());

        quyTacHocBongRepository.save(QuyTacHocBong.builder()
                .maQuyTac("QT_HB_HK2_2024")
                .dotXetHocBong(dot2)
                .diemTbDuoiThieu(BigDecimal.valueOf(2.50))
                .diemRlToiThieu(BigDecimal.valueOf(65.0))
                .soTinChiToiThieu(14)
                .khongNoMon(true)
                .phienBan(1)
                .mucHocBongXuatSac(BigDecimal.valueOf(100))
                .mucHocBongGioi(BigDecimal.valueOf(70))
                .mucHocBongKha(BigDecimal.valueOf(50))
                .ghiChu("Quy chế Học bổng Khuyến khích Học tập OU - HK2 (2024-2025)")
                .build());

        quyTacHocBongRepository.save(QuyTacHocBong.builder()
                .maQuyTac("QT_HB_HK1_2025")
                .dotXetHocBong(dot3)
                .diemTbDuoiThieu(BigDecimal.valueOf(2.50))
                .diemRlToiThieu(BigDecimal.valueOf(65.0))
                .soTinChiToiThieu(14)
                .khongNoMon(true)
                .phienBan(1)
                .mucHocBongXuatSac(BigDecimal.valueOf(100))
                .mucHocBongGioi(BigDecimal.valueOf(70))
                .mucHocBongKha(BigDecimal.valueOf(50))
                .ghiChu("Quy chế Học bổng Khuyến khích Học tập OU - HK1 (2025-2026) Áp dụng Quỹ 8% học phí theo Ngành & Tỷ lệ % học phí")
                .build());

        try {
            scholarshipRuleEngineService.executeRuleEngine("HB_HK1_2025_IT");
            scholarshipRuleEngineService.executeRuleEngine("HB_HK1_2024_IT");
        } catch (Exception e) {
            System.err.println("Lỗi khởi tạo hồ sơ học bổng ban đầu: " + e.getMessage());
        }
    }

    private NguoiDung saveUser(String username, String rawPassword, String hoTen, String email, String sdt, String vaiTro) {
        return nguoiDungRepository.findByTenDangNhap(username).orElseGet(() -> nguoiDungRepository.save(NguoiDung.builder()
                .tenDangNhap(username)
                .matKhau(passwordEncoder.encode(rawPassword))
                .matKhauHienThi(rawPassword)
                .hoTen(hoTen)
                .email(email)
                .soDienThoai(sdt)
                .vaiTro(vaiTro)
                .trangThai("HOAT_DONG")
                .build()));
    }

    private void saveCurriculum(Nganh nganh, MonHoc monHoc, int hocKyGoiY, String loaiHocPhan, String heDaoTao) {
        if (!chuongTrinhDaoTaoRepository.existsByNganh_MaNganhAndMonHoc_MaMon(nganh.getMaNganh(), monHoc.getMaMon())) {
            chuongTrinhDaoTaoRepository.save(ChuongTrinhDaoTao.builder()
                    .nganh(nganh)
                    .monHoc(monHoc)
                    .hocKyGoiY(hocKyGoiY)
                    .loaiHocPhan(loaiHocPhan)
                    .heDaoTao(heDaoTao)
                    .build());
        }
    }

    private void createCanBoKhoa(String username, String hoTen, String email, String sdt, Khoa khoa, String maNv, String chucVu, String lopPhuTrach) {
        NguoiDung u = saveUser(username, "khoa123", hoTen, email, sdt, "ROLE_CAN_BO_KHOA");

        NhanVien nv = nhanVienRepository.findById(maNv).orElseGet(() -> nhanVienRepository.save(NhanVien.builder()
                .maNv(maNv)
                .nguoiDung(u)
                .chucVu(chucVu)
                .donViCongTac(khoa.getTenKhoa())
                .build()));

        canBoKhoaRepository.findById(maNv).ifPresentOrElse(
                cbk -> {
                    cbk.setLopPhuTrach(lopPhuTrach);
                    canBoKhoaRepository.save(cbk);
                },
                () -> canBoKhoaRepository.save(CanBoKhoa.builder()
                        .maNv(nv.getMaNv())
                        .nhanVien(nv)
                        .khoa(khoa)
                        .lopPhuTrach(lopPhuTrach)
                        .trangThaiCongTac("Đang công tác")
                        .build())
        );
    }

    private DotXetHbKhoa saveDotKhoa(DotXetHocBong dot, Khoa khoa, String maDotKhoa, int chiTieu, BigDecimal nganSach, String trangThai) {
        return dotXetHbKhoaRepository.save(DotXetHbKhoa.builder()
                .maDotXetHbKhoa(maDotKhoa)
                .dotXetHocBong(dot)
                .khoa(khoa)
                .chiTieu(chiTieu)
                .nganSachKhoa(nganSach)
                .hanPhanHoi(LocalDate.now().plusDays(15))
                .trangThai(trangThai != null ? trangThai : "CHUA_XET")
                .build());
    }

    private SinhVien createStudentWithFullHistory(
            String mssv, String cccd, String hoTen, String email, String sdt, String gioiTinh,
            LopSinhHoat lop, List<HocKy> hocKyList,
            double[] gpaArr, double[] drlArr
    ) {
        return createStudentWithCustomRecord(mssv, cccd, hoTen, email, sdt, gioiTinh, "DANG_HOC", lop, hocKyList, gpaArr, drlArr, null, null);
    }

    private SinhVien createStudentWithCustomRecord(
            String mssv, String cccd, String hoTen, String email, String sdt, String gioiTinh,
            String trangThaiHoc, LopSinhHoat lop, List<HocKy> hocKyList,
            double[] gpaArr, double[] drlArr, int[] creditsArr, boolean[] failArr
    ) {
        NguoiDung user = saveUser(mssv, cccd, hoTen, email, sdt, "ROLE_SINH_VIEN");

        SinhVien sv = sinhVienRepository.findById(mssv).orElseGet(() -> sinhVienRepository.save(SinhVien.builder()
                .mssv(mssv)
                .cccd(cccd)
                .nguoiDung(user)
                .ngaySinh(LocalDate.of(2005, 5, 15))
                .gioiTinh(gioiTinh)
                .diaChi("97 Võ Văn Tần, Phường Võ Thị Sáu, Quận 3, TP.HCM")
                .trangThaiHoc(trangThaiHoc != null ? trangThaiHoc : "DANG_HOC")
                .lopSinhHoat(lop)
                .build()));

        sv.setTrangThaiHoc(trangThaiHoc != null ? trangThaiHoc : "DANG_HOC");
        sv.setLopSinhHoat(lop);
        sv = sinhVienRepository.save(sv);

        for (int i = 0; i < hocKyList.size() && i < gpaArr.length; i++) {
            HocKy hk = hocKyList.get(i);
            if (gpaArr[i] > 0.001) {
                BigDecimal gpa = BigDecimal.valueOf(gpaArr[i]);
                int credits = (creditsArr != null && i < creditsArr.length) ? creditsArr[i] : (i % 3 == 2 ? 14 : 18);
                boolean coRot = (failArr != null && i < failArr.length) && failArr[i];

                ketQuaHocTapRepository.save(KetQuaHocTap.builder()
                        .id("GPA_" + mssv + "_" + hk.getMaHocKy())
                        .sinhVien(sv)
                        .hocKy(hk)
                        .diemTrungBinh(gpa)
                        .soTinChi(credits)
                        .coHocPhanRot(coRot)
                        .build());
            }

            if (drlArr[i] > 0.001) {
                BigDecimal drl = BigDecimal.valueOf(drlArr[i]);
                String xepLoai = drl.compareTo(BigDecimal.valueOf(90)) >= 0 ? "Xuất sắc" :
                        drl.compareTo(BigDecimal.valueOf(80)) >= 0 ? "Tốt" :
                        drl.compareTo(BigDecimal.valueOf(65)) >= 0 ? "Khá" :
                        drl.compareTo(BigDecimal.valueOf(50)) >= 0 ? "Trung bình" : "Yếu";

                ketQuaRenLuyenRepository.save(KetQuaRenLuyen.builder()
                        .id("DRL_" + mssv + "_" + hk.getMaHocKy())
                        .sinhVien(sv)
                        .hocKy(hk)
                        .diemRenLuyen(drl)
                        .xepLoai(xepLoai)
                        .build());
            }
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
                    .dat(tk10 >= 4.0 && !"F".equalsIgnoreCase(chu))
                    .build());
        }
    }
}
