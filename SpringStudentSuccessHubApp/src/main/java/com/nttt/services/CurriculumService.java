package com.nttt.services;

import com.nttt.dto.BangDiemHocKyDTO;
import com.nttt.dto.ChuongTrinhDaoTaoDTO;
import com.nttt.dto.MonHocDTO;
import com.nttt.dto.QuyHocBongNganhDTO;

import java.util.List;

public interface CurriculumService {
    List<MonHocDTO> getAllMonHoc();
    List<ChuongTrinhDaoTaoDTO> getCurriculumByNganh(String maNganh);
    BangDiemHocKyDTO getStudentGradesBySemester(String mssv, String maHocKy);
    List<BangDiemHocKyDTO> getAllStudentGrades(String mssv);
    QuyHocBongNganhDTO calculateMajorBudget(String maNganh, String maHocKy);
    List<QuyHocBongNganhDTO> calculateAllMajorBudgets(String maHocKy);
}
