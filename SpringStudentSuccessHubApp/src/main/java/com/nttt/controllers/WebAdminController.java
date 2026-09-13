package com.nttt.controllers;

import com.nttt.dto.SinhVienDTO;
import com.nttt.pojo.*;
import com.nttt.repositories.*;
import com.nttt.services.CurriculumService;
import com.nttt.services.DanhMucService;
import com.nttt.services.ExcelService;
import com.nttt.services.NguoiDungService;
import com.nttt.services.SinhVienService;
import jakarta.servlet.http.HttpSession;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.io.ByteArrayInputStream;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/web/admin")
public class WebAdminController {

    private final SinhVienService sinhVienService;
    private final DanhMucService danhMucService;
    private final ExcelService excelService;
    private final NguoiDungRepository nguoiDungRepository;
    private final NguoiDungService nguoiDungService;
    private final PasswordEncoder passwordEncoder;
    private final CurriculumService curriculumService;
    private final com.nttt.services.CloudinaryService cloudinaryService;

    public WebAdminController(SinhVienService sinhVienService,
                              DanhMucService danhMucService,
                              ExcelService excelService,
                              NguoiDungRepository nguoiDungRepository,
                              NguoiDungService nguoiDungService,
                              PasswordEncoder passwordEncoder,
                              CurriculumService curriculumService,
                              com.nttt.services.CloudinaryService cloudinaryService) {
        this.sinhVienService = sinhVienService;
        this.danhMucService = danhMucService;
        this.excelService = excelService;
        this.nguoiDungRepository = nguoiDungRepository;
        this.nguoiDungService = nguoiDungService;
        this.passwordEncoder = passwordEncoder;
        this.curriculumService = curriculumService;
        this.cloudinaryService = cloudinaryService;
    }

    private boolean checkAdmin(HttpSession session) {
        NguoiDung u = (NguoiDung) session.getAttribute("currentUser");
        if (u == null) return false;
        String v = u.getVaiTro();
        return "ROLE_ADMIN".equals(v) || "ADMIN".equals(v) || "ROLE_CAN_BO_TRUONG".equals(v) || "ROLE_CAN_BO_KHOA".equals(v);
    }

    @GetMapping("/dashboard")
    public String dashboard(HttpSession session, Model model) {
        if (!checkAdmin(session)) return "redirect:/web/login";

        model.addAttribute("totalStudents", sinhVienService.filterStudents(null, null, null, null, null, null).size());
        model.addAttribute("totalFaculties", danhMucService.getAllKhoa().size());
        model.addAttribute("totalMajors", danhMucService.getAllNganh().size());
        model.addAttribute("totalClasses", danhMucService.getAllLop().size());
        model.addAttribute("totalUsers", nguoiDungRepository.count());
        return "admin/dashboard";
    }

    @GetMapping("/students")
    public String students(@RequestParam(value = "maKhoa", required = false) String maKhoa,
                           @RequestParam(value = "maLop", required = false) String maLop,
                           @RequestParam(value = "maHocKy", required = false) String maHocKy,
                           @RequestParam(value = "search", required = false) String search,
                           HttpSession session, Model model) {
        if (!checkAdmin(session)) return "redirect:/web/login";

        String activeHk = (maHocKy != null && !maHocKy.isBlank()) ? maHocKy : "HK1_2025_2026";
        List<SinhVienDTO> list = sinhVienService.filterStudents(maKhoa, null, maLop, null, search, activeHk);

        model.addAttribute("students", list);
        model.addAttribute("khoas", danhMucService.getAllKhoa());
        model.addAttribute("lops", (maKhoa != null && !maKhoa.isBlank()) ? danhMucService.getLopByKhoa(maKhoa) : danhMucService.getAllLop());
        model.addAttribute("hocKys", danhMucService.getAllHocKy());
        model.addAttribute("selectedKhoa", maKhoa);
        model.addAttribute("selectedLop", maLop);
        model.addAttribute("selectedHk", activeHk);
        model.addAttribute("search", search);
        return "admin/students";
    }

