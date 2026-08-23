package com.nttt.pojo.entity;

import java.util.Date;
import java.io.Serializable;

/**
 * (Kiennghi)实体类
 *
 * @author makejava
 * @since 2026-08-24 00:38:11
 */
public class Kiennghi implements Serializable {
    private static final long serialVersionUID = 579229616456463494L;

    private String makiennghi;

    private String noidung;

    private String tepminhchung;

    private String trangthai;

    private String madotxethbkhoa;

    private String mahoso;

    private String manvxuly;

    private String phanhoi;

    private Date ngaygui;


    public String getMakiennghi() {
        return makiennghi;
    }

    public void setMakiennghi(String makiennghi) {
        this.makiennghi = makiennghi;
    }

    public String getNoidung() {
        return noidung;
    }

    public void setNoidung(String noidung) {
        this.noidung = noidung;
    }

    public String getTepminhchung() {
        return tepminhchung;
    }

    public void setTepminhchung(String tepminhchung) {
        this.tepminhchung = tepminhchung;
    }

    public String getTrangthai() {
        return trangthai;
    }

    public void setTrangthai(String trangthai) {
        this.trangthai = trangthai;
    }

    public String getMadotxethbkhoa() {
        return madotxethbkhoa;
    }

    public void setMadotxethbkhoa(String madotxethbkhoa) {
        this.madotxethbkhoa = madotxethbkhoa;
    }

    public String getMahoso() {
        return mahoso;
    }

    public void setMahoso(String mahoso) {
        this.mahoso = mahoso;
    }

    public String getManvxuly() {
        return manvxuly;
    }

    public void setManvxuly(String manvxuly) {
        this.manvxuly = manvxuly;
    }

    public String getPhanhoi() {
        return phanhoi;
    }

    public void setPhanhoi(String phanhoi) {
        this.phanhoi = phanhoi;
    }

    public Date getNgaygui() {
        return ngaygui;
    }

    public void setNgaygui(Date ngaygui) {
        this.ngaygui = ngaygui;
    }

}

