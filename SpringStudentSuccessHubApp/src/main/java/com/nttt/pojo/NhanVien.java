package com.nttt.pojo;

import jakarta.persistence.*;

@Entity
@Table(name = "nhanvien")
public class NhanVien {

    @Id
    @Column(name = "maNv", length = 20)
    private String maNv;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "nguoiDungId", referencedColumnName = "id", nullable = false)
    private NguoiDung nguoiDung;

    @Column(name = "chucVu", length = 100)
    private String chucVu;

    @Column(name = "donViCongTac", length = 150)
    private String donViCongTac;

    public NhanVien() {}

    public NhanVien(String maNv, NguoiDung nguoiDung, String chucVu, String donViCongTac) {
        this.maNv = maNv;
        this.nguoiDung = nguoiDung;
        this.chucVu = chucVu;
        this.donViCongTac = donViCongTac;
    }

    public String getMaNv() { return maNv; }
    public void setMaNv(String maNv) { this.maNv = maNv; }

    public NguoiDung getNguoiDung() { return nguoiDung; }
    public void setNguoiDung(NguoiDung nguoiDung) { this.nguoiDung = nguoiDung; }

    public String getChucVu() { return chucVu; }
    public void setChucVu(String chucVu) { this.chucVu = chucVu; }

    public String getDonViCongTac() { return donViCongTac; }
    public void setDonViCongTac(String donViCongTac) { this.donViCongTac = donViCongTac; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String maNv;
        private NguoiDung nguoiDung;
        private String chucVu;
        private String donViCongTac;

        public Builder maNv(String maNv) { this.maNv = maNv; return this; }
        public Builder nguoiDung(NguoiDung nguoiDung) { this.nguoiDung = nguoiDung; return this; }
        public Builder chucVu(String chucVu) { this.chucVu = chucVu; return this; }
        public Builder donViCongTac(String donViCongTac) { this.donViCongTac = donViCongTac; return this; }
        public NhanVien build() { return new NhanVien(maNv, nguoiDung, chucVu, donViCongTac); }
    }
}
