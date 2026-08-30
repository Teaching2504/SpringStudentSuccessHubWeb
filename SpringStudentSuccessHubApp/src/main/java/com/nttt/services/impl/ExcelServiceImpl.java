package com.nttt.services.impl;

import com.nttt.dto.HoSoHocBongDTO;
import com.nttt.pojo.*;
import com.nttt.repositories.*;
import com.nttt.services.ExcelService;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Service
public class ExcelServiceImpl implements ExcelService {

    private final SinhVienRepository sinhVienRepository;
    private final NguoiDungRepository nguoiDungRepository;
    private final LopSinhHoatRepository lopSinhHoatRepository;
    private final HocKyRepository hocKyRepository;
    private final KetQuaHocTapRepository ketQuaHocTapRepository;
    private final KetQuaRenLuyenRepository ketQuaRenLuyenRepository;
    private final PasswordEncoder passwordEncoder;

    public ExcelServiceImpl(
            SinhVienRepository sinhVienRepository,
            NguoiDungRepository nguoiDungRepository,
            LopSinhHoatRepository lopSinhHoatRepository,
            HocKyRepository hocKyRepository,
            KetQuaHocTapRepository ketQuaHocTapRepository,
            KetQuaRenLuyenRepository ketQuaRenLuyenRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.sinhVienRepository = sinhVienRepository;
        this.nguoiDungRepository = nguoiDungRepository;
        this.lopSinhHoatRepository = lopSinhHoatRepository;
        this.hocKyRepository = hocKyRepository;
        this.ketQuaHocTapRepository = ketQuaHocTapRepository;
        this.ketQuaRenLuyenRepository = ketQuaRenLuyenRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public Map<String, Object> importStudentsFromExcel(MultipartFile file, String maHocKy) {
        int importedCount = 0;
        int updatedCount = 0;
        List<String> errors = new ArrayList<>();

        HocKy hocKy = (maHocKy != null && !maHocKy.isBlank()) ? hocKyRepository.findById(maHocKy).orElse(null) : null;

        try (Workbook workbook = WorkbookFactory.create(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rowIterator = sheet.iterator();

            // Skip header
            if (rowIterator.hasNext()) {
                rowIterator.next();
            }

            int rowIndex = 1;
            while (rowIterator.hasNext()) {
                rowIndex++;
                Row row = rowIterator.next();

                String mssv = getCellValueAsString(row.getCell(0));
                if (mssv == null || mssv.isBlank()) continue;

                String hoTen = getCellValueAsString(row.getCell(1));
                String email = getCellValueAsString(row.getCell(2));
                String soDienThoai = getCellValueAsString(row.getCell(3));
                String maLop = getCellValueAsString(row.getCell(4));
                String gioiTinh = getCellValueAsString(row.getCell(5));
                String gpaStr = getCellValueAsString(row.getCell(6));
                String drlStr = getCellValueAsString(row.getCell(7));
                String creditsStr = getCellValueAsString(row.getCell(8));
                String rotMonStr = getCellValueAsString(row.getCell(9));

                LopSinhHoat lop = (maLop != null) ? lopSinhHoatRepository.findById(maLop).orElse(null) : null;
                if (lop == null) {
                    errors.add("Dòng " + rowIndex + ": Mã lớp " + maLop + " không tồn tại.");
                    continue;
                }

                // Check or create NguoiDung & SinhVien
                Optional<SinhVien> svOpt = sinhVienRepository.findById(mssv);
                SinhVien sv;
                if (svOpt.isEmpty()) {
                    NguoiDung user = NguoiDung.builder()
                            .tenDangNhap(mssv)
                            .matKhau(passwordEncoder.encode("123456"))
                            .hoTen(hoTen != null ? hoTen : "Sinh viên " + mssv)
                            .email(email != null ? email : mssv + "@ou.edu.vn")
                            .soDienThoai(soDienThoai)
                            .vaiTro("ROLE_SINH_VIEN")
                            .trangThai("HOAT_DONG")
                            .build();
                    user = nguoiDungRepository.save(user);

                    sv = SinhVien.builder()
                            .mssv(mssv)
                            .nguoiDung(user)
                            .ngaySinh(LocalDate.of(2005, 1, 1))
                            .gioiTinh(gioiTinh != null ? gioiTinh : "Nam")
                            .diaChi("TP. Hồ Chí Minh")
                            .trangThaiHoc("DANG_HOC")
                            .lopSinhHoat(lop)
                            .build();
                    sv = sinhVienRepository.save(sv);
                    importedCount++;
                } else {
                    sv = svOpt.get();
                    if (hoTen != null && sv.getNguoiDung() != null) {
                        sv.getNguoiDung().setHoTen(hoTen);
                        nguoiDungRepository.save(sv.getNguoiDung());
                    }
                    sv.setLopSinhHoat(lop);
                    sinhVienRepository.save(sv);
                    updatedCount++;
                }

                final SinhVien currentSv = sv;

                // Save or update GPA & DRL if semester is present
                if (hocKy != null) {
                    if (gpaStr != null && !gpaStr.isBlank()) {
                        try {
                            BigDecimal gpa = new BigDecimal(gpaStr.replace(",", "."));
                            int credits = (creditsStr != null && !creditsStr.isBlank()) ?
                                    (int) Double.parseDouble(creditsStr) : 15;
                            boolean rotMon = "true".equalsIgnoreCase(rotMonStr) || "có".equalsIgnoreCase(rotMonStr) || "1".equals(rotMonStr);

                            KetQuaHocTap kqGpa = ketQuaHocTapRepository.findBySinhVien_MssvAndHocKy_MaHocKy(mssv, hocKy.getMaHocKy())
                                    .orElseGet(() -> KetQuaHocTap.builder()
                                            .id("GPA_" + mssv + "_" + hocKy.getMaHocKy())
                                            .sinhVien(currentSv)
                                            .hocKy(hocKy)
                                            .build());
                            kqGpa.setDiemTrungBinh(gpa);
                            kqGpa.setSoTinChi(credits);
                            kqGpa.setCoHocPhanRot(rotMon);
                            ketQuaHocTapRepository.save(kqGpa);
                        } catch (Exception e) {
                            errors.add("Dòng " + rowIndex + ": Điểm GPA không hợp lệ (" + gpaStr + ")");
                        }
                    }

                    if (drlStr != null && !drlStr.isBlank()) {
                        try {
                            BigDecimal drl = new BigDecimal(drlStr.replace(",", "."));
                            KetQuaRenLuyen kqDrl = ketQuaRenLuyenRepository.findBySinhVien_MssvAndHocKy_MaHocKy(mssv, hocKy.getMaHocKy())
                                    .orElseGet(() -> KetQuaRenLuyen.builder()
                                            .id("DRL_" + mssv + "_" + hocKy.getMaHocKy())
                                            .sinhVien(currentSv)
                                            .hocKy(hocKy)
                                            .build());
                            kqDrl.setDiemRenLuyen(drl);
                            if (drl.compareTo(BigDecimal.valueOf(90)) >= 0) kqDrl.setXepLoai("Xuat sac");
                            else if (drl.compareTo(BigDecimal.valueOf(80)) >= 0) kqDrl.setXepLoai("Tot");
                            else if (drl.compareTo(BigDecimal.valueOf(65)) >= 0) kqDrl.setXepLoai("Kha");
                            else kqDrl.setXepLoai("Trung binh");
                            ketQuaRenLuyenRepository.save(kqDrl);
                        } catch (Exception e) {
                            errors.add("Dòng " + rowIndex + ": Điểm ĐRL không hợp lệ (" + drlStr + ")");
                        }
                    }
                }
            }
        } catch (Exception ex) {
            throw new RuntimeException("Lỗi xử lý file Excel: " + ex.getMessage(), ex);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("importedCount", importedCount);
        result.put("updatedCount", updatedCount);
        result.put("errors", errors);
        return result;
    }

    @Override
    public ByteArrayInputStream exportScholarshipAwardList(List<HoSoHocBongDTO> dossiers, String title) {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("DanhSachHocBong");

            Font titleFont = workbook.createFont();
            titleFont.setBold(true);
            titleFont.setFontHeightInPoints((short) 14);

            CellStyle titleStyle = workbook.createCellStyle();
            titleStyle.setFont(titleFont);
            titleStyle.setAlignment(HorizontalAlignment.CENTER);

            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.WHITE.getIndex());

            CellStyle headerStyle = workbook.createCellStyle();
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.ROYAL_BLUE.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setAlignment(HorizontalAlignment.CENTER);
            headerStyle.setBorderBottom(BorderStyle.THIN);

            Row titleRow = sheet.createRow(0);
            Cell titleCell = titleRow.createCell(0);
            titleCell.setCellValue(title != null ? title : "DANH SÁCH SINH VIÊN ĐẠT HỌC BỔNG");
            titleCell.setCellStyle(titleStyle);

            String[] headers = {
                    "STT", "Thứ Hạng", "MSSV", "Họ và Tên", "Lớp", "Khoa", "Ngành",
                    "GPA", "ĐRL", "Số Tín Chỉ", "Loại Học Bổng", "Số Tiền Học Bổng (VNĐ)", "Trạng Thái"
            };

            Row headerRow = sheet.createRow(2);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            int rowIdx = 3;
            int stt = 1;
            BigDecimal totalAmount = BigDecimal.ZERO;

            for (HoSoHocBongDTO hs : dossiers) {
                Row row = sheet.createRow(rowIdx++);

                row.createCell(0).setCellValue(stt++);
                row.createCell(1).setCellValue(hs.getThuHang() != null ? String.valueOf(hs.getThuHang()) : "-");
                row.createCell(2).setCellValue(hs.getMssv() != null ? hs.getMssv() : "");
                row.createCell(3).setCellValue(hs.getHoTen() != null ? hs.getHoTen() : "");
                row.createCell(4).setCellValue(hs.getMaLop() != null ? hs.getMaLop() : "");
                row.createCell(5).setCellValue(hs.getTenKhoa() != null ? hs.getTenKhoa() : "");
                row.createCell(6).setCellValue(hs.getTenNganh() != null ? hs.getTenNganh() : "");

                row.createCell(7).setCellValue(hs.getDiemTrungBinh() != null ? hs.getDiemTrungBinh().doubleValue() : 0.0);
                row.createCell(8).setCellValue(hs.getDiemRenLuyen() != null ? hs.getDiemRenLuyen().doubleValue() : 0.0);
                row.createCell(9).setCellValue(hs.getSoTinChi() != null ? hs.getSoTinChi() : 0);
                row.createCell(10).setCellValue(hs.getLoaiHocBong() != null ? hs.getLoaiHocBong() : "");

                double amount = hs.getMucHocBong() != null ? hs.getMucHocBong().doubleValue() : 0.0;
                row.createCell(11).setCellValue(amount);
                if (hs.getMucHocBong() != null) totalAmount = totalAmount.add(hs.getMucHocBong());

                row.createCell(12).setCellValue(hs.getTrangThai() != null ? hs.getTrangThai() : "");
            }

            Row sumRow = sheet.createRow(rowIdx + 1);
            Cell sumLabel = sumRow.createCell(10);
            sumLabel.setCellValue("TỔNG TIỀN:");
            Cell sumVal = sumRow.createCell(11);
            sumVal.setCellValue(totalAmount.doubleValue());

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (IOException e) {
            throw new RuntimeException("Lỗi tạo file Excel xuất báo cáo: " + e.getMessage(), e);
        }
    }

    private String getCellValueAsString(Cell cell) {
        if (cell == null) return "";
        return switch (cell.getCellType()) {
            case STRING -> cell.getStringCellValue().trim();
            case NUMERIC -> {
                if (DateUtil.isCellDateFormatted(cell)) {
                    yield cell.getDateCellValue().toString();
                }
                double val = cell.getNumericCellValue();
                if (val == (long) val) yield String.valueOf((long) val);
                yield String.valueOf(val);
            }
            case BOOLEAN -> String.valueOf(cell.getBooleanCellValue());
            case FORMULA -> cell.getCellFormula();
            default -> "";
        };
    }
}
