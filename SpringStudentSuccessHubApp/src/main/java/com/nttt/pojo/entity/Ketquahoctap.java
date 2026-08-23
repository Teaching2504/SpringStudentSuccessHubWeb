package com.nttt.pojo.entity;

import java.io.Serializable;

/**
 * (Ketquahoctap)实体类
 *
 * @author makejava
 * @since 2026-08-24 00:38:11
 */
public class Ketquahoctap implements Serializable {
    private static final long serialVersionUID = -67208139225568002L;

    private String id;

    private String mssv;

    private String mahocky;

    private Double diemtrungbinh;

    private Integer sotinchi;

    private Integer cohocphanrot;


    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public Double getDiemtrungbinh() {
        return diemtrungbinh;
    }

    public void setDiemtrungbinh(Double diemtrungbinh) {
        this.diemtrungbinh = diemtrungbinh;
    }

    public Integer getSotinchi() {
        return sotinchi;
    }

    public void setSotinchi(Integer sotinchi) {
        this.sotinchi = sotinchi;
    }

    public Integer getCohocphanrot() {
        return cohocphanrot;
    }

    public void setCohocphanrot(Integer cohocphanrot) {
        this.cohocphanrot = cohocphanrot;
    }

}

