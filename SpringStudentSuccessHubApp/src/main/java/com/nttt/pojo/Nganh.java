package com.nttt.pojo;

import jakarta.persistence.*;

@Entity
@Table(name = "nganh")
public class Nganh {

    @Id
    @Column(name = "maNganh", length = 20)
    private String maNganh;

    @Column(name = "tenNganh", nullable = false, length = 150)
    private String tenNganh;

    @Column(name = "heDaoTao", length = 50)
    private String heDaoTao = "CHUAN";

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "maKhoa", nullable = false)
    private Khoa khoa;

    public Nganh() {}

    public Nganh(String maNganh, String tenNganh, String heDaoTao, Khoa khoa) {
        this.maNganh = maNganh;
        this.tenNganh = tenNganh;
        this.heDaoTao = heDaoTao;
        this.khoa = khoa;
    }

    public String getMaNganh() { return maNganh; }
    public void setMaNganh(String maNganh) { this.maNganh = maNganh; }

    public String getTenNganh() { return tenNganh; }
    public void setTenNganh(String tenNganh) { this.tenNganh = tenNganh; }

    public String getHeDaoTao() { return heDaoTao; }
    public void setHeDaoTao(String heDaoTao) { this.heDaoTao = heDaoTao; }

    public Khoa getKhoa() { return khoa; }
    public void setKhoa(Khoa khoa) { this.khoa = khoa; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String maNganh;
        private String tenNganh;
        private String heDaoTao = "CHUAN";
        private Khoa khoa;

        public Builder maNganh(String maNganh) { this.maNganh = maNganh; return this; }
        public Builder tenNganh(String tenNganh) { this.tenNganh = tenNganh; return this; }
        public Builder heDaoTao(String heDaoTao) { this.heDaoTao = heDaoTao; return this; }
        public Builder khoa(Khoa khoa) { this.khoa = khoa; return this; }
        public Nganh build() { return new Nganh(maNganh, tenNganh, heDaoTao, khoa); }
    }
}
