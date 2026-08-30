package com.nttt.dto;

import java.math.BigDecimal;

public class QuyTacHocBongDTO {
    private String maQuyTac;
    private String maDot;
    private String tenDot;
    private BigDecimal diemTbDuoiThieu;
    private BigDecimal diemRlToiThieu;
    private Integer soTinChiToiThieu;
    private Boolean khongNoMon;
    private Integer phienBan;
    private String ghiChu;
    private BigDecimal mucHocBongXuatSac;
    private BigDecimal mucHocBongGioi;
    private BigDecimal mucHocBongKha;

    public QuyTacHocBongDTO() {}

    public QuyTacHocBongDTO(String maQuyTac, String maDot, String tenDot, BigDecimal diemTbDuoiThieu, BigDecimal diemRlToiThieu, Integer soTinChiToiThieu, Boolean khongNoMon, Integer phienBan, String ghiChu, BigDecimal mucHocBongXuatSac, BigDecimal mucHocBongGioi, BigDecimal mucHocBongKha) {
        this.maQuyTac = maQuyTac;
        this.maDot = maDot;
        this.tenDot = tenDot;
        this.diemTbDuoiThieu = diemTbDuoiThieu;
        this.diemRlToiThieu = diemRlToiThieu;
        this.soTinChiToiThieu = soTinChiToiThieu;
        this.khongNoMon = khongNoMon;
        this.phienBan = phienBan;
        this.ghiChu = ghiChu;
        this.mucHocBongXuatSac = mucHocBongXuatSac;
        this.mucHocBongGioi = mucHocBongGioi;
        this.mucHocBongKha = mucHocBongKha;
    }

    public String getMaQuyTac() { return maQuyTac; }
    public void setMaQuyTac(String maQuyTac) { this.maQuyTac = maQuyTac; }

    public String getMaDot() { return maDot; }
    public void setMaDot(String maDot) { this.maDot = maDot; }

    public String getTenDot() { return tenDot; }
    public void setTenDot(String tenDot) { this.tenDot = tenDot; }

    public BigDecimal getDiemTbDuoiThieu() { return diemTbDuoiThieu; }
    public void setDiemTbDuoiThieu(BigDecimal diemTbDuoiThieu) { this.diemTbDuoiThieu = diemTbDuoiThieu; }

    public BigDecimal getDiemRlToiThieu() { return diemRlToiThieu; }
    public void setDiemRlToiThieu(BigDecimal diemRlToiThieu) { this.diemRlToiThieu = diemRlToiThieu; }

    public Integer getSoTinChiToiThieu() { return soTinChiToiThieu; }
    public void setSoTinChiToiThieu(Integer soTinChiToiThieu) { this.soTinChiToiThieu = soTinChiToiThieu; }

    public Boolean getKhongNoMon() { return khongNoMon; }
    public void setKhongNoMon(Boolean khongNoMon) { this.khongNoMon = khongNoMon; }

    public Integer getPhienBan() { return phienBan; }
    public void setPhienBan(Integer phienBan) { this.phienBan = phienBan; }

    public String getGhiChu() { return ghiChu; }
    public void setGhiChu(String ghiChu) { this.ghiChu = ghiChu; }

    public BigDecimal getMucHocBongXuatSac() { return mucHocBongXuatSac; }
    public void setMucHocBongXuatSac(BigDecimal mucHocBongXuatSac) { this.mucHocBongXuatSac = mucHocBongXuatSac; }

    public BigDecimal getMucHocBongGioi() { return mucHocBongGioi; }
    public void setMucHocBongGioi(BigDecimal mucHocBongGioi) { this.mucHocBongGioi = mucHocBongGioi; }

    public BigDecimal getMucHocBongKha() { return mucHocBongKha; }
    public void setMucHocBongKha(BigDecimal mucHocBongKha) { this.mucHocBongKha = mucHocBongKha; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String maQuyTac;
        private String maDot;
        private String tenDot;
        private BigDecimal diemTbDuoiThieu;
        private BigDecimal diemRlToiThieu;
        private Integer soTinChiToiThieu;
        private Boolean khongNoMon;
        private Integer phienBan;
        private String ghiChu;
        private BigDecimal mucHocBongXuatSac;
        private BigDecimal mucHocBongGioi;
        private BigDecimal mucHocBongKha;

        public Builder maQuyTac(String maQuyTac) { this.maQuyTac = maQuyTac; return this; }
        public Builder maDot(String maDot) { this.maDot = maDot; return this; }
        public Builder tenDot(String tenDot) { this.tenDot = tenDot; return this; }
        public Builder diemTbDuoiThieu(BigDecimal diemTbDuoiThieu) { this.diemTbDuoiThieu = diemTbDuoiThieu; return this; }
        public Builder diemRlToiThieu(BigDecimal diemRlToiThieu) { this.diemRlToiThieu = diemRlToiThieu; return this; }
        public Builder soTinChiToiThieu(Integer soTinChiToiThieu) { this.soTinChiToiThieu = soTinChiToiThieu; return this; }
        public Builder khongNoMon(Boolean khongNoMon) { this.khongNoMon = khongNoMon; return this; }
        public Builder phienBan(Integer phienBan) { this.phienBan = phienBan; return this; }
        public Builder ghiChu(String ghiChu) { this.ghiChu = ghiChu; return this; }
        public Builder mucHocBongXuatSac(BigDecimal mucHocBongXuatSac) { this.mucHocBongXuatSac = mucHocBongXuatSac; return this; }
        public Builder mucHocBongGioi(BigDecimal mucHocBongGioi) { this.mucHocBongGioi = mucHocBongGioi; return this; }
        public Builder mucHocBongKha(BigDecimal mucHocBongKha) { this.mucHocBongKha = mucHocBongKha; return this; }

        public QuyTacHocBongDTO build() {
            return new QuyTacHocBongDTO(maQuyTac, maDot, tenDot, diemTbDuoiThieu, diemRlToiThieu, soTinChiToiThieu, khongNoMon, phienBan, ghiChu, mucHocBongXuatSac, mucHocBongGioi, mucHocBongKha);
        }
    }
}
