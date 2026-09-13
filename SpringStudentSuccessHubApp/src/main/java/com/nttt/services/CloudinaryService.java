package com.nttt.services;

import org.springframework.web.multipart.MultipartFile;
import java.util.Map;

public interface CloudinaryService {
    String uploadAvatar(MultipartFile file, String username);
    String uploadEvidence(MultipartFile file, String mssv);
    Map<String, Object> uploadFile(MultipartFile file, String folder);
    void deleteFile(String publicId);
}
