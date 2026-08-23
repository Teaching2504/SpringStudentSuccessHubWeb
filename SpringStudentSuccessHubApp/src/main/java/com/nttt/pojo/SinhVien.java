package com.nttt.pojo;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "sinhvien")
public class SinhVien {

    @Id
    @Column(name = "mssv", length = 20)
    private String mssv;

    @Column(name = "cccd", length = 12, nullable = false, unique = true)
    private String cccd;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "nguoiDungId", referencedColumnName = "id", nullable = false)
    private NguoiDung nguoiDung;

    @Column(name = "ngaySinh")
    private LocalDate ngaySinh;

    @Column(name = "gioiTinh", length = 20)
    private String gioiTinh;

    @Column(name = "diaChi", length = 255)
    private String diaChi;

    @Column(name = "trangThaiHoc", length = 50)
    private String trangThaiHoc; // DANG_HOC, BAO_LUU, THOI_HOC, TOT_NGHIEP

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "maLop", referencedColumnName = "maLop", nullable = false)
    private LopSinhHoat lopSinhHoat;

    public SinhVien() {}

    public SinhVien(String mssv, String cccd, NguoiDung nguoiDung, LocalDate ngaySinh, String gioiTinh, String diaChi, String trangThaiHoc, LopSinhHoat lopSinhHoat) {
        this.mssv = mssv;
        this.cccd = cccd;
        this.nguoiDung = nguoiDung;
        this.ngaySinh = ngaySinh;
        this.gioiTinh = gioiTinh;
        this.diaChi = diaChi;
        this.trangThaiHoc = trangThaiHoc;
        this.lopSinhHoat = lopSinhHoat;
    }

    public String getMssv() { return mssv; }
    public void setMssv(String mssv) { this.mssv = mssv; }

    public String getCccd() { return cccd; }
    public void setCccd(String cccd) { this.cccd = cccd; }

    public NguoiDung getNguoiDung() { return nguoiDung; }
    public void setNguoiDung(NguoiDung nguoiDung) { this.nguoiDung = nguoiDung; }

    public LocalDate getNgaySinh() { return ngaySinh; }
    public void setNgaySinh(LocalDate ngaySinh) { this.ngaySinh = ngaySinh; }

    public String getGioiTinh() { return gioiTinh; }
    public void setGioiTinh(String gioiTinh) { this.gioiTinh = gioiTinh; }

    public String getDiaChi() { return diaChi; }
    public void setDiaChi(String diaChi) { this.diaChi = diaChi; }

    public String getTrangThaiHoc() { return trangThaiHoc; }
    public void setTrangThaiHoc(String trangThaiHoc) { this.trangThaiHoc = trangThaiHoc; }

    public LopSinhHoat getLopSinhHoat() { return lopSinhHoat; }
    public void setLopSinhHoat(LopSinhHoat lopSinhHoat) { this.lopSinhHoat = lopSinhHoat; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String mssv;
        private String cccd;
        private NguoiDung nguoiDung;
        private LocalDate ngaySinh;
        private String gioiTinh;
        private String diaChi;
        private String trangThaiHoc;
        private LopSinhHoat lopSinhHoat;

        public Builder mssv(String mssv) { this.mssv = mssv; return this; }
        public Builder cccd(String cccd) { this.cccd = cccd; return this; }
        public Builder nguoiDung(NguoiDung nguoiDung) { this.nguoiDung = nguoiDung; return this; }
        public Builder ngaySinh(LocalDate ngaySinh) { this.ngaySinh = ngaySinh; return this; }
        public Builder gioiTinh(String gioiTinh) { this.gioiTinh = gioiTinh; return this; }
        public Builder diaChi(String diaChi) { this.diaChi = diaChi; return this; }
        public Builder trangThaiHoc(String trangThaiHoc) { this.trangThaiHoc = trangThaiHoc; return this; }
        public Builder lopSinhHoat(LopSinhHoat lopSinhHoat) { this.lopSinhHoat = lopSinhHoat; return this; }

        public SinhVien build() {
            return new SinhVien(mssv, cccd, nguoiDung, ngaySinh, gioiTinh, diaChi, trangThaiHoc, lopSinhHoat);
        }
    }
}
