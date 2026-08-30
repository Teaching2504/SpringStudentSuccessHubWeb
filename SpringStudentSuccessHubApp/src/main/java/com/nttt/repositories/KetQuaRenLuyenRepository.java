package com.nttt.repositories;

import com.nttt.pojo.KetQuaRenLuyen;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface KetQuaRenLuyenRepository extends JpaRepository<KetQuaRenLuyen, String> {
    List<KetQuaRenLuyen> findBySinhVien_Mssv(String mssv);
    Optional<KetQuaRenLuyen> findBySinhVien_MssvAndHocKy_MaHocKy(String mssv, String maHocKy);
    List<KetQuaRenLuyen> findByHocKy_MaHocKy(String maHocKy);
}
