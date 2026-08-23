package com.nttt.pojo;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "dotxethbkhoa")
public class DotXetHbKhoa {

    @Id
    @Column(name = "maDotXetHbKhoa", length = 30)
    private String maDotXetHbKhoa;

    @Column(name = "chiTieu")
    private Integer chiTieu;

    @Column(name = "nganSachKhoa", precision = 15, scale = 2)
    private BigDecimal nganSachKhoa;

    @Column(name = "hanPhanHoi")
    private LocalDate hanPhanHoi;

    @Column(name = "trangThai", length = 50)
    private String trangThai; // CHUA_XET, DA_CONG_BO_DU_KIEN, DA_CHOT_GUI_TRUONG, DA_PHE_DUYET, BI_TRA_VE

    @Column(name = "lyDoTraVe", columnDefinition = "TEXT")
    private String lyDoTraVe;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "maDot", nullable = false)
    private DotXetHocBong dotXetHocBong;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "maKhoa", nullable = false)
    private Khoa khoa;

    public DotXetHbKhoa() {}

    public DotXetHbKhoa(String maDotXetHbKhoa, Integer chiTieu, BigDecimal nganSachKhoa, LocalDate hanPhanHoi, String trangThai, String lyDoTraVe, DotXetHocBong dotXetHocBong, Khoa khoa) {
        this.maDotXetHbKhoa = maDotXetHbKhoa;
        this.chiTieu = chiTieu;
        this.nganSachKhoa = nganSachKhoa;
        this.hanPhanHoi = hanPhanHoi;
        this.trangThai = trangThai;
        this.lyDoTraVe = lyDoTraVe;
        this.dotXetHocBong = dotXetHocBong;
        this.khoa = khoa;
    }

    public String getMaDotXetHbKhoa() { return maDotXetHbKhoa; }
    public void setMaDotXetHbKhoa(String maDotXetHbKhoa) { this.maDotXetHbKhoa = maDotXetHbKhoa; }

    public Integer getChiTieu() { return chiTieu; }
    public void setChiTieu(Integer chiTieu) { this.chiTieu = chiTieu; }

    public BigDecimal getNganSachKhoa() { return nganSachKhoa; }
    public void setNganSachKhoa(BigDecimal nganSachKhoa) { this.nganSachKhoa = nganSachKhoa; }

    public LocalDate getHanPhanHoi() { return hanPhanHoi; }
    public void setHanPhanHoi(LocalDate hanPhanHoi) { this.hanPhanHoi = hanPhanHoi; }

    public String getTrangThai() { return trangThai; }
    public void setTrangThai(String trangThai) { this.trangThai = trangThai; }

    public String getLyDoTraVe() { return lyDoTraVe; }
    public void setLyDoTraVe(String lyDoTraVe) { this.lyDoTraVe = lyDoTraVe; }

    public DotXetHocBong getDotXetHocBong() { return dotXetHocBong; }
    public void setDotXetHocBong(DotXetHocBong dotXetHocBong) { this.dotXetHocBong = dotXetHocBong; }

    public Khoa getKhoa() { return khoa; }
    public void setKhoa(Khoa khoa) { this.khoa = khoa; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String maDotXetHbKhoa;
        private Integer chiTieu;
        private BigDecimal nganSachKhoa;
        private LocalDate hanPhanHoi;
        private String trangThai;
        private String lyDoTraVe;
        private DotXetHocBong dotXetHocBong;
        private Khoa khoa;

        public Builder maDotXetHbKhoa(String maDotXetHbKhoa) { this.maDotXetHbKhoa = maDotXetHbKhoa; return this; }
        public Builder chiTieu(Integer chiTieu) { this.chiTieu = chiTieu; return this; }
        public Builder nganSachKhoa(BigDecimal nganSachKhoa) { this.nganSachKhoa = nganSachKhoa; return this; }
        public Builder hanPhanHoi(LocalDate hanPhanHoi) { this.hanPhanHoi = hanPhanHoi; return this; }
        public Builder trangThai(String trangThai) { this.trangThai = trangThai; return this; }
        public Builder lyDoTraVe(String lyDoTraVe) { this.lyDoTraVe = lyDoTraVe; return this; }
        public Builder dotXetHocBong(DotXetHocBong dotXetHocBong) { this.dotXetHocBong = dotXetHocBong; return this; }
        public Builder khoa(Khoa khoa) { this.khoa = khoa; return this; }

        public DotXetHbKhoa build() {
            return new DotXetHbKhoa(maDotXetHbKhoa, chiTieu, nganSachKhoa, hanPhanHoi, trangThai, lyDoTraVe, dotXetHocBong, khoa);
        }
    }
}
