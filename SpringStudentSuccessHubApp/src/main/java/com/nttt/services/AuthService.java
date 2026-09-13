package com.nttt.services;

import com.nttt.dto.ChangePasswordRequest;
import com.nttt.dto.LoginRequest;
import com.nttt.dto.LoginResponse;

import org.springframework.web.multipart.MultipartFile;

public interface AuthService {
    LoginResponse login(LoginRequest request);
    void changePassword(String username, ChangePasswordRequest request);
    LoginResponse getCurrentUserInfo(String username);
    LoginResponse updateAvatar(String username, MultipartFile file);
}
