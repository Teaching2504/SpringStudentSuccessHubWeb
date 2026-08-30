package com.nttt.repositories;

import com.nttt.pojo.Nganh;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NganhRepository extends JpaRepository<Nganh, String> {
    List<Nganh> findByKhoa_MaKhoa(String maKhoa);
}
