package com.nttt.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class MinhChungRenLuyenDTO {
    private String maMinhChung;
    private String tenHoatDong;
    private BigDecimal diemDeXuat;
    private String fileUrl;
    private String moTa;
    private String trangThai; // CHO_DUYET, DA_DUYET, TU_CHOI
    private String mssv;
    private String hoTenSinhVien;
    private String maLop;
    private String maKhoa;
    private String tenKhoa;
    private String maHocKy;
    private String maHoSo;
    private String maNvPheDuyet;
    private String hoTenNhanVien;
    private String lyDoPhanHoi;
    private LocalDate ngayTao;

    public MinhChungRenLuyenDTO() {}

    public MinhChungRenLuyenDTO(String maMinhChung, String tenHoatDong, BigDecimal diemDeXuat, String fileUrl, String moTa, String trangThai, String mssv, String hoTenSinhVien, String maLop, String maKhoa, String tenKhoa, String maHocKy, String maHoSo, String maNvPheDuyet, String hoTenNhanVien, String lyDoPhanHoi, LocalDate ngayTao) {
        this.maMinhChung = maMinhChung;
        this.tenHoatDong = tenHoatDong;
        this.diemDeXuat = diemDeXuat;
        this.fileUrl = fileUrl;
        this.moTa = moTa;
        this.trangThai = trangThai;
        this.mssv = mssv;
        this.hoTenSinhVien = hoTenSinhVien;
        this.maLop = maLop;
        this.maKhoa = maKhoa;
        this.tenKhoa = tenKhoa;
        this.maHocKy = maHocKy;
        this.maHoSo = maHoSo;
        this.maNvPheDuyet = maNvPheDuyet;
        this.hoTenNhanVien = hoTenNhanVien;
        this.lyDoPhanHoi = lyDoPhanHoi;
        this.ngayTao = ngayTao;
    }

    public String getMaMinhChung() { return maMinhChung; }
    public void setMaMinhChung(String maMinhChung) { this.maMinhChung = maMinhChung; }

    public String getTenHoatDong() { return tenHoatDong; }
    public void setTenHoatDong(String tenHoatDong) { this.tenHoatDong = tenHoatDong; }

    public BigDecimal getDiemDeXuat() { return diemDeXuat; }
    public void setDiemDeXuat(BigDecimal diemDeXuat) { this.diemDeXuat = diemDeXuat; }

    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }

    public String getMoTa() { return moTa; }
    public void setMoTa(String moTa) { this.moTa = moTa; }

    public String getTrangThai() { return trangThai; }
    public void setTrangThai(String trangThai) { this.trangThai = trangThai; }

    public String getMssv() { return mssv; }
    public void setMssv(String mssv) { this.mssv = mssv; }

    public String getHoTenSinhVien() { return hoTenSinhVien; }
    public void setHoTenSinhVien(String hoTenSinhVien) { this.hoTenSinhVien = hoTenSinhVien; }

    public String getMaLop() { return maLop; }
    public void setMaLop(String maLop) { this.maLop = maLop; }

    public String getMaKhoa() { return maKhoa; }
    public void setMaKhoa(String maKhoa) { this.maKhoa = maKhoa; }

    public String getTenKhoa() { return tenKhoa; }
    public void setTenKhoa(String tenKhoa) { this.tenKhoa = tenKhoa; }

    public String getMaHocKy() { return maHocKy; }
    public void setMaHocKy(String maHocKy) { this.maHocKy = maHocKy; }

    public String getMaHoSo() { return maHoSo; }
    public void setMaHoSo(String maHoSo) { this.maHoSo = maHoSo; }

    public String getMaNvPheDuyet() { return maNvPheDuyet; }
    public void setMaNvPheDuyet(String maNvPheDuyet) { this.maNvPheDuyet = maNvPheDuyet; }

    public String getHoTenNhanVien() { return hoTenNhanVien; }
    public void setHoTenNhanVien(String hoTenNhanVien) { this.hoTenNhanVien = hoTenNhanVien; }

    public String getLyDoPhanHoi() { return lyDoPhanHoi; }
    public void setLyDoPhanHoi(String lyDoPhanHoi) { this.lyDoPhanHoi = lyDoPhanHoi; }

    public LocalDate getNgayTao() { return ngayTao; }
    public void setNgayTao(LocalDate ngayTao) { this.ngayTao = ngayTao; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String maMinhChung;
        private String tenHoatDong;
        private BigDecimal diemDeXuat;
        private String fileUrl;
        private String moTa;
        private String trangThai;
        private String mssv;
        private String hoTenSinhVien;
        private String maLop;
        private String maKhoa;
        private String tenKhoa;
        private String maHocKy;
        private String maHoSo;
        private String maNvPheDuyet;
        private String hoTenNhanVien;
        private String lyDoPhanHoi;
        private LocalDate ngayTao;

        public Builder maMinhChung(String maMinhChung) { this.maMinhChung = maMinhChung; return this; }
        public Builder tenHoatDong(String tenHoatDong) { this.tenHoatDong = tenHoatDong; return this; }
        public Builder diemDeXuat(BigDecimal diemDeXuat) { this.diemDeXuat = diemDeXuat; return this; }
        public Builder fileUrl(String fileUrl) { this.fileUrl = fileUrl; return this; }
        public Builder moTa(String moTa) { this.moTa = moTa; return this; }
        public Builder trangThai(String trangThai) { this.trangThai = trangThai; return this; }
        public Builder mssv(String mssv) { this.mssv = mssv; return this; }
        public Builder hoTenSinhVien(String hoTenSinhVien) { this.hoTenSinhVien = hoTenSinhVien; return this; }
        public Builder maLop(String maLop) { this.maLop = maLop; return this; }
        public Builder maKhoa(String maKhoa) { this.maKhoa = maKhoa; return this; }
        public Builder tenKhoa(String tenKhoa) { this.tenKhoa = tenKhoa; return this; }
        public Builder maHocKy(String maHocKy) { this.maHocKy = maHocKy; return this; }
        public Builder maHoSo(String maHoSo) { this.maHoSo = maHoSo; return this; }
        public Builder maNvPheDuyet(String maNvPheDuyet) { this.maNvPheDuyet = maNvPheDuyet; return this; }
        public Builder hoTenNhanVien(String hoTenNhanVien) { this.hoTenNhanVien = hoTenNhanVien; return this; }
        public Builder lyDoPhanHoi(String lyDoPhanHoi) { this.lyDoPhanHoi = lyDoPhanHoi; return this; }
        public Builder ngayTao(LocalDate ngayTao) { this.ngayTao = ngayTao; return this; }

        public MinhChungRenLuyenDTO build() {
            return new MinhChungRenLuyenDTO(maMinhChung, tenHoatDong, diemDeXuat, fileUrl, moTa, trangThai, mssv, hoTenSinhVien, maLop, maKhoa, tenKhoa, maHocKy, maHoSo, maNvPheDuyet, hoTenNhanVien, lyDoPhanHoi, ngayTao);
        }
    }
}
