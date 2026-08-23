package com.nttt.pojo;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "kiennghi")
public class KienNghi {

    @Id
    @Column(name = "maKienNghi", length = 30)
    private String maKienNghi;

    @Column(name = "noiDung", columnDefinition = "TEXT")
    private String noiDung;

    @Column(name = "tepMinhChung", length = 500)
    private String tepMinhChung;

    @Column(name = "trangThai", length = 50)
    private String trangThai; // CHO_XU_LY, DA_CHAP_NHAN, DA_TU_CHOI

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "maDotXetHbKhoa", nullable = false)
    private DotXetHbKhoa dotXetHbKhoa;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "maHoSo", nullable = true)
    private HoSoHocBong hoSoHocBong;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "maNvXuLy", nullable = true)
    private NhanVien nhanVienXuLy;

    @Column(name = "phanHoi", columnDefinition = "TEXT")
    private String phanHoi;

    @Column(name = "ngayGui")
    private LocalDate ngayGui;

    public KienNghi() {}

    public KienNghi(String maKienNghi, String noiDung, String tepMinhChung, String trangThai, DotXetHbKhoa dotXetHbKhoa, HoSoHocBong hoSoHocBong, NhanVien nhanVienXuLy, String phanHoi, LocalDate ngayGui) {
        this.maKienNghi = maKienNghi;
        this.noiDung = noiDung;
        this.tepMinhChung = tepMinhChung;
        this.trangThai = trangThai;
        this.dotXetHbKhoa = dotXetHbKhoa;
        this.hoSoHocBong = hoSoHocBong;
        this.nhanVienXuLy = nhanVienXuLy;
        this.phanHoi = phanHoi;
        this.ngayGui = ngayGui;
    }

    @PrePersist
    public void prePersist() {
        if (this.ngayGui == null) {
            this.ngayGui = LocalDate.now();
        }
        if (this.trangThai == null) {
            this.trangThai = "CHO_XU_LY";
        }
    }

    public String getMaKienNghi() { return maKienNghi; }
    public void setMaKienNghi(String maKienNghi) { this.maKienNghi = maKienNghi; }

    public String getNoiDung() { return noiDung; }
    public void setNoiDung(String noiDung) { this.noiDung = noiDung; }

    public String getTepMinhChung() { return tepMinhChung; }
    public void setTepMinhChung(String tepMinhChung) { this.tepMinhChung = tepMinhChung; }

    public String getTrangThai() { return trangThai; }
    public void setTrangThai(String trangThai) { this.trangThai = trangThai; }

    public DotXetHbKhoa getDotXetHbKhoa() { return dotXetHbKhoa; }
    public void setDotXetHbKhoa(DotXetHbKhoa dotXetHbKhoa) { this.dotXetHbKhoa = dotXetHbKhoa; }

    public HoSoHocBong getHoSoHocBong() { return hoSoHocBong; }
    public void setHoSoHocBong(HoSoHocBong hoSoHocBong) { this.hoSoHocBong = hoSoHocBong; }

    public NhanVien getNhanVienXuLy() { return nhanVienXuLy; }
    public void setNhanVienXuLy(NhanVien nhanVienXuLy) { this.nhanVienXuLy = nhanVienXuLy; }

    public String getPhanHoi() { return phanHoi; }
    public void setPhanHoi(String phanHoi) { this.phanHoi = phanHoi; }

    public LocalDate getNgayGui() { return ngayGui; }
    public void setNgayGui(LocalDate ngayGui) { this.ngayGui = ngayGui; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String maKienNghi;
        private String noiDung;
        private String tepMinhChung;
        private String trangThai;
        private DotXetHbKhoa dotXetHbKhoa;
        private HoSoHocBong hoSoHocBong;
        private NhanVien nhanVienXuLy;
        private String phanHoi;
        private LocalDate ngayGui;

        public Builder maKienNghi(String maKienNghi) { this.maKienNghi = maKienNghi; return this; }
        public Builder noiDung(String noiDung) { this.noiDung = noiDung; return this; }
        public Builder tepMinhChung(String tepMinhChung) { this.tepMinhChung = tepMinhChung; return this; }
        public Builder trangThai(String trangThai) { this.trangThai = trangThai; return this; }
        public Builder dotXetHbKhoa(DotXetHbKhoa dotXetHbKhoa) { this.dotXetHbKhoa = dotXetHbKhoa; return this; }
        public Builder hoSoHocBong(HoSoHocBong hoSoHocBong) { this.hoSoHocBong = hoSoHocBong; return this; }
        public Builder nhanVienXuLy(NhanVien nhanVienXuLy) { this.nhanVienXuLy = nhanVienXuLy; return this; }
        public Builder phanHoi(String phanHoi) { this.phanHoi = phanHoi; return this; }
        public Builder ngayGui(LocalDate ngayGui) { this.ngayGui = ngayGui; return this; }

        public KienNghi build() {
            return new KienNghi(maKienNghi, noiDung, tepMinhChung, trangThai, dotXetHbKhoa, hoSoHocBong, nhanVienXuLy, phanHoi, ngayGui);
        }
    }
}
