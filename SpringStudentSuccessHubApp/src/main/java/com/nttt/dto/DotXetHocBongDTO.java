package com.nttt.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class DotXetHocBongDTO {
    private String maDot;
    private String tenDot;
    private LocalDate ngayBatDau;
    private LocalDate ngayKetThuc;
    private String maHocKy;
    private String namHoc;
    private String tenHocKy;
    private String trangThai; // DANG_MO, DANG_XET_DUYET, DA_CONG_BO, DONG

    private QuyTacHocBongDTO quyTacHienHanh;
    private List<DotXetHbKhoaDTO> danhSachKhoa;
    private Integer tongChiTieu;
    private BigDecimal tongNganSach;
    private Integer tongHoSoDaXet;

    public DotXetHocBongDTO() {}

    public DotXetHocBongDTO(String maDot, String tenDot, LocalDate ngayBatDau, LocalDate ngayKetThuc, String maHocKy, String namHoc, String tenHocKy, String trangThai, QuyTacHocBongDTO quyTacHienHanh, List<DotXetHbKhoaDTO> danhSachKhoa, Integer tongChiTieu, BigDecimal tongNganSach, Integer tongHoSoDaXet) {
        this.maDot = maDot;
        this.tenDot = tenDot;
        this.ngayBatDau = ngayBatDau;
        this.ngayKetThuc = ngayKetThuc;
        this.maHocKy = maHocKy;
        this.namHoc = namHoc;
        this.tenHocKy = tenHocKy;
        this.trangThai = trangThai;
        this.quyTacHienHanh = quyTacHienHanh;
        this.danhSachKhoa = danhSachKhoa;
        this.tongChiTieu = tongChiTieu;
        this.tongNganSach = tongNganSach;
        this.tongHoSoDaXet = tongHoSoDaXet;
    }

    public String getMaDot() { return maDot; }
    public void setMaDot(String maDot) { this.maDot = maDot; }

    public String getTenDot() { return tenDot; }
    public void setTenDot(String tenDot) { this.tenDot = tenDot; }

    public LocalDate getNgayBatDau() { return ngayBatDau; }
    public void setNgayBatDau(LocalDate ngayBatDau) { this.ngayBatDau = ngayBatDau; }

    public LocalDate getNgayKetThuc() { return ngayKetThuc; }
    public void setNgayKetThuc(LocalDate ngayKetThuc) { this.ngayKetThuc = ngayKetThuc; }

    public String getMaHocKy() { return maHocKy; }
    public void setMaHocKy(String maHocKy) { this.maHocKy = maHocKy; }

    public String getNamHoc() { return namHoc; }
    public void setNamHoc(String namHoc) { this.namHoc = namHoc; }

    public String getTenHocKy() { return tenHocKy; }
    public void setTenHocKy(String tenHocKy) { this.tenHocKy = tenHocKy; }

    public String getTrangThai() { return trangThai; }
    public void setTrangThai(String trangThai) { this.trangThai = trangThai; }

    public QuyTacHocBongDTO getQuyTacHienHanh() { return quyTacHienHanh; }
    public void setQuyTacHienHanh(QuyTacHocBongDTO quyTacHienHanh) { this.quyTacHienHanh = quyTacHienHanh; }

    public List<DotXetHbKhoaDTO> getDanhSachKhoa() { return danhSachKhoa; }
    public void setDanhSachKhoa(List<DotXetHbKhoaDTO> danhSachKhoa) { this.danhSachKhoa = danhSachKhoa; }

    public Integer getTongChiTieu() { return tongChiTieu; }
    public void setTongChiTieu(Integer tongChiTieu) { this.tongChiTieu = tongChiTieu; }

    public BigDecimal getTongNganSach() { return tongNganSach; }
    public void setTongNganSach(BigDecimal tongNganSach) { this.tongNganSach = tongNganSach; }

    public Integer getTongHoSoDaXet() { return tongHoSoDaXet; }
    public void setTongHoSoDaXet(Integer tongHoSoDaXet) { this.tongHoSoDaXet = tongHoSoDaXet; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String maDot;
        private String tenDot;
        private LocalDate ngayBatDau;
        private LocalDate ngayKetThuc;
        private String maHocKy;
        private String namHoc;
        private String tenHocKy;
        private String trangThai;
        private QuyTacHocBongDTO quyTacHienHanh;
        private List<DotXetHbKhoaDTO> danhSachKhoa;
        private Integer tongChiTieu;
        private BigDecimal tongNganSach;
        private Integer tongHoSoDaXet;

        public Builder maDot(String maDot) { this.maDot = maDot; return this; }
        public Builder tenDot(String tenDot) { this.tenDot = tenDot; return this; }
        public Builder ngayBatDau(LocalDate ngayBatDau) { this.ngayBatDau = ngayBatDau; return this; }
        public Builder ngayKetThuc(LocalDate ngayKetThuc) { this.ngayKetThuc = ngayKetThuc; return this; }
        public Builder maHocKy(String maHocKy) { this.maHocKy = maHocKy; return this; }
        public Builder namHoc(String namHoc) { this.namHoc = namHoc; return this; }
        public Builder tenHocKy(String tenHocKy) { this.tenHocKy = tenHocKy; return this; }
        public Builder trangThai(String trangThai) { this.trangThai = trangThai; return this; }
        public Builder quyTacHienHanh(QuyTacHocBongDTO quyTacHienHanh) { this.quyTacHienHanh = quyTacHienHanh; return this; }
        public Builder danhSachKhoa(List<DotXetHbKhoaDTO> danhSachKhoa) { this.danhSachKhoa = danhSachKhoa; return this; }
        public Builder tongChiTieu(Integer tongChiTieu) { this.tongChiTieu = tongChiTieu; return this; }
        public Builder tongNganSach(BigDecimal tongNganSach) { this.tongNganSach = tongNganSach; return this; }
        public Builder tongHoSoDaXet(Integer tongHoSoDaXet) { this.tongHoSoDaXet = tongHoSoDaXet; return this; }

        public DotXetHocBongDTO build() {
            return new DotXetHocBongDTO(maDot, tenDot, ngayBatDau, ngayKetThuc, maHocKy, namHoc, tenHocKy, trangThai, quyTacHienHanh, danhSachKhoa, tongChiTieu, tongNganSach, tongHoSoDaXet);
        }
    }
}
