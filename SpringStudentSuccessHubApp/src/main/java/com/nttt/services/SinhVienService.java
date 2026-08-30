package com.nttt.services;

import com.nttt.dto.SinhVienDTO;
import com.nttt.pojo.KetQuaHocTap;
import com.nttt.pojo.KetQuaRenLuyen;

import java.util.List;

public interface SinhVienService {
    List<SinhVienDTO> filterStudents(String maKhoa, String maNganh, String maLop, String khoaHoc, String search, String maHocKy);
    SinhVienDTO getStudentByMssv(String mssv, String maHocKy);
    SinhVienDTO getStudentByUsername(String username, String maHocKy);
    SinhVienDTO createStudent(SinhVienDTO dto);
    SinhVienDTO updateStudent(String mssv, SinhVienDTO dto);
    void deleteStudent(String mssv);

    List<KetQuaHocTap> getAcademicHistory(String mssv);
    List<KetQuaRenLuyen> getTrainingHistory(String mssv);
    void saveAcademicResult(KetQuaHocTap kq);
    void saveTrainingResult(KetQuaRenLuyen kq);
}
