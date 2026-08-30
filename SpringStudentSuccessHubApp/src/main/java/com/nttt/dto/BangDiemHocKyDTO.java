package com.nttt.dto;

import java.math.BigDecimal;
import java.util.List;

public class BangDiemHocKyDTO {
    private String mssv;
    private String hoTen;
    private String tenLop;
    private String tenNganh;
    private String heDaoTao;
    private String maHocKy;
    private String tenHocKy;
    private Integer tongSoTinChi;
    private BigDecimal diemTrungBinhHocKy10;
    private BigDecimal gpaHe4;
    private BigDecimal tongHocPhiHocKy;
    private Boolean coHocPhanRot;
    private List<DiemHocPhanDTO> danhSachDiemMonHoc;

    public BangDiemHocKyDTO() {}

    public BangDiemHocKyDTO(String mssv, String hoTen, String tenLop, String tenNganh, String heDaoTao, String maHocKy, String tenHocKy, Integer tongSoTinChi, BigDecimal diemTrungBinhHocKy10, BigDecimal gpaHe4, BigDecimal tongHocPhiHocKy, Boolean coHocPhanRot, List<DiemHocPhanDTO> danhSachDiemMonHoc) {
        this.mssv = mssv;
        this.hoTen = hoTen;
        this.tenLop = tenLop;
        this.tenNganh = tenNganh;
        this.heDaoTao = heDaoTao;
        this.maHocKy = maHocKy;
        this.tenHocKy = tenHocKy;
        this.tongSoTinChi = tongSoTinChi;
        this.diemTrungBinhHocKy10 = diemTrungBinhHocKy10;
        this.gpaHe4 = gpaHe4;
        this.tongHocPhiHocKy = tongHocPhiHocKy;
        this.coHocPhanRot = coHocPhanRot;
        this.danhSachDiemMonHoc = danhSachDiemMonHoc;
    }

    public String getMssv() { return mssv; }
    public void setMssv(String mssv) { this.mssv = mssv; }

    public String getHoTen() { return hoTen; }
    public void setHoTen(String hoTen) { this.hoTen = hoTen; }

    public String getTenLop() { return tenLop; }
    public void setTenLop(String tenLop) { this.tenLop = tenLop; }

    public String getTenNganh() { return tenNganh; }
    public void setTenNganh(String tenNganh) { this.tenNganh = tenNganh; }

    public String getHeDaoTao() { return heDaoTao; }
    public void setHeDaoTao(String heDaoTao) { this.heDaoTao = heDaoTao; }

    public String getMaHocKy() { return maHocKy; }
    public void setMaHocKy(String maHocKy) { this.maHocKy = maHocKy; }

    public String getTenHocKy() { return tenHocKy; }
    public void setTenHocKy(String tenHocKy) { this.tenHocKy = tenHocKy; }

    public Integer getTongSoTinChi() { return tongSoTinChi; }
    public void setTongSoTinChi(Integer tongSoTinChi) { this.tongSoTinChi = tongSoTinChi; }

    public BigDecimal getDiemTrungBinhHocKy10() { return diemTrungBinhHocKy10; }
    public void setDiemTrungBinhHocKy10(BigDecimal diemTrungBinhHocKy10) { this.diemTrungBinhHocKy10 = diemTrungBinhHocKy10; }

    public BigDecimal getGpaHe4() { return gpaHe4; }
    public void setGpaHe4(BigDecimal gpaHe4) { this.gpaHe4 = gpaHe4; }

    public BigDecimal getTongHocPhiHocKy() { return tongHocPhiHocKy; }
    public void setTongHocPhiHocKy(BigDecimal tongHocPhiHocKy) { this.tongHocPhiHocKy = tongHocPhiHocKy; }

    public Boolean getCoHocPhanRot() { return coHocPhanRot; }
    public void setCoHocPhanRot(Boolean coHocPhanRot) { this.coHocPhanRot = coHocPhanRot; }

    public List<DiemHocPhanDTO> getDanhSachDiemMonHoc() { return danhSachDiemMonHoc; }
    public void setDanhSachDiemMonHoc(List<DiemHocPhanDTO> danhSachDiemMonHoc) { this.danhSachDiemMonHoc = danhSachDiemMonHoc; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String mssv;
        private String hoTen;
        private String tenLop;
        private String tenNganh;
        private String heDaoTao;
        private String maHocKy;
        private String tenHocKy;
        private Integer tongSoTinChi;
        private BigDecimal diemTrungBinhHocKy10;
        private BigDecimal gpaHe4;
        private BigDecimal tongHocPhiHocKy;
        private Boolean coHocPhanRot;
        private List<DiemHocPhanDTO> danhSachDiemMonHoc;

        public Builder mssv(String mssv) { this.mssv = mssv; return this; }
        public Builder hoTen(String hoTen) { this.hoTen = hoTen; return this; }
        public Builder tenLop(String tenLop) { this.tenLop = tenLop; return this; }
        public Builder tenNganh(String tenNganh) { this.tenNganh = tenNganh; return this; }
        public Builder heDaoTao(String heDaoTao) { this.heDaoTao = heDaoTao; return this; }
        public Builder maHocKy(String maHocKy) { this.maHocKy = maHocKy; return this; }
        public Builder tenHocKy(String tenHocKy) { this.tenHocKy = tenHocKy; return this; }
        public Builder tongSoTinChi(Integer tongSoTinChi) { this.tongSoTinChi = tongSoTinChi; return this; }
        public Builder diemTrungBinhHocKy10(BigDecimal diemTrungBinhHocKy10) { this.diemTrungBinhHocKy10 = diemTrungBinhHocKy10; return this; }
        public Builder gpaHe4(BigDecimal gpaHe4) { this.gpaHe4 = gpaHe4; return this; }
        public Builder tongHocPhiHocKy(BigDecimal tongHocPhiHocKy) { this.tongHocPhiHocKy = tongHocPhiHocKy; return this; }
        public Builder coHocPhanRot(Boolean coHocPhanRot) { this.coHocPhanRot = coHocPhanRot; return this; }
        public Builder danhSachDiemMonHoc(List<DiemHocPhanDTO> danhSachDiemMonHoc) { this.danhSachDiemMonHoc = danhSachDiemMonHoc; return this; }

        public BangDiemHocKyDTO build() {
            return new BangDiemHocKyDTO(mssv, hoTen, tenLop, tenNganh, heDaoTao, maHocKy, tenHocKy, tongSoTinChi, diemTrungBinhHocKy10, gpaHe4, tongHocPhiHocKy, coHocPhanRot, danhSachDiemMonHoc);
        }
    }
}
