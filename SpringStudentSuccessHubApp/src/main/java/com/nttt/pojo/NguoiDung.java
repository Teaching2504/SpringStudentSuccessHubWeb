package com.nttt.pojo;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "nguoidung")
public class NguoiDung {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "tenDangNhap", nullable = false, unique = true, length = 100)
    private String tenDangNhap;

    @Column(name = "matKhau", nullable = false, length = 255)
    private String matKhau;

    @Column(name = "hoTen", nullable = false, length = 150)
    private String hoTen;

    @Column(name = "email", length = 150)
    private String email;

    @Column(name = "soDienThoai", length = 20)
    private String soDienThoai;

    @Column(name = "vaiTro", nullable = false, length = 50)
    private String vaiTro; // ROLE_ADMIN, ROLE_CAN_BO_TRUONG, ROLE_CAN_BO_KHOA, ROLE_SINH_VIEN

    @Column(name = "trangThai", length = 50)
    private String trangThai; // HOAT_DONG, BI_KHOA

    @Column(name = "ngayTao")
    private LocalDateTime ngayTao;

    public NguoiDung() {}

    public NguoiDung(Long id, String tenDangNhap, String matKhau, String hoTen, String email, String soDienThoai, String vaiTro, String trangThai, LocalDateTime ngayTao) {
        this.id = id;
        this.tenDangNhap = tenDangNhap;
        this.matKhau = matKhau;
        this.hoTen = hoTen;
        this.email = email;
        this.soDienThoai = soDienThoai;
        this.vaiTro = vaiTro;
        this.trangThai = trangThai;
        this.ngayTao = ngayTao;
    }

    @PrePersist
    public void prePersist() {
        if (this.ngayTao == null) {
            this.ngayTao = LocalDateTime.now();
        }
        if (this.trangThai == null) {
            this.trangThai = "HOAT_DONG";
        }
    }

    // Getters and Setters
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

        public Builder id(Long id) { this.id = id; return this; }
        public Builder tenDangNhap(String tenDangNhap) { this.tenDangNhap = tenDangNhap; return this; }
        public Builder matKhau(String matKhau) { this.matKhau = matKhau; return this; }
        public Builder hoTen(String hoTen) { this.hoTen = hoTen; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder soDienThoai(String soDienThoai) { this.soDienThoai = soDienThoai; return this; }
        public Builder vaiTro(String vaiTro) { this.vaiTro = vaiTro; return this; }
        public Builder trangThai(String trangThai) { this.trangThai = trangThai; return this; }
        public Builder ngayTao(LocalDateTime ngayTao) { this.ngayTao = ngayTao; return this; }

        public NguoiDung build() {
            return new NguoiDung(id, tenDangNhap, matKhau, hoTen, email, soDienThoai, vaiTro, trangThai, ngayTao);
        }
    }
}
