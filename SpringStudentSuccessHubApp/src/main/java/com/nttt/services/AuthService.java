package com.nttt.services;

import com.nttt.dto.ChangePasswordRequest;
import com.nttt.dto.LoginRequest;
import com.nttt.dto.LoginResponse;

public interface AuthService {
    LoginResponse login(LoginRequest request);
    void changePassword(String username, ChangePasswordRequest request);
    LoginResponse getCurrentUserInfo(String username);
}
