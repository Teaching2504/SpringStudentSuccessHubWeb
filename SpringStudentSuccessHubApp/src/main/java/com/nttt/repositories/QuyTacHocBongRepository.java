package com.nttt.repositories;

import com.nttt.pojo.QuyTacHocBong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuyTacHocBongRepository extends JpaRepository<QuyTacHocBong, String> {
    List<QuyTacHocBong> findByDotXetHocBong_MaDotOrderByPhienBanDesc(String maDot);
    Optional<QuyTacHocBong> findFirstByDotXetHocBong_MaDotOrderByPhienBanDesc(String maDot);
}
