package com.nttt.services;

import com.nttt.dto.KienNghiDTO;

import java.util.List;

public interface KienNghiService {
    KienNghiDTO submitKienNghi(KienNghiDTO dto);
    List<KienNghiDTO> getByDotKhoa(String maDotXetHbKhoa);
    List<KienNghiDTO> getByKhoa(String maKhoa, String trangThai);
    List<KienNghiDTO> getBySinhVien(String mssv);
    KienNghiDTO resolveKienNghi(String maKienNghi, String usernameNhanVien, boolean accept, String phanHoi);
    void deleteKienNghi(String maKienNghi);
}
