package com.nttt.pojo.entity;

import java.util.Date;
import java.io.Serializable;

/**
 * (Dotxethocbong)实体类
 *
 * @author makejava
 * @since 2026-08-24 00:38:10
 */
public class Dotxethocbong implements Serializable {
    private static final long serialVersionUID = -48105515065480964L;

    private String madot;

    private String tendot;

    private Date ngaybatdau;

    private Date ngayketthuc;

    private String mahocky;

    private String trangthai;


    public String getMadot() {
        return madot;
    }

    public void setMadot(String madot) {
        this.madot = madot;
    }

    public String getTendot() {
        return tendot;
    }

    public void setTendot(String tendot) {
        this.tendot = tendot;
    }

    public Date getNgaybatdau() {
        return ngaybatdau;
    }

    public void setNgaybatdau(Date ngaybatdau) {
        this.ngaybatdau = ngaybatdau;
    }

    public Date getNgayketthuc() {
        return ngayketthuc;
    }

    public void setNgayketthuc(Date ngayketthuc) {
        this.ngayketthuc = ngayketthuc;
    }

    public String getMahocky() {
        return mahocky;
    }

    public void setMahocky(String mahocky) {
        this.mahocky = mahocky;
    }

    public String getTrangthai() {
        return trangthai;
    }

    public void setTrangthai(String trangthai) {
        this.trangthai = trangthai;
    }

}

