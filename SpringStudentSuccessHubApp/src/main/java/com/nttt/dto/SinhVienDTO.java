package com.nttt.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class SinhVienDTO {
    private String mssv;
    private String cccd;
    private Long nguoiDungId;
    private String hoTen;
    private String email;
    private String soDienThoai;
    private LocalDate ngaySinh;
    private String gioiTinh;
    private String diaChi;
    private String trangThaiHoc;
    private String maLop;
    private String tenLop;
    private String khoaHoc;
    private String maNganh;
    private String tenNganh;
    private String maKhoa;
    private String tenKhoa;

    // Academic performance summary
    private BigDecimal diemTrungBinh;
    private Integer soTinChi;
    private Boolean coHocPhanRot;
    private BigDecimal diemRenLuyen;
    private String xepLoaiRenLuyen;
    private String canhBao; // "Bình thường", "Cảnh báo GPA thấp", "Cảnh báo DRL thấp", "Cảnh báo nợ môn"

    public SinhVienDTO() {}

    public SinhVienDTO(String mssv, String cccd, Long nguoiDungId, String hoTen, String email, String soDienThoai, LocalDate ngaySinh, String gioiTinh, String diaChi, String trangThaiHoc, String maLop, String tenLop, String khoaHoc, String maNganh, String tenNganh, String maKhoa, String tenKhoa, BigDecimal diemTrungBinh, Integer soTinChi, Boolean coHocPhanRot, BigDecimal diemRenLuyen, String xepLoaiRenLuyen, String canhBao) {
        this.mssv = mssv;
        this.cccd = cccd;
        this.nguoiDungId = nguoiDungId;
        this.hoTen = hoTen;
        this.email = email;
        this.soDienThoai = soDienThoai;
        this.ngaySinh = ngaySinh;
        this.gioiTinh = gioiTinh;
        this.diaChi = diaChi;
        this.trangThaiHoc = trangThaiHoc;
        this.maLop = maLop;
        this.tenLop = tenLop;
        this.khoaHoc = khoaHoc;
        this.maNganh = maNganh;
        this.tenNganh = tenNganh;
        this.maKhoa = maKhoa;
        this.tenKhoa = tenKhoa;
        this.diemTrungBinh = diemTrungBinh;
        this.soTinChi = soTinChi;
        this.coHocPhanRot = coHocPhanRot;
        this.diemRenLuyen = diemRenLuyen;
        this.xepLoaiRenLuyen = xepLoaiRenLuyen;
        this.canhBao = canhBao;
    }

    public String getMssv() { return mssv; }
    public void setMssv(String mssv) { this.mssv = mssv; }

    public String getCccd() { return cccd; }
    public void setCccd(String cccd) { this.cccd = cccd; }

    public Long getNguoiDungId() { return nguoiDungId; }
    public void setNguoiDungId(Long nguoiDungId) { this.nguoiDungId = nguoiDungId; }

    public String getHoTen() { return hoTen; }
    public void setHoTen(String hoTen) { this.hoTen = hoTen; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSoDienThoai() { return soDienThoai; }
    public void setSoDienThoai(String soDienThoai) { this.soDienThoai = soDienThoai; }

    public LocalDate getNgaySinh() { return ngaySinh; }
    public void setNgaySinh(LocalDate ngaySinh) { this.ngaySinh = ngaySinh; }

    public String getGioiTinh() { return gioiTinh; }
    public void setGioiTinh(String gioiTinh) { this.gioiTinh = gioiTinh; }

    public String getDiaChi() { return diaChi; }
    public void setDiaChi(String diaChi) { this.diaChi = diaChi; }

    public String getTrangThaiHoc() { return trangThaiHoc; }
    public void setTrangThaiHoc(String trangThaiHoc) { this.trangThaiHoc = trangThaiHoc; }

    public String getMaLop() { return maLop; }
    public void setMaLop(String maLop) { this.maLop = maLop; }

    public String getTenLop() { return tenLop; }
    public void setTenLop(String tenLop) { this.tenLop = tenLop; }

    public String getKhoaHoc() { return khoaHoc; }
    public void setKhoaHoc(String khoaHoc) { this.khoaHoc = khoaHoc; }

    public String getMaNganh() { return maNganh; }
    public void setMaNganh(String maNganh) { this.maNganh = maNganh; }

    public String getTenNganh() { return tenNganh; }
    public void setTenNganh(String tenNganh) { this.tenNganh = tenNganh; }

    public String getMaKhoa() { return maKhoa; }
    public void setMaKhoa(String maKhoa) { this.maKhoa = maKhoa; }

    public String getTenKhoa() { return tenKhoa; }
    public void setTenKhoa(String tenKhoa) { this.tenKhoa = tenKhoa; }

    public BigDecimal getDiemTrungBinh() { return diemTrungBinh; }
    public void setDiemTrungBinh(BigDecimal diemTrungBinh) { this.diemTrungBinh = diemTrungBinh; }

    public Integer getSoTinChi() { return soTinChi; }
    public void setSoTinChi(Integer soTinChi) { this.soTinChi = soTinChi; }

    public Boolean getCoHocPhanRot() { return coHocPhanRot; }
    public void setCoHocPhanRot(Boolean coHocPhanRot) { this.coHocPhanRot = coHocPhanRot; }

    public BigDecimal getDiemRenLuyen() { return diemRenLuyen; }
    public void setDiemRenLuyen(BigDecimal diemRenLuyen) { this.diemRenLuyen = diemRenLuyen; }

    public String getXepLoaiRenLuyen() { return xepLoaiRenLuyen; }
    public void setXepLoaiRenLuyen(String xepLoaiRenLuyen) { this.xepLoaiRenLuyen = xepLoaiRenLuyen; }

    public String getCanhBao() { return canhBao; }
    public void setCanhBao(String canhBao) { this.canhBao = canhBao; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String mssv;
        private String cccd;
        private Long nguoiDungId;
        private String hoTen;
        private String email;
        private String soDienThoai;
        private LocalDate ngaySinh;
        private String gioiTinh;
        private String diaChi;
        private String trangThaiHoc;
        private String maLop;
        private String tenLop;
        private String khoaHoc;
        private String maNganh;
        private String tenNganh;
        private String maKhoa;
        private String tenKhoa;
        private BigDecimal diemTrungBinh;
        private Integer soTinChi;
        private Boolean coHocPhanRot;
        private BigDecimal diemRenLuyen;
        private String xepLoaiRenLuyen;
        private String canhBao;

        public Builder mssv(String mssv) { this.mssv = mssv; return this; }
        public Builder cccd(String cccd) { this.cccd = cccd; return this; }
        public Builder nguoiDungId(Long nguoiDungId) { this.nguoiDungId = nguoiDungId; return this; }
        public Builder hoTen(String hoTen) { this.hoTen = hoTen; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder soDienThoai(String soDienThoai) { this.soDienThoai = soDienThoai; return this; }
        public Builder ngaySinh(LocalDate ngaySinh) { this.ngaySinh = ngaySinh; return this; }
        public Builder gioiTinh(String gioiTinh) { this.gioiTinh = gioiTinh; return this; }
        public Builder diaChi(String diaChi) { this.diaChi = diaChi; return this; }
        public Builder trangThaiHoc(String trangThaiHoc) { this.trangThaiHoc = trangThaiHoc; return this; }
        public Builder maLop(String maLop) { this.maLop = maLop; return this; }
        public Builder tenLop(String tenLop) { this.tenLop = tenLop; return this; }
        public Builder khoaHoc(String khoaHoc) { this.khoaHoc = khoaHoc; return this; }
        public Builder maNganh(String maNganh) { this.maNganh = maNganh; return this; }
        public Builder tenNganh(String tenNganh) { this.tenNganh = tenNganh; return this; }
        public Builder maKhoa(String maKhoa) { this.maKhoa = maKhoa; return this; }
        public Builder tenKhoa(String tenKhoa) { this.tenKhoa = tenKhoa; return this; }
        public Builder diemTrungBinh(BigDecimal diemTrungBinh) { this.diemTrungBinh = diemTrungBinh; return this; }
        public Builder soTinChi(Integer soTinChi) { this.soTinChi = soTinChi; return this; }
        public Builder coHocPhanRot(Boolean coHocPhanRot) { this.coHocPhanRot = coHocPhanRot; return this; }
        public Builder diemRenLuyen(BigDecimal diemRenLuyen) { this.diemRenLuyen = diemRenLuyen; return this; }
        public Builder xepLoaiRenLuyen(String xepLoaiRenLuyen) { this.xepLoaiRenLuyen = xepLoaiRenLuyen; return this; }
        public Builder canhBao(String canhBao) { this.canhBao = canhBao; return this; }

        public SinhVienDTO build() {
            return new SinhVienDTO(mssv, cccd, nguoiDungId, hoTen, email, soDienThoai, ngaySinh, gioiTinh, diaChi, trangThaiHoc, maLop, tenLop, khoaHoc, maNganh, tenNganh, maKhoa, tenKhoa, diemTrungBinh, soTinChi, coHocPhanRot, diemRenLuyen, xepLoaiRenLuyen, canhBao);
        }
    }
}
