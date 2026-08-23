package com.nttt.pojo;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "ketquarenluyen")
public class KetQuaRenLuyen {

    @Id
    @Column(name = "id", length = 30)
    private String id;

    @Column(name = "diemRenLuyen", precision = 5, scale = 2)
    private BigDecimal diemRenLuyen;

    @Column(name = "xepLoai", length = 50)
    private String xepLoai; // Xuat sac, Tot, Kha, Trung binh, Yeu, Kem

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "mssv", nullable = false)
    private SinhVien sinhVien;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "maHocKy", nullable = false)
    private HocKy hocKy;

    public KetQuaRenLuyen() {}

    public KetQuaRenLuyen(String id, BigDecimal diemRenLuyen, String xepLoai, SinhVien sinhVien, HocKy hocKy) {
        this.id = id;
        this.diemRenLuyen = diemRenLuyen;
        this.xepLoai = xepLoai;
        this.sinhVien = sinhVien;
        this.hocKy = hocKy;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public BigDecimal getDiemRenLuyen() { return diemRenLuyen; }
    public void setDiemRenLuyen(BigDecimal diemRenLuyen) { this.diemRenLuyen = diemRenLuyen; }

    public String getXepLoai() { return xepLoai; }
    public void setXepLoai(String xepLoai) { this.xepLoai = xepLoai; }

    public SinhVien getSinhVien() { return sinhVien; }
    public void setSinhVien(SinhVien sinhVien) { this.sinhVien = sinhVien; }

    public HocKy getHocKy() { return hocKy; }
    public void setHocKy(HocKy hocKy) { this.hocKy = hocKy; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String id;
        private BigDecimal diemRenLuyen;
        private String xepLoai;
        private SinhVien sinhVien;
        private HocKy hocKy;

        public Builder id(String id) { this.id = id; return this; }
        public Builder diemRenLuyen(BigDecimal diemRenLuyen) { this.diemRenLuyen = diemRenLuyen; return this; }
        public Builder xepLoai(String xepLoai) { this.xepLoai = xepLoai; return this; }
        public Builder sinhVien(SinhVien sinhVien) { this.sinhVien = sinhVien; return this; }
        public Builder hocKy(HocKy hocKy) { this.hocKy = hocKy; return this; }

        public KetQuaRenLuyen build() {
            return new KetQuaRenLuyen(id, diemRenLuyen, xepLoai, sinhVien, hocKy);
        }
    }
}
