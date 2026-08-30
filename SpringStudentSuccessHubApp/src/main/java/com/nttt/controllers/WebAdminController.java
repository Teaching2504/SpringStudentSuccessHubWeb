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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

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

    public WebAdminController(SinhVienService sinhVienService,
                              DanhMucService danhMucService,
                              ExcelService excelService,
                              NguoiDungRepository nguoiDungRepository,
                              NguoiDungService nguoiDungService,
                              PasswordEncoder passwordEncoder,
                              CurriculumService curriculumService) {
        this.sinhVienService = sinhVienService;
        this.danhMucService = danhMucService;
        this.excelService = excelService;
        this.nguoiDungRepository = nguoiDungRepository;
        this.nguoiDungService = nguoiDungService;
        this.passwordEncoder = passwordEncoder;
        this.curriculumService = curriculumService;
    }

    private boolean checkAdmin(HttpSession session) {
        NguoiDung u = (NguoiDung) session.getAttribute("currentUser");
        return u != null && "ROLE_ADMIN".equals(u.getVaiTro());
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
                              HttpSession session, Model model) {
        if (!checkAdmin(session)) return "redirect:/web/login";
        try {
            excelService.importStudentsFromExcel(file, maHocKy);
            model.addAttribute("successMessage", "Nhập dữ liệu Excel thành công!");
        } catch (Exception e) {
            model.addAttribute("errorMessage", "Lỗi nhập Excel: " + e.getMessage());
        }
        return "redirect:/web/admin/students";
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
    public String addKhoa(@ModelAttribute Khoa khoa, HttpSession session) {
        if (!checkAdmin(session)) return "redirect:/web/login";
        danhMucService.createKhoa(khoa);
        return "redirect:/web/admin/categories?tab=khoa";
    }

    @GetMapping("/categories/khoa/delete/{maKhoa}")
    public String deleteKhoa(@PathVariable("maKhoa") String maKhoa, HttpSession session) {
        if (!checkAdmin(session)) return "redirect:/web/login";
        danhMucService.deleteKhoa(maKhoa);
        return "redirect:/web/admin/categories?tab=khoa";
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
                          HttpSession session) {
        if (!checkAdmin(session)) return "redirect:/web/login";
        String rawPwd = matKhau != null && !matKhau.isBlank() ? matKhau : "123456";
        NguoiDung user = NguoiDung.builder()
                .tenDangNhap(tenDangNhap)
                .matKhau(passwordEncoder.encode(rawPwd))
                .matKhauHienThi(rawPwd)
                .hoTen(hoTen)
                .email(email)
                .soDienThoai(soDienThoai)
                .vaiTro(vaiTro)
                .trangThai("HOAT_DONG")
                .build();
        nguoiDungRepository.save(user);
        return "redirect:/web/admin/users";
    }

    @PostMapping("/users/{id}/reset-password")
    public String resetUserPassword(@PathVariable("id") Long id,
                                    @RequestParam("newPassword") String newPassword,
                                    HttpSession session) {
        if (!checkAdmin(session)) return "redirect:/web/login";
        NguoiDung user = nguoiDungRepository.findById(id).orElse(null);
        if (user != null) {
            String rawPwd = newPassword != null && !newPassword.isBlank() ? newPassword : "123456";
            user.setMatKhau(passwordEncoder.encode(rawPwd));
            user.setMatKhauHienThi(rawPwd);
            nguoiDungRepository.save(user);
        }
        return "redirect:/web/admin/users";
    }

    @GetMapping("/users/{id}/toggle-status")
    public String toggleStatus(@PathVariable("id") Long id, HttpSession session) {
        if (!checkAdmin(session)) return "redirect:/web/login";
        NguoiDung user = nguoiDungRepository.findById(id).orElse(null);
        if (user != null) {
            user.setTrangThai("HOAT_DONG".equals(user.getTrangThai()) ? "BI_KHOA" : "HOAT_DONG");
            nguoiDungRepository.save(user);
        }
        return "redirect:/web/admin/users";
    }

    @GetMapping("/users/{id}/delete")
    public String deleteUser(@PathVariable("id") Long id, HttpSession session) {
        if (!checkAdmin(session)) return "redirect:/web/login";
        nguoiDungRepository.deleteById(id);
        return "redirect:/web/admin/users";
    }
}
