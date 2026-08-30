package com.nttt.dto;

import java.math.BigDecimal;

public class QuyHocBongNganhDTO {
    private String maKhoa;
    private String tenKhoa;
    private String maNganh;
    private String tenNganh;
    private String heDaoTao;
    private String khoaHoc;
    private String maHocKy;
    private Integer soSinhVienTong;
    private BigDecimal tongHocPhiThu;
    private BigDecimal quyHocBong8PhanTram;
    private BigDecimal tongTienDaCap;
    private BigDecimal tienConLai;
    private Integer soSinhVienDuDieuKien;
    private Integer soSinhVienDatHocBong;
    private BigDecimal nganSachKhoaHienTai;

    public QuyHocBongNganhDTO() {}

    public QuyHocBongNganhDTO(String maKhoa, String tenKhoa, String maNganh, String tenNganh, String heDaoTao, String khoaHoc, String maHocKy, Integer soSinhVienTong, BigDecimal tongHocPhiThu, BigDecimal quyHocBong8PhanTram, BigDecimal tongTienDaCap, BigDecimal tienConLai, Integer soSinhVienDuDieuKien, Integer soSinhVienDatHocBong, BigDecimal nganSachKhoaHienTai) {
        this.maKhoa = maKhoa;
        this.tenKhoa = tenKhoa;
        this.maNganh = maNganh;
        this.tenNganh = tenNganh;
        this.heDaoTao = heDaoTao;
        this.khoaHoc = khoaHoc;
        this.maHocKy = maHocKy;
        this.soSinhVienTong = soSinhVienTong;
        this.tongHocPhiThu = tongHocPhiThu;
        this.quyHocBong8PhanTram = quyHocBong8PhanTram;
        this.tongTienDaCap = tongTienDaCap;
        this.tienConLai = tienConLai;
        this.soSinhVienDuDieuKien = soSinhVienDuDieuKien;
        this.soSinhVienDatHocBong = soSinhVienDatHocBong;
        this.nganSachKhoaHienTai = nganSachKhoaHienTai;
    }

    public String getMaKhoa() { return maKhoa; }
    public void setMaKhoa(String maKhoa) { this.maKhoa = maKhoa; }

    public String getTenKhoa() { return tenKhoa; }
    public void setTenKhoa(String tenKhoa) { this.tenKhoa = tenKhoa; }

    public String getMaNganh() { return maNganh; }
    public void setMaNganh(String maNganh) { this.maNganh = maNganh; }

    public String getTenNganh() { return tenNganh; }
    public void setTenNganh(String tenNganh) { this.tenNganh = tenNganh; }

    public String getHeDaoTao() { return heDaoTao; }
    public void setHeDaoTao(String heDaoTao) { this.heDaoTao = heDaoTao; }

    public String getKhoaHoc() { return khoaHoc; }
    public void setKhoaHoc(String khoaHoc) { this.khoaHoc = khoaHoc; }

    public String getMaHocKy() { return maHocKy; }
    public void setMaHocKy(String maHocKy) { this.maHocKy = maHocKy; }

    public Integer getSoSinhVienTong() { return soSinhVienTong; }
    public void setSoSinhVienTong(Integer soSinhVienTong) { this.soSinhVienTong = soSinhVienTong; }

    public BigDecimal getTongHocPhiThu() { return tongHocPhiThu; }
    public void setTongHocPhiThu(BigDecimal tongHocPhiThu) { this.tongHocPhiThu = tongHocPhiThu; }

    public BigDecimal getQuyHocBong8PhanTram() { return quyHocBong8PhanTram; }
    public void setQuyHocBong8PhanTram(BigDecimal quyHocBong8PhanTram) { this.quyHocBong8PhanTram = quyHocBong8PhanTram; }

    public BigDecimal getTongTienDaCap() { return tongTienDaCap; }
    public void setTongTienDaCap(BigDecimal tongTienDaCap) { this.tongTienDaCap = tongTienDaCap; }

