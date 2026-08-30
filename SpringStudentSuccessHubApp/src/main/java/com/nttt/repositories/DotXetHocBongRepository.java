package com.nttt.repositories;

import com.nttt.pojo.DotXetHocBong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DotXetHocBongRepository extends JpaRepository<DotXetHocBong, String> {
    List<DotXetHocBong> findByHocKy_MaHocKy(String maHocKy);
    List<DotXetHocBong> findByTrangThai(String trangThai);
}
