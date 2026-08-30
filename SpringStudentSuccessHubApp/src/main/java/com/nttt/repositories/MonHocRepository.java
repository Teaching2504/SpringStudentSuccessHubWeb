package com.nttt.repositories;

import com.nttt.pojo.MonHoc;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MonHocRepository extends JpaRepository<MonHoc, String> {
    List<MonHoc> findByKhoa_MaKhoa(String maKhoa);
}
