package com.nttt.pojo;

import jakarta.persistence.*;
import org.springframework.data.domain.Persistable;

@Entity
@Table(name = "canbokhoa")
public class CanBoKhoa implements Persistable<String> {

    @Id
    @Column(name = "maNv", length = 20)
    private String maNv;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "maNv", insertable = false, updatable = false)
    private NhanVien nhanVien;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "maKhoa", nullable = false)
    private Khoa khoa;

    @Column(name = "lopPhuTrach", length = 200)
    private String lopPhuTrach;

    @Column(name = "trangThaiCongTac", length = 50)
    private String trangThaiCongTac;

    @Transient
    private boolean isNew = true;

    public CanBoKhoa() {}

    public CanBoKhoa(String maNv, NhanVien nhanVien, Khoa khoa, String lopPhuTrach, String trangThaiCongTac) {
        this.maNv = maNv;
        this.nhanVien = nhanVien;
        this.khoa = khoa;
        this.lopPhuTrach = lopPhuTrach;
        this.trangThaiCongTac = trangThaiCongTac;
    }

    @Override
    public String getId() { return maNv; }

    @Override
    public boolean isNew() { return isNew; }

    @PostPersist
    @PostLoad
    void markNotNew() { this.isNew = false; }

    public String getMaNv() { return maNv; }
    public void setMaNv(String maNv) { this.maNv = maNv; }

    public NhanVien getNhanVien() { return nhanVien; }
    public void setNhanVien(NhanVien nhanVien) { this.nhanVien = nhanVien; }

    public Khoa getKhoa() { return khoa; }
    public void setKhoa(Khoa khoa) { this.khoa = khoa; }

    public String getLopPhuTrach() { return lopPhuTrach; }
    public void setLopPhuTrach(String lopPhuTrach) { this.lopPhuTrach = lopPhuTrach; }

    public String getTrangThaiCongTac() { return trangThaiCongTac; }
    public void setTrangThaiCongTac(String trangThaiCongTac) { this.trangThaiCongTac = trangThaiCongTac; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String maNv;
        private NhanVien nhanVien;
        private Khoa khoa;
        private String lopPhuTrach;
        private String trangThaiCongTac;

        public Builder maNv(String maNv) { this.maNv = maNv; return this; }
        public Builder nhanVien(NhanVien nhanVien) {
            this.nhanVien = nhanVien;
            if (nhanVien != null && this.maNv == null) {
                this.maNv = nhanVien.getMaNv();
            }
            return this;
        }
        public Builder khoa(Khoa khoa) { this.khoa = khoa; return this; }
        public Builder lopPhuTrach(String lopPhuTrach) { this.lopPhuTrach = lopPhuTrach; return this; }
        public Builder trangThaiCongTac(String trangThaiCongTac) { this.trangThaiCongTac = trangThaiCongTac; return this; }

        public CanBoKhoa build() {
            String targetMaNv = (maNv != null) ? maNv : (nhanVien != null ? nhanVien.getMaNv() : null);
            return new CanBoKhoa(targetMaNv, nhanVien, khoa, lopPhuTrach, trangThaiCongTac);
        }
    }
}
