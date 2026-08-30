package com.nttt.repositories;

import com.nttt.pojo.CanBoCapTruong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CanBoCapTruongRepository extends JpaRepository<CanBoCapTruong, String> {
    Optional<CanBoCapTruong> findByNhanVien_NguoiDung_TenDangNhap(String tenDangNhap);
}
