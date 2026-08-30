package com.nttt.services;

import com.nttt.dto.DashboardStatsDTO;

public interface ThongKeService {
    DashboardStatsDTO getGlobalDashboardStats();
    DashboardStatsDTO getFacultyDashboardStats(String maKhoa);
}
