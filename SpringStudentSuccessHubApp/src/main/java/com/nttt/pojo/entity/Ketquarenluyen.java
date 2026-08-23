package com.nttt.pojo.entity;

import java.io.Serializable;

/**
 * (Ketquarenluyen)实体类
 *
 * @author makejava
 * @since 2026-08-24 00:38:11
 */
public class Ketquarenluyen implements Serializable {
    private static final long serialVersionUID = 956066064263645131L;

    private String id;

    private String mssv;

    private String mahocky;

    private Double diemrenluyen;

    private String xeploai;


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

    public Double getDiemrenluyen() {
        return diemrenluyen;
    }

    public void setDiemrenluyen(Double diemrenluyen) {
        this.diemrenluyen = diemrenluyen;
    }

    public String getXeploai() {
        return xeploai;
    }

    public void setXeploai(String xeploai) {
        this.xeploai = xeploai;
    }

}

