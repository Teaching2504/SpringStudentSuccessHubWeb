package com.nttt.repositories;

import com.nttt.pojo.DotXetHbKhoa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DotXetHbKhoaRepository extends JpaRepository<DotXetHbKhoa, String> {
    List<DotXetHbKhoa> findByDotXetHocBong_MaDot(String maDot);
    List<DotXetHbKhoa> findByKhoa_MaKhoa(String maKhoa);
    Optional<DotXetHbKhoa> findByDotXetHocBong_MaDotAndKhoa_MaKhoa(String maDot, String maKhoa);
}
