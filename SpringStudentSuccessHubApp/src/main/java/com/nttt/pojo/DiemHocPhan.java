package com.nttt.pojo;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "diemhocphan")
public class DiemHocPhan {

    @Id
    @Column(name = "id", length = 60)
    private String id; // e.g. DHP_2351010216_COSC1301_HK1_2025_2026

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "mssv", nullable = false)
    private SinhVien sinhVien;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "maMon", nullable = false)
    private MonHoc monHoc;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "maHocKy", nullable = false)
    private HocKy hocKy;

    @Column(name = "diemChuyenCan", precision = 4, scale = 2)
    private BigDecimal diemChuyenCan; // 10%

    @Column(name = "diemGiuaKy", precision = 4, scale = 2)
    private BigDecimal diemGiuaKy; // 30%

    @Column(name = "diemCuoiKy", precision = 4, scale = 2)
    private BigDecimal diemCuoiKy; // 60%

    @Column(name = "diemTongKet10", precision = 4, scale = 2)
    private BigDecimal diemTongKet10; // Thang 10: 0.1 * CC + 0.3 * GK + 0.6 * CK

    @Column(name = "diemHe4", precision = 4, scale = 2)
    private BigDecimal diemHe4; // Thang 4: 4.0 (A), 3.5 (B+), 3.0 (B), 2.5 (C+), 2.0 (C), 1.5 (D+), 1.0 (D), 0.0 (F)

    @Column(name = "diemChu", length = 5)
    private String diemChu; // "A+", "A", "B+", "B", "C+", "C", "D+", "D", "F"

    @Column(name = "soTinChi", nullable = false)
    private Integer soTinChi;

    @Column(name = "hocPhiMon", precision = 12, scale = 2)
    private BigDecimal hocPhiMon; // soTinChi * donGiaTinChi

    @Column(name = "dat")
    private Boolean dat; // true nếu diemTongKet10 >= 5.0 (không rớt)

    public DiemHocPhan() {}

    public DiemHocPhan(String id, SinhVien sinhVien, MonHoc monHoc, HocKy hocKy, BigDecimal diemChuyenCan, BigDecimal diemGiuaKy, BigDecimal diemCuoiKy, BigDecimal diemTongKet10, BigDecimal diemHe4, String diemChu, Integer soTinChi, BigDecimal hocPhiMon, Boolean dat) {
        this.id = id;
        this.sinhVien = sinhVien;
        this.monHoc = monHoc;
        this.hocKy = hocKy;
        this.diemChuyenCan = diemChuyenCan;
        this.diemGiuaKy = diemGiuaKy;
        this.diemCuoiKy = diemCuoiKy;
        this.diemTongKet10 = diemTongKet10;
        this.diemHe4 = diemHe4;
        this.diemChu = diemChu;
        this.soTinChi = soTinChi;
        this.hocPhiMon = hocPhiMon;
        this.dat = dat;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public SinhVien getSinhVien() { return sinhVien; }
    public void setSinhVien(SinhVien sinhVien) { this.sinhVien = sinhVien; }

    public MonHoc getMonHoc() { return monHoc; }
    public void setMonHoc(MonHoc monHoc) { this.monHoc = monHoc; }

    public HocKy getHocKy() { return hocKy; }
    public void setHocKy(HocKy hocKy) { this.hocKy = hocKy; }

    public BigDecimal getDiemChuyenCan() { return diemChuyenCan; }
    public void setDiemChuyenCan(BigDecimal diemChuyenCan) { this.diemChuyenCan = diemChuyenCan; }

    public BigDecimal getDiemGiuaKy() { return diemGiuaKy; }
    public void setDiemGiuaKy(BigDecimal diemGiuaKy) { this.diemGiuaKy = diemGiuaKy; }

    public BigDecimal getDiemCuoiKy() { return diemCuoiKy; }
    public void setDiemCuoiKy(BigDecimal diemCuoiKy) { this.diemCuoiKy = diemCuoiKy; }

    public BigDecimal getDiemTongKet10() { return diemTongKet10; }
    public void setDiemTongKet10(BigDecimal diemTongKet10) { this.diemTongKet10 = diemTongKet10; }

    public BigDecimal getDiemHe4() { return diemHe4; }
    public void setDiemHe4(BigDecimal diemHe4) { this.diemHe4 = diemHe4; }

    public String getDiemChu() { return diemChu; }
    public void setDiemChu(String diemChu) { this.diemChu = diemChu; }

    public Integer getSoTinChi() { return soTinChi; }
    public void setSoTinChi(Integer soTinChi) { this.soTinChi = soTinChi; }

    public BigDecimal getHocPhiMon() { return hocPhiMon; }
    public void setHocPhiMon(BigDecimal hocPhiMon) { this.hocPhiMon = hocPhiMon; }

    public Boolean getDat() { return dat; }
    public void setDat(Boolean dat) { this.dat = dat; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String id;
        private SinhVien sinhVien;
        private MonHoc monHoc;
        private HocKy hocKy;
        private BigDecimal diemChuyenCan;
        private BigDecimal diemGiuaKy;
        private BigDecimal diemCuoiKy;
        private BigDecimal diemTongKet10;
        private BigDecimal diemHe4;
        private String diemChu;
        private Integer soTinChi;
        private BigDecimal hocPhiMon;
        private Boolean dat;

        public Builder id(String id) { this.id = id; return this; }
        public Builder sinhVien(SinhVien sinhVien) { this.sinhVien = sinhVien; return this; }
        public Builder monHoc(MonHoc monHoc) { this.monHoc = monHoc; return this; }
        public Builder hocKy(HocKy hocKy) { this.hocKy = hocKy; return this; }
        public Builder diemChuyenCan(BigDecimal diemChuyenCan) { this.diemChuyenCan = diemChuyenCan; return this; }
        public Builder diemGiuaKy(BigDecimal diemGiuaKy) { this.diemGiuaKy = diemGiuaKy; return this; }
        public Builder diemCuoiKy(BigDecimal diemCuoiKy) { this.diemCuoiKy = diemCuoiKy; return this; }
        public Builder diemTongKet10(BigDecimal diemTongKet10) { this.diemTongKet10 = diemTongKet10; return this; }
        public Builder diemHe4(BigDecimal diemHe4) { this.diemHe4 = diemHe4; return this; }
        public Builder diemChu(String diemChu) { this.diemChu = diemChu; return this; }
        public Builder soTinChi(Integer soTinChi) { this.soTinChi = soTinChi; return this; }
        public Builder hocPhiMon(BigDecimal hocPhiMon) { this.hocPhiMon = hocPhiMon; return this; }
        public Builder dat(Boolean dat) { this.dat = dat; return this; }

        public DiemHocPhan build() {
            return new DiemHocPhan(id, sinhVien, monHoc, hocKy, diemChuyenCan, diemGiuaKy, diemCuoiKy, diemTongKet10, diemHe4, diemChu, soTinChi, hocPhiMon, dat);
        }
    }
}
