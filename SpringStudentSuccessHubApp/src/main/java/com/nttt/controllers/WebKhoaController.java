package com.nttt.controllers;

import com.nttt.dto.*;
import com.nttt.pojo.*;
import com.nttt.repositories.*;
import com.nttt.services.*;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("/web/khoa")
public class WebKhoaController {

    private final SinhVienService sinhVienService;
    private final DanhMucService danhMucService;
    private final DotXetHocBongService dotXetHocBongService;
    private final MinhChungRenLuyenService minhChungService;
    private final CanBoKhoaRepository canBoKhoaRepository;
    private final DotXetHbKhoaRepository dotXetHbKhoaRepository;
    private final KienNghiRepository kienNghiRepository;

    public WebKhoaController(SinhVienService sinhVienService,
                             DanhMucService danhMucService,
                             DotXetHocBongService dotXetHocBongService,
                             MinhChungRenLuyenService minhChungService,
                             CanBoKhoaRepository canBoKhoaRepository,
                             DotXetHbKhoaRepository dotXetHbKhoaRepository,
                             KienNghiRepository kienNghiRepository) {
        this.sinhVienService = sinhVienService;
        this.danhMucService = danhMucService;
        this.dotXetHocBongService = dotXetHocBongService;
        this.minhChungService = minhChungService;
        this.canBoKhoaRepository = canBoKhoaRepository;
        this.dotXetHbKhoaRepository = dotXetHbKhoaRepository;
        this.kienNghiRepository = kienNghiRepository;
    }

    private String getKhoaCode(HttpSession session) {
        NguoiDung u = (NguoiDung) session.getAttribute("currentUser");
        if (u == null) return null;
        if ("ROLE_ADMIN".equals(u.getVaiTro())) return "IT"; // Default for admin preview
        return canBoKhoaRepository.findByNhanVien_NguoiDung_TenDangNhap(u.getTenDangNhap())
                .map(cb -> cb.getKhoa().getMaKhoa())
                .orElse("IT");
    }

    private boolean checkKhoa(HttpSession session) {
        NguoiDung u = (NguoiDung) session.getAttribute("currentUser");
        return u != null && ("ROLE_CAN_BO_KHOA".equals(u.getVaiTro()) || "ROLE_ADMIN".equals(u.getVaiTro()));
    }

    @GetMapping("/dashboard")
    public String dashboard(HttpSession session, Model model) {
        if (!checkKhoa(session)) return "redirect:/web/login";

        String maKhoa = getKhoaCode(session);
        List<SinhVienDTO> students = sinhVienService.filterStudents(maKhoa, null, null, null, null, null);
        List<DotXetHbKhoa> campaigns = dotXetHbKhoaRepository.findByKhoa_MaKhoa(maKhoa);

        model.addAttribute("maKhoa", maKhoa);
        model.addAttribute("totalStudents", students.size());
        model.addAttribute("totalCampaigns", campaigns.size());
        model.addAttribute("pendingEvidences", minhChungService.getByKhoa(maKhoa, "CHO_DUYET").size());
        return "khoa/dashboard";
    }

    @GetMapping("/students")
    public String students(@RequestParam(value = "maLop", required = false) String maLop,
                           @RequestParam(value = "maHocKy", required = false) String maHocKy,
                           @RequestParam(value = "search", required = false) String search,
                           HttpSession session, Model model) {
        if (!checkKhoa(session)) return "redirect:/web/login";

        String maKhoa = getKhoaCode(session);
        String activeHk = (maHocKy != null && !maHocKy.isBlank()) ? maHocKy : "HK1_2025_2026";
        List<SinhVienDTO> list = sinhVienService.filterStudents(maKhoa, null, maLop, null, search, activeHk);

        model.addAttribute("students", list);
        model.addAttribute("lops", danhMucService.getLopByKhoa(maKhoa));
        model.addAttribute("hocKys", danhMucService.getAllHocKy());
        model.addAttribute("selectedLop", maLop);
        model.addAttribute("selectedHk", activeHk);
        model.addAttribute("search", search);
        model.addAttribute("maKhoa", maKhoa);
        return "khoa/students";
    }

    @GetMapping("/scholarships")
    public String scholarships(HttpSession session, Model model) {
        if (!checkKhoa(session)) return "redirect:/web/login";

        String maKhoa = getKhoaCode(session);
        List<DotXetHbKhoaDTO> list = dotXetHocBongService.getDotKhoaByMaKhoa(maKhoa);
        model.addAttribute("dotKhoas", list);
        model.addAttribute("dotKhoasList", list);
        model.addAttribute("maKhoa", maKhoa);
        return "khoa/scholarships";
    }

