package com.nttt.repositories;

import com.nttt.pojo.KienNghi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KienNghiRepository extends JpaRepository<KienNghi, String> {
    List<KienNghi> findByDotXetHbKhoa_MaDotXetHbKhoa(String maDotXetHbKhoa);
    List<KienNghi> findByDotXetHbKhoa_Khoa_MaKhoa(String maKhoa);
    List<KienNghi> findByDotXetHbKhoa_Khoa_MaKhoaAndTrangThai(String maKhoa, String trangThai);
    List<KienNghi> findByHoSoHocBong_SinhVien_Mssv(String mssv);
}
