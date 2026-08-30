package com.nttt.services.impl;

import com.nttt.dto.DashboardStatsDTO;
import com.nttt.pojo.HoSoHocBong;
import com.nttt.pojo.Khoa;
import com.nttt.pojo.SinhVien;
import com.nttt.repositories.*;
import com.nttt.services.ThongKeService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ThongKeServiceImpl implements ThongKeService {

    private final SinhVienRepository sinhVienRepository;
    private final KhoaRepository khoaRepository;
    private final NganhRepository nganhRepository;
    private final LopSinhHoatRepository lopSinhHoatRepository;
    private final DotXetHocBongRepository dotXetHocBongRepository;
    private final HoSoHocBongRepository hoSoHocBongRepository;
    private final MinhChungRenLuyenRepository minhChungRepository;
    private final KienNghiRepository kienNghiRepository;
    private final KetQuaHocTapRepository ketQuaHocTapRepository;

    public ThongKeServiceImpl(
            SinhVienRepository sinhVienRepository,
            KhoaRepository khoaRepository,
            NganhRepository nganhRepository,
            LopSinhHoatRepository lopSinhHoatRepository,
            DotXetHocBongRepository dotXetHocBongRepository,
            HoSoHocBongRepository hoSoHocBongRepository,
            MinhChungRenLuyenRepository minhChungRepository,
            KienNghiRepository kienNghiRepository,
            KetQuaHocTapRepository ketQuaHocTapRepository
    ) {
        this.sinhVienRepository = sinhVienRepository;
        this.khoaRepository = khoaRepository;
        this.nganhRepository = nganhRepository;
        this.lopSinhHoatRepository = lopSinhHoatRepository;
        this.dotXetHocBongRepository = dotXetHocBongRepository;
        this.hoSoHocBongRepository = hoSoHocBongRepository;
        this.minhChungRepository = minhChungRepository;
        this.kienNghiRepository = kienNghiRepository;
        this.ketQuaHocTapRepository = ketQuaHocTapRepository;
    }

    @Override
    public DashboardStatsDTO getGlobalDashboardStats() {
        long tongSv = sinhVienRepository.count();
        long tongKhoa = khoaRepository.count();
        long tongNganh = nganhRepository.count();
        long tongLop = lopSinhHoatRepository.count();
        long tongDot = dotXetHocBongRepository.count();

        List<HoSoHocBong> allDossiers = hoSoHocBongRepository.findAll();
        long tongDat = allDossiers.stream()
                .filter(h -> "CHINH_THUC".equalsIgnoreCase(h.getTrangThai()) || "DU_KIEN".equalsIgnoreCase(h.getTrangThai()))
                .count();

        BigDecimal tongTien = allDossiers.stream()
                .filter(h -> "CHINH_THUC".equalsIgnoreCase(h.getTrangThai()) || "DU_KIEN".equalsIgnoreCase(h.getTrangThai()))
                .map(h -> h.getMucHocBong() != null ? h.getMucHocBong() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long mcChoDuyet = minhChungRepository.findByTrangThai("CHO_DUYET").size();
        long knChoXuLy = kienNghiRepository.findAll().stream()
                .filter(k -> "CHO_XU_LY".equalsIgnoreCase(k.getTrangThai())).count();

        long canhBao = ketQuaHocTapRepository.findAll().stream()
                .filter(k -> (k.getDiemTrungBinh() != null && k.getDiemTrungBinh().compareTo(BigDecimal.valueOf(2.0)) < 0) ||
                        Boolean.TRUE.equals(k.getCoHocPhanRot())).count();

        Map<String, Long> hbKhoa = new HashMap<>();
        Map<String, BigDecimal> kinhPhiKhoa = new HashMap<>();
        Map<String, Long> loaiHbMap = new HashMap<>();
        loaiHbMap.put("XUAT_SAC", 0L);
        loaiHbMap.put("GIOI", 0L);
        loaiHbMap.put("KHA", 0L);

        List<Khoa> khoas = khoaRepository.findAll();
        for (Khoa k : khoas) {
            hbKhoa.put(k.getTenKhoa(), 0L);
            kinhPhiKhoa.put(k.getTenKhoa(), BigDecimal.ZERO);
        }

        for (HoSoHocBong hs : allDossiers) {
            if ("CHINH_THUC".equalsIgnoreCase(hs.getTrangThai()) || "DU_KIEN".equalsIgnoreCase(hs.getTrangThai())) {
                String tenKhoa = hs.getDotXetHbKhoa().getKhoa().getTenKhoa();
                hbKhoa.put(tenKhoa, hbKhoa.getOrDefault(tenKhoa, 0L) + 1);

                BigDecimal curTien = kinhPhiKhoa.getOrDefault(tenKhoa, BigDecimal.ZERO);
                kinhPhiKhoa.put(tenKhoa, curTien.add(hs.getMucHocBong() != null ? hs.getMucHocBong() : BigDecimal.ZERO));

                String loai = hs.getLoaiHocBong();
                if (loai != null) {
                    loaiHbMap.put(loai, loaiHbMap.getOrDefault(loai, 0L) + 1);
                }
            }
        }

        return DashboardStatsDTO.builder()
                .tongSinhVien(tongSv)
                .tongKhoa(tongKhoa)
                .tongNganh(tongNganh)
                .tongLop(tongLop)
                .tongDotXet(tongDot)
                .tongHoSoDatHocBong(tongDat)
                .tongKinhPhiHocBong(tongTien)
                .soMinhChungChoDuyet(mcChoDuyet)
                .soKienNghiChoXuLy(knChoXuLy)
                .soSinhVienCanhBao(canhBao)
                .hocBongTheoKhoa(hbKhoa)
                .kinhPhiTheoKhoa(kinhPhiKhoa)
                .phanBoLoaiHocBong(loaiHbMap)
                .build();
    }

    @Override
    public DashboardStatsDTO getFacultyDashboardStats(String maKhoa) {
        String targetKhoa = ("CNTT".equalsIgnoreCase(maKhoa)) ? "IT" : (maKhoa != null ? maKhoa : "IT");
        long tongSv = sinhVienRepository.findByLopSinhHoat_Khoa_MaKhoa(targetKhoa).size();
        long tongNganh = nganhRepository.findByKhoa_MaKhoa(targetKhoa).size();
        long tongLop = lopSinhHoatRepository.findByKhoa_MaKhoa(targetKhoa).size();
        long tongDot = dotXetHocBongRepository.count();

        List<HoSoHocBong> allDossiers = hoSoHocBongRepository.findAll().stream()
                .filter(h -> targetKhoa.equalsIgnoreCase(h.getDotXetHbKhoa().getKhoa().getMaKhoa()))
                .toList();

        long tongDat = allDossiers.stream()
                .filter(h -> "CHINH_THUC".equalsIgnoreCase(h.getTrangThai()) || "DU_KIEN".equalsIgnoreCase(h.getTrangThai()))
                .count();

        BigDecimal tongTien = allDossiers.stream()
                .filter(h -> "CHINH_THUC".equalsIgnoreCase(h.getTrangThai()) || "DU_KIEN".equalsIgnoreCase(h.getTrangThai()))
                .map(h -> h.getMucHocBong() != null ? h.getMucHocBong() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long mcChoDuyet = minhChungRepository.findBySinhVien_LopSinhHoat_Khoa_MaKhoaAndTrangThai(targetKhoa, "CHO_DUYET").size();
        long knChoXuLy = kienNghiRepository.findByDotXetHbKhoa_Khoa_MaKhoaAndTrangThai(targetKhoa, "CHO_XU_LY").size();

        long canhBao = 0;
        List<SinhVien> svKhoa = sinhVienRepository.findByLopSinhHoat_Khoa_MaKhoa(targetKhoa);
        for (SinhVien sv : svKhoa) {
            boolean hasWarn = ketQuaHocTapRepository.findBySinhVien_Mssv(sv.getMssv()).stream()
                    .anyMatch(k -> (k.getDiemTrungBinh() != null && k.getDiemTrungBinh().compareTo(BigDecimal.valueOf(2.0)) < 0) ||
                            Boolean.TRUE.equals(k.getCoHocPhanRot()));
            if (hasWarn) canhBao++;
        }

        Map<String, Long> loaiHbMap = new HashMap<>();
        loaiHbMap.put("XUAT_SAC", 0L);
        loaiHbMap.put("GIOI", 0L);
        loaiHbMap.put("KHA", 0L);

        for (HoSoHocBong hs : allDossiers) {
            if ("CHINH_THUC".equalsIgnoreCase(hs.getTrangThai()) || "DU_KIEN".equalsIgnoreCase(hs.getTrangThai())) {
                String loai = hs.getLoaiHocBong();
                if (loai != null) {
                    loaiHbMap.put(loai, loaiHbMap.getOrDefault(loai, 0L) + 1);
                }
            }
        }

        return DashboardStatsDTO.builder()
                .tongSinhVien(tongSv)
                .tongKhoa(1)
                .tongNganh(tongNganh)
                .tongLop(tongLop)
                .tongDotXet(tongDot)
                .tongHoSoDatHocBong(tongDat)
                .tongKinhPhiHocBong(tongTien)
                .soMinhChungChoDuyet(mcChoDuyet)
                .soKienNghiChoXuLy(knChoXuLy)
                .soSinhVienCanhBao(canhBao)
                .phanBoLoaiHocBong(loaiHbMap)
                .build();
    }
}
