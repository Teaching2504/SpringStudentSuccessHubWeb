package com.nttt.repositories;

import com.nttt.pojo.SinhVien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SinhVienRepository extends JpaRepository<SinhVien, String> {
    Optional<SinhVien> findByNguoiDung_Id(Long nguoiDungId);
    Optional<SinhVien> findByNguoiDung_TenDangNhap(String tenDangNhap);
    List<SinhVien> findByLopSinhHoat_MaLop(String maLop);
    List<SinhVien> findByLopSinhHoat_Khoa_MaKhoa(String maKhoa);
    List<SinhVien> findByLopSinhHoat_Nganh_MaNganh(String maNganh);
    List<SinhVien> findByLopSinhHoat_KhoaHoc(String khoaHoc);

    @Query("SELECT sv FROM SinhVien sv WHERE " +
           "(:maKhoa IS NULL OR sv.lopSinhHoat.khoa.maKhoa = :maKhoa) AND " +
           "(:maNganh IS NULL OR sv.lopSinhHoat.nganh.maNganh = :maNganh) AND " +
           "(:maLop IS NULL OR sv.lopSinhHoat.maLop = :maLop) AND " +
           "(:khoaHoc IS NULL OR sv.lopSinhHoat.khoaHoc = :khoaHoc) AND " +
           "(:search IS NULL OR LOWER(sv.mssv) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(sv.nguoiDung.hoTen) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<SinhVien> filterSinhVien(
            @Param("maKhoa") String maKhoa,
            @Param("maNganh") String maNganh,
            @Param("maLop") String maLop,
            @Param("khoaHoc") String khoaHoc,
            @Param("search") String search
    );
}
