package com.nttt.dto;

import java.time.LocalDate;

public class KienNghiDTO {
    private String maKienNghi;
    private String noiDung;
    private String tepMinhChung;
    private String trangThai; // CHO_XU_LY, DA_CHAP_NHAN, DA_TU_CHOI
    private String maDotXetHbKhoa;
    private String tenDot;
    private String maKhoa;
    private String tenKhoa;
    private String maHoSo;
    private String mssv;
    private String hoTenSinhVien;
    private String maLop;
    private String maNvXuLy;
    private String hoTenNhanVien;
    private String phanHoi;
    private LocalDate ngayGui;

    public KienNghiDTO() {}

    public KienNghiDTO(String maKienNghi, String noiDung, String tepMinhChung, String trangThai, String maDotXetHbKhoa, String tenDot, String maKhoa, String tenKhoa, String maHoSo, String mssv, String hoTenSinhVien, String maLop, String maNvXuLy, String hoTenNhanVien, String phanHoi, LocalDate ngayGui) {
        this.maKienNghi = maKienNghi;
        this.noiDung = noiDung;
        this.tepMinhChung = tepMinhChung;
        this.trangThai = trangThai;
        this.maDotXetHbKhoa = maDotXetHbKhoa;
        this.tenDot = tenDot;
        this.maKhoa = maKhoa;
        this.tenKhoa = tenKhoa;
        this.maHoSo = maHoSo;
        this.mssv = mssv;
        this.hoTenSinhVien = hoTenSinhVien;
        this.maLop = maLop;
        this.maNvXuLy = maNvXuLy;
        this.hoTenNhanVien = hoTenNhanVien;
        this.phanHoi = phanHoi;
        this.ngayGui = ngayGui;
    }

    public String getMaKienNghi() { return maKienNghi; }
    public void setMaKienNghi(String maKienNghi) { this.maKienNghi = maKienNghi; }

    public String getNoiDung() { return noiDung; }
    public void setNoiDung(String noiDung) { this.noiDung = noiDung; }

    public String getTepMinhChung() { return tepMinhChung; }
    public void setTepMinhChung(String tepMinhChung) { this.tepMinhChung = tepMinhChung; }

    public String getTrangThai() { return trangThai; }
    public void setTrangThai(String trangThai) { this.trangThai = trangThai; }

    public String getMaDotXetHbKhoa() { return maDotXetHbKhoa; }
    public void setMaDotXetHbKhoa(String maDotXetHbKhoa) { this.maDotXetHbKhoa = maDotXetHbKhoa; }

    public String getTenDot() { return tenDot; }
    public void setTenDot(String tenDot) { this.tenDot = tenDot; }

    public String getMaKhoa() { return maKhoa; }
    public void setMaKhoa(String maKhoa) { this.maKhoa = maKhoa; }

    public String getTenKhoa() { return tenKhoa; }
    public void setTenKhoa(String tenKhoa) { this.tenKhoa = tenKhoa; }

    public String getMaHoSo() { return maHoSo; }
    public void setMaHoSo(String maHoSo) { this.maHoSo = maHoSo; }

    public String getMssv() { return mssv; }
    public void setMssv(String mssv) { this.mssv = mssv; }

    public String getHoTenSinhVien() { return hoTenSinhVien; }
    public void setHoTenSinhVien(String hoTenSinhVien) { this.hoTenSinhVien = hoTenSinhVien; }

    public String getMaLop() { return maLop; }
    public void setMaLop(String maLop) { this.maLop = maLop; }

    public String getMaNvXuLy() { return maNvXuLy; }
    public void setMaNvXuLy(String maNvXuLy) { this.maNvXuLy = maNvXuLy; }

    public String getHoTenNhanVien() { return hoTenNhanVien; }
    public void setHoTenNhanVien(String hoTenNhanVien) { this.hoTenNhanVien = hoTenNhanVien; }

    public String getPhanHoi() { return phanHoi; }
    public void setPhanHoi(String phanHoi) { this.phanHoi = phanHoi; }

    public LocalDate getNgayGui() { return ngayGui; }
    public void setNgayGui(LocalDate ngayGui) { this.ngayGui = ngayGui; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String maKienNghi;
        private String noiDung;
        private String tepMinhChung;
        private String trangThai;
        private String maDotXetHbKhoa;
        private String tenDot;
        private String maKhoa;
        private String tenKhoa;
        private String maHoSo;
        private String mssv;
        private String hoTenSinhVien;
        private String maLop;
        private String maNvXuLy;
        private String hoTenNhanVien;
        private String phanHoi;
        private LocalDate ngayGui;

        public Builder maKienNghi(String maKienNghi) { this.maKienNghi = maKienNghi; return this; }
        public Builder noiDung(String noiDung) { this.noiDung = noiDung; return this; }
        public Builder tepMinhChung(String tepMinhChung) { this.tepMinhChung = tepMinhChung; return this; }
        public Builder trangThai(String trangThai) { this.trangThai = trangThai; return this; }
        public Builder maDotXetHbKhoa(String maDotXetHbKhoa) { this.maDotXetHbKhoa = maDotXetHbKhoa; return this; }
        public Builder tenDot(String tenDot) { this.tenDot = tenDot; return this; }
        public Builder maKhoa(String maKhoa) { this.maKhoa = maKhoa; return this; }
        public Builder tenKhoa(String tenKhoa) { this.tenKhoa = tenKhoa; return this; }
        public Builder maHoSo(String maHoSo) { this.maHoSo = maHoSo; return this; }
        public Builder mssv(String mssv) { this.mssv = mssv; return this; }
        public Builder hoTenSinhVien(String hoTenSinhVien) { this.hoTenSinhVien = hoTenSinhVien; return this; }
        public Builder maLop(String maLop) { this.maLop = maLop; return this; }
        public Builder maNvXuLy(String maNvXuLy) { this.maNvXuLy = maNvXuLy; return this; }
        public Builder hoTenNhanVien(String hoTenNhanVien) { this.hoTenNhanVien = hoTenNhanVien; return this; }
        public Builder phanHoi(String phanHoi) { this.phanHoi = phanHoi; return this; }
        public Builder ngayGui(LocalDate ngayGui) { this.ngayGui = ngayGui; return this; }

        public KienNghiDTO build() {
            return new KienNghiDTO(maKienNghi, noiDung, tepMinhChung, trangThai, maDotXetHbKhoa, tenDot, maKhoa, tenKhoa, maHoSo, mssv, hoTenSinhVien, maLop, maNvXuLy, hoTenNhanVien, phanHoi, ngayGui);
        }
    }
}
