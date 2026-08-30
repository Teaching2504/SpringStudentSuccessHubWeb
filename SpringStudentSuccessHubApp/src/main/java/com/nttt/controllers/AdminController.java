package com.nttt.controllers;

import com.nttt.dto.ApiResponse;
import com.nttt.dto.DashboardStatsDTO;
import com.nttt.dto.NguoiDungDTO;
import com.nttt.dto.SinhVienDTO;
import com.nttt.services.ExcelService;
import com.nttt.services.NguoiDungService;
import com.nttt.services.SinhVienService;
import com.nttt.services.ThongKeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final NguoiDungService nguoiDungService;
    private final SinhVienService sinhVienService;
    private final ExcelService excelService;
    private final ThongKeService thongKeService;

    public AdminController(NguoiDungService nguoiDungService, SinhVienService sinhVienService, ExcelService excelService, ThongKeService thongKeService) {
        this.nguoiDungService = nguoiDungService;
        this.sinhVienService = sinhVienService;
        this.excelService = excelService;
        this.thongKeService = thongKeService;
    }

    // --- User Management (UC02) ---
    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<NguoiDungDTO>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.ok(nguoiDungService.getAllUsers()));
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<ApiResponse<NguoiDungDTO>> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(nguoiDungService.getUserById(id)));
    }

    @PostMapping("/users")
    public ResponseEntity<ApiResponse<NguoiDungDTO>> createUser(@RequestBody NguoiDungDTO dto) {
        try {
            return ResponseEntity.ok(ApiResponse.ok("Tạo tài khoản thành công", nguoiDungService.createUser(dto)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<ApiResponse<NguoiDungDTO>> updateUser(@PathVariable Long id, @RequestBody NguoiDungDTO dto) {
        try {
            return ResponseEntity.ok(ApiResponse.ok("Cập nhật tài khoản thành công", nguoiDungService.updateUser(id, dto)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<ApiResponse<String>> deleteUser(@PathVariable Long id) {
        try {
            nguoiDungService.deleteUser(id);
            return ResponseEntity.ok(ApiResponse.ok("Xóa tài khoản thành công", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PatchMapping("/users/{id}/toggle-status")
    public ResponseEntity<ApiResponse<String>> toggleUserStatus(@PathVariable Long id) {
        try {
            nguoiDungService.toggleUserStatus(id);
            return ResponseEntity.ok(ApiResponse.ok("Thay đổi trạng thái tài khoản thành công", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PostMapping("/users/{id}/reset-password")
    public ResponseEntity<ApiResponse<String>> resetPassword(@PathVariable Long id, @RequestBody(required = false) Map<String, String> body) {
        try {
            String newPassword = body != null ? body.get("matKhau") : "123456";
            nguoiDungService.resetPassword(id, newPassword);
            return ResponseEntity.ok(ApiResponse.ok("Đặt lại mật khẩu tài khoản thành công", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // --- Student Management (UC04) ---
    @GetMapping("/students")
    public ResponseEntity<ApiResponse<List<SinhVienDTO>>> filterStudents(
            @RequestParam(required = false) String maKhoa,
            @RequestParam(required = false) String maNganh,
            @RequestParam(required = false) String maLop,
            @RequestParam(required = false) String khoaHoc,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String maHocKy
    ) {
        return ResponseEntity.ok(ApiResponse.ok(sinhVienService.filterStudents(maKhoa, maNganh, maLop, khoaHoc, search, maHocKy)));
    }

    @PostMapping("/students")
    public ResponseEntity<ApiResponse<SinhVienDTO>> createStudent(@RequestBody SinhVienDTO dto) {
        try {
            return ResponseEntity.ok(ApiResponse.ok("Thêm sinh viên thành công", sinhVienService.createStudent(dto)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @PutMapping("/students/{mssv}")
    public ResponseEntity<ApiResponse<SinhVienDTO>> updateStudent(@PathVariable String mssv, @RequestBody SinhVienDTO dto) {
        try {
            return ResponseEntity.ok(ApiResponse.ok("Cập nhật thông tin sinh viên thành công", sinhVienService.updateStudent(mssv, dto)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    @DeleteMapping("/students/{mssv}")
    public ResponseEntity<ApiResponse<String>> deleteStudent(@PathVariable String mssv) {
        try {
            sinhVienService.deleteStudent(mssv);
            return ResponseEntity.ok(ApiResponse.ok("Xóa sinh viên thành công", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // --- Excel Import (UC04) ---
    @PostMapping("/students/import-excel")
    public ResponseEntity<ApiResponse<Map<String, Object>>> importStudents(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "maHocKy", required = false) String maHocKy
    ) {
        try {
            Map<String, Object> res = excelService.importStudentsFromExcel(file, maHocKy);
            return ResponseEntity.ok(ApiResponse.ok("Đồng bộ dữ liệu Excel thành công", res));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // --- Stats ---
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<DashboardStatsDTO>> getStats() {
        return ResponseEntity.ok(ApiResponse.ok(thongKeService.getGlobalDashboardStats()));
    }
}
