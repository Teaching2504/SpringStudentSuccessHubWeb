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

            if (rowIterator.hasNext()) {
                rowIterator.next();
            }

            int rowIndex = 1;
            while (rowIterator.hasNext()) {
                rowIndex++;
                Row row = rowIterator.next();

                String mssv = getCellValueAsString(row.getCell(0));
                if (mssv == null || mssv.isBlank()) continue;
                if (mssv.equalsIgnoreCase("MSSV") || mssv.startsWith("MSSV") || mssv.startsWith("Lưu ý") || mssv.startsWith("STT") || mssv.startsWith("BIỂU MẪU")) continue;

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

                Optional<SinhVien> svOpt = sinhVienRepository.findById(mssv);
                SinhVien sv;
                if (svOpt.isEmpty()) {
                    NguoiDung user = NguoiDung.builder()
                            .tenDangNhap(mssv)
                            .matKhau(passwordEncoder.encode("123456"))
                            .matKhauHienThi("123456")
                            .hoTen(hoTen != null && !hoTen.isBlank() ? hoTen : "Sinh viên " + mssv)
                            .email(email != null && !email.isBlank() ? email : mssv + "@ou.edu.vn")
                            .soDienThoai(soDienThoai)
                            .vaiTro("ROLE_SINH_VIEN")
                            .trangThai("HOAT_DONG")
                            .build();
                    user = nguoiDungRepository.save(user);

                    sv = SinhVien.builder()
                            .mssv(mssv)
                            .cccd(generateCccd(mssv))
                            .nguoiDung(user)
                            .ngaySinh(LocalDate.of(2005, 1, 1))
                            .gioiTinh(gioiTinh != null && !gioiTinh.isBlank() ? gioiTinh : "Nam")
                            .diaChi("TP. Hồ Chí Minh")
                            .trangThaiHoc("DANG_HOC")
                            .lopSinhHoat(lop)
                            .build();
                    sv = sinhVienRepository.save(sv);
                    importedCount++;
                } else {
                    sv = svOpt.get();
                    if (hoTen != null && !hoTen.isBlank() && sv.getNguoiDung() != null) {
                        sv.getNguoiDung().setHoTen(hoTen);
                        nguoiDungRepository.save(sv.getNguoiDung());
                    }
                    if (sv.getCccd() == null || sv.getCccd().isBlank()) {
                        sv.setCccd(generateCccd(mssv));
                    }
                    sv.setLopSinhHoat(lop);
                    sinhVienRepository.save(sv);
                    updatedCount++;
                }

                final SinhVien currentSv = sv;

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

    @Override
    public ByteArrayInputStream generateStudentTemplateExcel() {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            Sheet sheet = workbook.createSheet("Mau_Nhap_SinhVien");

            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerFont.setColor(IndexedColors.WHITE.getIndex());
            headerFont.setFontHeightInPoints((short) 11);

            CellStyle headerStyle = workbook.createCellStyle();
            headerStyle.setFont(headerFont);
            headerStyle.setFillForegroundColor(IndexedColors.ROYAL_BLUE.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            headerStyle.setAlignment(HorizontalAlignment.CENTER);
            headerStyle.setVerticalAlignment(VerticalAlignment.CENTER);
            headerStyle.setBorderTop(BorderStyle.THIN);
            headerStyle.setBorderBottom(BorderStyle.THIN);
            headerStyle.setBorderLeft(BorderStyle.THIN);
            headerStyle.setBorderRight(BorderStyle.THIN);

            CellStyle dataStyleLeft = workbook.createCellStyle();
            dataStyleLeft.setBorderTop(BorderStyle.THIN);
            dataStyleLeft.setBorderBottom(BorderStyle.THIN);
            dataStyleLeft.setBorderLeft(BorderStyle.THIN);
            dataStyleLeft.setBorderRight(BorderStyle.THIN);
            dataStyleLeft.setAlignment(HorizontalAlignment.LEFT);
            dataStyleLeft.setVerticalAlignment(VerticalAlignment.CENTER);

            CellStyle dataStyleCenter = workbook.createCellStyle();
            dataStyleCenter.setBorderTop(BorderStyle.THIN);
            dataStyleCenter.setBorderBottom(BorderStyle.THIN);
            dataStyleCenter.setBorderLeft(BorderStyle.THIN);
            dataStyleCenter.setBorderRight(BorderStyle.THIN);
            dataStyleCenter.setAlignment(HorizontalAlignment.CENTER);
            dataStyleCenter.setVerticalAlignment(VerticalAlignment.CENTER);

            String[] headers = {
                    "MSSV (*)", "Họ và Tên (*)", "Email", "Số Điện Thoại",
                    "Mã Lớp (*)", "Giới Tính", "Điểm GPA", "Điểm Rèn Luyện",
                    "Số Tín Chỉ", "Rớt Môn (Co/Khong)"
            };

            Row headerRow = sheet.createRow(0);
            headerRow.setHeightInPoints(26);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            String[][] sampleData = {
                    {"2351010001", "Nguyễn Văn An", "2351010001@ou.edu.vn", "0901234567", "DH23CS01", "Nam", "3.65", "85", "18", "Khong"},
                    {"2351010002", "Trần Thị Bình", "2351010002@ou.edu.vn", "0912345678", "DH23CS01", "Nữ", "3.82", "92", "20", "Khong"},
                    {"2351010003", "Lê Hoàng Cường", "2351010003@ou.edu.vn", "0987654321", "DH23IT01", "Nam", "3.20", "78", "16", "Co"},
                    {"2351010004", "Phạm Thu Thảo", "2351010004@ou.edu.vn", "0977889900", "DH23EC01", "Nữ", "3.55", "88", "19", "Khong"}
            };

            for (int r = 0; r < sampleData.length; r++) {
                Row row = sheet.createRow(r + 1);
                row.setHeightInPoints(20);
                for (int c = 0; c < sampleData[r].length; c++) {
                    Cell cell = row.createCell(c);
                    cell.setCellValue(sampleData[r][c]);
                    if (c == 0 || c == 4 || c == 5 || c == 6 || c == 7 || c == 8 || c == 9) {
                        cell.setCellStyle(dataStyleCenter);
                    } else {
                        cell.setCellStyle(dataStyleLeft);
                    }
                }
            }

            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
                int currentWidth = sheet.getColumnWidth(i);
                sheet.setColumnWidth(i, Math.max(currentWidth + 1200, 4200));
            }

            Sheet guideSheet = workbook.createSheet("Huong_Dan_Su_Dung");
            Font guideTitleFont = workbook.createFont();
            guideTitleFont.setBold(true);
            guideTitleFont.setFontHeightInPoints((short) 13);
            guideTitleFont.setColor(IndexedColors.ROYAL_BLUE.getIndex());

            CellStyle guideTitleStyle = workbook.createCellStyle();
            guideTitleStyle.setFont(guideTitleFont);

            Row guideTitleRow = guideSheet.createRow(0);
            Cell guideTitleCell = guideTitleRow.createCell(0);
            guideTitleCell.setCellValue("HƯỚNG DẪN ĐIỀN DỮ LIỆU NHẬP SINH VIÊN VÀ ĐIỂM (OU-SSH HUB)");
            guideTitleCell.setCellStyle(guideTitleStyle);

            String[][] guideDetails = {
                    {"Cột", "Quy định / Bắt buộc", "Định dạng & Ví dụ", "Ghi chú giải thích"},
                    {"MSSV (*)", "Bắt buộc", "2351010001", "Mã số sinh viên (khoá chính), nếu chưa có tài khoản hệ thống sẽ tự tạo mới"},
                    {"Họ và Tên (*)", "Bắt buộc", "Nguyễn Văn An", "Họ và tên đầy đủ của sinh viên"},
                    {"Email", "Tùy chọn", "2351010001@ou.edu.vn", "Địa chỉ email. Nếu để trống hệ thống tự tạo theo mssv@ou.edu.vn"},
                    {"Số Điện Thoại", "Tùy chọn", "0901234567", "Số điện thoại liên lạc của sinh viên"},
                    {"Mã Lớp (*)", "Bắt buộc", "DH23CS01, DH23IT01...", "Mã lớp sinh hoạt (bắt buộc phải tồn tại trong danh mục Lớp sinh hoạt)"},
                    {"Giới Tính", "Tùy chọn", "Nam / Nữ", "Mặc định là Nam nếu để trống"},
                    {"Điểm GPA", "Tùy chọn", "3.65 hoặc 8.5", "Điểm trung bình học tập của học kỳ tương ứng (hệ số 4 hoặc 10)"},
                    {"Điểm Rèn Luyện", "Tùy chọn", "85", "Điểm rèn luyện học kỳ (thang 100). Hệ thống tự động xếp loại Xuất sắc/Tốt/Khá/TB"},
                    {"Số Tín Chỉ", "Tùy chọn", "18", "Tổng số tín chỉ tích lũy/đăng ký trong học kỳ tương ứng"},
                    {"Rớt Môn", "Tùy chọn", "Khong / Co (hoặc true/false/1/0)", "Xác định sinh viên có học phần bị rớt/nợ môn hay không"}
            };

            Font guideHeaderFont = workbook.createFont();
            guideHeaderFont.setBold(true);
            guideHeaderFont.setColor(IndexedColors.WHITE.getIndex());
            CellStyle guideHeaderStyle = workbook.createCellStyle();
            guideHeaderStyle.setFont(guideHeaderFont);
            guideHeaderStyle.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
            guideHeaderStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
            guideHeaderStyle.setAlignment(HorizontalAlignment.CENTER);
            guideHeaderStyle.setBorderTop(BorderStyle.THIN);
            guideHeaderStyle.setBorderBottom(BorderStyle.THIN);
            guideHeaderStyle.setBorderLeft(BorderStyle.THIN);
            guideHeaderStyle.setBorderRight(BorderStyle.THIN);

            for (int r = 0; r < guideDetails.length; r++) {
                Row row = guideSheet.createRow(r + 2);
                row.setHeightInPoints(22);
                for (int c = 0; c < guideDetails[r].length; c++) {
                    Cell cell = row.createCell(c);
                    cell.setCellValue(guideDetails[r][c]);
                    if (r == 0) {
                        cell.setCellStyle(guideHeaderStyle);
                    } else {
                        cell.setCellStyle(dataStyleLeft);
                    }
                }
            }

            for (int i = 0; i < 4; i++) {
                guideSheet.autoSizeColumn(i);
                guideSheet.setColumnWidth(i, Math.max(guideSheet.getColumnWidth(i) + 1200, 5000));
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (IOException e) {
            throw new RuntimeException("Lỗi tạo file Excel mẫu: " + e.getMessage(), e);
        }
    }

    private String generateCccd(String mssv) {
        String digits = (mssv != null ? mssv : "").replaceAll("\\D", "");
        if (digits.length() == 12) {
            return digits;
        }
        if (digits.length() > 12) {
            return digits.substring(0, 12);
        }
        if (digits.length() == 10) {
            return "07" + digits;
        }
        String padded = String.format("%9s", digits).replace(' ', '0');
        if (padded.length() > 9) {
            padded = padded.substring(padded.length() - 9);
        }
        return "079" + padded;
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
