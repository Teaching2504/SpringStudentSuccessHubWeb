package com.nttt.dto;

import java.math.BigDecimal;
import java.util.List;

public class HoSoHocBongDTO {
    private String maHoSo;
    private String mssv;
    private String hoTen;
    private String maLop;
    private String maNganh;
    private String tenNganh;
    private String heDaoTao; // CHUAN, DAC_BIET, CHAT_LUONG_CAO
    private String tenHeDaoTao; // Chương trình Chuẩn (Đại trà), Chương trình Đặc biệt (CLC)
    private String maKhoa;
    private String tenKhoa;
    private String khoaHoc;

    private BigDecimal diemTrungBinh;
    private BigDecimal diemRenLuyen;
    private Integer soTinChi;
    private Boolean coHocPhanRot;

    private BigDecimal diemXet;
    private Integer thuHang;
    private String loaiHocBong; // XUAT_SAC, GIOI, KHA
    private BigDecimal mucHocBong;
    private String trangThai; // DU_KIEN, CHINH_THUC, KHONG_DAT, BI_LOAI

    private String maDotXetHbKhoa;
    private String maDot;
    private String tenDot;
    private String maHocKy;

    // Các trường mới hỗ trợ tính toán Quỹ 8% và Bảng điểm môn học
    private BigDecimal tongHocPhiKy;
    private Integer tyLeHocBong; // 100, 70, 50, 0
    private BigDecimal soTienNhanDuoc;
    private String trangThaiCapQuy; // "TRONG_QUY", "HET_QUY", "KHONG_DAT"
    private List<DiemHocPhanDTO> danhSachDiemMonHoc;

    public HoSoHocBongDTO() {}

    public HoSoHocBongDTO(String maHoSo, String mssv, String hoTen, String maLop, String maNganh, String tenNganh, String heDaoTao, String tenHeDaoTao, String maKhoa, String tenKhoa, String khoaHoc, BigDecimal diemTrungBinh, BigDecimal diemRenLuyen, Integer soTinChi, Boolean coHocPhanRot, BigDecimal diemXet, Integer thuHang, String loaiHocBong, BigDecimal mucHocBong, String trangThai, String maDotXetHbKhoa, String maDot, String tenDot, String maHocKy, BigDecimal tongHocPhiKy, Integer tyLeHocBong, BigDecimal soTienNhanDuoc, String trangThaiCapQuy, List<DiemHocPhanDTO> danhSachDiemMonHoc) {
        this.maHoSo = maHoSo;
        this.mssv = mssv;
        this.hoTen = hoTen;
        this.maLop = maLop;
        this.maNganh = maNganh;
        this.tenNganh = tenNganh;
        this.heDaoTao = heDaoTao;
        this.tenHeDaoTao = tenHeDaoTao;
        this.maKhoa = maKhoa;
        this.tenKhoa = tenKhoa;
        this.khoaHoc = khoaHoc;
        this.diemTrungBinh = diemTrungBinh;
        this.diemRenLuyen = diemRenLuyen;
        this.soTinChi = soTinChi;
        this.coHocPhanRot = coHocPhanRot;
        this.diemXet = diemXet;
        this.thuHang = thuHang;
        this.loaiHocBong = loaiHocBong;
        this.mucHocBong = mucHocBong;
        this.trangThai = trangThai;
        this.maDotXetHbKhoa = maDotXetHbKhoa;
        this.maDot = maDot;
        this.tenDot = tenDot;
        this.maHocKy = maHocKy;
        this.tongHocPhiKy = tongHocPhiKy;
        this.tyLeHocBong = tyLeHocBong;
        this.soTienNhanDuoc = soTienNhanDuoc;
        this.trangThaiCapQuy = trangThaiCapQuy;
        this.danhSachDiemMonHoc = danhSachDiemMonHoc;
    }

    public String getMaHoSo() { return maHoSo; }
    public void setMaHoSo(String maHoSo) { this.maHoSo = maHoSo; }

    public String getMssv() { return mssv; }
    public void setMssv(String mssv) { this.mssv = mssv; }

    public String getHoTen() { return hoTen; }
    public void setHoTen(String hoTen) { this.hoTen = hoTen; }

    public String getMaLop() { return maLop; }
    public void setMaLop(String maLop) { this.maLop = maLop; }

