package com.nttt.services;

import com.nttt.dto.HoSoHocBongDTO;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.util.List;
import java.util.Map;

public interface ExcelService {
    Map<String, Object> importStudentsFromExcel(MultipartFile file, String maHocKy);
    ByteArrayInputStream exportScholarshipAwardList(List<HoSoHocBongDTO> dossiers, String title);
}
