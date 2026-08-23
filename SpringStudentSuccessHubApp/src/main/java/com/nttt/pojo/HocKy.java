package com.nttt.pojo;

import jakarta.persistence.*;

@Entity
@Table(name = "hocky")
public class HocKy {

    @Id
    @Column(name = "maHocKy", length = 20)
    private String maHocKy;

    @Column(name = "namHoc", length = 20)
    private String namHoc;

    @Column(name = "tenHocKy", length = 50)
    private String tenHocKy;

    public HocKy() {}

    public HocKy(String maHocKy, String namHoc, String tenHocKy) {
        this.maHocKy = maHocKy;
        this.namHoc = namHoc;
        this.tenHocKy = tenHocKy;
    }

    public String getMaHocKy() { return maHocKy; }
    public void setMaHocKy(String maHocKy) { this.maHocKy = maHocKy; }

    public String getNamHoc() { return namHoc; }
    public void setNamHoc(String namHoc) { this.namHoc = namHoc; }

    public String getTenHocKy() { return tenHocKy; }
    public void setTenHocKy(String tenHocKy) { this.tenHocKy = tenHocKy; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String maHocKy;
        private String namHoc;
        private String tenHocKy;

        public Builder maHocKy(String maHocKy) { this.maHocKy = maHocKy; return this; }
        public Builder namHoc(String namHoc) { this.namHoc = namHoc; return this; }
        public Builder tenHocKy(String tenHocKy) { this.tenHocKy = tenHocKy; return this; }
        public HocKy build() { return new HocKy(maHocKy, namHoc, tenHocKy); }
    }
}
