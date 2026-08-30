package com.nttt.dto;

import java.math.BigDecimal;

public class ChuongTrinhDaoTaoDTO {
    private Long id;
    private String maNganh;
    private String tenNganh;
    private String maMon;
    private String tenMon;
    private Integer soTinChi;
    private Integer soTietLyThuyet;
    private Integer soTietThucHanh;
    private BigDecimal donGiaTinChi;
    private BigDecimal hocPhiDuKien;
    private Integer hocKyGoiY;
    private String loaiHocPhan;
    private String heDaoTao;

    public ChuongTrinhDaoTaoDTO() {}

    public ChuongTrinhDaoTaoDTO(Long id, String maNganh, String tenNganh, String maMon, String tenMon, Integer soTinChi, Integer soTietLyThuyet, Integer soTietThucHanh, BigDecimal donGiaTinChi, BigDecimal hocPhiDuKien, Integer hocKyGoiY, String loaiHocPhan, String heDaoTao) {
        this.id = id;
        this.maNganh = maNganh;
        this.tenNganh = tenNganh;
        this.maMon = maMon;
        this.tenMon = tenMon;
        this.soTinChi = soTinChi;
        this.soTietLyThuyet = soTietLyThuyet;
        this.soTietThucHanh = soTietThucHanh;
        this.donGiaTinChi = donGiaTinChi;
        this.hocPhiDuKien = hocPhiDuKien;
        this.hocKyGoiY = hocKyGoiY;
        this.loaiHocPhan = loaiHocPhan;
        this.heDaoTao = heDaoTao;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMaNganh() { return maNganh; }
    public void setMaNganh(String maNganh) { this.maNganh = maNganh; }

    public String getTenNganh() { return tenNganh; }
    public void setTenNganh(String tenNganh) { this.tenNganh = tenNganh; }

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

    public BigDecimal getHocPhiDuKien() { return hocPhiDuKien; }
    public void setHocPhiDuKien(BigDecimal hocPhiDuKien) { this.hocPhiDuKien = hocPhiDuKien; }

    public Integer getHocKyGoiY() { return hocKyGoiY; }
    public void setHocKyGoiY(Integer hocKyGoiY) { this.hocKyGoiY = hocKyGoiY; }

    public String getLoaiHocPhan() { return loaiHocPhan; }
    public void setLoaiHocPhan(String loaiHocPhan) { this.loaiHocPhan = loaiHocPhan; }

    public String getHeDaoTao() { return heDaoTao; }
    public void setHeDaoTao(String heDaoTao) { this.heDaoTao = heDaoTao; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String maNganh;
        private String tenNganh;
        private String maMon;
        private String tenMon;
        private Integer soTinChi;
        private Integer soTietLyThuyet;
        private Integer soTietThucHanh;
        private BigDecimal donGiaTinChi;
        private BigDecimal hocPhiDuKien;
        private Integer hocKyGoiY;
        private String loaiHocPhan;
        private String heDaoTao;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder maNganh(String maNganh) { this.maNganh = maNganh; return this; }
        public Builder tenNganh(String tenNganh) { this.tenNganh = tenNganh; return this; }
        public Builder maMon(String maMon) { this.maMon = maMon; return this; }
        public Builder tenMon(String tenMon) { this.tenMon = tenMon; return this; }
        public Builder soTinChi(Integer soTinChi) { this.soTinChi = soTinChi; return this; }
        public Builder soTietLyThuyet(Integer soTietLyThuyet) { this.soTietLyThuyet = soTietLyThuyet; return this; }
        public Builder soTietThucHanh(Integer soTietThucHanh) { this.soTietThucHanh = soTietThucHanh; return this; }
        public Builder donGiaTinChi(BigDecimal donGiaTinChi) { this.donGiaTinChi = donGiaTinChi; return this; }
        public Builder hocPhiDuKien(BigDecimal hocPhiDuKien) { this.hocPhiDuKien = hocPhiDuKien; return this; }
        public Builder hocKyGoiY(Integer hocKyGoiY) { this.hocKyGoiY = hocKyGoiY; return this; }
        public Builder loaiHocPhan(String loaiHocPhan) { this.loaiHocPhan = loaiHocPhan; return this; }
        public Builder heDaoTao(String heDaoTao) { this.heDaoTao = heDaoTao; return this; }

        public ChuongTrinhDaoTaoDTO build() {
            return new ChuongTrinhDaoTaoDTO(id, maNganh, tenNganh, maMon, tenMon, soTinChi, soTietLyThuyet, soTietThucHanh, donGiaTinChi, hocPhiDuKien, hocKyGoiY, loaiHocPhan, heDaoTao);
        }
    }
}
