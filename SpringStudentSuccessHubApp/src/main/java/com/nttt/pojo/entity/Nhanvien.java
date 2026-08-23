package com.nttt.pojo.entity;

import java.io.Serializable;

/**
 * (Nhanvien)实体类
 *
 * @author makejava
 * @since 2026-08-24 00:38:11
 */
public class Nhanvien implements Serializable {
    private static final long serialVersionUID = -98185691650114982L;

    private String manv;

    private Long nguoidungid;

    private String chucvu;

    private String donvicongtac;


    public String getManv() {
        return manv;
    }

    public void setManv(String manv) {
        this.manv = manv;
    }

    public Long getNguoidungid() {
        return nguoidungid;
    }

    public void setNguoidungid(Long nguoidungid) {
        this.nguoidungid = nguoidungid;
    }

    public String getChucvu() {
        return chucvu;
    }

    public void setChucvu(String chucvu) {
        this.chucvu = chucvu;
    }

    public String getDonvicongtac() {
        return donvicongtac;
    }

    public void setDonvicongtac(String donvicongtac) {
        this.donvicongtac = donvicongtac;
    }

}

