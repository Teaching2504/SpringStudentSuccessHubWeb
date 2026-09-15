package com.nttt.controllers;

import com.nttt.dto.*;
import com.nttt.services.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/khoa")
public class CanBoKhoaController {

    private final SinhVienService sinhVienService;
    private final DotXetHocBongService dotXetHocBongService;
    private final MinhChungRenLuyenService minhChungRenLuyenService;
    private final KienNghiService kienNghiService;
    private final ThongKeService thongKeService;

    public CanBoKhoaController(SinhVienService sinhVienService, DotXetHocBongService dotXetHocBongService, MinhChungRenLuyenService minhChungRenLuyenService, KienNghiService kienNghiService, ThongKeService thongKeService) {
        this.sinhVienService = sinhVienService;
        this.dotXetHocBongService = dotXetHocBongService;
        this.minhChungRenLuyenService = minhChungRenLuyenService;
        this.kienNghiService = kienNghiService;
        this.thongKeService = thongKeService;
    }

    @GetMapping("/students")
    public ResponseEntity<ApiResponse<List<SinhVienDTO>>> getFacultyStudents(
            @RequestParam String maKhoa,
            @RequestParam(required = false) String maNganh,
            @RequestParam(required = false) String maLop,
            @RequestParam(required = false) String khoaHoc,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String maHocKy
    ) {
        return ResponseEntity.ok(ApiResponse.ok(sinhVienService.filterStudents(maKhoa, maNganh, maLop, khoaHoc, search, maHocKy)));
    }

    @GetMapping("/minh-chung")
    public ResponseEntity<ApiResponse<List<MinhChungRenLuyenDTO>>> getMinhChung(
            @RequestParam String maKhoa,
            @RequestParam(required = false) String trangThai
    ) {
        return ResponseEntity.ok(ApiResponse.ok(minhChungRenLuyenService.getByKhoa(maKhoa, trangThai)));
    }

    @PostMapping("/minh-chung/{id}/review")
    public ResponseEntity<ApiResponse<MinhChungRenLuyenDTO>> reviewMinhChung(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, Object> payload
    ) {
        boolean approve = Boolean.parseBoolean(String.valueOf(payload.get("approve")));
        String lyDo = (String) payload.get("lyDo");
        try {
            MinhChungRenLuyenDTO result = minhChungRenLuyenService.reviewMinhChung(id, userDetails.getUsername(), approve, lyDo);
            return ResponseEntity.ok(ApiResponse.ok("Xử lý minh chứng rèn luyện thành công", result));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/campaigns")
    public ResponseEntity<ApiResponse<List<DotXetHbKhoaDTO>>> getFacultyCampaigns(@RequestParam String maKhoa) {
        return ResponseEntity.ok(ApiResponse.ok(dotXetHocBongService.getDotKhoaByMaKhoa(maKhoa)));
    }

    @GetMapping("/campaigns/{id}")
    public ResponseEntity<ApiResponse<DotXetHbKhoaDTO>> getFacultyCampaignDetail(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(dotXetHocBongService.getDotKhoaById(id)));
    }

    @GetMapping("/campaigns/{id}/dossiers")
    public ResponseEntity<ApiResponse<List<HoSoHocBongDTO>>> getDossiers(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(dotXetHocBongService.getHoSoByDotKhoa(id)));
    }

    @GetMapping("/scholarships")
    public ResponseEntity<ApiResponse<List<HoSoHocBongDTO>>> getFacultyScholarshipAwards(
            @RequestParam String maKhoa,
            @RequestParam(required = false) String maDot,
            @RequestParam(required = false) String loaiHocBong,
            @RequestParam(required = false) String trangThai,
            @RequestParam(required = false) String search
    ) {
        return ResponseEntity.ok(ApiResponse.ok(
                dotXetHocBongService.getHoSoByKhoaAndFilters(maKhoa, maDot, loaiHocBong, trangThai, search)
        ));
    }

    @PostMapping("/campaigns/{id}/run-ranking")
    public ResponseEntity<ApiResponse<List<HoSoHocBongDTO>>> runAutoRanking(@PathVariable String id) {
        try {
            List<HoSoHocBongDTO> result = dotXetHocBongService.runAutoRanking(id);
            return ResponseEntity.ok(ApiResponse.ok("Kích hoạt Dynamic Rule Engine và xét duyệt tự động thành công", result));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/campaigns/{id}/publish-du-kien")
    public ResponseEntity<ApiResponse<DotXetHbKhoaDTO>> publishDuKien(@PathVariable String id) {
        try {
            return ResponseEntity.ok(ApiResponse.ok("Đã công bố danh sách học bổng dự kiến cho sinh viên", dotXetHocBongService.publishDuKien(id)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/campaigns/{id}/chot-danh-sach")
    public ResponseEntity<ApiResponse<DotXetHbKhoaDTO>> chotDanhSachKhoa(@PathVariable String id) {
        try {
            return ResponseEntity.ok(ApiResponse.ok("Đã chốt danh sách khoa và gửi lên Cấp trường thành công", dotXetHocBongService.chotDanhSachKhoa(id)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/kien-nghi")
    public ResponseEntity<ApiResponse<List<KienNghiDTO>>> getFacultyAppeals(
            @RequestParam String maKhoa,
            @RequestParam(required = false) String trangThai
    ) {
        return ResponseEntity.ok(ApiResponse.ok(kienNghiService.getByKhoa(maKhoa, trangThai)));
    }

    @PostMapping("/kien-nghi/{id}/resolve")
    public ResponseEntity<ApiResponse<KienNghiDTO>> resolveAppeal(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, Object> payload
    ) {
        boolean accept = Boolean.parseBoolean(String.valueOf(payload.get("accept")));
        String phanHoi = (String) payload.get("phanHoi");
        java.math.BigDecimal diemRenLuyenMoi = null;
        if (payload.get("diemRenLuyenMoi") != null && !payload.get("diemRenLuyenMoi").toString().isBlank()) {
            diemRenLuyenMoi = new java.math.BigDecimal(payload.get("diemRenLuyenMoi").toString());
        }
        try {
            KienNghiDTO result = kienNghiService.resolveKienNghi(id, userDetails.getUsername(), accept, phanHoi, diemRenLuyenMoi);
            return ResponseEntity.ok(ApiResponse.ok("Xử lý kiến nghị thành công", result));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<DashboardStatsDTO>> getFacultyStats(@RequestParam String maKhoa) {
        return ResponseEntity.ok(ApiResponse.ok(thongKeService.getFacultyDashboardStats(maKhoa)));
    }
}
