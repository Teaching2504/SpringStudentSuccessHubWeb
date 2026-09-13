package com.nttt.controllers;

import com.nttt.dto.ApiResponse;
import com.nttt.dto.ChangePasswordRequest;
import com.nttt.dto.LoginRequest;
import com.nttt.dto.LoginResponse;
import com.nttt.services.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {
        try {
            LoginResponse response = authService.login(request);
            return ResponseEntity.ok(ApiResponse.ok("Đăng nhập thành công", response));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ApiResponse.error(ex.getMessage()));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<LoginResponse>> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Chưa xác thực"));
        }
        LoginResponse response = authService.getCurrentUserInfo(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse<String>> changePassword(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ChangePasswordRequest request
    ) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Chưa xác thực"));
        }
        try {
            authService.changePassword(userDetails.getUsername(), request);
            return ResponseEntity.ok(ApiResponse.ok("Đổi mật khẩu thành công", null));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ApiResponse.error(ex.getMessage()));
        }
    }

    @PostMapping(value = "/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<LoginResponse>> uploadAvatar(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("file") MultipartFile file
    ) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Chưa xác thực"));
        }
        try {
            LoginResponse response = authService.updateAvatar(userDetails.getUsername(), file);
            return ResponseEntity.ok(ApiResponse.ok("Cập nhật ảnh đại diện thành công", response));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ApiResponse.error(ex.getMessage()));
        }
    }
}
