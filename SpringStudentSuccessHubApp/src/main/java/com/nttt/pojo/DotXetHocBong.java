package com.nttt.pojo;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "dotxethocbong")
public class DotXetHocBong {

    @Id
    @Column(name = "maDot", length = 30)
    private String maDot;

    @Column(name = "tenDot", nullable = false, length = 200)
    private String tenDot;

    @Column(name = "ngayBatDau")
    private LocalDate ngayBatDau;

    @Column(name = "ngayKetThuc")
    private LocalDate ngayKetThuc;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "maHocKy")
    private HocKy hocKy;

    @Column(name = "trangThai", length = 50)
    private String trangThai; // DANG_MO, DANG_XET_DUYET, DA_CONG_BO, DONG

    public DotXetHocBong() {}

    public DotXetHocBong(String maDot, String tenDot, LocalDate ngayBatDau, LocalDate ngayKetThuc, HocKy hocKy, String trangThai) {
        this.maDot = maDot;
        this.tenDot = tenDot;
        this.ngayBatDau = ngayBatDau;
        this.ngayKetThuc = ngayKetThuc;
        this.hocKy = hocKy;
        this.trangThai = trangThai;
    }

    public String getMaDot() { return maDot; }
    public void setMaDot(String maDot) { this.maDot = maDot; }

    public String getTenDot() { return tenDot; }
    public void setTenDot(String tenDot) { this.tenDot = tenDot; }

    public LocalDate getNgayBatDau() { return ngayBatDau; }
    public void setNgayBatDau(LocalDate ngayBatDau) { this.ngayBatDau = ngayBatDau; }

    public LocalDate getNgayKetThuc() { return ngayKetThuc; }
    public void setNgayKetThuc(LocalDate ngayKetThuc) { this.ngayKetThuc = ngayKetThuc; }

    public HocKy getHocKy() { return hocKy; }
    public void setHocKy(HocKy hocKy) { this.hocKy = hocKy; }

    public String getTrangThai() { return trangThai; }
    public void setTrangThai(String trangThai) { this.trangThai = trangThai; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String maDot;
        private String tenDot;
        private LocalDate ngayBatDau;
        private LocalDate ngayKetThuc;
        private HocKy hocKy;
        private String trangThai;

        public Builder maDot(String maDot) { this.maDot = maDot; return this; }
        public Builder tenDot(String tenDot) { this.tenDot = tenDot; return this; }
        public Builder ngayBatDau(LocalDate ngayBatDau) { this.ngayBatDau = ngayBatDau; return this; }
        public Builder ngayKetThuc(LocalDate ngayKetThuc) { this.ngayKetThuc = ngayKetThuc; return this; }
        public Builder hocKy(HocKy hocKy) { this.hocKy = hocKy; return this; }
        public Builder trangThai(String trangThai) { this.trangThai = trangThai; return this; }

        public DotXetHocBong build() {
            return new DotXetHocBong(maDot, tenDot, ngayBatDau, ngayKetThuc, hocKy, trangThai);
        }
    }
}
