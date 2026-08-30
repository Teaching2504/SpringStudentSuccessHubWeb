package com.nttt.repositories;

import com.nttt.pojo.MinhChungRenLuyen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MinhChungRenLuyenRepository extends JpaRepository<MinhChungRenLuyen, String> {
    List<MinhChungRenLuyen> findBySinhVien_Mssv(String mssv);
    List<MinhChungRenLuyen> findBySinhVien_MssvAndHocKy_MaHocKy(String mssv, String maHocKy);
    List<MinhChungRenLuyen> findBySinhVien_LopSinhHoat_Khoa_MaKhoa(String maKhoa);
    List<MinhChungRenLuyen> findBySinhVien_LopSinhHoat_Khoa_MaKhoaAndTrangThai(String maKhoa, String trangThai);
    List<MinhChungRenLuyen> findByTrangThai(String trangThai);
}
