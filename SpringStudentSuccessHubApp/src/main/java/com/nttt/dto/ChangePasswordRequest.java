package com.nttt.dto;

import jakarta.validation.constraints.NotBlank;

public class ChangePasswordRequest {
    @NotBlank(message = "Mật khẩu cũ không được để trống")
    private String matKhauCu;

    @NotBlank(message = "Mật khẩu mới không được để trống")
    private String matKhauMoi;

    public ChangePasswordRequest() {}

    public ChangePasswordRequest(String matKhauCu, String matKhauMoi) {
        this.matKhauCu = matKhauCu;
        this.matKhauMoi = matKhauMoi;
    }

    public String getMatKhauCu() { return matKhauCu; }
    public void setMatKhauCu(String matKhauCu) { this.matKhauCu = matKhauCu; }

    public String getMatKhauMoi() { return matKhauMoi; }
    public void setMatKhauMoi(String matKhauMoi) { this.matKhauMoi = matKhauMoi; }
}
