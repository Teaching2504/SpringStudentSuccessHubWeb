package com.nttt.dto;

import java.math.BigDecimal;

public class MonHocDTO {
    private String maMon;
    private String tenMon;
    private Integer soTinChi;
    private Integer soTietLyThuyet;
    private Integer soTietThucHanh;
    private BigDecimal donGiaTinChi;
    private String maKhoa;
    private String tenKhoa;

    public MonHocDTO() {}

    public MonHocDTO(String maMon, String tenMon, Integer soTinChi, Integer soTietLyThuyet, Integer soTietThucHanh, BigDecimal donGiaTinChi, String maKhoa, String tenKhoa) {
        this.maMon = maMon;
        this.tenMon = tenMon;
        this.soTinChi = soTinChi;
        this.soTietLyThuyet = soTietLyThuyet;
        this.soTietThucHanh = soTietThucHanh;
        this.donGiaTinChi = donGiaTinChi;
        this.maKhoa = maKhoa;
        this.tenKhoa = tenKhoa;
    }

    public String getMaMon() { return maMon; }
    public void setMaMon(String maMon) { this.maMon = maMon; }

    public String getTenMon() { return tenMon; }
    public void setTenMon(String tenMon) { this.tenMon = tenMon; }

    public Integer getSoTinChi() { return soTinChi; }
    public void setSoTinChi(Integer soTinChi) { this.soTinChi = soTinChi; }

    public Integer getSoTietLyThuyet() { return soTietLyThuyet; }
    public void setSoTietLyThuyet(Integer soTietLyThuyet) { this.soTietLyThuyet = soTietLyThuyet; }

    public Integer getSoTietThucHanh() { return soTietThucHanh; }
    public void setSoTietThucHanh(Integer soTietThucHanh) { this.soTietThucHanh = soTietThucHanh; }

    public BigDecimal getDonGiaTinChi() { return donGiaTinChi; }
    public void setDonGiaTinChi(BigDecimal donGiaTinChi) { this.donGiaTinChi = donGiaTinChi; }

    public String getMaKhoa() { return maKhoa; }
    public void setMaKhoa(String maKhoa) { this.maKhoa = maKhoa; }

    public String getTenKhoa() { return tenKhoa; }
    public void setTenKhoa(String tenKhoa) { this.tenKhoa = tenKhoa; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String maMon;
        private String tenMon;
        private Integer soTinChi;
        private Integer soTietLyThuyet;
        private Integer soTietThucHanh;
        private BigDecimal donGiaTinChi;
        private String maKhoa;
        private String tenKhoa;

        public Builder maMon(String maMon) { this.maMon = maMon; return this; }
        public Builder tenMon(String tenMon) { this.tenMon = tenMon; return this; }
        public Builder soTinChi(Integer soTinChi) { this.soTinChi = soTinChi; return this; }
        public Builder soTietLyThuyet(Integer soTietLyThuyet) { this.soTietLyThuyet = soTietLyThuyet; return this; }
        public Builder soTietThucHanh(Integer soTietThucHanh) { this.soTietThucHanh = soTietThucHanh; return this; }
        public Builder donGiaTinChi(BigDecimal donGiaTinChi) { this.donGiaTinChi = donGiaTinChi; return this; }
        public Builder maKhoa(String maKhoa) { this.maKhoa = maKhoa; return this; }
        public Builder tenKhoa(String tenKhoa) { this.tenKhoa = tenKhoa; return this; }

        public MonHocDTO build() {
            return new MonHocDTO(maMon, tenMon, soTinChi, soTietLyThuyet, soTietThucHanh, donGiaTinChi, maKhoa, tenKhoa);
        }
    }
}
