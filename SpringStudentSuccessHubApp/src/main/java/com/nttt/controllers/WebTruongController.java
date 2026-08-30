package com.nttt.controllers;

import com.nttt.dto.DotXetHbKhoaDTO;
import com.nttt.dto.DotXetHocBongDTO;
import com.nttt.dto.QuyHocBongNganhDTO;
import com.nttt.dto.QuyTacHocBongDTO;
import com.nttt.pojo.*;
import com.nttt.services.DanhMucService;
import com.nttt.services.DotXetHocBongService;
import com.nttt.services.ThongKeService;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@Controller
@RequestMapping("/web/truong")
public class WebTruongController {

    private final DotXetHocBongService dotXetHocBongService;
    private final DanhMucService danhMucService;
    private final ThongKeService thongKeService;

    public WebTruongController(DotXetHocBongService dotXetHocBongService,
                               DanhMucService danhMucService,
                               ThongKeService thongKeService) {
        this.dotXetHocBongService = dotXetHocBongService;
        this.danhMucService = danhMucService;
        this.thongKeService = thongKeService;
    }

    private boolean checkTruong(HttpSession session) {
        NguoiDung u = (NguoiDung) session.getAttribute("currentUser");
        return u != null && ("ROLE_CAN_BO_TRUONG".equals(u.getVaiTro()) || "ROLE_ADMIN".equals(u.getVaiTro()));
    }

    @GetMapping("/dashboard")
    public String dashboard(HttpSession session, Model model) {
        if (!checkTruong(session)) return "redirect:/web/login";

        List<DotXetHocBongDTO> campaigns = dotXetHocBongService.getAllDotXet();
        model.addAttribute("campaigns", campaigns);
        model.addAttribute("totalCampaigns", campaigns.size());
        model.addAttribute("activeCampaigns", campaigns.stream().filter(c -> "DANG_MO".equals(c.getTrangThai())).count());
        model.addAttribute("stats", thongKeService.getGlobalDashboardStats());
        return "truong/dashboard";
    }

    @GetMapping("/campaigns")
    public String campaigns(HttpSession session, Model model) {
        if (!checkTruong(session)) return "redirect:/web/login";

        model.addAttribute("campaigns", dotXetHocBongService.getAllDotXet());
        model.addAttribute("hocKys", danhMucService.getAllHocKy());
        return "truong/campaigns";
    }

    @PostMapping("/campaigns/add")
    public String createCampaign(@ModelAttribute DotXetHocBongDTO dto, HttpSession session) {
        if (!checkTruong(session)) return "redirect:/web/login";
        dotXetHocBongService.createDotXet(dto);
        return "redirect:/web/truong/campaigns";
    }

