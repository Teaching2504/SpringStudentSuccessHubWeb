package com.nttt.pojo.entity;

import java.io.Serializable;

/**
 * (Canbocaptruong)实体类
 *
 * @author makejava
 * @since 2026-08-24 00:38:09
 */
public class Canbocaptruong implements Serializable {
    private static final long serialVersionUID = 147396089314695179L;

    private String manv;

    private String phongban;

    private String cappheduyet;


    public String getManv() {
        return manv;
    }

    public void setManv(String manv) {
        this.manv = manv;
    }

    public String getPhongban() {
        return phongban;
    }

    public void setPhongban(String phongban) {
        this.phongban = phongban;
    }

    public String getCappheduyet() {
        return cappheduyet;
    }

    public void setCappheduyet(String cappheduyet) {
        this.cappheduyet = cappheduyet;
    }

}