    public String getMaNganh() { return maNganh; }
    public void setMaNganh(String maNganh) { this.maNganh = maNganh; }

    public String getTenNganh() { return tenNganh; }
    public void setTenNganh(String tenNganh) { this.tenNganh = tenNganh; }

    public String getHeDaoTao() { return heDaoTao; }
    public void setHeDaoTao(String heDaoTao) { this.heDaoTao = heDaoTao; }

    public String getTenHeDaoTao() { return tenHeDaoTao; }
    public void setTenHeDaoTao(String tenHeDaoTao) { this.tenHeDaoTao = tenHeDaoTao; }

    public String getMaKhoa() { return maKhoa; }
    public void setMaKhoa(String maKhoa) { this.maKhoa = maKhoa; }

    public String getTenKhoa() { return tenKhoa; }
    public void setTenKhoa(String tenKhoa) { this.tenKhoa = tenKhoa; }

    public String getKhoaHoc() { return khoaHoc; }
    public void setKhoaHoc(String khoaHoc) { this.khoaHoc = khoaHoc; }

    public BigDecimal getDiemTrungBinh() { return diemTrungBinh; }
    public void setDiemTrungBinh(BigDecimal diemTrungBinh) { this.diemTrungBinh = diemTrungBinh; }

    public BigDecimal getDiemRenLuyen() { return diemRenLuyen; }
    public void setDiemRenLuyen(BigDecimal diemRenLuyen) { this.diemRenLuyen = diemRenLuyen; }

    public Integer getSoTinChi() { return soTinChi; }
    public void setSoTinChi(Integer soTinChi) { this.soTinChi = soTinChi; }

    public Boolean getCoHocPhanRot() { return coHocPhanRot; }
    public void setCoHocPhanRot(Boolean coHocPhanRot) { this.coHocPhanRot = coHocPhanRot; }

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

    public String getMaDotXetHbKhoa() { return maDotXetHbKhoa; }
    public void setMaDotXetHbKhoa(String maDotXetHbKhoa) { this.maDotXetHbKhoa = maDotXetHbKhoa; }

    public String getMaDot() { return maDot; }
    public void setMaDot(String maDot) { this.maDot = maDot; }

    public String getTenDot() { return tenDot; }
    public void setTenDot(String tenDot) { this.tenDot = tenDot; }

    public String getMaHocKy() { return maHocKy; }
    public void setMaHocKy(String maHocKy) { this.maHocKy = maHocKy; }

    public BigDecimal getTongHocPhiKy() { return tongHocPhiKy; }
    public void setTongHocPhiKy(BigDecimal tongHocPhiKy) { this.tongHocPhiKy = tongHocPhiKy; }

    public Integer getTyLeHocBong() { return tyLeHocBong; }
    public void setTyLeHocBong(Integer tyLeHocBong) { this.tyLeHocBong = tyLeHocBong; }

    public BigDecimal getSoTienNhanDuoc() { return soTienNhanDuoc; }
    public void setSoTienNhanDuoc(BigDecimal soTienNhanDuoc) { this.soTienNhanDuoc = soTienNhanDuoc; }

    public String getTrangThaiCapQuy() { return trangThaiCapQuy; }
    public void setTrangThaiCapQuy(String trangThaiCapQuy) { this.trangThaiCapQuy = trangThaiCapQuy; }

