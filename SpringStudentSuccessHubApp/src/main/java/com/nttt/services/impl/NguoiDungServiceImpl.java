package com.nttt.services.impl;

import com.nttt.dto.NguoiDungDTO;
import com.nttt.pojo.NguoiDung;
import com.nttt.repositories.NguoiDungRepository;
import com.nttt.repositories.SinhVienRepository;
import com.nttt.services.NguoiDungService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NguoiDungServiceImpl implements NguoiDungService {

    private final NguoiDungRepository nguoiDungRepository;
    private final SinhVienRepository sinhVienRepository;
    private final PasswordEncoder passwordEncoder;

    public NguoiDungServiceImpl(NguoiDungRepository nguoiDungRepository, SinhVienRepository sinhVienRepository, PasswordEncoder passwordEncoder) {
        this.nguoiDungRepository = nguoiDungRepository;
        this.sinhVienRepository = sinhVienRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public List<NguoiDungDTO> getAllUsers() {
        return nguoiDungRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public NguoiDungDTO getUserById(Long id) {
        NguoiDung user = nguoiDungRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với ID: " + id));
        return mapToDTO(user);
    }

    @Override
    public NguoiDungDTO createUser(NguoiDungDTO dto) {
        if (nguoiDungRepository.existsByTenDangNhap(dto.getTenDangNhap())) {
            throw new RuntimeException("Tên đăng nhập đã tồn tại trong hệ thống!");
        }

        String rawPwd = dto.getMatKhau() != null && !dto.getMatKhau().isBlank() ? dto.getMatKhau() : "123456";

        NguoiDung user = NguoiDung.builder()
                .tenDangNhap(dto.getTenDangNhap())
                .matKhau(passwordEncoder.encode(rawPwd))
                .matKhauHienThi(rawPwd)
                .hoTen(dto.getHoTen())
                .email(dto.getEmail())
                .soDienThoai(dto.getSoDienThoai())
                .vaiTro(dto.getVaiTro() != null ? dto.getVaiTro() : "ROLE_SINH_VIEN")
                .trangThai("HOAT_DONG")
                .build();

        return mapToDTO(nguoiDungRepository.save(user));
    }

    @Override
    public NguoiDungDTO updateUser(Long id, NguoiDungDTO dto) {
        NguoiDung user = nguoiDungRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với ID: " + id));

        user.setHoTen(dto.getHoTen());
        user.setEmail(dto.getEmail());
        user.setSoDienThoai(dto.getSoDienThoai());
        if (dto.getVaiTro() != null) {
            user.setVaiTro(dto.getVaiTro());
        }
        if (dto.getTrangThai() != null) {
            user.setTrangThai(dto.getTrangThai());
        }
        if (dto.getMatKhau() != null && !dto.getMatKhau().isBlank()) {
            user.setMatKhau(passwordEncoder.encode(dto.getMatKhau()));
            user.setMatKhauHienThi(dto.getMatKhau());
        }

        return mapToDTO(nguoiDungRepository.save(user));
    }

    @Override
    public void deleteUser(Long id) {
        nguoiDungRepository.deleteById(id);
    }

    @Override
    public void toggleUserStatus(Long id) {
        NguoiDung user = nguoiDungRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        if ("HOAT_DONG".equalsIgnoreCase(user.getTrangThai())) {
            user.setTrangThai("BI_KHOA");
        } else {
            user.setTrangThai("HOAT_DONG");
        }
        nguoiDungRepository.save(user);
    }

    @Override
    public void resetPassword(Long id, String newPassword) {
        NguoiDung user = nguoiDungRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        String pwd = (newPassword != null && !newPassword.isBlank()) ? newPassword : "123456";
        user.setMatKhau(passwordEncoder.encode(pwd));
        user.setMatKhauHienThi(pwd);
        nguoiDungRepository.save(user);
    }

    private NguoiDungDTO mapToDTO(NguoiDung u) {
        String cccd = null;
        if ("ROLE_SINH_VIEN".equals(u.getVaiTro())) {
            cccd = sinhVienRepository.findByNguoiDung_Id(u.getId())
                    .map(sv -> sv.getCccd())
                    .orElse(null);
        }

        String plain = u.getMatKhauHienThi();
        if (plain == null || plain.isBlank()) {
            if ("ROLE_SINH_VIEN".equals(u.getVaiTro())) {
                plain = (cccd != null && !cccd.isBlank()) ? cccd : (u.getTenDangNhap().equals("2351010216") ? "092305006276" : "079205001111");
            } else if ("admin".equals(u.getTenDangNhap())) {
                plain = "admin123";
            } else if ("captruong".equals(u.getTenDangNhap()) || "captruong_tuan".equals(u.getTenDangNhap())) {
                plain = "truong123";
            } else if ("ROLE_CAN_BO_KHOA".equals(u.getVaiTro())) {
                plain = "khoa123";
            } else {
                plain = "123456";
            }
        }

        return NguoiDungDTO.builder()
                .id(u.getId())
                .tenDangNhap(u.getTenDangNhap())
                .hoTen(u.getHoTen())
                .email(u.getEmail())
                .soDienThoai(u.getSoDienThoai())
                .vaiTro(u.getVaiTro())
                .trangThai(u.getTrangThai())
                .ngayTao(u.getNgayTao())
                .cccd(cccd)
                .matKhauHienThi(plain)
                .build();
    }
}
