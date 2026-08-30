package com.nttt.services;

import com.nttt.dto.DiemHocPhanDTO;
import com.nttt.dto.HoSoHocBongDTO;
import com.nttt.dto.QuyHocBongNganhDTO;
import com.nttt.pojo.*;
import com.nttt.repositories.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ScholarshipRuleEngineService {

    private final DotXetHocBongRepository dotXetHocBongRepository;
    private final DotXetHbKhoaRepository dotXetHbKhoaRepository;
    private final QuyTacHocBongRepository quyTacHocBongRepository;
    private final SinhVienRepository sinhVienRepository;
    private final KetQuaHocTapRepository ketQuaHocTapRepository;
    private final KetQuaRenLuyenRepository ketQuaRenLuyenRepository;
    private final HoSoHocBongRepository hoSoHocBongRepository;
    private final DiemHocPhanRepository diemHocPhanRepository;

    public ScholarshipRuleEngineService(
            DotXetHocBongRepository dotXetHocBongRepository,
            DotXetHbKhoaRepository dotXetHbKhoaRepository,
            QuyTacHocBongRepository quyTacHocBongRepository,
            SinhVienRepository sinhVienRepository,
            KetQuaHocTapRepository ketQuaHocTapRepository,
            KetQuaRenLuyenRepository ketQuaRenLuyenRepository,
            HoSoHocBongRepository hoSoHocBongRepository,
            DiemHocPhanRepository diemHocPhanRepository
    ) {
        this.dotXetHocBongRepository = dotXetHocBongRepository;
        this.dotXetHbKhoaRepository = dotXetHbKhoaRepository;
        this.quyTacHocBongRepository = quyTacHocBongRepository;
        this.sinhVienRepository = sinhVienRepository;
        this.ketQuaHocTapRepository = ketQuaHocTapRepository;
        this.ketQuaRenLuyenRepository = ketQuaRenLuyenRepository;
        this.hoSoHocBongRepository = hoSoHocBongRepository;
        this.diemHocPhanRepository = diemHocPhanRepository;
    }

    @Transactional
    public List<HoSoHocBongDTO> executeRuleEngine(String maDotXetHbKhoa) {
        DotXetHbKhoa dotKhoa = dotXetHbKhoaRepository.findById(maDotXetHbKhoa)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đợt xét học bổng cấp khoa: " + maDotXetHbKhoa));

        DotXetHocBong dotTruong = dotKhoa.getDotXetHocBong();
        String maDot = dotTruong.getMaDot();
        String maKhoa = dotKhoa.getKhoa().getMaKhoa();
        HocKy hocKy = dotTruong.getHocKy();
        String maHocKy = hocKy != null ? hocKy.getMaHocKy() : "HK1_2025_2026";

        QuyTacHocBong quyTac = quyTacHocBongRepository.findFirstByDotXetHocBong_MaDotOrderByPhienBanDesc(maDot)
                .orElseGet(() -> QuyTacHocBong.builder()
                        .maQuyTac("QT_DEFAULT_" + maDot)
                        .dotXetHocBong(dotTruong)
                        .diemTbDuoiThieu(BigDecimal.valueOf(2.50))
                        .diemRlToiThieu(BigDecimal.valueOf(65.0))
                        .soTinChiToiThieu(14)
                        .khongNoMon(true)
                        .phienBan(1)
                        .mucHocBongXuatSac(BigDecimal.valueOf(11700000))
                        .mucHocBongGioi(BigDecimal.valueOf(8190000))
                        .mucHocBongKha(BigDecimal.valueOf(5850000))
                        .build()
                );

        // Lấy tất cả sinh viên thuộc Khoa đang xét
        List<SinhVien> sinhViens = sinhVienRepository.findByLopSinhHoat_Khoa_MaKhoa(maKhoa);

        class Candidate {
            final SinhVien sv;
            final KetQuaHocTap gpa;
            final KetQuaRenLuyen drl;
            final List<DiemHocPhan> diemMonHocList;
            BigDecimal tongHocPhiSV = BigDecimal.ZERO;
            boolean eligible = false;
            String loaiHb = "KHONG_DAT";
            int tyLeHb = 0; // 100, 70, 50
            BigDecimal mucTien = BigDecimal.ZERO;
            BigDecimal diemXet = BigDecimal.ZERO;
            String rejectReason = "";
            String maKhoa = "";
            String tenKhoa = "";
            String maNganh = "";
            String tenNganh = "";
            String khoaHoc = "";
            String heDaoTao = "CHUAN";

            Candidate(SinhVien sv, KetQuaHocTap gpa, KetQuaRenLuyen drl, List<DiemHocPhan> diemMonHocList) {
                this.sv = sv;
                this.gpa = gpa;
                this.drl = drl;
                this.diemMonHocList = diemMonHocList;
                if (sv.getLopSinhHoat() != null) {
                    if (sv.getLopSinhHoat().getKhoa() != null) {
                        this.maKhoa = sv.getLopSinhHoat().getKhoa().getMaKhoa();
                        this.tenKhoa = sv.getLopSinhHoat().getKhoa().getTenKhoa();
                    }
                    if (sv.getLopSinhHoat().getNganh() != null) {
                        this.maNganh = sv.getLopSinhHoat().getNganh().getMaNganh();
                        this.tenNganh = sv.getLopSinhHoat().getNganh().getTenNganh();
                        this.heDaoTao = sv.getLopSinhHoat().getNganh().getHeDaoTao() != null ? sv.getLopSinhHoat().getNganh().getHeDaoTao() : "CHUAN";
                    }
                    this.khoaHoc = sv.getLopSinhHoat().getKhoaHoc() != null ? sv.getLopSinhHoat().getKhoaHoc() : "K23 (2023-2027)";
                }
            }
        }

        List<Candidate> candidateList = new ArrayList<>();

        for (SinhVien sv : sinhViens) {
            if (!"DANG_HOC".equalsIgnoreCase(sv.getTrangThaiHoc())) {
                continue;
            }

            Optional<KetQuaHocTap> gpaOpt = (hocKy != null) ?
                    ketQuaHocTapRepository.findBySinhVien_MssvAndHocKy_MaHocKy(sv.getMssv(), hocKy.getMaHocKy()) :
                    ketQuaHocTapRepository.findBySinhVien_Mssv(sv.getMssv()).stream().findFirst();

            Optional<KetQuaRenLuyen> drlOpt = (hocKy != null) ?
                    ketQuaRenLuyenRepository.findBySinhVien_MssvAndHocKy_MaHocKy(sv.getMssv(), hocKy.getMaHocKy()) :
                    ketQuaRenLuyenRepository.findBySinhVien_Mssv(sv.getMssv()).stream().findFirst();

            if (gpaOpt.isEmpty() || drlOpt.isEmpty()) {
                continue;
            }

            KetQuaHocTap gpa = gpaOpt.get();
            KetQuaRenLuyen drl = drlOpt.get();

            List<DiemHocPhan> diemList = (hocKy != null) ?
                    diemHocPhanRepository.findBySinhVien_MssvAndHocKy_MaHocKy(sv.getMssv(), hocKy.getMaHocKy()) :
                    diemHocPhanRepository.findBySinhVien_Mssv(sv.getMssv());

            Candidate cand = new Candidate(sv, gpa, drl, diemList);

            // 1. Tính tổng học phí sinh viên đóng trong học kỳ này
            BigDecimal hocPhiSV = BigDecimal.ZERO;
            boolean coMonRot = false;

            if (!diemList.isEmpty()) {
                for (DiemHocPhan d : diemList) {
                    if (d.getHocPhiMon() != null) {
                        hocPhiSV = hocPhiSV.add(d.getHocPhiMon());
                    }
                    if (Boolean.FALSE.equals(d.getDat()) || (d.getDiemChu() != null && "F".equalsIgnoreCase(d.getDiemChu()))) {
                        coMonRot = true;
                    }
                }
            } else {
                // Fallback nếu chưa có DiemHocPhan chi tiết: tính từ số tín chỉ * đơn giá hệ
                int credits = gpa.getSoTinChi() != null ? gpa.getSoTinChi() : 18;
                BigDecimal donGia = ("DAC_BIET".equalsIgnoreCase(cand.heDaoTao) || "CHAT_LUONG_CAO".equalsIgnoreCase(cand.heDaoTao)) ?
                        new BigDecimal("1450000") : new BigDecimal("650000");
                hocPhiSV = donGia.multiply(BigDecimal.valueOf(credits));
                coMonRot = Boolean.TRUE.equals(gpa.getCoHocPhanRot());
            }

            cand.tongHocPhiSV = hocPhiSV;

            // 2. Kiểm tra điều kiện xét học bổng (Validation Rules)
            boolean passed = true;
            BigDecimal diemTb = gpa.getDiemTrungBinh() != null ? gpa.getDiemTrungBinh() : BigDecimal.ZERO;
            BigDecimal diemRl = drl.getDiemRenLuyen() != null ? drl.getDiemRenLuyen() : BigDecimal.ZERO;
            int credits = gpa.getSoTinChi() != null ? gpa.getSoTinChi() : 0;

            if (Boolean.TRUE.equals(quyTac.getKhongNoMon()) && coMonRot) {
                passed = false;
                cand.rejectReason = "Nợ học phần trong kỳ";
            }
            if (credits < (quyTac.getSoTinChiToiThieu() != null ? quyTac.getSoTinChiToiThieu() : 14)) {
                passed = false;
                cand.rejectReason = "Không đủ số tín chỉ tối thiểu (" + credits + " < " + quyTac.getSoTinChiToiThieu() + ")";
            }
            if (quyTac.getDiemTbDuoiThieu() != null && diemTb.compareTo(quyTac.getDiemTbDuoiThieu()) < 0) {
                passed = false;
                cand.rejectReason = "Điểm TB học tập thấp hơn ngưỡng (" + diemTb + " < " + quyTac.getDiemTbDuoiThieu() + ")";
            }
            if (quyTac.getDiemRlToiThieu() != null && diemRl.compareTo(quyTac.getDiemRlToiThieu()) < 0) {
                passed = false;
                cand.rejectReason = "Điểm rèn luyện thấp hơn ngưỡng (" + diemRl + " < " + quyTac.getDiemRlToiThieu() + ")";
            }

            if (passed) {
                cand.eligible = true;
                cand.diemXet = diemTb;

                // 3. Phân loại Học bổng Khuyến khích Học tập theo tỷ lệ % học phí thực tế của kỳ:
                // - Xuất sắc: 100% Học phí (GPA >= 3.60 và ĐRL >= 90)
                // - Giỏi:      70% Học phí (GPA >= 3.20 và ĐRL >= 80)
                // - Khá:       50% Học phí (GPA >= 2.50 và ĐRL >= 65)
                if (diemTb.compareTo(BigDecimal.valueOf(3.60)) >= 0 && diemRl.compareTo(BigDecimal.valueOf(90.0)) >= 0) {
                    cand.loaiHb = "XUAT_SAC";
                    cand.tyLeHb = 100;
                    cand.mucTien = cand.tongHocPhiSV.multiply(BigDecimal.valueOf(1.00));
                } else if (diemTb.compareTo(BigDecimal.valueOf(3.20)) >= 0 && diemRl.compareTo(BigDecimal.valueOf(80.0)) >= 0) {
                    cand.loaiHb = "GIOI";
                    cand.tyLeHb = 70;
                    cand.mucTien = cand.tongHocPhiSV.multiply(BigDecimal.valueOf(0.70)).setScale(0, RoundingMode.HALF_UP);
                } else if (diemTb.compareTo(BigDecimal.valueOf(2.50)) >= 0 && diemRl.compareTo(BigDecimal.valueOf(65.0)) >= 0) {
                    cand.loaiHb = "KHA";
                    cand.tyLeHb = 50;
                    cand.mucTien = cand.tongHocPhiSV.multiply(BigDecimal.valueOf(0.50)).setScale(0, RoundingMode.HALF_UP);
                } else {
                    cand.eligible = false;
                    cand.loaiHb = "KHONG_DAT";
                    cand.tyLeHb = 0;
                    cand.mucTien = BigDecimal.ZERO;
                }
            }

            candidateList.add(cand);
        }

        // 4. Phân chia học bổng theo từng NGÀNH và từng KHÓA (Cohort & Major)
        // Group key: maNganh + "___" + khoaHoc (VD: "CS___K23 (2023-2027)")
        Map<String, List<Candidate>> candidatesByMajorAndCohort = candidateList.stream()
                .collect(Collectors.groupingBy(c -> (c.maNganh != null ? c.maNganh : "UNKNOWN") + "___" + (c.khoaHoc != null ? c.khoaHoc : "UNKNOWN")));

        List<HoSoHocBong> savedList = new ArrayList<>();

        for (Map.Entry<String, List<Candidate>> entry : candidatesByMajorAndCohort.entrySet()) {
            List<Candidate> cohortCandidates = entry.getValue();

            // Tính Tổng thu học phí của riêng Nhóm (Ngành, Khóa) này
            BigDecimal tongThuHocPhiNhom = cohortCandidates.stream()
                    .map(c -> c.tongHocPhiSV)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            // Quỹ học bổng = 8% Tổng thu học phí của Nhóm (Tối thiểu 15 triệu nếu dữ liệu mẫu ít sinh viên)
            BigDecimal quy8PhanTram = tongThuHocPhiNhom.multiply(new BigDecimal("0.08")).setScale(0, RoundingMode.HALF_UP);
            BigDecimal cohortBudget = quy8PhanTram.compareTo(new BigDecimal("15000000")) > 0 ? quy8PhanTram : new BigDecimal("25000000");

            // Sắp xếp thứ hạng trong nhóm (Ngành, Khóa): Đủ điều kiện xếp trước, sau đó giảm dần theo GPA -> ĐRL -> Số tín chỉ
            cohortCandidates.sort((c1, c2) -> {
                if (c1.eligible != c2.eligible) {
                    return c1.eligible ? -1 : 1;
                }
                if (c1.eligible) {
                    int cmpGpa = c2.gpa.getDiemTrungBinh().compareTo(c1.gpa.getDiemTrungBinh());
                    if (cmpGpa != 0) return cmpGpa;
                    int cmpDrl = c2.drl.getDiemRenLuyen().compareTo(c1.drl.getDiemRenLuyen());
                    if (cmpDrl != 0) return cmpDrl;
                    return Integer.compare(
                            c2.gpa.getSoTinChi() != null ? c2.gpa.getSoTinChi() : 0,
                            c1.gpa.getSoTinChi() != null ? c1.gpa.getSoTinChi() : 0
                    );
                }
                return c1.sv.getMssv().compareTo(c2.sv.getMssv());
            });

            // Phân bổ quỹ từ trên xuống dưới cho từng (Ngành, Khóa)
            BigDecimal remainingBudget = cohortBudget;
            int rank = 1;

            for (Candidate c : cohortCandidates) {
                String maHoSo = "HS_" + dotKhoa.getMaDotXetHbKhoa() + "_" + c.sv.getMssv();

                HoSoHocBong hoSo = hoSoHocBongRepository.findById(maHoSo).orElseGet(() ->
                        HoSoHocBong.builder()
                                .maHoSo(maHoSo)
                                .sinhVien(c.sv)
                                .dotXetHbKhoa(dotKhoa)
                                .build()
                );

                hoSo.setDiemXet(c.diemXet);

                if (c.eligible && remainingBudget.compareTo(c.mucTien) >= 0) {
                    hoSo.setThuHang(rank);
                    hoSo.setLoaiHocBong(c.loaiHb);
                    hoSo.setMucHocBong(c.mucTien);
                    hoSo.setTrangThai("DU_KIEN");
                    remainingBudget = remainingBudget.subtract(c.mucTien); // Trừ vào quỹ học bổng 8% của nhóm
                    rank++;
                } else if (c.eligible) {
                    hoSo.setThuHang(rank);
                    hoSo.setLoaiHocBong(c.loaiHb);
                    hoSo.setMucHocBong(BigDecimal.ZERO);
                    hoSo.setTrangThai("KHONG_DAT"); // Không đạt do hết quỹ 8% của nhóm
                    rank++;
                } else {
                    hoSo.setThuHang(null);
                    hoSo.setLoaiHocBong("KHONG_DAT");
                    hoSo.setMucHocBong(BigDecimal.ZERO);
                    hoSo.setTrangThai("KHONG_DAT");
                }

                savedList.add(hoSoHocBongRepository.save(hoSo));
            }
        }

        return savedList.stream().map(hs -> mapToHoSoDTO(hs, hocKy)).collect(Collectors.toList());
    }

    /**
     * Tính toán chi tiết phân rã Quỹ 8% học phí theo từng Khoa, từng Ngành, từng Khóa học cho Cấp Trường
     */
    @Transactional(readOnly = true)
    public List<QuyHocBongNganhDTO> calculateAllMajorBudgets(String maDot) {
        DotXetHocBong dot = dotXetHocBongRepository.findById(maDot)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đợt xét: " + maDot));
        HocKy hocKy = dot.getHocKy();
        String maHocKy = hocKy != null ? hocKy.getMaHocKy() : "HK1_2025_2026";

        List<SinhVien> sinhViens = sinhVienRepository.findAll();

        // Group sinhViens by (maKhoa, maNganh, khoaHoc)
        Map<String, List<SinhVien>> groupMap = sinhViens.stream()
                .filter(sv -> "DANG_HOC".equalsIgnoreCase(sv.getTrangThaiHoc()) && sv.getLopSinhHoat() != null)
                .collect(Collectors.groupingBy(sv -> {
                    String k = sv.getLopSinhHoat().getKhoa() != null ? sv.getLopSinhHoat().getKhoa().getMaKhoa() : "UNKNOWN";
                    String n = sv.getLopSinhHoat().getNganh() != null ? sv.getLopSinhHoat().getNganh().getMaNganh() : "UNKNOWN";
                    String c = sv.getLopSinhHoat().getKhoaHoc() != null ? sv.getLopSinhHoat().getKhoaHoc() : "UNKNOWN";
                    return k + "___" + n + "___" + c;
                }));

        List<QuyHocBongNganhDTO> result = new ArrayList<>();

        for (Map.Entry<String, List<SinhVien>> entry : groupMap.entrySet()) {
            List<SinhVien> svList = entry.getValue();
            if (svList.isEmpty()) continue;

            SinhVien sample = svList.get(0);
            String maKhoa = sample.getLopSinhHoat().getKhoa() != null ? sample.getLopSinhHoat().getKhoa().getMaKhoa() : "";
            String tenKhoa = sample.getLopSinhHoat().getKhoa() != null ? sample.getLopSinhHoat().getKhoa().getTenKhoa() : "";
            String maNganh = sample.getLopSinhHoat().getNganh() != null ? sample.getLopSinhHoat().getNganh().getMaNganh() : "";
            String tenNganh = sample.getLopSinhHoat().getNganh() != null ? sample.getLopSinhHoat().getNganh().getTenNganh() : "";
            String heDaoTao = sample.getLopSinhHoat().getNganh() != null ? sample.getLopSinhHoat().getNganh().getHeDaoTao() : "CHUAN";
            String khoaHoc = sample.getLopSinhHoat().getKhoaHoc() != null ? sample.getLopSinhHoat().getKhoaHoc() : "";

            BigDecimal totalTuition = BigDecimal.ZERO;

            for (SinhVien sv : svList) {
                List<DiemHocPhan> diems = (hocKy != null) ?
                        diemHocPhanRepository.findBySinhVien_MssvAndHocKy_MaHocKy(sv.getMssv(), maHocKy) :
                        diemHocPhanRepository.findBySinhVien_Mssv(sv.getMssv());

                BigDecimal svTuition = BigDecimal.ZERO;
                if (!diems.isEmpty()) {
                    for (DiemHocPhan d : diems) {
                        if (d.getHocPhiMon() != null) svTuition = svTuition.add(d.getHocPhiMon());
                    }
                } else {
                    BigDecimal donGia = ("DAC_BIET".equalsIgnoreCase(heDaoTao) || "CHAT_LUONG_CAO".equalsIgnoreCase(heDaoTao)) ?
                            new BigDecimal("1450000") : new BigDecimal("650000");
                    svTuition = donGia.multiply(BigDecimal.valueOf(18));
                }
                totalTuition = totalTuition.add(svTuition);
            }

            BigDecimal quy8 = totalTuition.multiply(new BigDecimal("0.08")).setScale(0, RoundingMode.HALF_UP);
            int soSuatDuKien = quy8.divide(new BigDecimal("10000000"), 0, RoundingMode.HALF_UP).intValue();
            if (soSuatDuKien < 1 && quy8.compareTo(BigDecimal.ZERO) > 0) soSuatDuKien = 1;

            result.add(QuyHocBongNganhDTO.builder()
                    .maKhoa(maKhoa)
                    .tenKhoa(tenKhoa)
                    .maNganh(maNganh)
                    .tenNganh(tenNganh)
                    .heDaoTao(heDaoTao)
                    .khoaHoc(khoaHoc)
                    .maHocKy(maHocKy)
                    .soSinhVienTong(svList.size())
                    .tongHocPhiThu(totalTuition)
                    .quyHocBong8PhanTram(quy8)
                    .soSinhVienDuDieuKien(svList.size())
                    .soSinhVienDatHocBong(soSuatDuKien)
                    .build());
        }

        result.sort(Comparator.comparing(QuyHocBongNganhDTO::getMaKhoa)
                .thenComparing(QuyHocBongNganhDTO::getMaNganh)
                .thenComparing(QuyHocBongNganhDTO::getKhoaHoc));

        return result;
    }

    public HoSoHocBongDTO mapToHoSoDTO(HoSoHocBong hs, HocKy hocKy) {
        SinhVien sv = hs.getSinhVien();
        DotXetHbKhoa dk = hs.getDotXetHbKhoa();

        HoSoHocBongDTO.Builder b = HoSoHocBongDTO.builder()
                .maHoSo(hs.getMaHoSo())
                .mssv(sv.getMssv())
                .hoTen(sv.getNguoiDung() != null ? sv.getNguoiDung().getHoTen() : "")
                .diemXet(hs.getDiemXet())
                .thuHang(hs.getThuHang())
                .loaiHocBong(hs.getLoaiHocBong())
                .mucHocBong(hs.getMucHocBong())
                .trangThai(hs.getTrangThai())
                .maDotXetHbKhoa(dk.getMaDotXetHbKhoa())
                .maDot(dk.getDotXetHocBong().getMaDot())
                .tenDot(dk.getDotXetHocBong().getTenDot())
                .maKhoa(dk.getKhoa().getMaKhoa())
                .tenKhoa(dk.getKhoa().getTenKhoa());

        if (sv.getLopSinhHoat() != null) {
            b.maLop(sv.getLopSinhHoat().getMaLop());
            b.khoaHoc(sv.getLopSinhHoat().getKhoaHoc());
            if (sv.getLopSinhHoat().getNganh() != null) {
                Nganh ng = sv.getLopSinhHoat().getNganh();
                b.maNganh(ng.getMaNganh());
                b.tenNganh(ng.getTenNganh());
                b.heDaoTao(ng.getHeDaoTao());
                if ("DAC_BIET".equalsIgnoreCase(ng.getHeDaoTao()) || "CHAT_LUONG_CAO".equalsIgnoreCase(ng.getHeDaoTao())) {
                    b.tenHeDaoTao("Chương trình Đặc biệt (CLC)");
                } else {
                    b.tenHeDaoTao("Chương trình Chuẩn (Đại trà)");
                }
            }
        }

        String targetHocKy = hocKy != null ? hocKy.getMaHocKy() :
                (dk.getDotXetHocBong().getHocKy() != null ? dk.getDotXetHocBong().getHocKy().getMaHocKy() : null);

        if (targetHocKy != null) {
            b.maHocKy(targetHocKy);
            ketQuaHocTapRepository.findBySinhVien_MssvAndHocKy_MaHocKy(sv.getMssv(), targetHocKy).ifPresent(g -> {
                b.diemTrungBinh(g.getDiemTrungBinh());
                b.soTinChi(g.getSoTinChi());
                b.coHocPhanRot(g.getCoHocPhanRot());
            });
            ketQuaRenLuyenRepository.findBySinhVien_MssvAndHocKy_MaHocKy(sv.getMssv(), targetHocKy).ifPresent(d -> {
                b.diemRenLuyen(d.getDiemRenLuyen());
            });

            // Lấy danh sách điểm môn học chi tiết và tính tổng học phí
            List<DiemHocPhan> diemList = diemHocPhanRepository.findBySinhVien_MssvAndHocKy_MaHocKy(sv.getMssv(), targetHocKy);
            if (!diemList.isEmpty()) {
                List<DiemHocPhanDTO> dtoList = diemList.stream().map(d -> DiemHocPhanDTO.builder()
                        .id(d.getId())
                        .mssv(sv.getMssv())
                        .hoTen(sv.getNguoiDung() != null ? sv.getNguoiDung().getHoTen() : "")
                        .maMon(d.getMonHoc() != null ? d.getMonHoc().getMaMon() : "")
                        .tenMon(d.getMonHoc() != null ? d.getMonHoc().getTenMon() : "")
                        .maHocKy(targetHocKy)
                        .diemChuyenCan(d.getDiemChuyenCan())
                        .diemGiuaKy(d.getDiemGiuaKy())
                        .diemCuoiKy(d.getDiemCuoiKy())
                        .diemTongKet10(d.getDiemTongKet10())
                        .diemHe4(d.getDiemHe4())
                        .diemChu(d.getDiemChu())
                        .soTinChi(d.getSoTinChi())
                        .hocPhiMon(d.getHocPhiMon())
                        .dat(d.getDat())
                        .build()
                ).collect(Collectors.toList());

                b.danhSachDiemMonHoc(dtoList);
                BigDecimal tongHocPhi = diemList.stream()
                        .map(d -> d.getHocPhiMon() != null ? d.getHocPhiMon() : BigDecimal.ZERO)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);
                b.tongHocPhiKy(tongHocPhi);
            } else {
                // Fallback tính học phí
                BigDecimal donGia = (b.build().getHeDaoTao() != null && ("DAC_BIET".equalsIgnoreCase(b.build().getHeDaoTao()) || "CHAT_LUONG_CAO".equalsIgnoreCase(b.build().getHeDaoTao())))
                        ? new BigDecimal("1450000") : new BigDecimal("650000");
                int tc = b.build().getSoTinChi() != null ? b.build().getSoTinChi() : 18;
                b.tongHocPhiKy(donGia.multiply(BigDecimal.valueOf(tc)));
            }
        }

        // Tỷ lệ học bổng và tiền thực nhận
        if ("XUAT_SAC".equalsIgnoreCase(hs.getLoaiHocBong())) {
            b.tyLeHocBong(100);
        } else if ("GIOI".equalsIgnoreCase(hs.getLoaiHocBong())) {
            b.tyLeHocBong(70);
        } else if ("KHA".equalsIgnoreCase(hs.getLoaiHocBong())) {
            b.tyLeHocBong(50);
        } else {
            b.tyLeHocBong(0);
        }

        b.soTienNhanDuoc(hs.getMucHocBong() != null ? hs.getMucHocBong() : BigDecimal.ZERO);
        if (hs.getMucHocBong() != null && hs.getMucHocBong().compareTo(BigDecimal.ZERO) > 0) {
            b.trangThaiCapQuy("TRONG_QUY");
        } else if (hs.getLoaiHocBong() != null && !hs.getLoaiHocBong().equals("KHONG_DAT")) {
            b.trangThaiCapQuy("HET_QUY");
        } else {
            b.trangThaiCapQuy("KHONG_DAT");
        }

        return b.build();
    }
}
