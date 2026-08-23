package com.nttt.pojo.entity;

import java.io.Serializable;

/**
 * (Hosohocbong)实体类
 *
 * @author makejava
 * @since 2026-08-24 00:38:11
 */
public class Hosohocbong implements Serializable {
    private static final long serialVersionUID = 952528912280492161L;

    private String mahoso;

    private String mssv;

    private String madotxethbkhoa;

    private Double diemxet;

    private Integer thuhang;

    private String loaihocbong;

    private Double muchocbong;

    private String trangthai;


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

    public String getMadotxethbkhoa() {
        return madotxethbkhoa;
    }

    public void setMadotxethbkhoa(String madotxethbkhoa) {
        this.madotxethbkhoa = madotxethbkhoa;
    }

    public Double getDiemxet() {
        return diemxet;
    }

    public void setDiemxet(Double diemxet) {
        this.diemxet = diemxet;
    }

    public Integer getThuhang() {
        return thuhang;
    }

    public void setThuhang(Integer thuhang) {
        this.thuhang = thuhang;
    }

    public String getLoaihocbong() {
        return loaihocbong;
    }

    public void setLoaihocbong(String loaihocbong) {
        this.loaihocbong = loaihocbong;
    }

    public Double getMuchocbong() {
        return muchocbong;
    }

    public void setMuchocbong(Double muchocbong) {
        this.muchocbong = muchocbong;
    }

    public String getTrangthai() {
        return trangthai;
    }

    public void setTrangthai(String trangthai) {
        this.trangthai = trangthai;
    }

}