    @PostMapping("/students/add")
    public String addStudent(@ModelAttribute SinhVienDTO dto, HttpSession session) {
        if (!checkAdmin(session)) return "redirect:/web/login";
        sinhVienService.createStudent(dto);
        return "redirect:/web/admin/students";
    }

    @GetMapping("/students/delete/{mssv}")
    public String deleteStudent(@PathVariable("mssv") String mssv, HttpSession session) {
        if (!checkAdmin(session)) return "redirect:/web/login";
        sinhVienService.deleteStudent(mssv);
        return "redirect:/web/admin/students";
    }

    @PostMapping("/students/import-excel")
    public String importExcel(@RequestParam("file") MultipartFile file,
                              @RequestParam(value = "maHocKy", defaultValue = "HK1_2025_2026") String maHocKy,
                              HttpSession session,
                              RedirectAttributes redirectAttributes) {
        if (!checkAdmin(session)) return "redirect:/web/login";
        try {
            Map<String, Object> res = excelService.importStudentsFromExcel(file, maHocKy);
            int imported = (int) res.getOrDefault("importedCount", 0);
            int updated = (int) res.getOrDefault("updatedCount", 0);
            redirectAttributes.addFlashAttribute("successMessage", "Đồng bộ Excel thành công! Đã thêm mới " + imported + " sinh viên, cập nhật điểm " + updated + " sinh viên.");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Lỗi nhập Excel: " + e.getMessage());
        }
        return "redirect:/web/admin/students";
    }

