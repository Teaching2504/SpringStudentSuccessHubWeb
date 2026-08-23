package com.nttt.pojo.entity;

import java.util.Date;
import java.io.Serializable;

/**
 * (Sinhvien)实体类
 *
 * @author makejava
 * @since 2026-08-24 00:38:11
 */
public class Sinhvien implements Serializable {
    private static final long serialVersionUID = -13642651211285111L;

    private String mssv;

    private String cccd;

    private Long nguoidungid;

    private Date ngaysinh;

    private String gioitinh;

    private String diachi;

    private String trangthaihoc;

    private String malop;


    public String getMssv() {
        return mssv;
    }

    public void setMssv(String mssv) {
        this.mssv = mssv;
    }

    public String getCccd() {
        return cccd;
    }

    public void setCccd(String cccd) {
        this.cccd = cccd;
    }

    public Long getNguoidungid() {
        return nguoidungid;
    }

    public void setNguoidungid(Long nguoidungid) {
        this.nguoidungid = nguoidungid;
    }

    public Date getNgaysinh() {
        return ngaysinh;
    }

    public void setNgaysinh(Date ngaysinh) {
        this.ngaysinh = ngaysinh;
    }

    public String getGioitinh() {
        return gioitinh;
    }

    public void setGioitinh(String gioitinh) {
        this.gioitinh = gioitinh;
    }

    public String getDiachi() {
        return diachi;
    }

    public void setDiachi(String diachi) {
        this.diachi = diachi;
    }

    public String getTrangthaihoc() {
        return trangthaihoc;
    }

    public void setTrangthaihoc(String trangthaihoc) {
        this.trangthaihoc = trangthaihoc;
    }

    public String getMalop() {
        return malop;
    }

    public void setMalop(String malop) {
        this.malop = malop;
    }

}

