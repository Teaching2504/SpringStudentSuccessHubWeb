package com.nttt.dto;

import java.math.BigDecimal;

public class DiemHocPhanDTO {
    private String id;
    private String mssv;
    private String hoTen;
    private String maMon;
    private String tenMon;
    private String maHocKy;
    private String tenHocKy;
    private BigDecimal diemChuyenCan;
    private BigDecimal diemGiuaKy;
    private BigDecimal diemCuoiKy;
    private BigDecimal diemTongKet10;
    private BigDecimal diemHe4;
    private String diemChu;
    private Integer soTinChi;
    private BigDecimal hocPhiMon;
    private Boolean dat;

    public DiemHocPhanDTO() {}

    public DiemHocPhanDTO(String id, String mssv, String hoTen, String maMon, String tenMon, String maHocKy, String tenHocKy, BigDecimal diemChuyenCan, BigDecimal diemGiuaKy, BigDecimal diemCuoiKy, BigDecimal diemTongKet10, BigDecimal diemHe4, String diemChu, Integer soTinChi, BigDecimal hocPhiMon, Boolean dat) {
        this.id = id;
        this.mssv = mssv;
        this.hoTen = hoTen;
        this.maMon = maMon;
        this.tenMon = tenMon;
        this.maHocKy = maHocKy;
        this.tenHocKy = tenHocKy;
        this.diemChuyenCan = diemChuyenCan;
        this.diemGiuaKy = diemGiuaKy;
        this.diemCuoiKy = diemCuoiKy;
        this.diemTongKet10 = diemTongKet10;
        this.diemHe4 = diemHe4;
        this.diemChu = diemChu;
        this.soTinChi = soTinChi;
        this.hocPhiMon = hocPhiMon;
        this.dat = dat;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getMssv() { return mssv; }
    public void setMssv(String mssv) { this.mssv = mssv; }

    public String getHoTen() { return hoTen; }
    public void setHoTen(String hoTen) { this.hoTen = hoTen; }

    public String getMaMon() { return maMon; }
    public void setMaMon(String maMon) { this.maMon = maMon; }

    public String getTenMon() { return tenMon; }
    public void setTenMon(String tenMon) { this.tenMon = tenMon; }

    public String getMaHocKy() { return maHocKy; }
    public void setMaHocKy(String maHocKy) { this.maHocKy = maHocKy; }

    public String getTenHocKy() { return tenHocKy; }
    public void setTenHocKy(String tenHocKy) { this.tenHocKy = tenHocKy; }

    public BigDecimal getDiemChuyenCan() { return diemChuyenCan; }
    public void setDiemChuyenCan(BigDecimal diemChuyenCan) { this.diemChuyenCan = diemChuyenCan; }

    public BigDecimal getDiemGiuaKy() { return diemGiuaKy; }
    public void setDiemGiuaKy(BigDecimal diemGiuaKy) { this.diemGiuaKy = diemGiuaKy; }

    public BigDecimal getDiemCuoiKy() { return diemCuoiKy; }
    public void setDiemCuoiKy(BigDecimal diemCuoiKy) { this.diemCuoiKy = diemCuoiKy; }

    public BigDecimal getDiemTongKet10() { return diemTongKet10; }
    public void setDiemTongKet10(BigDecimal diemTongKet10) { this.diemTongKet10 = diemTongKet10; }

    public BigDecimal getDiemHe4() { return diemHe4; }
    public void setDiemHe4(BigDecimal diemHe4) { this.diemHe4 = diemHe4; }

    public String getDiemChu() { return diemChu; }
    public void setDiemChu(String diemChu) { this.diemChu = diemChu; }

    public Integer getSoTinChi() { return soTinChi; }
    public void setSoTinChi(Integer soTinChi) { this.soTinChi = soTinChi; }

    public BigDecimal getHocPhiMon() { return hocPhiMon; }
    public void setHocPhiMon(BigDecimal hocPhiMon) { this.hocPhiMon = hocPhiMon; }

    public Boolean getDat() { return dat; }
    public void setDat(Boolean dat) { this.dat = dat; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String id;
        private String mssv;
        private String hoTen;
        private String maMon;
        private String tenMon;
        private String maHocKy;
        private String tenHocKy;
        private BigDecimal diemChuyenCan;
        private BigDecimal diemGiuaKy;
        private BigDecimal diemCuoiKy;
        private BigDecimal diemTongKet10;
        private BigDecimal diemHe4;
        private String diemChu;
        private Integer soTinChi;
        private BigDecimal hocPhiMon;
        private Boolean dat;

        public Builder id(String id) { this.id = id; return this; }
        public Builder mssv(String mssv) { this.mssv = mssv; return this; }
        public Builder hoTen(String hoTen) { this.hoTen = hoTen; return this; }
        public Builder maMon(String maMon) { this.maMon = maMon; return this; }
        public Builder tenMon(String tenMon) { this.tenMon = tenMon; return this; }
        public Builder maHocKy(String maHocKy) { this.maHocKy = maHocKy; return this; }
        public Builder tenHocKy(String tenHocKy) { this.tenHocKy = tenHocKy; return this; }
        public Builder diemChuyenCan(BigDecimal diemChuyenCan) { this.diemChuyenCan = diemChuyenCan; return this; }
        public Builder diemGiuaKy(BigDecimal diemGiuaKy) { this.diemGiuaKy = diemGiuaKy; return this; }
        public Builder diemCuoiKy(BigDecimal diemCuoiKy) { this.diemCuoiKy = diemCuoiKy; return this; }
        public Builder diemTongKet10(BigDecimal diemTongKet10) { this.diemTongKet10 = diemTongKet10; return this; }
        public Builder diemHe4(BigDecimal diemHe4) { this.diemHe4 = diemHe4; return this; }
        public Builder diemChu(String diemChu) { this.diemChu = diemChu; return this; }
        public Builder soTinChi(Integer soTinChi) { this.soTinChi = soTinChi; return this; }
        public Builder hocPhiMon(BigDecimal hocPhiMon) { this.hocPhiMon = hocPhiMon; return this; }
        public Builder dat(Boolean dat) { this.dat = dat; return this; }

        public DiemHocPhanDTO build() {
            return new DiemHocPhanDTO(id, mssv, hoTen, maMon, tenMon, maHocKy, tenHocKy, diemChuyenCan, diemGiuaKy, diemCuoiKy, diemTongKet10, diemHe4, diemChu, soTinChi, hocPhiMon, dat);
        }
    }
}
