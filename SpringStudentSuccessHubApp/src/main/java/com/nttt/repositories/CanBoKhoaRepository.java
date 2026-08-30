package com.nttt.repositories;

import com.nttt.pojo.CanBoKhoa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CanBoKhoaRepository extends JpaRepository<CanBoKhoa, String> {
    List<CanBoKhoa> findByKhoa_MaKhoa(String maKhoa);
    Optional<CanBoKhoa> findByNhanVien_NguoiDung_TenDangNhap(String tenDangNhap);
}
