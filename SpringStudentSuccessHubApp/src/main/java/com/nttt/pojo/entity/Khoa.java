package com.nttt.pojo.entity;

import java.io.Serializable;

/**
 * (Khoa)实体类
 *
 * @author makejava
 * @since 2026-08-24 00:38:11
 */
public class Khoa implements Serializable {
    private static final long serialVersionUID = 794044984605507482L;

    private String makhoa;

    private String tenkhoa;


    public String getMakhoa() {
        return makhoa;
    }

    public void setMakhoa(String makhoa) {
        this.makhoa = makhoa;
    }

    public String getTenkhoa() {
        return tenkhoa;
    }

    public void setTenkhoa(String tenkhoa) {
        this.tenkhoa = tenkhoa;
    }

}

