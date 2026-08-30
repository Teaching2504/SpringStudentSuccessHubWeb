package com.nttt.repositories;

import com.nttt.pojo.ChuongTrinhDaoTao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ChuongTrinhDaoTaoRepository extends JpaRepository<ChuongTrinhDaoTao, Long> {
    List<ChuongTrinhDaoTao> findByNganh_MaNganhOrderByHocKyGoiYAsc(String maNganh);
    List<ChuongTrinhDaoTao> findByNganh_MaNganhAndHocKyGoiY(String maNganh, Integer hocKyGoiY);
}
