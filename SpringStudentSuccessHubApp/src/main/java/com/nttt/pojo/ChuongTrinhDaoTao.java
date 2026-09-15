package com.nttt.pojo;

import jakarta.persistence.*;

@Entity
@Table(name = "chuongtrinhdaotao")
public class ChuongTrinhDaoTao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "maNganh", nullable = false)
    private Nganh nganh;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "maMon", nullable = false)
    private MonHoc monHoc;

    @Column(name = "hocKyGoiY", nullable = false)
    private Integer hocKyGoiY;

    @Column(name = "loaiHocPhan", length = 30)
    private String loaiHocPhan;

    @Column(name = "chuyenNganh", length = 50)
    private String chuyenNganh;

    @Column(name = "nhomTuChon", length = 50)
    private String nhomTuChon;

    @Column(name = "heDaoTao", length = 50)
    private String heDaoTao;

    public ChuongTrinhDaoTao() {}

    public ChuongTrinhDaoTao(Long id, Nganh nganh, MonHoc monHoc, Integer hocKyGoiY, String loaiHocPhan, String chuyenNganh, String nhomTuChon, String heDaoTao) {
        this.id = id;
        this.nganh = nganh;
        this.monHoc = monHoc;
        this.hocKyGoiY = hocKyGoiY;
        this.loaiHocPhan = loaiHocPhan;
        this.chuyenNganh = chuyenNganh;
        this.nhomTuChon = nhomTuChon;
        this.heDaoTao = heDaoTao;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Nganh getNganh() { return nganh; }
    public void setNganh(Nganh nganh) { this.nganh = nganh; }

    public MonHoc getMonHoc() { return monHoc; }
    public void setMonHoc(MonHoc monHoc) { this.monHoc = monHoc; }

    public Integer getHocKyGoiY() { return hocKyGoiY; }
    public void setHocKyGoiY(Integer hocKyGoiY) { this.hocKyGoiY = hocKyGoiY; }

    public String getLoaiHocPhan() { return loaiHocPhan; }
    public void setLoaiHocPhan(String loaiHocPhan) { this.loaiHocPhan = loaiHocPhan; }

    public String getChuyenNganh() { return chuyenNganh; }
    public void setChuyenNganh(String chuyenNganh) { this.chuyenNganh = chuyenNganh; }

    public String getNhomTuChon() { return nhomTuChon; }
    public void setNhomTuChon(String nhomTuChon) { this.nhomTuChon = nhomTuChon; }

    public String getHeDaoTao() { return heDaoTao; }
    public void setHeDaoTao(String heDaoTao) { this.heDaoTao = heDaoTao; }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private Nganh nganh;
        private MonHoc monHoc;
        private Integer hocKyGoiY;
        private String loaiHocPhan;
        private String chuyenNganh;
        private String nhomTuChon;
        private String heDaoTao;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder nganh(Nganh nganh) { this.nganh = nganh; return this; }
        public Builder monHoc(MonHoc monHoc) { this.monHoc = monHoc; return this; }
        public Builder hocKyGoiY(Integer hocKyGoiY) { this.hocKyGoiY = hocKyGoiY; return this; }
        public Builder loaiHocPhan(String loaiHocPhan) { this.loaiHocPhan = loaiHocPhan; return this; }
        public Builder chuyenNganh(String chuyenNganh) { this.chuyenNganh = chuyenNganh; return this; }
        public Builder nhomTuChon(String nhomTuChon) { this.nhomTuChon = nhomTuChon; return this; }
        public Builder heDaoTao(String heDaoTao) { this.heDaoTao = heDaoTao; return this; }

        public ChuongTrinhDaoTao build() {
            return new ChuongTrinhDaoTao(id, nganh, monHoc, hocKyGoiY, loaiHocPhan, chuyenNganh, nhomTuChon, heDaoTao);
        }
    }
}
