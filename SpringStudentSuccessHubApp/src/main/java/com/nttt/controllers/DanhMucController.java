package com.nttt.controllers;

import com.nttt.dto.*;
import com.nttt.pojo.HocKy;
import com.nttt.pojo.Khoa;
import com.nttt.pojo.LopSinhHoat;
import com.nttt.pojo.Nganh;
import com.nttt.services.CurriculumService;
import com.nttt.services.DanhMucService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/common/danh-muc")
public class DanhMucController {

    private final DanhMucService danhMucService;
    private final CurriculumService curriculumService;

    public DanhMucController(DanhMucService danhMucService, CurriculumService curriculumService) {
        this.danhMucService = danhMucService;
        this.curriculumService = curriculumService;
    }

    // Khoa
    @GetMapping("/khoa")
    public ResponseEntity<ApiResponse<List<Khoa>>> getAllKhoa() {
        return ResponseEntity.ok(ApiResponse.ok(danhMucService.getAllKhoa()));
    }

    @PostMapping("/khoa")
    public ResponseEntity<ApiResponse<Khoa>> createKhoa(@RequestBody Khoa khoa) {
        try {
            return ResponseEntity.ok(ApiResponse.ok("Thêm khoa thành công", danhMucService.createKhoa(khoa)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/khoa/{maKhoa}")
    public ResponseEntity<ApiResponse<Khoa>> updateKhoa(@PathVariable String maKhoa, @RequestBody Khoa khoa) {
        try {
            return ResponseEntity.ok(ApiResponse.ok("Cập nhật khoa thành công", danhMucService.updateKhoa(maKhoa, khoa)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/khoa/{maKhoa}")
    public ResponseEntity<ApiResponse<String>> deleteKhoa(@PathVariable String maKhoa) {
        try {
            danhMucService.deleteKhoa(maKhoa);
            return ResponseEntity.ok(ApiResponse.ok("Xóa khoa thành công", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // Nganh
    @GetMapping("/nganh")
    public ResponseEntity<ApiResponse<List<Nganh>>> getAllNganh(@RequestParam(required = false) String maKhoa) {
        if (maKhoa != null && !maKhoa.isBlank()) {
            return ResponseEntity.ok(ApiResponse.ok(danhMucService.getNganhByKhoa(maKhoa)));
        }
        return ResponseEntity.ok(ApiResponse.ok(danhMucService.getAllNganh()));
    }

    @PostMapping("/nganh")
    public ResponseEntity<ApiResponse<Nganh>> createNganh(@RequestParam String maKhoa, @RequestBody Nganh nganh) {
        try {
            return ResponseEntity.ok(ApiResponse.ok("Thêm ngành thành công", danhMucService.createNganh(maKhoa, nganh)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/nganh/{maNganh}")
    public ResponseEntity<ApiResponse<Nganh>> updateNganh(@PathVariable String maNganh, @RequestBody Nganh nganh) {
        try {
            return ResponseEntity.ok(ApiResponse.ok("Cập nhật ngành thành công", danhMucService.updateNganh(maNganh, nganh)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/nganh/{maNganh}")
    public ResponseEntity<ApiResponse<String>> deleteNganh(@PathVariable String maNganh) {
        try {
            danhMucService.deleteNganh(maNganh);
            return ResponseEntity.ok(ApiResponse.ok("Xóa ngành thành công", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // Lop
    @GetMapping("/lop")
    public ResponseEntity<ApiResponse<List<LopSinhHoat>>> getAllLop(@RequestParam(required = false) String maKhoa) {
        if (maKhoa != null && !maKhoa.isBlank()) {
            return ResponseEntity.ok(ApiResponse.ok(danhMucService.getLopByKhoa(maKhoa)));
        }
        return ResponseEntity.ok(ApiResponse.ok(danhMucService.getAllLop()));
    }

    @PostMapping("/lop")
    public ResponseEntity<ApiResponse<LopSinhHoat>> createLop(
            @RequestParam String maKhoa,
            @RequestParam String maNganh,
            @RequestBody LopSinhHoat lop
    ) {
        try {
            return ResponseEntity.ok(ApiResponse.ok("Thêm lớp thành công", danhMucService.createLop(maKhoa, maNganh, lop)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/lop/{maLop}")
    public ResponseEntity<ApiResponse<LopSinhHoat>> updateLop(@PathVariable String maLop, @RequestBody LopSinhHoat lop) {
        try {
            return ResponseEntity.ok(ApiResponse.ok("Cập nhật lớp thành công", danhMucService.updateLop(maLop, lop)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/lop/{maLop}")
    public ResponseEntity<ApiResponse<String>> deleteLop(@PathVariable String maLop) {
        try {
            danhMucService.deleteLop(maLop);
            return ResponseEntity.ok(ApiResponse.ok("Xóa lớp thành công", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // HocKy
    @GetMapping("/hoc-ky")
    public ResponseEntity<ApiResponse<List<HocKy>>> getAllHocKy() {
        return ResponseEntity.ok(ApiResponse.ok(danhMucService.getAllHocKy()));
    }

    @PostMapping("/hoc-ky")
    public ResponseEntity<ApiResponse<HocKy>> createHocKy(@RequestBody HocKy hocKy) {
        try {
            return ResponseEntity.ok(ApiResponse.ok("Thêm học kỳ thành công", danhMucService.createHocKy(hocKy)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/hoc-ky/{maHocKy}")
    public ResponseEntity<ApiResponse<HocKy>> updateHocKy(@PathVariable String maHocKy, @RequestBody HocKy hocKy) {
        try {
            return ResponseEntity.ok(ApiResponse.ok("Cập nhật học kỳ thành công", danhMucService.updateHocKy(maHocKy, hocKy)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/hoc-ky/{maHocKy}")
    public ResponseEntity<ApiResponse<String>> deleteHocKy(@PathVariable String maHocKy) {
        try {
            danhMucService.deleteHocKy(maHocKy);
            return ResponseEntity.ok(ApiResponse.ok("Xóa học kỳ thành công", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // Môn học & Chương trình đào tạo & Bảng điểm
    @GetMapping("/mon-hoc")
    public ResponseEntity<ApiResponse<List<MonHocDTO>>> getAllMonHoc() {
        return ResponseEntity.ok(ApiResponse.ok(curriculumService.getAllMonHoc()));
    }

    @GetMapping("/curriculum/{maNganh}")
    public ResponseEntity<ApiResponse<List<ChuongTrinhDaoTaoDTO>>> getCurriculumByNganh(@PathVariable String maNganh) {
        return ResponseEntity.ok(ApiResponse.ok(curriculumService.getCurriculumByNganh(maNganh)));
    }

    @GetMapping("/grades/{mssv}")
    public ResponseEntity<ApiResponse<BangDiemHocKyDTO>> getStudentGrades(
            @PathVariable String mssv,
            @RequestParam(required = false, defaultValue = "HK1_2025_2026") String maHocKy
    ) {
        return ResponseEntity.ok(ApiResponse.ok(curriculumService.getStudentGradesBySemester(mssv, maHocKy)));
    }

    @GetMapping("/major-budgets")
    public ResponseEntity<ApiResponse<List<QuyHocBongNganhDTO>>> getMajorBudgets(
            @RequestParam(required = false, defaultValue = "HK1_2025_2026") String maHocKy
    ) {
        return ResponseEntity.ok(ApiResponse.ok(curriculumService.calculateAllMajorBudgets(maHocKy)));
    }
}
