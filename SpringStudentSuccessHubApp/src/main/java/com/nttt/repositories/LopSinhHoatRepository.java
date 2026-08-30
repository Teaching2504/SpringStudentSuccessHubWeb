package com.nttt.repositories;

import com.nttt.pojo.LopSinhHoat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LopSinhHoatRepository extends JpaRepository<LopSinhHoat, String> {
    List<LopSinhHoat> findByKhoa_MaKhoa(String maKhoa);
    List<LopSinhHoat> findByNganh_MaNganh(String maNganh);
    List<LopSinhHoat> findByKhoaHoc(String khoaHoc);
}
