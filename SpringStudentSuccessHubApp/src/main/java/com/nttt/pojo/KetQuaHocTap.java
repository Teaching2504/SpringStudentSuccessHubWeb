package com.nttt.pojo;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "ketquahoctap")
public class KetQuaHocTap {

    @Id
    @Column(name = "id", length = 30)
    private String id;

    @Column(name = "diemTrungBinh", precision = 4, scale = 2)
    private BigDecimal diemTrungBinh;

    @Column(name = "soTinChi")
    private Integer soTinChi;

    @Column(name = "coHocPhanRot")
    private Boolean coHocPhanRot;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "mssv", nullable = false)
    private SinhVien sinhVien;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "maHocKy", nullable = false)
    private HocKy hocKy;

    public KetQuaHocTap() {}

    public KetQuaHocTap(String id, BigDecimal diemTrungBinh, Integer soTinChi, Boolean coHocPhanRot, SinhVien sinhVien, HocKy hocKy) {
        this.id = id;
        this.diemTrungBinh = diemTrungBinh;
        this.soTinChi = soTinChi;
        this.coHocPhanRot = coHocPhanRot;
        this.sinhVien = sinhVien;
        this.hocKy = hocKy;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public BigDecimal getDiemTrungBinh() { return diemTrungBinh; }
    public void setDiemTrungBinh(BigDecimal diemTrungBinh) { this.diemTrungBinh = diemTrungBinh; }

    public Integer getSoTinChi() { return soTinChi; }
    public void setSoTinChi(Integer soTinChi) { this.soTinChi = soTinChi; }

    public Boolean getCoHocPhanRot() { return coHocPhanRot; }
    public void setCoHocPhanRot(Boolean coHocPhanRot) { this.coHocPhanRot = coHocPhanRot; }

    public SinhVien getSinhVien() { return sinhVien; }
    public void setSinhVien(SinhVien sinhVien) { this.sinhVien = sinhVien; }

    public HocKy getHocKy() { return hocKy; }
    public void setHocKy(HocKy hocKy) { this.hocKy = hocKy; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String id;
        private BigDecimal diemTrungBinh;
        private Integer soTinChi;
        private Boolean coHocPhanRot;
        private SinhVien sinhVien;
        private HocKy hocKy;

        public Builder id(String id) { this.id = id; return this; }
        public Builder diemTrungBinh(BigDecimal diemTrungBinh) { this.diemTrungBinh = diemTrungBinh; return this; }
        public Builder soTinChi(Integer soTinChi) { this.soTinChi = soTinChi; return this; }
        public Builder coHocPhanRot(Boolean coHocPhanRot) { this.coHocPhanRot = coHocPhanRot; return this; }
        public Builder sinhVien(SinhVien sinhVien) { this.sinhVien = sinhVien; return this; }
        public Builder hocKy(HocKy hocKy) { this.hocKy = hocKy; return this; }

        public KetQuaHocTap build() {
            return new KetQuaHocTap(id, diemTrungBinh, soTinChi, coHocPhanRot, sinhVien, hocKy);
        }
    }
}
