package com.nttt.controllers;

import com.nttt.dto.ApiResponse;
import com.nttt.services.CloudinaryService;
import com.nttt.services.FileStorageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/common")
public class UploadController {

    private final CloudinaryService cloudinaryService;
    private final FileStorageService fileStorageService;

    public UploadController(CloudinaryService cloudinaryService, FileStorageService fileStorageService) {
        this.cloudinaryService = cloudinaryService;
        this.fileStorageService = fileStorageService;
    }

    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<Map<String, String>>> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            String fileUrl;
            try {

                Map<String, Object> uploadResult = cloudinaryService.uploadFile(file, "evidence");
                fileUrl = (String) uploadResult.get("secure_url");
            } catch (Exception cloudEx) {

                fileUrl = fileStorageService.storeFile(file);
            }
            Map<String, String> data = new HashMap<>();
            data.put("url", fileUrl);
            data.put("originalName", file.getOriginalFilename());
            return ResponseEntity.ok(ApiResponse.ok("Tải tệp lên thành công", data));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