    @PostMapping("/scholarships/{maDotXetHbKhoa}/run-auto-ranking")
    public String runAutoRanking(@PathVariable("maDotXetHbKhoa") String maDotXetHbKhoa, HttpSession session) {
        if (!checkKhoa(session)) return "redirect:/web/login";

        dotXetHocBongService.runAutoRanking(maDotXetHbKhoa);
        return "redirect:/web/khoa/scholarships/" + maDotXetHbKhoa;
    }

    @GetMapping("/scholarships/{maDotXetHbKhoa}/auto-evaluate")
    public String autoEvaluate(@PathVariable("maDotXetHbKhoa") String maDotXetHbKhoa, HttpSession session) {
        if (!checkKhoa(session)) return "redirect:/web/login";

        dotXetHocBongService.runAutoRanking(maDotXetHbKhoa);
        return "redirect:/web/khoa/scholarships/" + maDotXetHbKhoa;
    }

    @GetMapping("/scholarships/{maDotXetHbKhoa}")
    public String scholarshipDetail(@PathVariable("maDotXetHbKhoa") String maDotXetHbKhoa,
                                    @RequestParam(value = "khoaHoc", required = false) String khoaHoc,
                                    @RequestParam(value = "maNganh", required = false) String maNganh,
                                    @RequestParam(value = "heDaoTao", required = false) String heDaoTao,
                                    @RequestParam(value = "loaiHb", required = false) String loaiHb,
                                    @RequestParam(value = "search", required = false) String search,
                                    HttpSession session, Model model) {
        if (!checkKhoa(session)) return "redirect:/web/login";

        DotXetHbKhoaDTO dk = dotXetHocBongService.getDotKhoaById(maDotXetHbKhoa);
        List<HoSoHocBongDTO> allDossiers = dotXetHocBongService.getHoSoByDotKhoa(maDotXetHbKhoa);

        // Apply filtering if provided
        List<HoSoHocBongDTO> filtered = allDossiers.stream().filter(d -> {
            if (search != null && !search.isBlank()) {
                String q = search.toLowerCase();
                boolean matchSearch = (d.getMssv() != null && d.getMssv().toLowerCase().contains(q))
                        || (d.getHoTen() != null && d.getHoTen().toLowerCase().contains(q))
                        || (d.getMaLop() != null && d.getMaLop().toLowerCase().contains(q));
                if (!matchSearch) return false;
            }
            if (khoaHoc != null && !khoaHoc.isBlank() && !"ALL".equalsIgnoreCase(khoaHoc)) {
                if (d.getKhoaHoc() == null || !d.getKhoaHoc().equalsIgnoreCase(khoaHoc)) return false;
            }
            if (maNganh != null && !maNganh.isBlank() && !"ALL".equalsIgnoreCase(maNganh)) {
                if (d.getMaNganh() == null || !d.getMaNganh().equalsIgnoreCase(maNganh)) return false;
            }
            if (heDaoTao != null && !heDaoTao.isBlank() && !"ALL".equalsIgnoreCase(heDaoTao)) {
                if ("CHUAN".equalsIgnoreCase(heDaoTao)) {
                    if (d.getHeDaoTao() != null && ("DAC_BIET".equalsIgnoreCase(d.getHeDaoTao()) || "CHAT_LUONG_CAO".equalsIgnoreCase(d.getHeDaoTao()))) {
                        return false;
                    }
                } else if ("DAC_BIET".equalsIgnoreCase(heDaoTao)) {
                    if (d.getHeDaoTao() == null || (!"DAC_BIET".equalsIgnoreCase(d.getHeDaoTao()) && !"CHAT_LUONG_CAO".equalsIgnoreCase(d.getHeDaoTao()))) {
                        return false;
                    }
                }
            }
            if (loaiHb != null && !loaiHb.isBlank() && !"ALL".equalsIgnoreCase(loaiHb)) {
                if (d.getLoaiHocBong() == null || !d.getLoaiHocBong().equalsIgnoreCase(loaiHb)) return false;
            }
            return true;
        }).toList();

        // Unique filter options
        List<String> uniqueKhoaHoc = allDossiers.stream().map(HoSoHocBongDTO::getKhoaHoc).filter(k -> k != null && !k.isBlank()).distinct().toList();
        List<Nganh> uniqueNganh = danhMucService.getNganhByKhoa(getKhoaCode(session));

        long countXuatSac = allDossiers.stream().filter(d -> "XUAT_SAC".equals(d.getLoaiHocBong()) && d.getMucHocBong() != null && d.getMucHocBong().compareTo(java.math.BigDecimal.ZERO) > 0).count();
        long countGioi = allDossiers.stream().filter(d -> "GIOI".equals(d.getLoaiHocBong()) && d.getMucHocBong() != null && d.getMucHocBong().compareTo(java.math.BigDecimal.ZERO) > 0).count();
        long countKha = allDossiers.stream().filter(d -> "KHA".equals(d.getLoaiHocBong()) && d.getMucHocBong() != null && d.getMucHocBong().compareTo(java.math.BigDecimal.ZERO) > 0).count();

        List<QuyHocBongNganhDTO> facultyBreakdown = dotXetHocBongService.getBudgetBreakdown(dk.getMaDot()).stream()
                .filter(b -> (dk.getMaKhoa() != null && dk.getMaKhoa().equalsIgnoreCase(b.getMaKhoa()))
                        || ("IT".equalsIgnoreCase(dk.getMaKhoa()) && "IT".equalsIgnoreCase(b.getMaKhoa()))
                        || ("CNTT".equalsIgnoreCase(dk.getMaKhoa()) && "IT".equalsIgnoreCase(b.getMaKhoa())))
                .toList();

        model.addAttribute("dotKhoa", dk);
        model.addAttribute("dossiers", filtered);
        model.addAttribute("facultyBreakdown", facultyBreakdown);
        model.addAttribute("totalDossiersCount", allDossiers.size());
        model.addAttribute("countXuatSac", countXuatSac);
        model.addAttribute("countGioi", countGioi);
        model.addAttribute("countKha", countKha);
        model.addAttribute("uniqueKhoaHoc", uniqueKhoaHoc);
        model.addAttribute("uniqueNganh", uniqueNganh);
        model.addAttribute("selectedKhoaHoc", khoaHoc);
        model.addAttribute("selectedMaNganh", maNganh);
        model.addAttribute("selectedHeDaoTao", heDaoTao);
        model.addAttribute("selectedLoaiHb", loaiHb);
        model.addAttribute("search", search);
        return "khoa/scholarship-detail";
    }

