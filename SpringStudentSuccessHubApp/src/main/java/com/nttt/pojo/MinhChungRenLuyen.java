package com.nttt.pojo;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "minhchungrenluyen")
public class MinhChungRenLuyen {

    @Id
    @Column(name = "maMinhChung", length = 30)
    private String maMinhChung;

    @Column(name = "tenHoatDong", nullable = false, length = 200)
    private String tenHoatDong;

    @Column(name = "diemDeXuat", precision = 5, scale = 2)
    private BigDecimal diemDeXuat;

    @Column(name = "fileUrl", length = 500)
    private String fileUrl;

    @Column(name = "moTa", columnDefinition = "TEXT")
    private String moTa;

    @Column(name = "trangThai", length = 50)
    private String trangThai; // CHO_DUYET, DA_DUYET, TU_CHOI

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "maHoSo", nullable = true)
    private HoSoHocBong hoSoHocBong;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "mssv", nullable = false)
    private SinhVien sinhVien;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "maHocKy", nullable = false)
    private HocKy hocKy;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "maNvPheDuyet", nullable = true)
    private NhanVien nhanVienPheDuyet;

    @Column(name = "lyDoPhanHoi", columnDefinition = "TEXT")
    private String lyDoPhanHoi;

    @Column(name = "ngayTao")
    private LocalDate ngayTao;

    public MinhChungRenLuyen() {}

    public MinhChungRenLuyen(String maMinhChung, String tenHoatDong, BigDecimal diemDeXuat, String fileUrl, String moTa, String trangThai, HoSoHocBong hoSoHocBong, SinhVien sinhVien, HocKy hocKy, NhanVien nhanVienPheDuyet, String lyDoPhanHoi, LocalDate ngayTao) {
        this.maMinhChung = maMinhChung;
        this.tenHoatDong = tenHoatDong;
        this.diemDeXuat = diemDeXuat;
        this.fileUrl = fileUrl;
        this.moTa = moTa;
        this.trangThai = trangThai;
        this.hoSoHocBong = hoSoHocBong;
        this.sinhVien = sinhVien;
        this.hocKy = hocKy;
        this.nhanVienPheDuyet = nhanVienPheDuyet;
        this.lyDoPhanHoi = lyDoPhanHoi;
        this.ngayTao = ngayTao;
    }

    @PrePersist
    public void prePersist() {
        if (this.ngayTao == null) {
            this.ngayTao = LocalDate.now();
        }
        if (this.trangThai == null) {
            this.trangThai = "CHO_DUYET";
        }
    }

    public String getMaMinhChung() { return maMinhChung; }
    public void setMaMinhChung(String maMinhChung) { this.maMinhChung = maMinhChung; }

    public String getTenHoatDong() { return tenHoatDong; }
    public void setTenHoatDong(String tenHoatDong) { this.tenHoatDong = tenHoatDong; }

    public BigDecimal getDiemDeXuat() { return diemDeXuat; }
    public void setDiemDeXuat(BigDecimal diemDeXuat) { this.diemDeXuat = diemDeXuat; }

    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }

    public String getMoTa() { return moTa; }
    public void setMoTa(String moTa) { this.moTa = moTa; }

    public String getTrangThai() { return trangThai; }
    public void setTrangThai(String trangThai) { this.trangThai = trangThai; }

    public HoSoHocBong getHoSoHocBong() { return hoSoHocBong; }
    public void setHoSoHocBong(HoSoHocBong hoSoHocBong) { this.hoSoHocBong = hoSoHocBong; }

    public SinhVien getSinhVien() { return sinhVien; }
    public void setSinhVien(SinhVien sinhVien) { this.sinhVien = sinhVien; }

    public HocKy getHocKy() { return hocKy; }
    public void setHocKy(HocKy hocKy) { this.hocKy = hocKy; }

    public NhanVien getNhanVienPheDuyet() { return nhanVienPheDuyet; }
    public void setNhanVienPheDuyet(NhanVien nhanVienPheDuyet) { this.nhanVienPheDuyet = nhanVienPheDuyet; }

    public String getLyDoPhanHoi() { return lyDoPhanHoi; }
    public void setLyDoPhanHoi(String lyDoPhanHoi) { this.lyDoPhanHoi = lyDoPhanHoi; }

    public LocalDate getNgayTao() { return ngayTao; }
    public void setNgayTao(LocalDate ngayTao) { this.ngayTao = ngayTao; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String maMinhChung;
        private String tenHoatDong;
        private BigDecimal diemDeXuat;
        private String fileUrl;
        private String moTa;
        private String trangThai;
        private HoSoHocBong hoSoHocBong;
        private SinhVien sinhVien;
        private HocKy hocKy;
        private NhanVien nhanVienPheDuyet;
        private String lyDoPhanHoi;
        private LocalDate ngayTao;

        public Builder maMinhChung(String maMinhChung) { this.maMinhChung = maMinhChung; return this; }
        public Builder tenHoatDong(String tenHoatDong) { this.tenHoatDong = tenHoatDong; return this; }
        public Builder diemDeXuat(BigDecimal diemDeXuat) { this.diemDeXuat = diemDeXuat; return this; }
        public Builder fileUrl(String fileUrl) { this.fileUrl = fileUrl; return this; }
        public Builder moTa(String moTa) { this.moTa = moTa; return this; }
        public Builder trangThai(String trangThai) { this.trangThai = trangThai; return this; }
        public Builder hoSoHocBong(HoSoHocBong hoSoHocBong) { this.hoSoHocBong = hoSoHocBong; return this; }
        public Builder sinhVien(SinhVien sinhVien) { this.sinhVien = sinhVien; return this; }
        public Builder hocKy(HocKy hocKy) { this.hocKy = hocKy; return this; }
        public Builder nhanVienPheDuyet(NhanVien nhanVienPheDuyet) { this.nhanVienPheDuyet = nhanVienPheDuyet; return this; }
        public Builder lyDoPhanHoi(String lyDoPhanHoi) { this.lyDoPhanHoi = lyDoPhanHoi; return this; }
        public Builder ngayTao(LocalDate ngayTao) { this.ngayTao = ngayTao; return this; }

        public MinhChungRenLuyen build() {
            return new MinhChungRenLuyen(maMinhChung, tenHoatDong, diemDeXuat, fileUrl, moTa, trangThai, hoSoHocBong, sinhVien, hocKy, nhanVienPheDuyet, lyDoPhanHoi, ngayTao);
        }
    }
}
