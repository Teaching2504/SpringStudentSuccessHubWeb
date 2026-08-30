package com.nttt.services.impl;

import com.nttt.dto.MinhChungRenLuyenDTO;
import com.nttt.pojo.*;
import com.nttt.repositories.*;
import com.nttt.services.MinhChungRenLuyenService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class MinhChungRenLuyenServiceImpl implements MinhChungRenLuyenService {

    private final MinhChungRenLuyenRepository minhChungRepository;
    private final SinhVienRepository sinhVienRepository;
    private final HocKyRepository hocKyRepository;
    private final NhanVienRepository nhanVienRepository;
    private final KetQuaRenLuyenRepository ketQuaRenLuyenRepository;

    public MinhChungRenLuyenServiceImpl(
            MinhChungRenLuyenRepository minhChungRepository,
            SinhVienRepository sinhVienRepository,
            HocKyRepository hocKyRepository,
            NhanVienRepository nhanVienRepository,
            KetQuaRenLuyenRepository ketQuaRenLuyenRepository
    ) {
        this.minhChungRepository = minhChungRepository;
        this.sinhVienRepository = sinhVienRepository;
        this.hocKyRepository = hocKyRepository;
        this.nhanVienRepository = nhanVienRepository;
        this.ketQuaRenLuyenRepository = ketQuaRenLuyenRepository;
    }

    @Override
    @Transactional
    public MinhChungRenLuyenDTO submitMinhChung(MinhChungRenLuyenDTO dto) {
        SinhVien sv = sinhVienRepository.findById(dto.getMssv())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên: " + dto.getMssv()));

        HocKy hocKy = hocKyRepository.findById(dto.getMaHocKy())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy học kỳ: " + dto.getMaHocKy()));

        String maMC = "MC_" + System.currentTimeMillis() + "_" + UUID.randomUUID().toString().substring(0, 4);

        MinhChungRenLuyen mc = MinhChungRenLuyen.builder()
                .maMinhChung(maMC)
                .tenHoatDong(dto.getTenHoatDong())
                .diemDeXuat(dto.getDiemDeXuat() != null ? dto.getDiemDeXuat() : BigDecimal.valueOf(5.0))
                .fileUrl(dto.getFileUrl())
                .moTa(dto.getMoTa())
                .trangThai("CHO_DUYET")
                .sinhVien(sv)
                .hocKy(hocKy)
                .ngayTao(LocalDate.now())
                .build();

        return mapToDTO(minhChungRepository.save(mc));
    }

    @Override
    public List<MinhChungRenLuyenDTO> getBySinhVien(String mssv) {
        return minhChungRepository.findBySinhVien_Mssv(mssv).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<MinhChungRenLuyenDTO> getByKhoa(String maKhoa, String trangThai) {
        if (trangThai != null && !trangThai.isBlank()) {
            return minhChungRepository.findBySinhVien_LopSinhHoat_Khoa_MaKhoaAndTrangThai(maKhoa, trangThai).stream()
                    .map(this::mapToDTO).collect(Collectors.toList());
        }
        return minhChungRepository.findBySinhVien_LopSinhHoat_Khoa_MaKhoa(maKhoa).stream()
                .map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    public List<MinhChungRenLuyenDTO> getAll(String trangThai) {
        if (trangThai != null && !trangThai.isBlank()) {
            return minhChungRepository.findByTrangThai(trangThai).stream()
                    .map(this::mapToDTO).collect(Collectors.toList());
        }
        return minhChungRepository.findAll().stream()
                .map(this::mapToDTO).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public MinhChungRenLuyenDTO reviewMinhChung(String maMinhChung, String usernameNhanVien, boolean approve, String lyDo) {
        MinhChungRenLuyen mc = minhChungRepository.findById(maMinhChung)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy minh chứng: " + maMinhChung));

        NhanVien nv = nhanVienRepository.findByNguoiDung_TenDangNhap(usernameNhanVien).orElse(null);
        mc.setNhanVienPheDuyet(nv);
        mc.setLyDoPhanHoi(lyDo);

        if (approve) {
            mc.setTrangThai("DA_DUYET");

            Optional<KetQuaRenLuyen> drlOpt = ketQuaRenLuyenRepository.findBySinhVien_MssvAndHocKy_MaHocKy(
                    mc.getSinhVien().getMssv(), mc.getHocKy().getMaHocKy()
            );

            BigDecimal addedPoints = mc.getDiemDeXuat() != null ? mc.getDiemDeXuat() : BigDecimal.ZERO;

            KetQuaRenLuyen drl = drlOpt.orElseGet(() -> KetQuaRenLuyen.builder()
                    .id("DRL_" + mc.getSinhVien().getMssv() + "_" + mc.getHocKy().getMaHocKy())
                    .sinhVien(mc.getSinhVien())
                    .hocKy(mc.getHocKy())
                    .diemRenLuyen(BigDecimal.valueOf(70.0))
                    .xepLoai("Kha")
                    .build());

            BigDecimal newScore = (drl.getDiemRenLuyen() != null ? drl.getDiemRenLuyen() : BigDecimal.ZERO).add(addedPoints);
            if (newScore.compareTo(BigDecimal.valueOf(100.0)) > 0) {
                newScore = BigDecimal.valueOf(100.0);
            }
            drl.setDiemRenLuyen(newScore);

            if (newScore.compareTo(BigDecimal.valueOf(90.0)) >= 0) drl.setXepLoai("Xuat sac");
            else if (newScore.compareTo(BigDecimal.valueOf(80.0)) >= 0) drl.setXepLoai("Tot");
            else if (newScore.compareTo(BigDecimal.valueOf(65.0)) >= 0) drl.setXepLoai("Kha");
            else if (newScore.compareTo(BigDecimal.valueOf(50.0)) >= 0) drl.setXepLoai("Trung binh");
            else drl.setXepLoai("Yeu");

            ketQuaRenLuyenRepository.save(drl);
        } else {
            mc.setTrangThai("TU_CHOI");
        }

        return mapToDTO(minhChungRepository.save(mc));
    }

    @Override
    public void deleteMinhChung(String maMinhChung) {
        minhChungRepository.deleteById(maMinhChung);
    }

    private MinhChungRenLuyenDTO mapToDTO(MinhChungRenLuyen mc) {
        MinhChungRenLuyenDTO.Builder b = MinhChungRenLuyenDTO.builder()
                .maMinhChung(mc.getMaMinhChung())
                .tenHoatDong(mc.getTenHoatDong())
                .diemDeXuat(mc.getDiemDeXuat())
                .fileUrl(mc.getFileUrl())
                .moTa(mc.getMoTa())
                .trangThai(mc.getTrangThai())
                .lyDoPhanHoi(mc.getLyDoPhanHoi())
                .ngayTao(mc.getNgayTao());

        if (mc.getSinhVien() != null) {
            b.mssv(mc.getSinhVien().getMssv());
            if (mc.getSinhVien().getNguoiDung() != null) {
                b.hoTenSinhVien(mc.getSinhVien().getNguoiDung().getHoTen());
            }
            if (mc.getSinhVien().getLopSinhHoat() != null) {
                b.maLop(mc.getSinhVien().getLopSinhHoat().getMaLop());
                if (mc.getSinhVien().getLopSinhHoat().getKhoa() != null) {
                    b.maKhoa(mc.getSinhVien().getLopSinhHoat().getKhoa().getMaKhoa());
                    b.tenKhoa(mc.getSinhVien().getLopSinhHoat().getKhoa().getTenKhoa());
                }
            }
        }

        if (mc.getHocKy() != null) {
            b.maHocKy(mc.getHocKy().getMaHocKy());
        }

        if (mc.getNhanVienPheDuyet() != null) {
            b.maNvPheDuyet(mc.getNhanVienPheDuyet().getMaNv());
            if (mc.getNhanVienPheDuyet().getNguoiDung() != null) {
                b.hoTenNhanVien(mc.getNhanVienPheDuyet().getNguoiDung().getHoTen());
            }
        }

        return b.build();
    }
}
