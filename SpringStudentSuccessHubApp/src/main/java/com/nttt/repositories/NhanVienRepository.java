package com.nttt.repositories;

import com.nttt.pojo.NhanVien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NhanVienRepository extends JpaRepository<NhanVien, String> {
    Optional<NhanVien> findByNguoiDung_Id(Long nguoiDungId);
    Optional<NhanVien> findByNguoiDung_TenDangNhap(String tenDangNhap);
}