    public List<DiemHocPhanDTO> getDanhSachDiemMonHoc() { return danhSachDiemMonHoc; }
    public void setDanhSachDiemMonHoc(List<DiemHocPhanDTO> danhSachDiemMonHoc) { this.danhSachDiemMonHoc = danhSachDiemMonHoc; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String maHoSo;
        private String mssv;
        private String hoTen;
        private String maLop;
        private String maNganh;
        private String tenNganh;
        private String heDaoTao;
        private String tenHeDaoTao;
        private String maKhoa;
        private String tenKhoa;
        private String khoaHoc;
        private BigDecimal diemTrungBinh;
        private BigDecimal diemRenLuyen;
        private Integer soTinChi;
        private Boolean coHocPhanRot;
        private BigDecimal diemXet;
        private Integer thuHang;
        private String loaiHocBong;
        private BigDecimal mucHocBong;
        private String trangThai;
        private String maDotXetHbKhoa;
        private String maDot;
        private String tenDot;
        private String maHocKy;
        private BigDecimal tongHocPhiKy;
        private Integer tyLeHocBong;
        private BigDecimal soTienNhanDuoc;
        private String trangThaiCapQuy;
        private List<DiemHocPhanDTO> danhSachDiemMonHoc;

        public Builder maHoSo(String maHoSo) { this.maHoSo = maHoSo; return this; }
        public Builder mssv(String mssv) { this.mssv = mssv; return this; }
        public Builder hoTen(String hoTen) { this.hoTen = hoTen; return this; }
        public Builder maLop(String maLop) { this.maLop = maLop; return this; }
        public Builder maNganh(String maNganh) { this.maNganh = maNganh; return this; }
        public Builder tenNganh(String tenNganh) { this.tenNganh = tenNganh; return this; }
        public Builder heDaoTao(String heDaoTao) { this.heDaoTao = heDaoTao; return this; }
        public Builder tenHeDaoTao(String tenHeDaoTao) { this.tenHeDaoTao = tenHeDaoTao; return this; }
        public Builder maKhoa(String maKhoa) { this.maKhoa = maKhoa; return this; }
        public Builder tenKhoa(String tenKhoa) { this.tenKhoa = tenKhoa; return this; }
        public Builder khoaHoc(String khoaHoc) { this.khoaHoc = khoaHoc; return this; }
        public Builder diemTrungBinh(BigDecimal diemTrungBinh) { this.diemTrungBinh = diemTrungBinh; return this; }
        public Builder diemRenLuyen(BigDecimal diemRenLuyen) { this.diemRenLuyen = diemRenLuyen; return this; }
        public Builder soTinChi(Integer soTinChi) { this.soTinChi = soTinChi; return this; }
        public Builder coHocPhanRot(Boolean coHocPhanRot) { this.coHocPhanRot = coHocPhanRot; return this; }
        public Builder diemXet(BigDecimal diemXet) { this.diemXet = diemXet; return this; }
        public Builder thuHang(Integer thuHang) { this.thuHang = thuHang; return this; }
        public Builder loaiHocBong(String loaiHocBong) { this.loaiHocBong = loaiHocBong; return this; }
        public Builder mucHocBong(BigDecimal mucHocBong) { this.mucHocBong = mucHocBong; return this; }
        public Builder trangThai(String trangThai) { this.trangThai = trangThai; return this; }
        public Builder maDotXetHbKhoa(String maDotXetHbKhoa) { this.maDotXetHbKhoa = maDotXetHbKhoa; return this; }
        public Builder maDot(String maDot) { this.maDot = maDot; return this; }
        public Builder tenDot(String tenDot) { this.tenDot = tenDot; return this; }
        public Builder maHocKy(String maHocKy) { this.maHocKy = maHocKy; return this; }
        public Builder tongHocPhiKy(BigDecimal tongHocPhiKy) { this.tongHocPhiKy = tongHocPhiKy; return this; }
        public Builder tyLeHocBong(Integer tyLeHocBong) { this.tyLeHocBong = tyLeHocBong; return this; }
        public Builder soTienNhanDuoc(BigDecimal soTienNhanDuoc) { this.soTienNhanDuoc = soTienNhanDuoc; return this; }
        public Builder trangThaiCapQuy(String trangThaiCapQuy) { this.trangThaiCapQuy = trangThaiCapQuy; return this; }
        public Builder danhSachDiemMonHoc(List<DiemHocPhanDTO> danhSachDiemMonHoc) { this.danhSachDiemMonHoc = danhSachDiemMonHoc; return this; }

        public HoSoHocBongDTO build() {
            return new HoSoHocBongDTO(maHoSo, mssv, hoTen, maLop, maNganh, tenNganh, heDaoTao, tenHeDaoTao, maKhoa, tenKhoa, khoaHoc, diemTrungBinh, diemRenLuyen, soTinChi, coHocPhanRot, diemXet, thuHang, loaiHocBong, mucHocBong, trangThai, maDotXetHbKhoa, maDot, tenDot, maHocKy, tongHocPhiKy, tyLeHocBong, soTienNhanDuoc, trangThaiCapQuy, danhSachDiemMonHoc);
        }
    }
}
