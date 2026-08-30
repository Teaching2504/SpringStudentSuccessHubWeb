package com.nttt.controllers;

import com.nttt.dto.*;
import com.nttt.pojo.KetQuaHocTap;
import com.nttt.pojo.KetQuaRenLuyen;
import com.nttt.services.*;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/sinhvien")
public class SinhVienController {

    private final SinhVienService sinhVienService;
    private final DotXetHocBongService dotXetHocBongService;
    private final MinhChungRenLuyenService minhChungRenLuyenService;
    private final KienNghiService kienNghiService;
    private final CurriculumService curriculumService;

    public SinhVienController(
            SinhVienService sinhVienService,
            DotXetHocBongService dotXetHocBongService,
            MinhChungRenLuyenService minhChungRenLuyenService,
            KienNghiService kienNghiService,
            CurriculumService curriculumService
    ) {
        this.sinhVienService = sinhVienService;
        this.dotXetHocBongService = dotXetHocBongService;
        this.minhChungRenLuyenService = minhChungRenLuyenService;
        this.kienNghiService = kienNghiService;
        this.curriculumService = curriculumService;
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<SinhVienDTO>> getProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) String maHocKy
    ) {
        SinhVienDTO dto = sinhVienService.getStudentByUsername(userDetails.getUsername(), maHocKy);
        return ResponseEntity.ok(ApiResponse.ok(dto));
    }

    @GetMapping("/curriculum")
    public ResponseEntity<ApiResponse<List<ChuongTrinhDaoTaoDTO>>> getCurriculum(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) String maNganh
    ) {
        if (maNganh != null && !maNganh.trim().isEmpty()) {
            return ResponseEntity.ok(ApiResponse.ok(curriculumService.getCurriculumByNganh(maNganh)));
        }
        SinhVienDTO sv = sinhVienService.getStudentByUsername(userDetails.getUsername(), null);
        String targetNganh = (sv != null && sv.getMaNganh() != null) ? sv.getMaNganh() : "CS";
        return ResponseEntity.ok(ApiResponse.ok(curriculumService.getCurriculumByNganh(targetNganh)));
    }

    @GetMapping("/grades")
    public ResponseEntity<ApiResponse<BangDiemHocKyDTO>> getGrades(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false, defaultValue = "HK1_2025_2026") String maHocKy
    ) {
        SinhVienDTO sv = sinhVienService.getStudentByUsername(userDetails.getUsername(), null);
        if (sv == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không tìm thấy thông tin sinh viên"));
        }
        BangDiemHocKyDTO bangDiem = curriculumService.getStudentGradesBySemester(sv.getMssv(), maHocKy);
        return ResponseEntity.ok(ApiResponse.ok(bangDiem));
    }

    @GetMapping("/all-grades")
    public ResponseEntity<ApiResponse<List<BangDiemHocKyDTO>>> getAllGrades(@AuthenticationPrincipal UserDetails userDetails) {
        SinhVienDTO sv = sinhVienService.getStudentByUsername(userDetails.getUsername(), null);
        if (sv == null) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Không tìm thấy thông tin sinh viên"));
        }
        return ResponseEntity.ok(ApiResponse.ok(curriculumService.getAllStudentGrades(sv.getMssv())));
    }

    @GetMapping("/academic-history")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getAcademicHistory(@AuthenticationPrincipal UserDetails userDetails) {
        SinhVienDTO sv = sinhVienService.getStudentByUsername(userDetails.getUsername(), null);
        List<KetQuaHocTap> gpaList = sinhVienService.getAcademicHistory(sv.getMssv());
        List<KetQuaRenLuyen> drlList = sinhVienService.getTrainingHistory(sv.getMssv());

        Map<String, Object> data = new HashMap<>();
        data.put("sinhVien", sv);
        data.put("ketQuaHocTap", gpaList);
        data.put("ketQuaRenLuyen", drlList);
        try {
            data.put("bangDiemChiTiet", curriculumService.getAllStudentGrades(sv.getMssv()));
        } catch (Exception ignored) {}

        return ResponseEntity.ok(ApiResponse.ok(data));
    }

    @GetMapping("/scholarship-campaigns")
    public ResponseEntity<ApiResponse<List<DotXetHocBongDTO>>> getScholarshipCampaigns() {
        return ResponseEntity.ok(ApiResponse.ok(dotXetHocBongService.getAllDotXet()));
    }

    @GetMapping("/my-scholarship-results")
    public ResponseEntity<ApiResponse<List<HoSoHocBongDTO>>> getMyScholarships(@AuthenticationPrincipal UserDetails userDetails) {
        SinhVienDTO sv = sinhVienService.getStudentByUsername(userDetails.getUsername(), null);
        return ResponseEntity.ok(ApiResponse.ok(dotXetHocBongService.getHoSoByMssv(sv.getMssv())));
    }

    // Minh chứng rèn luyện (UC11)
    @GetMapping("/minh-chung")
    public ResponseEntity<ApiResponse<List<MinhChungRenLuyenDTO>>> getMyMinhChung(@AuthenticationPrincipal UserDetails userDetails) {
        SinhVienDTO sv = sinhVienService.getStudentByUsername(userDetails.getUsername(), null);
        return ResponseEntity.ok(ApiResponse.ok(minhChungRenLuyenService.getBySinhVien(sv.getMssv())));
    }

    @PostMapping("/minh-chung")
    public ResponseEntity<ApiResponse<MinhChungRenLuyenDTO>> submitMinhChung(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody MinhChungRenLuyenDTO dto
    ) {
        SinhVienDTO sv = sinhVienService.getStudentByUsername(userDetails.getUsername(), null);
        dto.setMssv(sv.getMssv());
        try {
            return ResponseEntity.ok(ApiResponse.ok("Nộp minh chứng rèn luyện thành công", minhChungRenLuyenService.submitMinhChung(dto)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // Kiến nghị / Khiếu nại (UC08)
    @GetMapping("/kien-nghi")
    public ResponseEntity<ApiResponse<List<KienNghiDTO>>> getMyKienNghi(@AuthenticationPrincipal UserDetails userDetails) {
        SinhVienDTO sv = sinhVienService.getStudentByUsername(userDetails.getUsername(), null);
        return ResponseEntity.ok(ApiResponse.ok(kienNghiService.getBySinhVien(sv.getMssv())));
    }

    @PostMapping("/kien-nghi")
    public ResponseEntity<ApiResponse<KienNghiDTO>> submitKienNghi(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody KienNghiDTO dto
    ) {
        SinhVienDTO sv = sinhVienService.getStudentByUsername(userDetails.getUsername(), null);
        dto.setMssv(sv.getMssv());
        try {
            return ResponseEntity.ok(ApiResponse.ok("Gửi kiến nghị thành công", kienNghiService.submitKienNghi(dto)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
