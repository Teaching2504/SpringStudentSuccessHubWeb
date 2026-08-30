package com.nttt.services.impl;

import com.nttt.dto.KienNghiDTO;
import com.nttt.pojo.*;
import com.nttt.repositories.*;
import com.nttt.services.KienNghiService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class KienNghiServiceImpl implements KienNghiService {

    private final KienNghiRepository kienNghiRepository;
    private final DotXetHbKhoaRepository dotXetHbKhoaRepository;
    private final HoSoHocBongRepository hoSoHocBongRepository;
    private final NhanVienRepository nhanVienRepository;

    public KienNghiServiceImpl(
            KienNghiRepository kienNghiRepository,
            DotXetHbKhoaRepository dotXetHbKhoaRepository,
            HoSoHocBongRepository hoSoHocBongRepository,
            NhanVienRepository nhanVienRepository
    ) {
        this.kienNghiRepository = kienNghiRepository;
        this.dotXetHbKhoaRepository = dotXetHbKhoaRepository;
        this.hoSoHocBongRepository = hoSoHocBongRepository;
        this.nhanVienRepository = nhanVienRepository;
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
        KienNghi kn = kienNghiRepository.findById(maKienNghi)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy kiến nghị: " + maKienNghi));

        NhanVien nv = nhanVienRepository.findByNguoiDung_TenDangNhap(usernameNhanVien).orElse(null);
        kn.setNhanVienXuLy(nv);
        kn.setPhanHoi(phanHoi);
        kn.setTrangThai(accept ? "DA_CHAP_NHAN" : "DA_TU_CHOI");

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

        if (kn.getDotXetHbKhoa() != null) {
            b.maDotXetHbKhoa(kn.getDotXetHbKhoa().getMaDotXetHbKhoa());
            if (kn.getDotXetHbKhoa().getDotXetHocBong() != null) {
                b.tenDot(kn.getDotXetHbKhoa().getDotXetHocBong().getTenDot());
            }
            if (kn.getDotXetHbKhoa().getKhoa() != null) {
                b.maKhoa(kn.getDotXetHbKhoa().getKhoa().getMaKhoa());
                b.tenKhoa(kn.getDotXetHbKhoa().getKhoa().getTenKhoa());
            }
        }

        if (kn.getHoSoHocBong() != null) {
            b.maHoSo(kn.getHoSoHocBong().getMaHoSo());
            SinhVien sv = kn.getHoSoHocBong().getSinhVien();
            if (sv != null) {
                b.mssv(sv.getMssv());
                if (sv.getNguoiDung() != null) {
                    b.hoTenSinhVien(sv.getNguoiDung().getHoTen());
                }
                if (sv.getLopSinhHoat() != null) {
                    b.maLop(sv.getLopSinhHoat().getMaLop());
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
