package com.nttt.services;

import com.nttt.pojo.HocKy;
import com.nttt.pojo.Khoa;
import com.nttt.pojo.LopSinhHoat;
import com.nttt.pojo.Nganh;

import java.util.List;

public interface DanhMucService {
    // Khoa
    List<Khoa> getAllKhoa();
    Khoa getKhoaById(String maKhoa);
    Khoa createKhoa(Khoa khoa);
    Khoa updateKhoa(String maKhoa, Khoa khoa);
    void deleteKhoa(String maKhoa);

    // Nganh
    List<Nganh> getAllNganh();
    List<Nganh> getNganhByKhoa(String maKhoa);
    Nganh createNganh(String maKhoa, Nganh nganh);
    Nganh updateNganh(String maNganh, Nganh nganh);
    void deleteNganh(String maNganh);

    // LopSinhHoat
    List<LopSinhHoat> getAllLop();
    List<LopSinhHoat> getLopByKhoa(String maKhoa);
    LopSinhHoat createLop(String maKhoa, String maNganh, LopSinhHoat lop);
    LopSinhHoat updateLop(String maLop, LopSinhHoat lop);
    void deleteLop(String maLop);

    // HocKy
    List<HocKy> getAllHocKy();
    HocKy getHocKyById(String maHocKy);
    HocKy createHocKy(HocKy hocKy);
    HocKy updateHocKy(String maHocKy, HocKy hocKy);
    void deleteHocKy(String maHocKy);
}
