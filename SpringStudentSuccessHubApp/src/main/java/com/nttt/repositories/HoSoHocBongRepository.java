package com.nttt.repositories;

import com.nttt.pojo.HoSoHocBong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HoSoHocBongRepository extends JpaRepository<HoSoHocBong, String> {
    List<HoSoHocBong> findByDotXetHbKhoa_MaDotXetHbKhoaOrderByThuHangAsc(String maDotXetHbKhoa);
    List<HoSoHocBong> findByDotXetHbKhoa_DotXetHocBong_MaDot(String maDot);
    List<HoSoHocBong> findBySinhVien_Mssv(String mssv);
    Optional<HoSoHocBong> findBySinhVien_MssvAndDotXetHbKhoa_MaDotXetHbKhoa(String mssv, String maDotXetHbKhoa);
    Optional<HoSoHocBong> findBySinhVien_MssvAndDotXetHbKhoa_DotXetHocBong_MaDot(String mssv, String maDot);
    List<HoSoHocBong> findBySinhVien_MssvAndTrangThai(String mssv, String trangThai);
}
