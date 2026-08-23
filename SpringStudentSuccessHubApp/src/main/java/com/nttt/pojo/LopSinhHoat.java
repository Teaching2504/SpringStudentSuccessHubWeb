package com.nttt.pojo;

import jakarta.persistence.*;

@Entity
@Table(name = "lopsinhhoat")
public class LopSinhHoat {

    @Id
    @Column(name = "maLop", length = 30)
    private String maLop;

    @Column(name = "tenLop", nullable = false, length = 100)
    private String tenLop;

    @Column(name = "khoaHoc", length = 30)
    private String khoaHoc;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "maKhoa", nullable = false)
    private Khoa khoa;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "maNganh", nullable = false)
    private Nganh nganh;

    public LopSinhHoat() {}

    public LopSinhHoat(String maLop, String tenLop, String khoaHoc, Khoa khoa, Nganh nganh) {
        this.maLop = maLop;
        this.tenLop = tenLop;
        this.khoaHoc = khoaHoc;
        this.khoa = khoa;
        this.nganh = nganh;
    }

    public String getMaLop() { return maLop; }
    public void setMaLop(String maLop) { this.maLop = maLop; }

    public String getTenLop() { return tenLop; }
    public void setTenLop(String tenLop) { this.tenLop = tenLop; }

    public String getKhoaHoc() { return khoaHoc; }
    public void setKhoaHoc(String khoaHoc) { this.khoaHoc = khoaHoc; }

    public Khoa getKhoa() { return khoa; }
    public void setKhoa(Khoa khoa) { this.khoa = khoa; }

    public Nganh getNganh() { return nganh; }
    public void setNganh(Nganh nganh) { this.nganh = nganh; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String maLop;
        private String tenLop;
        private String khoaHoc;
        private Khoa khoa;
        private Nganh nganh;

        public Builder maLop(String maLop) { this.maLop = maLop; return this; }
        public Builder tenLop(String tenLop) { this.tenLop = tenLop; return this; }
        public Builder khoaHoc(String khoaHoc) { this.khoaHoc = khoaHoc; return this; }
        public Builder khoa(Khoa khoa) { this.khoa = khoa; return this; }
        public Builder nganh(Nganh nganh) { this.nganh = nganh; return this; }
        public LopSinhHoat build() { return new LopSinhHoat(maLop, tenLop, khoaHoc, khoa, nganh); }
    }
}
