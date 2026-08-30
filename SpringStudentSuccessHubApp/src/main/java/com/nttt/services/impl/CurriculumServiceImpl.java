package com.nttt.services.impl;

import com.nttt.dto.*;
import com.nttt.pojo.*;
import com.nttt.repositories.*;
import com.nttt.services.CurriculumService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class CurriculumServiceImpl implements CurriculumService {

    @Autowired
    private MonHocRepository monHocRepository;

    @Autowired
    private ChuongTrinhDaoTaoRepository chuongTrinhDaoTaoRepository;

    @Autowired
    private DiemHocPhanRepository diemHocPhanRepository;

    @Autowired
    private SinhVienRepository sinhVienRepository;

    @Autowired
    private HocKyRepository hocKyRepository;

    @Autowired
    private NganhRepository nganhRepository;

    @Autowired
    private KhoaRepository khoaRepository;

    @Override
    public List<MonHocDTO> getAllMonHoc() {
        if (monHocRepository.count() == 0) {
            ensureDefaultCurriculumInitialized("CS");
        }
        return monHocRepository.findAll().stream().map(this::convertToMonHocDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public List<ChuongTrinhDaoTaoDTO> getCurriculumByNganh(String maNganh) {
        String targetNganh = (maNganh == null || maNganh.trim().isEmpty()) ? "CS" : maNganh.trim();
        List<ChuongTrinhDaoTao> list = chuongTrinhDaoTaoRepository.findByNganh_MaNganhOrderByHocKyGoiYAsc(targetNganh);
        if (list.isEmpty()) {
            ensureDefaultCurriculumInitialized(targetNganh);
            list = chuongTrinhDaoTaoRepository.findByNganh_MaNganhOrderByHocKyGoiYAsc(targetNganh);
        }
        if (list.isEmpty() && !"CS".equalsIgnoreCase(targetNganh)) {
            ensureDefaultCurriculumInitialized("CS");
            list = chuongTrinhDaoTaoRepository.findByNganh_MaNganhOrderByHocKyGoiYAsc("CS");
        }
        return list.stream().map(this::convertToChuongTrinhDaoTaoDTO).collect(Collectors.toList());
    }

    private synchronized void ensureDefaultCurriculumInitialized(String maNganh) {
        BigDecimal donGiaChuan = new BigDecimal("650000");
        BigDecimal donGiaClc = new BigDecimal("1450000");

        Khoa it = khoaRepository.findById("IT").orElseGet(() -> khoaRepository.save(new Khoa("IT", "Khoa Công nghệ Thông tin")));
        Khoa bas = khoaRepository.findById("BAS").orElseGet(() -> khoaRepository.save(new Khoa("BAS", "Khoa Khoa học Cơ bản")));
        Khoa fl = khoaRepository.findById("FL").orElseGet(() -> khoaRepository.save(new Khoa("FL", "Khoa Ngoại ngữ")));
        Khoa soc = khoaRepository.findById("SOC").orElseGet(() -> khoaRepository.save(new Khoa("SOC", "Khoa Khoa học Xã hội")));
        Khoa law = khoaRepository.findById("LAW").orElseGet(() -> khoaRepository.save(new Khoa("LAW", "Khoa Luật")));
        Khoa spe = khoaRepository.findById("SPE").orElseGet(() -> khoaRepository.save(new Khoa("SPE", "Khoa Đào tạo Đặc biệt")));

        MonHoc mMATH1315 = getOrCreateMonHoc("MATH1315", "Xác suất và Thống kê", 3, 45, 15, donGiaChuan, bas);
        MonHoc mGENG1311 = getOrCreateMonHoc("GENG1311", "Tiếng Anh Nâng cao 1", 3, 45, 0, donGiaChuan, fl);
        MonHoc mGENG1312 = getOrCreateMonHoc("GENG1312", "Tiếng Anh Nâng cao 2", 3, 45, 0, donGiaChuan, fl);
        MonHoc mITEC1401 = getOrCreateMonHoc("ITEC1401", "Nhập môn Tin học", 3, 30, 30, donGiaChuan, it);
        MonHoc mITEC1505 = getOrCreateMonHoc("ITEC1505", "Cơ sở Lập trình C/C++", 4, 45, 30, donGiaChuan, it);

        MonHoc mMATH1314 = getOrCreateMonHoc("MATH1314", "Giải tích", 3, 45, 15, donGiaChuan, bas);
        MonHoc mGENG1313 = getOrCreateMonHoc("GENG1313", "Tiếng Anh Nâng cao 3", 3, 45, 0, donGiaChuan, fl);
        MonHoc mGENG1314 = getOrCreateMonHoc("GENG1314", "Tiếng Anh Nâng cao 4", 3, 45, 0, donGiaChuan, fl);
        MonHoc mITEC1504 = getOrCreateMonHoc("ITEC1504", "Kỹ thuật Lập trình", 4, 45, 30, donGiaChuan, it);
        MonHoc mITEC1310 = getOrCreateMonHoc("ITEC1310", "Hệ điều hành và Kiến trúc Máy tính", 3, 35, 10, donGiaChuan, it);

        MonHoc mMATH1313 = getOrCreateMonHoc("MATH1313", "Đại số Tuyến tính", 3, 45, 15, donGiaChuan, bas);
        MonHoc mGENG1315 = getOrCreateMonHoc("GENG1315", "Tiếng Anh Nâng cao 5", 3, 45, 0, donGiaChuan, fl);
        MonHoc mITEC1427 = getOrCreateMonHoc("ITEC1427", "Cấu trúc Dữ liệu và Thuật giải 1", 4, 45, 30, donGiaChuan, it);
        MonHoc mITEC1404 = getOrCreateMonHoc("ITEC1404", "Ứng dụng Web", 3, 30, 30, donGiaChuan, it);
        MonHoc mITEC2502 = getOrCreateMonHoc("ITEC2502", "Cơ sở Dữ liệu Quan hệ", 4, 45, 30, donGiaChuan, it);

        MonHoc mPOLI1304 = getOrCreateMonHoc("POLI1304", "Triết học Mác - Lênin", 3, 45, 0, donGiaChuan, soc);
        MonHoc mITEC1328 = getOrCreateMonHoc("ITEC1328", "Cấu trúc Dữ liệu và Thuật giải 2", 3, 30, 30, donGiaChuan, it);
        MonHoc mITEC2503 = getOrCreateMonHoc("ITEC2503", "Mạng Máy tính", 4, 45, 30, donGiaChuan, it);
        MonHoc mMATH2402 = getOrCreateMonHoc("MATH2402", "Toán Rời rạc", 4, 60, 0, donGiaChuan, bas);

        MonHoc mPOLI1205 = getOrCreateMonHoc("POLI1205", "Kinh tế Chính trị Mác - Lênin", 2, 30, 0, donGiaChuan, soc);
        MonHoc mPOLI1206 = getOrCreateMonHoc("POLI1206", "Chủ nghĩa Xã hội Khoa học", 2, 30, 0, donGiaChuan, soc);
        MonHoc mITEC2504 = getOrCreateMonHoc("ITEC2504", "Lập trình Hướng đối tượng (Java)", 4, 45, 30, donGiaChuan, it);
        MonHoc mITEC3401 = getOrCreateMonHoc("ITEC3401", "Phân tích Thiết kế Hệ thống", 4, 60, 0, donGiaChuan, it);
        MonHoc mITEC3201 = getOrCreateMonHoc("ITEC3201", "Kỹ năng Nghề nghiệp", 2, 30, 0, donGiaChuan, it);

        MonHoc mPOLI1207 = getOrCreateMonHoc("POLI1207", "Lịch sử Đảng Cộng sản Việt Nam", 2, 30, 0, donGiaChuan, soc);
        MonHoc mPOLI1208 = getOrCreateMonHoc("POLI1208", "Tư tưởng Hồ Chí Minh", 2, 30, 0, donGiaChuan, soc);
        MonHoc mITEC1311 = getOrCreateMonHoc("ITEC1311", "Mẫu Thiết kế Hướng đối tượng", 3, 30, 30, donGiaChuan, it);
        MonHoc mITEC3413 = getOrCreateMonHoc("ITEC3413", "Trí tuệ Nhân tạo", 3, 30, 30, donGiaChuan, it);
        MonHoc mITEC4402 = getOrCreateMonHoc("ITEC4402", "Quản trị Hệ Cơ sở Dữ liệu", 3, 30, 30, donGiaChuan, it);
        MonHoc mITEC4409 = getOrCreateMonHoc("ITEC4409", "Công nghệ Phần mềm", 3, 30, 30, donGiaChuan, it);
        MonHoc mITEC3421 = getOrCreateMonHoc("ITEC3421", "Các Công nghệ Lập trình Hiện đại", 3, 30, 30, donGiaChuan, it);
        MonHoc mITEC2314 = getOrCreateMonHoc("ITEC2314", "Máy học (Machine Learning)", 3, 30, 30, donGiaChuan, it);
        MonHoc mITEC4415 = getOrCreateMonHoc("ITEC4415", "Kiểm thử Phần mềm", 3, 30, 30, donGiaChuan, it);
        MonHoc mITEC2302 = getOrCreateMonHoc("ITEC2302", "Phát triển Hệ thống Web", 3, 30, 30, donGiaChuan, it);
        MonHoc mGLAW1315 = getOrCreateMonHoc("GLAW1315", "Pháp luật Đại cương", 3, 45, 0, donGiaChuan, law);
        MonHoc mITEC4401 = getOrCreateMonHoc("ITEC4401", "Đồ án Ngành", 4, 0, 120, donGiaChuan, it);
        MonHoc mITEC4899 = getOrCreateMonHoc("ITEC4899", "Thực tập Tốt nghiệp", 4, 0, 120, donGiaChuan, it);
        MonHoc mITEC4699 = getOrCreateMonHoc("ITEC4699", "Khóa luận Tốt nghiệp", 6, 0, 180, donGiaChuan, it);

        MonHoc mCSC101 = getOrCreateMonHoc("CSC101", "Advanced Programming (CLC)", 4, 45, 30, donGiaClc, spe);
        MonHoc mCSC201 = getOrCreateMonHoc("CSC201", "Data Structures & Algorithms (CLC)", 4, 45, 30, donGiaClc, spe);
        MonHoc mCSC301 = getOrCreateMonHoc("CSC301", "Web Application Development (CLC)", 3, 30, 30, donGiaClc, spe);
        MonHoc mCSC401 = getOrCreateMonHoc("CSC401", "Database Systems (CLC)", 4, 45, 30, donGiaClc, spe);
        MonHoc mCSC501 = getOrCreateMonHoc("CSC501", "Artificial Intelligence (CLC)", 3, 30, 30, donGiaClc, spe);

        Nganh cs = nganhRepository.findById("CS").orElseGet(() -> nganhRepository.save(new Nganh("CS", "Khoa học Máy tính", "CHUAN", it)));
        Nganh itMajor = nganhRepository.findById("IT").orElseGet(() -> nganhRepository.save(new Nganh("IT", "Công nghệ Thông tin", "CHUAN", it)));
        Nganh se = nganhRepository.findById("SE").orElseGet(() -> nganhRepository.save(new Nganh("SE", "Kỹ thuật Phần mềm", "CHUAN", it)));
        Nganh csc = nganhRepository.findById("CSC").orElseGet(() -> nganhRepository.save(new Nganh("CSC", "Khoa học Máy tính (Chất lượng cao)", "CHAT_LUONG_CAO", spe)));

        // CS: 11 Học kỳ chuẩn QĐ 561
        saveCurriculumIfAbsent(cs, mMATH1315, 1, "BAT_BUOC", "CHUAN");
        saveCurriculumIfAbsent(cs, mGENG1311, 1, "BAT_BUOC", "CHUAN");
        saveCurriculumIfAbsent(cs, mGENG1312, 1, "BAT_BUOC", "CHUAN");
        saveCurriculumIfAbsent(cs, mITEC1401, 1, "BAT_BUOC", "CHUAN");
        saveCurriculumIfAbsent(cs, mITEC1505, 1, "BAT_BUOC", "CHUAN");

        saveCurriculumIfAbsent(cs, mMATH1314, 2, "BAT_BUOC", "CHUAN");
        saveCurriculumIfAbsent(cs, mGENG1313, 2, "BAT_BUOC", "CHUAN");
        saveCurriculumIfAbsent(cs, mGENG1314, 2, "BAT_BUOC", "CHUAN");
        saveCurriculumIfAbsent(cs, mITEC1504, 2, "BAT_BUOC", "CHUAN");
        saveCurriculumIfAbsent(cs, mITEC1310, 2, "BAT_BUOC", "CHUAN");

        saveCurriculumIfAbsent(cs, mMATH1313, 3, "BAT_BUOC", "CHUAN");
        saveCurriculumIfAbsent(cs, mGENG1315, 3, "BAT_BUOC", "CHUAN");
        saveCurriculumIfAbsent(cs, mITEC1427, 3, "BAT_BUOC", "CHUAN");
        saveCurriculumIfAbsent(cs, mITEC1404, 3, "BAT_BUOC", "CHUAN");
        saveCurriculumIfAbsent(cs, mITEC2502, 3, "BAT_BUOC", "CHUAN");

        saveCurriculumIfAbsent(cs, mPOLI1304, 4, "BAT_BUOC", "CHUAN");
        saveCurriculumIfAbsent(cs, mITEC1328, 4, "BAT_BUOC", "CHUAN");
        saveCurriculumIfAbsent(cs, mITEC2503, 4, "BAT_BUOC", "CHUAN");
        saveCurriculumIfAbsent(cs, mMATH2402, 4, "BAT_BUOC", "CHUAN");

        saveCurriculumIfAbsent(cs, mPOLI1205, 5, "BAT_BUOC", "CHUAN");
        saveCurriculumIfAbsent(cs, mPOLI1206, 5, "BAT_BUOC", "CHUAN");
        saveCurriculumIfAbsent(cs, mITEC2504, 5, "BAT_BUOC", "CHUAN");
        saveCurriculumIfAbsent(cs, mITEC3401, 5, "BAT_BUOC", "CHUAN");
        saveCurriculumIfAbsent(cs, mITEC3201, 5, "BAT_BUOC", "CHUAN");
        saveCurriculumIfAbsent(cs, mITEC4402, 5, "BAT_BUOC", "CHUAN");

        saveCurriculumIfAbsent(cs, mPOLI1207, 6, "BAT_BUOC", "CHUAN");
        saveCurriculumIfAbsent(cs, mPOLI1208, 6, "BAT_BUOC", "CHUAN");
        saveCurriculumIfAbsent(cs, mITEC1311, 6, "BAT_BUOC", "CHUAN");
        saveCurriculumIfAbsent(cs, mITEC3413, 6, "BAT_BUOC", "CHUAN");

        saveCurriculumIfAbsent(cs, mITEC4409, 7, "TU_CHON", "CHUAN");
        saveCurriculumIfAbsent(cs, mITEC3421, 7, "TU_CHON", "CHUAN");
        saveCurriculumIfAbsent(cs, mITEC2314, 8, "BAT_BUOC", "CHUAN");
        saveCurriculumIfAbsent(cs, mITEC4415, 8, "TU_CHON", "CHUAN");
        saveCurriculumIfAbsent(cs, mITEC2302, 8, "TU_CHON", "CHUAN");
        saveCurriculumIfAbsent(cs, mGLAW1315, 9, "BAT_BUOC", "CHUAN");
        saveCurriculumIfAbsent(cs, mITEC4401, 9, "BAT_BUOC", "CHUAN");
        saveCurriculumIfAbsent(cs, mITEC4899, 10, "BAT_BUOC", "CHUAN");
        saveCurriculumIfAbsent(cs, mITEC4699, 11, "BAT_BUOC", "CHUAN");

        // IT
        saveCurriculumIfAbsent(itMajor, mITEC1401, 1, "BAT_BUOC", "CHUAN");
        saveCurriculumIfAbsent(itMajor, mITEC1505, 1, "BAT_BUOC", "CHUAN");
        saveCurriculumIfAbsent(itMajor, mMATH1315, 1, "BAT_BUOC", "CHUAN");
        saveCurriculumIfAbsent(itMajor, mITEC1427, 2, "BAT_BUOC", "CHUAN");
        saveCurriculumIfAbsent(itMajor, mITEC2502, 2, "BAT_BUOC", "CHUAN");
        saveCurriculumIfAbsent(itMajor, mITEC2503, 3, "BAT_BUOC", "CHUAN");
        saveCurriculumIfAbsent(itMajor, mITEC2504, 3, "BAT_BUOC", "CHUAN");

        // SE
        saveCurriculumIfAbsent(se, mITEC1505, 1, "BAT_BUOC", "CHUAN");
        saveCurriculumIfAbsent(se, mITEC1504, 1, "BAT_BUOC", "CHUAN");
        saveCurriculumIfAbsent(se, mITEC1427, 2, "BAT_BUOC", "CHUAN");
        saveCurriculumIfAbsent(se, mITEC4409, 2, "BAT_BUOC", "CHUAN");

        // CSC
        saveCurriculumIfAbsent(csc, mCSC101, 1, "BAT_BUOC", "CHAT_LUONG_CAO");
        saveCurriculumIfAbsent(csc, mCSC201, 2, "BAT_BUOC", "CHAT_LUONG_CAO");
        saveCurriculumIfAbsent(csc, mCSC301, 3, "BAT_BUOC", "CHAT_LUONG_CAO");
        saveCurriculumIfAbsent(csc, mCSC401, 4, "BAT_BUOC", "CHAT_LUONG_CAO");
        saveCurriculumIfAbsent(csc, mCSC501, 5, "BAT_BUOC", "CHAT_LUONG_CAO");
    }

    private MonHoc getOrCreateMonHoc(String maMon, String tenMon, int soTinChi, int lt, int th, BigDecimal donGia, Khoa khoa) {
        return monHocRepository.findById(maMon).orElseGet(() -> {
            return monHocRepository.save(new MonHoc(maMon, tenMon, soTinChi, lt, th, donGia, khoa));
        });
    }

    private void saveCurriculumIfAbsent(Nganh nganh, MonHoc monHoc, int hocKyGoiY, String loaiHocPhan, String heDaoTao) {
        if (nganh == null || monHoc == null) return;
        List<ChuongTrinhDaoTao> existing = chuongTrinhDaoTaoRepository.findByNganh_MaNganhAndHocKyGoiY(nganh.getMaNganh(), hocKyGoiY);
        boolean exists = existing.stream().anyMatch(c -> c.getMonHoc() != null && monHoc.getMaMon().equalsIgnoreCase(c.getMonHoc().getMaMon()));
        if (!exists) {
            chuongTrinhDaoTaoRepository.save(ChuongTrinhDaoTao.builder()
                    .nganh(nganh)
                    .monHoc(monHoc)
                    .hocKyGoiY(hocKyGoiY)
                    .loaiHocPhan(loaiHocPhan)
                    .heDaoTao(heDaoTao)
                    .build());
        }
    }

    @Override
    public BangDiemHocKyDTO getStudentGradesBySemester(String mssv, String maHocKy) {
        SinhVien sv = sinhVienRepository.findById(mssv).orElse(null);
        HocKy hk = hocKyRepository.findById(maHocKy).orElse(null);
        if (sv == null || hk == null) return null;

        List<DiemHocPhan> diemList = diemHocPhanRepository.findBySinhVien_MssvAndHocKy_MaHocKy(mssv, maHocKy);
        List<DiemHocPhanDTO> dtoList = diemList.stream().map(this::convertToDiemHocPhanDTO).collect(Collectors.toList());

        int tongTinChi = 0;
        BigDecimal tongDiem10NhanTC = BigDecimal.ZERO;
        BigDecimal tongDiem4NhanTC = BigDecimal.ZERO;
        BigDecimal tongHocPhi = BigDecimal.ZERO;
        boolean coRot = false;

        for (DiemHocPhan d : diemList) {
            int tc = d.getSoTinChi() != null ? d.getSoTinChi() : 3;
            tongTinChi += tc;

            if (d.getDiemTongKet10() != null) {
                tongDiem10NhanTC = tongDiem10NhanTC.add(d.getDiemTongKet10().multiply(BigDecimal.valueOf(tc)));
            }
            if (d.getDiemHe4() != null) {
                tongDiem4NhanTC = tongDiem4NhanTC.add(d.getDiemHe4().multiply(BigDecimal.valueOf(tc)));
            }
            if (d.getHocPhiMon() != null) {
                tongHocPhi = tongHocPhi.add(d.getHocPhiMon());
            }
            if (Boolean.FALSE.equals(d.getDat()) || (d.getDiemChu() != null && d.getDiemChu().equalsIgnoreCase("F"))) {
                coRot = true;
            }
        }

        BigDecimal dtb10 = tongTinChi > 0 ? tongDiem10NhanTC.divide(BigDecimal.valueOf(tongTinChi), 2, RoundingMode.HALF_UP) : BigDecimal.ZERO;
        BigDecimal gpa4 = tongTinChi > 0 ? tongDiem4NhanTC.divide(BigDecimal.valueOf(tongTinChi), 2, RoundingMode.HALF_UP) : BigDecimal.ZERO;

        String tenNganh = sv.getLopSinhHoat() != null && sv.getLopSinhHoat().getNganh() != null ? sv.getLopSinhHoat().getNganh().getTenNganh() : "";
        String heDaoTao = sv.getLopSinhHoat() != null && sv.getLopSinhHoat().getNganh() != null ? sv.getLopSinhHoat().getNganh().getHeDaoTao() : "CHUAN";

        return BangDiemHocKyDTO.builder()
                .mssv(sv.getMssv())
                .hoTen(sv.getNguoiDung() != null ? sv.getNguoiDung().getHoTen() : "")
                .tenLop(sv.getLopSinhHoat() != null ? sv.getLopSinhHoat().getTenLop() : "")
                .tenNganh(tenNganh)
                .heDaoTao(heDaoTao)
                .maHocKy(hk.getMaHocKy())
                .tenHocKy(hk.getTenHocKy())
                .tongSoTinChi(tongTinChi)
                .diemTrungBinhHocKy10(dtb10)
                .gpaHe4(gpa4)
                .tongHocPhiHocKy(tongHocPhi)
                .coHocPhanRot(coRot)
                .danhSachDiemMonHoc(dtoList)
                .build();
    }

    @Override
    public List<BangDiemHocKyDTO> getAllStudentGrades(String mssv) {
        List<HocKy> allHocKy = hocKyRepository.findAll();
        List<BangDiemHocKyDTO> results = new ArrayList<>();
        for (HocKy hk : allHocKy) {
            BangDiemHocKyDTO dto = getStudentGradesBySemester(mssv, hk.getMaHocKy());
            if (dto != null && dto.getTongSoTinChi() > 0) {
                results.add(dto);
            }
        }
        return results;
    }

    @Override
    public QuyHocBongNganhDTO calculateMajorBudget(String maNganh, String maHocKy) {
        Nganh ng = nganhRepository.findById(maNganh).orElse(null);
        if (ng == null) return null;

        List<DiemHocPhan> diemList = diemHocPhanRepository.findBySinhVien_LopSinhHoat_Nganh_MaNganhAndHocKy_MaHocKy(maNganh, maHocKy);

        // Map học phí theo sinh viên
        Map<String, BigDecimal> svHocPhiMap = new HashMap<>();
        for (DiemHocPhan d : diemList) {
            if (d.getSinhVien() != null && d.getHocPhiMon() != null) {
                String mssv = d.getSinhVien().getMssv();
                svHocPhiMap.put(mssv, svHocPhiMap.getOrDefault(mssv, BigDecimal.ZERO).add(d.getHocPhiMon()));
            }
        }

        BigDecimal tongThuHocPhi = svHocPhiMap.values().stream().reduce(BigDecimal.ZERO, BigDecimal::add);
        // Quỹ học bổng = 8% Tổng học phí thu được
        BigDecimal quyHb8 = tongThuHocPhi.multiply(new BigDecimal("0.08")).setScale(0, RoundingMode.HALF_UP);

        return QuyHocBongNganhDTO.builder()
                .maNganh(ng.getMaNganh())
                .tenNganh(ng.getTenNganh())
                .heDaoTao(ng.getHeDaoTao() != null ? ng.getHeDaoTao() : "CHUAN")
                .maHocKy(maHocKy)
                .tongHocPhiThu(tongThuHocPhi)
                .quyHocBong8PhanTram(quyHb8)
                .tongTienDaCap(BigDecimal.ZERO)
                .tienConLai(quyHb8)
                .soSinhVienDuDieuKien(0)
                .soSinhVienDatHocBong(0)
                .build();
    }

    @Override
    public List<QuyHocBongNganhDTO> calculateAllMajorBudgets(String maHocKy) {
        List<Nganh> allNganh = nganhRepository.findAll();
        List<QuyHocBongNganhDTO> list = new ArrayList<>();
        for (Nganh ng : allNganh) {
            QuyHocBongNganhDTO b = calculateMajorBudget(ng.getMaNganh(), maHocKy);
            if (b != null) {
                list.add(b);
            }
        }
        return list;
    }

    private MonHocDTO convertToMonHocDTO(MonHoc m) {
        if (m == null) return null;
        return MonHocDTO.builder()
                .maMon(m.getMaMon())
                .tenMon(m.getTenMon())
                .soTinChi(m.getSoTinChi())
                .soTietLyThuyet(m.getSoTietLyThuyet())
                .soTietThucHanh(m.getSoTietThucHanh())
                .donGiaTinChi(m.getDonGiaTinChi())
                .maKhoa(m.getKhoa() != null ? m.getKhoa().getMaKhoa() : null)
                .tenKhoa(m.getKhoa() != null ? m.getKhoa().getTenKhoa() : null)
                .build();
    }

    private ChuongTrinhDaoTaoDTO convertToChuongTrinhDaoTaoDTO(ChuongTrinhDaoTao c) {
        if (c == null) return null;
        BigDecimal donGia = c.getMonHoc() != null && c.getMonHoc().getDonGiaTinChi() != null ? c.getMonHoc().getDonGiaTinChi() : new BigDecimal("650000");
        int tc = c.getMonHoc() != null && c.getMonHoc().getSoTinChi() != null ? c.getMonHoc().getSoTinChi() : 3;
        BigDecimal hocPhi = donGia.multiply(BigDecimal.valueOf(tc));

        return ChuongTrinhDaoTaoDTO.builder()
                .id(c.getId())
                .maNganh(c.getNganh() != null ? c.getNganh().getMaNganh() : null)
                .tenNganh(c.getNganh() != null ? c.getNganh().getTenNganh() : null)
                .maMon(c.getMonHoc() != null ? c.getMonHoc().getMaMon() : null)
                .tenMon(c.getMonHoc() != null ? c.getMonHoc().getTenMon() : null)
                .soTinChi(tc)
                .soTietLyThuyet(c.getMonHoc() != null ? c.getMonHoc().getSoTietLyThuyet() : 45)
                .soTietThucHanh(c.getMonHoc() != null ? c.getMonHoc().getSoTietThucHanh() : 0)
                .donGiaTinChi(donGia)
                .hocPhiDuKien(hocPhi)
                .hocKyGoiY(c.getHocKyGoiY())
                .loaiHocPhan(c.getLoaiHocPhan())
                .heDaoTao(c.getHeDaoTao())
                .build();
    }

    private DiemHocPhanDTO convertToDiemHocPhanDTO(DiemHocPhan d) {
        if (d == null) return null;
        return DiemHocPhanDTO.builder()
                .id(d.getId())
                .mssv(d.getSinhVien() != null ? d.getSinhVien().getMssv() : null)
                .hoTen(d.getSinhVien() != null && d.getSinhVien().getNguoiDung() != null ? d.getSinhVien().getNguoiDung().getHoTen() : null)
                .maMon(d.getMonHoc() != null ? d.getMonHoc().getMaMon() : null)
                .tenMon(d.getMonHoc() != null ? d.getMonHoc().getTenMon() : null)
                .maHocKy(d.getHocKy() != null ? d.getHocKy().getMaHocKy() : null)
                .tenHocKy(d.getHocKy() != null ? d.getHocKy().getTenHocKy() : null)
                .diemChuyenCan(d.getDiemChuyenCan())
                .diemGiuaKy(d.getDiemGiuaKy())
                .diemCuoiKy(d.getDiemCuoiKy())
                .diemTongKet10(d.getDiemTongKet10())
                .diemHe4(d.getDiemHe4())
                .diemChu(d.getDiemChu())
                .soTinChi(d.getSoTinChi())
                .hocPhiMon(d.getHocPhiMon())
                .dat(d.getDat())
                .build();
    }
}
