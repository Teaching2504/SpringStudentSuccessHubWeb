package com.nttt.services.impl;

import com.nttt.dto.KienNghiDTO;
import com.nttt.pojo.*;
import com.nttt.repositories.*;
import com.nttt.services.KienNghiService;
import com.nttt.services.SinhVienService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class KienNghiServiceImpl implements KienNghiService {

    private final KienNghiRepository kienNghiRepository;
    private final DotXetHbKhoaRepository dotXetHbKhoaRepository;
    private final HoSoHocBongRepository hoSoHocBongRepository;
    private final NhanVienRepository nhanVienRepository;
    private final KetQuaRenLuyenRepository ketQuaRenLuyenRepository;
    private final KetQuaHocTapRepository ketQuaHocTapRepository;
    private final SinhVienService sinhVienService;

    public KienNghiServiceImpl(
            KienNghiRepository kienNghiRepository,
            DotXetHbKhoaRepository dotXetHbKhoaRepository,
            HoSoHocBongRepository hoSoHocBongRepository,
            NhanVienRepository nhanVienRepository,
            KetQuaRenLuyenRepository ketQuaRenLuyenRepository,
            KetQuaHocTapRepository ketQuaHocTapRepository,
            SinhVienService sinhVienService
    ) {
        this.kienNghiRepository = kienNghiRepository;
        this.dotXetHbKhoaRepository = dotXetHbKhoaRepository;
        this.hoSoHocBongRepository = hoSoHocBongRepository;
        this.nhanVienRepository = nhanVienRepository;
        this.ketQuaRenLuyenRepository = ketQuaRenLuyenRepository;
        this.ketQuaHocTapRepository = ketQuaHocTapRepository;
        this.sinhVienService = sinhVienService;
    }

    @Override
    @Transactional
    public KienNghiDTO submitKienNghi(KienNghiDTO dto) {
        DotXetHbKhoa dk = dotXetHbKhoaRepository.findById(dto.getMaDotXetHbKhoa())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đợt xét học bổng"));

        if (dk.getHanPhanHoi() != null && LocalDate.now().isAfter(dk.getHanPhanHoi())) {
            throw new RuntimeException("Đã hết thời hạn gửi kiến nghị/phản hồi (" + dk.getHanPhanHoi() + ")!");
        }

        HoSoHocBong hs = null;
        if (dto.getMaHoSo() != null && !dto.getMaHoSo().isBlank()) {
            hs = hoSoHocBongRepository.findById(dto.getMaHoSo()).orElse(null);
        } else if (dto.getMssv() != null) {
            hs = hoSoHocBongRepository.findBySinhVien_MssvAndDotXetHbKhoa_MaDotXetHbKhoa(dto.getMssv(), dto.getMaDotXetHbKhoa()).orElse(null);
        }

        String maKN = "KN_" + System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 4);

        KienNghi kn = KienNghi.builder()
                .maKienNghi(maKN)
                .noiDung(dto.getNoiDung())
                .tepMinhChung(dto.getTepMinhChung())
                .trangThai("CHO_XU_LY")
                .dotXetHbKhoa(dk)
                .hoSoHocBong(hs)
                .ngayGui(LocalDate.now())
                .build();

        return mapToDTO(kienNghiRepository.save(kn));
    }

    @Override
    public List<KienNghiDTO> getByDotKhoa(String maDotXetHbKhoa) {
        return kienNghiRepository.findByDotXetHbKhoa_MaDotXetHbKhoa(maDotXetHbKhoa).stream()
                .map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public List<KienNghiDTO> getByKhoa(String maKhoa, String trangThai) {
        if (trangThai != null && !trangThai.isBlank()) {
            return kienNghiRepository.findByDotXetHbKhoa_Khoa_MaKhoaAndTrangThai(maKhoa, trangThai).stream()
                    .map(this::mapToDTO).collect(Collectors.toList());
        }
        return kienNghiRepository.findByDotXetHbKhoa_Khoa_MaKhoa(maKhoa).stream()
                .map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public List<KienNghiDTO> getBySinhVien(String mssv) {
        return kienNghiRepository.findByHoSoHocBong_SinhVien_Mssv(mssv).stream()
                .map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public KienNghiDTO resolveKienNghi(String maKienNghi, String usernameNhanVien, boolean accept, String phanHoi) {
        return resolveKienNghi(maKienNghi, usernameNhanVien, accept, phanHoi, null);
    }

    @Override
    @Transactional
    public KienNghiDTO resolveKienNghi(String maKienNghi, String usernameNhanVien, boolean accept, String phanHoi, BigDecimal diemRenLuyenMoi) {
        KienNghi kn = kienNghiRepository.findById(maKienNghi)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy kiến nghị: " + maKienNghi));

        NhanVien nv = nhanVienRepository.findByNguoiDung_TenDangNhap(usernameNhanVien).orElse(null);
        kn.setNhanVienXuLy(nv);
        kn.setPhanHoi(phanHoi);
        kn.setTrangThai(accept ? "DA_CHAP_NHAN" : "DA_TU_CHOI");

        if (accept && diemRenLuyenMoi != null) {
            SinhVien sv = kn.getHoSoHocBong() != null ? kn.getHoSoHocBong().getSinhVien() : null;
            DotXetHbKhoa dk = kn.getDotXetHbKhoa();
            HocKy hk = (dk != null && dk.getDotXetHocBong() != null) ? dk.getDotXetHocBong().getHocKy() : null;
            String maHocKy = (hk != null) ? hk.getMaHocKy() : "HK1_2025_2026";

            if (sv != null) {
                sinhVienService.updateTrainingScore(sv.getMssv(), maHocKy, diemRenLuyenMoi, phanHoi);
            }

            HoSoHocBong hs = kn.getHoSoHocBong();
            if (hs != null) {
                BigDecimal gpa = hs.getDiemXet();
                if (gpa == null && sv != null) {
                    Optional<KetQuaHocTap> kq = ketQuaHocTapRepository.findBySinhVien_MssvAndHocKy_MaHocKy(sv.getMssv(), maHocKy);
                    if (kq.isPresent()) gpa = kq.get().getDiemTrungBinh();
                }

                if (gpa != null) {
                    if (gpa.compareTo(BigDecimal.valueOf(3.60)) >= 0 && diemRenLuyenMoi.compareTo(BigDecimal.valueOf(90.0)) >= 0) {
                        hs.setLoaiHocBong("XUAT_SAC");
                        hs.setTrangThai("CHINH_THUC");
                    } else if (gpa.compareTo(BigDecimal.valueOf(3.20)) >= 0 && diemRenLuyenMoi.compareTo(BigDecimal.valueOf(80.0)) >= 0) {
                        hs.setLoaiHocBong("GIOI");
                        hs.setTrangThai("CHINH_THUC");
                    } else if (gpa.compareTo(BigDecimal.valueOf(2.50)) >= 0 && diemRenLuyenMoi.compareTo(BigDecimal.valueOf(65.0)) >= 0) {
                        hs.setLoaiHocBong("KHA");
                        hs.setTrangThai("CHINH_THUC");
                    }
                    hoSoHocBongRepository.save(hs);
                }
            }
        }

        return mapToDTO(kienNghiRepository.save(kn));
    }

    @Override
    public void deleteKienNghi(String maKienNghi) {
        kienNghiRepository.deleteById(maKienNghi);
    }

    private KienNghiDTO mapToDTO(KienNghi kn) {
        KienNghiDTO.Builder b = KienNghiDTO.builder()
                .maKienNghi(kn.getMaKienNghi())
                .noiDung(kn.getNoiDung())
                .tepMinhChung(kn.getTepMinhChung())
                .trangThai(kn.getTrangThai())
                .phanHoi(kn.getPhanHoi())
                .ngayGui(kn.getNgayGui());

        String maHocKy = null;
        if (kn.getDotXetHbKhoa() != null) {
            b.maDotXetHbKhoa(kn.getDotXetHbKhoa().getMaDotXetHbKhoa());
            if (kn.getDotXetHbKhoa().getDotXetHocBong() != null) {
                b.tenDot(kn.getDotXetHbKhoa().getDotXetHocBong().getTenDot());
                if (kn.getDotXetHbKhoa().getDotXetHocBong().getHocKy() != null) {
                    maHocKy = kn.getDotXetHbKhoa().getDotXetHocBong().getHocKy().getMaHocKy();
                    b.maHocKy(maHocKy);
                }
            }
            if (kn.getDotXetHbKhoa().getKhoa() != null) {
                b.maKhoa(kn.getDotXetHbKhoa().getKhoa().getMaKhoa());
                b.tenKhoa(kn.getDotXetHbKhoa().getKhoa().getTenKhoa());
            }
        }

        if (kn.getHoSoHocBong() != null) {
            b.maHoSo(kn.getHoSoHocBong().getMaHoSo());
            b.loaiHocBongHienTai(kn.getHoSoHocBong().getLoaiHocBong());
            SinhVien sv = kn.getHoSoHocBong().getSinhVien();
            if (sv != null) {
                b.mssv(sv.getMssv());
                if (sv.getNguoiDung() != null) {
                    b.hoTenSinhVien(sv.getNguoiDung().getHoTen());
                }
                if (sv.getLopSinhHoat() != null) {
                    b.maLop(sv.getLopSinhHoat().getMaLop());
                }

                if (maHocKy != null) {
                    ketQuaRenLuyenRepository.findBySinhVien_MssvAndHocKy_MaHocKy(sv.getMssv(), maHocKy)
                            .ifPresent(d -> b.diemRenLuyenHienTai(d.getDiemRenLuyen()));
                    ketQuaHocTapRepository.findBySinhVien_MssvAndHocKy_MaHocKy(sv.getMssv(), maHocKy)
                            .ifPresent(g -> b.diemTrungBinhHienTai(g.getDiemTrungBinh()));
                } else {
                    ketQuaRenLuyenRepository.findBySinhVien_Mssv(sv.getMssv()).stream().findFirst()
                            .ifPresent(d -> b.diemRenLuyenHienTai(d.getDiemRenLuyen()));
                    ketQuaHocTapRepository.findBySinhVien_Mssv(sv.getMssv()).stream().findFirst()
                            .ifPresent(g -> b.diemTrungBinhHienTai(g.getDiemTrungBinh()));
                }
            }
        }

        if (kn.getNhanVienXuLy() != null) {
            b.maNvXuLy(kn.getNhanVienXuLy().getMaNv());
            if (kn.getNhanVienXuLy().getNguoiDung() != null) {
                b.hoTenNhanVien(kn.getNhanVienXuLy().getNguoiDung().getHoTen());
            }
        }

        return b.build();
    }
}
