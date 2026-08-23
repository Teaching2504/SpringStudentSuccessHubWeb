package com.nttt.pojo;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "hosohocbong")
public class HoSoHocBong {

    @Id
    @Column(name = "maHoSo", length = 30)
    private String maHoSo;

    @Column(name = "diemXet", precision = 5, scale = 2)
    private BigDecimal diemXet;

    @Column(name = "thuHang")
    private Integer thuHang;

    @Column(name = "loaiHocBong", length = 50)
    private String loaiHocBong; // XUAT_SAC, GIOI, KHA

    @Column(name = "mucHocBong", precision = 15, scale = 2)
    private BigDecimal mucHocBong;

    @Column(name = "trangThai", length = 50)
    private String trangThai; // DU_KIEN, CHINH_THUC, KHONG_DAT, BI_LOAI

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "mssv", nullable = false)
    private SinhVien sinhVien;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "maDotXetHbKhoa", nullable = false)
    private DotXetHbKhoa dotXetHbKhoa;

    public HoSoHocBong() {}

    public HoSoHocBong(String maHoSo, BigDecimal diemXet, Integer thuHang, String loaiHocBong, BigDecimal mucHocBong, String trangThai, SinhVien sinhVien, DotXetHbKhoa dotXetHbKhoa) {
        this.maHoSo = maHoSo;
        this.diemXet = diemXet;
        this.thuHang = thuHang;
        this.loaiHocBong = loaiHocBong;
        this.mucHocBong = mucHocBong;
        this.trangThai = trangThai;
        this.sinhVien = sinhVien;
        this.dotXetHbKhoa = dotXetHbKhoa;
    }

    public String getMaHoSo() { return maHoSo; }
    public void setMaHoSo(String maHoSo) { this.maHoSo = maHoSo; }

    public BigDecimal getDiemXet() { return diemXet; }
    public void setDiemXet(BigDecimal diemXet) { this.diemXet = diemXet; }

    public Integer getThuHang() { return thuHang; }
    public void setThuHang(Integer thuHang) { this.thuHang = thuHang; }

    public String getLoaiHocBong() { return loaiHocBong; }
    public void setLoaiHocBong(String loaiHocBong) { this.loaiHocBong = loaiHocBong; }

    public BigDecimal getMucHocBong() { return mucHocBong; }
    public void setMucHocBong(BigDecimal mucHocBong) { this.mucHocBong = mucHocBong; }

    public String getTrangThai() { return trangThai; }
    public void setTrangThai(String trangThai) { this.trangThai = trangThai; }

    public SinhVien getSinhVien() { return sinhVien; }
    public void setSinhVien(SinhVien sinhVien) { this.sinhVien = sinhVien; }

    public DotXetHbKhoa getDotXetHbKhoa() { return dotXetHbKhoa; }
    public void setDotXetHbKhoa(DotXetHbKhoa dotXetHbKhoa) { this.dotXetHbKhoa = dotXetHbKhoa; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String maHoSo;
        private BigDecimal diemXet;
        private Integer thuHang;
        private String loaiHocBong;
        private BigDecimal mucHocBong;
        private String trangThai;
        private SinhVien sinhVien;
        private DotXetHbKhoa dotXetHbKhoa;

        public Builder maHoSo(String maHoSo) { this.maHoSo = maHoSo; return this; }
        public Builder diemXet(BigDecimal diemXet) { this.diemXet = diemXet; return this; }
        public Builder thuHang(Integer thuHang) { this.thuHang = thuHang; return this; }
        public Builder loaiHocBong(String loaiHocBong) { this.loaiHocBong = loaiHocBong; return this; }
        public Builder mucHocBong(BigDecimal mucHocBong) { this.mucHocBong = mucHocBong; return this; }
        public Builder trangThai(String trangThai) { this.trangThai = trangThai; return this; }
        public Builder sinhVien(SinhVien sinhVien) { this.sinhVien = sinhVien; return this; }
        public Builder dotXetHbKhoa(DotXetHbKhoa dotXetHbKhoa) { this.dotXetHbKhoa = dotXetHbKhoa; return this; }

        public HoSoHocBong build() {
            return new HoSoHocBong(maHoSo, diemXet, thuHang, loaiHocBong, mucHocBong, trangThai, sinhVien, dotXetHbKhoa);
        }
    }
}
