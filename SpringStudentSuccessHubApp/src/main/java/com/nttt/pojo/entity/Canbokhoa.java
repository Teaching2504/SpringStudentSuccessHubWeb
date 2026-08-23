package com.nttt.pojo.entity;

import java.io.Serializable;

/**
 * (Canbokhoa)实体类
 *
 * @author makejava
 * @since 2026-08-24 00:38:10
 */
public class Canbokhoa implements Serializable {
    private static final long serialVersionUID = 577753600198222967L;

    private String manv;

    private String makhoa;

    private String lopphutrach;

    private String trangthaicongtac;


    public String getManv() {
        return manv;
    }

    public void setManv(String manv) {
        this.manv = manv;
    }

    public String getMakhoa() {
        return makhoa;
    }

    public void setMakhoa(String makhoa) {
        this.makhoa = makhoa;
    }

    public String getLopphutrach() {
        return lopphutrach;
    }

    public void setLopphutrach(String lopphutrach) {
        this.lopphutrach = lopphutrach;
    }

    public String getTrangthaicongtac() {
        return trangthaicongtac;
    }

    public void setTrangthaicongtac(String trangthaicongtac) {
        this.trangthaicongtac = trangthaicongtac;
    }

}

