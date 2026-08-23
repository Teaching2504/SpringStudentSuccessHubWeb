package com.nttt.pojo;

import jakarta.persistence.*;
import org.springframework.data.domain.Persistable;

@Entity
@Table(name = "canbocaptruong")
public class CanBoCapTruong implements Persistable<String> {

    @Id
    @Column(name = "maNv", length = 20)
    private String maNv;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "maNv", insertable = false, updatable = false)
    private NhanVien nhanVien;

    @Column(name = "phongBan", length = 150)
    private String phongBan;

    @Column(name = "capPheDuyet", length = 100)
    private String capPheDuyet;

    @Transient
    private boolean isNew = true;

    public CanBoCapTruong() {}

    public CanBoCapTruong(String maNv, NhanVien nhanVien, String phongBan, String capPheDuyet) {
        this.maNv = maNv;
        this.nhanVien = nhanVien;
        this.phongBan = phongBan;
        this.capPheDuyet = capPheDuyet;
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

    public String getPhongBan() { return phongBan; }
    public void setPhongBan(String phongBan) { this.phongBan = phongBan; }

    public String getCapPheDuyet() { return capPheDuyet; }
    public void setCapPheDuyet(String capPheDuyet) { this.capPheDuyet = capPheDuyet; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String maNv;
        private NhanVien nhanVien;
        private String phongBan;
        private String capPheDuyet;

        public Builder maNv(String maNv) { this.maNv = maNv; return this; }
        public Builder nhanVien(NhanVien nhanVien) {
            this.nhanVien = nhanVien;
            if (nhanVien != null && this.maNv == null) {
                this.maNv = nhanVien.getMaNv();
            }
            return this;
        }
        public Builder phongBan(String phongBan) { this.phongBan = phongBan; return this; }
        public Builder capPheDuyet(String capPheDuyet) { this.capPheDuyet = capPheDuyet; return this; }
        public CanBoCapTruong build() {
            String targetMaNv = (maNv != null) ? maNv : (nhanVien != null ? nhanVien.getMaNv() : null);
            return new CanBoCapTruong(targetMaNv, nhanVien, phongBan, capPheDuyet);
        }
    }
}
