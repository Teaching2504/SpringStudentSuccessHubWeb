package com.nttt.pojo.entity;

import java.io.Serializable;

/**
 * (Nganh)实体类
 *
 * @author makejava
 * @since 2026-08-24 00:38:11
 */
public class Nganh implements Serializable {
    private static final long serialVersionUID = 597325901986402973L;

    private String manganh;

    private String tennganh;

    private String hedaotao;

    private String makhoa;


    public String getManganh() {
        return manganh;
    }

    public void setManganh(String manganh) {
        this.manganh = manganh;
    }

    public String getTennganh() {
        return tennganh;
    }

    public void setTennganh(String tennganh) {
        this.tennganh = tennganh;
    }

    public String getHedaotao() {
        return hedaotao;
    }

    public void setHedaotao(String hedaotao) {
        this.hedaotao = hedaotao;
    }

    public String getMakhoa() {
        return makhoa;
    }

    public void setMakhoa(String makhoa) {
        this.makhoa = makhoa;
    }

}

