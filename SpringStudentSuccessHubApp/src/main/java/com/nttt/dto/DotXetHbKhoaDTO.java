package com.nttt.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class DotXetHbKhoaDTO {
    private String maDotXetHbKhoa;
    private String maDot;
    private String tenDot;
    private String maKhoa;
    private String tenKhoa;
    private Integer chiTieu;
    private BigDecimal nganSachKhoa;
    private LocalDate hanPhanHoi;
    private String trangThai; // CHUA_XET, DA_CONG_BO_DU_KIEN, DA_CHOT_GUI_TRUONG, DA_PHE_DUYET, BI_TRA_VE
    private String lyDoTraVe;
    private Integer soLuongDuKien;
    private Integer soLuongChinhThuc;
    private Integer soKienNghiChuaXuLy;

    public DotXetHbKhoaDTO() {}

    public DotXetHbKhoaDTO(String maDotXetHbKhoa, String maDot, String tenDot, String maKhoa, String tenKhoa, Integer chiTieu, BigDecimal nganSachKhoa, LocalDate hanPhanHoi, String trangThai, String lyDoTraVe, Integer soLuongDuKien, Integer soLuongChinhThuc, Integer soKienNghiChuaXuLy) {
        this.maDotXetHbKhoa = maDotXetHbKhoa;
        this.maDot = maDot;
        this.tenDot = tenDot;
        this.maKhoa = maKhoa;
        this.tenKhoa = tenKhoa;
        this.chiTieu = chiTieu;
        this.nganSachKhoa = nganSachKhoa;
        this.hanPhanHoi = hanPhanHoi;
        this.trangThai = trangThai;
        this.lyDoTraVe = lyDoTraVe;
        this.soLuongDuKien = soLuongDuKien;
        this.soLuongChinhThuc = soLuongChinhThuc;
        this.soKienNghiChuaXuLy = soKienNghiChuaXuLy;
    }

    public String getMaDotXetHbKhoa() { return maDotXetHbKhoa; }
    public void setMaDotXetHbKhoa(String maDotXetHbKhoa) { this.maDotXetHbKhoa = maDotXetHbKhoa; }

    public String getMaDot() { return maDot; }
    public void setMaDot(String maDot) { this.maDot = maDot; }

    public String getTenDot() { return tenDot; }
    public void setTenDot(String tenDot) { this.tenDot = tenDot; }

    public String getMaKhoa() { return maKhoa; }
    public void setMaKhoa(String maKhoa) { this.maKhoa = maKhoa; }

    public String getTenKhoa() { return tenKhoa; }
    public void setTenKhoa(String tenKhoa) { this.tenKhoa = tenKhoa; }

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

    public Integer getSoLuongDuKien() { return soLuongDuKien; }
    public void setSoLuongDuKien(Integer soLuongDuKien) { this.soLuongDuKien = soLuongDuKien; }

    public Integer getSoLuongChinhThuc() { return soLuongChinhThuc; }
    public void setSoLuongChinhThuc(Integer soLuongChinhThuc) { this.soLuongChinhThuc = soLuongChinhThuc; }

    public Integer getSoKienNghiChuaXuLy() { return soKienNghiChuaXuLy; }
    public void setSoKienNghiChuaXuLy(Integer soKienNghiChuaXuLy) { this.soKienNghiChuaXuLy = soKienNghiChuaXuLy; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String maDotXetHbKhoa;
        private String maDot;
        private String tenDot;
        private String maKhoa;
        private String tenKhoa;
        private Integer chiTieu;
        private BigDecimal nganSachKhoa;
        private LocalDate hanPhanHoi;
        private String trangThai;
        private String lyDoTraVe;
        private Integer soLuongDuKien;
        private Integer soLuongChinhThuc;
        private Integer soKienNghiChuaXuLy;

        public Builder maDotXetHbKhoa(String maDotXetHbKhoa) { this.maDotXetHbKhoa = maDotXetHbKhoa; return this; }
        public Builder maDot(String maDot) { this.maDot = maDot; return this; }
        public Builder tenDot(String tenDot) { this.tenDot = tenDot; return this; }
        public Builder maKhoa(String maKhoa) { this.maKhoa = maKhoa; return this; }
        public Builder tenKhoa(String tenKhoa) { this.tenKhoa = tenKhoa; return this; }
        public Builder chiTieu(Integer chiTieu) { this.chiTieu = chiTieu; return this; }
        public Builder nganSachKhoa(BigDecimal nganSachKhoa) { this.nganSachKhoa = nganSachKhoa; return this; }
        public Builder hanPhanHoi(LocalDate hanPhanHoi) { this.hanPhanHoi = hanPhanHoi; return this; }
        public Builder trangThai(String trangThai) { this.trangThai = trangThai; return this; }
        public Builder lyDoTraVe(String lyDoTraVe) { this.lyDoTraVe = lyDoTraVe; return this; }
        public Builder soLuongDuKien(Integer soLuongDuKien) { this.soLuongDuKien = soLuongDuKien; return this; }
        public Builder soLuongChinhThuc(Integer soLuongChinhThuc) { this.soLuongChinhThuc = soLuongChinhThuc; return this; }
        public Builder soKienNghiChuaXuLy(Integer soKienNghiChuaXuLy) { this.soKienNghiChuaXuLy = soKienNghiChuaXuLy; return this; }

        public DotXetHbKhoaDTO build() {
            return new DotXetHbKhoaDTO(maDotXetHbKhoa, maDot, tenDot, maKhoa, tenKhoa, chiTieu, nganSachKhoa, hanPhanHoi, trangThai, lyDoTraVe, soLuongDuKien, soLuongChinhThuc, soKienNghiChuaXuLy);
        }
    }
}
