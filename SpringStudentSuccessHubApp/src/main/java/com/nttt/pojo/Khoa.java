package com.nttt.pojo;

import jakarta.persistence.*;

@Entity
@Table(name = "khoa")
public class Khoa {

    @Id
    @Column(name = "maKhoa", length = 20)
    private String maKhoa;

    @Column(name = "tenKhoa", nullable = false, length = 150)
    private String tenKhoa;

    public Khoa() {}

    public Khoa(String maKhoa, String tenKhoa) {
        this.maKhoa = maKhoa;
        this.tenKhoa = tenKhoa;
    }

    public String getMaKhoa() { return maKhoa; }
    public void setMaKhoa(String maKhoa) { this.maKhoa = maKhoa; }

    public String getTenKhoa() { return tenKhoa; }
    public void setTenKhoa(String tenKhoa) { this.tenKhoa = tenKhoa; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String maKhoa;
        private String tenKhoa;

        public Builder maKhoa(String maKhoa) { this.maKhoa = maKhoa; return this; }
        public Builder tenKhoa(String tenKhoa) { this.tenKhoa = tenKhoa; return this; }
        public Khoa build() { return new Khoa(maKhoa, tenKhoa); }
    }
}
