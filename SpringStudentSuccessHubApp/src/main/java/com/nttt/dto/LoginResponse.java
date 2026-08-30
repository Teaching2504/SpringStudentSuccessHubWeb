package com.nttt.dto;

public class LoginResponse {
    private String token;
    private String tokenType;
    private Long id;
    private String tenDangNhap;
    private String hoTen;
    private String email;
    private String vaiTro; // ROLE_ADMIN, ROLE_CAN_BO_TRUONG, ROLE_CAN_BO_KHOA, ROLE_SINH_VIEN
    private String maDinhDanh; // mssv hoặc maNv
    private String maKhoa;
    private String tenKhoa;
    private String maLop;

    public LoginResponse() {}

    public LoginResponse(String token, String tokenType, Long id, String tenDangNhap, String hoTen, String email, String vaiTro, String maDinhDanh, String maKhoa, String tenKhoa, String maLop) {
        this.token = token;
        this.tokenType = tokenType;
        this.id = id;
        this.tenDangNhap = tenDangNhap;
        this.hoTen = hoTen;
        this.email = email;
        this.vaiTro = vaiTro;
        this.maDinhDanh = maDinhDanh;
        this.maKhoa = maKhoa;
        this.tenKhoa = tenKhoa;
        this.maLop = maLop;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getTokenType() { return tokenType; }
    public void setTokenType(String tokenType) { this.tokenType = tokenType; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTenDangNhap() { return tenDangNhap; }
    public void setTenDangNhap(String tenDangNhap) { this.tenDangNhap = tenDangNhap; }

    public String getHoTen() { return hoTen; }
    public void setHoTen(String hoTen) { this.hoTen = hoTen; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getVaiTro() { return vaiTro; }
    public void setVaiTro(String vaiTro) { this.vaiTro = vaiTro; }

    public String getMaDinhDanh() { return maDinhDanh; }
    public void setMaDinhDanh(String maDinhDanh) { this.maDinhDanh = maDinhDanh; }

    public String getMaKhoa() { return maKhoa; }
    public void setMaKhoa(String maKhoa) { this.maKhoa = maKhoa; }

    public String getTenKhoa() { return tenKhoa; }
    public void setTenKhoa(String tenKhoa) { this.tenKhoa = tenKhoa; }

    public String getMaLop() { return maLop; }
    public void setMaLop(String maLop) { this.maLop = maLop; }

    public static LoginResponseBuilder builder() { return new LoginResponseBuilder(); }

    public static class LoginResponseBuilder {
        private String token;
        private String tokenType;
        private Long id;
        private String tenDangNhap;
        private String hoTen;
        private String email;
        private String vaiTro;
        private String maDinhDanh;
        private String maKhoa;
        private String tenKhoa;
        private String maLop;

        public LoginResponseBuilder token(String token) { this.token = token; return this; }
        public LoginResponseBuilder tokenType(String tokenType) { this.tokenType = tokenType; return this; }
        public LoginResponseBuilder id(Long id) { this.id = id; return this; }
        public LoginResponseBuilder tenDangNhap(String tenDangNhap) { this.tenDangNhap = tenDangNhap; return this; }
        public LoginResponseBuilder hoTen(String hoTen) { this.hoTen = hoTen; return this; }
        public LoginResponseBuilder email(String email) { this.email = email; return this; }
        public LoginResponseBuilder vaiTro(String vaiTro) { this.vaiTro = vaiTro; return this; }
        public LoginResponseBuilder maDinhDanh(String maDinhDanh) { this.maDinhDanh = maDinhDanh; return this; }
        public LoginResponseBuilder maKhoa(String maKhoa) { this.maKhoa = maKhoa; return this; }
        public LoginResponseBuilder tenKhoa(String tenKhoa) { this.tenKhoa = tenKhoa; return this; }
        public LoginResponseBuilder maLop(String maLop) { this.maLop = maLop; return this; }

        public LoginResponse build() {
            return new LoginResponse(token, tokenType, id, tenDangNhap, hoTen, email, vaiTro, maDinhDanh, maKhoa, tenKhoa, maLop);
        }
    }
}
