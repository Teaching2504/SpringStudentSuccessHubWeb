package com.nttt.services;

import com.nttt.dto.NguoiDungDTO;

import java.util.List;

public interface NguoiDungService {
    List<NguoiDungDTO> getAllUsers();
    NguoiDungDTO getUserById(Long id);
    NguoiDungDTO createUser(NguoiDungDTO dto);
    NguoiDungDTO updateUser(Long id, NguoiDungDTO dto);
    void deleteUser(Long id);
    void toggleUserStatus(Long id);
    void resetPassword(Long id, String newPassword);
}
