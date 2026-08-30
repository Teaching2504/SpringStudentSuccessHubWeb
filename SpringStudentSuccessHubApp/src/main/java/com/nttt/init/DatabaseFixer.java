package com.nttt.init;

import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
@Order(1)
public class DatabaseFixer implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    public DatabaseFixer(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) {
        try {
            jdbcTemplate.execute("ALTER TABLE nguoidung MODIFY COLUMN ho_ten VARCHAR(150) NULL DEFAULT NULL");
        } catch (Exception ignored) {}
        try {
            jdbcTemplate.execute("ALTER TABLE nguoidung MODIFY COLUMN ten_dang_nhap VARCHAR(100) NULL DEFAULT NULL");
        } catch (Exception ignored) {}
        try {
            jdbcTemplate.execute("ALTER TABLE nguoidung MODIFY COLUMN mat_khau VARCHAR(255) NULL DEFAULT NULL");
        } catch (Exception ignored) {}
        try {
            jdbcTemplate.execute("ALTER TABLE nguoidung MODIFY COLUMN vai_tro VARCHAR(50) NULL DEFAULT NULL");
        } catch (Exception ignored) {}
    }
}
