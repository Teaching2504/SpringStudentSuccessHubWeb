package com.nttt.services;

import com.nttt.dto.*;

import java.util.List;

public interface DotXetHocBongService {
    List<DotXetHocBongDTO> getAllDotXet();
    DotXetHocBongDTO getDotXetById(String maDot);
    DotXetHocBongDTO createDotXet(DotXetHocBongDTO dto);
    DotXetHocBongDTO updateDotXet(String maDot, DotXetHocBongDTO dto);
    void deleteDotXet(String maDot);

    // Rule Configuration & Versioning
    QuyTacHocBongDTO saveQuyTac(QuyTacHocBongDTO dto);
    List<QuyTacHocBongDTO> getQuyTacHistory(String maDot);
    QuyTacHocBongDTO getLatestQuyTac(String maDot);

    // Faculty Sub-Campaign
    List<DotXetHbKhoaDTO> getDotKhoaByMaDot(String maDot);
    List<DotXetHbKhoaDTO> getDotKhoaByMaKhoa(String maKhoa);
    DotXetHbKhoaDTO getDotKhoaById(String maDotXetHbKhoa);
    DotXetHbKhoaDTO updateChiTieuKhoa(String maDotXetHbKhoa, Integer chiTieu, java.math.BigDecimal nganSach);

    // Workflow actions
    List<HoSoHocBongDTO> runAutoRanking(String maDotXetHbKhoa);
    DotXetHbKhoaDTO publishDuKien(String maDotXetHbKhoa);
    DotXetHbKhoaDTO chotDanhSachKhoa(String maDotXetHbKhoa);
    DotXetHbKhoaDTO pheDuyetDanhSachKhoa(String maDotXetHbKhoa, boolean approve, String lyDoTraVe);
    DotXetHocBongDTO publishChinhThucToanTruong(String maDot);

    // 8% Budget Breakdown & Auto Distribution
    List<QuyHocBongNganhDTO> getBudgetBreakdown(String maDot);
    List<DotXetHbKhoaDTO> autoSyncFacultyBudgets(String maDot);

    // Get list of dossiers
    List<HoSoHocBongDTO> getHoSoByDotKhoa(String maDotXetHbKhoa);
    List<HoSoHocBongDTO> getHoSoByMssv(String mssv);
}
