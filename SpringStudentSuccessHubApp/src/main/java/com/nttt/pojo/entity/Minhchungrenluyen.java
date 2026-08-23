package com.nttt.pojo.entity;

import java.util.Date;
import java.io.Serializable;

/**
 * (Minhchungrenluyen)实体类
 *
 * @author makejava
 * @since 2026-08-24 00:38:11
 */
public class Minhchungrenluyen implements Serializable {
    private static final long serialVersionUID = -26534275679312039L;

    private String maminhchung;

    private String tenhoatdong;

    private Double diemdexuat;

    private String fileurl;

    private String mota;

    private String trangthai;

    private String mahoso;

    private String mssv;

    private String mahocky;

    private String manvpheduyet;

    private String lydophanhoi;

    private Date ngaytao;


    public String getMaminhchung() {
        return maminhchung;
    }

    public void setMaminhchung(String maminhchung) {
        this.maminhchung = maminhchung;
    }

    public String getTenhoatdong() {
        return tenhoatdong;
    }

    public void setTenhoatdong(String tenhoatdong) {
        this.tenhoatdong = tenhoatdong;
    }

    public Double getDiemdexuat() {
        return diemdexuat;
    }

    public void setDiemdexuat(Double diemdexuat) {
        this.diemdexuat = diemdexuat;
    }

    public String getFileurl() {
        return fileurl;
    }

    public void setFileurl(String fileurl) {
        this.fileurl = fileurl;
    }

    public String getMota() {
        return mota;
    }

    public void setMota(String mota) {
        this.mota = mota;
    }

    public String getTrangthai() {
        return trangthai;
    }

    public void setTrangthai(String trangthai) {
        this.trangthai = trangthai;
    }

    public String getMahoso() {
        return mahoso;
    }

    public void setMahoso(String mahoso) {
        this.mahoso = mahoso;
    }

    public String getMssv() {
        return mssv;
    }

    public void setMssv(String mssv) {
        this.mssv = mssv;
    }

    public String getMahocky() {
        return mahocky;
    }

    public void setMahocky(String mahocky) {
        this.mahocky = mahocky;
    }

    public String getManvpheduyet() {
        return manvpheduyet;
    }

    public void setManvpheduyet(String manvpheduyet) {
        this.manvpheduyet = manvpheduyet;
    }

    public String getLydophanhoi() {
        return lydophanhoi;
    }

    public void setLydophanhoi(String lydophanhoi) {
        this.lydophanhoi = lydophanhoi;
    }

    public Date getNgaytao() {
        return ngaytao;
    }

    public void setNgaytao(Date ngaytao) {
        this.ngaytao = ngaytao;
    }

}

