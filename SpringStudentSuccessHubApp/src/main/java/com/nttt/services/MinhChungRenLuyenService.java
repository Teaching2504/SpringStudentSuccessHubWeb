package com.nttt.services;

import com.nttt.dto.MinhChungRenLuyenDTO;

import java.util.List;

public interface MinhChungRenLuyenService {
    MinhChungRenLuyenDTO submitMinhChung(MinhChungRenLuyenDTO dto);
    List<MinhChungRenLuyenDTO> getBySinhVien(String mssv);
    List<MinhChungRenLuyenDTO> getByKhoa(String maKhoa, String trangThai);
    List<MinhChungRenLuyenDTO> getAll(String trangThai);
    MinhChungRenLuyenDTO reviewMinhChung(String maMinhChung, String usernameNhanVien, boolean approve, String lyDo);
    void deleteMinhChung(String maMinhChung);
}
