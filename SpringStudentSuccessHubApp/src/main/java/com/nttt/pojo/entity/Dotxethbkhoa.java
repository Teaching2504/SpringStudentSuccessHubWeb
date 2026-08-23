package com.nttt.pojo.entity;

import java.util.Date;
import java.io.Serializable;

/**
 * (Dotxethbkhoa)实体类
 *
 * @author makejava
 * @since 2026-08-24 00:38:10
 */
public class Dotxethbkhoa implements Serializable {
    private static final long serialVersionUID = 676356176722763622L;

    private String madotxethbkhoa;

    private String madot;

    private String makhoa;

    private Integer chitieu;

    private Double ngansachkhoa;

    private Date hanphanhoi;

    private String trangthai;

    private String lydotrave;


    public String getMadotxethbkhoa() {
        return madotxethbkhoa;
    }

    public void setMadotxethbkhoa(String madotxethbkhoa) {
        this.madotxethbkhoa = madotxethbkhoa;
    }

    public String getMadot() {
        return madot;
    }

    public void setMadot(String madot) {
        this.madot = madot;
    }

    public String getMakhoa() {
        return makhoa;
    }

    public void setMakhoa(String makhoa) {
        this.makhoa = makhoa;
    }

    public Integer getChitieu() {
        return chitieu;
    }

    public void setChitieu(Integer chitieu) {
        this.chitieu = chitieu;
    }

    public Double getNgansachkhoa() {
        return ngansachkhoa;
    }

    public void setNgansachkhoa(Double ngansachkhoa) {
        this.ngansachkhoa = ngansachkhoa;
    }

    public Date getHanphanhoi() {
        return hanphanhoi;
    }

    public void setHanphanhoi(Date hanphanhoi) {
        this.hanphanhoi = hanphanhoi;
    }

    public String getTrangthai() {
        return trangthai;
    }

    public void setTrangthai(String trangthai) {
        this.trangthai = trangthai;
    }

    public String getLydotrave() {
        return lydotrave;
    }

    public void setLydotrave(String lydotrave) {
        this.lydotrave = lydotrave;
    }

}

