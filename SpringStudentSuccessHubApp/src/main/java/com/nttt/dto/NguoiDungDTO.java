package com.nttt.dto;

import java.time.LocalDateTime;

public class NguoiDungDTO {
    private Long id;
    private String tenDangNhap;
    private String matKhau;
    private String hoTen;
    private String email;
    private String soDienThoai;
    private String vaiTro;
    private String trangThai;
    private LocalDateTime ngayTao;
    private String cccd;
    private String matKhauHienThi;

    public NguoiDungDTO() {}

    public NguoiDungDTO(Long id, String tenDangNhap, String matKhau, String hoTen, String email, String soDienThoai, String vaiTro, String trangThai, LocalDateTime ngayTao, String cccd, String matKhauHienThi) {
        this.id = id;
        this.tenDangNhap = tenDangNhap;
        this.matKhau = matKhau;
        this.hoTen = hoTen;
        this.email = email;
        this.soDienThoai = soDienThoai;
        this.vaiTro = vaiTro;
        this.trangThai = trangThai;
        this.ngayTao = ngayTao;
        this.cccd = cccd;
        this.matKhauHienThi = matKhauHienThi;
    }

    public String getMatKhauHienThi() { return matKhauHienThi; }
    public void setMatKhauHienThi(String matKhauHienThi) { this.matKhauHienThi = matKhauHienThi; }

    public String getCccd() { return cccd; }
    public void setCccd(String cccd) { this.cccd = cccd; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTenDangNhap() { return tenDangNhap; }
    public void setTenDangNhap(String tenDangNhap) { this.tenDangNhap = tenDangNhap; }

    public String getMatKhau() { return matKhau; }
    public void setMatKhau(String matKhau) { this.matKhau = matKhau; }

    public String getHoTen() { return hoTen; }
    public void setHoTen(String hoTen) { this.hoTen = hoTen; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSoDienThoai() { return soDienThoai; }
    public void setSoDienThoai(String soDienThoai) { this.soDienThoai = soDienThoai; }

    public String getVaiTro() { return vaiTro; }
    public void setVaiTro(String vaiTro) { this.vaiTro = vaiTro; }

    public String getTrangThai() { return trangThai; }
    public void setTrangThai(String trangThai) { this.trangThai = trangThai; }

    public LocalDateTime getNgayTao() { return ngayTao; }
    public void setNgayTao(LocalDateTime ngayTao) { this.ngayTao = ngayTao; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String tenDangNhap;
        private String matKhau;
        private String hoTen;
        private String email;
        private String soDienThoai;
        private String vaiTro;
        private String trangThai;
        private LocalDateTime ngayTao;
        private String cccd;
        private String matKhauHienThi;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder tenDangNhap(String tenDangNhap) { this.tenDangNhap = tenDangNhap; return this; }
        public Builder matKhau(String matKhau) { this.matKhau = matKhau; return this; }
        public Builder hoTen(String hoTen) { this.hoTen = hoTen; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder soDienThoai(String soDienThoai) { this.soDienThoai = soDienThoai; return this; }
        public Builder vaiTro(String vaiTro) { this.vaiTro = vaiTro; return this; }
        public Builder trangThai(String trangThai) { this.trangThai = trangThai; return this; }
        public Builder ngayTao(LocalDateTime ngayTao) { this.ngayTao = ngayTao; return this; }
        public Builder cccd(String cccd) { this.cccd = cccd; return this; }
        public Builder matKhauHienThi(String matKhauHienThi) { this.matKhauHienThi = matKhauHienThi; return this; }

        public NguoiDungDTO build() {
            return new NguoiDungDTO(id, tenDangNhap, matKhau, hoTen, email, soDienThoai, vaiTro, trangThai, ngayTao, cccd, matKhauHienThi);
        }
    }
}
