package com.nttt.pojo;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "monhoc")
public class MonHoc {

    @Id
    @Column(name = "maMon", length = 20)
    private String maMon;

    @Column(name = "tenMon", length = 150, nullable = false)
    private String tenMon;

    @Column(name = "soTinChi", nullable = false)
    private Integer soTinChi;

    @Column(name = "soTietLyThuyet")
    private Integer soTietLyThuyet;

    @Column(name = "soTietThucHanh")
    private Integer soTietThucHanh;

    @Column(name = "donGiaTinChi", precision = 12, scale = 2)
    private BigDecimal donGiaTinChi; // Mặc định: 650.000đ (Chuẩn) hoặc 1.450.000đ (CLC)

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "maKhoa")
    private Khoa khoa;

    public MonHoc() {}

    public MonHoc(String maMon, String tenMon, Integer soTinChi, Integer soTietLyThuyet, Integer soTietThucHanh, BigDecimal donGiaTinChi, Khoa khoa) {
        this.maMon = maMon;
        this.tenMon = tenMon;
        this.soTinChi = soTinChi;
        this.soTietLyThuyet = soTietLyThuyet;
        this.soTietThucHanh = soTietThucHanh;
        this.donGiaTinChi = donGiaTinChi;
        this.khoa = khoa;
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

    public Khoa getKhoa() { return khoa; }
    public void setKhoa(Khoa khoa) { this.khoa = khoa; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String maMon;
        private String tenMon;
        private Integer soTinChi;
        private Integer soTietLyThuyet;
        private Integer soTietThucHanh;
        private BigDecimal donGiaTinChi;
        private Khoa khoa;

        public Builder maMon(String maMon) { this.maMon = maMon; return this; }
        public Builder tenMon(String tenMon) { this.tenMon = tenMon; return this; }
        public Builder soTinChi(Integer soTinChi) { this.soTinChi = soTinChi; return this; }
        public Builder soTietLyThuyet(Integer soTietLyThuyet) { this.soTietLyThuyet = soTietLyThuyet; return this; }
        public Builder soTietThucHanh(Integer soTietThucHanh) { this.soTietThucHanh = soTietThucHanh; return this; }
        public Builder donGiaTinChi(BigDecimal donGiaTinChi) { this.donGiaTinChi = donGiaTinChi; return this; }
        public Builder khoa(Khoa khoa) { this.khoa = khoa; return this; }

        public MonHoc build() {
            return new MonHoc(maMon, tenMon, soTinChi, soTietLyThuyet, soTietThucHanh, donGiaTinChi, khoa);
        }
    }
}
