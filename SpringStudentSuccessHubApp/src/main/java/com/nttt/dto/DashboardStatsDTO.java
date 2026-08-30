package com.nttt.dto;

import java.math.BigDecimal;
import java.util.Map;

public class DashboardStatsDTO {
    private long tongSinhVien;
    private long tongKhoa;
    private long tongNganh;
    private long tongLop;
    private long tongDotXet;
    private long tongHoSoDatHocBong;
    private BigDecimal tongKinhPhiHocBong;

    private long soMinhChungChoDuyet;
    private long soKienNghiChoXuLy;
    private long soSinhVienCanhBao;

    // Charts data
    private Map<String, Long> hocBongTheoKhoa;
    private Map<String, BigDecimal> kinhPhiTheoKhoa;
    private Map<String, Long> phanBoLoaiHocBong;

    public DashboardStatsDTO() {}

    public DashboardStatsDTO(long tongSinhVien, long tongKhoa, long tongNganh, long tongLop, long tongDotXet, long tongHoSoDatHocBong, BigDecimal tongKinhPhiHocBong, long soMinhChungChoDuyet, long soKienNghiChoXuLy, long soSinhVienCanhBao, Map<String, Long> hocBongTheoKhoa, Map<String, BigDecimal> kinhPhiTheoKhoa, Map<String, Long> phanBoLoaiHocBong) {
        this.tongSinhVien = tongSinhVien;
        this.tongKhoa = tongKhoa;
        this.tongNganh = tongNganh;
        this.tongLop = tongLop;
        this.tongDotXet = tongDotXet;
        this.tongHoSoDatHocBong = tongHoSoDatHocBong;
        this.tongKinhPhiHocBong = tongKinhPhiHocBong;
        this.soMinhChungChoDuyet = soMinhChungChoDuyet;
        this.soKienNghiChoXuLy = soKienNghiChoXuLy;
        this.soSinhVienCanhBao = soSinhVienCanhBao;
        this.hocBongTheoKhoa = hocBongTheoKhoa;
        this.kinhPhiTheoKhoa = kinhPhiTheoKhoa;
        this.phanBoLoaiHocBong = phanBoLoaiHocBong;
    }

    public long getTongSinhVien() { return tongSinhVien; }
    public void setTongSinhVien(long tongSinhVien) { this.tongSinhVien = tongSinhVien; }

    public long getTongKhoa() { return tongKhoa; }
    public void setTongKhoa(long tongKhoa) { this.tongKhoa = tongKhoa; }

    public long getTongNganh() { return tongNganh; }
    public void setTongNganh(long tongNganh) { this.tongNganh = tongNganh; }

    public long getTongLop() { return tongLop; }
    public void setTongLop(long tongLop) { this.tongLop = tongLop; }

    public long getTongDotXet() { return tongDotXet; }
    public void setTongDotXet(long tongDotXet) { this.tongDotXet = tongDotXet; }

    public long getTongHoSoDatHocBong() { return tongHoSoDatHocBong; }
    public void setTongHoSoDatHocBong(long tongHoSoDatHocBong) { this.tongHoSoDatHocBong = tongHoSoDatHocBong; }

    public BigDecimal getTongKinhPhiHocBong() { return tongKinhPhiHocBong; }
    public void setTongKinhPhiHocBong(BigDecimal tongKinhPhiHocBong) { this.tongKinhPhiHocBong = tongKinhPhiHocBong; }

    public long getSoMinhChungChoDuyet() { return soMinhChungChoDuyet; }
    public void setSoMinhChungChoDuyet(long soMinhChungChoDuyet) { this.soMinhChungChoDuyet = soMinhChungChoDuyet; }

    public long getSoKienNghiChoXuLy() { return soKienNghiChoXuLy; }
    public void setSoKienNghiChoXuLy(long soKienNghiChoXuLy) { this.soKienNghiChoXuLy = soKienNghiChoXuLy; }