    @GetMapping("/students/template-excel")
    public ResponseEntity<InputStreamResource> downloadStudentTemplate(HttpSession session) {
        if (!checkAdmin(session)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        ByteArrayInputStream in = excelService.generateStudentTemplateExcel();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=Mau_Nhap_SinhVien_Diem.xlsx");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(new InputStreamResource(in));
    }

    @GetMapping("/categories")
    public String categories(@RequestParam(value = "tab", defaultValue = "khoa") String tab,
                             @RequestParam(value = "maNganh", defaultValue = "CS") String maNganh,
                             HttpSession session, Model model) {
        if (!checkAdmin(session)) return "redirect:/web/login";

        model.addAttribute("activeTab", tab);
        model.addAttribute("selectedNganh", maNganh);
        model.addAttribute("khoas", danhMucService.getAllKhoa());
        model.addAttribute("nganhs", danhMucService.getAllNganh());
        model.addAttribute("lops", danhMucService.getAllLop());
        model.addAttribute("hocKys", danhMucService.getAllHocKy());
        try {
            model.addAttribute("monHocs", curriculumService.getAllMonHoc());
            model.addAttribute("curriculums", curriculumService.getCurriculumByNganh(maNganh));
        } catch (Exception ignored) {}
        return "admin/categories";
    }

    @PostMapping("/categories/khoa/add")
    public String addKhoa(@ModelAttribute Khoa khoa, HttpSession session, RedirectAttributes redirectAttributes) {
        if (!checkAdmin(session)) return "redirect:/web/login";
        try {
            danhMucService.createKhoa(khoa);
            redirectAttributes.addFlashAttribute("successMessage", "Thêm Khoa thành công!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Lỗi thêm Khoa: " + e.getMessage());
        }
        return "redirect:/web/admin/categories?tab=khoa";
    }

    @PostMapping("/categories/khoa/edit")
    public String editKhoa(@ModelAttribute Khoa khoa, HttpSession session, RedirectAttributes redirectAttributes) {
        if (!checkAdmin(session)) return "redirect:/web/login";
        try {
            danhMucService.updateKhoa(khoa.getMaKhoa(), khoa);
            redirectAttributes.addFlashAttribute("successMessage", "Cập nhật Khoa thành công!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Lỗi cập nhật Khoa: " + e.getMessage());
        }
        return "redirect:/web/admin/categories?tab=khoa";
    }

    @GetMapping("/categories/khoa/delete/{maKhoa}")
    public String deleteKhoa(@PathVariable("maKhoa") String maKhoa, HttpSession session, RedirectAttributes redirectAttributes) {
        if (!checkAdmin(session)) return "redirect:/web/login";
        try {
            danhMucService.deleteKhoa(maKhoa);
            redirectAttributes.addFlashAttribute("successMessage", "Xóa Khoa thành công!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Lỗi xóa Khoa: " + e.getMessage());
        }
        return "redirect:/web/admin/categories?tab=khoa";
    }

    @PostMapping("/categories/nganh/add")
    public String addNganh(@RequestParam("maKhoa") String maKhoa, @ModelAttribute Nganh nganh, HttpSession session, RedirectAttributes redirectAttributes) {
        if (!checkAdmin(session)) return "redirect:/web/login";
        try {
            danhMucService.createNganh(maKhoa, nganh);
            redirectAttributes.addFlashAttribute("successMessage", "Thêm Ngành đào tạo thành công!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Lỗi thêm Ngành: " + e.getMessage());
        }
        return "redirect:/web/admin/categories?tab=nganh";
    }

    @PostMapping("/categories/nganh/edit")
    public String editNganh(@ModelAttribute Nganh nganh, HttpSession session, RedirectAttributes redirectAttributes) {
        if (!checkAdmin(session)) return "redirect:/web/login";
        try {
            danhMucService.updateNganh(nganh.getMaNganh(), nganh);
            redirectAttributes.addFlashAttribute("successMessage", "Cập nhật Ngành đào tạo thành công!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Lỗi cập nhật Ngành: " + e.getMessage());
        }
        return "redirect:/web/admin/categories?tab=nganh";
    }

    @GetMapping("/categories/nganh/delete/{maNganh}")
    public String deleteNganh(@PathVariable("maNganh") String maNganh, HttpSession session, RedirectAttributes redirectAttributes) {
        if (!checkAdmin(session)) return "redirect:/web/login";
        try {
            danhMucService.deleteNganh(maNganh);
            redirectAttributes.addFlashAttribute("successMessage", "Xóa Ngành thành công!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Lỗi xóa Ngành: " + e.getMessage());
        }
        return "redirect:/web/admin/categories?tab=nganh";
    }

    @PostMapping("/categories/lop/add")
    public String addLop(@RequestParam("maKhoa") String maKhoa,
                         @RequestParam("maNganh") String maNganh,
                         @ModelAttribute LopSinhHoat lop,
                         HttpSession session,
                         RedirectAttributes redirectAttributes) {
        if (!checkAdmin(session)) return "redirect:/web/login";
        try {
            danhMucService.createLop(maKhoa, maNganh, lop);
            redirectAttributes.addFlashAttribute("successMessage", "Thêm Lớp sinh hoạt thành công!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Lỗi thêm Lớp: " + e.getMessage());
        }
        return "redirect:/web/admin/categories?tab=lop";
    }

    @PostMapping("/categories/lop/edit")
    public String editLop(@ModelAttribute LopSinhHoat lop, HttpSession session, RedirectAttributes redirectAttributes) {
        if (!checkAdmin(session)) return "redirect:/web/login";
        try {
            danhMucService.updateLop(lop.getMaLop(), lop);
            redirectAttributes.addFlashAttribute("successMessage", "Cập nhật Lớp sinh hoạt thành công!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Lỗi cập nhật Lớp: " + e.getMessage());
        }
        return "redirect:/web/admin/categories?tab=lop";
    }

    @GetMapping("/categories/lop/delete/{maLop}")
    public String deleteLop(@PathVariable("maLop") String maLop, HttpSession session, RedirectAttributes redirectAttributes) {
        if (!checkAdmin(session)) return "redirect:/web/login";
        try {
            danhMucService.deleteLop(maLop);
            redirectAttributes.addFlashAttribute("successMessage", "Xóa Lớp thành công!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Lỗi xóa Lớp: " + e.getMessage());
        }
        return "redirect:/web/admin/categories?tab=lop";
    }

    @PostMapping("/categories/hoc-ky/add")
    public String addHocKy(@ModelAttribute HocKy hocKy, HttpSession session, RedirectAttributes redirectAttributes) {
        if (!checkAdmin(session)) return "redirect:/web/login";
        try {
            danhMucService.createHocKy(hocKy);
            redirectAttributes.addFlashAttribute("successMessage", "Thêm Học kỳ thành công!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Lỗi thêm Học kỳ: " + e.getMessage());
        }
        return "redirect:/web/admin/categories?tab=hoc-ky";
    }

    @PostMapping("/categories/hoc-ky/edit")
    public String editHocKy(@ModelAttribute HocKy hocKy, HttpSession session, RedirectAttributes redirectAttributes) {
        if (!checkAdmin(session)) return "redirect:/web/login";
        try {
            danhMucService.updateHocKy(hocKy.getMaHocKy(), hocKy);
            redirectAttributes.addFlashAttribute("successMessage", "Cập nhật Học kỳ thành công!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Lỗi cập nhật Học kỳ: " + e.getMessage());
        }
        return "redirect:/web/admin/categories?tab=hoc-ky";
    }

    @GetMapping("/categories/hoc-ky/delete/{maHocKy}")
    public String deleteHocKy(@PathVariable("maHocKy") String maHocKy, HttpSession session, RedirectAttributes redirectAttributes) {
        if (!checkAdmin(session)) return "redirect:/web/login";
        try {
            danhMucService.deleteHocKy(maHocKy);
            redirectAttributes.addFlashAttribute("successMessage", "Xóa Học kỳ thành công!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Lỗi xóa Học kỳ: " + e.getMessage());
        }
        return "redirect:/web/admin/categories?tab=hoc-ky";
    }

    @GetMapping("/users")
    public String users(HttpSession session, Model model) {
        if (!checkAdmin(session)) return "redirect:/web/login";
        model.addAttribute("users", nguoiDungService.getAllUsers());
        return "admin/users";
    }

    @PostMapping("/users/add")
    public String addUser(@RequestParam("tenDangNhap") String tenDangNhap,
                          @RequestParam(value = "matKhau", defaultValue = "123456") String matKhau,
                          @RequestParam("hoTen") String hoTen,
                          @RequestParam(value = "email", required = false) String email,
                          @RequestParam(value = "soDienThoai", required = false) String soDienThoai,
                          @RequestParam(value = "vaiTro", defaultValue = "ROLE_SINH_VIEN") String vaiTro,
                          @RequestParam(value = "avatarFile", required = false) MultipartFile avatarFile,
                          HttpSession session,
                          RedirectAttributes redirectAttributes) {
        if (!checkAdmin(session)) return "redirect:/web/login";
        try {
            String rawPwd = matKhau != null && !matKhau.isBlank() ? matKhau : "123456";
            String avatarUrl = null;
            if (avatarFile != null && !avatarFile.isEmpty()) {
                Map<String, Object> up = cloudinaryService.uploadFile(avatarFile, "avatars");
                avatarUrl = (String) up.get("secure_url");
            }
            NguoiDung user = NguoiDung.builder()
                    .tenDangNhap(tenDangNhap)
                    .matKhau(passwordEncoder.encode(rawPwd))
                    .matKhauHienThi(rawPwd)
                    .hoTen(hoTen)
                    .email(email)
                    .soDienThoai(soDienThoai)
                    .vaiTro(vaiTro)
                    .trangThai("HOAT_DONG")
                    .avatar(avatarUrl)
                    .build();
            nguoiDungRepository.save(user);
            redirectAttributes.addFlashAttribute("successMessage", "Tạo tài khoản \"" + tenDangNhap + "\" thành công!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Lỗi tạo tài khoản: " + e.getMessage());
        }
        return "redirect:/web/admin/users";
    }

    @PostMapping("/users/{id}/edit")
    public String editUser(@PathVariable("id") Long id,
                           @RequestParam("hoTen") String hoTen,
                           @RequestParam(value = "email", required = false) String email,
                           @RequestParam(value = "soDienThoai", required = false) String soDienThoai,
                           @RequestParam(value = "vaiTro") String vaiTro,
                           @RequestParam(value = "trangThai") String trangThai,
                           @RequestParam(value = "avatarFile", required = false) MultipartFile avatarFile,
                           HttpSession session,
                           RedirectAttributes redirectAttributes) {
        if (!checkAdmin(session)) return "redirect:/web/login";
        try {
            NguoiDung user = nguoiDungRepository.findById(id).orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng ID: " + id));
            user.setHoTen(hoTen);
            user.setEmail(email);
            user.setSoDienThoai(soDienThoai);
            user.setVaiTro(vaiTro);
            user.setTrangThai(trangThai);
            if (avatarFile != null && !avatarFile.isEmpty()) {
                Map<String, Object> up = cloudinaryService.uploadFile(avatarFile, "avatars");
                user.setAvatar((String) up.get("secure_url"));
            }
            nguoiDungRepository.save(user);
            redirectAttributes.addFlashAttribute("successMessage", "Cập nhật thông tin tài khoản \"" + user.getTenDangNhap() + "\" thành công!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Lỗi cập nhật tài khoản: " + e.getMessage());
        }
        return "redirect:/web/admin/users";
    }

    @PostMapping("/users/{id}/reset-password")
    public String resetUserPassword(@PathVariable("id") Long id,
                                    @RequestParam("newPassword") String newPassword,
                                    HttpSession session,
                                    RedirectAttributes redirectAttributes) {
        if (!checkAdmin(session)) return "redirect:/web/login";
        try {
            NguoiDung user = nguoiDungRepository.findById(id).orElse(null);
            if (user != null) {
                String rawPwd = newPassword != null && !newPassword.isBlank() ? newPassword : "123456";
                user.setMatKhau(passwordEncoder.encode(rawPwd));
                user.setMatKhauHienThi(rawPwd);
                nguoiDungRepository.save(user);
                redirectAttributes.addFlashAttribute("successMessage", "Đặt lại mật khẩu cho \"" + user.getTenDangNhap() + "\" thành công!");
            }
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Lỗi đặt lại mật khẩu: " + e.getMessage());
        }
        return "redirect:/web/admin/users";
    }

    @GetMapping("/users/{id}/toggle-status")
    public String toggleStatus(@PathVariable("id") Long id, HttpSession session, RedirectAttributes redirectAttributes) {
        if (!checkAdmin(session)) return "redirect:/web/login";
        try {
            NguoiDung user = nguoiDungRepository.findById(id).orElse(null);
            if (user != null) {
                boolean isLocking = "HOAT_DONG".equals(user.getTrangThai());
                user.setTrangThai(isLocking ? "BI_KHOA" : "HOAT_DONG");
                nguoiDungRepository.save(user);
                redirectAttributes.addFlashAttribute("successMessage", (isLocking ? "Đã khóa" : "Đã mở khóa") + " tài khoản \"" + user.getTenDangNhap() + "\" thành công!");
            }
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Lỗi thay đổi trạng thái: " + e.getMessage());
        }
        return "redirect:/web/admin/users";
    }

    @GetMapping("/users/{id}/delete")
    public String deleteUser(@PathVariable("id") Long id, HttpSession session, RedirectAttributes redirectAttributes) {
        if (!checkAdmin(session)) return "redirect:/web/login";
        try {
            nguoiDungRepository.deleteById(id);
            redirectAttributes.addFlashAttribute("successMessage", "Xóa tài khoản thành công!");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("errorMessage", "Lỗi xóa tài khoản: " + e.getMessage());
        }
        return "redirect:/web/admin/users";
    }
}