    public BigDecimal getTienConLai() { return tienConLai; }
    public void setTienConLai(BigDecimal tienConLai) { this.tienConLai = tienConLai; }

    public Integer getSoSinhVienDuDieuKien() { return soSinhVienDuDieuKien; }
    public void setSoSinhVienDuDieuKien(Integer soSinhVienDuDieuKien) { this.soSinhVienDuDieuKien = soSinhVienDuDieuKien; }

    public Integer getSoSinhVienDatHocBong() { return soSinhVienDatHocBong; }
    public void setSoSinhVienDatHocBong(Integer soSinhVienDatHocBong) { this.soSinhVienDatHocBong = soSinhVienDatHocBong; }

    public BigDecimal getNganSachKhoaHienTai() { return nganSachKhoaHienTai; }
    public void setNganSachKhoaHienTai(BigDecimal nganSachKhoaHienTai) { this.nganSachKhoaHienTai = nganSachKhoaHienTai; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String maKhoa;
        private String tenKhoa;
        private String maNganh;
        private String tenNganh;
        private String heDaoTao;
        private String khoaHoc;
        private String maHocKy;
        private Integer soSinhVienTong;
        private BigDecimal tongHocPhiThu;
        private BigDecimal quyHocBong8PhanTram;
        private BigDecimal tongTienDaCap;
        private BigDecimal tienConLai;
        private Integer soSinhVienDuDieuKien;
        private Integer soSinhVienDatHocBong;
        private BigDecimal nganSachKhoaHienTai;

        public Builder maKhoa(String maKhoa) { this.maKhoa = maKhoa; return this; }
        public Builder tenKhoa(String tenKhoa) { this.tenKhoa = tenKhoa; return this; }
        public Builder maNganh(String maNganh) { this.maNganh = maNganh; return this; }
        public Builder tenNganh(String tenNganh) { this.tenNganh = tenNganh; return this; }
        public Builder heDaoTao(String heDaoTao) { this.heDaoTao = heDaoTao; return this; }
        public Builder khoaHoc(String khoaHoc) { this.khoaHoc = khoaHoc; return this; }
        public Builder maHocKy(String maHocKy) { this.maHocKy = maHocKy; return this; }
        public Builder soSinhVienTong(Integer soSinhVienTong) { this.soSinhVienTong = soSinhVienTong; return this; }
        public Builder tongHocPhiThu(BigDecimal tongHocPhiThu) { this.tongHocPhiThu = tongHocPhiThu; return this; }
        public Builder quyHocBong8PhanTram(BigDecimal quyHocBong8PhanTram) { this.quyHocBong8PhanTram = quyHocBong8PhanTram; return this; }
        public Builder tongTienDaCap(BigDecimal tongTienDaCap) { this.tongTienDaCap = tongTienDaCap; return this; }
        public Builder tienConLai(BigDecimal tienConLai) { this.tienConLai = tienConLai; return this; }
        public Builder soSinhVienDuDieuKien(Integer soSinhVienDuDieuKien) { this.soSinhVienDuDieuKien = soSinhVienDuDieuKien; return this; }
        public Builder soSinhVienDatHocBong(Integer soSinhVienDatHocBong) { this.soSinhVienDatHocBong = soSinhVienDatHocBong; return this; }
        public Builder nganSachKhoaHienTai(BigDecimal nganSachKhoaHienTai) { this.nganSachKhoaHienTai = nganSachKhoaHienTai; return this; }

        public QuyHocBongNganhDTO build() {
            return new QuyHocBongNganhDTO(maKhoa, tenKhoa, maNganh, tenNganh, heDaoTao, khoaHoc, maHocKy, soSinhVienTong, tongHocPhiThu, quyHocBong8PhanTram, tongTienDaCap, tienConLai, soSinhVienDuDieuKien, soSinhVienDatHocBong, nganSachKhoaHienTai);
        }
    }
}
