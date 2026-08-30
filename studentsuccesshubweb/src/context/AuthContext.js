import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('oussh_user');
    const token = localStorage.getItem('oussh_token');

    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('oussh_user');
        localStorage.removeItem('oussh_token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (tenDangNhap, matKhau) => {
    try {
      const res = await axiosClient.post('/api/auth/login', { tenDangNhap, matKhau });
      if (res.data && res.data.success) {
        const userData = res.data.data;
        localStorage.setItem('oussh_token', userData.token);
        localStorage.setItem('oussh_user', JSON.stringify(userData));
        setUser(userData);
        return { success: true, user: userData };
      } else {
        return { success: false, message: res.data?.message || 'Đăng nhập không thành công' };
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Tên đăng nhập hoặc mật khẩu không chính xác';
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('oussh_token');
    localStorage.removeItem('oussh_user');
    setUser(null);
    window.location.href = '/login';
  };

  const refreshUser = async () => {
    try {
      const res = await axiosClient.get('/api/auth/me');
      if (res.data && res.data.success && res.data.data) {
        localStorage.setItem('oussh_user', JSON.stringify(res.data.data));
        setUser(res.data.data);
      }
    } catch (e) {
      console.error('Failed to refresh user info', e);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
