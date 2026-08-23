package com.nttt.pojo.entity;

import java.io.Serializable;

/**
 * (Lopsinhhoat)实体类
 *
 * @author makejava
 * @since 2026-08-24 00:38:11
 */
public class Lopsinhhoat implements Serializable {
    private static final long serialVersionUID = -52336396634154990L;

    private String malop;

    private String tenlop;

    private String khoahoc;

    private String makhoa;

    private String manganh;


    public String getMalop() {
        return malop;
    }

    public void setMalop(String malop) {
        this.malop = malop;
    }

    public String getTenlop() {
        return tenlop;
    }

    public void setTenlop(String tenlop) {
        this.tenlop = tenlop;
    }

    public String getKhoahoc() {
        return khoahoc;
    }

    public void setKhoahoc(String khoahoc) {
        this.khoahoc = khoahoc;
    }

    public String getMakhoa() {
        return makhoa;
    }

    public void setMakhoa(String makhoa) {
        this.makhoa = makhoa;
    }

    public String getManganh() {
        return manganh;
    }

    public void setManganh(String manganh) {
        this.manganh = manganh;
    }

}

