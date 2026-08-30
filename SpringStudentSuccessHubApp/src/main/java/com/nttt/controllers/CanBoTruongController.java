package com.nttt.controllers;

import com.nttt.dto.*;
import com.nttt.services.DotXetHocBongService;
import com.nttt.services.ExcelService;
import com.nttt.services.ThongKeService;
import jakarta.validation.Valid;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/truong")
public class CanBoTruongController {

    private final DotXetHocBongService dotXetHocBongService;
    private final ExcelService excelService;
    private final ThongKeService thongKeService;

    public CanBoTruongController(DotXetHocBongService dotXetHocBongService, ExcelService excelService, ThongKeService thongKeService) {
        this.dotXetHocBongService = dotXetHocBongService;
        this.excelService = excelService;
        this.thongKeService = thongKeService;
    }

    // --- Campaign Management (UC05) ---
    @GetMapping("/campaigns")
    public ResponseEntity<ApiResponse<List<DotXetHocBongDTO>>> getAllCampaigns() {
        return ResponseEntity.ok(ApiResponse.ok(dotXetHocBongService.getAllDotXet()));
    }

    @GetMapping("/campaigns/{id}")
    public ResponseEntity<ApiResponse<DotXetHocBongDTO>> getCampaignById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(dotXetHocBongService.getDotXetById(id)));
    }

    @PostMapping("/campaigns")
    public ResponseEntity<ApiResponse<DotXetHocBongDTO>> createCampaign(@Valid @RequestBody DotXetHocBongDTO dto) {
        try {
            return ResponseEntity.ok(ApiResponse.ok("Tạo đợt xét học bổng thành công", dotXetHocBongService.createDotXet(dto)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/campaigns/{id}")
    public ResponseEntity<ApiResponse<DotXetHocBongDTO>> updateCampaign(@PathVariable String id, @RequestBody DotXetHocBongDTO dto) {
        try {
            return ResponseEntity.ok(ApiResponse.ok("Cập nhật đợt xét thành công", dotXetHocBongService.updateDotXet(id, dto)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/campaigns/{id}")
    public ResponseEntity<ApiResponse<String>> deleteCampaign(@PathVariable String id) {
        try {
            dotXetHocBongService.deleteDotXet(id);
            return ResponseEntity.ok(ApiResponse.ok("Xóa đợt xét thành công", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // --- Dynamic Rule Engine Configuration & Versioning (UC06) ---
    @GetMapping("/campaigns/{id}/rules")
    public ResponseEntity<ApiResponse<List<QuyTacHocBongDTO>>> getRuleHistory(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(dotXetHocBongService.getQuyTacHistory(id)));
    }

    @GetMapping("/campaigns/{id}/rules/latest")
    public ResponseEntity<ApiResponse<QuyTacHocBongDTO>> getLatestRule(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(dotXetHocBongService.getLatestQuyTac(id)));
    }

    @PostMapping("/campaigns/{id}/rules")
    public ResponseEntity<ApiResponse<QuyTacHocBongDTO>> saveRule(@PathVariable String id, @RequestBody QuyTacHocBongDTO dto) {
        dto.setMaDot(id);
        try {
            return ResponseEntity.ok(ApiResponse.ok("Lưu quy tắc xét học bổng thành công", dotXetHocBongService.saveQuyTac(dto)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // --- Faculty Sub-Campaigns & Quota Distribution ---
    @GetMapping("/campaigns/{id}/faculties")
    public ResponseEntity<ApiResponse<List<DotXetHbKhoaDTO>>> getFacultyCampaigns(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(dotXetHocBongService.getDotKhoaByMaDot(id)));
    }

    @GetMapping("/campaigns/{id}/budget-breakdown")
    public ResponseEntity<ApiResponse<List<QuyHocBongNganhDTO>>> getBudgetBreakdown(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.ok(dotXetHocBongService.getBudgetBreakdown(id)));
    }

    @PostMapping("/campaigns/{id}/auto-sync-8percent-budget")
    public ResponseEntity<ApiResponse<List<DotXetHbKhoaDTO>>> autoSync8PercentBudget(@PathVariable String id) {
        try {
            return ResponseEntity.ok(ApiResponse.ok("Tự động tính toán & phân bổ ngân sách 8% học phí cho các khoa thành công", dotXetHocBongService.autoSyncFacultyBudgets(id)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/campaigns/faculty-campaigns/{dkId}/quota")
    public ResponseEntity<ApiResponse<DotXetHbKhoaDTO>> updateQuota(
            @PathVariable String dkId,
            @RequestBody Map<String, Object> payload
    ) {
        Integer chiTieu = payload.get("chiTieu") != null ? Integer.parseInt(payload.get("chiTieu").toString()) : null;
        BigDecimal nganSach = payload.get("nganSach") != null ? new BigDecimal(payload.get("nganSach").toString()) : null;
        try {
            return ResponseEntity.ok(ApiResponse.ok("Cập nhật chỉ tiêu thành công", dotXetHocBongService.updateChiTieuKhoa(dkId, chiTieu, nganSach)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // --- Review & Approve Faculty List (UC10) ---
    @PostMapping("/campaigns/faculty-campaigns/{dkId}/review")
    public ResponseEntity<ApiResponse<DotXetHbKhoaDTO>> reviewFacultyList(
            @PathVariable String dkId,
            @RequestBody Map<String, Object> payload
    ) {
        boolean approve = Boolean.parseBoolean(String.valueOf(payload.get("approve")));
        String lyDo = (String) payload.get("lyDo");
        try {
            DotXetHbKhoaDTO res = dotXetHocBongService.pheDuyetDanhSachKhoa(dkId, approve, lyDo);
            String msg = approve ? "Phê duyệt danh sách học bổng của khoa thành công" : "Đã trả về danh sách kèm yêu cầu điều chỉnh";
            return ResponseEntity.ok(ApiResponse.ok(msg, res));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // --- Official Publication (UC10) ---
    @PostMapping("/campaigns/{id}/publish-official")
    public ResponseEntity<ApiResponse<DotXetHocBongDTO>> publishOfficial(@PathVariable String id) {
        try {
            return ResponseEntity.ok(ApiResponse.ok("Công bố kết quả học bổng chính thức toàn trường thành công", dotXetHocBongService.publishChinhThucToanTruong(id)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // --- Export Excel Report ---
    @GetMapping("/campaigns/faculty-campaigns/{dkId}/export-excel")
    public ResponseEntity<InputStreamResource> exportFacultyExcel(@PathVariable String dkId) {
        List<HoSoHocBongDTO> dossiers = dotXetHocBongService.getHoSoByDotKhoa(dkId);
        DotXetHbKhoaDTO dk = dotXetHocBongService.getDotKhoaById(dkId);

        String title = "DANH SÁCH HỌC BỔNG - " + dk.getTenKhoa().toUpperCase() + " - " + dk.getTenDot().toUpperCase();
        ByteArrayInputStream in = excelService.exportScholarshipAwardList(dossiers, title);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=HocBong_" + dkId + ".xlsx");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(new InputStreamResource(in));
    }

    // --- Stats ---
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<DashboardStatsDTO>> getStats() {
        return ResponseEntity.ok(ApiResponse.ok(thongKeService.getGlobalDashboardStats()));
    }
}
