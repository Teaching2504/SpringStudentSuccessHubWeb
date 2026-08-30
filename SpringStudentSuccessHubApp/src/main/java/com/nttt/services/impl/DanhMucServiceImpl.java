package com.nttt.services.impl;

import com.nttt.pojo.HocKy;
import com.nttt.pojo.Khoa;
import com.nttt.pojo.LopSinhHoat;
import com.nttt.pojo.Nganh;
import com.nttt.repositories.HocKyRepository;
import com.nttt.repositories.KhoaRepository;
import com.nttt.repositories.LopSinhHoatRepository;
import com.nttt.repositories.NganhRepository;
import com.nttt.services.DanhMucService;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
public class DanhMucServiceImpl implements DanhMucService {

    private final KhoaRepository khoaRepository;
    private final NganhRepository nganhRepository;
    private final LopSinhHoatRepository lopSinhHoatRepository;
    private final HocKyRepository hocKyRepository;

    public DanhMucServiceImpl(KhoaRepository khoaRepository, NganhRepository nganhRepository, LopSinhHoatRepository lopSinhHoatRepository, HocKyRepository hocKyRepository) {
        this.khoaRepository = khoaRepository;
        this.nganhRepository = nganhRepository;
        this.lopSinhHoatRepository = lopSinhHoatRepository;
        this.hocKyRepository = hocKyRepository;
    }

    @Override
    public List<Khoa> getAllKhoa() {
        return khoaRepository.findAll();
    }

    @Override
    public Khoa getKhoaById(String maKhoa) {
        return khoaRepository.findById(maKhoa)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khoa: " + maKhoa));
    }

    @Override
    public Khoa createKhoa(Khoa khoa) {
        if (khoaRepository.existsById(khoa.getMaKhoa())) {
            throw new RuntimeException("Mã khoa đã tồn tại!");
        }
        return khoaRepository.save(khoa);
    }

    @Override
    public Khoa updateKhoa(String maKhoa, Khoa khoa) {
        Khoa existing = getKhoaById(maKhoa);
        existing.setTenKhoa(khoa.getTenKhoa());
        return khoaRepository.save(existing);
    }

    @Override
    public void deleteKhoa(String maKhoa) {
        khoaRepository.deleteById(maKhoa);
    }

    @Override
    public List<Nganh> getAllNganh() {
        return nganhRepository.findAll();
    }

    @Override
    public List<Nganh> getNganhByKhoa(String maKhoa) {
        return nganhRepository.findByKhoa_MaKhoa(maKhoa);
    }

    @Override
    public Nganh createNganh(String maKhoa, Nganh nganh) {
        Khoa khoa = getKhoaById(maKhoa);
        nganh.setKhoa(khoa);
        if (nganhRepository.existsById(nganh.getMaNganh())) {
            throw new RuntimeException("Mã ngành đã tồn tại!");
        }
        return nganhRepository.save(nganh);
    }

    @Override
    public Nganh updateNganh(String maNganh, Nganh nganh) {
        Nganh existing = nganhRepository.findById(maNganh)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy ngành: " + maNganh));
        existing.setTenNganh(nganh.getTenNganh());
        if (nganh.getHeDaoTao() != null) {
            existing.setHeDaoTao(nganh.getHeDaoTao());
        }
        return nganhRepository.save(existing);
    }

    @Override
    public void deleteNganh(String maNganh) {
        nganhRepository.deleteById(maNganh);
    }

    @Override
    public List<LopSinhHoat> getAllLop() {
        return lopSinhHoatRepository.findAll();
    }

    @Override
    public List<LopSinhHoat> getLopByKhoa(String maKhoa) {
        return lopSinhHoatRepository.findByKhoa_MaKhoa(maKhoa);
    }

    @Override
    public LopSinhHoat createLop(String maKhoa, String maNganh, LopSinhHoat lop) {
        Khoa khoa = getKhoaById(maKhoa);
        Nganh nganh = nganhRepository.findById(maNganh)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy ngành: " + maNganh));
        lop.setKhoa(khoa);
        lop.setNganh(nganh);
        if (lopSinhHoatRepository.existsById(lop.getMaLop())) {
            throw new RuntimeException("Mã lớp đã tồn tại!");
        }
        return lopSinhHoatRepository.save(lop);
    }

    @Override
    public LopSinhHoat updateLop(String maLop, LopSinhHoat lop) {
        LopSinhHoat existing = lopSinhHoatRepository.findById(maLop)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp: " + maLop));
        existing.setTenLop(lop.getTenLop());
        existing.setKhoaHoc(lop.getKhoaHoc());
        return lopSinhHoatRepository.save(existing);
    }

    @Override
    public void deleteLop(String maLop) {
        lopSinhHoatRepository.deleteById(maLop);
    }

    @Override
    public List<HocKy> getAllHocKy() {
        List<HocKy> list = hocKyRepository.findAll();
        // Sắp xếp thứ tự thời gian: Năm học -> Học kỳ 1 -> Học kỳ 2 -> Học kỳ 3
        list.sort(Comparator.comparingInt(this::getSemesterOrderKey));
        return list;
    }

    @Override
    public HocKy getHocKyById(String maHocKy) {
        return hocKyRepository.findById(maHocKy)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy học kỳ: " + maHocKy));
    }

    @Override
    public HocKy createHocKy(HocKy hocKy) {
        if (hocKyRepository.existsById(hocKy.getMaHocKy())) {
            throw new RuntimeException("Mã học kỳ đã tồn tại!");
        }
        return hocKyRepository.save(hocKy);
    }

    @Override
    public HocKy updateHocKy(String maHocKy, HocKy hocKy) {
        HocKy existing = getHocKyById(maHocKy);
        existing.setNamHoc(hocKy.getNamHoc());
        existing.setTenHocKy(hocKy.getTenHocKy());
        return hocKyRepository.save(existing);
    }

    @Override
    public void deleteHocKy(String maHocKy) {
        hocKyRepository.deleteById(maHocKy);
    }

    private int getSemesterOrderKey(HocKy hk) {
        if (hk == null) return 0;
        int hkNum = 1;
        String full = (hk.getMaHocKy() + " " + hk.getTenHocKy()).toUpperCase();
        if (full.contains("HK2") || full.contains("HỌC KỲ 2")) hkNum = 2;
        else if (full.contains("HK3") || full.contains("HỌC KỲ 3")) hkNum = 3;

        int startYear = 2023;
        String namHoc = hk.getNamHoc();
        if (namHoc != null && namHoc.length() >= 4) {
            try {
                startYear = Integer.parseInt(namHoc.substring(0, 4));
            } catch (Exception ignored) {}
        } else if (hk.getMaHocKy() != null) {
            for (String p : hk.getMaHocKy().split("_")) {
                if (p.length() == 4 && p.matches("\\d{4}")) {
                    try {
                        startYear = Integer.parseInt(p);
                        break;
                    } catch (Exception ignored) {}
                }
            }
        }
        return startYear * 10 + hkNum;
    }
}