    @PostMapping("/scholarships/{maDotXetHbKhoa}/submit-to-university")
    public String submitToUniv(@PathVariable("maDotXetHbKhoa") String maDotXetHbKhoa, HttpSession session) {
        if (!checkKhoa(session)) return "redirect:/web/login";
        dotXetHocBongService.chotDanhSachKhoa(maDotXetHbKhoa);
        return "redirect:/web/khoa/scholarships/" + maDotXetHbKhoa;
    }

    @GetMapping("/evidence")
    public String evidence(HttpSession session, Model model) {
        if (!checkKhoa(session)) return "redirect:/web/login";

        String maKhoa = getKhoaCode(session);
        model.addAttribute("evidenceList", minhChungService.getByKhoa(maKhoa, null));
        return "khoa/evidence";
    }

    @PostMapping("/evidence/{maMinhChung}/review")
    public String reviewEvidence(@PathVariable("maMinhChung") String maMinhChung,
                                 @RequestParam("trangThai") String trangThai,
                                 @RequestParam("lyDoPhanHoi") String lyDoPhanHoi,
                                 HttpSession session) {
        if (!checkKhoa(session)) return "redirect:/web/login";

        NguoiDung u = (NguoiDung) session.getAttribute("currentUser");
        boolean approve = "DA_DUYET".equalsIgnoreCase(trangThai) || "true".equalsIgnoreCase(trangThai);
        minhChungService.reviewMinhChung(maMinhChung, u != null ? u.getTenDangNhap() : "system", approve, lyDoPhanHoi);
        return "redirect:/web/khoa/evidence";
    }

    @GetMapping("/appeals")
    public String appeals(HttpSession session, Model model) {
        if (!checkKhoa(session)) return "redirect:/web/login";

        String maKhoa = getKhoaCode(session);
        model.addAttribute("appeals", kienNghiRepository.findByDotXetHbKhoa_Khoa_MaKhoa(maKhoa));
        return "khoa/appeals";
    }
}
