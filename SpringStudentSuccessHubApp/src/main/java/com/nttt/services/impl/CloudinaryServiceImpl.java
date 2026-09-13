package com.nttt.services.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.nttt.services.CloudinaryService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryServiceImpl implements CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryServiceImpl(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    @Override
    public String uploadAvatar(MultipartFile file, String username) {
        try {
            String sanitizedUsername = (username != null ? username : "user").replaceAll("[^a-zA-Z0-9_.-]", "_");
            Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                    "folder", "oussh/avatars",
                    "public_id", "avatar_" + sanitizedUsername + "_" + System.currentTimeMillis(),
                    "overwrite", true,
                    "resource_type", "image"
            ));
            return (String) uploadResult.get("secure_url");
        } catch (IOException e) {
            throw new RuntimeException("Lỗi tải ảnh đại diện lên Cloudinary: " + e.getMessage(), e);
        }
    }

    @Override
    public String uploadEvidence(MultipartFile file, String mssv) {
        try {
            String sanitizedMssv = (mssv != null ? mssv : "student").replaceAll("[^a-zA-Z0-9_.-]", "_");
            Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                    "folder", "oussh/evidence",
                    "public_id", "evidence_" + sanitizedMssv + "_" + System.currentTimeMillis(),
                    "resource_type", "auto"
            ));
            return (String) uploadResult.get("secure_url");
        } catch (IOException e) {
            throw new RuntimeException("Lỗi tải tệp minh chứng lên Cloudinary: " + e.getMessage(), e);
        }
    }

    @Override
    public Map<String, Object> uploadFile(MultipartFile file, String folder) {
        try {
            String targetFolder = (folder != null && !folder.isBlank()) ? "oussh/" + folder : "oussh/general";
            @SuppressWarnings("unchecked")
            Map<String, Object> uploadResult = (Map<String, Object>) cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                    "folder", targetFolder,
                    "resource_type", "auto"
            ));
            return uploadResult;
        } catch (IOException e) {
            throw new RuntimeException("Lỗi tải tệp lên Cloudinary: " + e.getMessage(), e);
        }
    }

    @Override
    public void deleteFile(String publicId) {
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (IOException e) {
            throw new RuntimeException("Lỗi xóa tệp trên Cloudinary: " + e.getMessage(), e);
        }
    }
}