    @GetMapping("/campaigns/{maDot}")
    public String campaignDetail(@PathVariable("maDot") String maDot,
                                 @RequestParam(value = "tab", defaultValue = "review") String tab,
                                 @RequestParam(value = "filterKhoa", required = false) String filterKhoa,
                                 @RequestParam(value = "filterKhoaHoc", required = false) String filterKhoaHoc,
                                 @RequestParam(value = "filterNganh", required = false) String filterNganh,
                                 @RequestParam(value = "filterHeDaoTao", required = false) String filterHeDaoTao,
                                 @RequestParam(value = "filterSearch", required = false) String filterSearch,
                                 HttpSession session, Model model) {
        if (!checkTruong(session)) return "redirect:/web/login";

        DotXetHocBongDTO camp = dotXetHocBongService.getDotXetById(maDot);
        List<DotXetHbKhoaDTO> dotKhoasList = dotXetHocBongService.getDotKhoaByMaDot(maDot);
        List<QuyHocBongNganhDTO> allBreakdown = dotXetHocBongService.getBudgetBreakdown(maDot);

        // Filter budget breakdown
        List<QuyHocBongNganhDTO> filteredBreakdown = allBreakdown.stream().filter(item -> {
            if (filterSearch != null && !filterSearch.isBlank()) {
                String q = filterSearch.toLowerCase();
                boolean match = (item.getTenKhoa() != null && item.getTenKhoa().toLowerCase().contains(q))
                        || (item.getMaKhoa() != null && item.getMaKhoa().toLowerCase().contains(q))
                        || (item.getTenNganh() != null && item.getTenNganh().toLowerCase().contains(q))
                        || (item.getMaNganh() != null && item.getMaNganh().toLowerCase().contains(q));
                if (!match) return false;
            }
            if (filterKhoa != null && !filterKhoa.isBlank() && !"ALL".equalsIgnoreCase(filterKhoa)) {
                if (item.getMaKhoa() == null || !item.getMaKhoa().equalsIgnoreCase(filterKhoa)) return false;
            }
            if (filterKhoaHoc != null && !filterKhoaHoc.isBlank() && !"ALL".equalsIgnoreCase(filterKhoaHoc)) {
                if (item.getKhoaHoc() == null || !item.getKhoaHoc().equalsIgnoreCase(filterKhoaHoc)) return false;
            }
            if (filterNganh != null && !filterNganh.isBlank() && !"ALL".equalsIgnoreCase(filterNganh)) {
                if (item.getTenNganh() == null || !item.getTenNganh().equalsIgnoreCase(filterNganh)) return false;
            }
            if (filterHeDaoTao != null && !filterHeDaoTao.isBlank() && !"ALL".equalsIgnoreCase(filterHeDaoTao)) {
                if ("CHUAN".equalsIgnoreCase(filterHeDaoTao)) {
                    if (item.getHeDaoTao() != null && ("DAC_BIET".equalsIgnoreCase(item.getHeDaoTao()) || "CHAT_LUONG_CAO".equalsIgnoreCase(item.getHeDaoTao()))) {
                        return false;
                    }
                } else if ("DAC_BIET".equalsIgnoreCase(filterHeDaoTao)) {
                    if (item.getHeDaoTao() == null || (!"DAC_BIET".equalsIgnoreCase(item.getHeDaoTao()) && !"CHAT_LUONG_CAO".equalsIgnoreCase(item.getHeDaoTao()))) {
                        return false;
                    }
                }
            }
            return true;
        }).toList();

        // Unique filter items
        List<String> uniqueBudgetKhoas = allBreakdown.stream().map(QuyHocBongNganhDTO::getMaKhoa).filter(k -> k != null && !k.isBlank()).distinct().toList();
        List<String> uniqueBudgetKhoaHocs = allBreakdown.stream().map(QuyHocBongNganhDTO::getKhoaHoc).filter(k -> k != null && !k.isBlank()).distinct().toList();
        List<String> uniqueBudgetNganhs = allBreakdown.stream().map(QuyHocBongNganhDTO::getTenNganh).filter(k -> k != null && !k.isBlank()).distinct().toList();

        // Totals
        int totalStudents = filteredBreakdown.stream().mapToInt(b -> b.getSoSinhVienTong() != null ? b.getSoSinhVienTong() : 0).sum();
        BigDecimal totalTuitionSum = filteredBreakdown.stream().map(b -> b.getTongHocPhiThu() != null ? b.getTongHocPhiThu() : BigDecimal.ZERO).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal total8PercentFund = filteredBreakdown.stream().map(b -> b.getQuyHocBong8PhanTram() != null ? b.getQuyHocBong8PhanTram() : BigDecimal.ZERO).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalAllocatedFacultyBudget = dotKhoasList.stream().map(d -> d.getNganSachKhoa() != null ? d.getNganSachKhoa() : BigDecimal.ZERO).reduce(BigDecimal.ZERO, BigDecimal::add);

        model.addAttribute("campaign", camp);
        model.addAttribute("dotKhoasList", dotKhoasList);
        model.addAttribute("khoas", danhMucService.getAllKhoa());
        model.addAttribute("activeTab", tab);
        model.addAttribute("budgetBreakdown", filteredBreakdown);
        model.addAttribute("allBreakdownCount", allBreakdown.size());
        model.addAttribute("uniqueBudgetKhoas", uniqueBudgetKhoas);
        model.addAttribute("uniqueBudgetKhoaHocs", uniqueBudgetKhoaHocs);
        model.addAttribute("uniqueBudgetNganhs", uniqueBudgetNganhs);
        model.addAttribute("totalStudents", totalStudents);
        model.addAttribute("totalTuitionSum", totalTuitionSum);
        model.addAttribute("total8PercentFund", total8PercentFund);
        model.addAttribute("totalAllocatedFacultyBudget", totalAllocatedFacultyBudget);
        model.addAttribute("filterKhoa", filterKhoa);
        model.addAttribute("filterKhoaHoc", filterKhoaHoc);
        model.addAttribute("filterNganh", filterNganh);
        model.addAttribute("filterHeDaoTao", filterHeDaoTao);
        model.addAttribute("filterSearch", filterSearch);
        return "truong/campaign-detail";
    }

