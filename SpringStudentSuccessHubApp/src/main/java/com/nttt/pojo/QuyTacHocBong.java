package com.nttt.pojo;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "quytachocbong")
public class QuyTacHocBong {

    @Id
    @Column(name = "maQuyTac", length = 30)
    private String maQuyTac;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "maDot", nullable = false)
    private DotXetHocBong dotXetHocBong;

    @Column(name = "diemTbDuoiThieu", precision = 4, scale = 2)
    private BigDecimal diemTbDuoiThieu; // Ví dụ 2.50 hoặc 3.20

    @Column(name = "diemRlToiThieu", precision = 5, scale = 2)
    private BigDecimal diemRlToiThieu; // Ví dụ 65.00 hoặc 80.00

    @Column(name = "soTinChiToiThieu")
    private Integer soTinChiToiThieu; // Ví dụ 14 hoặc 15

    @Column(name = "khongNoMon")
    private Boolean khongNoMon;

    @Column(name = "phienBan")
    private Integer phienBan;

    @Column(name = "ghiChu", length = 255)
    private String ghiChu;

    @Column(name = "mucHocBongXuatSac", precision = 15, scale = 2)
    private BigDecimal mucHocBongXuatSac;

    @Column(name = "mucHocBongGioi", precision = 15, scale = 2)
    private BigDecimal mucHocBongGioi;

    @Column(name = "mucHocBongKha", precision = 15, scale = 2)
    private BigDecimal mucHocBongKha;

    public QuyTacHocBong() {}

    public QuyTacHocBong(String maQuyTac, DotXetHocBong dotXetHocBong, BigDecimal diemTbDuoiThieu, BigDecimal diemRlToiThieu, Integer soTinChiToiThieu, Boolean khongNoMon, Integer phienBan, String ghiChu, BigDecimal mucHocBongXuatSac, BigDecimal mucHocBongGioi, BigDecimal mucHocBongKha) {
        this.maQuyTac = maQuyTac;
        this.dotXetHocBong = dotXetHocBong;
        this.diemTbDuoiThieu = diemTbDuoiThieu;
        this.diemRlToiThieu = diemRlToiThieu;
        this.soTinChiToiThieu = soTinChiToiThieu;
        this.khongNoMon = khongNoMon;
        this.phienBan = phienBan;
        this.ghiChu = ghiChu;
        this.mucHocBongXuatSac = mucHocBongXuatSac;
        this.mucHocBongGioi = mucHocBongGioi;
        this.mucHocBongKha = mucHocBongKha;
    }

    public String getMaQuyTac() { return maQuyTac; }
    public void setMaQuyTac(String maQuyTac) { this.maQuyTac = maQuyTac; }

    public DotXetHocBong getDotXetHocBong() { return dotXetHocBong; }
    public void setDotXetHocBong(DotXetHocBong dotXetHocBong) { this.dotXetHocBong = dotXetHocBong; }

    public BigDecimal getDiemTbDuoiThieu() { return diemTbDuoiThieu; }
    public void setDiemTbDuoiThieu(BigDecimal diemTbDuoiThieu) { this.diemTbDuoiThieu = diemTbDuoiThieu; }

    public BigDecimal getDiemRlToiThieu() { return diemRlToiThieu; }
    public void setDiemRlToiThieu(BigDecimal diemRlToiThieu) { this.diemRlToiThieu = diemRlToiThieu; }

    public Integer getSoTinChiToiThieu() { return soTinChiToiThieu; }
    public void setSoTinChiToiThieu(Integer soTinChiToiThieu) { this.soTinChiToiThieu = soTinChiToiThieu; }

    public Boolean getKhongNoMon() { return khongNoMon; }
    public void setKhongNoMon(Boolean khongNoMon) { this.khongNoMon = khongNoMon; }

    public Integer getPhienBan() { return phienBan; }
    public void setPhienBan(Integer phienBan) { this.phienBan = phienBan; }

    public String getGhiChu() { return ghiChu; }
    public void setGhiChu(String ghiChu) { this.ghiChu = ghiChu; }

    public BigDecimal getMucHocBongXuatSac() { return mucHocBongXuatSac; }
    public void setMucHocBongXuatSac(BigDecimal mucHocBongXuatSac) { this.mucHocBongXuatSac = mucHocBongXuatSac; }

    public BigDecimal getMucHocBongGioi() { return mucHocBongGioi; }
    public void setMucHocBongGioi(BigDecimal mucHocBongGioi) { this.mucHocBongGioi = mucHocBongGioi; }

    public BigDecimal getMucHocBongKha() { return mucHocBongKha; }
    public void setMucHocBongKha(BigDecimal mucHocBongKha) { this.mucHocBongKha = mucHocBongKha; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String maQuyTac;
        private DotXetHocBong dotXetHocBong;
        private BigDecimal diemTbDuoiThieu;
        private BigDecimal diemRlToiThieu;
        private Integer soTinChiToiThieu;
        private Boolean khongNoMon;
        private Integer phienBan;
        private String ghiChu;
        private BigDecimal mucHocBongXuatSac;
        private BigDecimal mucHocBongGioi;
        private BigDecimal mucHocBongKha;

        public Builder maQuyTac(String maQuyTac) { this.maQuyTac = maQuyTac; return this; }
        public Builder dotXetHocBong(DotXetHocBong dotXetHocBong) { this.dotXetHocBong = dotXetHocBong; return this; }
        public Builder diemTbDuoiThieu(BigDecimal diemTbDuoiThieu) { this.diemTbDuoiThieu = diemTbDuoiThieu; return this; }
        public Builder diemRlToiThieu(BigDecimal diemRlToiThieu) { this.diemRlToiThieu = diemRlToiThieu; return this; }
        public Builder soTinChiToiThieu(Integer soTinChiToiThieu) { this.soTinChiToiThieu = soTinChiToiThieu; return this; }
        public Builder khongNoMon(Boolean khongNoMon) { this.khongNoMon = khongNoMon; return this; }
        public Builder phienBan(Integer phienBan) { this.phienBan = phienBan; return this; }
        public Builder ghiChu(String ghiChu) { this.ghiChu = ghiChu; return this; }
        public Builder mucHocBongXuatSac(BigDecimal mucHocBongXuatSac) { this.mucHocBongXuatSac = mucHocBongXuatSac; return this; }
        public Builder mucHocBongGioi(BigDecimal mucHocBongGioi) { this.mucHocBongGioi = mucHocBongGioi; return this; }
        public Builder mucHocBongKha(BigDecimal mucHocBongKha) { this.mucHocBongKha = mucHocBongKha; return this; }

        public QuyTacHocBong build() {
            return new QuyTacHocBong(maQuyTac, dotXetHocBong, diemTbDuoiThieu, diemRlToiThieu, soTinChiToiThieu, khongNoMon, phienBan, ghiChu, mucHocBongXuatSac, mucHocBongGioi, mucHocBongKha);
        }
    }
}
