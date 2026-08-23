package com.nttt.pojo.entity;

import java.io.Serializable;

/**
 * (Hocky)实体类
 *
 * @author makejava
 * @since 2026-08-24 00:38:10
 */
public class Hocky implements Serializable {
    private static final long serialVersionUID = 476652992033872792L;

    private String mahocky;

    private String namhoc;

    private String tenhocky;


    public String getMahocky() {
        return mahocky;
    }

    public void setMahocky(String mahocky) {
        this.mahocky = mahocky;
    }

    public String getNamhoc() {
        return namhoc;
    }

    public void setNamhoc(String namhoc) {
        this.namhoc = namhoc;
    }

    public String getTenhocky() {
        return tenhocky;
    }

    public void setTenhocky(String tenhocky) {
        this.tenhocky = tenhocky;
    }

}