    @PostMapping("/campaigns/{maDot}/auto-sync-8percent")
    public String autoSync8Percent(@PathVariable("maDot") String maDot, HttpSession session) {
        if (!checkTruong(session)) return "redirect:/web/login";
        dotXetHocBongService.autoSyncFacultyBudgets(maDot);
        return "redirect:/web/truong/campaigns/" + maDot + "?tab=budget";
    }

    @PostMapping("/campaigns/{maDot}/quota/{dkId}")
    public String updateQuota(@PathVariable("maDot") String maDot,
                              @PathVariable("dkId") String dkId,
                              @RequestParam("chiTieu") Integer chiTieu,
                              @RequestParam("nganSachKhoa") BigDecimal nganSachKhoa,
                              HttpSession session) {
        if (!checkTruong(session)) return "redirect:/web/login";
        dotXetHocBongService.updateChiTieuKhoa(dkId, chiTieu, nganSachKhoa);
        return "redirect:/web/truong/campaigns/" + maDot + "?tab=budget";
    }

    @PostMapping("/campaigns/{maDot}/rules")
    public String updateRules(@PathVariable("maDot") String maDot,
                              @RequestParam("diemTbDuoiThieu") BigDecimal diemTbDuoiThieu,
                              @RequestParam("diemRlToiThieu") BigDecimal diemRlToiThieu,
                              @RequestParam("soTinChiToiThieu") int soTinChiToiThieu,
                              @RequestParam(value = "khongNoMon", defaultValue = "true") boolean khongNoMon,
                              @RequestParam(value = "mucHocBongXuatSac", defaultValue = "10000000") BigDecimal mucHocBongXuatSac,
                              @RequestParam(value = "mucHocBongGioi", defaultValue = "7000000") BigDecimal mucHocBongGioi,
                              @RequestParam(value = "mucHocBongKha", defaultValue = "5000000") BigDecimal mucHocBongKha,
                              @RequestParam(value = "ghiChu", required = false) String ghiChu,
                              HttpSession session) {
        if (!checkTruong(session)) return "redirect:/web/login";

        QuyTacHocBongDTO dto = QuyTacHocBongDTO.builder()
                .maDot(maDot)
                .diemTbDuoiThieu(diemTbDuoiThieu)
                .diemRlToiThieu(diemRlToiThieu)
                .soTinChiToiThieu(soTinChiToiThieu)
                .khongNoMon(khongNoMon)
                .mucHocBongXuatSac(mucHocBongXuatSac)
                .mucHocBongGioi(mucHocBongGioi)
                .mucHocBongKha(mucHocBongKha)
                .ghiChu(ghiChu)
                .build();
        dotXetHocBongService.saveQuyTac(dto);
        return "redirect:/web/truong/campaigns/" + maDot;
    }

    @PostMapping("/campaigns/{maDot}/publish")
    public String publishCampaign(@PathVariable("maDot") String maDot, HttpSession session) {
        if (!checkTruong(session)) return "redirect:/web/login";
        dotXetHocBongService.publishChinhThucToanTruong(maDot);
        return "redirect:/web/truong/campaigns/" + maDot;
    }

    @GetMapping("/stats")
    public String stats(HttpSession session, Model model) {
        if (!checkTruong(session)) return "redirect:/web/login";
        model.addAttribute("campaigns", dotXetHocBongService.getAllDotXet());
        model.addAttribute("stats", thongKeService.getGlobalDashboardStats());
        return "truong/stats";
    }
}
