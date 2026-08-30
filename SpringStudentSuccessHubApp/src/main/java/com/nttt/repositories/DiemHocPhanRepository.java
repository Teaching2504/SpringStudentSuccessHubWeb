package com.nttt.repositories;

import com.nttt.pojo.DiemHocPhan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DiemHocPhanRepository extends JpaRepository<DiemHocPhan, String> {
    List<DiemHocPhan> findBySinhVien_MssvAndHocKy_MaHocKy(String mssv, String maHocKy);
    List<DiemHocPhan> findBySinhVien_Mssv(String mssv);
    List<DiemHocPhan> findByHocKy_MaHocKy(String maHocKy);
    List<DiemHocPhan> findBySinhVien_LopSinhHoat_Nganh_MaNganhAndHocKy_MaHocKy(String maNganh, String maHocKy);
}