    public long getSoSinhVienCanhBao() { return soSinhVienCanhBao; }
    public void setSoSinhVienCanhBao(long soSinhVienCanhBao) { this.soSinhVienCanhBao = soSinhVienCanhBao; }

    public Map<String, Long> getHocBongTheoKhoa() { return hocBongTheoKhoa; }
    public void setHocBongTheoKhoa(Map<String, Long> hocBongTheoKhoa) { this.hocBongTheoKhoa = hocBongTheoKhoa; }

    public Map<String, BigDecimal> getKinhPhiTheoKhoa() { return kinhPhiTheoKhoa; }
    public void setKinhPhiTheoKhoa(Map<String, BigDecimal> kinhPhiTheoKhoa) { this.kinhPhiTheoKhoa = kinhPhiTheoKhoa; }

    public Map<String, Long> getPhanBoLoaiHocBong() { return phanBoLoaiHocBong; }
    public void setPhanBoLoaiHocBong(Map<String, Long> phanBoLoaiHocBong) { this.phanBoLoaiHocBong = phanBoLoaiHocBong; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private long tongSinhVien;
        private long tongKhoa;
        private long tongNganh;
        private long tongLop;
        private long tongDotXet;
        private long tongHoSoDatHocBong;
        private BigDecimal tongKinhPhiHocBong;
        private long soMinhChungChoDuyet;
        private long soKienNghiChoXuLy;
        private long soSinhVienCanhBao;
        private Map<String, Long> hocBongTheoKhoa;
        private Map<String, BigDecimal> kinhPhiTheoKhoa;
        private Map<String, Long> phanBoLoaiHocBong;

        public Builder tongSinhVien(long tongSinhVien) { this.tongSinhVien = tongSinhVien; return this; }
        public Builder tongKhoa(long tongKhoa) { this.tongKhoa = tongKhoa; return this; }
        public Builder tongNganh(long tongNganh) { this.tongNganh = tongNganh; return this; }
        public Builder tongLop(long tongLop) { this.tongLop = tongLop; return this; }
        public Builder tongDotXet(long tongDotXet) { this.tongDotXet = tongDotXet; return this; }
        public Builder tongHoSoDatHocBong(long tongHoSoDatHocBong) { this.tongHoSoDatHocBong = tongHoSoDatHocBong; return this; }
        public Builder tongKinhPhiHocBong(BigDecimal tongKinhPhiHocBong) { this.tongKinhPhiHocBong = tongKinhPhiHocBong; return this; }
        public Builder soMinhChungChoDuyet(long soMinhChungChoDuyet) { this.soMinhChungChoDuyet = soMinhChungChoDuyet; return this; }
        public Builder soKienNghiChoXuLy(long soKienNghiChoXuLy) { this.soKienNghiChoXuLy = soKienNghiChoXuLy; return this; }
        public Builder soSinhVienCanhBao(long soSinhVienCanhBao) { this.soSinhVienCanhBao = soSinhVienCanhBao; return this; }
        public Builder hocBongTheoKhoa(Map<String, Long> hocBongTheoKhoa) { this.hocBongTheoKhoa = hocBongTheoKhoa; return this; }
        public Builder kinhPhiTheoKhoa(Map<String, BigDecimal> kinhPhiTheoKhoa) { this.kinhPhiTheoKhoa = kinhPhiTheoKhoa; return this; }
        public Builder phanBoLoaiHocBong(Map<String, Long> phanBoLoaiHocBong) { this.phanBoLoaiHocBong = phanBoLoaiHocBong; return this; }

        public DashboardStatsDTO build() {
            return new DashboardStatsDTO(tongSinhVien, tongKhoa, tongNganh, tongLop, tongDotXet, tongHoSoDatHocBong, tongKinhPhiHocBong, soMinhChungChoDuyet, soKienNghiChoXuLy, soSinhVienCanhBao, hocBongTheoKhoa, kinhPhiTheoKhoa, phanBoLoaiHocBong);
        }
    }
}
