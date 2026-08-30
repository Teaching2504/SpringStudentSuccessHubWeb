package com.nttt.services.impl;

import com.nttt.dto.*;
import com.nttt.pojo.*;
import com.nttt.repositories.*;
import com.nttt.services.DotXetHocBongService;
import com.nttt.services.ScholarshipRuleEngineService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
public class DotXetHocBongServiceImpl implements DotXetHocBongService {

    private final DotXetHocBongRepository dotXetHocBongRepository;
    private final QuyTacHocBongRepository quyTacHocBongRepository;
    private final DotXetHbKhoaRepository dotXetHbKhoaRepository;
    private final HoSoHocBongRepository hoSoHocBongRepository;
    private final HocKyRepository hocKyRepository;
    private final KhoaRepository khoaRepository;
    private final KienNghiRepository kienNghiRepository;
    private final ScholarshipRuleEngineService ruleEngineService;

    public DotXetHocBongServiceImpl(
            DotXetHocBongRepository dotXetHocBongRepository,
            QuyTacHocBongRepository quyTacHocBongRepository,
            DotXetHbKhoaRepository dotXetHbKhoaRepository,
            HoSoHocBongRepository hoSoHocBongRepository,
            HocKyRepository hocKyRepository,
            KhoaRepository khoaRepository,
            KienNghiRepository kienNghiRepository,
            ScholarshipRuleEngineService ruleEngineService
    ) {
        this.dotXetHocBongRepository = dotXetHocBongRepository;
        this.quyTacHocBongRepository = quyTacHocBongRepository;
        this.dotXetHbKhoaRepository = dotXetHbKhoaRepository;
        this.hoSoHocBongRepository = hoSoHocBongRepository;
        this.hocKyRepository = hocKyRepository;
        this.khoaRepository = khoaRepository;
        this.kienNghiRepository = kienNghiRepository;
        this.ruleEngineService = ruleEngineService;
    }

    @Override
    public List<DotXetHocBongDTO> getAllDotXet() {
        List<DotXetHocBong> list = dotXetHocBongRepository.findAll();
        list.sort(Comparator.comparingInt(this::getCampaignOrderKey));
        return list.stream()
                .map(this::mapToDotXetDTO)
                .collect(Collectors.toList());
    }

    @Override
    public DotXetHocBongDTO getDotXetById(String maDot) {
        DotXetHocBong dot = dotXetHocBongRepository.findById(maDot)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đợt xét học bổng: " + maDot));
        return mapToDotXetDTO(dot);
    }

    @Override
    @Transactional
    public DotXetHocBongDTO createDotXet(DotXetHocBongDTO dto) {
        if (dotXetHocBongRepository.existsById(dto.getMaDot())) {
            throw new RuntimeException("Mã đợt xét học bổng đã tồn tại!");
        }

        HocKy hocKy = null;
        if (dto.getMaHocKy() != null) {
            hocKy = hocKyRepository.findById(dto.getMaHocKy())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy học kỳ: " + dto.getMaHocKy()));
        }

        DotXetHocBong dot = DotXetHocBong.builder()
                .maDot(dto.getMaDot())
                .tenDot(dto.getTenDot())
                .ngayBatDau(dto.getNgayBatDau())
                .ngayKetThuc(dto.getNgayKetThuc())
                .hocKy(hocKy)
                .trangThai("DANG_MO")
                .build();
        dot = dotXetHocBongRepository.save(dot);

        // Auto-create default rule for this campaign
        QuyTacHocBong defaultRule = QuyTacHocBong.builder()
                .maQuyTac("QT_" + dot.getMaDot() + "_V1")
                .dotXetHocBong(dot)
                .diemTbDuoiThieu(BigDecimal.valueOf(2.50))
                .diemRlToiThieu(BigDecimal.valueOf(65.0))
                .soTinChiToiThieu(14)
                .khongNoMon(true)
                .phienBan(1)
                .ghiChu("Quy chế mặc định khởi tạo")
                .mucHocBongXuatSac(BigDecimal.valueOf(10000000))
                .mucHocBongGioi(BigDecimal.valueOf(7000000))
                .mucHocBongKha(BigDecimal.valueOf(5000000))
                .build();
        quyTacHocBongRepository.save(defaultRule);

        // Auto-create faculty sub-campaigns for all faculties
        List<Khoa> khoas = khoaRepository.findAll();
        for (Khoa k : khoas) {
            DotXetHbKhoa dk = DotXetHbKhoa.builder()
                    .maDotXetHbKhoa(dot.getMaDot() + "_" + k.getMaKhoa())
                    .dotXetHocBong(dot)
                    .khoa(k)
                    .chiTieu(5)
                    .nganSachKhoa(BigDecimal.ZERO)
                    .hanPhanHoi(dto.getNgayKetThuc())
                    .trangThai("CHUA_XET")
                    .build();
            dotXetHbKhoaRepository.save(dk);
        }

        // Immediately auto-calculate and sync exact 8% tuition budget for all faculties
        try {
            autoSyncFacultyBudgets(dot.getMaDot());
        } catch (Exception ignored) {}

        return mapToDotXetDTO(dot);
    }

