package com.nttt.services.impl;

import com.nttt.dto.SinhVienDTO;
import com.nttt.pojo.*;
import com.nttt.repositories.*;
import com.nttt.services.SinhVienService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SinhVienServiceImpl implements SinhVienService {

    private final SinhVienRepository sinhVienRepository;
    private final NguoiDungRepository nguoiDungRepository;
    private final LopSinhHoatRepository lopSinhHoatRepository;
    private final KetQuaHocTapRepository ketQuaHocTapRepository;
    private final KetQuaRenLuyenRepository ketQuaRenLuyenRepository;
    private final PasswordEncoder passwordEncoder;

    public SinhVienServiceImpl(SinhVienRepository sinhVienRepository, NguoiDungRepository nguoiDungRepository, LopSinhHoatRepository lopSinhHoatRepository, KetQuaHocTapRepository ketQuaHocTapRepository, KetQuaRenLuyenRepository ketQuaRenLuyenRepository, PasswordEncoder passwordEncoder) {
        this.sinhVienRepository = sinhVienRepository;
        this.nguoiDungRepository = nguoiDungRepository;
        this.lopSinhHoatRepository = lopSinhHoatRepository;
        this.ketQuaHocTapRepository = ketQuaHocTapRepository;
        this.ketQuaRenLuyenRepository = ketQuaRenLuyenRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public List<SinhVienDTO> filterStudents(String maKhoa, String maNganh, String maLop, String khoaHoc, String search, String maHocKy) {
        String k = (maKhoa != null && !maKhoa.isBlank()) ? maKhoa : null;
        String n = (maNganh != null && !maNganh.isBlank()) ? maNganh : null;
        String l = (maLop != null && !maLop.isBlank()) ? maLop : null;
        String kh = (khoaHoc != null && !khoaHoc.isBlank()) ? khoaHoc : null;
        String s = (search != null && !search.isBlank()) ? search.trim() : null;

        List<SinhVien> list = sinhVienRepository.filterSinhVien(k, n, l, kh, s);
        return list.stream().map(sv -> mapToDTO(sv, maHocKy)).collect(Collectors.toList());
    }

    @Override
    public SinhVienDTO getStudentByMssv(String mssv, String maHocKy) {
        SinhVien sv = sinhVienRepository.findById(mssv)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên có MSSV: " + mssv));
        return mapToDTO(sv, maHocKy);
    }

    @Override
    public SinhVienDTO getStudentByUsername(String username, String maHocKy) {
        SinhVien sv = sinhVienRepository.findByNguoiDung_TenDangNhap(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin sinh viên cho tài khoản: " + username));
        return mapToDTO(sv, maHocKy);
    }

    @Override
    @Transactional
    public SinhVienDTO createStudent(SinhVienDTO dto) {
        if (sinhVienRepository.existsById(dto.getMssv())) {
            throw new RuntimeException("Mã số sinh viên đã tồn tại!");
        }

        // Create linked User account
        NguoiDung user = NguoiDung.builder()
                .tenDangNhap(dto.getMssv())
                .matKhau(passwordEncoder.encode(dto.getCccd() != null ? dto.getCccd() : "123456"))
                .hoTen(dto.getHoTen())
                .email(dto.getEmail() != null ? dto.getEmail() : dto.getMssv() + "@ou.edu.vn")
                .soDienThoai(dto.getSoDienThoai())
                .vaiTro("ROLE_SINH_VIEN")
                .trangThai("HOAT_DONG")
                .build();
        user = nguoiDungRepository.save(user);

        LopSinhHoat lop = lopSinhHoatRepository.findById(dto.getMaLop())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp sinh hoạt: " + dto.getMaLop()));

        SinhVien sv = SinhVien.builder()
                .mssv(dto.getMssv())
                .cccd(dto.getCccd())
                .nguoiDung(user)
                .ngaySinh(dto.getNgaySinh())
                .gioiTinh(dto.getGioiTinh())
                .diaChi(dto.getDiaChi())
                .trangThaiHoc(dto.getTrangThaiHoc() != null ? dto.getTrangThaiHoc() : "DANG_HOC")
                .lopSinhHoat(lop)
                .build();

        return mapToDTO(sinhVienRepository.save(sv), null);
    }

    @Override
    @Transactional
    public SinhVienDTO updateStudent(String mssv, SinhVienDTO dto) {
        SinhVien sv = sinhVienRepository.findById(mssv)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên: " + mssv));

        if (dto.getCccd() != null) sv.setCccd(dto.getCccd());
        sv.setNgaySinh(dto.getNgaySinh());
        sv.setGioiTinh(dto.getGioiTinh());
        sv.setDiaChi(dto.getDiaChi());
        if (dto.getTrangThaiHoc() != null) {
            sv.setTrangThaiHoc(dto.getTrangThaiHoc());
        }

        if (dto.getMaLop() != null && !dto.getMaLop().equals(sv.getLopSinhHoat().getMaLop())) {
            LopSinhHoat lop = lopSinhHoatRepository.findById(dto.getMaLop())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp: " + dto.getMaLop()));
            sv.setLopSinhHoat(lop);
        }

        // Update user account
        NguoiDung user = sv.getNguoiDung();
        if (user != null) {
            if (dto.getHoTen() != null) user.setHoTen(dto.getHoTen());
            if (dto.getEmail() != null) user.setEmail(dto.getEmail());
            if (dto.getSoDienThoai() != null) user.setSoDienThoai(dto.getSoDienThoai());
            nguoiDungRepository.save(user);
        }

        return mapToDTO(sinhVienRepository.save(sv), null);
    }

    @Override
    @Transactional
    public void deleteStudent(String mssv) {
        SinhVien sv = sinhVienRepository.findById(mssv)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sinh viên: " + mssv));
        Long userId = sv.getNguoiDung() != null ? sv.getNguoiDung().getId() : null;
        sinhVienRepository.delete(sv);
        if (userId != null) {
            nguoiDungRepository.deleteById(userId);
        }
    }

    @Override
    public List<KetQuaHocTap> getAcademicHistory(String mssv) {
        List<KetQuaHocTap> list = ketQuaHocTapRepository.findBySinhVien_Mssv(mssv);
        list.sort(Comparator.comparingInt(k -> getSemesterOrderKey(k.getHocKy())));
        return list;
    }

    @Override
    public List<KetQuaRenLuyen> getTrainingHistory(String mssv) {
        List<KetQuaRenLuyen> list = ketQuaRenLuyenRepository.findBySinhVien_Mssv(mssv);
        list.sort(Comparator.comparingInt(k -> getSemesterOrderKey(k.getHocKy())));
        return list;
    }

    @Override
    public void saveAcademicResult(KetQuaHocTap kq) {
        ketQuaHocTapRepository.save(kq);
    }

    @Override
    public void saveTrainingResult(KetQuaRenLuyen kq) {
        ketQuaRenLuyenRepository.save(kq);
    }

    private SinhVienDTO mapToDTO(SinhVien sv, String maHocKy) {
        SinhVienDTO dto = SinhVienDTO.builder()
                .mssv(sv.getMssv())
                .cccd(sv.getCccd())
                .ngaySinh(sv.getNgaySinh())
                .gioiTinh(sv.getGioiTinh())
                .diaChi(sv.getDiaChi())
                .trangThaiHoc(sv.getTrangThaiHoc())
                .build();

        if (sv.getNguoiDung() != null) {
            dto.setNguoiDungId(sv.getNguoiDung().getId());
            dto.setHoTen(sv.getNguoiDung().getHoTen());
            dto.setEmail(sv.getNguoiDung().getEmail());
            dto.setSoDienThoai(sv.getNguoiDung().getSoDienThoai());
        }

        if (sv.getLopSinhHoat() != null) {
            dto.setMaLop(sv.getLopSinhHoat().getMaLop());
            dto.setTenLop(sv.getLopSinhHoat().getTenLop());
            dto.setKhoaHoc(sv.getLopSinhHoat().getKhoaHoc());
            if (sv.getLopSinhHoat().getNganh() != null) {
                dto.setMaNganh(sv.getLopSinhHoat().getNganh().getMaNganh());
                dto.setTenNganh(sv.getLopSinhHoat().getNganh().getTenNganh());
            }
            if (sv.getLopSinhHoat().getKhoa() != null) {
                dto.setMaKhoa(sv.getLopSinhHoat().getKhoa().getMaKhoa());
                dto.setTenKhoa(sv.getLopSinhHoat().getKhoa().getTenKhoa());
            }
        }

        // Attach GPA and DRL if maHocKy is present, or take latest
        List<KetQuaHocTap> gpaList = ketQuaHocTapRepository.findBySinhVien_Mssv(sv.getMssv());
        List<KetQuaRenLuyen> drlList = ketQuaRenLuyenRepository.findBySinhVien_Mssv(sv.getMssv());

        gpaList.sort(Comparator.comparingInt(k -> getSemesterOrderKey(k.getHocKy())));
        drlList.sort(Comparator.comparingInt(k -> getSemesterOrderKey(k.getHocKy())));

        Optional<KetQuaHocTap> gpaOpt = (maHocKy != null && !maHocKy.isBlank()) ?
                gpaList.stream().filter(g -> g.getHocKy().getMaHocKy().equals(maHocKy)).findFirst() :
                (gpaList.isEmpty() ? Optional.empty() : Optional.of(gpaList.get(gpaList.size() - 1))); // lấy kỳ mới nhất

        Optional<KetQuaRenLuyen> drlOpt = (maHocKy != null && !maHocKy.isBlank()) ?
                drlList.stream().filter(d -> d.getHocKy().getMaHocKy().equals(maHocKy)).findFirst() :
                (drlList.isEmpty() ? Optional.empty() : Optional.of(drlList.get(drlList.size() - 1)));

        List<String> warnings = new ArrayList<>();

        if (gpaOpt.isPresent()) {
            KetQuaHocTap g = gpaOpt.get();
            dto.setDiemTrungBinh(g.getDiemTrungBinh());
            dto.setSoTinChi(g.getSoTinChi());
            dto.setCoHocPhanRot(g.getCoHocPhanRot());

            if (g.getDiemTrungBinh() != null && g.getDiemTrungBinh().compareTo(BigDecimal.valueOf(2.0)) < 0) {
                warnings.add("Cảnh báo GPA thấp (< 2.0)");
            }
            if (Boolean.TRUE.equals(g.getCoHocPhanRot())) {
                warnings.add("Cảnh báo nợ học phần");
            }
        }

        if (drlOpt.isPresent()) {
            KetQuaRenLuyen d = drlOpt.get();
            dto.setDiemRenLuyen(d.getDiemRenLuyen());
            dto.setXepLoaiRenLuyen(d.getXepLoai());

            if (d.getDiemRenLuyen() != null && d.getDiemRenLuyen().compareTo(BigDecimal.valueOf(65.0)) < 0) {
                warnings.add("Cảnh báo ĐRL thấp (< 65)");
            }
        }

        if (warnings.isEmpty()) {
            dto.setCanhBao("Bình thường");
        } else {
            dto.setCanhBao(String.join(", ", warnings));
        }

        return dto;
    }

    private int getSemesterOrderKey(HocKy hk) {
        if (hk == null) return 0;
        int hkNum = 1;
        String full = (hk.getMaHocKy() + " " + hk.getTenHocKy()).toUpperCase();
        if (full.contains("HK2") || full.contains("HỌC KỲ 2")) hkNum = 2;
        else if (full.contains("HK3") || full.contains("HỌC KỲ 3")) hkNum = 3;

        int startYear = 2023;
        String namHoc = hk.getNamHoc();
        if (namHoc != null && namHoc.length() >= 4) {
            try {
                startYear = Integer.parseInt(namHoc.substring(0, 4));
            } catch (Exception ignored) {}
        } else if (hk.getMaHocKy() != null) {
            for (String p : hk.getMaHocKy().split("_")) {
                if (p.length() == 4 && p.matches("\\d{4}")) {
                    try {
                        startYear = Integer.parseInt(p);
                        break;
                    } catch (Exception ignored) {}
                }
            }
        }
        return startYear * 10 + hkNum;
    }
}
