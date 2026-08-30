package com.nttt.repositories;

import com.nttt.pojo.KetQuaHocTap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface KetQuaHocTapRepository extends JpaRepository<KetQuaHocTap, String> {
    List<KetQuaHocTap> findBySinhVien_Mssv(String mssv);
    Optional<KetQuaHocTap> findBySinhVien_MssvAndHocKy_MaHocKy(String mssv, String maHocKy);
    List<KetQuaHocTap> findByHocKy_MaHocKy(String maHocKy);
    List<KetQuaHocTap> findByHocKy_MaHocKyAndSinhVien_LopSinhHoat_Khoa_MaKhoa(String maHocKy, String maKhoa);
}