    @Override
    @Transactional
    public DotXetHocBongDTO updateDotXet(String maDot, DotXetHocBongDTO dto) {
        DotXetHocBong dot = dotXetHocBongRepository.findById(maDot)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đợt xét: " + maDot));

        dot.setTenDot(dto.getTenDot());
        dot.setNgayBatDau(dto.getNgayBatDau());
        dot.setNgayKetThuc(dto.getNgayKetThuc());
        if (dto.getTrangThai() != null) {
            dot.setTrangThai(dto.getTrangThai());
        }
        if (dto.getMaHocKy() != null) {
            HocKy hocKy = hocKyRepository.findById(dto.getMaHocKy())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy học kỳ"));
            dot.setHocKy(hocKy);
        }

        return mapToDotXetDTO(dotXetHocBongRepository.save(dot));
    }

    @Override
    public void deleteDotXet(String maDot) {
        dotXetHocBongRepository.deleteById(maDot);
    }

    @Override
    @Transactional
    public QuyTacHocBongDTO saveQuyTac(QuyTacHocBongDTO dto) {
        DotXetHocBong dot = dotXetHocBongRepository.findById(dto.getMaDot())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đợt xét: " + dto.getMaDot()));

        if ("DA_CONG_BO".equalsIgnoreCase(dot.getTrangThai())) {
            throw new RuntimeException("Đợt xét đã công bố chính thức, không thể sửa quy tắc!");
        }

        List<QuyTacHocBong> history = quyTacHocBongRepository.findByDotXetHocBong_MaDotOrderByPhienBanDesc(dto.getMaDot());
        int nextVersion = history.isEmpty() ? 1 : history.get(0).getPhienBan() + 1;

        QuyTacHocBong rule = QuyTacHocBong.builder()
                .maQuyTac("QT_" + dto.getMaDot() + "_V" + nextVersion)
                .dotXetHocBong(dot)
                .diemTbDuoiThieu(dto.getDiemTbDuoiThieu())
                .diemRlToiThieu(dto.getDiemRlToiThieu())
                .soTinChiToiThieu(dto.getSoTinChiToiThieu())
                .khongNoMon(dto.getKhongNoMon() != null ? dto.getKhongNoMon() : true)
                .phienBan(nextVersion)
                .ghiChu(dto.getGhiChu() != null ? dto.getGhiChu() : "Phiên bản " + nextVersion)
                .mucHocBongXuatSac(dto.getMucHocBongXuatSac() != null ? dto.getMucHocBongXuatSac() : BigDecimal.valueOf(10000000))
                .mucHocBongGioi(dto.getMucHocBongGioi() != null ? dto.getMucHocBongGioi() : BigDecimal.valueOf(7000000))
                .mucHocBongKha(dto.getMucHocBongKha() != null ? dto.getMucHocBongKha() : BigDecimal.valueOf(5000000))
                .build();

        return mapToQuyTacDTO(quyTacHocBongRepository.save(rule));
    }

    @Override
    public List<QuyTacHocBongDTO> getQuyTacHistory(String maDot) {
        return quyTacHocBongRepository.findByDotXetHocBong_MaDotOrderByPhienBanDesc(maDot)
                .stream().map(this::mapToQuyTacDTO).collect(Collectors.toList());
    }

    @Override
    public QuyTacHocBongDTO getLatestQuyTac(String maDot) {
        return quyTacHocBongRepository.findFirstByDotXetHocBong_MaDotOrderByPhienBanDesc(maDot)
                .map(this::mapToQuyTacDTO).orElse(null);
    }

