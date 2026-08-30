package com.nttt.dto;

import jakarta.validation.constraints.NotBlank;

public class RunRuleEngineRequest {
    @NotBlank(message = "Mã đợt xét theo khoa không được để trống")
    private String maDotXetHbKhoa;

    public RunRuleEngineRequest() {}

    public RunRuleEngineRequest(String maDotXetHbKhoa) {
        this.maDotXetHbKhoa = maDotXetHbKhoa;
    }

    public String getMaDotXetHbKhoa() { return maDotXetHbKhoa; }
    public void setMaDotXetHbKhoa(String maDotXetHbKhoa) { this.maDotXetHbKhoa = maDotXetHbKhoa; }
}