    @Override
    public List<DotXetHbKhoaDTO> getDotKhoaByMaDot(String maDot) {
        List<DotXetHbKhoa> list = dotXetHbKhoaRepository.findByDotXetHocBong_MaDot(maDot);
        boolean needSync = list.stream().anyMatch(dk -> dk.getNganSachKhoa() == null 
                || dk.getNganSachKhoa().compareTo(BigDecimal.ZERO) == 0 
                || dk.getNganSachKhoa().compareTo(new BigDecimal("50000000")) == 0);
        if (needSync) {
            try {
                autoSyncFacultyBudgets(maDot);
                list = dotXetHbKhoaRepository.findByDotXetHocBong_MaDot(maDot);
            } catch (Exception ignored) {}
        }
        return list.stream()
                .map(this::mapToDotKhoaDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<DotXetHbKhoaDTO> getDotKhoaByMaKhoa(String maKhoa) {
        String targetKhoa = ("CNTT".equalsIgnoreCase(maKhoa)) ? "IT" : (maKhoa != null ? maKhoa : "IT");
        List<DotXetHbKhoa> list = dotXetHbKhoaRepository.findByKhoa_MaKhoa(targetKhoa);
        if (list.isEmpty() && maKhoa != null && !maKhoa.equalsIgnoreCase(targetKhoa)) {
            list = dotXetHbKhoaRepository.findByKhoa_MaKhoa(maKhoa);
        }
        if (list.isEmpty()) {
            list = dotXetHbKhoaRepository.findAll();
        }
        boolean needSync = list.stream().anyMatch(dk -> dk.getNganSachKhoa() == null 
                || dk.getNganSachKhoa().compareTo(BigDecimal.ZERO) == 0 
                || dk.getNganSachKhoa().compareTo(new BigDecimal("50000000")) == 0);
        if (needSync) {
            for (DotXetHbKhoa dk : list) {
                try {
                    autoSyncFacultyBudgets(dk.getDotXetHocBong().getMaDot());
                } catch (Exception ignored) {}
            }
            list = dotXetHbKhoaRepository.findByKhoa_MaKhoa(targetKhoa);
        }
        list.sort(Comparator.comparingInt(this::getSubCampaignOrderKey));
        return list.stream()
                .map(this::mapToDotKhoaDTO)
                .collect(Collectors.toList());
    }

    @Override
    public DotXetHbKhoaDTO getDotKhoaById(String maDotXetHbKhoa) {
        DotXetHbKhoa dk = dotXetHbKhoaRepository.findById(maDotXetHbKhoa)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đợt xét học bổng cấp khoa"));
        if (dk.getNganSachKhoa() == null 
                || dk.getNganSachKhoa().compareTo(BigDecimal.ZERO) == 0 
                || dk.getNganSachKhoa().compareTo(new BigDecimal("50000000")) == 0) {
            try {
                autoSyncFacultyBudgets(dk.getDotXetHocBong().getMaDot());
                dk = dotXetHbKhoaRepository.findById(maDotXetHbKhoa).orElse(dk);
            } catch (Exception ignored) {}
        }
        return mapToDotKhoaDTO(dk);
    }

    @Override
    @Transactional
    public DotXetHbKhoaDTO updateChiTieuKhoa(String maDotXetHbKhoa, Integer chiTieu, BigDecimal nganSach) {
        DotXetHbKhoa dk = dotXetHbKhoaRepository.findById(maDotXetHbKhoa)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đợt xét"));
        if (chiTieu != null) dk.setChiTieu(chiTieu);
        if (nganSach != null) dk.setNganSachKhoa(nganSach);
        return mapToDotKhoaDTO(dotXetHbKhoaRepository.save(dk));
    }

    @Override
    @Transactional
    public List<HoSoHocBongDTO> runAutoRanking(String maDotXetHbKhoa) {
        return ruleEngineService.executeRuleEngine(maDotXetHbKhoa);
    }

    @Override
    @Transactional
    public DotXetHbKhoaDTO publishDuKien(String maDotXetHbKhoa) {
        DotXetHbKhoa dk = dotXetHbKhoaRepository.findById(maDotXetHbKhoa)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đợt xét"));

        dk.setTrangThai("DA_CONG_BO_DU_KIEN");
        return mapToDotKhoaDTO(dotXetHbKhoaRepository.save(dk));
    }

    @Override
    @Transactional
    public DotXetHbKhoaDTO chotDanhSachKhoa(String maDotXetHbKhoa) {
        DotXetHbKhoa dk = dotXetHbKhoaRepository.findById(maDotXetHbKhoa)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đợt xét"));

        List<KienNghi> pendingAppeals = kienNghiRepository.findByDotXetHbKhoa_MaDotXetHbKhoa(maDotXetHbKhoa)
                .stream().filter(k -> "CHO_XU_LY".equalsIgnoreCase(k.getTrangThai())).toList();

        if (!pendingAppeals.isEmpty()) {
            throw new RuntimeException("Còn " + pendingAppeals.size() + " kiến nghị chưa xử lý! Vui lòng hoàn tất xử lý trước khi chốt.");
        }

        dk.setTrangThai("DA_CHOT_GUI_TRUONG");
        return mapToDotKhoaDTO(dotXetHbKhoaRepository.save(dk));
    }

    @Override
    @Transactional
    public DotXetHbKhoaDTO pheDuyetDanhSachKhoa(String maDotXetHbKhoa, boolean approve, String lyDoTraVe) {
        DotXetHbKhoa dk = dotXetHbKhoaRepository.findById(maDotXetHbKhoa)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đợt xét"));

        if (approve) {
            dk.setTrangThai("DA_PHE_DUYET");
            dk.setLyDoTraVe(null);

            List<HoSoHocBong> list = hoSoHocBongRepository.findByDotXetHbKhoa_MaDotXetHbKhoaOrderByThuHangAsc(maDotXetHbKhoa);
            for (HoSoHocBong hs : list) {
                if ("DU_KIEN".equalsIgnoreCase(hs.getTrangThai())) {
                    hs.setTrangThai("CHINH_THUC");
                    hoSoHocBongRepository.save(hs);
                }
            }
        } else {
            dk.setTrangThai("BI_TRA_VE");
            dk.setLyDoTraVe(lyDoTraVe != null ? lyDoTraVe : "Yêu cầu rà soát và điều chỉnh lại danh sách");
        }

        return mapToDotKhoaDTO(dotXetHbKhoaRepository.save(dk));
    }

    @Override
    @Transactional
    public DotXetHocBongDTO publishChinhThucToanTruong(String maDot) {
        DotXetHocBong dot = dotXetHocBongRepository.findById(maDot)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đợt xét"));

        dot.setTrangThai("DA_CONG_BO");
        return mapToDotXetDTO(dotXetHocBongRepository.save(dot));
    }

    @Override
    public List<HoSoHocBongDTO> getHoSoByDotKhoa(String maDotXetHbKhoa) {
        DotXetHbKhoa dk = dotXetHbKhoaRepository.findById(maDotXetHbKhoa)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đợt xét"));
        return hoSoHocBongRepository.findByDotXetHbKhoa_MaDotXetHbKhoaOrderByThuHangAsc(maDotXetHbKhoa).stream()
                .map(hs -> ruleEngineService.mapToHoSoDTO(hs, dk.getDotXetHocBong().getHocKy()))
                .collect(Collectors.toList());
    }

    @Override
    public List<HoSoHocBongDTO> getHoSoByMssv(String mssv) {
        List<HoSoHocBong> list = hoSoHocBongRepository.findBySinhVien_Mssv(mssv);
        list.sort(Comparator.comparingInt(hs -> {
            if (hs.getDotXetHbKhoa() != null && hs.getDotXetHbKhoa().getDotXetHocBong() != null) {
                return getCampaignOrderKey(hs.getDotXetHbKhoa().getDotXetHocBong());
            }
            return 0;
        }));
        return list.stream()
                .map(hs -> ruleEngineService.mapToHoSoDTO(hs, null))
                .collect(Collectors.toList());
    }

    @Override
    public List<QuyHocBongNganhDTO> getBudgetBreakdown(String maDot) {
        List<QuyHocBongNganhDTO> list = ruleEngineService.calculateAllMajorBudgets(maDot);

        // Bổ sung ngân sách khoa hiện tại vào từng DTO
        List<DotXetHbKhoa> dotKhoas = dotXetHbKhoaRepository.findByDotXetHocBong_MaDot(maDot);
        Map<String, BigDecimal> currentBudgetMap = dotKhoas.stream()
                .collect(Collectors.toMap(dk -> dk.getKhoa().getMaKhoa(), DotXetHbKhoa::getNganSachKhoa, (b1, b2) -> b1));

        for (QuyHocBongNganhDTO dto : list) {
            if (dto.getMaKhoa() != null) {
                dto.setNganSachKhoaHienTai(currentBudgetMap.getOrDefault(dto.getMaKhoa(), BigDecimal.ZERO));
            }
        }

        return list;
    }

    @Override
    @Transactional
    public List<DotXetHbKhoaDTO> autoSyncFacultyBudgets(String maDot) {
        List<QuyHocBongNganhDTO> breakdown = ruleEngineService.calculateAllMajorBudgets(maDot);

        // Group sum of 8% budget by maKhoa
        Map<String, BigDecimal> budgetByKhoa = breakdown.stream()
                .collect(Collectors.groupingBy(
                        QuyHocBongNganhDTO::getMaKhoa,
                        Collectors.reducing(BigDecimal.ZERO, QuyHocBongNganhDTO::getQuyHocBong8PhanTram, BigDecimal::add)
                ));

        Map<String, Integer> quotaByKhoa = breakdown.stream()
                .collect(Collectors.groupingBy(
                        QuyHocBongNganhDTO::getMaKhoa,
                        Collectors.summingInt(q -> q.getSoSinhVienDatHocBong() != null ? q.getSoSinhVienDatHocBong() : 0)
                ));

        Map<String, Long> groupCountByKhoa = breakdown.stream()
                .collect(Collectors.groupingBy(QuyHocBongNganhDTO::getMaKhoa, Collectors.counting()));

        List<DotXetHbKhoa> dotKhoas = dotXetHbKhoaRepository.findByDotXetHocBong_MaDot(maDot);
        for (DotXetHbKhoa dk : dotKhoas) {
            String maKhoa = dk.getKhoa().getMaKhoa();
            BigDecimal budget8Percent = budgetByKhoa.getOrDefault(maKhoa, BigDecimal.ZERO);
            int groupCount = groupCountByKhoa.getOrDefault(maKhoa, 5L).intValue();
            if ("IT".equalsIgnoreCase(maKhoa) && groupCount < 9) groupCount = 9;

            Integer quota = quotaByKhoa.getOrDefault(maKhoa, groupCount);
            if (quota < groupCount) quota = groupCount;

            BigDecimal expectedMinBudget = BigDecimal.valueOf(quota).multiply(new BigDecimal("11700000"));
            if (budget8Percent.compareTo(expectedMinBudget) < 0) {
                budget8Percent = expectedMinBudget;
            }

            dk.setNganSachKhoa(budget8Percent);
            dk.setChiTieu(quota);
            dotXetHbKhoaRepository.save(dk);
        }

        return dotKhoas.stream().map(this::mapToDotKhoaDTO).collect(Collectors.toList());
    }

    private int getCampaignOrderKey(DotXetHocBong d) {
        if (d == null) return 0;
        return getHocKyOrderKey(d.getHocKy(), d.getMaDot(), d.getTenDot());
    }

    private int getSubCampaignOrderKey(DotXetHbKhoa dk) {
        if (dk == null) return 0;
        if (dk.getDotXetHocBong() != null) {
            return getCampaignOrderKey(dk.getDotXetHocBong());
        }
        return 0;
    }

    private int getHocKyOrderKey(HocKy hk, String fallbackCode, String fallbackName) {
        int hkNum = 1;
        String full = ((hk != null ? (hk.getMaHocKy() != null ? hk.getMaHocKy() : "") + " " + (hk.getTenHocKy() != null ? hk.getTenHocKy() : "") : "")
                + " " + (fallbackCode != null ? fallbackCode : "") + " " + (fallbackName != null ? fallbackName : "")).toUpperCase();
        if (full.contains("HK2") || full.contains("HỌC KỲ 2") || full.contains("HOC KY 2")) hkNum = 2;
        else if (full.contains("HK3") || full.contains("HỌC KỲ 3") || full.contains("HOC KY 3")) hkNum = 3;

        int startYear = 2023;
        if (hk != null && hk.getNamHoc() != null && hk.getNamHoc().length() >= 4) {
            try {
                startYear = Integer.parseInt(hk.getNamHoc().substring(0, 4));
            } catch (Exception ignored) {}
        } else {
            Pattern p = Pattern.compile("(20\\d{2})");
            Matcher m = p.matcher(full);
            if (m.find()) {
                try {
                    startYear = Integer.parseInt(m.group(1));
                } catch (Exception ignored) {}
            }
        }
        return startYear * 10 + hkNum;
    }

    private DotXetHocBongDTO mapToDotXetDTO(DotXetHocBong d) {
        DotXetHocBongDTO.Builder b = DotXetHocBongDTO.builder()
                .maDot(d.getMaDot())
                .tenDot(d.getTenDot())
                .ngayBatDau(d.getNgayBatDau())
                .ngayKetThuc(d.getNgayKetThuc())
                .trangThai(d.getTrangThai());

        if (d.getHocKy() != null) {
            b.maHocKy(d.getHocKy().getMaHocKy());
            b.namHoc(d.getHocKy().getNamHoc());
            b.tenHocKy(d.getHocKy().getTenHocKy());
        }

        QuyTacHocBongDTO ruleDto = getLatestQuyTac(d.getMaDot());
        b.quyTacHienHanh(ruleDto);

        List<DotXetHbKhoa> subList = dotXetHbKhoaRepository.findByDotXetHocBong_MaDot(d.getMaDot());
        int totalQuota = 0;
        BigDecimal totalBudget = BigDecimal.ZERO;
        for (DotXetHbKhoa sub : subList) {
            if (sub.getChiTieu() != null) totalQuota += sub.getChiTieu();
            if (sub.getNganSachKhoa() != null) totalBudget = totalBudget.add(sub.getNganSachKhoa());
        }
        b.tongChiTieu(totalQuota);
        b.tongNganSach(totalBudget);

        List<HoSoHocBong> dossiers = hoSoHocBongRepository.findByDotXetHbKhoa_DotXetHocBong_MaDot(d.getMaDot());
        b.tongHoSoDaXet(dossiers.size());

        return b.build();
    }

    private QuyTacHocBongDTO mapToQuyTacDTO(QuyTacHocBong r) {
        return QuyTacHocBongDTO.builder()
                .maQuyTac(r.getMaQuyTac())
                .maDot(r.getDotXetHocBong().getMaDot())
                .tenDot(r.getDotXetHocBong().getTenDot())
                .diemTbDuoiThieu(r.getDiemTbDuoiThieu())
                .diemRlToiThieu(r.getDiemRlToiThieu())
                .soTinChiToiThieu(r.getSoTinChiToiThieu())
                .khongNoMon(r.getKhongNoMon())
                .phienBan(r.getPhienBan())
                .ghiChu(r.getGhiChu())
                .mucHocBongXuatSac(r.getMucHocBongXuatSac())
                .mucHocBongGioi(r.getMucHocBongGioi())
                .mucHocBongKha(r.getMucHocBongKha())
                .build();
    }

    private DotXetHbKhoaDTO mapToDotKhoaDTO(DotXetHbKhoa dk) {
        List<HoSoHocBong> dossiers = hoSoHocBongRepository.findByDotXetHbKhoa_MaDotXetHbKhoaOrderByThuHangAsc(dk.getMaDotXetHbKhoa());
        int duKienCount = (int) dossiers.stream().filter(h -> "DU_KIEN".equalsIgnoreCase(h.getTrangThai())).count();
        int chinhThucCount = (int) dossiers.stream().filter(h -> "CHINH_THUC".equalsIgnoreCase(h.getTrangThai())).count();
        int unhandledAppeals = (int) kienNghiRepository.findByDotXetHbKhoa_MaDotXetHbKhoa(dk.getMaDotXetHbKhoa())
                .stream().filter(k -> "CHO_XU_LY".equalsIgnoreCase(k.getTrangThai())).count();

        return DotXetHbKhoaDTO.builder()
                .maDotXetHbKhoa(dk.getMaDotXetHbKhoa())
                .maDot(dk.getDotXetHocBong().getMaDot())
                .tenDot(dk.getDotXetHocBong().getTenDot())
                .maKhoa(dk.getKhoa().getMaKhoa())
                .tenKhoa(dk.getKhoa().getTenKhoa())
                .chiTieu(dk.getChiTieu())
                .nganSachKhoa(dk.getNganSachKhoa())
                .hanPhanHoi(dk.getHanPhanHoi())
                .trangThai(dk.getTrangThai())
                .lyDoTraVe(dk.getLyDoTraVe())
                .soLuongDuKien(duKienCount)
                .soLuongChinhThuc(chinhThucCount)
                .soKienNghiChuaXuLy(unhandledAppeals)
                .build();
    }
}
